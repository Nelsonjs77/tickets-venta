import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductosModule } from './productos/productos.module';
import { TicketsModule } from './tickets/tickets.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost:27017/tickets-venta'),
  ProductosModule, 
  TicketsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
