function required(key: string): string {
  const value = process.env[key]
  if (!value) throw new Error(`Variável de ambiente obrigatória não definida: ${key}`)
  return value
}

/**
 * Parseia CORS_ORIGIN em uma lista de origens permitidas.
 * Aceita valor único ou múltiplos separados por vírgula.
 * Ex: "https://app.com" ou "https://app.com,https://staging.app.com"
 */
function parseCorsOrigins(raw: string): string | string[] {
  const origins = raw.split(',').map((o) => o.trim()).filter(Boolean)
  return origins.length === 1 ? origins[0] : origins
}

export const env = {
  jwtSecret:    required('JWT_SECRET'),
  port:         Number(process.env.PORT ?? 4000),
  corsOrigin:   parseCorsOrigins(process.env.CORS_ORIGIN ?? 'http://localhost:5173'),
}
