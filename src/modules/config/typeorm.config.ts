import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'password',
  database: 'new-chat_platform',
  entities: [__dirname + '/../**/*.entity.{js,ts}'], // for local use
  //   entities: ['dist/**/*.entity{.ts,.js}'], // for deployment
  synchronize: true,
};
