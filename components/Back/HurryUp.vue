<template>
  <div class="row">
    <div class="col-sm-12">
      <div class="card">
        <div class="card-body">
          <div>
            <div class="table-responsive table-desi table-product">
              <div class="d-flex justify-content-start mb-3">
                <NuxtLink to="/tabs/create" class="btn btn-primary">
                  <i class="fas fa-plus me-2"></i> New Tab
                </NuxtLink>
              </div>

              <table class="table table-1d all-package">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Display Title</th>
                    <th>Tab ID</th>
                    <th>Active</th>
                    <!-- <th>Created At</th> -->
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(tab, index) in tabs" :key="index">
                    <td>{{ tab.name }}</td>
                    <td>{{ tab.display_title }}</td>
                    <td>{{ tab.tab_id }}</td>
                    <td>{{ tab.active ? "Yes" : "No" }}</td>
                    <!-- <td>{{ formatDate(tab.created_at) }}</td> -->
                    <td>
                      <ul class="d-flex gap-2 list-unstyled">
                        <li>
                          <a href="javascript:void(0)" @click="editTab(tab)">
                            <span class="lnr lnr-pencil"></span>
                          </a>
                        </li>
                        <li>
                          <a
                            href="javascript:void(0)"
                            @click="deleteTab(tab.id)"
                          >
                            <i class="far fa-trash-alt theme-color"></i>
                          </a>
                        </li>
                      </ul>
                    </td>
                  </tr>
                  <tr v-if="tabs.length === 0">
                    <td colspan="6" class="text-center">No tabs found</td>
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
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      tabs: [],
      loading: true,
      error: null,
    };
  },
  created() {
    this.fetchTabs();
  },
  methods: {
    async fetchTabs() {
      try {
        const response = await axios.get(`/api/tabs?nocache=${Date.now()}`);
        this.tabs = response.data;
      } catch (error) {
        this.error = "Error fetching tabs: " + error.message;
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
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
    editTab(tab) {
      this.$router.push(`/tabs/edit/${tab.id}`);
    },
    async deleteTab(id) {
      if (!confirm("Are you sure you want to delete this tab?")) return;

      try {
        await axios.delete(`/api/tabs/${id}`);

        this.tabs = this.tabs.filter((tab) => tab.id !== id);
      } catch (error) {
        console.error("Failed to delete tab:", error);
        alert("An error occurred while deleting the tab.");
      }
    },
  },
};
</script>
