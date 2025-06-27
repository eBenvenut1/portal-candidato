import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { createUserValidator } from '#validators/create_user'
import { loginUserValidator } from '#validators/login_user'
import jwt from 'jsonwebtoken'

export default class UsersController {
    /**
     * Generate JWT token
     * 
     */

    async register({ request, response }: HttpContext) {
        console.log('Rota chamada!')

        const body = request.body()
        console.log('Body recebido:', body)

        return response.ok({ recebido: body })
    }

    private generateToken(user: User) {
        const payload = {
            userId: user.id,
            email: user.email,
            fullName: user.fullName,
            habilidade: user.habilidade,
            formacao: user.formacao,
            telefone: user.telefone,
            role: user.role,
            cep: user.cep,
            endereco: user.endereco
        }


        return jwt.sign(
            payload,
            process.env.JWT_SECRET || 'your-secret-key',
            {
                expiresIn: '24h' // Token expira em 24 horas
            }
        )
    }

    /**
     * Display a list of users
     */
    async index({ response }: HttpContext) {
        try {
            const users = await User.query().where('role', 'candidato').select('id', 'full_name', 'email', 'habilidade', 'formacao', 'telefone', 'endereco', 'cep', 'created_at')

            return response.ok({
                message: 'Usuários listados com sucesso',
                data: users
            })
        } catch (error) {
            return response.internalServerError({
                message: 'Erro interno do servidor',
                error: error.message
            })
        }
    }

