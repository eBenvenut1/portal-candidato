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

      const body = request.body()

      request.updateBody({
        ...body,
        authUser: {
          ...body.authUser, // ← mantém o que o frontend mandou (cep, endereco, etc.)
          id: decoded.userId, // ← garante a segurança
          role: decoded.role
        }
      })

      await next()
    } catch (error) {
      return response.unauthorized({
        message: 'Token inválido ou expirado',
      })
    }
  }
}
