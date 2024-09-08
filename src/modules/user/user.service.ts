import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from 'src/database/entities/user';

@Injectable()
export class UserService {

    constructor(private readonly userRepository: UserRepository) { }

    async findByUsername(username: string): Promise<User> {
        let result = await this.userRepository.findByUsername(username);
        result = result ?? new User();

        return result;
    }

}
