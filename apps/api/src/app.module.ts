import { Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PigsModule } from './pigs/pigs.module';
import { UsersModule } from './users/users.module';
import { VacunasModule } from './vacunas/vacunas.module';
import { AuthModule } from './auth/auth.module';
import { UsersService } from './users/users.service';

@Module({
  imports: [
    // 1️⃣ Config primero
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV
        ? `.env.${process.env.NODE_ENV}.local`
        : `.env.development.local`,
    }),

    // 2️⃣ Mongoose después
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>('MONGO_URL');
        if (!uri) {
          throw new Error('MONGO_URL no está definido en tu archivo de entorno!');
        }
        console.log(`Mongo uri: ${uri}`);
        return { uri };
      },
    }),

    // 3️⃣ Módulos de la app
    PigsModule,
    UsersModule,
    VacunasModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly usersService: UsersService) {}

  async onModuleInit() {
    await this.usersService.createAdminIfNotExists();
  }
}
