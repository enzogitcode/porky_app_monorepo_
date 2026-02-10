import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Pig, PigDocument } from './schema/pigs.schema';
import { CreatePigDto, ParicionDto, VacunaAplicadaDto } from './dto/create-pig.dto';
import { UpdatePigDto } from './dto/update-pig.dto';
import { VacunasService } from 'src/vacunas/vacunas.service';

@Injectable()
export class PigsService {
  constructor(
    @InjectModel(Pig.name) private pigModel: Model<PigDocument>,
    private readonly vacunasService: VacunasService,
  ) {}

  // -------------------------------
  // Crear un cerdo
  // -------------------------------
  async create(createPigDto: CreatePigDto): Promise<Pig> {
    const pig = new this.pigModel({
      ...createPigDto,
    })

    try {
      return await pig.save();
    } catch (err: any) {
      // Código 11000 = duplicado en índice único
      if (err.code === 11000) {
        throw new BadRequestException('Error: Ya existe un cerdo con ese número de caravana.');
      }
      throw err;
    }
  }

  // -------------------------------
  // Eliminar un cerdo
  // -------------------------------
  async remove(id: string): Promise<Pig> {
    const pig = await this.pigModel.findByIdAndDelete(id);
    if (!pig) throw new NotFoundException(`No se encontró el cerdo con id ${id}`);
    return pig;
  }

