import { neon } from '@neondatabase/serverless'

export default defineEventHandler(async (event) => {
  const { databaseUrl } = useRuntimeConfig()
  const db = neon(databaseUrl)

  try {
    const body = await readBody(event)

    const {
        tab_id,
        childtype ,
        
      
    } = body

    const result = await db`
      INSERT INTO tab_children  (
       tab_id , childtype 
      )
      VALUES (
        ${tab_id}, ${childtype}

      )
      RETURNING *;
    `

    return {
      message: 'TabChildren created successfully',
      blog: result[0]
    }

  } catch (error) {
    console.error('🔥 TabChildren creation error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create blog: ' + error.message
    })
  }
})
