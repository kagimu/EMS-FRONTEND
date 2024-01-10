<template>
    <div>
  
      <div class="row mt-3">
        <div class="col-12">
          <button class="btn btn-primary btn-sm float-end mr-3" type="button" data-bs-toggle="offcanvas" data-bs-target="#rolesDialog" aria-controls="rolesDialog">New Roles</button>
  
          <div class="offcanvas offcanvas-end" tabindex="-1" id="rolesDialog" aria-labelledby="offcanvasRightLabel">
            <div class="offcanvas-header">
              <h5 class="offcanvas-title" id="offcanvasRightLabel">New Role</h5>
              <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body">
  
  
              <form @submit.prevent="addCampus">
  
  
  
                <div class="mb-2">
                  <label class="textColor"><small>Role name</small></label>
                  <input type="text" v-model="form.first_name" required class="form-control">
                </div>
  
  
                <div class="mb-2">
                  <label class="textColor"><small>Description</small></label>
                  <textarea class="form-control noFocus" id="floatingTextarea2" style="height: 100px"></textarea>
                </div>
  
  
  
  
  
                <div class="text-right mt-4">
                  <button type="submit" class="btn btn-primary mb-2">
                    save
  
                    <div class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                  </button>
                </div>
  
  
              </form>
  
  
            </div>
          </div>
  
  
        </div>
      </div>
  
  
  
      <div class="row">
        <div class="col-12">
  <!--        <div class="card mt-3">-->
  <!--          <div class="card-body" style="padding: 0;">-->
  
              <div class="mb-3 ml-5 mt-3" style="font-size: 18px;">Roles and Permission</div>
  
              <table class="table table-hover caption-top" style="font-size: 14px;">
                <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Access Areas</th>
                  <th scope="col">Permissions</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <th scope="row">1</th>
                  <td>Profiles</td>
                  <td>
                    <ul style="font-size: 12px;">
                      <li>- Can Create profile</li>
                      <li>- Can Edit profile</li>
                      <li>- Can Delete profile</li>
                    </ul>
  
                  </td>
                </tr>
                </tbody>
              </table>
  
  <!--          </div>-->
  <!--        </div>-->
        </div>
  
  
      </div>
  
    </div>
  </template>
  
  <script setup>
  
  import {reactive, ref} from "vue";
  
  const buttonLoader = ref(false)
  let show = ref(false)
  
  const form = reactive({
    first_name:null,
    second_name:null,
    email:null,
    phone:null,
    location:null,
    level:""
  })
  
  function addCampus(){
    alert(JSON.stringify(form))
  }
  
  </script>
  
  <style scoped>
  
  input:focus {
    box-shadow: none;
  }
  
  .textColor{
    color: #717375;
  }
  
  .noFocus:focus {
    outline: none 0 !important;
    box-shadow: none;
    -moz-box-shadow: none;
    -webkit-box-shadow: none;
  }
  
  .noFocus {
    box-shadow: none !important
  }
  
  
  </style>