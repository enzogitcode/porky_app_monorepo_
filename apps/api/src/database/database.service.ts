import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongoClient } from 'mongodb';

@Injectable()
export class DatabaseService {
  private client: MongoClient;

  constructor(private configService: ConfigService) {
    // Obtenemos la URL de Mongo desde ConfigService
    const mongoUrl = this.configService.get<string>('Mongo_URL');
    this.client = new MongoClient(mongoUrl);
    console.log(`MongoDB URL: ${mongoUrl}`);
  }

  async connect() {
    await this.client.connect();
    console.log('Conectado a MongoDB en', this.configService.get<string>('database.mongoUrl'));
  }
}
