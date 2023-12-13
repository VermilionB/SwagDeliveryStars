import {HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import {UsersService} from "../users/users.service";
import {UpdateUserDto} from "../users/dto/update-user.dto";
import * as argon2 from 'argon2';
import {JwtService} from "@nestjs/jwt";
import * as jwt from 'jsonwebtoken';
import {config} from "rxjs";
import {ConfigService} from "@nestjs/config";


@Injectable()
export class AuthService {
    constructor(private userService: UsersService,
                private jwtService: JwtService,
                private configService: ConfigService) {
    }

    async login(userDto: UpdateUserDto) {
        const user = await this.validateUser(userDto)
        return this.generateToken(user)
    }

    async registration(userDto: UpdateUserDto, file?: Express.Multer.File) {
        const candidate = await this.userService.getUserByEmail(userDto.email);
        if (candidate) {
            throw new HttpException('User with such email already exists', HttpStatus.BAD_REQUEST);
        }
        const user = await this.userService.create({...userDto}, file)
        return this.generateToken(user)
    }

    private async generateToken(user: any) {
        const payload = {email: user.email, id: user.id, role: user.role_id}
        return {
            token: this.jwtService.sign(payload)
        }
    }

    private async validateUser(userDto: UpdateUserDto) {
        const user = await this.userService.getUserByEmail(userDto.email);
        if (user) {
            const passwordEquals = await argon2.verify(user.password, userDto.password)
            if (passwordEquals) {
                return user;
            } else {
                throw new UnauthorizedException({message: 'Incorrect password confirmation'})
            }
        }
        throw new UnauthorizedException({message: 'Incorrect password entered'})
    }

    async check(req) {
        if (req.method === 'OPTIONS') {
            return;
        }

        try {
            const token = req.headers.authorization?.split(' ')[1];
            // if (token === 'null') {
            //     throw new UnauthorizedException()
            // }

            req.user = this.jwtService.verify(token)
            const payload = {email: req.user.email, id: req.user.id, role: req.user.role_id}
            return {
                token: this.jwtService.sign(payload)
            }
        } catch (err) {
            console.error(err)
        }
    }
}
