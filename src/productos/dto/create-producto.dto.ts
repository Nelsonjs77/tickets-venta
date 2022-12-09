import { IsString, IsNumber, Length } from "class-validator";
import { ValidationMessages } from "src/Helpers/validation.messages.helper";

export class CreateProductoDto {
    @IsString({message: ValidationMessages.ES_CADENA})
    @Length(5, 50, {message: ValidationMessages.TAMAÑO_CADENA})
    nombre: string;
    @IsNumber({allowNaN: false}, {message: ValidationMessages.ES_NUMERO})
    precio: number;
}

