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
  //window.location.href = "http://logout:logout@" + window.location.hostname;
  // Optional: clear local/session storage & cookies
}

function clearRecentLocalStorage() {
  const ONE_HOUR = 60 * 60 * 1000; // Time in milliseconds
  const now = Date.now();

  // Loop through all localStorage items
  for (let key in localStorage) {
    try {
      const item = JSON.parse(localStorage.getItem(key));

      // Check if the item has a timestamp and is within the last hour
      if (item && item.timestamp && now - item.timestamp < ONE_HOUR) {
        // Check for items related to "username" or "password"
        if (key.includes("Username") || key.includes("Password")) {
          console.log(userName);
          localStorage.removeItem(key); // Remove the item
        }
      }
    } catch (e) {
      // If it’s not JSON-parsable, skip or remove it anyway
      if (key.includes("Username") || key.includes("Password")) {
        localStorage.removeItem(key); // Remove non-JSON values if they match
      }
    }
  }
}

function clearRecentSessionStorage() {
  const ONE_HOUR = 60 * 60 * 1000; // Time in milliseconds
  const now = Date.now();

  // Loop through all sessionStorage items
  for (let key in sessionStorage) {
    try {
      const item = JSON.parse(sessionStorage.getItem(key));

      // Check if the item has a timestamp and is within the last hour
      if (item && item.timestamp && now - item.timestamp < ONE_HOUR) {
        // Check for items related to "username" or "password"
        if (key.includes("Username") || key.includes("Password")) {
          sessionStorage.removeItem(key); // Remove the item
        }
      }
    } catch (e) {
      // If it’s not JSON-parsable, skip or remove it anyway
      if (key.includes("Username") || key.includes("Password")) {
        sessionStorage.removeItem(key); // Remove non-JSON values if they match
      }
    }
  }
}

function clearRecentCookies() {
  const ONE_HOUR = 60 * 60 * 1000; // Time in milliseconds
  const now = Date.now();

  // Loop through all cookies
  document.cookie.split(";").forEach((cookie) => {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    const value = cookie.substr(eqPos + 1);

    // Try to parse the cookie to get its timestamp (if any)
    try {
      const parsedValue = JSON.parse(value);

      if (parsedValue.timestamp && now - parsedValue.timestamp < ONE_HOUR) {
        // Check if it's a username or password-related cookie
        if (name.includes("Username") || name.includes("Password")) {
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`; // Clear the cookie
        }
      }
    } catch (e) {
      // If not JSON, skip or remove it anyway
      if (name.includes("Username") || name.includes("Password")) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`; // Remove the cookie
      }
    }
  });
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
