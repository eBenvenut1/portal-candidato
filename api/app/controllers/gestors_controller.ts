import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { createGestorValidator } from '#validators/create_gestor'
import { loginUserValidator } from '#validators/login_user'
import jwt from 'jsonwebtoken'
import mail from '@adonisjs/mail/services/main'


export default class GestoresController {
    private generateToken(user: User) {
        console.log(user)

        const payload = {
            userId: user.id,
            email: user.email,
            fullName: user.fullName,
            role: user.role
        }

        return jwt.sign(payload, process.env.JWT_SECRET || 'your-secret-key', {
            expiresIn: '24h',
        })
    }

    /**
     * Lista os gestores (filtra por role)
     */
    async index({ response }: HttpContext) {
        try {
            const gestores = await User.query()
                .where('role', 'gestor')
                .select('id', 'full_name', 'email', 'created_at')

            return response.ok({
                message: 'Gestores listados com sucesso',
                data: gestores,
            })
        } catch (error) {
            return response.internalServerError({
                message: 'Erro ao listar gestores',
                error: error.message,
            })
        }
    }

    /**
     * Cria um novo gestor
     */
    async store({ request, response }: HttpContext) {
        try {
            const payload = await request.validateUsing(createGestorValidator)

            const { confirmPassword, ...userData } = payload

            const user = await User.create({ ...userData, role: 'gestor' })

            const token = this.generateToken(user)


            return response.created({
                message: 'Gestor criado com sucesso',
                data: {
                    user: {
                        id: user.id,
                        full_name: user.fullName,
                        email: user.email,
                        role: user.role,
                        created_at: user.createdAt,
                    },
                    token,
                    tokenType: 'Bearer',
                },
            })
        } catch (error) {
            if (error.messages) {
                return response.badRequest({
                    message: 'Dados inválidos',
                    errors: error.messages,
                })
            }

            return response.internalServerError({
                message: 'Erro ao criar gestor',
                error: error.message,
            })
        }
    }

    /**
     * Mostra um gestor específico
     */
    async show({ params, response }: HttpContext) {
        try {
            const gestor = await User.query()
                .where('id', params.id)
                .where('role', 'gestor')
                .select('id', 'full_name', 'email', 'created_at')
                .first()

            if (!gestor) {
                return response.notFound({ message: 'Gestor não encontrado' })
            }

            return response.ok({
                message: 'Gestor encontrado',
                data: gestor,
            })
        } catch (error) {
            return response.internalServerError({
                message: 'Erro ao buscar gestor',
                error: error.message,
            })
        }
    }

    // Exemplo de método dentro de GestoresController
    async notifyCandidato({ request, response }: HttpContext) {
        // Vamos ver tudo que está chegando
        console.log("1. Method:", request.method())
        console.log("2. Headers:", request.headers())
        console.log("3. Body completo:", request.body())
        console.log("4. All data:", request.all())
        console.log("5. Raw body:", request.raw())

        const body = request.body()
        const email = request.input('email')

        console.log("6. Body extraído:", body)
        console.log("7. Email extraído:", email)
        console.log("8. Tipo do body:", typeof body)

        try {
            if (!email) {
                return response.badRequest({
                    message: 'Email não fornecido',
                    receivedBody: body,
                    receivedData: request.all()
                })
            }

            await mail.send((message) => {
                message
                    .to(email)
                    .from('enzo.henrique@quaestum.com.br')
                    .subject('Reunião agendada')
                    .html(`
                    <p>Olá!</p>
                    <p>Sua reunião está marcada para <strong>daqui a 3 dias úteis</strong>.</p>
                `)
            })

            return response.ok({ message: 'Notificação enviada com sucesso' })
        } catch (error) {
            return response.internalServerError({
                message: 'Erro ao enviar e-mail',
                error: error.message
            })
        }
    }



    /**
        * Authenticate user
        */
    async login({ request, response }: HttpContext) {
        try {
            const { email, password } = await request.validateUsing(loginUserValidator)

            // Usando o método verifyCredentials do AuthFinder mixin
            const user = await User.verifyCredentials(email, password)

            // Gerar token JWT
            const token = this.generateToken(user)

            return response.ok({
                message: 'Login realizado com sucesso',
                data: {
                    user: {
                        id: user.id,
                        role: user.role,
                        full_name: user.fullName,
                        email: user.email,
                        habilidade: user.habilidade,
                        endereco: user.endereco,
                        cep: user.cep
                    },
                    token,
                    tokenType: 'Bearer'
                }
            })
        } catch (error) {
            // Se for um erro de credenciais inválidas
            if (error.code === 'E_INVALID_CREDENTIALS') {
                return response.badRequest({
                    message: 'Credenciais inválidas'
                })
            }

            if (error.messages) {
                return response.badRequest({
                    message: 'Dados de entrada inválidos',
                    errors: error.messages
                })
            }

            return response.internalServerError({
                message: 'Erro interno do servidor',
                error: error.message
            })
        }
    }



    /**
     * Deleta um gestor
     */
    async destroy({ params, response }: HttpContext) {
        try {
            const gestor = await User.find(params.id)

            if (!gestor || gestor.role !== 'gestor') {
                return response.notFound({ message: 'Gestor não encontrado' })
            }

            await gestor.delete()

            return response.ok({ message: 'Gestor deletado com sucesso' })
        } catch (error) {
            return response.internalServerError({
                message: 'Erro ao deletar gestor',
                error: error.message,
            })
        }
    }
}
