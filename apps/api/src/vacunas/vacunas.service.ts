import { Injectable, NotFoundException, BadRequestException, ConflictException, HttpStatus } from '@nestjs/common';
import { CreateVacunaDto } from './dto/create-vacuna.dto';
import { UpdateVacunaDto } from './dto/update-vacuna.dto';
import { Vacuna } from './schema/vacuna.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class VacunasService {
    constructor(
    @InjectModel(Vacuna.name)
    private readonly vacunaModel: Model<Vacuna>,
  ) {}

  async create(createVacunaDto: CreateVacunaDto):Promise<Vacuna> {
    try {
      const newVacuna = new this.vacunaModel(createVacunaDto); 
      return await newVacuna.save();
    } catch (error) {
      console.log(error)
      if (error.code === 11000) {
              throw new ConflictException('El nombre ya existe!');
            }
      throw new BadRequestException ('Error al crear la vacuna')
    }
  }

  async findAll():Promise<Vacuna[]> {
    const vacunas= (await this.vacunaModel.find().sort({createdAt:-1}).exec());
    try {
      return vacunas
    } catch (error) {
      console.log(error)
      throw new Error
    }
  }

  async findVacunaById(id:string):Promise<Vacuna> {
    const vacuna= await this.vacunaModel.findById(id).exec()
    if (!vacuna) throw new NotFoundException(`No se encontraron vacunas con ese ${id}`)
    try {
      return vacuna
    } catch (error) {
      console.log(error)      
      throw new Error
    }
  }

  async update(id: string, updateVacunaDto: UpdateVacunaDto):Promise<Vacuna> {
    const vacunaUpdate = await this.vacunaModel.findByIdAndUpdate(id, updateVacunaDto).exec()
    if (!vacunaUpdate) throw new NotFoundException(`No se encontraron vacunas con ese ${id}`)
    try {
      vacunaUpdate.save()
      return vacunaUpdate
    } catch (error) {
      console.log(error)
      throw new Error
    }
  }

  async remove(id: string) {
    const vacuna = await this.vacunaModel.findById(id)
    if (!vacuna) throw new NotFoundException(`No se encontraron vacunas con ese ${id}`)
    try {
      await this.vacunaModel.findByIdAndDelete(vacuna._id)
      return { status: HttpStatus.OK, message: 'Vacuna eliminada correctamente' }
      
    } catch (error) {
      console.log(error)
      throw new Error
    }
  }
  /* async addImg(id:string){
    const vacuna = await this.vacunaModel.findById(id)
    if (!vacuna) throw new NotFoundException(`No se encontraron vacunas con ese ${id}`)
    try {
      
    } catch (error) {
      
    }
  } */
  
}
