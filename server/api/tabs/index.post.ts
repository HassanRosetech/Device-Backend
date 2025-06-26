import { neon } from '@neondatabase/serverless'

export default defineEventHandler(async (event) => {
  const { databaseUrl } = useRuntimeConfig()
  const db = neon(databaseUrl)

  try {
    const body = await readBody(event)

    const {
        data_id,
        name,
        active,
        display_title,
        tab_id,
      
    } = body

    const result = await db`
      INSERT INTO tabs (
       data_id , name , active , display_title , tab_id
      )
      VALUES (
        ${1}, ${name}, ${active}, ${display_title}, ${name}

      )
      RETURNING *;
    `

    return {
      message: 'Tab created successfully',
      blog: result[0]
    }

  } catch (error) {
    console.error('🔥 Tab creation error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create blog: ' + error.message
    })
  }
})
