import {IsEmail, IsNotEmpty, IsOptional, MinLength} from 'class-validator';

export class LoginDTO {
    @IsEmail()
    @MinLength(4)
    email: string;

    @IsNotEmpty()
    @MinLength(4)
    password: string;
}

export class RegisterDTO extends LoginDTO {
    @IsNotEmpty()
    @MinLength(4)
    username: string
}

export class UpdateUserDto {
    @IsEmail()
    @IsOptional()
    email: string;

    @IsOptional()
    image: string;

    @IsOptional()
    bio: string;
}

export interface AuthPayload {
    username: string;
}
