<template>
    <div>
        <div class="row">
        <div class="col-12">
          <div class="card mt-3 ">
            <div class="card-body" style="padding: 0;">
                <div class="mb-10 ml-3 mt-2" style="font-size: 11px;">CLASSES | manage </div>
  
                <div class="container mt-4">
      

            <table class="table table-hover caption-top table-striped" style="font-size: 14px;">
    <thead>
      <tr>
        <th scope="col">No</th>
        <th scope="col">Name</th>
        <th scope="col">Students</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td>Primary 1</td>
        <td>49</td>
        <td>
          <!-- Buttons for actions -->
          <button @click="goToMClassList()" class="btn btn-sm btn-primary mb-2 mr-4" type="button" aria-controls="rolesDialog">
            Manage
          </button>
        
      
        </td>
      </tr>
      <tr>
        <td>1</td>
        <td>Primary 1</td>
        <td>49</td>
        <td>
          <!-- Buttons for actions -->
          <button @click="goToMClassList()" class="btn btn-sm btn-primary mb-2 mr-4" type="button" aria-controls="rolesDialog">
            Manage
          </button>
        
      
        </td>
      </tr>
      <tr>
        <td>2</td>
        <td>Primary 2</td>
        <td>49</td>
        <td>
          <!-- Buttons for actions -->
          <button @click="goToMClassList()" class="btn btn-sm btn-primary mb-2 mr-4" type="button" aria-controls="rolesDialog">
            Manage
          </button>
        
      
        </td>
      </tr>
      <tr>
        <td>3</td>
        <td>Primary 3</td>
        <td>49</td>
        <td>
          <!-- Buttons for actions -->
          <button class="btn btn-sm btn-primary mb-2 mr-4" type="button" aria-controls="rolesDialog">
            Manage
          </button>
        
      
        </td>
      </tr>
      <tr>
        <td>4</td>
        <td>Primary 4</td>
        <td>49</td>
        <td>
          <!-- Buttons for actions -->
          <button @click="goToMClassList()" class="btn btn-sm btn-primary mb-2 mr-4" type="button" aria-controls="rolesDialog">
            Manage
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