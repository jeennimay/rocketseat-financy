import jwt, { Secret, SignOptions } from 'jsonwebtoken'
import { env } from '../config/env'

export type JwtPayload = {
  id: string
  email: string
}

export const signJwt = (payload: JwtPayload, expiresIn: string = '1d'): string => {
  const options: SignOptions = { expiresIn: expiresIn as SignOptions['expiresIn'] }
  return jwt.sign(payload, env.jwtSecret as Secret, options)
}

export const verifyJwt = (token: string): JwtPayload => {
  return jwt.verify(token, env.jwtSecret as Secret) as JwtPayload
}
