<script setup>
import { useAuthStore } from "@/main/auth/store/auth.js";
import { onMounted, ref, watch } from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import { useSchoolStore } from "@/main/dashboard/manageSchool/store/school.js";
import { useClassesStore } from "@/main/dashboard/manageLevel/class/store/classes";

const classStore = useClassesStore();
const schoolStore = useSchoolStore();
const notificationStore = useNotificationStore();
const showSelected = ref(null);
let entityN = localStorage.getItem("entity_number");
let campusListData = ref([]);

const schoolsList = ref([]);
const authStore = useAuthStore();
const todayDate = ref('');
const currentTime = ref('');
const streamList = ref([]);

const updateTime = () => {
  const now = new Date();

  const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  todayDate.value = now.toLocaleDateString(undefined, dateOptions);

  const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
  currentTime.value = now.toLocaleTimeString(undefined, timeOptions);
};

onMounted(() => {
  schoolStore.fetchSchools(entityN);
  updateTime();
  setInterval(updateTime, 1000);
  campusListData.value = JSON.parse(localStorage.getItem("Campus"));
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

const toggleStream = (number) => {
  let sData = {
    campus_class_number: number,
  };
  classStore.fetchClassStreamsByCampusClassNumber(sData);
  showSelected.value = showSelected.value === number ? undefined : number;
};

watch(
  () => classStore.byCampusClassStreams,
  async (data) => {
    if (data) {
      streamList.value = data.data;
    }
  },
  { deep: true }
);
</script>

<template>
  <div class="dashboard">
    <div class="filters-row row mb-4">
      <div class="col-md-4">
        <select class="form-select form-select-sm" style="box-shadow: none;">
          <option disabled value="">--Select Campus--</option>
          <option v-for="(list, index) in campusListData" :key="index">{{ list.campus_name }}</option>
        </select>
      </div>
    </div>

    <div class="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <template v-for="(campus, index) in campusListData" :key="index">
        <div v-for="(classItem, classIndex) in campus.Classes" :key="classIndex" class="class-card">
          <div class="card p-3">
            <div class="class-header mb-3 d-flex justify-between">
              <div class="class-name text-gray-900">{{ classItem.name }}</div>
            </div>
            <div class="stream-toggle text-primary cursor-pointer" @click="toggleStream(classItem.number)">
              Show Stream
              <i :class="showSelected === classItem.number ? 'bi-caret-up-fill' : 'bi-caret-down-fill'"></i>
            </div>

            <div class="stream-list mt-3" v-show="showSelected === classItem.number">
              <div v-for="(stream, streamIndex) in streamList" :key="streamIndex" class="stream-item">
                <router-link :to="{ name: 'manage-stream', query: { id: stream.stream_number, ccl: stream.campus_class_number } }" class="text-decoration-none">
                  <div class="stream-text">{{ streamIndex + 1 }}. {{ stream.name }}</div>
                </router-link>
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
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.class-header {
  font-weight: 600;
  font-size: 14px;
}

.stream-toggle {
  font-size: 12px;
  display: flex;
  align-items: center;
}

.stream-list {
  border-top: 1px solid #e9ecef;
  padding-top: 10px;
}

.stream-item {
  margin-top: 10px;
}

.stream-text {
  font-size: 13px;
  color: #343a40;
}

.text-primary {
  color: #0d6efd;
}

.text-primary:hover {
  text-decoration: underline;
}
</style>
