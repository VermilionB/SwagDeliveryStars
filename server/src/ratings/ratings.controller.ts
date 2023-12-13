import {Body, Controller, Get, Param, Post, UseGuards} from '@nestjs/common';
import { RatingsService } from './ratings.service';
import {CreateRatingDto} from "./dto/create-rating.dto";
import {CurrentUser} from "../auth/decorators/user.decorator";
import {AuthGuard} from "@nestjs/passport";
import {Roles, RolesGuard} from "../auth/decorators/auth.decorator";
import {Role} from "../auth/enum/roles.enum";

@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Admin, Role.Producer)
  @Post('/create/:beatId')
  async createRating(@Body() dto: CreateRatingDto, @CurrentUser('id') userId: string, @Param('beatId') beatId: string) {
    return this.ratingsService.createRating(dto, userId, beatId)
  }

  @Get('/user/:userId/beat/:beatId')
  async getRatingByUserAndBeat(@Param('beatId') beatId: string, @Param('userId') userId: string) {
    return this.ratingsService.getRatingByUserAndBeat(beatId, userId)

  }
}
