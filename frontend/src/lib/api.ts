import axios from 'axios'
import type { ClassifyResult } from '../types'

const BASE_URL = import.meta.env.VITE_API_URL ?? ''

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 60_000,
})

export async function classifyEmail(payload: { file?: File; text?: string }): Promise<ClassifyResult> {
  const form = new FormData()
  if (payload.file) form.append('file', payload.file)
  if (payload.text) form.append('text', payload.text)

  const { data } = await client.post<ClassifyResult>('/api/classify', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}
