<template>
    <div>
        <div class="row">
        <div class="col-12">
          <div class="card mt-3 ">
            <div class="card-body" style="padding: 0;">
                <div class="mb-10 ml-3 mt-2" style="font-size: 11px;">CLASSES | manage </div>
  
        <form class="mb-10">
          <div class="row">
            <div class="col-lg-3">
                <div class="mb-2 mr-5 ml-5">
            <label class="textColor mt-3 mb-2">School</label>
            <select class="form-control">
                <option>school name 01</option>
                <option>school name 02</option>
            </select>
          </div>
          </div>
          <div class="col-lg-3">
                <div class="mb-2 mr-5 ml-5">
            <label class="textColor mt-3 mb-2">Campus</label>
            <select class="form-control">
                <option>Campus 01</option>
                <option>Campus 02</option>
            </select>
          </div>
          </div>
          <div class="col-lg-3">
                <div class="mb-2 mr-5 ml-5">
            <label class="textColor mt-3 mb-2">Class</label>
            <select class="form-control">
                <option>P1</option>
                <option>P2</option>
            </select>
          </div>
        </div>
          <div class="col-lg-3">
            <div class="mb-2 mr-5 ml-5 mt-10">
       <button @click="goToClassList()" class="btn btn-primary btn-sm"><i class="bi bi-arrow-right"></i><small>View ClassList</small> </button>
          </div>
        </div>
     

         
            
          </div>
        </form>
              
  
  
            </div>
          </div>
        </div>
  
  
      </div>
    </div>
</template>
<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToClassList = () => {
  router.push('class-list') 
}

</script>