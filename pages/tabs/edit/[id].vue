<template>
  <div class="container py-4">
    <h2 class="mb-4">Edit Tab</h2>

    <!-- Render form only when tab data is loaded -->
    <form v-if="tab" @submit.prevent="updateTab">
      <!-- Name -->
      <div class="mb-3">
        <label class="form-label">Name</label>
        <input v-model="tab.name" class="form-control" required />
      </div>

      <!-- Display Title -->
      <div class="mb-3">
        <label class="form-label">Display Title</label>
        <input v-model="tab.display_title" class="form-control" required />
      </div>

      <!-- Tab ID -->
      <div class="mb-3">
        <label class="form-label">Tab ID</label>
        <input v-model="tab.tab_id" class="form-control" required />
      </div>

      <!-- Category (data_id) -->
      <div class="mb-3">
        <label class="form-label">Category</label>
        <select v-model="tab.data_id" class="form-control" required>
          <option disabled value="">Select a category</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.type }}
          </option>
        </select>
      </div>

      <!-- Active -->
      <div class="form-check mb-4">
        <input
          class="form-check-input"
          type="checkbox"
          v-model="tab.active"
          id="activeCheck"
        />
        <label class="form-check-label" for="activeCheck"> Active </label>
      </div>

      <!-- Submit -->
      <button class="btn btn-success" type="submit">Update Tab</button>
    </form>

    <div v-else-if="error" class="alert alert-danger mt-4">
      {{ error }}
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      tab: null,
      categories: [],
      error: null,
    };
  },
  async mounted() {
    const id = this.$route.params.id;

    try {
      const [tabRes, catRes] = await Promise.all([
        axios.get(`/api/tabs/${id}`),
        axios.get(`/api/categories`),
      ]);
      this.tab = tabRes.data;
      this.categories = catRes.data;
    } catch (err) {
      console.error("Failed to load data:", err);
      this.error = "Failed to load tab or categories.";
    }
  },
  methods: {
    async updateTab() {
      try {
        await axios.put(`/api/tabs/${this.tab.id}`, this.tab);
        alert("✅ Tab updated successfully!");
        this.$router.push("/tabs/HurryUp");
      } catch (error) {
        console.error("❌ Failed to update tab:", error);
        alert("Failed to update tab. Please try again.");
      }
    },
  },
};

definePageMeta({
  layout: "dashboard",
});
</script>

<style scoped></style>
