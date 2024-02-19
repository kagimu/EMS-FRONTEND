<template>
  <div class="card">
    <div class="card-body">
      <form class="mt-20"> 
        <table class="table table-bordered">
          <thead>
            <tr class="textColor"  style="padding: 0px;margin: 0px;">
              <th>Service</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Amount</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(Service, index) in Services" :key="index" class="textColor">
              <td>

                <select class="form-select form-select-lg form-control select-no-border" v-model="Service.name" @change="updateService(index)">
                  <option :value="option.name" v-for="option in availableOptions(index)">{{ option.name }}</option>
                </select>
              </td>
              <td><input   type="text" v-model="Service.quantity" @input="updateAmount(index)" placeholder="1.0" class="inp"></td>
              <td><input  type="text" v-model="Service.unitPrice" @input="updateAmount(index)" placeholder="Unit Price" class="inp"></td>
              <td>{{ Service.amount }}</td>
              <td><button type="button" @click="removeService(index)"><i class="bi bi-x-circle" style="color:red"></i></button></td>
            </tr>
          </tbody>
        </table>
        <button class="btn btn-success btn-sm textColor p-0" @click.prevent="addService" :disabled="isAddButtonDisabled"><small>ADD ANOTHER SERVICE</small></button>
        <div class="row mt-10">
          <div class="col-lg-8"></div>
          <div class="col-lg-4" >
            <ul style="float: right;">
              <!-- <li>Subtotal - {{ calculateSubtotal() }}</li> -->
              <li>Total : <span style="color:rgba(173, 12, 12, 0.92)">{{ calculateTotal() }}</span> </li>
            </ul>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
  import { ref, watch } from 'vue';

  const Services = ref([]);
  const ServiceOptions = ref([
    { name: 'Fees', unitPrice: 2000 },
    { name: 'Toilet Paper', unitPrice: 150 },
    { name: 'Ream Of papers', unitPrice: 2000 },
    { name: 'Shoes', unitPrice: 150 },
  ]);

  function updateService(index) {
    const Service = Services.value[index];
    const selectedOption = ServiceOptions.value.find(option => option.name === Service.name);
    if (selectedOption) {
      Service.unitPrice = selectedOption.unitPrice;
      updateAmount(index);
    }
  }

  function updateAmount(index) {
    const Service = Services.value[index];
    Service.amount = Service.quantity * Service.unitPrice;
  }

  function addService() {
    Services.value.push({ name: '', quantity: 1, unitPrice: 0, amount: 0 });
  }

  function removeService(index) {
    Services.value.splice(index, 1);
  }

  function calculateSubtotal() {
    return Services.value.reduce((total, Service) => total + Service.amount, 0);
  }

  function calculateTotal() {
    return calculateSubtotal();
  }

  function availableOptions(index) {
    const selectedNames = Services.value.map(Service => Service.name);
    return ServiceOptions.value.filter(option => !selectedNames.includes(option.name) || option.name === Services.value[index].name);
  }

  const isAddButtonDisabled = ref(false);
  watch(Services, (newServices) => {
    isAddButtonDisabled.value = newServices.length === ServiceOptions.value.length;
  }, { deep: true });
</script>

<style>
  /* Remove border and styling when select element is clicked */
  .select-no-border {
    border: none !important;
    appearance: none !important;
    -webkit-appearance: none !important;
    -moz-appearance: none !important; 
    outline: none !important;
    box-shadow: none !important;
  }
  .inp{
    border: none !important;
    appearance: none !important;
    -webkit-appearance: none !important;
    -moz-appearance: none !important; 
    outline: none !important;
    box-shadow: none !important;
    background-color: white !important;
  }
</style>