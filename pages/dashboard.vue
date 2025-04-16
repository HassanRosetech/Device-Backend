<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";

const blogs = ref([]);

onMounted(async () => {
  const res = await axios.get("/api/blogs");
  blogs.value = res.data;
});
</script>

<template>
  <div>
    <h1>Blog Dashboard</h1>
    <ul>
      <li v-for="blog in blogs" :key="blog.id">{{ blog.title }}</li>
    </ul>
  </div>
</template>
