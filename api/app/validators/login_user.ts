import vine from '@vinejs/vine'

/**
 * Validator para login de usuário
 */
export const loginUserValidator = vine.compile(
  vine.object({
    email: vine
      .string()
      .trim()
      .email()
      .normalizeEmail(),

    password: vine
      .string()
      .minLength(3)
  }),

)

