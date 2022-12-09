export class GetTicketDto{
    folio: string;
    fecha: string;
    productos: TicketProductsDto[];
    total: number;

}

export class TicketProductsDto{
    cantidad: number;
    nombre: string;
    precio: number;
    subtotal: number;
}