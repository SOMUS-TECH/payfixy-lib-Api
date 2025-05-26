import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Role {
  public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>, allowedRoles: string[]) {
    const user = auth.user

    if (!user || !allowedRoles.includes(user.type)) {
      return response.unauthorized({ message: 'Access denied' })
    }

    await next()
  }
}
