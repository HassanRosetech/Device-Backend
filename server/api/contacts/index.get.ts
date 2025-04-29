import { neon } from '@neondatabase/serverless'

export default defineEventHandler(async (event) => {
    const { databaseUrl } = useRuntimeConfig()
    const db = neon(databaseUrl)
  try {
    const result = await db.query(`
        SELECT 
          id, 
          first_name,
          last_name,
          email, 
          subject,
          comment,
          TO_CHAR(submitted_at, 'YYYY-MM-DD') AS submitted_at 
        FROM contact_us 
        ORDER BY submitted_at DESC , id DESC
      `);
    return result
    
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return sendError(event, createError({ statusCode: 500, statusMessage: 'Failed to fetch contacts' }));
  }
});
