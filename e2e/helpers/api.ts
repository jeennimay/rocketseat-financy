import { APIRequestContext } from '@playwright/test'

const GQL_URL = 'http://localhost:4000/graphql'

export async function gqlRequest(
  request: APIRequestContext,
  query: string,
  token?: string,
) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await request.post(GQL_URL, {
    headers,
    data: JSON.stringify({ query }),
  })
  return res.json()
}
