import { Module } from '@nestjs/common';
import { MailerService } from './mail.service';
import { ConfigModule } from 'src/config/config.module';

@Module({
  imports: [ConfigModule],
  providers: [MailerService],
  exports: [MailerService],
})
export class UtilsModule {}
