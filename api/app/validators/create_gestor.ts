import vine from '@vinejs/vine'

/**
 * Validator para criação de usuário
 */
export const createGestorValidator = vine.compile(
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

    })
)