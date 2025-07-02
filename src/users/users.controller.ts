import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './roles/roles.decorator';

type PasswordChanger = {
  id: number,
  oldPassword: string,
  newPassword: string
}

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
  ) {}

  /**
   * Creates a new User
   * @param {CreateUserDto} createUserDto 
   * @returns 
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async create(
    @Body() createUserDto: CreateUserDto,
  ) {
    try {
      await this.userService.create(
        createUserDto,
      );

      return {
        success: true,
        message: 'User Created Successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Get info from all users
   * @returns 
   */
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async findAll() {
    try {
      const data =
        await this.userService.findAll();
      return {
        success: true,
        data,
        message: 'User Fetched Successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  } 

  /**
   * Gets info from another user
   * @param {number} id 
   * @returns 
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async findOne(@Param('id') id: string) {
    try {
      const data = await this.userService.findOne(
        +id,
      );
      return {
        success: true,
        data,
        message: 'User Fetched Successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Changes the password
   * @param {PasswordChanger} passwordChanger 
   */
  @Patch('change-password')
  @UseGuards(JwtAuthGuard)
  async changePass(@Body() passwordChanger: PasswordChanger){
    await this.userService.changePassword(
      passwordChanger.id,
      passwordChanger.oldPassword,
      passwordChanger.newPassword
    )
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      await this.userService.update(
        +id,
        updateUserDto,
      );
      return {
        success: true,
        message: 'User Updated Successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async remove(@Param('id') id: string) {
    try {
      await this.userService.remove(+id);
      return {
        success: true,
        message: 'User Deleted Successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}