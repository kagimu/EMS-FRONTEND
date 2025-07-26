<template>
    <div>
      <div class="alert alert-danger" role="alert" v-if="errorMessage" style="padding: 0.5rem 1rem; font-size: 0.8rem;">
        {{ errorMessage }}
      </div>
    <div class="row mt-4 mb-2">
        <div class="col-lg-8 ml-3">
        <h5 style="font-size: 14px;margin-top: 2px;">Menu Packs Items </h5>
        </div>
        <div class="col-lg-4">

        </div>
    </div>


    <div class="row">
        <div class="col-4">
        <div class="mb-2 ml-3">
        <select
            v-model="form.school_number"
            class="form-select form-select-sm"
            style="box-shadow: none;"
            @change="filterBySchool(form.school_number)"           
        >
        <option disabled value="">--Select School--</option>
        <option v-for="(list, index) in schoolList" :key="index" :value="list.number">{{ list.name }}
        </option>
        </select>
        </div>
        </div>

    </div>

      <div class="row">
        <div v-for="(session, index) in groupedFeedingSessions" :key="index" class="col-md-4 mb-2 mt-1">
          <div class="card m-2 card-hover">
            <div class="card-header">
              <h5 class="card-title text-[13px]">{{ session.name }}</h5>
              <p class="card-text text-[13px]"><strong>Status:</strong> {{ session.status }}</p>
            </div>
            <ul class="list-group list-group-flush ">
              <li v-for="menuItem in session.menuItems" :key="menuItem.number" class="list-group-item text-[13px]">
                {{ menuItem.name }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import {onMounted,reactive, ref, watch,computed} from "vue";
  import useNotificationStore from "@/composables/useNotification.js";
  import {useCateringStore} from "@/main/dashboard/catering/store/catering.js";
  import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
  
  const errorMessage = ref(null);

  onMounted(() => {
        cateringStore.fetchFeedingSessionsItems()
        schoolStore.fetchSchools()
    }
)
  
    const schoolList = ref([])
    const schoolStore = useSchoolStore()
    const cateringStore = useCateringStore()
    const thisDialog = ref(false)
    const feedingSessionItemData = ref([])
    const notificationStore = useNotificationStore()

    const form = reactive({
    school_number:"",
    })


watch(
    () => schoolStore.schoolsResponse,
    async (data) => {
        if (data) {
            schoolList.value = data.data
        }
    },
    {deep: true}
)

watch(
    () => cateringStore.feedingSessionsItemsInfoResponse,
    async (data) => {
        feedingSessionItemData.value = data.data
    },
    {deep: true}
  )
  watch(
    () => cateringStore.errorMessage,
    async (data) => {
          if (data) {
          notificationStore.errorToast("Error", data.message)
          }
    },
    {deep: true}
  )
  
  const groupedFeedingSessions = computed(() => {
    const grouped = {}
    
    feedingSessionItemData.value.forEach(item => {
      if (!grouped[item.feeding_session_number]) {
        grouped[item.feeding_session_number] = {
          name: item.feeding_session_name,
          status: item.feeding_session_status,
          menuItems: []
        }
      }
      grouped[item.feeding_session_number].menuItems.push({
        number: item.number,
        name: item.menu_item_name
      })
    })
  
    return Object.values(grouped)
  })

  
  </script>
  
  <style scoped>
  .card-header {
    background-color: #f8f9fa;
  }
  .card-title {
    margin-bottom: 0;
  }
  </style>
  