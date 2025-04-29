import { neon } from '@neondatabase/serverless'

export default defineEventHandler(async (event) => {
    const { databaseUrl } = useRuntimeConfig()
    const db = neon(databaseUrl)
  try {
    const result = await db.query(`
        SELECT 
          id, 
          email, 
          subscribed, 
          TO_CHAR(subscription_date, 'YYYY-MM-DD') AS subscription_date 
        FROM newsletter_subscribers 
        ORDER BY subscription_date DESC , id DESC
      `);
    return result
    
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return sendError(event, createError({ statusCode: 500, statusMessage: 'Failed to fetch subscribers' }));
  }
});
