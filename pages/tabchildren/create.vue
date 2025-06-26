<template>
  <div class="container py-4">
    <div class="tab-form">
      <h1>Create New Tab Child</h1>

      <form @submit.prevent="submitForm">
        <!-- Tab Selector -->
        <div>
          <label>Select Parent Tab</label>
          <select v-model.number="form.tab_id" required>
            <option disabled value="">Please select a tab</option>
            <option v-for="tab in tabs" :key="tab.id" :value="tab.id">
              {{ tab.name }}
            </option>
          </select>
        </div>

        <!-- Child Type -->
        <div>
          <label>Child Type</label>
          <input v-model="form.childtype" type="text" required />
        </div>

        <button type="submit">Create Tab Child</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const form = ref({
  tab_id: null,
  childtype: "",
});

const tabs = ref([]);

onMounted(async () => {
  try {
    tabs.value = await $fetch("/api/tabs");
  } catch (err) {
    console.error("❌ Failed to load tabs:", err);
    alert("Failed to load tabs. Please try again.");
  }
});

const submitForm = async () => {
  try {
    const body = { ...form.value };

    const response = await $fetch("/api/tabchildren", {
      method: "POST",
      body,
    });

    console.log("✅ Tab child created:", response);
    router.push("/tabchildren");
  } catch (err) {
    console.error("❌ Failed to create tab child:", err);
    alert("Failed to create tab child. Check console for details.");
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
