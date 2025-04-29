import { neon } from '@neondatabase/serverless'

export default defineEventHandler(async (event) => {
  const { databaseUrl } = useRuntimeConfig()
  const db = neon(databaseUrl)

  const subscriberId = event.context.params.id; // Get the subscriber ID from the URL

  try {
    // Run the DELETE query
    const result = await db.query(`
      DELETE FROM newsletter_subscribers 
      WHERE id = $1
    `, [subscriberId]);

    // If the subscriber was deleted, send a success response
    // if (result.rowCount > 0) {
      return { success: true, message: "Subscriber deleted successfully" };
    // } else {
    //   // If no rows were deleted, the subscriber was not found
    //   return { success: false, message: "Subscriber not found" };
    // }

  } catch (error) {
    console.error('Error deleting subscriber:', error);
    return { success: false, message: 'Failed to delete subscriber' }; // Simplified error handling
  }
});
