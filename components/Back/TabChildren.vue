<template>
  <div class="row">
    <div class="col-sm-12">
      <div class="card">
        <div class="card-body">
          <div class="table-responsive table-desi table-product">
            <div class="d-flex justify-content-start mb-3">
              <NuxtLink to="/tabchildren/create" class="btn btn-primary">
                <i class="fas fa-plus me-2"></i> New Tab Children
              </NuxtLink>
            </div>

            <table class="table table-1d all-package">
              <thead>
                <tr>
                  <th>Tab</th>
                  <th>Child Type</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(tab, index) in tabchildrens" :key="index">
                  <td>{{ tab.tab_name }}</td>
                  <td>{{ tab.childtype }}</td>
                  <td>
                    <ul class="d-flex gap-2 list-unstyled mb-0">
                      <li>
                        <a href="javascript:void(0)" @click="editTab(tab)">
                          <span class="lnr lnr-pencil"></span>
                        </a>
                      </li>
                      <li>
                        <a href="javascript:void(0)" @click="deleteTab(tab.id)">
                          <i class="far fa-trash-alt theme-color"></i>
                        </a>
                      </li>
                    </ul>
                  </td>
                </tr>
                <tr v-if="tabchildrens.length === 0">
                  <td colspan="3" class="text-center">No tab children found</td>
                </tr>
              </tbody>
            </table>
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
      tabchildrens: [],
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
        const response = await axios.get(
          `/api/tabchildren?nocache=${Date.now()}`
        );
        this.tabchildrens = response.data;
      } catch (error) {
        this.error = "Error fetching tab children: " + error.message;
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
      this.$router.push(`/tabchildren/edit/${tab.id}`);
    },
    async deleteTab(id) {
      if (!confirm("Are you sure you want to delete this tab?")) return;

      try {
        await axios.delete(`/api/tabchildren/${id}`);
        this.tabchildrens = this.tabchildrens.filter((tab) => tab.id !== id);
      } catch (error) {
        console.error("Failed to delete tab:", error);
        alert("An error occurred while deleting the tab.");
      }
    },
  },
};
</script>
