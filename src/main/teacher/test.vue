<script setup>
import router from "@/config/router.js";
import { ref, onMounted, watch, onUnmounted } from 'vue';
import { useAuthStore } from "@/main/auth/store/auth.js";
import { useRouter } from "vue-router";
import { useAbility } from '@casl/vue';
import { breakpointsTailwind, useBreakpoints, useStorage } from "@vueuse/core";
import { useEntityStore } from "@/main/dashboard/entity/store/entity.js";
import Breadcrumbs from "@/components/Breadcrumbs.vue";

// Reactive state for dialog visibility
const isOpen = ref(true); // Set to true to show overlay initially

// Handle keydown event to prevent closing on "Esc" key
const handleKeydown = (event) => {
  if (event.key === 'Escape') {
    event.preventDefault(); // Prevent default Esc behavior
  }
};

// Stop click propagation to prevent closing on outside click
const stopPropagation = (event) => {
  event.stopPropagation();
};

const entityStore = useEntityStore();
let routerName = useRouter().currentRoute.value.name;

if (routerName === "campus" || routerName === "campus-setup" || routerName === "campus-curriculum-setup") {
  routerName = "school";
}

if (routerName === "curriculum-setup") {
  routerName = "curriculum";
}

const authStore = useAuthStore();
const { can } = useAbility();

const breakpoints = useBreakpoints(breakpointsTailwind);
const xs = breakpoints.smaller('sm');
const sm = breakpoints.between('sm', 'md');
const md = breakpoints.between('md', 'lg');

let entityName = localStorage.getItem("entity_name");
const schoolName = ref("");
const schoolLists = ref([]);
const campusName = ref("");
const landingPageData = ref([]);
const menu = ref(null);
const landingPageTitle = ref(null);

const defaultMenuSize = ref(useStorage("toggle", false));

const menuList = ref([
  { title: "Dashboard", name: "teacher-dashboard", icon: "bi-house", action: "view_dashboard" },
  { title: "TimeTable", name: "", icon: "bi-watch", action: "" },
  { title: "Students", name: "students", icon: "bi-people", action: "view_students" },
  { title: "Curriculum", name: "", icon: "bi-book", action: "" },
  { title: "Assessment", name: "", icon: "bi-book", action: "" },
]);

onMounted(async () => {
  updateOnlineStatus();
  checkDynamicClass();
  landingPageTitle.value = localStorage.getItem("landingPageTitle");

  if (localStorage.getItem("schoolName")) {
    schoolName.value = localStorage.getItem("schoolName");
  }
  if (localStorage.getItem("campusName")) {
    campusName.value = localStorage.getItem("campusName");
  }
  if (localStorage.getItem("SchoolInfo")) {
    let data = JSON.parse(localStorage.getItem("SchoolInfo"));
    schoolLists.value = data;
  }

  window.addEventListener('keydown', handleKeydown);
});

watch(
  () => entityStore.landPageResponse,
  async (data) => {
    if (data) {
      landingPageData.value = data.data;
    }
  }
);

watch(
  () => xs,
  async (data) => {
    if (data) {
      checkDynamicClass();
    }
  },
  { deep: true }
);

watch(
  () => breakpoints,
  async (data) => {
    if (data) {
      checkDynamicClass();
    }
  },
  { deep: true }
);

const checkDynamicClass = () => {
  if (md.value) {
    defaultMenuSize.value = true;
  }
  if (sm.value) {
    defaultMenuSize.value = false;
  }
  if (xs.value) {
    defaultMenuSize.value = false;
  }
};

const name = ref(null);
let p = authStore.profile;

name.value = p.first_name + " " + p.second_name + " " + p.last_name;

const userLogout = () => {
  localStorage.clear();

  let r = router.resolve({
    name: "login"
  });
  window.location.assign(r.href);
};

const online = ref(navigator.onLine);
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);
const offline = ref(null);

function updateOnlineStatus() {
  online.value = navigator.onLine;
  if (!online.value) {
    offline.value = "offline.";
  } else {
    offline.value = "Online.";
  }
}

const goToEntities = () => {
  router.push({ name: 'entity-dashboard' });
};

watch(
  () => navigator.onLine,
  async (data) => {
    if (data) {
      updateOnlineStatus();
    }
  }
);

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <div class="overlay" v-if="isOpen" @click.self="stopPropagation">
    <div class="dialog">
      <h2>Select School</h2>
      <p>Please select a school to continue.</p>
      <select v-model="schoolName">
        <option disabled value="">Please select one</option>
        <option v-for="(school, index) in schoolLists" :key="index" :value="school.name">
          {{ school.name }}
        </option>
      </select>
      <button @click="isOpen = false" :disabled="!schoolName">Continue</button>
    </div>
  </div>

  <div class="p-0 h-screen w-screen dark">
    <!-- Rest of your existing code goes here -->

    <!-- Navbar, content, footer, etc. -->

  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999; /* Ensure overlay is on top */
}

.dialog {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  text-align: center;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
