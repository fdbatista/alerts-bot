import { Controller, Request, Post, UseGuards, Body, Version, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginRequestDto } from './dto/login-request.dto';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Version('1')
    @Post('login')
    async login(@Body() dto: LoginRequestDto) {
        return this.authService.login(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Version('1')
    @Get('profile')
    getProfile(@Request() req: any) {
      return req.user;
    }

}
