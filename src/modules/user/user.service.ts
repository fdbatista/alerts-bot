import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UserRepository } from './user.repository';
import { User } from 'src/database/entities/user';

@Injectable()
export class UserService {

    constructor(private readonly userRepository: UserRepository) { }

    async findOne(username: string): Promise<User | null> {
        return this.userRepository.findByUsername(username);
    }

    async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(plainPassword, hashedPassword);
    }

}
