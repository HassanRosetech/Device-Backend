<template>
  <div class="container py-4">
    <h2 class="mb-4">Edit Banner</h2>

    <!-- Render form only when banner data is loaded -->
    <form v-if="banner" @submit.prevent="updateBanner">
      <!-- Child Tab -->
      <div class="mb-3">
        <label class="form-label">Tab Child</label>
        <select v-model="banner.child_id" class="form-control" required>
          <option disabled value="">Select a Tab Child</option>
          <option
            v-for="child in tabChildren"
            :key="child.id"
            :value="child.id"
          >
            {{ child.tab_name || "Unknown Tab" }} - {{ child.childtype }}
          </option>
        </select>
      </div>

      <!-- Title -->
      <div class="mb-3">
        <label class="form-label">Title</label>
        <input v-model="banner.title" class="form-control" required />
      </div>

      <!-- MRP -->
      <div class="mb-3">
        <label class="form-label">MRP</label>
        <input
          v-model.number="banner.mrp"
          type="number"
          step="0.01"
          class="form-control"
        />
      </div>

      <!-- Price -->
      <div class="mb-3">
        <label class="form-label">Price</label>
        <input
          v-model.number="banner.price"
          type="number"
          step="0.01"
          class="form-control"
        />
      </div>

      <!-- Rating Stars -->
      <div class="mb-3">
        <label class="form-label">Rating Stars</label>
        <input
          v-model.number="banner.ratingstars"
          type="number"
          min="0"
          max="5"
          class="form-control"
        />
      </div>

      <!-- Image URL -->
      <!-- <div class="mb-3">
        <label class="form-label">Image URL</label>
        <input v-model="banner.image" type="text" class="form-control" />
      </div> -->

      <!-- Display current image -->
      <div class="mb-3" v-if="banner.image">
        <label class="form-label d-block">Current Image</label>
        <img :src="banner.image" alt="Current Image" style="max-width: 200px" />
      </div>

      <!-- Upload new image -->
      <div class="mb-3">
        <label class="form-label">Upload New Image</label>
        <input
          type="file"
          @change="handleFileChange"
          accept="image/*"
          class="form-control"
        />
      </div>

      <!-- Submit -->
      <button class="btn btn-success" type="submit">Update Banner</button>
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
      banner: null,
      tabChildren: [],
      error: null,
      selectedFile: null,
    };
  },
  async mounted() {
    const id = this.$route.params.id;

    try {
      const [bannerRes, childRes] = await Promise.all([
        axios.get(`/api/banners/${id}`),
        axios.get(`/api/tabchildren/`),
      ]);
      this.banner = bannerRes.data;
      this.tabChildren = childRes.data;
    } catch (err) {
      console.error("Failed to load data:", err);
      this.error = "Failed to load banner or tab children.";
    }
  },
  methods: {
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.selectedFile = file;
      }
    },
    async updateBanner() {
      try {
        // Upload image if a new file is selected
        if (this.selectedFile) {
          const formData = new FormData();
          formData.append("file", this.selectedFile);

          const uploadResponse = await axios.post("/api/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          this.banner.image = uploadResponse.data.url;
        }

        // Update banner data
        await axios.put(`/api/banners/${this.banner.id}`, this.banner);

        alert("✅ Banner updated successfully!");
        this.$router.push("/banners");
      } catch (error) {
        console.error(
          "❌ Failed to update banner:",
          error.response?.data || error
        );
        alert("Failed to update banner. See console.");
      }
    },
  },
};
</script>

<script setup>
definePageMeta({
  layout: "dashboard",
});
</script>
