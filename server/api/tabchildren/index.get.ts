import { neon } from '@neondatabase/serverless'

export default defineCachedEventHandler(
  async (event) => {
    const { databaseUrl } = useRuntimeConfig()
    const db = neon(databaseUrl)

    try {
      const result = await db`SELECT id,  tab_id , (SELECT  name from tabs WHERE tabs.id = tab_children.tab_id ) as tab_name , childtype FROM tab_children ORDER BY id DESC`
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
