import { neon } from '@neondatabase/serverless'

export default defineCachedEventHandler(
  async (event) => {
    const { databaseUrl } = useRuntimeConfig()
    const db = neon(databaseUrl)

    try {
      const result = await db`SELECT id,  child_id  , (SELECT  childtype  from tab_children  WHERE tab_children.id = child_banners .child_id  ) as childtype , mrp , price ,title ,ratingstars , image  FROM child_banners  ORDER BY id DESC`
      return result
    } catch (error) {
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
