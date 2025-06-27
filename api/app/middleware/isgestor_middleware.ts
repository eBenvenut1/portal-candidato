import type { HttpContext } from '@adonisjs/core/http'
import jwt from 'jsonwebtoken'

export default class EnsureGestor {
  async handle({ request, response }: HttpContext, next: () => Promise<void>) {
    const token = request.header('authorization')?.replace('Bearer ', '')

    if (!token) {
      return response.unauthorized({ message: 'Token não fornecido' })
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any

      if (decoded && decoded.role !== 'gestor') {
        return response.forbidden({ message: 'Acesso restrito a gestores' })
      }

      await next()
    } catch (error) {
      return response.unauthorized({ message: 'Token inválido ou expirado' })
    }
  }
}
