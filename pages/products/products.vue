<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

const products = ref([]);
const currentPage = ref(1);
const pageSize = 10;

const router = useRouter();

function goToCreate() {
  router.push("/products/create"); // Update with your create product route
}

function goToEdit(id) {
  router.push(`/products/edit/${id}`);
}

async function confirmDelete(id) {
  const confirm = window.confirm(
    "Are you sure you want to delete this product?"
  );
  if (!confirm) return;

  try {
    await $fetch(`/api/products/${id}`, {
      method: "DELETE",
    });

    // Remove from local state
    products.value = products.value.filter((p) => p.id !== id);
  } catch (err) {
    console.error("Failed to delete product:", err);
    alert("Error deleting product. See console for details.");
  }
}

onMounted(async () => {
  try {
    const res = await $fetch("/api/products");
    products.value = res;
  } catch (err) {
    console.error("Failed to load products:", err);
  }
});

const totalPages = computed(() => Math.ceil(products.value.length / pageSize));

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return products.value.slice(start, start + pageSize);
});

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
}

function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
}

definePageMeta({
  layout: "dashboard",
});
</script>

<template>
  <div class="product-list-container">
    <div class="actions">
      <button @click="goToCreate" class="create-btn">+ New Product</button>
    </div>

    <div class="table-wrapper">
      <table v-if="paginatedProducts.length" class="product-table">
        <thead>
          <tr>
            <th class="sticky-col sticky-header">ID</th>
            <th class="sticky-header">Name</th>
            <th class="sticky-header">Description</th>
            <th class="sticky-header">Category</th>
            <th class="sticky-header">Manufacturer</th>
            <th class="sticky-header">Total Purchases</th>
            <th class="sticky-header">Available</th>
            <th class="sticky-header">First Available Date</th>
            <th class="sticky-header">In Stock</th>
            <th class="sticky-header">Total Reviews</th>
            <th class="sticky-header">Brand</th>
            <th class="sticky-header">Type</th>
            <th class="sticky-header">Feature</th>
            <th class="sticky-header">MRP</th>
            <th class="sticky-header">Price</th>
            <th class="sticky-header">Rating Stars</th>
            <th class="sticky-header">Is New</th>
            <th class="sticky-header">Discount (%)</th>
            <th class="sticky-header">Department</th>
            <th class="sticky-header">Edit</th>
            <th class="sticky-header">Delete</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in paginatedProducts" :key="p.id">
            <td class="sticky-col">{{ p.id }}</td>
            <td>{{ p.name }}</td>
            <td>{{ p.description }}</td>
            <td>{{ p.category }}</td>
            <td>{{ p.manufacturer }}</td>
            <td>{{ p.total_purchases }}</td>
            <td>
              <span :class="p.available ? 'yes' : 'no'">
                {{ p.available ? "Yes" : "No" }}
              </span>
            </td>
            <td>
              {{
                p.first_available_date
                  ? new Date(p.first_available_date).toLocaleDateString()
                  : "-"
              }}
            </td>
            <td>{{ p.in_stock }}</td>
            <td>{{ p.total_reviews }}</td>
            <td>{{ p.brand }}</td>
            <td>{{ p.type }}</td>
            <td>{{ p.feature }}</td>
            <td>${{ Number(p.mrp).toFixed(2) }}</td>
            <td>${{ Number(p.price).toFixed(2) }}</td>
            <td>{{ p.rating_stars }}</td>
            <td>{{ p.is_new ? "Yes" : "No" }}</td>
            <td>{{ p.discount }}%</td>
            <td>{{ p.department }}</td>
            <td>
              <button class="icon-btn" @click="goToEdit(p.id)" title="Edit">
                ✏️
              </button>
            </td>
            <td>
              <button
                class="icon-btn delete"
                @click="confirmDelete(p.id)"
                title="Delete"
              >
                🗑️
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else>No products found.</p>
    </div>

    <div v-if="totalPages > 1" class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1" class="page-btn">
        Previous
      </button>

      <button
        v-for="page in totalPages"
        :key="page"
        @click="currentPage = page"
        :class="['page-btn', { active: currentPage === page }]"
      >
        {{ page }}
      </button>

      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="page-btn"
      >
        Next
      </button>
    </div>
  </div>
</template>

<style scoped>
.product-list-container {
  max-width: 1000px;
  margin: auto;
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  border: 1px solid #eee;
}

.actions {
  margin-bottom: 1.5rem;
  text-align: left;
}

.create-btn {
  background-color: #007bff;
  color: white;
  padding: 8px 16px;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.create-btn:hover {
  background-color: #0056b3;
}

.table-wrapper {
  overflow-x: auto;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.product-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1200px; /* allow horizontal scrolling */
  margin-bottom: 1rem;
}

.product-table th,
.product-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #eaeaea;
  font-size: 0.95rem;
  white-space: nowrap;
}

.product-table th {
  background-color: #f9f9f9;
  font-weight: 600;
  color: #333;
  position: sticky;
  top: 0;
  z-index: 2;
}

/* Sticky first column */
.sticky-col {
  position: sticky;
  left: 0;
  background: white;
  z-index: 3;
  box-shadow: 2px 0 5px -2px rgba(0, 0, 0, 0.1);
}

.yes {
  color: green;
  font-weight: bold;
}

.no {
  color: red;
  font-weight: bold;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 1.5rem;
  flex-wrap: wrap;
}

.page-btn {
  padding: 6px 14px;
  border-radius: 6px;
  border: 1px solid #ccc;
  background-color: #f3f3f3;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 36px;
  text-align: center;
  user-select: none;
}

.page-btn:hover:not(:disabled) {
  background-color: #e2e2e2;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-btn.active {
  background-color: #4caf50;
  color: white;
  font-weight: bold;
  border-color: #4caf50;
  cursor: default;
}

.edit-btn {
  background-color: #ffc107;
  color: #000;
  padding: 6px 12px;
  font-size: 0.85rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.edit-btn:hover {
  background-color: #e0a800;
}
.icon-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  padding: 4px 8px;
  line-height: 1;
  transition: transform 0.2s ease;
}

.icon-btn:hover {
  transform: scale(1.2);
}
.icon-btn.delete {
  color: red;
}

.icon-btn.delete:hover {
  transform: scale(1.2);
  color: darkred;
}
</style>
