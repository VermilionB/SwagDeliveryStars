import { Injectable } from '@nestjs/common';
import {CreateOrderDto} from "./dto/create-order.dto";
import {PrismaService} from "../prisma.service";
import {v4 as uuidv7} from 'uuid';

@Injectable()
export class OrdersService {
    constructor(readonly prisma: PrismaService) {}

    async createOrder(dto: CreateOrderDto){
        // const existingOrder = await this.prisma.order_history.findFirst({
        //     where:
        // })

        return this.prisma.order_history.create({
            data: {
                id: uuidv7(),
                seller_id: dto.seller,
                consumer_id: dto.consumer,
                purchase_date: new Date(),
                license_id: dto.license,
                beat_id: dto.beat
            }
        })
    }

    async getAllOrders() {
        return this.prisma.order_history.findMany()
    }

    async getOrdersByUser(userId: string) {
        return this.prisma.order_history.findMany({
            where: {
                consumer_id: userId
            },
            select: {
                id: true,
                users_order_history_seller_idTousers: {
                    select: {
                        username: true
                    }
                },
                users_order_history_consumer_idTousers: {
                    select: {
                        username: true
                    }
                },
                beats: {
                    include: {
                        genres: true,
                        keys: true,
                        beat_files: true
                    }
                },
                purchase_date: true,
                licenses: {
                    select: {
                        license_types: true,
                        price: true
                    },
                }
            }
        })
    }

    async getSalesByUser(userId: string) {
        return this.prisma.order_history.findMany({
            where: {
                seller_id: userId
            },
            select: {
                id: true,
                users_order_history_seller_idTousers: {
                    select: {
                        username: true
                    }
                },
                users_order_history_consumer_idTousers: {
                    select: {
                        username: true
                    }
                },
                beats: {
                    select: {
                        name: true
                    }
                },
                purchase_date: true,
                licenses: {
                    select: {
                        license_types: {
                            select: {
                                license_type: true
                            }
                        },
                        price: true
                    },
                }
            }
        })


    }

}
