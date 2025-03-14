import { z } from 'zod'
import path from 'path'
import Fuse from 'fuse.js'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { findRules } from '../api'

const RULE_NAME = 'findrule'
const RULE_DESCRIPTION =
  'Retrieve a cursor AI rule based on the provided query.'

const findAndStreamPromptData = async (q: string) => {
  const options = {
    keys: ['name', 'description'],
    threshold: 0.3,
  }

  const { data: list } = await findRules()
  const fuse = new Fuse(list, options)
  const result = fuse.search(q)
  const [rule] = result

  return rule.item
}

function createMsg(value: {
  fileName: string
  filePath: string
  fileData: string
}) {
  // Format the response as Markdown
  const message = `
### 🚀 File Ready: **${value.fileName}**

To save this file, follow these steps:

1. Copy the content below.
2. Create a new file in your workspace at:  
   \`${value.filePath}\`
3. Paste the content into the file.

---

**Content:**

\`\`\`markdown
${value.fileData}
\`\`\`
`

  return message
}

export const register = (server: McpServer) =>
  server.tool(RULE_NAME, RULE_DESCRIPTION, { q: z.string() }, async ({ q }) => {
    const rule = await findAndStreamPromptData(q)
    const [prompt] = rule.prompts

    const fileName = path.basename(prompt.filePath)
    const filePath = path.join('.cursor', 'rules')

    const metadata = [
      `---`,
      `# Specify the following for Cursor rules`,
      `description: ${prompt.description}`,
      `globs: ${prompt.globs}`,
      `alwaysApply: true`,
      `---`,
    ]
      .join('\n')
      .concat('\n\n')
    const title = `# ${prompt.id}\n\n`
    const content = [prompt.content].join('\n\n')
    const fileData = metadata + title + content

    return {
      content: [
        {
          type: 'text',
          mimeType: 'text/markdown',
          text: createMsg({ fileName, filePath, fileData }),
        },
      ],
    }
  })
