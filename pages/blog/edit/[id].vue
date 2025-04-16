<template>
  <div class="container py-4">
    <h2 class="mb-4">Edit Blog</h2>

    <form @submit.prevent="updateBlog">
      <!-- Title -->
      <div class="mb-3">
        <label class="form-label">Title</label>
        <input v-model="blog.title" class="form-control" required />
      </div>

      <!-- Slug -->
      <div class="mb-3">
        <label class="form-label">Slug</label>
        <input v-model="blog.slug" class="form-control" required />
      </div>

      <!-- Content -->
      <!-- <div class="mb-3">
        <label class="form-label">Content</label>

        <textarea v-model="blog.content" class="form-control" rows="6" />
      </div> -->

      <!-- Content -->
      <div class="mb-3">
        <label class="form-label">Content</label>
        <div ref="editorContainer" class="quill-editor" />
      </div>

      <!-- Author -->
      <div class="mb-3">
        <label class="form-label">Author Name</label>
        <input v-model="blog.author_name" class="form-control" />
      </div>

      <!-- Image URL -->
      <div class="mb-3">
        <label class="form-label">Image</label>
        <!-- <input v-model="blog.image" class="form-control" /> -->
        <div v-if="blog.image" class="mt-2">
          <img
            :src="blog.image"
            alt="Preview"
            class="img-thumbnail"
            style="max-width: 200px"
          />
        </div>
      </div>

      <!-- SEO Fields -->
      <div class="mb-3">
        <label class="form-label">SEO Title</label>
        <input v-model="blog.seo_title" class="form-control" />
      </div>

      <div class="mb-3">
        <label class="form-label">SEO Description</label>
        <textarea
          v-model="blog.seo_description"
          class="form-control"
          rows="2"
        />
      </div>

      <div class="mb-3">
        <label class="form-label">SEO Keywords (comma-separated)</label>
        <input v-model="blog.seo_keywords" class="form-control" />
      </div>

      <!-- Published -->
      <div class="form-check mb-4">
        <input
          class="form-check-input"
          type="checkbox"
          v-model="blog.is_published"
          id="publishedCheck"
        />
        <label class="form-check-label" for="publishedCheck"> Published </label>
      </div>

      <!-- <img
        :src="blog.image"
        alt="Preview"
        class="img-thumbnail"
        style="max-width: 200px"
      /> -->

      <!-- Blog Main Image Upload -->
      <!-- <div class="mb-3">
        <label class="form-label">Upload Image</label>
        <input
          type="file"
          @change="onImageSelected"
          class="form-control"
          accept="image/*"
        />
      </div> -->

      <!-- Submit -->
      <button class="btn btn-success" type="submit">Update Blog</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import Quill from "quill";
import "quill/dist/quill.snow.css";

export default {
  data() {
    return {
      blog: {},
      error: null,
      quillEditor: null,
    };
  },
  async mounted() {
    const id = this.$route.params.id;

    try {
      const response = await axios.get(`/api/blogs/${id}`);
      this.blog = response.data;

      // Initialize Quill after data loads
      this.$nextTick(() => {
        const container = this.$refs.editorContainer;
        if (container) {
          this.quillEditor = new Quill(container, {
            theme: "snow",
            placeholder: "Edit blog content...",
            modules: {
              toolbar: [
                [{ header: "1" }, { header: "2" }],
                ["bold", "italic", "underline"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["link", "image"],
                ["clean"],
              ],
            },
          });

          this.quillEditor.root.innerHTML = this.blog.content;

          this.quillEditor.on("text-change", () => {
            this.blog.content = this.quillEditor.root.innerHTML;
          });
        }
      });
    } catch (err) {
      console.error("Failed to load blog data:", err);
      this.error = "Failed to load blog data.";
    }
  },
  methods: {
    async onImageSelected(event) {
      const file = event.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await axios.post("/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        // Assume the response gives you the uploaded image URL
        this.blog.image = response.data.url;
      } catch (error) {
        console.error("Image upload failed:", error);
        alert("Failed to upload image.");
      }
    },

    async updateBlog() {
      try {
        // Ensure content is up-to-date before sending
        if (this.quillEditor) {
          this.blog.content = this.quillEditor.root.innerHTML;
        }

        await axios.put(`/api/blogs/${this.blog.id}`, this.blog);
        alert("✅ Blog updated successfully!");
        this.$router.push("/blogs");
      } catch (error) {
        console.error("❌ Failed to update blog:", error);
        alert("Failed to update blog. Please try again.");
      }
    },
  },
};

definePageMeta({
  layout: "dashboard",
});
</script>
<style scoped>
.quill-editor {
  min-height: 250px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #fff;
}
</style>
