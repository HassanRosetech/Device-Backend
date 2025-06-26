import { neon } from '@neondatabase/serverless'

export default defineEventHandler(async (event) => {
  const { databaseUrl } = useRuntimeConfig()
  const db = neon(databaseUrl)

  try {
    const body = await readBody(event)

    const {
      id,
      tab_id,
      childtype,
    } = body

    const result = await db`
      UPDATE tabs
      SET tab_id = ${tab_id},
          childtype = ${childtype},
          
      WHERE id = ${id}
      RETURNING *;
    `

    return {
      message: 'TabChildren updated successfully',
      tab: result[0]
    }

  } catch (error) {
    console.error('🔥 TabChildren update error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update tab: ' + error.message
    })
  }
})
