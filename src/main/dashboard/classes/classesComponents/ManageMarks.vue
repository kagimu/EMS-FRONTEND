<template>
    <div>
      
        <form class="mb-10 mt-4">
          <div class="row">
            <div class="col-lg-4">
                <div class="mb-2 mr-5 ml-5">
            <label class="text-sm mt-3 mb-2">Term</label>
            <select class="form-select form-select-sm form-control">
                <option>- select -</option>
                <option>Term 1</option>
                <option>Term 2</option>
                <option>Term 3</option>
            </select>
          </div></div>
            <div class="col-lg-4">
                <div class="mb-2 mr-5 ml-5">
            <label class="text-sm mt-3 mb-2">Assessment Area | Subject</label>
            <select class="form-select form-select-sm form-control">
                <option>- select -</option>
                <option>Math</option>
            </select>
          </div></div>
          <div class="col-lg-4">
                <div class="mb-2 mr-5 ml-5">
            <label class="text-sm mt-3 mb-2">Exam Type</label>
            <select class="form-select form-select-sm form-control">
                <option>- select -</option>
                <option>Mid-Term</option>
                <option>End Of Term</option>
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
        <th scope="col">Student Name</th>
        <th scope="col">CourseWork</th>
        <th scope="col">Exam Mark</th>
        <th scope="col">Comment</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td>Collins Mpiima</td>
        <td><input type="number" class="form-control" style="width:100px"></td>
        <td><input type="number" class="form-control" style="width:100px"></td>
        <td><input type="text" class="form-control"></td>
     
      </tr>
      <tr>
        <td>2</td>
        <td>Mutebi Denis</td>
        <td><input type="number" class="form-control" style="width:100px"></td>
        <td><input type="number" class="form-control" style="width:100px"></td>
        <td><input type="text" class="form-control"></td>
      </tr>
      <tr>
        <td>3</td>
        <td>Isaac K</td>
        <td><input type="number" class="form-control" style="width:100px"></td>
        <td><input type="number" class="form-control" style="width:100px"></td>
        <td><input type="text" class="form-control"></td>
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