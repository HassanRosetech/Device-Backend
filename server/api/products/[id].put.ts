import { neon } from '@neondatabase/serverless'

export default defineEventHandler(async (event) => {
  const { databaseUrl } = useRuntimeConfig()
  const db = neon(databaseUrl)

  try {
    const body = await readBody(event)

    const {
      id,
      child_id ,
      mrp  ,
      price , 
      title ,
      ratingstars ,
      image ,
    } = body

    const result = await db`
      UPDATE child_banners
      SET child_id = ${child_id},
          mrp = ${mrp},
           price = ${price},
            title = ${title},
             ratingstars = ${ratingstars},
             image = ${image}
          
      WHERE id = ${id}
      RETURNING *;
    `

    return {
      message: 'Banner updated successfully',
      tab: result[0]
    }

  } catch (error) {
    console.error('🔥 Banner update error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update Banner: ' + error.message
    })
  }
})
