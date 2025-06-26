import { neon } from '@neondatabase/serverless'

export default defineCachedEventHandler(
  async (event) => {
    const { databaseUrl } = useRuntimeConfig()
    const db = neon(databaseUrl)

    try {
      const result = await db`
        SELECT
          id,
          name,
          description,
          category,
          manufacturer,
          total_purchases,
          available,
          first_available_date,
          in_stock,
          total_reviews,
          brand,
          type,
          feature,
          mrp,
          price,
          rating_stars,
          is_new,
          discount,
          department
        FROM product
        ORDER BY id DESC
      `
      return result
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
