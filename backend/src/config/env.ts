function required(key: string): string {
  const value = process.env[key]
  if (!value) throw new Error(`Variável de ambiente obrigatória não definida: ${key}`)
  return value
}

export const env = {
  jwtSecret:   required('JWT_SECRET'),
  port:        Number(process.env.PORT ?? 4000),
  corsOrigin:  process.env.CORS_ORIGIN ?? 'http://localhost:5173',
}
