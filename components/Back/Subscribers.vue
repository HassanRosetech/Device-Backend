<template>
  <div class="row">
    <div class="col-sm-12">
      <div class="card">
        <div class="card-body">
          <button @click="sendEmailToAllSubscribers" class="btn btn-primary">
            Send Email to All Subscribers
          </button>
          <div class="table-responsive table-desi table-product">
            <table class="table table-1d all-package">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Email</th>
                  <th>Subscribe Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(subscriber, index) in subscribers" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>{{ subscriber.email }}</td>
                  <td>{{ formatDate(subscriber.subscription_date) }}</td>
                  <td>
                    <ul class="d-flex gap-2 list-unstyled">
                      <li>
                        <a
                          href="javascript:void(0)"
                          @click="deleteSubscription(subscriber.id)"
                        >
                          <i class="far fa-trash-alt theme-color"></i>
                        </a>
                      </li>
                    </ul>
                  </td>
                </tr>
                <tr v-if="subscribers.length === 0 && !loading">
                  <td colspan="4" class="text-center">No subscribers found</td>
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
      subscribers: [], // This is the data for the list of subscribers
      loading: true, // Track loading state
      error: null, // For catching any errors
    };
  },
  created() {
    // Fetch subscribers when the component is created
    this.fetchSubscribers();
  },
  methods: {
    async fetchSubscribers() {
      try {
        // Fetch the data from the API
        const response = await axios.get("/api/newsletter");
        // Access the 'data' property from the API response
        this.subscribers = response.data; // Correct path to 'data'
      } catch (error) {
        // Handle error if the API fails
        this.error = "Error fetching subscribers: " + error.message;
        console.error(error);
      } finally {
        // Stop the loading spinner when the fetch is complete
        this.loading = false;
      }
    },

    // Helper function to format the date
    formatDate(dateStr) {
      if (!dateStr || dateStr === "Invalid Date") return "—"; // Return placeholder for invalid dates
      const parsedDate = new Date(dateStr);

      // Check if the date is valid
      if (isNaN(parsedDate)) {
        console.error("Invalid date:", dateStr); // Log invalid date for debugging
        return "Invalid Date"; // Return a default message for invalid dates
      }

      // Return the formatted date in 'YYYY-MM-DD' format
      return parsedDate.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },

    // Function to delete a subscriber
    async deleteSubscription(id) {
      // Confirmation prompt before deleting
      if (!confirm("Are you sure you want to delete this subscriber?")) return;

      try {
        // Call the API to delete the subscriber
        const response = await axios.delete(`/api/newsletter/${id}`);

        // Check if the response has a success field
        if (response.data.success) {
          // Subscriber deletion was successful
          this.subscribers = this.subscribers.filter(
            (subscriber) => subscriber.id !== id
          );
          alert("Subscriber deleted successfully.");

          // Redirect to the /newsletter page to refresh the list
          this.$router.push("/newsletter");
        } else {
          // If no success field is returned or the success flag is false
          alert(
            response.data.message ||
              "Failed to delete subscriber. Please try again."
          );
        }
      } catch (error) {
        // Log error to console for debugging
        console.error("Error while deleting subscriber:", error);

        // Show user-friendly error message
        if (error.response && error.response.data) {
          alert(
            "Error: " + error.response.data.message ||
              "An error occurred while deleting the subscriber."
          );
        } else {
          alert("An error occurred while deleting the subscriber.");
        }
      }
    },
  },
};
</script>
