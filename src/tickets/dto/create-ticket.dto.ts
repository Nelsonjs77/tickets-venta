import { Type } from "class-transformer";
import { ArrayNotEmpty, IsNumber, IsString, Max, Min, ValidateNested } from "class-validator";
import { ValidationMessages } from "src/Helpers/validation.messages.helper";

export class CreateTicketDto {
    @ArrayNotEmpty({message: ValidationMessages.BASE_VACIA})
    @ValidateNested({each: true})
    @Type(() => productInTicketDto)
    products: productInTicketDto[];
}

export class productInTicketDto{
    @IsString({message: ValidationMessages.ES_NUMERO})
    id: string;
    @IsNumber({allowNaN: false}, {message: ValidationMessages.ES_NUMERO})
    cantidad: number;
}
