import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/database/entities/user';
import { LoginRequestDto } from './dto/login-request.dto';

import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) { }

    async login(dto: LoginRequestDto) {
        const user = await this.userService.findByUsername(dto.username);

        if (Number.isInteger(user.id) && this.validatePassword(dto.password, user.password)) {
            return this.signToken(user);
        }

        throw new UnauthorizedException('Invalid credentials');
    }

    signToken(user: User) {
        const payload = {
            username: user.userName,
            sub: user.id
        };

        return {
            token: this.jwtService.sign(payload),
        };
    }

    private validatePassword(plainPassword: string, hashedPassword: string): boolean {
        return bcrypt.compareSync(plainPassword, hashedPassword);
    }
}
