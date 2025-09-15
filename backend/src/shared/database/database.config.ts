import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => {
  const databaseType = configService.get<string>('DATABASE_TYPE', 'sqlite');
  
  if (databaseType === 'postgres') {
    return {
      type: 'postgres',
      host: configService.get<string>('DATABASE_HOST', 'localhost'),
      port: configService.get<number>('DATABASE_PORT', 5432),
      username: configService.get<string>('DATABASE_USERNAME', 'thinkcate_user'),
      password: configService.get<string>('DATABASE_PASSWORD', 'thinkcate_password'),
      database: configService.get<string>('DATABASE_NAME', 'thinkcate_db'),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: configService.get<string>('NODE_ENV') === 'development',
      logging: configService.get<string>('NODE_ENV') === 'development',
    };
  } else {
    // SQLite fallback
    return {
      type: 'sqlite',
      database: 'data/thinkcate.db',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true,
    };
  }
};
