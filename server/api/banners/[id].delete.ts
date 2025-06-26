import { neon } from '@neondatabase/serverless';
import { defineEventHandler, getRouterParam, createError } from 'h3';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const db = neon(config.databaseUrl);

  const id = getRouterParam(event, 'id');

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing Banner ID',
    });
  }

  try {
    const result = await db`DELETE FROM child_banners  WHERE id = ${id}`;

    return {
      message: 'Banner deleted successfully',
      deleted: result,
    };
  } catch (error) {
    console.error('🔥 Banner deletion error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete tab: ' + error.message,
    });
  }
});
