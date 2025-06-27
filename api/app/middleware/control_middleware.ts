import type { HttpContext } from '@adonisjs/core/http'
import jwt from 'jsonwebtoken'

export default class AuthGuard {
  async handle({ request, response }: HttpContext, next: () => Promise<void>) {
    const token = request.header('authorization')?.replace('Bearer ', '')

    if (!token) {
      return response.unauthorized({
        message: 'Token de autenticação não fornecido',
      })
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any

      // opcional: injetar userId ou role no request para reutilizar depois
      request.updateBody({
        authUser: {
          id: decoded.userId,
          email: decoded.email,
          fullName: decoded.fullName,
          telefone: decoded.telefone,
          habilidade: decoded.habilidade,
          formacao: decoded.formacao,
          role: decoded.role,
        },
      })

      await next()
    } catch (error) {
      return response.unauthorized({
        message: 'Token inválido ou expirado',
      })
    }
  }
}
