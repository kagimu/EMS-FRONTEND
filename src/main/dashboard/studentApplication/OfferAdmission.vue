<template>
  <div>
    <form @submit.prevent="admitStudent">
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
              <div class="row"><div class="col-md-9"><div class="table-responsive">
                <table class="text-sm table table-sm table-striped table-bordered">
                  <tbody>
                    <tr>
                      <td style="width: 200px;">APPLICANT:</td>
                      <td><span class="ant-tag ant-tag-error css-zxymk0"><span role="img" aria-label="stop" class="anticon anticon-stop">  
                  </span><span>Collins Mpiima</span></span>
                </td>

              </tr>
              <tr>
                      <td style="width: 200px;">GENDER:</td>
                      <td><span class="ant-tag ant-tag-error css-zxymk0"><span role="img" aria-label="stop" class="anticon anticon-stop">  
                  </span><span>Male</span></span>
                </td>
              </tr>
              <tr>
                      <td style="width: 200px;">Age:</td>
                      <td><span class="ant-tag ant-tag-error css-zxymk0"><span role="img" aria-label="stop" class="anticon anticon-stop">  
                  </span><span>13 yrs</span></span>
                </td>
                
              </tr>

              <tr>
                <td>APPLICATION ID:</td><td>23APF1262809490107136</td></tr>
                  <tr><td>PREFERED CLASS:</td><td>P.2</td></tr>
                  <tr><td>SCHOOL:</td><td>Paul Mukasa Primary</td>
                  </tr>
                  <tr><td>CAMPUS:</td><td>MAIN CAMPUS</td></tr>
                  <tr><td>INTERVIEW STATUS:</td>
                    <td class="font500 text-info"></td> </tr>
                    <tr><td>Payment Status:</td>
                      <td class="font500"><span class="font500 text-info ms-1"><span class="text-warning">PENDING</span></span></td>
                    </tr></tbody>
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
</form>

  </div>
  
  </template>
  
  <script setup>
import {onMounted,reactive, ref, watch,watchEffect,computed} from "vue"
import {useRouter} from "vue-router"
const routerData = useRouter()

const router = useRouter()
const emit = defineEmits()
const studentNumber = routerData.currentRoute.value.query.id;
const conditions = ref([])

const admitStudent = () => {

}


  </script>


  
  <style scoped>
  
  </style>