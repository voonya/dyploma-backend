import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/auth';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login(@Body() data: RegisterDto) {
    const result = await this.authService.login(data);

    return { data: { accessToken: result.tokens.accessToken } };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/register')
  async register(@Body() data: RegisterDto) {
    const result = await this.authService.register(data);

    return { data: { user: result.user } };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async getMe(@Request() req: any) {
    return { data: { user: req.user } };
  }

  // @HttpCode(HttpStatus.OK)
  // @UseGuards(JwtAuthGuard)
  // @Post('/logout')
  // async logout(
  //   @UserReq() user: User,
  //   @Cookies() cookies: RefreshTokenRequest,
  //   @Res() res,
  // ) {
  //   const userId = user.id;

  //   await this.authService.logout(userId, cookies[CookieName.REFRESH_TOKEN]);
  //   res.clearCookie(CookieName.REFRESH_TOKEN);
  //   res.clearCookie(CookieName.ACCESS_TOKEN);
  //   res.send({
  //     message: 'Success!',
  //   });

  //   return res;
  // }

  // setTokensCookie(res: Response, tokens: {accessToken: string}): Response {
  //   res.cookie(CookieName.ACCESS_TOKEN, tokens.accessToken, {
  //     sameSite: 'strict',
  //     expires: new Date(
  //       new Date().getTime() +
  //         Number(process.env.TIME_LIVE_JWT_ACCESS_COOKIE_M) * 60 * 1000,
  //     ),
  //   });

  //   return res;
  // }
}
