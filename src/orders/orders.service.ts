import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { Model } from 'mongoose';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private productService: ProductsService,
  ) {}
  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const productResult = await this.productService.findOne(
      createOrderDto.productId,
    );
    if (!productResult) throw new NotFoundException('Product not found');
    const order = new this.orderModel(createOrderDto);
    return order.save();
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel.find().populate('productId').exec();
  }

  async findOne(id: string): Promise<Order> {
    const result = this.orderModel.findById(id).populate('productId').exec();
    return result;
  }
}
