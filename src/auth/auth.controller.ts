import {Body, Controller, Post} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {LoginDTO, RegisterDTO} from "../models/user.model";

@Controller('users')
export class AuthController {

    constructor(private authService: AuthService) {
    }

    @Post()
    register(@Body() credentials: { user: RegisterDTO }) {
        return this.authService.register(credentials.user);
    }

    @Post('/login')
    login(@Body() credentials: { user: LoginDTO }) {
        return this.authService.login(credentials.user)
    }
}
