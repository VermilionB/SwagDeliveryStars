import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import { OrdersService } from './orders.service';
import {CreateOrderDto} from "./dto/create-order.dto";

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(@Body() dto: CreateOrderDto){
    return await this.ordersService.createOrder(dto)
  }

  @Get('/orders/:consumerId')
  async getOrdersByUser(@Param('consumerId') consumerId: string) {
    return await this.ordersService.getOrdersByUser(consumerId);
  }

  @Get('/sales/:sellerId')
  async getSalesByUser(@Param('sellerId') sellerId: string) {
    return await this.ordersService.getSalesByUser(sellerId);
  }

}
