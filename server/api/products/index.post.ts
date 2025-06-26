import { neon } from '@neondatabase/serverless'

export default defineEventHandler(async (event) => {
  const { databaseUrl } = useRuntimeConfig()
  const db = neon(databaseUrl)

  try {
    const body = await readBody(event)

    const {
      child_id ,
      mrp  ,
      price , 
      title ,
      ratingstars ,
      image 
    } = body

    const result = await db`
      INSERT INTO child_banners   (
       child_id  , mrp  ,price ,title ,ratingstars ,image 
      )
      VALUES (
        ${child_id }, ${mrp }, ${price },${title }, ${ratingstars } , ${image }

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
