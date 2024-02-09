<template>
<div>

  <table id="datatable"
      class="table table-striped"
      style="font-size: 13px !important;" >
    <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">First name</th>
      <th scope="col">Second name</th>
      <th scope="col">Gender</th>
      <th scope="col">Email</th>
      <th scope="col">Phone</th>
      <th>Actions</th>
    </tr>
    </thead>
    <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Mark</td>
      <td>Otto</td>
      <td>Male</td>
      <td>otto@gmail.com</td>
      <td>0789878765</td>
      <td>
        <RouterLink :to="{name : 'new-admission'}" class="link-primary"  >
          admit student <i class="bi bi-arrow-right"></i>
        </RouterLink>
      </td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Jacob</td>
      <td>Thornton</td>
      <td>Male</td>
      <td>thornton@gmail.com</td>
      <td>078675654</td>
    
    <td>
        <RouterLink :to="{name : 'new-admission'}" class="link-primary"  >
          Admit Student <i class="bi bi-arrow-right"></i>
        </RouterLink>
      </td></tr>
    <tr>
      <th scope="row">3</th>
      <td>Larry the Bird</td>
      <td>twitter</td>
      <td>Female</td>
      <td>twitter@gmail.com</td>
      <td>0709897656</td>
      <td>
        <RouterLink :to="{name : 'new-admission'}" class="link-primary"  >
          Admit Student <i class="bi bi-arrow-right"></i>
        </RouterLink>
      </td>
    </tr>
    <tr>
      <th scope="row">4</th>
      <td>Larry the Bird</td>
      <td>twitter</td>
      <td>Male</td>
      <td>twitter@gmail.com</td>
      <td>0709897656</td>
      <td>
        <RouterLink :to="{name : 'new-admission'}" class="link-primary"  >
          Admit Student <i class="bi bi-arrow-right"></i>
        </RouterLink>
      </td>
    </tr>
    </tbody>
  </table>

</div>
</template>

<script setup>
import NewAdmission from "@/main/dashboard/studentAdmission/NewAdmission.vue";

</script>

<style scoped>

</style>