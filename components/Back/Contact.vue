<template>
  <div class="row">
    <div class="col-sm-12">
      <div class="card">
        <div class="card-body">
          <div>
            <div class="table-responsive table-desi table-product">
              <table class="table table-1d all-package">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Subject</th>
                    <th>Submitted At</th>

                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(contact, index) in contacts" :key="contact.id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ contact.first_name }}</td>
                    <td>{{ contact.last_name }}</td>
                    <td>{{ contact.subject }}</td>
                    <td>{{ formatDate(contact.submitted_at) }}</td>
                    <td>
                      <ul class="d-flex gap-2 list-unstyled">
                        <li>
                          <a
                            href="javascript:void(0)"
                            @click="openContactModal(contact)"
                          >
                            <span class="lnr lnr-eye"></span>
                          </a>
                        </li>

                        <li>
                          <a
                            href="javascript:void(0)"
                            @click="deleteContact(contact.id)"
                          >
                            <i class="far fa-trash-alt theme-color"></i>
                          </a>
                        </li>
                      </ul>
                    </td>
                  </tr>
                  <tr v-if="contacts.length === 0 && !loading">
                    <td colspan="8" class="text-center">No Contacts found</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="pagination-box">
          <nav class="ms-auto me-auto" aria-label="...">
            <ul class="pagination pagination-primary">
              <li class="page-item disabled">
                <a class="page-link" href="javascript:void(0)" tabindex="-1"
                  >Previous</a
                >
              </li>
              <li class="page-item active">
                <a class="page-link" href="javascript:void(0)">1</a>
              </li>
              <li class="page-item">
                <a class="page-link" href="javascript:void(0)">2</a>
              </li>
              <li class="page-item">
                <a class="page-link" href="javascript:void(0)">3</a>
              </li>
              <li class="page-item">
                <a class="page-link" href="javascript:void(0)">Next</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>

  <div
    class="modal fade show"
    tabindex="-1"
    style="display: block; background-color: rgba(0, 0, 0, 0.5)"
    v-if="showModal"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ selectedContact?.first_name }} {{ selectedContact?.last_name }}
          </h5>
          <button
            type="button"
            class="btn-close"
            @click="showModal = false"
          ></button>
        </div>
        <div class="modal-body">
          <p><strong>Email:</strong> {{ selectedContact?.email }}</p>
          <p><strong>Subject:</strong> {{ selectedContact?.subject }}</p>
          <p><strong>Comment:</strong> {{ selectedContact?.comment }}</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="showModal = false">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const selectedContact = ref(null);
const showModal = ref(false);

const openContactModal = (contact) => {
  selectedContact.value = contact;
  showModal.value = true;
};

const contacts = ref([]);
const loading = ref(true);
const error = ref(null);

const router = useRouter();

const fetchContacts = async () => {
  try {
    const response = await axios.get(`/api/contacts?nocache=${Date.now()}`);
    contacts.value = response.data;
  } catch (err) {
    error.value = "Error fetching contacts: " + err.message;
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateStr) => {
  const parsedDate = new Date(dateStr);
  return isNaN(parsedDate)
    ? "Invalid Date"
    : parsedDate.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
};

const deleteContact = async (id) => {
  if (!confirm("Are you sure you want to delete this contact?")) return;

  try {
    await axios.delete(`/api/contacts/${id}`);
    await router.push("/contacts"); // ✅ correct redirect

    window.location.href = window.location.href;
  } catch (err) {
    console.error("Failed to delete contact:", err);
    alert("An error occurred while deleting the contact.");
  }
};

onMounted(fetchContacts);
</script>
