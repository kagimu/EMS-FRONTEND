<template>
    <div>
    <form @submit.prevent="">
      <div class="mb-2">
        <label class="textColor text-sm">Payer</label>
        <input  style="outline: none 0 !important; box-shadow: none;" type="text" required class="form-control form-control-sm">
      </div>
      <div class="mb-2">
        <label class="textColor text-sm">Payment Reference</label>
        <input  style="outline: none 0 !important; box-shadow: none;" type="text" required class="form-control form-control-sm">
      </div>
      <div class="mb-2">
        <label class="textColor text-sm">Amount</label>
        <input  style="outline: none 0 !important; box-shadow: none;" type="number" required class="form-control form-control-sm">
      </div>
      <div class="mb-2">
        <label class="textColor text-sm">Date</label>
        <input  style="outline: none 0 !important; box-shadow: none;" type="date" required class="form-control form-control-sm">
      </div>

      <div class="flex justify-content-end mt-3" style="width: 100%;">
        <button
            type="submit"
            class="btn btn-primary border-0 btn-sm">
           <small>  <i class="bi bi-save2"></i>   Save </small>
              <span v-if="loader" style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-light" role="status">
                  <span class="visually-hidden">Loading...</span>
                </span>
        </button>
      </div>

    </form>
</div>
</template>

<script setup>
</script>
<style>
</style>