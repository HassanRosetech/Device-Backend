<template>
  <div class="row">
    <div class="col-sm-12">
      <div class="card">
        <div class="card-body">
          <div>
            <div class="table-responsive table-desi table-product">
              <div class="d-flex justify-content-start mb-3">
                <NuxtLink to="/create" class="btn btn-primary">
                  <i class="fas fa-plus me-2"></i> New Blog
                </NuxtLink>
              </div>

              <table class="table table-1d all-package">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Slug</th>
                    <th>Author Name</th>
                    <th>Published</th>
                    <th>Created At</th>
                    <!-- <th>Updated At</th> -->
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(blog, index) in blogs" :key="index">
                    <td>
                      <img
                        :src="blog.image"
                        class="img-fluid"
                        alt="Blog Image"
                      />
                    </td>
                    <td>
                      <a :href="`/blog/${blog.slug}`">{{ blog.title }}</a>
                    </td>
                    <td>{{ blog.slug }}</td>
                    <td>{{ blog.author_name }}</td>
                    <td>{{ blog.is_published ? "Yes" : "No" }}</td>
                    <td>{{ blog.created_at }}</td>
                    <!-- <td>{{ blog.updated_at }}</td> -->
                    <td>
                      <ul class="d-flex gap-2 list-unstyled">
                        <li>
                          <router-link :to="`/blog/${blog.slug}`">
                            <span class="lnr lnr-eye"></span>
                          </router-link>
                        </li>
                        <li>
                          <a href="javascript:void(0)" @click="editBlog(blog)">
                            <span class="lnr lnr-pencil"></span>
                          </a>
                        </li>
                        <li>
                          <a
                            href="javascript:void(0)"
                            @click="deleteBlog(blog.id)"
                          >
                            <i class="far fa-trash-alt theme-color"></i>
                          </a>
                        </li>
                      </ul>
                    </td>
                  </tr>
                  <tr v-if="blogs.length === 0">
                    <td colspan="8" class="text-center">No blogs found</td>
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
      blogs: [],
      loading: true,
      error: null,
    };
  },
  created() {
    this.fetchBlogs();
  },
  methods: {
    async fetchBlogs() {
      try {
        const response = await axios.get("/api/blogs?nocache=${Date.now()");
        this.blogs = response.data;
      } catch (error) {
        this.error = "Error fetching blogs: " + error.message;
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    formatDate(dateStr) {
      if (!dateStr || dateStr === "Invalid Date") return "—"; // Return a placeholder for invalid dates

      const parsedDate = new Date(dateStr);

      // Check if the date is valid
      if (isNaN(parsedDate)) {
        console.error("Invalid date:", dateStr); // Log invalid date for debugging
        return "Invalid Date"; // Return a default message for invalid dates
      }

      // Return the formatted date
      return parsedDate.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },

    editBlog(blog) {
      console.log("Editing blog:", blog);
      // Implement your edit logic here

      this.$router.push(`/blog/edit/${blog.id}`);
    },
    async deleteBlog(id) {
      if (!confirm("Are you sure you want to delete this blog?")) return;

      try {
        await axios.delete(`/api/blogs/delete/${id}`);
        this.blogs = this.blogs.filter((blog) => blog.id !== id);
      } catch (error) {
        console.error("Failed to delete blog:", error);
        alert("An error occurred while deleting the blog.");
      }
    },
  },
};
</script>
