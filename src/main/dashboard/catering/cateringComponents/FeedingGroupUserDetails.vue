<template>
    <div>
     
      <div class="row">
        <div class="col-12">
          <div class="card mt-3">
            <div class="card-body" style="padding: 0;">
  
              <div class="card-body"><div class="pt-2"><div><div data-show="true"
                 class="ant-alert ant-alert-info ant-alert-no-icon mb-3 css-zxymk0" role="alert">
                
                 <div class="ant-alert-action">
                  <button type="submit" class="ant-btn css-zxymk0 ant-btn-primary ant-btn-sm ant-btn-dangerous text-sm text-uppercase fw-bold"></button>
           </div>
                <div class="ant-card-body">
                
                <div class="row">
                  <div class="col-md-12">
                    <h5 class="mb-2" style="font-size: 14px;">FEEDING GROUP DETAILS</h5>
                  <div class="table-responsive">
                  <table class="text-sm table table-sm table-striped table-bordered">
                    <tbody>
                      <tr>
                        <td style="width: 200px;"><b>Name</b></td>
                        <td><span class="ant-tag ant-tag-error css-zxymk0"><span role="img" aria-label="stop" class="anticon anticon-stop">  
                    </span><b>Feeding Group</b><span>
                    </span></span>
                  </td>
                  <td><b>Status</b></td>
  
                </tr>
               
                <tr v-for="(list,index) in feedData" :key="index">
                 <td>{{ list.name }}</td>
                 <td>{{ list.feeding_group_name }}</td>
                 <td>{{ list.status }}</td>
                </tr>
               
                </tbody>
                    </table>
  
                  </div>
                </div>
                    </div>
                    </div>
                  </div></div>
                  </div>
                </div>
  
  </div>
    </div>
    </div></div>

  
    </div>
    
    </template>
    
    <script setup>
  import {onMounted,reactive, ref, watch,watchEffect,computed} from "vue"
  import {useRouter} from "vue-router"
  const routerData = useRouter()
  
  import useNotificationStore from "@/composables/useNotification.js";
  import useCommons from "@/composables/useCommons.js";
  import {useCateringStore} from "@/main/dashboard/catering/store/catering.js";
  
  const router = useRouter()
  const emit = defineEmits()
  const userId = routerData.currentRoute.value.query.st_id;
  const notificationStore = useNotificationStore()
  let errorMessage = ref(null)
  const useCommonsStore = useCommons()
  const cateringStore = useCateringStore()
  const feedData = ref([])
  

  onMounted(() => {
    cateringStore.fetchFeedingGroupUserById(userId)
        }
    )

    watch(
    () => cateringStore.feedingGroupUsersResponse,
    async (data) => {
      feedData.value = data.data
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


  
  
  
  
    </script>
  
  
    
    <style scoped>
    
    </style>