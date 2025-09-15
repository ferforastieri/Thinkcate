import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvironmentModule } from './shared/environment/environment.module';
import { DatabaseModule } from './shared/database/database.module';
import { NotesModule } from './modules/notes/notes.module';
import { FilesModule } from './modules/files/files.module';
import { UploadModule } from './modules/upload/upload.module';

@Module({
  imports: [
    EnvironmentModule,
    DatabaseModule,
    UploadModule,
    NotesModule,
    FilesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
