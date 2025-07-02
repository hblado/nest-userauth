import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthPayloadDto } from './dto/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService){}

    
    async validateUser({ email, password }: AuthPayloadDto) {
        const findUser = await this.userRepository
            .createQueryBuilder('user')
            .addSelect('user.password') //loads password bc its marked as 'select: false' in DTO
            .where('user.email = :email', { email })
            .getOne();

        if (!findUser) return null;
        const passwordMatches = await bcrypt.compare(password, findUser.password)
        if (!passwordMatches) return null;
        const { password: _, ...userWithoutPassword } = findUser;
        return userWithoutPassword;
    }


    login(user: any) {
        const payload = { sub: user.id, email: user.email, roles: user.roles };
        const token = this.jwtService.sign(payload);

        return {
            access_token: token
        };
    }
}
