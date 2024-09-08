import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepository {

  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) { }

  async findByUsername(userName: string): Promise<User | null> {
    return await this.repository.findOne({ where: { userName } });
  }

}
