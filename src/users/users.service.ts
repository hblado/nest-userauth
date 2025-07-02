import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';

const rounds: number = 10;  

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {

  }

  /**
   * Creates an user using its DTO
   * @param {CreateUserDto} createUserDto
   * @returns 
   */
  async create(
    createUserDto: CreateUserDto,
  ): Promise<User> {
    const userData =
      await this.userRepository.create(
        createUserDto,
      );
      userData.password = await bcrypt.hash(userData.password, rounds)
    return this.userRepository.save(userData);
  }

  /**
   * Get info from all users
   * @returns 
   */
  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const userData =
      await this.userRepository.findOneBy({ id });
    if (!userData) {
      throw new HttpException(
        'User Not Found',
        404,
      );
    }
    return userData;
  }

  /**
   * Changes a user password, only if you know its old password
   * @param {number} id Selects user id
   * @param {string} oldPassword Confirm the old password
   * @param {string} newPassword Confirm the new password
   */
  async changePassword(id: number, oldPassword: string, newPassword: string) {
    const user = await this.userRepository
    .createQueryBuilder('user')
    .addSelect('user.password') //loads password bc its marked as 'select: false' in DTO
    .where('user.id = :id', { id })
    .getOne();

    if(!user) throw new HttpException({message: 'User not found'}, HttpStatus.NOT_FOUND)
    
    const confirmOldPassword: boolean = await bcrypt.compare(oldPassword, user.password)

    if(!confirmOldPassword) throw new HttpException({message: 'Wrong old password'}, HttpStatus.BAD_REQUEST)

    user.password = await bcrypt.hash(newPassword, rounds)
    return this.userRepository.save(user);
  }

  /**
   * Updates basic user info
   * @param id 
   * @param updateUserDto 
   * @returns 
   */
  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const existingUser = await this.findOne(id);
    const userData = this.userRepository.merge(
      existingUser,
      updateUserDto,
    );
    return await this.userRepository.save(
      userData,
    );
  }

  async remove(id: number): Promise<User> {
    const existingUser = await this.findOne(id);
    await this.userRepository.softDelete(id);
    return existingUser
  }
}