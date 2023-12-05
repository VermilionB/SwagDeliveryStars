import { Injectable } from '@nestjs/common';
import {PrismaService} from "../prisma.service";

@Injectable()
export class KeysService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.keys.findMany();
  }

  findOne(id: number) {
    return this.prisma.keys.findUnique({
      where: {
        id
      }
    });
  }

  remove(id: number) {
    return this.prisma.keys.delete({
      where: {
        id
      }
    });
  }
}
