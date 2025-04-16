<template>
  <div class="container py-4">
    <div class="blog-form">
      <h1>Create New Blog</h1>

      <form @submit.prevent="submitForm">
        <div>
          <label>Title</label>
          <input v-model="form.title" type="text" required />
        </div>

        <div>
          <label>Slug</label>
          <input v-model="form.slug" type="text" required />
        </div>

        <div>
          <label>Content</label>
          <!-- Quill Editor for rich text content -->

          <div ref="editorContainer" class="quill-editor"></div>
        </div>

        <div>
          <label>Author Name</label>
          <input v-model="form.author_name" type="text" required />
        </div>

        <div>
          <label>SEO Title</label>
          <input v-model="form.seo_title" type="text" />
        </div>

        <div>
          <label>SEO Description</label>
          <textarea v-model="form.seo_description" rows="3"></textarea>
        </div>

        <div>
          <label>SEO Keywords</label>
          <input v-model="form.seo_keywords" type="text" />
        </div>

        <div>
          <label>
            <input type="checkbox" v-model="form.is_published" />
            Published
          </label>
        </div>
        <div>
          <label>Featured Image</label>
          <input type="file" accept="image/*" @change="handleImageUpload" />
          <div v-if="form.image" class="mt-2">
            <img
              :src="form.image"
              alt="Preview"
              class="img-thumbnail"
              style="max-width: 200px; margin-top: 10px"
            />
          </div>
        </div>
        <button type="submit">Create Blog</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from "vue";
import { useRouter } from "vue-router";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const router = useRouter();

const form = ref({
  title: "",
  slug: "",
  content: "",
  author_name: "",
  seo_title: "",
  seo_description: "",
  seo_keywords: "",
  is_published: true,
  image: "",
});

const editorContainer = ref(null);
let quillEditor = null;

// Auto-generate slug from title
watch(
  () => form.value.title,
  (newTitle) => {
    form.value.slug = newTitle
      .toLowerCase()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-");
  }
);

onMounted(async () => {
  await nextTick(); // ensure DOM is fully rendered

  if (editorContainer.value) {
    quillEditor = new Quill(editorContainer.value, {
      // quillEditor = new Quill($refs.editorContainer, {
      theme: "snow",
      placeholder: "Write your content here...",
      modules: {
        toolbar: [
          [{ header: "1" }, { header: "2" }, { font: [] }],
          [{ list: "ordered" }, { list: "bullet" }],
          ["bold", "italic", "underline", "strike"],
          [{ align: [] }],
          ["link"],
          ["blockquote", "code-block"],
          [{ indent: "-1" }, { indent: "+1" }],
          ["image"],
          ["clean"],
        ],
      },
    });

    quillEditor.on("text-change", () => {
      form.value.content = quillEditor.root.innerHTML;
    });
  }
});

const submitForm = async () => {
  try {
    const body = {
      ...form.value,
      published_at: new Date().toISOString(),
    };

    const response = await $fetch("/api/blogs", {
      method: "POST",
      body,
    });

    console.log("✅ Blog created:", response);
    router.push("/blogs");
  } catch (err) {
    console.error("❌ Failed to create blog:", err);
    alert("Failed to create blog. Check console for details.");
  }
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    form.value.image = reader.result; // base64 encoded string
  };
  reader.readAsDataURL(file);
};

definePageMeta({
  layout: "dashboard",
});
</script>
<style scoped>
.blog-form {
  max-width: 800px;
  margin: auto;
  background-color: #ffffff;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  border: 1px solid #eaeaea;
}

.blog-form h1 {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #333;
}

.blog-form form > div {
  margin-bottom: 1.25rem;
}

.blog-form label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #444;
}

.blog-form input[type="text"],
.blog-form textarea {
  width: 100%;
  padding: 0.6rem 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  transition: border-color 0.2s ease;
}

.blog-form input:focus,
.blog-form textarea:focus {
  border-color: #007bff;
  outline: none;
}

.blog-form .quill-editor {
  height: 250px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: white;
}

.blog-form button[type="submit"] {
  background-color: #007bff;
  color: white;
  padding: 0.6rem 1.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.blog-form button[type="submit"]:hover {
  background-color: #0056b3;
}

input[type="checkbox"] {
  margin-right: 0.5rem;
}
.img-thumbnail {
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
</style>
