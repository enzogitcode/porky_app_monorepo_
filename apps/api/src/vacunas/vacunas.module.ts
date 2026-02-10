import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { VacunasService } from './vacunas.service';
import { VacunasController } from './vacunas.controller';
import { Vacuna, VacunaSchema } from './schema/vacuna.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Vacuna.name, schema: VacunaSchema },
    ]),
  ],
  controllers: [VacunasController],
  providers: [VacunasService],
  exports:[VacunasService]
})
export class VacunasModule {}
