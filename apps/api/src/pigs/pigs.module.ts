import { Module } from '@nestjs/common';
import { PigsService } from './pigs.service';
import { PigsController } from './pigs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Pig, PigSchema } from './schema/pigs.schema'
import { VacunasModule } from 'src/vacunas/vacunas.module';

@Module({
  imports: [MongooseModule.forFeature([
    {
      name: Pig.name,
      schema: PigSchema
    },
  ]),
    VacunasModule],

  controllers: [PigsController],
  providers: [PigsService],
})
export class PigsModule { }
