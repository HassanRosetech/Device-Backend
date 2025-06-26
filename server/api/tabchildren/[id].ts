import { neon } from '@neondatabase/serverless'

export default defineCachedEventHandler(
  async (event) => {
    const { databaseUrl } = useRuntimeConfig()
    const db = neon(databaseUrl)

    const id = getRouterParam(event, 'id') // Grabs `id` from the URL (e.g., /api/tabs/123)

    if (!id || isNaN(Number(id))) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid tabChildren ID',
      })
    }

    try {
      const result = await db`SELECT * FROM tab_children WHERE id = ${Number(id)}`

      if (result.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'TabChildren not found',
        })
      }

      return result[0]
    } catch (error) {
      console.error('🔥 Database query failed:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Database error: ' + error.message,
      })
    }
  },
  {
    maxAge: 1 * 1 * 1, // 1 day in seconds
  }
)
