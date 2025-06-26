<template>
  <div class="row">
    <div class="col-sm-12">
      <div class="card">
        <div class="card-body">
          <div class="table-responsive table-desi table-product">
            <div class="d-flex justify-content-start mb-3">
              <NuxtLink to="/banners/create" class="btn btn-primary">
                <i class="fas fa-plus me-2"></i> New Banner
              </NuxtLink>
            </div>

            <table class="table table-1d all-package">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Price</th>
                  <th>MRP</th>
                  <th>Rating</th>
                  <th>Image</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(banner, index) in childBanners" :key="index">
                  <td>{{ banner.title }}</td>
                  <td>{{ banner.price }}</td>
                  <td>{{ banner.mrp }}</td>
                  <td>{{ banner.ratingstars }} ★</td>
                  <td>
                    <img
                      v-if="banner.image"
                      :src="banner.image"
                      alt="Banner Image"
                      width="80"
                      height="auto"
                    />
                  </td>
                  <td>
                    <ul class="d-flex gap-2 list-unstyled mb-0">
                      <li>
                        <a
                          href="javascript:void(0)"
                          @click="editBanner(banner)"
                        >
                          <span class="lnr lnr-pencil"></span>
                        </a>
                      </li>
                      <li>
                        <a
                          href="javascript:void(0)"
                          @click="deleteBanner(banner.id)"
                        >
                          <i class="far fa-trash-alt theme-color"></i>
                        </a>
                      </li>
                    </ul>
                  </td>
                </tr>
                <tr v-if="childBanners.length === 0">
                  <td colspan="6" class="text-center">
                    No child banners found
                  </td>
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
      childBanners: [],
      loading: true,
      error: null,
    };
  },
  created() {
    this.fetchBanners();
  },
  methods: {
    async fetchBanners() {
      try {
        const response = await axios.get(`/api/banners?nocache=${Date.now()}`);
        this.childBanners = response.data;
      } catch (error) {
        this.error = "Error fetching child banners: " + error.message;
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    editBanner(banner) {
      this.$router.push(`/banners/edit/${banner.id}`);
    },
    async deleteBanner(id) {
      if (!confirm("Are you sure you want to delete this banner?")) return;

      try {
        await axios.delete(`/api/banners/${id}`);
        this.childBanners = this.childBanners.filter((b) => b.id !== id);
      } catch (error) {
        console.error("Failed to delete banner:", error);
        alert("An error occurred while deleting the banner.");
      }
    },
  },
};
</script>
