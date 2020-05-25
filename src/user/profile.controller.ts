import {Controller, Delete, Get, HttpCode, NotFoundException, Param, Post, UseGuards} from '@nestjs/common';
import {UserService} from "./user.service";
import {User} from "../auth/user.decorator";
import {UserEntity} from "../entities/user.entity";
import {AuthGuard} from "@nestjs/passport";
import {OptionalAuthGuard} from "../auth/optional-auth.guard";

@Controller('profiles')
export class ProfileController {
    constructor(private userService: UserService) {
    }

    @Get('/:username')
    @UseGuards(new OptionalAuthGuard())
    async findProfile(@Param('username') username: string,
                      @User() user: UserEntity) {
        const profile = await this.userService.findByUsername(username, user);
        if (!profile) {
            throw new NotFoundException();
        }
        return {profile};
    }

    @Post('/:username/follow')
    @HttpCode(200)
    @UseGuards(AuthGuard())
    async followUser(@User() currentUser: UserEntity, @Param('username') username: string) {
        const profile = await this.userService.followUser(currentUser, username);
        return {profile}
    }

    @Delete('/:username/follow')
    @UseGuards(AuthGuard())
    async unfollowUser(@User() currentUser: UserEntity, @Param('username') username: string) {
        const profile = await this.userService.unfollowUser(currentUser, username);
        return {profile}
    }

}
