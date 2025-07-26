<template>
    <div>
        <h5 class="mt-3 mb-3">Subject Attendance (2024-Feb-29)</h5>
        <form class="mb-10 mt-4">
          <div class="row">
            <div class="col-lg-12">
                <div class="mb-2 mr-5 ml-5">
            <label class="text-sm mt-3 mb-2">Assessment Area | Subject</label>
            <select class="form-select form-select-sm form-control">
                <option>- select -</option>
                <option>Math</option>
            </select>
          </div>
          </div>
      
          <!-- <div class="col-lg-3">
            <div class="mb-2 mr-5 ml-5 mt-10">
       <button class="btn btn-primary btn-sm"><i class="bi bi-arrow-right"></i><small>View ClassList</small> </button>
          </div>
        </div> -->
     

         
            
          </div>
        </form>

     <table class="table table-hover caption-top table-striped" style="font-size: 14px;">
    <thead>
      <tr>
        <th scope="col">No</th>
        <th scope="col">Name</th>
        <th scope="col">Gender</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td>Collins Mpiima</td>
        <td>Male</td>
        <td>
            <button class="btn btn-sm btn-outline-primary mb-2 mr-4" type="button" aria-controls="rolesDialog">
           Present
          </button> 
          <button class="btn btn-sm btn-outline-warning mb-2 mr-4" type="button" aria-controls="rolesDialog">
         Late
          </button>
          <button class="btn btn-sm btn-outline-primary mb-2 mr-4" type="button" aria-controls="rolesDialog">
           Present
          </button>
                 
      
        </td>
      </tr>

      <tr>
        <td>4</td>
        <td>Collins Mpiima</td>
        <td>Male</td>
        <td>
          <!-- Buttons for actions -->
          <button class="btn btn-sm btn-outline-primary mb-2 mr-4" type="button" aria-controls="rolesDialog">
           Present
          </button> 
          <button class="btn btn-sm btn-outline-warning mb-2 mr-4" type="button" aria-controls="rolesDialog">
         Late
          </button>
          <button class="btn btn-sm btn-outline-primary mb-2 mr-4" type="button" aria-controls="rolesDialog">
           Present
          </button>
                 
      
        </td>
      </tr>


      <tr>
        <td>3</td>
        <td>Collins Mpiima</td>
        <td>Male</td>
        <td>
            <button class="btn btn-sm btn-outline-primary mb-2 mr-4" type="button" aria-controls="rolesDialog">
           Present
          </button> 
          <button class="btn btn-sm btn-outline-warning mb-2 mr-4" type="button" aria-controls="rolesDialog">
         Late
          </button>
          <button class="btn btn-sm btn-outline-primary mb-2 mr-4" type="button" aria-controls="rolesDialog">
           Present
          </button>
                 
      
        </td>
      </tr>
     
    </tbody>
  </table>
      </div>



</template>
<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToMClassList = () => {
  router.push('class-list') 
}

</script>

<style scoped>
.mb-8 {
  margin-bottom: 2rem;
  text-align: left;
  color: rgb(0, 0, 0);
  font-family: Roboto, sans-serif;
  font-size: 17px;
}
.mb-2 {
  text-align: left;
  font-family: Roboto, sans-serif;
  border-radius: 3px !important;
}
input{
background-color: #f8f9fa;
border-radius: 2px;
font-size: 10px !important;
}
.tit{
text-align: center;
margin-top: 15px;
text-decoration: underline;
}
.star{
color:red;
}
textarea{
border-radius: 2px !important;
}
select{
border-radius: 2px !important;
}
.small-input {
width: 150px;
font-size: 13px;
}
</style> 