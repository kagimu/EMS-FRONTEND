<template>
    <div>
      <div class="row">
  
          
                 <div class="ant-alert-action mt-3">
                  <button type="submit" class="mb-2 btn btn-outline-primary"><i></i>Preview/Print Report</button>
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

  
  const routerData = useRouter()
  const router = useRouter()
  let errorMessage = ref(null)
  const emit = defineEmits()

  const selectedconditions = ref([])
  const  notificationStore  = useNotificationStore()

  const studentNumber = routerData.currentRoute.value.query.id;
  


  
    
    </script>
  
  
    
    <style scoped>
    
    </style>