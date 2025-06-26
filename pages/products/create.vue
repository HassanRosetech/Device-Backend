<template>
  <div class="container py-4">
    <div class="product-form">
      <h1>Create New Product</h1>

      <form @submit.prevent="submitForm">
        <div>
          <label>Name</label>
          <input v-model="form.name" type="text" required />
        </div>

        <div>
          <label>Description</label>
          <div ref="editorContainer" class="quill-editor"></div>
        </div>

        <div>
          <label>Category</label>
          <input v-model="form.category" type="text" />
        </div>

        <div>
          <label>Manufacturer</label>
          <input v-model="form.manufacturer" type="text" />
        </div>

        <div>
          <label>Total Purchases</label>
          <input v-model.number="form.total_purchases" type="number" />
        </div>

        <div>
          <label>Available</label>
          <input type="checkbox" v-model="form.available" />
        </div>

        <div>
          <label>First Available Date</label>
          <input v-model="form.first_available_date" type="date" />
        </div>

        <div>
          <label>In Stock</label>
          <input v-model.number="form.in_stock" type="number" />
        </div>

        <div>
          <label>Total Reviews</label>
          <input v-model.number="form.total_reviews" type="number" />
        </div>

        <div>
          <label>Brand</label>
          <input v-model="form.brand" type="text" />
        </div>

        <div>
          <label>Type</label>
          <input v-model="form.type" type="text" />
        </div>

        <div>
          <label>Feature</label>
          <input v-model="form.feature" type="text" />
        </div>

        <div>
          <label>MRP</label>
          <input v-model.number="form.mrp" type="number" step="0.01" />
        </div>

        <div>
          <label>Price</label>
          <input
            v-model.number="form.price"
            type="number"
            step="0.01"
            required
          />
        </div>

        <div>
          <label>Rating Stars</label>
          <input
            v-model.number="form.rating_stars"
            type="number"
            min="0"
            max="5"
          />
        </div>

        <div>
          <label>Is New</label>
          <input type="checkbox" v-model="form.is_new" />
        </div>

        <div>
          <label>Discount (%)</label>
          <input v-model.number="form.discount" type="number" />
        </div>

        <div>
          <label>Department</label>
          <input v-model="form.department" type="text" />
        </div>

        <!-- <div>
          <label>Product Image</label>
          <input type="file" accept="image/*" @change="handleImageUpload" />
          <div v-if="form.image" class="mt-2">
            <img
              :src="form.image"
              alt="Preview"
              class="img-thumbnail"
              style="max-width: 200px"
            />
          </div>
        </div> -->

        <button type="submit">Create Product</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const router = useRouter();

const form = ref({
  name: "",
  description: "",
  category: "",
  manufacturer: "",
  total_purchases: 0,
  available: true,
  first_available_date: "",
  in_stock: 0,
  total_reviews: 0,
  brand: "",
  type: "",
  feature: "",
  mrp: null,
  price: null,
  rating_stars: 0,
  is_new: false,
  discount: 0,
  department: "",
  //image: "",
});

const editorContainer = ref(null);
let quillEditor = null;

onMounted(async () => {
  await nextTick();
  if (editorContainer.value) {
    quillEditor = new Quill(editorContainer.value, {
      theme: "snow",
      placeholder: "Write product description...",
      modules: {
        toolbar: [
          [{ header: [1, 2, false] }],
          ["bold", "italic", "underline"],
          ["link", "image"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["clean"],
        ],
      },
    });

    quillEditor.on("text-change", () => {
      form.value.description = quillEditor.root.innerHTML;
    });
  }
});

const selectedFile = ref(null);

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  selectedFile.value = file;

  const reader = new FileReader();
  reader.onload = () => {
    form.value.image = reader.result;
  };
  reader.readAsDataURL(file);
};

const submitForm = async () => {
  try {
    let imageUrl = form.value.image;

    if (selectedFile.value) {
      const formData = new FormData();
      formData.append("file", selectedFile.value);
      const uploadRes = await $fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      imageUrl = uploadRes.url;
    }

    const body = {
      ...form.value,
      image: imageUrl,
    };

    const response = await $fetch("/api/products", {
      method: "POST",
      body,
    });

    console.log("✅ Product created:", response);
    router.push("/products/products");
  } catch (err) {
    console.error("❌ Failed to create product:", err);
    alert("Failed to create product. See console for details.");
  }
};

definePageMeta({
  layout: "dashboard",
});
</script>

<style scoped>
.product-form {
  max-width: 800px;
  margin: auto;
  background-color: #ffffff;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  border: 1px solid #eaeaea;
}
.product-form h1 {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #333;
}
.product-form form > div {
  margin-bottom: 1.25rem;
}
.product-form label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #444;
}
.product-form input[type="text"],
.product-form input[type="number"],
.product-form input[type="date"],
.product-form textarea {
  width: 100%;
  padding: 0.6rem 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}
.product-form .quill-editor {
  height: 250px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: white;
}
.product-form button[type="submit"] {
  background-color: #007bff;
  color: white;
  padding: 0.6rem 1.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.product-form button[type="submit"]:hover {
  background-color: #0056b3;
}
.img-thumbnail {
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
</style>
