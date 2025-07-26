<script setup>
import { useAuthStore } from "@/main/auth/store/auth.js";
import { onMounted, ref, watch } from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import { useSchoolStore } from "@/main/dashboard/manageSchool/store/school.js";
import { useClassesStore } from "@/main/dashboard/manageLevel/class/store/classes";

const classStore = useClassesStore();
const schoolStore = useSchoolStore();
const notificationStore = useNotificationStore();
let entityN = localStorage.getItem("entity_number");
let campusListData = ref([]);
const streamLists = ref({});
const schoolsList = ref([]);
const todayDate = ref('');
const currentTime = ref('');

const updateTime = () => {
  const now = new Date();
  const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  todayDate.value = now.toLocaleDateString(undefined, dateOptions);
  
  const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
  currentTime.value = now.toLocaleTimeString(undefined, timeOptions);
};

const fetchStreamsForClasses = async (campusClasses) => {
  campusClasses.forEach(async (campusClass) => {
    let sData = {
      campus_class_number: campusClass.number,
    };
    await classStore.fetchClassStreamsByCampusClassNumber(sData);
    streamLists.value[campusClass.number] = classStore.byCampusClassStreams.data;
  });
};

onMounted(() => {
  schoolStore.fetchSchools(entityN);
  updateTime();
  setInterval(updateTime, 1000);
  campusListData.value = JSON.parse(localStorage.getItem("Campus"));

  // Fetch streams for all classes after the campus list is loaded
  campusListData.value.forEach((campus) => {
    fetchStreamsForClasses(campus.Classes);
  });
});

watch(
  () => schoolStore.schoolsResponse,
  async (data) => {
    if (data) {
      schoolsList.value = data.data;
    }
  },
  { deep: true }
);

watch(
  () => schoolStore.errorMessage,
  async (data) => {
    if (data) {
      notificationStore.errorToast("Error", data.message);
    }
  },
  { deep: true }
);
</script>
<template>
    <div class="dashboard">
      <!-- Campus Filter Section -->
      <div class="filters-row row mb-4">
        <div class="col-md-4">
          <select class="form-select form-select-sm" style="box-shadow: none;">
            <option disabled value="">--Select Campus--</option>
            <option v-for="(list, index) in campusListData" :key="index">{{ list.campus_name }}</option>
          </select>
        </div>
      </div>
  
      <!-- Class and Stream Display -->
      <div class="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <template v-for="(campus, index) in campusListData" :key="index">
          <div v-for="(classItem, classIndex) in campus.Classes" :key="classIndex" class="class-card">
            <!-- Class Card -->
            <div class="card p-4">
              <!-- Class Header -->
              <div class="class-header d-flex justify-between align-items-center mb-3">
                <div class="class-name text-gray-900 font-weight-bold">{{ classItem.name }}</div>
              </div>
  
              <!-- Streams List -->
              <div class="stream-list">
                <!-- Check if streams are loaded for the class -->
                <div v-if="streamLists[classItem.number]">
                  <div
                    v-for="(stream, streamIndex) in streamLists[classItem.number]"
                    :key="streamIndex"
                    class="stream-item d-flex align-items-center"
                  >
                    <!-- Clickable Stream Link -->
                    <router-link
                      :to="{ name: 'manage-stream', query: { id: stream.stream_number, ccl: stream.campus_class_number } }"
                      class="stream-link d-flex align-items-center"
                    >
                      <span class="stream-index mr-2">{{ streamIndex + 1 }}.</span>
                      <span class="stream-name">{{ stream.name }}</span>
                      <i class="bi bi-arrow-right ml-auto"></i> <!-- Right arrow icon -->
                    </router-link>
                  </div>
                </div>
                <div v-else>
                  <small class="text-muted">Loading streams...</small>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </template>
<style scoped>
.dashboard {
  padding: 16px;
  background-color: #f8f9fa;
}

.filters-row {
  display: flex;
  justify-content: space-between;
}

.class-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.class-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.class-header {
  font-weight: bold;
  font-size: 18px;
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 10px;
  margin-bottom: 10px;
}

.stream-list {
  padding-top: 10px;
}

.stream-item {
  margin-top: 10px;
  padding: 8px;
  border-radius: 6px;
  background-color: #f1f3f5;
  transition: background-color 0.3s ease;
}

.stream-item:hover {
  background-color: #e9ecef;
}

.stream-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #343a40;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.3s ease;
}

.stream-link:hover {
  color: #0d6efd;
  text-decoration: underline;
}

.stream-index {
  font-weight: bold;
  color: #6c757d;
}

.stream-name {
  margin-left: 6px;
}

.bi-arrow-right {
  margin-left: auto;
  font-size: 16px;
  color: #6c757d;
  transition: transform 0.3s ease;
}

.stream-item:hover .bi-arrow-right {
  transform: translateX(5px);
}
</style>
  