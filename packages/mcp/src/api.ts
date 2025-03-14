import axios from 'axios'
import 'dotenv/config'

interface AuthorDTO {
  name: string
  url: string
  avatar: string
}

interface PromptDTO {
  id: string
  description: string
  globs: string
  content: string
  filePath: string
}

interface RuleDTO {
  name: string
  description: string
  type: string
  slug: string
  author: AuthorDTO
  prompts: PromptDTO[]
  filePath: string
  ranking?: number
}

export const client = axios.create({
  baseURL: process.env.API_BASE_URL ?? '',
})

export function findRules(q?: string) {
  const params = { q }

  return client.get<RuleDTO[]>('/rules', { params })
}
