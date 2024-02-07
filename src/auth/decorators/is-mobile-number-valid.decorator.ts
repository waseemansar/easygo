import { ValidationArguments, ValidationOptions, registerDecorator } from 'class-validator';

export function IsMobileNumberValid(validationOptions?: ValidationOptions) {
    return function (object: unknown, propertyName: string) {
        registerDecorator({
            name: 'isMobileNumberValid',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: string) {
                    return /^\+\d{12}$/.test(value);
                },
                defaultMessage(args: ValidationArguments) {
                    return `${args.property} must be in the format '+971XXXXXXXXX'`;
                },
            },
        });
    };
}
