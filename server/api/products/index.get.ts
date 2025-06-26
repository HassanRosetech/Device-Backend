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
        FROM products
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
    // maxAge: 60 * 60 * 24, // 1 day in seconds
      maxAge: 1 * 1 * 1, // 1 day in seconds
  }
)
