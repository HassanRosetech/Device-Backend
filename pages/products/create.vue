<template>
  <div class="container py-4">
    <div class="products-list">
      <h1>Products List</h1>

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Child Tab</th>
            <th>MRP</th>
            <th>Price</th>
            <th>Rating</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id">
            <td>{{ product.title }}</td>
            <td>{{ getChildTabName(product.child_id) }}</td>
            <td>{{ product.mrp.toFixed(2) }}</td>
            <td>{{ product.price.toFixed(2) }}</td>
            <td>{{ product.ratingstars }}/5</td>
            <td>
              <img
                v-if="product.image"
                :src="product.image"
                alt="Product image"
                class="product-image"
              />
              <span v-else>—</span>
            </td>
          </tr>
          <tr v-if="products.length === 0">
            <td colspan="6" class="no-data">No products found.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const products = ref([]);
const tabChildren = ref([]);

// Load child tabs and products from API on mount
onMounted(async () => {
  try {
    //tabChildren.value = await $fetch("/api/tabchildren");
    products.value = await $fetch("/api/products");
  } catch (err) {
    console.error("❌ Failed to load data:", err);
    alert("Failed to load products or tabs. Please try again.");
  }
});

// Helper to get child tab name from ID
const getChildTabName = (childId) => {
  const child = tabChildren.value.find((c) => c.id === childId);
  return child ? `${child.childtype} (${child.tab_name})` : "Unknown";
};
</script>

<style scoped>
.products-list {
  max-width: 900px;
  margin: auto;
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  border: 1px solid #eaeaea;
}

.products-list h1 {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #333;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead th {
  text-align: left;
  padding: 0.75rem;
  background-color: #f7f7f7;
  border-bottom: 2px solid #ddd;
  font-weight: 600;
  color: #555;
}

tbody td {
  padding: 0.75rem;
  border-bottom: 1px solid #eee;
  vertical-align: middle;
}

.product-image {
  max-width: 60px;
  max-height: 60px;
  border-radius: 6px;
  object-fit: cover;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.no-data {
  text-align: center;
  color: #777;
  font-style: italic;
  padding: 1rem 0;
}
</style>
