import {AbstractEntity} from "./abstract-entity";
import {BeforeInsert, Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany} from "typeorm";
import {IsEmail} from "class-validator";
import {classToPlain, Exclude} from "class-transformer";
import * as bcrypt from "bcryptjs";
import {ArticleEntity} from "./article.entity";

@Entity('users')
export class UserEntity extends AbstractEntity {
    @Column()
    @IsEmail()
    email: string;

    @Column({unique: true})
    username: string;

    @Column()
    @Exclude()
    password: string;

    @Column({default: ''})
    bio: string;

    @Column({default: null, nullable: true})
    image: string | null;

    @ManyToMany(type => UserEntity, user => user.followee)
    @JoinTable()
    followers: UserEntity[];

    @ManyToMany(type => UserEntity, user => user.followers)
    @JoinTable()
    followee: UserEntity[];

    @OneToMany(
        type => ArticleEntity,
        article => article.author
    )
    articles: ArticleEntity[];

    @ManyToMany(
        type => ArticleEntity,
        article => article.favoritedBy
    )
    @JoinColumn()
    favorites: ArticleEntity[];

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }

    toJSON() {
        return classToPlain(this);
    }

    toProfile(user?: UserEntity) {
        let following = null;
        if (user) {
            following = this.followers.includes(user);
        }
        const profile: any = this.toJSON();
        delete profile.followers;
        return {...profile, following};
    }

    async comparePassword(attemptPassword: string) {
        return await bcrypt.compare(attemptPassword, this.password);
    }
}
