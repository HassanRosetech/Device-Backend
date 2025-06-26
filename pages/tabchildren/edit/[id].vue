<template>
  <div class="container py-4">
    <h2 class="mb-4">Edit Tab Child</h2>

    <!-- Render form only when tabChild data is loaded -->
    <form v-if="tabChild" @submit.prevent="updateTabChild">
      <!-- Parent Tab -->
      <div class="mb-3">
        <label class="form-label">Parent Tab</label>
        <select v-model="tabChild.tab_id" class="form-control" required>
          <option disabled value="">Select a tab</option>
          <option v-for="tab in tabs" :key="tab.id" :value="tab.id">
            {{ tab.name }}
          </option>
        </select>
      </div>

      <!-- Child Type -->
      <div class="mb-3">
        <label class="form-label">Child Type</label>
        <input v-model="tabChild.childtype" class="form-control" required />
      </div>

      <!-- Submit -->
      <button class="btn btn-success" type="submit">Update Tab Child</button>
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
      tabChild: null,
      tabs: [],
      error: null,
    };
  },
  async mounted() {
    const id = this.$route.params.id;

    try {
      const [childRes, tabsRes] = await Promise.all([
        axios.get(`/api/tabchildren/${id}`),
        axios.get(`/api/tabs`),
      ]);
      this.tabChild = childRes.data;
      this.tabs = tabsRes.data;
    } catch (err) {
      console.error("Failed to load data:", err);
      this.error = "Failed to load tab child or tabs.";
    }
  },
  methods: {
    async updateTabChild() {
      try {
        await axios.put(`/api/tabchildren/${this.tabChild.id}`, this.tabChild);
        alert("✅ Tab Child updated successfully!");
        this.$router.push("/tabchildren");
      } catch (error) {
        console.error("❌ Failed to update tab child:", error);
        alert("Failed to update tab child. Please try again.");
      }
    },
  },
};

definePageMeta({
  layout: "dashboard",
});
</script>

<style scoped></style>
