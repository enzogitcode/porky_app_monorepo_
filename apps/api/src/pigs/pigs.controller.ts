import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  NotFoundException,
  Query,
  HttpStatus,
  HttpCode
} from '@nestjs/common';
import { PigsService } from './pigs.service';
import { CreatePigDto, ParicionDto } from './dto/create-pig.dto';
import { Pig } from './schema/pigs.schema';

@Controller('pigs')
export class PigsController {
  constructor(private readonly pigsService: PigsService) { }

  //crear pig
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createPigDto: CreatePigDto): Promise<Pig> {
    return this.pigsService.create(createPigDto);
  }
  //obtener todos los pigs
  @Get()
  async getPigs(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.pigsService.findAll(Number(page), Number(limit));
  }

  //obtener servidas o gestación
  @Get("servidas-gestacion")
  async findServidasOGestacion() {
    return this.pigsService.findServidasOGestacion();
  }

  //obtener un pig por id
  @Get(':id')
  async findById(@Param('id') id: string): Promise<Pig> {
    return await this.pigsService.findById(id);
  }
  //obtener un pig por caravana
  @Get('caravana/:nroCaravana')
  async findByCaravana(@Param('nroCaravana') nroCaravana: string): Promise<Pig> {
    const pig = await this.pigsService.findByCaravana(Number(nroCaravana));
    return pig
  }

  //editar cerdo (excepto pariciones)
  @Patch(':id')
  async updatePig(
    @Param('id') pigId: string,
    @Body() updatePigDto: Partial<CreatePigDto>
  ): Promise<Pig> {
    return this.pigsService.updatePig(pigId, updatePigDto);
  }
  //borrar cerdo
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Pig> {
    const pig = await this.pigsService.remove(id);
    if (!pig) throw new NotFoundException(`Pig with id ${id} not found`);

    return pig;
  }

  // 1️⃣ Agregar nueva parición
  @Post(':id/pariciones')
  async addParicion(
    @Param('id') pigId: string,
    @Body() paricionDto: ParicionDto
  ): Promise<Pig> {
    return this.pigsService.addParicion(pigId, paricionDto);
  }
  // 2️⃣ Actualizar parición existente
  @Patch(':id/pariciones/:paricionId')
  async updateParicion(
    @Param('id') pigId: string,
    @Param('paricionId') paricionId: string,
    @Body() updateData: Partial<ParicionDto>
  ): Promise<Pig> {
    return this.pigsService.updateParicion(pigId, paricionId, updateData);
  }
  // 3️⃣ Eliminar parición
  @Delete(':id/pariciones/:paricionId')
  async removeParicion(
    @Param('id') pigId: string,
    @Param('paricionId') paricionId: string
  ): Promise<Pig> {
    return this.pigsService.removeParicion(pigId, paricionId);
  }


  //Vacunas
  @Patch(':id/addvacuna/:vacunaId')
  async addVacuna(
    @Param('id') pigId: string,
    @Param('vacunaId') vacunaId: string,
    @Body() body: { fechaVacunacion: Date }
  ): Promise<Pig> {
    return this.pigsService.addVacuna(pigId, {
      vacuna: vacunaId,
      fechaVacunacion: body.fechaVacunacion,
    });
  }
  @Patch(':id/removevacuna/:vacunaId')
  async removeVacuna(
    @Param('id') pigId: string,
    @Param('vacunaId') vacunaId: string
  ): Promise<Pig> {
    return this.pigsService.removeVacuna(pigId, vacunaId);
  }

}
