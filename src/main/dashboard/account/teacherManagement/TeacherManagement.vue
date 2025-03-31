<script setup>
import { useAbility } from '@casl/vue';
import {onMounted, reactive, ref, watch,computed} from "vue";
import { useAccountStore } from "../store/account.js";
import { useRolesStore } from "@/main/settings/roles/store/roles.js";
import AppModal from "@/components/AppModal.vue";
import PaginationTemplate from "@/components/PaginationTemplate.vue";
import NewTeacher from "@/main/dashboard/account/teacherManagement/NewTeacher.vue";
import {useTeacherStore} from "@/main/dashboard/account/teacherManagement/store/teacherStore.js";
import TeacherManagementFilters from "@/main/dashboard/account/teacherManagement/TeacherManagementFilters.vue";
import ConfirmationModal from "@/components/ConfirmationModal.vue";
import useNotificationStore from "@/composables/useNotification.js";

let typingTimer = null;
const teacherStore = useTeacherStore()
const per_page = ref(20)
const search = ref("")
const total_items = ref(0)
const total_rows = ref(0)
const page = ref(1)
const filterData = ref(null)
const deletionLoader = ref(undefined)
const confirmationRef = ref(null);
const  notificationStore  = useNotificationStore()


const { can } = useAbility()

const roleStore = useRolesStore()
const accountStore = useAccountStore()
const userData = ref([])
const assignDialog = ref(false)
const teacherDialog = ref(false)
const userInfo = ref(null)
const tableLoader = ref(true)

const openModal = (userInf) =>{
  userInfo.value = userInf
  assignDialog.value = true
}


const showTeacherDialog = () => {
    teacherDialog.value = true
}

const rolesData= ref([])

//fetch
onMounted(
    async () => {
      //  doFetchTeacherOnboarding()
    } )

//fetch
const doFetchTeacherOnboarding = () =>{

  if(!filterData.value?.school_number){
    return
  }

  let data = {
    page: 1,
    per_page: per_page.value,
    search:search.value,
    school_number: filterData.value?.school_number,
    campus_number: filterData.value?.campus_number,
    curriculum_number: filterData.value?.curriculum_number,
    campus_level_number: filterData.value?.campus_level_number,
    class_number: filterData.value?.class_number,
    streams: filterData.value?.streams,
    assessment_area_number: filterData.value?.assessment_area_number,
  }
  tableLoader.value = true;
  userData.value = []
  teacherStore.fetchTeacherOnboarding(data)


}

function  onScroll({ target: { scrollTop, clientHeight, scrollHeight }}) {
  if (scrollTop + clientHeight >= scrollHeight) {

    tableLoader.value = true
    let data = {
      page: (page.value+1),
      per_page: per_page.value,
      search:search.value,
      school_number: filterData.value?.school_number,
      campus_number: filterData.value?.campus_number,
      curriculum_number: filterData.value?.curriculum_number,
      campus_level_number: filterData.value?.campus_level_number,
      class_number: filterData.value?.class_number,
      streams: filterData.value?.streams,
      assessment_area_number: filterData.value?.assessment_area_number,
    }

    teacherStore.fetchTeacherOnboarding(data)
  }
}


const debounceSearch = () => {
  clearTimeout(typingTimer);
  typingTimer = setTimeout(() => {
    doFetchTeacherOnboarding()
  }, 1000);
};

// Watch the search input and debounce the search function
watch(search, () => {
  debounceSearch();
});


const filterInfo = (data) => {
  if(data) {
    filterData.value = {...data}
    doFetchTeacherOnboarding()
  }
}


watch(
    () => roleStore.roleResponse,
    async (data) => {
      if(data){
        rolesData.value = data.data
      }
    }
    )
 
    
watch (
    () => accountStore.newAccountResponse,
    async (data) => {
      if(data){
        assignDialog.value = false
      }
    },
    {deep:true}
)







  const fetchTeachers = (data) => {
    if(data) {
      let current_page = data.page
      page.value = current_page
      tableLoader.value = false

      let per_page_item = data.per_page;
      per_page.value = per_page_item;

      let objArray = data.content

      let count_items = (current_page * per_page_item)
      let totalItems = data?.total_rows


      if(objArray && objArray.length > 0){

      per_page.value = per_page_item;
      page.value = current_page
      total_rows.value = totalItems

      total_items.value = (count_items > totalItems) ? totalItems : count_items
        objArray.forEach((list, i) => {

          list.key =  (current_page - 1) * per_page_item + i + 1

          const index = userData.value.findIndex(object => object.number === list.number);

          if (index === -1) {
            userData.value.push(list);
          }

        })
      }


    }
  }



