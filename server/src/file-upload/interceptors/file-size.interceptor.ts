import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class FileSizeInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();

        const mp3: Express.Multer.File = request.files['mp3_file'][0];
        const wav: Express.Multer.File = request.files['wav_file'][0];
        const zip: Express.Multer.File = request.files['zip_file'][0];

        if (!mp3 || !wav || !zip) {
            // Если файлы отсутствуют, то можно пропустить валидацию
            return next.handle();
        }

        const files: Express.Multer.File[] = [mp3, wav, zip];

        // Динамически устанавливаем максимальный размер файла для каждого файла
        const sizeLimits = {
            mp3_file: 1024 * 1024 * 30, // Например, 30MB для mp3
            wav_file: 1024 * 1024 * 100, // Например, 100MB для wav
            zip_file: 1024 * 1024 * 500, // Например, 500MB для zip
        };


        for (let i = 0; i < files.length - 1; i++) {

            const file = files[i]
            const maxFileSize = sizeLimits[i];

            if (file.size > maxFileSize) {
                throw new BadRequestException(`File size exceeds the maximum allowed size for ${file.filename}.`);
            }
        }

        return next.handle();
    }
}
