import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './schema/users.schema';

@Module({
  imports: [
    // 👇 AQUÍ se registra UserModel
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // 👈 se exporta el SERVICE, no el módulo
})
export class UsersModule {}
