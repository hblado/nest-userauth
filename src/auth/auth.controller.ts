import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guards';
import { JwtAuthGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * first use the guards and strategies to verify and 
   * validate everything, then passes to the auth.service and
   * it returns the access token
   * @param req 
   * @returns 
   */
  @Post('login')
  @UseGuards(LocalGuard)
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  /**
   * endpoint protected by JwtAuthGuard. Acts like a middleware
   * to validate the jwtToken passed as a bearer token.
   * @param req 
   * @returns 
   */
  @Get('status')
  @UseGuards(JwtAuthGuard)
  status(@Request() req: Request) {
    return req['user']
  }
}
