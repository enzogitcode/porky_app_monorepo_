import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '../common/enums/roles.enums';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ unique: true, required: true })
  username: string;

  @Prop({ enum: Role, default: Role.USER })
  role: Role;

  @Prop({ required: true })
  pin: string; // 🔒 PIN HASHEADO

  @Prop()
  refreshToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
