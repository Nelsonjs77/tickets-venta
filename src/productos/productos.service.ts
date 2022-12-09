import { Injectable, NotFoundException, ParseUUIDPipe} from '@nestjs/common';
import { ValidationMessages } from 'src/Helpers/validation.messages.helper';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Producto } from './entities/producto.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProductosService {

  arrProducts : Producto[] = [
    {
      id: "bed1fd26-d050-45c2-ac86-5f67175511dc",
      nombre: 'Galletas',
      precio: 15
    },
    {
      id: uuidv4(),
      nombre: 'Refresco',
      precio: 20
    }
  ]

  create(createProductoDto: CreateProductoDto) {
    //Creamos nuestra entidad con los datos del from
    const productoItem : Producto = {
      id: uuidv4(),
      nombre: createProductoDto.nombre, //..createProductoDto Destructuracion
      precio: createProductoDto.precio
    };
     //Guardamos nuestro objeto en "BD"
     this.arrProducts.push(productoItem)


    return (createProductoDto);
  }

  findAll() {
    return this.arrProducts;
  }

  findOne(id: string) {
    console.log("IMPRIMIR:");
    this.arrProducts.forEach(x => {
      console.log(x);
      
    });
    
    const productoItem = this.arrProducts.find( item => item.id === id )
    console.log(id);
    
    if(!productoItem){
      throw new NotFoundException(ValidationMessages.ElEMENTO_NO_ENCONTRADO);
    }
    return productoItem;
  }

  update(id: string, updateProductoDto: UpdateProductoDto) {
    let productDB = this.findOne(id);

    if (!productDB)
    throw new NotFoundException(ValidationMessages.ElEMENTO_NO_ENCONTRADO);

    this.arrProducts = this.arrProducts.map(item => {
      if (item.id === id) {
        productDB = {
          id: id,
          ...productDB, ...updateProductoDto
        };
        return productDB;
      } else {
        return item;
      }
    })

    return productDB;

  }

  remove(id: string) {
    this.arrProducts = this.arrProducts.filter( x => x.id !== id);
  }
}


