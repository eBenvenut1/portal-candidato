import vine from '@vinejs/vine'

/**
 * Validator para criação de usuário
 */
export const createUserValidator = vine.compile(
  vine.object({
    full_name: vine
      .string()
      .minLength(3)
      .maxLength(255)
      .trim(),

    email: vine
      .string()
      .email()
      .normalizeEmail()
      .unique(async (db, value) => {
        const user = await db.from('users').where('email', value).first()
        return !user
      }),

    password: vine
      .string()
      .minLength(5)
      .maxLength(255),

    confirmPassword: vine
      .string()
      .sameAs('password'),

    habilidade: vine
      .string()
      .maxLength(255)
      .minLength(2)
      .trim()
      .optional(),

      formacao: vine
      .string()
      .minLength(3)
      .maxLength(50),

      telefone: vine
      .string()
      .minLength(9)
      .maxLength(13),

    endereco: vine
      .string()
      .minLength(10)
      .maxLength(500)
      .trim(),

    cep: vine
      .string()
      .regex(/^\d{5}-?\d{3}$/)
      .trim()
  })
)