import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => {
  return {
    type: 'postgres',
    host: configService.get<string>('DATABASE_HOST', 'localhost'),
    port: configService.get<number>('DATABASE_PORT', 5432),
    username: configService.get<string>('DATABASE_USERNAME', 'thinkcate_user'),
    password: configService.get<string>('DATABASE_PASSWORD', 'thinkcate_password'),
    database: configService.get<string>('DATABASE_NAME', 'thinkcate_db'),
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: configService.get<boolean>('DATABASE_SYNCHRONIZE', true),
    logging: configService.get<string>('NODE_ENV') === 'development',
  };
};
