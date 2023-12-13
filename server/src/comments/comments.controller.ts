import {Body, Controller, Param, Post, UseGuards} from '@nestjs/common';
import { CommentsService } from './comments.service';
import {Role} from "../auth/enum/roles.enum";
import {AuthGuard} from "@nestjs/passport";
import {Roles, RolesGuard} from "../auth/decorators/auth.decorator";
import {CurrentUser} from "../auth/decorators/user.decorator";
import {CreateCommentDto} from "./dto/create-comment.dto";

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Admin, Role.Producer)
  @Post('/create/:beatId')
  async createComment(@Body() dto: CreateCommentDto, @CurrentUser('id') userId: string, @Param('beatId') beatId: string) {
    return this.commentsService.createComment(dto, beatId, userId)
  }
}
