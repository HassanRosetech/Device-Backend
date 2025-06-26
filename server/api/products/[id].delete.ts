import { neon } from '@neondatabase/serverless'
import { defineEventHandler, getRouterParam, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const db = neon(config.databaseUrl)

  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing product ID',
    })
  }

  try {
    const result = await db`DELETE FROM products WHERE id = ${id}`

    return {
      message: 'Product deleted successfully',
      deleted: result,
    }
  } catch (error: any) {
    console.error('🔥 Product deletion error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete product: ' + error.message,
    })
  }
})
