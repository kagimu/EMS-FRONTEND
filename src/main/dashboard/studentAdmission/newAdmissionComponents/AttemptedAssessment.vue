<template>
    <div>


      <div class="row">
        <div class="modal fade" id="admitMainModal" tabindex="-1" :class="{ show: admitshow }" aria-labelledby="" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header text-sm p-0">
            <h6 class="modal-title ml-8 mt-2 mb-2">CHOOSE STUDY PERIOD</h6>
            <button style="margin-right: 5px;" type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mt-2 mb-2">
           <AdmitModel></AdmitModel>
          </div>
          </div>

        </div>
      </div>
    </div>


          
                 <div class="ant-alert-action mt-3">
                  <button type="submit" class="mb-2 btn btn-outline-primary btn-sm" style="float: right;"><i></i>Preview/Print Report</button>
                  <button @click="showDialog()" data-bs-toggle="modal" data-bs-target="#admitMainModal" type="submit" class="mb-2 btn btn-primary btn-sm ml-2 mr-2 " style="float: right;"><i></i>Admit Student</button>
           
                </div>
                <div class="ant-card-body mt-0 mb-5">
                <div class="row">
                    <div class="col-md-12">
                        <div class="table-responsive">
                  <table class="text-sm table table-sm table-striped table-bordered">
                    <thead>
                        <th>ASSESSMENT</th>
                        <th>SCORE</th>
                        <th>GRADE</th>
                        <th>COMMENT</th>
                    </thead>
                    <tbody>
                      <tr>
                        <td style="width: 200px;">Mathematics</td>
                        <td><span class="ant-tag ant-tag-error css-zxymk0"><span role="img" aria-label="stop" class="anticon anticon-stop">  
                    </span><span>79</span></span>
                  </td>
                  <td><span class="ant-tag ant-tag-error css-zxymk0">
                    <span role="img" aria-label="stop" class="anticon anticon-stop">  
                    </span><span>D1</span></span>
                  </td>
                  <td>Excellent Mark</td>
                </tr>
                <tr>
                        <td style="width: 200px;">SST</td>
                        <td><span class="ant-tag ant-tag-error css-zxymk0"><span role="img" aria-label="stop" class="anticon anticon-stop">  
                    </span><span>89</span></span>
                  </td>
                  <td><span class="ant-tag ant-tag-error css-zxymk0">
                    <span role="img" aria-label="stop" class="anticon anticon-stop">  
                    </span><span>D1</span></span>
                  </td>
                  <td>Excellent</td>
                </tr>

                <tr>
                        <td style="width: 200px;">SST</td>
                        <td><span class="ant-tag ant-tag-error css-zxymk0"><span role="img" aria-label="stop" class="anticon anticon-stop">  
                    </span><span>89</span></span>
                  </td>
                  <td><span class="ant-tag ant-tag-error css-zxymk0">
                    <span role="img" aria-label="stop" class="anticon anticon-stop">  
                    </span><span>D1</span></span>
                  </td>
                  <td>Excellent</td>
                </tr>

                <tr>
                        <td style="width: 200px;">SST</td>
                        <td><span class="ant-tag ant-tag-error css-zxymk0"><span role="img" aria-label="stop" class="anticon anticon-stop">  
                    </span><span>89</span></span>
                  </td>
                  <td><span class="ant-tag ant-tag-error css-zxymk0">
                    <span role="img" aria-label="stop" class="anticon anticon-stop">  
                    </span><span>D1</span></span>
                  </td>
                  <td>Excellent</td>
                </tr>
                    </tbody>
                    </table>
  
                  </div>
                </div>
            </div>

  </div></div></div>

    
    </template>
    
    <script setup>
    import {onMounted,reactive, ref, watch,watchEffect,computed} from "vue"
    import useNotificationStore from "@/composables/useNotification.js"
    import {useRouter} from "vue-router"
import AdmitModel from "../../studentApplication/AdmitModel.vue";

  
  const routerData = useRouter()
  const router = useRouter()
  let errorMessage = ref(null)
  const emit = defineEmits()
  const admitshow = ref(false)

  const selectedconditions = ref([])
  const  notificationStore  = useNotificationStore()

  const studentNumber = routerData.currentRoute.value.query.id;

  const showDialog = () => {
    admitshow.value = true
  }
  


  
    
    </script>
  
  
    
    <style scoped>
    
    </style>