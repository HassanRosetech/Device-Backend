import { neon } from '@neondatabase/serverless'

export default defineCachedEventHandler(
  async (event) => {
    const { databaseUrl } = useRuntimeConfig()
    const db = neon(databaseUrl)

    const id = getRouterParam(event, 'id') // Grabs `id` from the URL (e.g., /api/product/123)

    if (!id || isNaN(Number(id))) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid product ID',
      })
    }

    try {
      const result = await db`SELECT * FROM products WHERE id = ${Number(id)}`

      if (result.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Product not found',
        })
      }

      return result[0]
    } catch (error: any) {
      console.error('🔥 Database query failed:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Database error: ' + error.message,
      })
    }
  },
  {
    maxAge: 1 * 1 * 1, // Cache for 1 day
  }
)
