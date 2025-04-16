<template>
  <div class="dashboard-layout d-flex flex-column">
    <!-- Top Navbar -->
    <nav
      class="topbar bg-dark d-flex justify-content-between align-items-center px-4 py-2 shadow-sm"
    >
      <!-- Centered Welcome -->
      <div class="welcome-text mx-auto fw-bold text-center">
        👋 Welcome, {{ userName }}
      </div>
      <button class="btn btn-outline-danger btn-sm" @click="logout">
        <i class="fas fa-sign-out-alt me-1"></i> Logout
      </button>
    </nav>

    <div class="d-flex flex-grow-1">
      <!-- Sidebar -->
      <aside class="sidebar bg-dark text-white p-3">
        <h5 class="mb-4">My Dashboard</h5>
        <ul class="nav flex-column">
          <li class="nav-item">
            <NuxtLink to="/blogs" class="nav-link text-white">Blogs</NuxtLink>
          </li>
          <li class="nav-item">
            <NuxtLink to="/create" class="nav-link text-white"
              >Create New Blog</NuxtLink
            >
          </li>
        </ul>
      </aside>

      <!-- Main Content -->
      <main class="content p-4 w-100">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
// Simulating user session – in real case, use auth composables or Vuex/Pinia
const userName = "Admin";

function logout() {
  alert("Logging out..."); // Replace this with actual logout logic
  // Example: useAuth().logout()
}
</script>

<style scoped>
.dashboard-layout {
  min-height: 100vh;
}

.topbar {
  height: 60px;
}

.sidebar {
  width: 250px;
  min-height: calc(100vh - 60px);
}

.nav-link {
  padding: 0.5rem 1rem;
  border-radius: 5px;
  margin-bottom: 0.5rem;
}

.nav-link:hover,
.nav-link.router-link-active {
  background-color: rgba(255, 255, 255, 0.2);
  color: #fff;
}
</style>
