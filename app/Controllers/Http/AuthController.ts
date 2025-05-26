import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Hash from '@ioc:Adonis/Core/Hash'
import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs/promises'
import Env from '@ioc:Adonis/Core/Env'
import Mail from '@ioc:Adonis/Addons/Mail'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import crypto from 'crypto'
import { DateTime } from 'luxon'


cloudinary.config({
  cloud_name: Env.get('CLOUDINARY_CLOUD_NAME'),
  api_key: Env.get('CLOUDINARY_API_KEY'),
  api_secret: Env.get('CLOUDINARY_API_SECRET'),
})

export default class AuthController {
  // ✅ Register with profile photo and email verification
  public async register({ request, auth, response }: HttpContextContract) {
    const validation = schema.create({
      first_name: schema.string(),
      last_name: schema.string(),
      email: schema.string({}, [rules.email(), rules.unique({ table: 'users', column: 'email' })]),
      password: schema.string({}, [rules.minLength(6)]),
      type: schema.enum(['reader', 'librarian'] as const),
      photo: schema.file.optional({
        size: '2mb',
        extnames: ['jpg', 'jpeg', 'png'],
      }),
    })

    const data = await request.validate({ schema: validation })
    const user = new User()

    user.fill(data)
    user.emailVerified = false
    user.verificationToken = crypto.randomBytes(32).toString('hex')
    // user.verificationTokenExpiry = DateTime.now().plus({ hours: 1 }).toSQL()
    user.verificationTokenExpiry = DateTime.now().plus({ hours: 1 }).toFormat('yyyy-MM-dd HH:mm:ss')

    if (data.photo) {
      const uploaded = await cloudinary.uploader.upload(data.photo.tmpPath!)
      await fs.unlink(data.photo.tmpPath!)
      user.photo = uploaded.secure_url
    }

    await user.save()

    await Mail.send((message) => {
      message
        .to(user.email)
        .from('noreply@payfixy.com')
        .subject('Verify Your Email')
        .htmlView('emails/verification', { user })
    })

    const token = await auth.use('api').generate(user)
    return response.created({ user, token })
  }

  // ✅ Verify Email
  public async verify({ request, response }: HttpContextContract) {
    const { token } = request.only(['token'])
    const user = await User.query()
      .where('verificationToken', token)
      .andWhere('verificationTokenExpiry', '>', DateTime.now().toSQL())
      .first()

    if(!user){
        return response.badRequest({ message: 'Invalid token' })
    }
    user.emailVerified = true
    user.verificationToken = null
    user.verificationTokenExpiry = null
    await user.save()

    return response.ok({ message: 'Email verified successfully' })
  }

  // ✅ Forgot Password
  public async forgotPassword({ request, response }: HttpContextContract) {
    const { email } = request.only(['email'])
    const user = await User.findByOrFail('email', email)

    user.resetToken = crypto.randomBytes(32).toString('hex')
    user.resetTokenExpiry = DateTime.now().plus({ minutes: 30 }).toFormat('yyyy-MM-dd HH:mm:ss')
    await user.save()

    await Mail.send((message) => {
      message
        .to(user.email)
        .from('barrbarabanks@gmail.com')
        .subject('Reset Your Password')
        .htmlView('emails/passwordreset', { user })
    })

    return response.ok({ message: 'Reset email sent' })
  }

  // ✅ Reset Password
  public async resetPassword({ request, response }: HttpContextContract) {
    const { token, password } = request.only(['token', 'password'])
    const user = await User.query().where('resetToken', token).first()

    if(!user){
        return response.badRequest({ message: 'Invalid token' })
    }
    if (!user.resetTokenExpiry || DateTime.fromSQL(user.resetTokenExpiry).diffNow('minutes').minutes <= 0) {
      return response.badRequest({ message: 'Token expired' })
    }

    user.password = password
    user.resetToken = null
    user.resetTokenExpiry = null
    await user.save()

    return response.ok({ message: 'Password reset successfully' })
  }

  // ✅ Change Password
  public async changePassword({ auth, request, response }: HttpContextContract) {
    const user = auth.user!
    const { currentPassword, newPassword } = request.only(['currentPassword', 'newPassword'])

    if (!(await Hash.verify(user.password, currentPassword))) {
      return response.badRequest({ message: 'Current password is incorrect' })
    }

    user.password = newPassword
    await user.save()

    return response.ok({ message: 'Password changed successfully' })
  }

  // ✅ Login
  public async login({ request, auth, response }: HttpContextContract) {
    const { email, password } = request.only(['email', 'password'])
    const user = await User.query().where('email', email).firstOrFail()

    if (!(await Hash.verify(user.password, password))) {
      return response.unauthorized('Invalid credentials')
    }

    if (!user.emailVerified) {
      return response.unauthorized('Please verify your email')
    }

    const token = await auth.use('api').generate(user)
    return response.ok({ user, token })
  }
}