    /**
     * Handle form submission for the create action
     */
    async store({ request, response }: HttpContext) {
        try {
            const payload = await request.validateUsing(createUserValidator)

            // Verificar se o email já existe
            const existingUser = await User.findBy('email', payload.email)
            if (existingUser) {
                return response.badRequest({
                    message: 'Este email já está em uso'
                })
            }

            // Remover confirmPassword antes de criar o usuário
            const { confirmPassword, ...userData } = payload

            // NÃO fazer hash manual - o modelo User fará isso automaticamente
            const user = await User.create({ ...userData, role: 'candidato' })


            // Gerar token JWT para o novo usuário
            const token = this.generateToken(user)

            return response.created({
                message: 'Usuário criado com sucesso',
                data: {
                    user: {
                        id: user.id,
                        full_name: user.fullName,
                        email: user.email,
                        habilidade: user.habilidade,
                        formacao: user.formacao,
                        telefone: user.telefone,
                        endereco: user.endereco,
                        cep: user.cep,
                        created_at: user.createdAt
                    },
                    token,
                    tokenType: 'Bearer'
                }
            })
        } catch (error) {
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
     * Show individual user
     */
    async show({ params, response }: HttpContext) {
        try {
            const user = await User.query()
                .where('id', params.id)
                .select('id', 'full_name', 'email', 'habilidade', 'formacao', 'telefone', 'endereco', 'cep', 'created_at')
                .first()

            if (!user) {
                return response.notFound({
                    message: 'Usuário não encontrado'
                })
            }

            return response.ok({
                message: 'Usuário encontrado',
                data: user
            })
        } catch (error) {
            return response.internalServerError({
                message: 'Erro interno do servidor',
                error: error.message
            })
        }
    }

    /**
     * Delete a user
     */
    async destroy({ params, response }: HttpContext) {
        try {
            const user = await User.find(params.id)

            if (!user) {
                return response.notFound({
                    message: 'Usuário não encontrado'
                })
            }

            await user.delete()

            return response.ok({
                message: 'Usuário deletado com sucesso'
            })
        } catch (error) {
            return response.internalServerError({
                message: 'Erro interno do servidor',
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
                        formacao: user.formacao,
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
     * Get current user profile (requires authentication)
     */
    async profile({ request, response }: HttpContext) {
        try {
            // Verificar token de autenticação
            const token = request.header('authorization')?.replace('Bearer ', '')

            if (!token) {
                return response.unauthorized({
                    message: 'Token de acesso não fornecido'
                })
            }

            // Decodificar token para obter o usuário
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any
            const user = await User.find(decoded.userId)

            if (!user) {
                return response.unauthorized({
                    message: 'Token inválido'
                })
            }

            return response.ok({
                message: 'Perfil do usuário obtido com sucesso',
                data: {
                    id: user.id,
                    full_name: user.fullName,
                    email: user.email,
                    role: user.role,
                    habilidade: user.habilidade,
                    formacao: user.formacao,
                    telefone: user.telefone,
                    endereco: user.endereco,
                    cep: user.cep,
                    created_at: user.createdAt,
                    updated_at: user.updatedAt
                }
            })

        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return response.unauthorized({
                    message: 'Token expirado'
                })
            }

            if (error.name === 'JsonWebTokenError') {
                return response.unauthorized({
                    message: 'Token inválido'
                })
            }

            return response.internalServerError({
                message: 'Erro interno do servidor',
                error: error.message
            })
        }
    }

    /**
 * Edit user profile (requires authentication)
 */
    async editProfile({ request, response }: HttpContext) {
        try {


            // Verificar token de autenticação
            const token = request.header('authorization')?.replace('Bearer ', '')

            if (!token) {
                return response.unauthorized({
                    message: 'Token de acesso não fornecido'
                })
            }

            // Decodificar token para obter o usuário
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any
            const user = await User.find(decoded.userId)


            if (!user) {
                return response.unauthorized({
                    message: 'Token inválido'
                })
            }

            // Obter dados do corpo da requisição

            const { authUser } = request.body()
            const { fullName, email, habilidade, formacao, telefone, endereco, cep, password } = authUser



            // Verificar se o email já existe (se for diferente do atual)
            if (email && email !== user.email) {
                const existingUser = await User.findBy('email', email)
                if (existingUser) {
                    return response.badRequest({
                        message: 'Este email já está em uso'
                    })
                }
            }


            // Atualizar campos se fornecidos
            if (fullName) {
                user.fullName = fullName
            }

            if (email) {
                user.email = email
            }

            if (habilidade) {
                user.habilidade = habilidade
            }

            if (formacao) {
                user.formacao = formacao
            }

            if (telefone) {
                user.telefone = telefone
            }

            if (endereco) {
                user.endereco = endereco
            }

            if (cep) {
                user.cep = cep
            }

            if (password) {
                // A senha será hasheada automaticamente pelo modelo User
                user.password = password
            }

            // Salvar alterações
            await user.save()
            

            return response.ok({
                message: 'Perfil atualizado com sucesso',
                data: {
                    id: user.id,
                    full_name: user.fullName,
                    email: user.email,
                    habilidade: user.habilidade,
                    formacao: user.formacao,
                    telefone: user.telefone,
                    endereco: user.endereco,
                    cep: user.cep,
                    updated_at: user.updatedAt
                }
            })

        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return response.unauthorized({
                    message: 'Token expirado'
                })
            }

            if (error.name === 'JsonWebTokenError') {
                return response.unauthorized({
                    message: 'Token inválido'
                })
            }

            return response.internalServerError({
                message: 'Erro interno do servidor',
                error: error.message
            })
        }
    }

    //Search Candidato
    async searchCandidato({ request, response }: HttpContext) {
        const q = request.input('q') || ''

        try {
            const candidatos = await User.query()
                .where('role', 'candidato')
                .andWhere('habilidade', 'like', `%${q}%`)

            return response.ok({
                message: 'Candidatos encontrados',
                data: candidatos,
            })
        } catch (error) {
            return response.internalServerError({
                message: 'Erro ao buscar candidatos',
                error: error.message,
            })
        }
    }



    /**
     * Verify if token is valid
     */
    async verifyToken({ request, response }: HttpContext) {
        try {
            const token = request.header('authorization')?.replace('Bearer ', '')

            if (!token) {
                return response.unauthorized({
                    message: 'Token não fornecido, verify'
                })
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any
            const user = await User.find(decoded.userId)

            if (!user) {
                return response.unauthorized({
                    message: 'Token inválido'
                })
            }

            return response.ok({
                message: 'Token válido',
                data: {
                    userId: user.id,
                    email: user.email,
                    fullName: user.fullName
                }
            })
        } catch (error) {
            return response.unauthorized({
                message: 'Token inválido ou expirado'
            })
        }
    }
}