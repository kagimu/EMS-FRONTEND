<script setup>
import {onMounted, ref, watch} from "vue";
import useCommonsStore from "@/composables/useCommons.js";


const commentTextEditor = ref(null)
const comment = ref('')
const hasProcessed = ref(false)
const commons = useCommonsStore()

const emits = defineEmits(["update:textResponse"]);

const props = defineProps({
  contenteditable: String,
  textAreaMinHeight: String,
  noBoarder: String,
  textInfo: String
})

onMounted(() => {
  checkDraft()
})

watch(
    () => props.textInfo,
    async (data) => {
      if (data) {
        checkDraft()
      }
    },
);


const checkDraft = () => {
  let draft =  props.textInfo
  if(draft && (draft.length > 0) && !hasProcessed.value){
    hasProcessed.value = true
    comment.value = draft
    commentTextEditor.value.innerHTML = commons.commentAlteration(draft)
  }
}



watch(comment, (newVal) => {
  emits("update:textResponse", newVal);
});


const onInputChange = (event) => {
  // Capture the HTML content of the div
  comment.value = event.target.innerHTML
}


const focusCommentBox = () => {
  commentTextEditor.value.focus()
}

const clearCommentBox = () => {
  commentTextEditor.value.innerHTML = "";
  comment.value = ""
}


defineExpose({
  focusCommentBox,
  clearCommentBox
});



</script>

<template>
  <div>

    <div
        class="p-0 mb-2 w-full"
        :class="[noBoarder ? '' : 'border rounded-xl']"
    >
      <div
          :class="[
            (contenteditable === 'false' ? 'bg-[#f0f2f5] cursor-not-allowed' : 'bg-white'),
            (textAreaMinHeight ? textAreaMinHeight : 'min-h-[45px]')
            ]"
          ref="commentTextEditor"
          :contenteditable="contenteditable ? contenteditable : 'true'"
          class="
          shadow-none
           rounded-xl
          text-[#4c5663]
           text-[14px]
           p-[10px]
           flex-wrap
           border-0
           focus:outline-none"
          @input="onInputChange"
      ></div>
    </div>
  </div>
</template>

<style scoped>

</style>