import {
  Injectable, ConflictException, UnauthorizedException,
  BadRequestException, NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { authenticator } from 'otplib';
import * as QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { UserRole } from '../common/enums';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersRepo.findOne({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already registered');

    const hashedPassword = await bcrypt.hash(dto.password, 12);
    const emailVerificationToken = uuidv4();

    const user = this.usersRepo.create({
      ...dto,
      password: hashedPassword,
      emailVerificationToken,
      isActive: true,
      role: dto.role || UserRole.USER,
      notificationPreferences: { email: true, push: true, sms: false },
    });

    await this.usersRepo.save(user);

    // TODO: Send verification email
    const tokens = this.generateTokens(user);
    return { user: this.sanitizeUser(user), ...tokens };
  }

  async login(user: User) {
    if (user.twoFactorEnabled) {
      return { requiresTwoFactor: true, userId: user.id };
    }
    await this.usersRepo.update(user.id, { lastLoginAt: new Date() });
    const tokens = this.generateTokens(user);
    return { user: this.sanitizeUser(user), ...tokens };
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersRepo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();

    if (!user || !user.password) return null;
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;
    if (user.isBanned) throw new UnauthorizedException('Account suspended');
    return user;
  }

  async googleLogin(googleUser: any) {
    let user = await this.usersRepo.findOne({ where: { email: googleUser.email } });

    if (!user) {
      user = this.usersRepo.create({
        email: googleUser.email,
        firstName: googleUser.firstName,
        lastName: googleUser.lastName,
        googleId: googleUser.googleId,
        profilePicture: googleUser.picture,
        emailVerified: true,
        isActive: true,
        role: UserRole.USER,
        notificationPreferences: { email: true, push: true, sms: false },
      });
      await this.usersRepo.save(user);
    } else {
      await this.usersRepo.update(user.id, { googleId: googleUser.googleId, lastLoginAt: new Date() });
    }

    const tokens = this.generateTokens(user);
    return { user: this.sanitizeUser(user), ...tokens };
  }

  async setup2FA(userId: string) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(user.email, 'GreenInvest', secret);
    const qrCode = await QRCode.toDataURL(otpauthUrl);

    await this.usersRepo
      .createQueryBuilder()
      .update(User)
      .set({ twoFactorSecret: secret })
      .where('id = :id', { id: userId })
      .execute();

    return { secret, qrCode };
  }

  async enable2FA(userId: string, token: string) {
    const user = await this.usersRepo
      .createQueryBuilder('user')
      .addSelect('user.twoFactorSecret')
      .where('user.id = :id', { id: userId })
      .getOne();

    if (!user?.twoFactorSecret) throw new BadRequestException('2FA not set up');

    const isValid = authenticator.verify({ token, secret: user.twoFactorSecret });
    if (!isValid) throw new UnauthorizedException('Invalid 2FA token');

    await this.usersRepo.update(userId, { twoFactorEnabled: true });
    return { message: '2FA enabled successfully' };
  }

  async verify2FA(userId: string, token: string) {
    const user = await this.usersRepo
      .createQueryBuilder('user')
      .addSelect('user.twoFactorSecret')
      .where('user.id = :id', { id: userId })
      .getOne();

    if (!user?.twoFactorSecret) throw new BadRequestException('2FA not configured');

    const isValid = authenticator.verify({ token, secret: user.twoFactorSecret });
    if (!isValid) throw new UnauthorizedException('Invalid 2FA code');

    await this.usersRepo.update(userId, { lastLoginAt: new Date() });
    const tokens = this.generateTokens(user);
    return { user: this.sanitizeUser(user), ...tokens };
  }

  async verifyEmail(token: string) {
    const user = await this.usersRepo
      .createQueryBuilder('user')
      .addSelect('user.emailVerificationToken')
      .where('user.emailVerificationToken = :token', { token })
      .getOne();

    if (!user) throw new BadRequestException('Invalid verification token');
    await this.usersRepo.update(user.id, { emailVerified: true, emailVerificationToken: null });
    return { message: 'Email verified successfully' };
  }

  private generateTokens(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '30d' }),
    };
  }

  private sanitizeUser(user: User) {
    const { password, twoFactorSecret, emailVerificationToken, phoneVerificationCode, ...safe } = user as any;
    return safe;
  }
}
