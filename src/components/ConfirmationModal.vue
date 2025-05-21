<script setup lang="ts">
import { ref, defineExpose } from 'vue';
import AppModal from "@/components/AppModal.vue";


// Dialog state and message
const rejectConfirmationDialog = ref(false);
const confirmationMessage = ref('');

// Callbacks for promise resolution
const resolveCallback = ref<((value: boolean) => void) | null>(null);
const rejectCallback = ref<(() => void) | null>(null);

const confirm = (title: string)  => {
  rejectConfirmationDialog.value = true;
  confirmationMessage.value = title;

  return new Promise((resolve, reject) => {
    resolveCallback.value = resolve;
    rejectCallback.value = reject;
  });
};

const props = defineProps({
  removeBorder:String,
  title:String,
})




const rejectAction = () => {
  rejectConfirmationDialog.value = false;
};


const confirmAction = () => {
  rejectConfirmationDialog.value = false;
  if (resolveCallback.value) {
    resolveCallback.value(true);
  }
};

defineExpose({
  confirm,
});
</script>

<template>
<div>
  <AppModal title="&nbsp" :removeBorder="props.removeBorder" v-model="rejectConfirmationDialog" lg>
    <div class="rounded-md pb-3">

      <div>
         <div class="text-[17px] font-bold ml-3">

           <i class="text-[orange] text-[20px] fa-solid fa-exclamation-triangle"></i>
             {{title ? title : "Confirm"}}!
           </div>

          <div class="ml-3 pb-3 pt-2 text-[15px]">
            <p>{{confirmationMessage}}</p>
          </div>
      </div>

  <div>
    <div class="flex justify-between px-[12px]">
      <button
          @click="rejectAction"
          type="button"
          class="hover:bg-[red] hover:text-white rounded border-2 border-[red] text-[red]  text-sm px-2 py-2">
           <span class="px-5">
                <i class="fa fa-times mr-1"></i>
              Cancel
           </span>
      </button>

      <button
          @click="confirmAction"
          type="button"
          class="hover:bg-danger-600 rounded bg-primary text-white text-sm px-2 py-2">
       <span class="px-5">
          <i class="fa fa-check-circle mr-1"></i>
        Confirm
       </span>
      </button>
    </div>
  </div>
</div>
  </AppModal>
</div>
</template>

<style scoped>



</style>