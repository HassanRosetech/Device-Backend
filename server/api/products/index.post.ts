import { neon } from '@neondatabase/serverless'

export default defineEventHandler(async (event) => {
  const { databaseUrl } = useRuntimeConfig()
  const db = neon(databaseUrl)

  try {
    const body = await readBody(event)

    const {
      name,
      description,
      category,
      manufacturer,
      total_purchases,
      available,
      first_available_date,
      in_stock,
      total_reviews,
      brand,
      type,
      feature,
      mrp,
      price,
      rating_stars,
      is_new,
      discount,
      department,
    } = body

    const result = await db`
      INSERT INTO products (
        name,
        description,
        category,
        manufacturer,
        total_purchases,
        available,
        first_available_date,
        in_stock,
        total_reviews,
        brand,
        type,
        feature,
        mrp,
        price,
        rating_stars,
        is_new,
        discount,
        department
      ) VALUES (
        ${name},
        ${description},
        ${category},
        ${manufacturer},
        ${total_purchases},
        ${available},
        ${first_available_date},
        ${in_stock},
        ${total_reviews},
        ${brand},
        ${type},
        ${feature},
        ${mrp},
        ${price},
        ${rating_stars},
        ${is_new},
        ${discount},
        ${department}
      )
      RETURNING *;
    `

    return {
      success: true,
      data: result[0],
    }
  } catch (error: any) {
    console.error('🔥 Database insert failed:', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Database insert error: ' + error.message,
    })
  }
})
