<template>
  <div class="container py-4">
    <div class="tab-form">
      <h1>Create New Banner</h1>

      <form @submit.prevent="submitForm">
        <!-- Child Tab Selector -->
        <div>
          <label>Select Tab Child</label>
          <select v-model.number="form.child_id" required>
            <option disabled value="">Please select a child tab</option>
            <option
              v-for="child in tabChildren"
              :key="child.id"
              :value="child.id"
            >
              {{ child.childtype }} ({{ child.tab_name }})
            </option>
          </select>
        </div>

        <!-- Title -->
        <div>
          <label>Title</label>
          <input v-model="form.title" type="text" required />
        </div>

        <!-- MRP -->
        <div>
          <label>MRP</label>
          <input v-model.number="form.mrp" type="number" step="0.01" required />
        </div>

        <!-- Price -->
        <div>
          <label>Price</label>
          <input
            v-model.number="form.price"
            type="number"
            step="0.01"
            required
          />
        </div>

        <!-- Rating Stars -->
        <div>
          <label>Rating Stars (1–5)</label>
          <input
            v-model.number="form.ratingstars"
            type="number"
            min="1"
            max="5"
          />
        </div>

        <!-- Image URL -->
        <!-- <div>
          <label>Image URL</label>
          <input v-model="form.image" type="text" required />
        </div> -->
        <!-- Image File Upload -->
        <div>
          <label>Upload Image</label>
          <input
            type="file"
            @change="handleFileUpload"
            accept="image/*"
            required
          />
        </div>

        <button type="submit">Create Banner</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const selectedFile = ref(null);

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
  }
};

const form = ref({
  child_id: null,
  title: "",
  mrp: 0,
  price: 0,
  ratingstars: 5,
  image: "",
});

const tabChildren = ref([]);

onMounted(async () => {
  try {
    tabChildren.value = await $fetch("/api/tabchildren");
  } catch (err) {
    console.error("❌ Failed to load tab children:", err);
    alert("Failed to load tab children. Please try again.");
  }
});

const submitForm = async () => {
  try {
    let imageUrl = "";

    if (selectedFile.value) {
      const formData = new FormData();
      formData.append("file", selectedFile.value);

      const uploadResponse = await $fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      imageUrl = uploadResponse.url;
    }

    const response = await $fetch("/api/banners", {
      method: "POST",
      body: {
        ...form.value,
        image: imageUrl,
      },
    });

    console.log("✅ Banner created:", response);
    router.push("/banners");
  } catch (err) {
    console.error("❌ Failed to create banner:", err);
    alert("Failed to create banner. Check console for details.");
  }
};

definePageMeta({
  layout: "dashboard",
});
</script>

<style scoped>
.tab-form {
  max-width: 600px;
  margin: auto;
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  border: 1px solid #eaeaea;
}

.tab-form h1 {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #333;
}

.tab-form form > div {
  margin-bottom: 1.25rem;
}

.tab-form label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #444;
}

.tab-form input[type="text"],
.tab-form input[type="number"],
.tab-form select {
  width: 100%;
  padding: 0.6rem 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  transition: border-color 0.2s ease;
}

.tab-form input:focus,
.tab-form select:focus {
  border-color: #007bff;
  outline: none;
}

.tab-form button[type="submit"] {
  background-color: #007bff;
  color: white;
  padding: 0.6rem 1.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.tab-form button[type="submit"]:hover {
  background-color: #0056b3;
}
</style>
