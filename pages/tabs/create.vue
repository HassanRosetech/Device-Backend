<template>
  <div class="container py-4">
    <div class="tab-form">
      <h1>Create New Tab</h1>

      <form @submit.prevent="submitForm">
        <div>
          <label>Name</label>
          <input v-model="form.name" type="text" required />
        </div>

        <div>
          <label>Display Title</label>
          <input v-model="form.display_title" type="text" required />
        </div>

        <!-- <div>
          <label>Tab ID (Parent or Reference)</label>
          <input v-model.number="form.tab_id" type="number" required />
        </div> -->

        <div>
          <label>
            <input type="checkbox" v-model="form.active" />
            Active
          </label>
        </div>

        <button type="submit">Create Tab</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const form = ref({
  name: "",
  display_title: "",
  tab_id: 1,
  active: true,
});

const submitForm = async () => {
  try {
    const body = { ...form.value };

    const response = await $fetch("/api/tabs", {
      method: "POST",
      body,
    });

    console.log("✅ Tab created:", response);
    router.push("/tabs/HurryUp");
  } catch (err) {
    console.error("❌ Failed to create tab:", err);
    alert("Failed to create tab. Check console for details.");
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
.tab-form input[type="number"] {
  width: 100%;
  padding: 0.6rem 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  transition: border-color 0.2s ease;
}

.tab-form input:focus {
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

input[type="checkbox"] {
  margin-right: 0.5rem;
}
</style>
