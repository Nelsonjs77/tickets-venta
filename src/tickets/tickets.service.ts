import { Injectable, NotFoundException } from '@nestjs/common';
import { ValidationMessages } from 'src/Helpers/validation.messages.helper';
import { ProductosService } from 'src/productos/productos.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { GetTicketDto, TicketProductsDto } from './dto/get-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TicketsService {

  arrTicket: GetTicketDto[]= [];

  constructor(
    private readonly productsService: ProductosService
  ){}

  create(createTicketDto: CreateTicketDto) {
    //Este es el ticket que le damos al cliente
    let createTicket: GetTicketDto = new GetTicketDto();
    //Inicializamos el arreglo de productos del ticket
    createTicket.productos = [];
    //Variable para calcular el total del ticket
    let totalTicket = 0;
    //Ahora iteramos el arreglo que nos envio el front
    createTicketDto.products.forEach(element =>{
      console.log(element);
      //buscamos el producto en la BD para asegurar que existe y calcular subtotal
      let productItem = this.productsService.findOne(element.id);
      //si no existe mandamos una exepcion y termina el request
        if(!productItem){
          throw new NotFoundException(ValidationMessages.ElEMENTO_NO_EXISTE);
        }
      //Creamos una variable para ponerla en el ticket
      let productInTicket: TicketProductsDto

      //Agregamos cada producto vendido al arreglo del ticket
      createTicket.productos.push({
        ...element,
        ...productItem,
        subtotal: (productItem.precio * element.cantidad)
      });
      totalTicket += productItem.precio * element.cantidad
  

    });
    //Agregamos las propiedades que le faltan al ticket
    createTicket.folio = uuidv4();
    createTicket.fecha = new Date().toLocaleDateString(),
    createTicket.total = totalTicket

    this.arrTicket.push(createTicket);
  }

  findAll() {
    return this.arrTicket;
  }

  findOne(folio: string) {
    const ticketBuscado = this.arrTicket.find( item => item.folio === folio)
    if(!ticketBuscado){
      throw new NotFoundException(ValidationMessages.ElEMENTO_NO_ENCONTRADO);
    }
    return ticketBuscado;
  }

  update(id: number, updateTicketDto: UpdateTicketDto) {
    return `This action updates a #${id} ticket`;
  }

  remove(id: number) {
    return `This action removes a #${id} ticket`;
  }
}
