<template>


  <!-- Block level -->
  <div class="row">
    <div class="col-2 text-truncate">
      This text is quite long, and will be truncated once displayed.
    </div>
  </div>

  <!-- Inline level -->
  <span class="d-inline-block text-truncate" style="max-width: 150px;">
  This text is quite long, and will be truncated once displayed.
</span>




  <div>
    <div class="row">
      <div class="col-12 col-sm-12 col-md-6 col-lg-6" style="background-color: chocolate;">
        Column 1
      </div>
      <div class="col-12 col-sm-12 col-md-6 col-lg-6" style="background-color: green;">
        Column 2
      </div>
    </div>
  </div>



  <table class="table">
    <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">First</th>
      <th scope="col">Last</th>
      <th scope="col">Handle</th>
    </tr>
    </thead>
    <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Jacob</td>
      <td>Thornton</td>
      <td>@fat</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td colspan="2">Larry the Bird</td>
      <td>@twitter</td>
    </tr>
    </tbody>
  </table>


  <div class="container text-center">
    <div class="row">
      <div class="col-6 col-sm-3">.col-6 .col-sm-3</div>
      <div class="col-6 col-sm-3">.col-6 .col-sm-3</div>

      <!-- Force next columns to break to new line -->
      <div class="w-100"></div>

      <div class="col-6 col-sm-3">.col-6 .col-sm-3</div>
      <div class="col-6 col-sm-3">.col-6 .col-sm-3</div>
    </div>
  </div>



  <button
      class="btn btn-primary"
      data-bs-target="#collapseTarget"
      data-bs-toggle="collapse">
    Bootstrap collapse
  </button>
  <div class="collapse py-2" id="collapseTarget">
    This is the toggle-able content!
  </div>



  <div class="grid grid-cols-2 gap-4">
    <div class="bg-gray-200 p-4">Item 1</div>
    <div class="bg-gray-200 p-4">Item 2</div>
    <div class="bg-gray-200 p-4">Item 3</div>
    <div class="bg-gray-200 p-4">Item 4</div>
  </div>


  <div>
    <h2 class="text-2xl font-bold text-blue-800 underline">
      how to start your project with tailwind css & Vue 3
    </h2>
  </div>

  <h1 class="text-3xl font-bold underline">
    Hello world!
  </h1>



  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
      >create-vue</a
    >, the official Vue + Vite starter
  </p>
  <p>
    Install
    <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>
    in your IDE for a better DX
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<script setup>
import { ref } from 'vue'


defineProps({
  msg: String,
})

const count = ref(0)
</script>


<style scoped>
.read-the-docs {
  color: #888;
}
</style>
