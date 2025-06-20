<template>
  <nav class="bg-white shadow-sm p-2">
    <div class=" max-w-7xl mx-auto px-8">



          <!-- Admin Avatar and Logout -->
          <div class="flex  items-center  justify-between">
            <!-- Avatar with Admin Name -->
            <div class="flex items-center space-x-2 ">
              <div class="relative">
                <Avatar
                  label="A"
                  class="bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                  shape="circle"
                  size="large"
                />
                <span class="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
              </div>
              <span class="text-gray-700 text-sm font-medium group-hover:text-indigo-600 transition-colors duration-200">
                Admin
              </span>
            </div>
            <!-- Logout Button -->
            <button
              @click="handleLogout"
              class=" flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-red-500 hover:text-white transition-all duration-300 "
              title="تسجيل الخروج"
            >
              <i class="pi pi-sign-out text-lg group-hover:scale-110 transition-transform duration-200"></i>
              <span class="absolute -bottom-8 text-xs text-gray-600 group-hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                خروج
              </span>
            </button>
          </div>



    </div>

  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Menubar from 'primevue/menubar';
import Avatar from 'primevue/avatar';
import 'primeicons/primeicons.css';
import { useAuthStore } from '../../../../stores/Auth.js'

const authStore = useAuthStore()

const mobileMenuOpen = ref(false);
const handleLogout =  () => {
   authStore.handleLogout()
}
// Toggle mobile menu
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

// Open submenu on hover
const openSubmenu = (item) => {
  if (item.items) {
    menuItems.value.forEach((menuItem) => {
      menuItem.showSubmenu = menuItem === item;
    });
  }
};

// Close submenu
const closeSubmenu = (item) => {
  if (item.items) {
    item.showSubmenu = false;
  }
};

// Close all submenus
const closeAllSubmenus = () => {
  menuItems.value.forEach((item) => {
    item.showSubmenu = false;
  });
};

// Logout function
const logout = () => {
  // Implement logout logic here (e.g., clear auth, redirect to login)
  console.log('Logout clicked');
};

// Handle click outside to close submenus
const handleClickOutside = (event) => {
  const menubar = document.querySelector('.p-menubar');
  if (menubar && !menubar.contains(event.target)) {
    closeAllSubmenus();
  }
};

// Add and remove click event listener for outside clicks
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
/* Custom Tailwind styles for PrimeVue components */
.p-menubar {
  @apply bg-transparent border-none;
}

.p-menubar .p-menuitem-link {
  @apply text-[#696969] hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200;
}

/* Fade transition for submenu */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Enhance avatar styling */
.p-avatar {
  @apply ring-2 ring-white shadow-sm;
}

/* Logout button hover effects */
.logout-button {
  @apply relative overflow-hidden;
}

.logout-button::before {
  content: '';
  @apply absolute inset-0 bg-red-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300;
}
</style>
