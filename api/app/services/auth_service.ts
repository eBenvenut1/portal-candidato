// // services/AuthService.ts
// import { createHmac } from 'node:crypto'
// import User from '#models/user'

// class AuthService {
//   private static instance: AuthService
//   private currentUser: any = null

//   static getInstance() {
//     if (!AuthService.instance) {
//       AuthService.instance = new AuthService()
//     }
//     return AuthService.instance
//   }

//   verifyToken(token: string) {
//     try {
//       const [encodedHeader, encodedPayload, signature] = token.split('.')
      
//       if (!encodedHeader || !encodedPayload || !signature) {
//         throw new Error('Invalid token format')
//       }

//       const secret = process.env.JWT_SECRET || 'your-secret-key'
      
//       const expectedSignature = createHmac('sha256', secret)
//         .update(`${encodedHeader}.${encodedPayload}`)
//         .digest('base64url')
      
//       if (signature !== expectedSignature) {
//         throw new Error('Invalid signature')
//       }

//       const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString())
      
//       if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
//         throw new Error('Token expired')
//       }

//       return payload
//     } catch (error) {
//       throw error
//     }
//   }

//   async authenticateUser(token: string) {
//     const decoded = this.verifyToken(token)
//     const user = await User.find(decoded.userId)
    
//     if (!user) {
//       throw new Error('User not found')
//     }

//     this.currentUser = {
//       id: user.id,
//       email: user.email,
//       fullName: user.fullName,
//       habilidade: user.habilidade,
//       endereco: user.endereco,
//       cep: user.cep
//     }

//     return this.currentUser
//   }

//   getCurrentUser() {
//     return this.currentUser
//   }

//   clearUser() {
//     this.currentUser = null
//   }
// }

// export default AuthService