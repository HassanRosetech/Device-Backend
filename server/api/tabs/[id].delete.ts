import { neon } from '@neondatabase/serverless';
import { defineEventHandler, getRouterParam, createError } from 'h3';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const db = neon(config.databaseUrl);

  const id = getRouterParam(event, 'id');

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing tab ID',
    });
  }

  try {
    const result = await db`DELETE FROM tabs WHERE id = ${id}`;

    return {
      message: 'Tab deleted successfully',
      deleted: result,
    };
  } catch (error) {
    console.error('🔥 Tab deletion error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete tab: ' + error.message,
    });
  }
});