  // -------------------------------
  // Listar cerdos con paginación
  // -------------------------------
  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const pigs = await this.pigModel.find().sort({ updatedAt: -1 }).skip(skip).limit(limit).exec();
    const total = await this.pigModel.countDocuments();
    return {
      data: pigs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  // -------------------------------
  // Buscar cerdo por ID con vacunas pobladas
  // -------------------------------
  async findById(id: string): Promise<Pig> {
    const pig = await this.pigModel.findById(id).populate('vacunasAplicadas.vacuna');
    if (!pig) throw new NotFoundException(`No se encontró el cerdo con id ${id}`);
    return pig;
  }

  // -------------------------------
  // Buscar cerdo por caravana
  // -------------------------------
  async findByCaravana(nroCaravana: number): Promise<Pig> {
    const pig = await this.pigModel.findOne({ nroCaravana }).populate('vacunasAplicadas.vacuna');
    if (!pig) throw new NotFoundException(`No se encontró el cerdo con la caravana ${nroCaravana}`);
    return pig;
  }

  // -------------------------------
  // Actualizar cerdo
  // -------------------------------
  async updatePig(pigId: string, updatePigDto: UpdatePigDto): Promise<Pig> {
    const pig = await this.pigModel.findById(pigId);
    if (!pig) throw new NotFoundException(`No se encontró el cerdo con id ${pigId}`);

    // Convertir fechaServicioActual a Date si existe
    if (updatePigDto.fechaServicioActual) {
      updatePigDto.fechaServicioActual = new Date(updatePigDto.fechaServicioActual);
    }

    // Calcular posible fecha de parto
    const estadio = updatePigDto.estadio ?? pig.estadio;
    const fechaServicio = updatePigDto.fechaServicioActual ?? pig.fechaServicioActual;
    if (fechaServicio && ['servida', 'gestación confirmada'].includes(estadio)) {
      const inicio = new Date(fechaServicio);
      const fin = new Date(fechaServicio);
      inicio.setDate(inicio.getDate() + 111);
      fin.setDate(fin.getDate() + 119);
      updatePigDto.posibleFechaParto = { inicio, fin };
    } else {
      updatePigDto.posibleFechaParto = undefined;
    }

    Object.assign(pig, updatePigDto);
    return pig.save();
  }

  // -------------------------------
  // Buscar cerdas servidas o en gestación
  // -------------------------------
  async findServidasOGestacion(): Promise<Pig[]> {
    return this.pigModel.find({
      estadio: { $in: ['servida', 'gestación confirmada'] },
    }).sort({ fechaServicioActual: 1 }).exec();
  }

  // -------------------------------
  // Pariciones
  // -------------------------------
  async addParicion(pigId: string, paricion: ParicionDto): Promise<Pig> {
    const pig = await this.pigModel.findByIdAndUpdate(
      pigId,
      { $push: { pariciones: paricion } },
      { new: true },
    );
    if (!pig) throw new NotFoundException(`No se encontró el cerdo con id ${pigId}`);
    return pig;
  }

  async updateParicion(pigId: string, paricionId: string, updateData: Partial<ParicionDto>): Promise<Pig> {
    const pig = await this.pigModel.findOneAndUpdate(
      { _id: pigId, 'pariciones._id': paricionId },
      { $set: { 'pariciones.$': updateData } },
      { new: true },
    );
    if (!pig) throw new NotFoundException(`No se encontró la parición con id ${paricionId}`);
    return pig;
  }

  async removeParicion(pigId: string, paricionId: string): Promise<Pig> {
    const pig = await this.pigModel.findByIdAndUpdate(
      pigId,
      { $pull: { pariciones: { _id: paricionId } } },
      { new: true },
    );
    if (!pig) throw new NotFoundException(`No se encontró el cerdo con id ${pigId}`);
    return pig;
  }

  // -------------------------------
  // Vacunas
  // -------------------------------
  async addVacuna(pigId: string, data: VacunaAplicadaDto): Promise<Pig> {
    await this.vacunasService.findVacunaById(data.vacuna);

    const pig = await this.pigModel.findByIdAndUpdate(
      pigId,
      {
        $push: {
          vacunasAplicadas: {
            vacuna: new Types.ObjectId(data.vacuna),
            fechaVacunacion: new Date(data.fechaVacunacion),
          },
        },
      },
      { new: true },
    );
    if (!pig) throw new NotFoundException(`No se encontró el cerdo con id ${pigId}`);
    return pig;
  }

  async removeVacuna(pigId: string, vacunaAplicadaId: string): Promise<Pig> {
    const pig = await this.pigModel.findByIdAndUpdate(
      pigId,
      { $pull: { vacunasAplicadas: { _id: vacunaAplicadaId } } },
      { new: true },
    );
    if (!pig) throw new NotFoundException(`No se encontró el cerdo con id ${pigId}`);
    return pig;
  }

  // -------------------------------
  // Revisar índices (para debug)
  // -------------------------------
  async revisarIndices() {
    try {
      const indexes = await this.pigModel.collection.indexes();
      console.log('Índices actuales:', indexes);
      return indexes;
    } catch (err: any) {
      // Si la colección no existe, intentar crearla para evitar el error
      if (err?.message?.includes('ns not found')) {
        console.warn('Colección de cerdos no encontrada. Intentando crear la colección...');
        try {
          await this.pigModel.createCollection();
          const indexes = await this.pigModel.collection.indexes();
          console.log('Colección creada. Índices:', indexes);
          return indexes;
        } catch (e: any) {
          console.error('Error creando la colección de cerdos:', e.message);
          return [];
        }
      }
      throw err;
    }
  }

  // -------------------------------
  // Eliminar índice único (para desarrollo si da error 11000)
  // -------------------------------
  async eliminarIndice(nombreIndice: string) {
    try {
      await this.pigModel.collection.dropIndex(nombreIndice);
      console.log(`Índice '${nombreIndice}' eliminado correctamente.`);
    } catch (err: any) {
      if (err?.message?.includes('ns not found')) {
        console.error(`No se pudo eliminar índice: la colección no existe (${err.message}).`);
        return;
      }
      console.error(`Error eliminando índice '${nombreIndice}':`, err.message);
    }
  }

  // -------------------------------
  // Duplicados: listar y limpiar
  // -------------------------------
  async findDuplicates() {
    // Agrupación por nroCaravana con más de 1 ocurrencia
    const pipeline = [
      { $group: { _id: '$nroCaravana', count: { $sum: 1 }, ids: { $push: '$_id' } } },
      { $match: { _id: { $ne: null }, count: { $gt: 1 } } },
      { $project: { nroCaravana: '$_id', count: 1, ids: 1, _id: 0 } },
    ];
    return this.pigModel.aggregate(pipeline).exec();
  }

  async listDuplicateDocs(nroCaravana: number) {
    return this.pigModel.find({ nroCaravana }).sort({ createdAt: 1 }).exec();
  }

  async previewDuplicates(nroCaravana: number) {
    const docs = await this.pigModel.find({ nroCaravana }).sort({ createdAt: 1 }).lean().exec();
    if (!docs || docs.length === 0) return { nroCaravana, count: 0, keep: null, toRemove: [], docs: [] };
    if (docs.length === 1) return { nroCaravana, count: 1, keep: docs[0]._id, toRemove: [], docs };

    const keep = docs[0]._id;
    const toRemove = docs.slice(1).map(d => d._id);
    return { nroCaravana, count: docs.length, keep, toRemove, docs };
  }

  async removeDuplicatesKeepOne(nroCaravana: number) {
    const docs = await this.pigModel.find({ nroCaravana }).sort({ createdAt: 1 }).exec();
    if (!docs || docs.length <= 1) return { removed: 0 };

    // Mantener el primer documento (más antiguo) y eliminar el resto
    const toRemove = docs.slice(1).map(d => d._id);
    const res = await this.pigModel.deleteMany({ _id: { $in: toRemove } });
    return { removed: res.deletedCount || 0 };
  }

  async createUniqueIndexNroCaravana() {
    try {
      await this.pigModel.collection.createIndex({ nroCaravana: 1 }, { unique: true, name: 'nroCaravana_1' });
      return { ok: true };
    } catch (err: any) {
      return { ok: false, message: err.message };
    }
  }
}
