import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from 'src/config/config.module';
import { ConfigService } from 'src/config/config.service';
import { ConnectionOptions } from 'typeorm';
import { Configuration } from 'src/config/config.keys';
// import { Configuration } from 'src';
export const databaseProviders = [
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    async useFactory(config: ConfigService) {
      return {
        type: 'mysql' as 'mysql',
        host: config.get(Configuration.HOST),
        username: config.get(Configuration.USERNAME),
        password: config.get(Configuration.PASSWORD),
        database: config.get(Configuration.DATABASE),
        //entities: ['../**/**/*.entity{.ts,.js}'],
        port: parseInt(config.get(Configuration.DB_PORT)),
        // migrations: [__dirname + '/migrations/*{.ts,.js}'],
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        migrations: ['./migrations/*{.ts,.js}'],
        cache: true,
      } as ConnectionOptions;
    },
  }),
];
