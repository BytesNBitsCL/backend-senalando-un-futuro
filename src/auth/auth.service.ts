import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { UsuariosService } from '../usuarios/usuarios.service';
import { ConfigService } from '@nestjs/config';
import { isEmail } from 'class-validator';

@Injectable()
export class AuthService {
  private transporter: nodemailer.Transporter;
  private jwtSecret: string;

  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly configService: ConfigService
  ) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: configService.get<string>('SMTP_GMAIL_USER'),
        pass: configService.get<string>('SMTP_GMAIL_PASS'),
      },
    });

    this.jwtSecret = configService.get<string>('SECRETO_SUPER_SEGURO');
  }

  async resetPassword(email: string) {
    // Validación del correo electrónico
    if (!isEmail(email)) {
      throw new BadRequestException('Correo electrónico inválido');
    }

    const user = await this.usuariosService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    // Crear el token JWT
    const token = jwt.sign(
      { email: user.correoUsuario },
      this.jwtSecret,
      { expiresIn: '1h' } // 1 hora de expiración
    );
    // * Descomentar la linea de abajo al subir a producción
    //const resetLink = `${process.env.FRONT_URL}/updatePassword?token=${token}`;

    // * Comentar la linea de abajo al subir a producción
    const resetLink = `http://localhost:3000/updatePassword?token=${token}`;
    
    // Enviar correo con el enlace de restablecimiento
    await this.transporter.sendMail({
      from: 'suf.proyect@gmail.com',
      to: email,
      subject: 'Restablecimiento de contraseña',
      text: `Haga clic en el siguiente enlace para restablecer su contraseña: ${resetLink}`,
      html: this.generateResetPasswordEmail(resetLink),
    });
  }

  // Función para generar el cuerpo HTML del correo
  private generateResetPasswordEmail(resetLink: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f7f7f7;">
        <div style="background-color: #ffffff; padding: 30px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
          <h1 style="color: #333333; font-size: 24px; margin-bottom: 20px; text-align: center;">Restablecimiento de Contraseña</h1>
          <p style="color: #666666; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
            Estimado usuario,
          </p>
          <p style="color: #666666; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
            Hemos recibido una solicitud para restablecer la contraseña de su cuenta. Si usted no ha realizado esta solicitud, por favor ignore este correo electrónico.
          </p>
          <p style="color: #666666; font-size: 16px; line-height: 1.5; margin-bottom: 30px;">
            Para restablecer su contraseña, haga clic en el siguiente botón:
          </p>
          <div style="text-align: center;">
            <a href="${resetLink}" style="background-color: #FF9F1C; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">
              Restablecer Contraseña
            </a>
          </div>
          <p style="color: #666666; font-size: 14px; line-height: 1.5; margin-top: 30px;">
            Si el botón no funciona, puede copiar y pegar el siguiente enlace en su navegador:
            <br>
            <a href="${resetLink}" style="color: #FF9F1C; word-break: break-all;">${resetLink}</a>
          </p>
          <p style="color: #666666; font-size: 14px; line-height: 1.5; margin-top: 30px;">
            Por razones de seguridad, este enlace expirará en 1 hora.
          </p>
          <hr style="border: none; border-top: 1px solid #eeeeee; margin: 30px 0;">
          <p style="color: #999999; font-size: 12px; text-align: center;">
            Este es un correo electrónico automático, por favor no responda a este mensaje.
          </p>
        </div>
      </div>
    `;
  }

  async verifyResetToken(token: string): Promise<string> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as { email: string };
      return decoded.email;
    } catch (error) {
      console.error('Error al verificar el token:', error);
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }

  async updatePassword(email: string, newPassword: string): Promise<void> {
    // Validación de la nueva contraseña
    if (!newPassword || newPassword.length < 6) {
      throw new BadRequestException('La contraseña debe tener al menos 6 caracteres');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.usuariosService.updatePassword(email, hashedPassword);
  }
}