watch(
    () => teacherStore.teacherOnboardingResponse,
    async (data) => {
      if (data) {
        fetchTeachers(data?.data)
      }
    }
)

const deleteUser = async (user,index) => {
  const agreed = await confirmationRef.value.confirm("Are you sure, you want to remove this teacher?");
  if (agreed) {
    deletionLoader.value = index
    await teacherStore.deleteTeacherOnboarding(user)
  }
}



watch(
    () => teacherStore.deleteTeacherOnboardResponse,
    async (data) => {
      if (data) {
        deletionLoader.value = undefined
        doFetchTeacherOnboarding()
        notificationStore.successToast("Success",data.message)
      }
    }
)



watch(
    () => teacherStore.errorMessage,
    async (data) => {
      if (data) {
        deletionLoader.value = undefined
      }
    }
)

watch(
    () => teacherStore.assignTeacherResponse,
    async (data) => {
      if (data) {
        teacherDialog.value = false
        notificationStore.successToast("Success",data.message)
      }
    }
)

</script>

<template>
    <div>

      <ConfirmationModal ref="confirmationRef"></ConfirmationModal>

    <AppModal title="Teacher Onboarding" v-model="teacherDialog" xl>
      <new-teacher></new-teacher>
    </AppModal>


      <div class="row">
            <div class="col-12">

              <div class="flex flex-grow justify-end mx-2 mt-2">
                <button  style="float: right;border: none;"
                         class="btn btn-primary btn-sm" type="button"  @click="showTeacherDialog">
                  <i class="bi bi-plus"></i>
                  New Teacher
                </button>
              </div>

              <div>


              <div class="mx-2">
                <teacher-management-filters
                    @filterData="filterInfo"
                ></teacher-management-filters>
              </div>

                <div>
                  <div class="flex flex-grow justify-end mt-2 px-2">

                      <div class="w-[35%]">
                        <input
                            v-model="search"
                            type="text"
                            class="form-control form-control-sm shadow-none"
                            placeholder="Search"
                            aria-label="Search"
                            aria-describedby="basic-addon1">
                      </div>
                    </div>
                </div>




                <PaginationTemplate
                    @perPageChanged="doFetchTeacherOnboarding"
                    v-model:perPage="per_page"
                    :per_page="per_page"
                    :total_items="total_items"
                    :total_rows="total_rows"></PaginationTemplate>

                <div
                    class="w-full overflow-auto max-h-[520px] scrollbar-thin"
                    @scroll="onScroll">
                  <table id="data"
                         class="table table-hover caption-top mt-1 table-sm table-striped"
                         style="font-size: 13px !important;" >
                    <thead>
                    <tr>
                      <th>#</th>
                      <th scope="col">Date</th>
                      <th scope="col">Name</th>
                      <th scope="col">School</th>
                      <th scope="col">Campus</th>
                      <th scope="col">Curriculum</th>
                      <th scope="col">Level</th>
                      <th scope="col">Class</th>
                      <th scope="col">Assessment Area	</th>
                      <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(user, index) in userData" :key="index">
                      <td>{{ index+1 }}</td>
                      <td>{{ user?.created_at}}</td>
                      <td>{{ user?.first_name + " " +user?.last_name + " " + user?.second_name }}</td>
                     <td>{{ user?.school_name}}</td>
                     <td>{{ user?.campus_name}}</td>
                     <td>{{ user?.curriculum_name}}</td>
                     <td>{{ user?.level_name}}</td>
                     <td>{{ user?.campus_class_name}}</td>
                     <td>{{ user?.assessment_area_name}}</td>
                     <td>
                       <button type="button" @click="deleteUser(user, index)">
                         <i class="bi bi-trash" style="color:rgb(201, 10, 10)"></i>
                         <div class="spinner-border spinner-border-sm ml-2" role="status" v-if="deletionLoader === index">
                           <span class="visually-hidden">Loading...</span>
                         </div>
                       </button>
                     </td>
                    </tr>


                    </tbody>
                  </table>
                </div>

              </div>
        </div>
        </div>
    </div>
    
    
    
    </template>
      


    <style scoped>
    .btn{
      border-radius: 4px !important;
    }
    </style>