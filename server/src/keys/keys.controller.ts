import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { KeysService } from './keys.service';
import {PrismaService} from "../prisma.service";
@Controller('keys')
export class KeysController {
  constructor(private readonly keysService: KeysService) {}
  @Get()
  findAll() {
    return this.keysService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.keysService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.keysService.remove(+id);
  }
}
