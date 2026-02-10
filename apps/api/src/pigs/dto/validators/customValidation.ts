import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { Situacion } from '../create-pig.dto';

export function SumNotExceed(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'sumNotExceed',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          if (value == null || relatedValue == null) return true; // si alguno no está, no validamos
          return value + relatedValue <= 10; // o el máximo que quieras
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `${args.property} + ${relatedPropertyName} no puede superar el máximo permitido`;
        },
      },
    });
  };
}

// Decorador custom
export function IsValidEstadio(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidEstadio',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const pig = args.object as any;
          // Si hay pariciones y el estadio es nulípara => inválido
          if (pig.pariciones && pig.pariciones.length > 0 && value === Situacion.NULIPARA) {
            return false;
          }
          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return 'Un cerdo con pariciones no puede tener estadio "nulípara"';
        },
      },
    });
  };
}
