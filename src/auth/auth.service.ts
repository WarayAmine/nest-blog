import {ConflictException, Injectable, InternalServerErrorException, UnauthorizedException} from '@nestjs/common';
import {LoginDTO, RegisterDTO, UpdateUserDto} from "../models/user.model";
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "../entities/user.entity";
import {Repository} from "typeorm";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
        private jwtService: JwtService
    ) {
    }

    async register(credentials: RegisterDTO) {
        try {
            const user = this.userRepo.create(credentials);
            await user.save();
            const payload = {username: user.username};
            const token = this.jwtService.sign(payload);
            return {user: {...user.toJSON(), token}};
        } catch (err) {
            if (err.code === '23505') {
                throw new ConflictException('Username has already been taken')
            }
            throw new InternalServerErrorException()
        }
    }

    async login({email, password}: LoginDTO) {
        try {
            const user = await this.userRepo.findOne(
                {where: {email: email}}
            );
            const isValid = await user.comparePassword(password);
            if (!isValid) {
                throw new UnauthorizedException('Invalid credentials')
            }
            const payload = {username: user.username};
            const token = this.jwtService.sign(payload);
            return {user: {...user.toJSON(), token}};
        } catch (err) {
            throw new UnauthorizedException('Invalid credentials')
        }
    }

    async updateUser(username: string, data: UpdateUserDto) {
        await this.userRepo.update({username}, data);
        const user = await this.userRepo.findOne({where: {username}})
        const payload = {username: user};
        const token = this.jwtService.sign(payload);
        return {user: {...user.toJSON(), token}}
    }

    async findCurrentUser(username: string) {
        const user = await this.userRepo.findOne({where: {username}})
        const payload = {username: user};
        const token = this.jwtService.sign(payload);
        return {user: {...user.toJSON(), token}}
    }
}
