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
      <div class="mb-3">
        <label class="form-label">Content</label>
        <div ref="editorContainer" class="quill-editor" />
      </div>

      <!-- Author -->
      <div class="mb-3">
        <label class="form-label">Author Name</label>
        <input v-model="blog.author_name" class="form-control" />
      </div>

      <!-- Image URL Preview -->
      <div class="mb-3">
        <label class="form-label">Blog Image</label>
        <input type="file" @change="onImageSelected" class="form-control" />
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
      selectedFile: null,
      error: null,
      quillEditor: null,
    };
  },
  async mounted() {
    const id = this.$route.params.id;

    try {
      const response = await axios.get(`/api/blogs/${id}`);
      this.blog = response.data;

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
    onImageSelected(event) {
      const file = event.target.files[0];
      if (!file) return;
      this.selectedFile = file;

      // Optional preview
      const reader = new FileReader();
      reader.onload = () => {
        this.blog.image = reader.result;
      };
      reader.readAsDataURL(file);
    },

    async updateBlog() {
      try {
        if (this.quillEditor) {
          this.blog.content = this.quillEditor.root.innerHTML;
        }

        // Upload image if file selected
        if (this.selectedFile) {
          const formData = new FormData();
          formData.append("file", this.selectedFile);

          const uploadRes = await axios.post("/api/upload", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          this.blog.image = uploadRes.data.url;
        }

        // Update blog entry
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
