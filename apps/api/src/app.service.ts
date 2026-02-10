import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
    constructor(private configService: ConfigService) { }
    getPort () {
return this.configService.get<number>('port')
    }
    getMongoURL () {
      return this.configService.get<string>('Mongo_URL')
    }
      
    
    getHello(): string {
      return 'Hello World!';
    }
  }
