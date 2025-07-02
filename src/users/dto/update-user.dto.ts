import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {

    @IsOptional()
    @IsString()
    fullName?: string | undefined;

    @IsOptional()
    @IsEmail()
    email?: string | undefined;

    @IsOptional()
    roles?: string[] | undefined;
}