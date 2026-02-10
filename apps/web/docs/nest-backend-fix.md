Guía rápida: logueo y manejo de duplicados para `nroCaravana` (Nest + Mongoose)

Contexto
- El frontend muestra "nroCaravana ya existe (error backend)" pero en la consola de Nest puede no aparecer el stack.
- Aquí hay pasos y snippets para añadir logging y lanzar una `ConflictException` cuando la base de datos devuelva un error de duplicado (11000).

1) Servicio (ejemplo con Mongoose)

```ts
// pigs.service.ts
import { Injectable, ConflictException, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePigDto } from './dto/create-pig.dto';
import { PigDocument } from './schemas/pig.schema';

@Injectable()
export class PigsService {
  private readonly logger = new Logger(PigsService.name);
  constructor(@InjectModel('Pig') private pigModel: Model<PigDocument>) {}

  async create(createPigDto: CreatePigDto) {
    try {
      const created = await this.pigModel.create(createPigDto);
      return created;
    } catch (err: any) {
      // Mongoose duplicate key error code
      if (err?.code === 11000) {
        this.logger.error('Duplicate key error creating pig', err);
        // opcional: mostrar fields duplicados
        this.logger.error('Duplicate fields: ' + JSON.stringify(err.keyValue));
        throw new ConflictException('nroCaravana ya existe (error backend)');
      }

      // Loguear stack para errores inesperados
      this.logger.error(err?.stack ?? err);
      throw new InternalServerErrorException('Error creando cerdo');
    }
  }
}
```

2) Controlador (ejemplo mínimo)

```ts
// pigs.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { PigsService } from './pigs.service';
import { CreatePigDto } from './dto/create-pig.dto';

@Controller('pigs')
export class PigsController {
  constructor(private readonly pigsService: PigsService) {}

  @Post()
  create(@Body() createPigDto: CreatePigDto) {
    return this.pigsService.create(createPigDto);
  }
}
```

3) Global exception filter (opcional pero útil para ver stacks)

```ts
// filters/all-exceptions.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    this.logger.error('Unhandled exception', (exception as any)?.stack ?? exception);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: (exception as any)?.message ?? 'Internal server error',
    });
  }
}
```

En `main.ts` registrar el filtro global:

```ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(4000);
}
```

4) Índice único en Mongoose

Asegúrate de que el schema tenga el índice único:

```ts
// pig.schema.ts
import { Schema, Document } from 'mongoose';

export const PigSchema = new Schema({
  nroCaravana: { type: Number, unique: true, required: true },
  // ... otros campos
});

// opcionalmente crear el índice explícitamente
PigSchema.index({ nroCaravana: 1 }, { unique: true });
```

Si ya existe la colección sin índice único y quieres agregarlo:

- En mongo shell o mongosh:

```js
use tu_basedatos
db.pigs.createIndex({ nroCaravana: 1 }, { unique: true })
```

- Para buscar duplicados antes de crear el índice:

```js
db.pigs.aggregate([
  { $group: { _id: "$nroCaravana", count: { $sum: 1 }, docs: { $push: "$_id" } } },
  { $match: { count: { $gt: 1 } } }
])
```

5) Comprobación desde cliente (curl) para reproducir

```bash
curl -v -X POST http://localhost:4000/pigs \
  -H 'Content-Type: application/json' \
  -d '{"nroCaravana": 123, "estadio": "nulipara"}'
```

6) Qué mirar en DevTools (cliente)
- Network → filtrar por `POST /pigs` → ver Request payload (JSON) y Response (status + body). Copia la respuesta completa.
- Console → ver los `console.log` añadidos en `Register.tsx`: `Payload crear cerdo:` y `Respuesta crear cerdo:`.

7) Nota sobre mensajes: El backend puede devolver `409 Conflict` con `message` en el body; si el backend no loguea el error explícitamente, el mensaje sigue llegando al cliente pero no verás el stack en Nest. Añadir `logger.error(...)` en el catch o usar el filtro global soluciona eso.

Si quieres, preparo un PR/patch para aplicar estas modificaciones en tu repositorio backend si me das acceso a ese código; de lo contrario aplica los snippets manualmente y dime los logs que obtengas.
