/*
* {
  "article": {
    "slug": "how-to-train-your-dragon",
    "title": "How to train your dragon",
    "description": "Ever wonder how?",
    "body": "It takes a Jacobian",
    "tagList": ["dragons", "training"],
    "createdAt": "2016-02-18T03:22:56.637Z",
    "updatedAt": "2016-02-18T03:48:35.824Z",
    "favorited": false,
    "favoritesCount": 0,
    "author": {
      "username": "jake",
      "bio": "I work at statefarm",
      "image": "https://i.stack.imgur.com/xHWG8.jpg",
      "following": false
    }
  }
}*/

import {AbstractEntity} from "./abstract-entity";
import {BeforeInsert, Column, Entity, JoinColumn, ManyToMany, ManyToOne, RelationCount} from "typeorm";
import * as slugify from "slug";
import {UserEntity} from "./user.entity";
import {classToPlain} from "class-transformer";

@Entity()
export class ArticleEntity extends AbstractEntity {
    @Column()
    slug: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    body: string;

    @ManyToMany(
        type => UserEntity,
        user => user.favorites,
        {eager: true}
    )
    @JoinColumn()
    favoritedBy: UserEntity[];

    @RelationCount(
        (article: ArticleEntity) => article.favoritedBy
    )
    favoritesCount: number;

    @ManyToOne(
        type => UserEntity,
        user => user.articles,
        {eager: true}
    )
    author: UserEntity;

    @Column('simple-array')
    tagList: string[];

    @BeforeInsert()
    generateSlug() {
        this.slug = slugify(this.title, {lower: true} + '-' + ((Math.random() * Math.pow(36, 6)) | 0)).toString();
    }

    toJSON() {
        return classToPlain(this);
    }

    toArticle(user: UserEntity) {
        let favorited = null;
        if (user) {
            favorited = this.favoritedBy.includes(user);
        }
        const article: any = this.toJSON();
        delete article.favoritedBy;
        return {...article, favorited};
    }

}
