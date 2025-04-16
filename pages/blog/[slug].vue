<template>
  <div class="container py-4" v-if="blog">
    <div class="card">
      <img
        :src="blog.image"
        class="card-img-top"
        alt="Blog Image"
        v-if="blog.image"
      />
      <div class="card-body">
        <h2 class="card-title">{{ blog.title }}</h2>
        <p class="text-muted">
          By {{ blog.author_name }} | {{ formatDate(blog.created_at) }}
        </p>
        <div class="card-text" v-html="blog.content"></div>
      </div>
    </div>
  </div>

  <div v-else-if="loading" class="text-center py-5">
    <p>Loading blog post...</p>
  </div>

  <div v-else class="text-center py-5 text-danger">
    <p>{{ error || "Blog not found." }}</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      blog: null,
      loading: true,
      error: null,
    };
  },
  async created() {
    const slug = this.$route.params.slug;

    try {
      console.log(slug);
      const response = await axios.get(`/api/blogs/slug/${slug}`);
      this.blog = response.data;
    } catch (error) {
      this.error = "Failed to load blog.";
      console.error(error);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    formatDate(dateStr) {
      if (!dateStr || dateStr === "Invalid Date") return "—";
      const parsedDate = new Date(dateStr);
      if (isNaN(parsedDate)) return "Invalid Date";
      return parsedDate.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },
  },
};

definePageMeta({
  layout: "dashboard",
});
</script>

<style scoped>
.card-img-top {
  max-height: 400px;
  object-fit: cover;
}
</style>
