<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

#

# API REST para Tickets de Venta con NestJS
## Descripción
Ejercicio para la implementacion de un api que gestione tickets de venta de productos mediante un API REST con NestJS.


## Instalación
1. Clone el repositorio.

2. Ingrese al directorio *tickets-venta*

3. Ejecute el siguiente comando:
    ```bash
    $ yarn run start:dev
    ```

## Conexion con mongoDB

1. Cree en la raiz del proyecto un el archivo: *docker-compose.yaml* y agregue lo siguiente:

    ```bash
    # version del documeto
    version: '3'
    # servicios que expone docker compose
    services:
      # db es el servicio de mongoDB
      db:
        # imagen que se descargara para el servicio
        image: mongo:5 
        # en caso de error que se reinicie el contenedor siempre
        restart: always 
        # puertos para intercambio de informacion (izquierdo computadora, derecho contenedor)
        ports: 
          - 27017:27017
        #Seccion de variables de entorno (se ocupa para configuraciones)
        environment:
          #Agregamos la configuracion de la BD que manejara el contenedor
          MONGODB_DATABASE: tickets-venta
        #Los volumenes son para persisit en disco duro la info de los contenedores (izquierda computadora, derecha contenedor)
        volumes:
          - ./mongo:/data/db
    ```

2. Ejecute el siguiente comando para generar el contenedor:
    ```bash
    # -d es para ejecutar el comando desligado de la terminal
    docker-compose up -d
    ```

3. Conectese a mongoDB con el gestor de su preferencia. Aqui se muestra un ejemplo con la extension [*mongo runner*](https://marketplace.visualstudio.com/items?itemName=JoeyYiZhao.mongo-runner)

    3.1 Instale la extension.

    3.2 Presione ```ctrl+shift+p``` y esriba en la barra de busqueda: *Preferences: Open User Settings(JSON)* y presione ```enter```

    3.3 Agregue la siguiente configuracion en el archivo JSON:
    ```javascript
      "mongoRunner": {
          "connections": [
              {
                  "name": "tickets-venta",
                  "url": "mongodb://localhost:27017/tickets-venta"
              }
          ]
      } 
    ```

    3.4 Verifique en el explorador de proyectos que tenga la entrada de *mongo runner*

## Conectar MongoDB con NestJS (Basico)

1. Instale el paquete de [*mongoose*](https://docs.nestjs.com/techniques/mongodb):
    ```bash
     yarn add @nestjs/mongoose mongoose
    ```

2. Vaya al archivo `app.module`
    ```javascript
    @Module({
      imports: [
        //Agrega esta linea
          MongooseModule.forRoot('mongodb://localhost:27017/tickets-venta'),
          ProductsModule, 
          TicketsModule],
      controllers: [AppController],
      providers: [AppService],
      })
    export class AppModule {}
    ```

3. Implemente un esquema para la entidad de productos, dentro de la carpeta de *entities*, en el recurso *products*, cree el archivo: `product.entity.mongo.ts` y agregue el siguiente codigo:

    ```javascript
    import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
    import { Document } from "mongoose";

    //la clase se decora como un schema de mongo
    @Schema()
    export class ProductM extends Document{ //extiende de la calse document
        
        // id: string -> se omite, lo da mongo
        
        //decoradores para la propiedad (existen mas, ver doc.)
        @Prop({
            unique: true,
            index: true,
        })
        descripcion: string;
        
        @Prop()
        precio: number;
    }

    //esta exportacion permite ligar el esquema al modulo en el siguiente paso
    export const ProductSchema = SchemaFactory.createForClass(ProductM);
    ```

4. Vaya al archivo `products.module.ts` y agregue la importación correspondiente para enlazar su esquema de mongo con el modulo correspondiente, el codigo deberia quedar asi:

    ```javascript
    import { Module } from '@nestjs/common';
    import { MongooseModule } from '@nestjs/mongoose';
    import { ProductsService } from './products.service';
    import { ProductsController } from './products.controller';
    import { ProductM, ProductSchema } from './entities/product.entitty.mongo';

    @Module({
      controllers: [ProductsController],
      providers: [ProductsService],
      exports:[ProductsService],
      imports:[//Agregar estas lineas
        MongooseModule.forFeature([
          {
            name: ProductM.name,
            schema: ProductSchema
          }
        ])
      ]
    })
    export class ProductsModule {}
    ```
## Guardar un producto en BD

1. Vaya al archivo `products.service.ts` e inyecte la dependencia en el constructor de la clase el modelo o schema de mongo creado en el paso anterior, el codigo deberia verse asi:

    ```javascript
    import { v4 as uuid } from 'uuid';
    import { Model } from 'mongoose';

    import { InjectModel } from '@nestjs/mongoose';
    import { Injectable, NotFoundException } from '@nestjs/common';

    import { CreateProductDto } from './dto/create-product.dto';
    import { UpdateProductDto } from './dto/update-product.dto';
    import { ProductM } from './entities/product.entitty.mongo';
    import { Product } from './entities/product.entity';

    @Injectable()
    export class ProductsService {

      constructor(
        @InjectModel(ProductM.name) //Se decora y se pasa el nombre del modelo
        private readonly productModel : Model<ProductM> //Manejo de genericos
      ) {}

      //demas codigo fuente . . .
    ```

2. En el mismo archivo cree una nueva funcion `create` para hacer uso del modelo de mongo y guardar productos en la base de datos, **comente el codigo anterior que ocupaba para guardar datos en memoria** ,el codigo deberia verse asi:
    ```javascript
      // create(createProductDto: CreateProductDto) {
      //   const product: Product = {
      //     id: uuid(),
      //     ...createProductDto
      //   }
      //   this.products.push(product);
      //   return product;
      // }

      //agregue esta nueva funcion
      async create(createProductDto: CreateProductDto) {
        const product = await this.productModel.create(createProductDto);
        return product;
      }
    ```
3. Vaya a ```thunder client``` y pruebe el endpoint del *post*, deberia ver algo como esto:

    ```json
    {
      "descripcion": "Nuevo producto",
      "precio": 99,
      "_id": "63499bf108c93ab240ff8fc6",
      "__v": 0
    }
    ```
## Listar los productos de la BD
1. Cree una copia de la funcion ```findAll()```, comente la primera y haga las modificaciones en la segunda para que se vea asi:
    ```javascript
     // findAll() {
    //   return this.products;
    // }

    findAll() {
      return this.productModel.find().exec();
    }
    ```
2. Vaya a ```thunder client``` y pruebe el endpoint, deberia tener un resultado como este:
    ```json
    [
      {
        "_id": "6345e6b48eb08843e57ee1fd",
        "descripcion": "Galletas",
        "precio": 19,
        "__v": 0
      },
      {
        "_id": "6345fc2af696275842e56eb2",
        "descripcion": "Referesco",
        "precio": 25,
        "__v": 0
      },
      {
        "_id": "6345fcd1f696275842e56eb4",
        "descripcion": "Cereal",
        "precio": 99,
        "__v": 0
      },
      {
        "_id": "63499bf108c93ab240ff8fc6",
        "descripcion": "Nuevo producto",
        "precio": 99,
        "__v": 0
      }
    ]
    ``` 

## Tarea: Siga los pasos anteriores para hacer la implementacion de tickets y documentelo en este archivo
## Creditos

- Author - [Jorge E Gonzalez Diaz](https://kamilmysliwiec.com)
- Website - [https://nestjs.com]( https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## Licencia

Nest is [MIT licensed](LICENSE).
