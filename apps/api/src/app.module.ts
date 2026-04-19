import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { CaregiverModule } from './caregiver/caregiver.module'
import { BookingModule } from './booking/booking.module'
import { UserModule } from './user/user.module'
import { ContactModule } from './contact/contact.module'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '../../.env',
        }),
        AuthModule,
        UserModule,
        CaregiverModule,
        BookingModule,
        ContactModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
