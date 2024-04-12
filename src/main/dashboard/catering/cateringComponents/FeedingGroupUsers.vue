<template>
    <div>
  
      <div class="row">
        <div class="modal fade" id="admitMainModal" tabindex="-1" :class="{ show: admitshow }" aria-labelledby="" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header text-sm p-0">
            <h6 class="modal-title ml-8 mt-2 mb-2">Submit</h6>
            <button style="margin-right: 5px;" type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mt-2 mb-2">
           <AdmitModel :selectedStudentNumber="selectedStudentNumber"></AdmitModel>
          </div>
          </div>
        </div>
      </div>
    </div>
    </div>
     
  
      <!-- end  -->
      <div class="row mt-3">
        <div class="col-12">
          <div class="">
            <div class="" style="padding: 0;">
    <div class="container mt-4">
        <div class="row">
          <div class="col-lg-12">
            <div class="">
              <div class="">
                  <h5 style="font-size: 14px;margin-top: 2px;">Student List </h5>
               
              
              </div>
            </div>
          </div>
        </div>
        
  


        <div class="row">
<div class="col-lg-8">
      <table
        id="datatable"
        class="table table-striped"
        style="font-size: 14px !important;"
      >
      <thead >
          <tr>
            <th style="width: 5px;"><input type="checkbox"   class="checkbox-primary"></th>
            <th>ADN</th>
            <th>Student</th>
            <th>Gender</th>     
          </tr>
    <div class="alert alert-danger" role="alert" v-if="errorMessage" style="padding: 0.5rem 1rem; font-size: 0.8rem;">
      {{errorMessage}}
    </div>
        </thead>
        <tbody>
          <tr v-for="(student, index) in userList" :key="index">
            <td><input type="checkbox"  v-model="selectedStudents[index]" class="checkbox-primary"></td>
            <td>{{ student.Student.apn }}</td>
            <td> 
              {{ student.Student.surname + " " + student.Student.second_name + " " + student.Student.other_name}} </td>
            <td>
              {{  student.Student.gender }}
            </td>
            
            <td>
                    
            </td>
          </tr>   
                    
        </tbody>
      </table>
    </div>
</div>
<div class="col-lg-4">            
<label>Feeding Group</label>
<select class="form-select form-control" v-model="formData.feeding_group_number">
    <option>-select</option>
    <option v-for="(list,index) in feedingGroupData" :key="index" :value="list.number">{{list.name  }}</option>
</select>

<div class="ant-alert-action mt-6">
<button  @click="addFeedingGroupUsers"  :data-bs-target="selectedStudentNumber.length > 0 ? '#' : ''" type="submit"
class="mb-2 btn btn-primary btn-sm ml-2 mr-2 " 
style="float: rigt;"><i></i>Register Meal</button>
</div>
                    
               

</div>
    </div>
    </div>
    </div>
    </div>
    </div>
  
  
    </div>
    </template>
    
    <script setup>
  import {onMounted,reactive, ref,computed, watch} from "vue";
  import useNotificationStore from "@/composables/useNotification.js";
  import AdmitModel from "@/main/dashboard/studentApplication/AdmitModel.vue";
  import { useEnrolmentStore } from "@/main/dashboard/enrollment/store/enrollment";

  import {useCateringStore} from "@/main/dashboard/catering/store/catering.js";

const cateringStore = useCateringStore()


  const feedingGroupData = ref([])

  const enrollmentStore = useEnrolmentStore()


  const userList = ref( [])
  let errorMessage = ref(null)
  const buttonLoader = ref(false)
  const  notificationStore  = useNotificationStore()

   
  const selectedStudents = ref([])

  
  const formData = reactive ({
    feeding_group_number:null
  })
  

  
  onMounted(
      () => {
        enrollmentStore.fetchEnrolment()
        cateringStore.fetchFeedingGroup()
      }
  )
  
  watch(
    () => cateringStore.feedingGroupInfoResponse,
    async (data) => {
        feedingGroupData.value = data.data
    },
    {deep: true}
  )





  watch (
    () => enrollmentStore.enrolmentResponse,
    async (data) => {
      if(data){
        userList.value = data.data
      }
    },
    {deep:true}
  )

  
    const selectedStudentNumber = computed(() => {
    const selectedNames = [];
    selectedStudents.value.forEach((isSelected, index) => {
      if (isSelected) {
        selectedNames.push(userList.value[index].Student.number);
      }
    });
    return selectedNames;
  })
    
  
  const addFeedingGroupUsers = () => {
    // admitshow.value = true
    if (selectedStudentNumber.value.length === 0) {
      admitshow.value=false
      notificationStore.errorToast("Error", "Please select at least one student to offer admission.");
    } else {
      let data = reactive({
        feeding_group_number:formData.feeding_group_number,
        user_number:selectedStudentNumber,
        status:"ACTIVE"
      })
      alert(JSON.stringify(data)) 
      cateringStore.newFeedingGroupUsers(data)
    }
  }
//   newFeedingGroupResponse
watch (
  () => cateringStore.newFeedingGroupResponse,
  async (data) => {
    if(data){
      notificationStore.successToast("Success", data.message)
    }
  },
  {deep:true}
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
  
  
    </script>
  
  
    
    <style scoped>
  
    </style>