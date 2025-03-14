import { createApp, createRouter, defineEventHandler, toNodeListener } from 'h3'
import { createServer } from 'node:http'
import { createMcp } from './handlers/mcp'

const { onSse, onMsg } = createMcp()

export const app = createApp()
const router = createRouter()

router.get(
  '/',
  defineEventHandler(() => ({ status: '✅' }))
)
router.get('/sse', onSse)
router.post('/messages', onMsg)

app.use(router)

createServer(toNodeListener(app))
