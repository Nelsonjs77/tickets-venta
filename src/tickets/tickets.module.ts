import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { ProductosModule } from 'src/productos/productos.module';

@Module({
  controllers: [TicketsController],
  providers: [TicketsService],
  imports: [ProductosModule]
})
export class TicketsModule {}
