import { neon } from '@neondatabase/serverless'

export default defineEventHandler(async (event) => {
  const { databaseUrl } = useRuntimeConfig()
  const db = neon(databaseUrl)

  try {
    const body = await readBody(event)

    const {
      id,
      name,
      active,
      display_title,
      tab_id
    } = body

    const result = await db`
      UPDATE tabs
      SET name = ${name},
          active = ${active},
          display_title = ${display_title},
          tab_id = ${tab_id}
      WHERE id = ${id}
      RETURNING *;
    `

    return {
      message: 'Tab updated successfully',
      tab: result[0]
    }

  } catch (error) {
    console.error('🔥 Tab update error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update tab: ' + error.message
    })
  }
})
