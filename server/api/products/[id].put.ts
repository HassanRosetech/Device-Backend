import { neon } from '@neondatabase/serverless'

export default defineEventHandler(async (event) => {
  const { databaseUrl } = useRuntimeConfig()
  const db = neon(databaseUrl)

  try {
    const body = await readBody(event)

    const {
      id,
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
      UPDATE products
      SET
        name = ${name},
        description = ${description},
        category = ${category},
        manufacturer = ${manufacturer},
        total_purchases = ${total_purchases},
        available = ${available},
        first_available_date = ${first_available_date},
        in_stock = ${in_stock},
        total_reviews = ${total_reviews},
        brand = ${brand},
        type = ${type},
        feature = ${feature},
        mrp = ${mrp},
        price = ${price},
        rating_stars = ${rating_stars},
        is_new = ${is_new},
        discount = ${discount},
        department = ${department}
      WHERE id = ${id}
      RETURNING *;
    `

    return {
      message: 'Product updated successfully',
      product: result[0]
    }

  } catch (error: any) {
    console.error('🔥 Product update error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update product: ' + error.message
    })
  }
})
