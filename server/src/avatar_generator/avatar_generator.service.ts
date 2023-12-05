import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class AvatarGeneratorService {
    private defaultSize: number;
    private defaultImage: string;

    constructor() {
        this.defaultSize = 200;
        this.defaultImage = 'monsterid';
    }

    generateGravatarUrl(email: string, size = this.defaultSize, defaultImage = this.defaultImage): string {
        // Хеширование email с использованием MD5
        const hashedEmail = crypto.createHash('md5').update(email.toLowerCase().trim()).digest('hex');

        // Построение URL для Gravatar
        return `https://www.gravatar.com/avatar/${hashedEmail}?s=${size}&d=${defaultImage}`;
    }
}
