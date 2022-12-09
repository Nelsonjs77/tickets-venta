import { IsString, IsNumber } from "class-validator";
import { ValidationMessages } from "src/Helpers/validation.messages.helper";

export class UpdateProductoDto {
    @IsString({message: ValidationMessages.ES_CADENA + '$property'})
    nombre: string;
    @IsNumber()
    precio: number;
}
