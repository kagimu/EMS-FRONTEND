<script setup>
import {onMounted, ref, watch} from "vue";
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';
import useCommonsStore from "@/composables/useCommons.js";
import api from "@/config/api.js";
import {useRouter} from "vue-router";
import useNotificationStore from "@/composables/useNotification.js";
const routerData = useRouter()
const notificationStore  = useNotificationStore()
const emit = defineEmits()

const errorMessage = ref(null)
const selectedFile = ref(null)
const schoolNumber = ref(null)
const signatureInput = ref(null)
const cropper = ref(null)
const showSignaturePreview = ref(false)
const uploadImageButton = ref(true)
const saveImageButton = ref(false)
const showImage = ref(true)
const showCropper = ref(false)
const loader = ref(false)

let school_number = ""
    school_number = routerData.currentRoute.value.query.id
let student_number = ""
    student_number = routerData.currentRoute.value.query.st_id

const commons = useCommonsStore()

const props = defineProps({
  imageUrl: String,
  schoolNumber: String,
  studentNumber: String,
})



onMounted(() => {
  updateImageCanva()
})

watch(
    () => props.imageUrl,
    async (data) => {
      if(data){
       updateImageCanva()
      }
    }
)


const updateImageCanva = () => {
  let url = props.imageUrl
  if(url) {
    selectedFile.value = url
  }
  if(props.schoolNumber) {
    school_number = props.schoolNumber
  }

  if(props.studentNumber) {
    student_number = props.studentNumber
  }
}


function onFileSelect(e) {
  const file = e.target.files[0]
  if (typeof FileReader === "function") {
    uploadImageButton.value = false
    saveImageButton.value = true

    showImage.value = false
    showCropper.value = true

    showSignaturePreview.value = true
    const reader = new FileReader()
    reader.onload = (event) => {
      selectedFile.value = event.target.result
      cropper.value.replace(selectedFile.value)
    }
    reader.readAsDataURL(file)
  } else {
    // errorToast("Sorry, FileReader API not supported")
  }
}

function cancelProfile(){
  showImage.value = true
  showCropper.value = false

  saveImageButton.value = false
  uploadImageButton.value = true
}


function saveProfile() {
  if (showSignaturePreview.value) {
    loader.value = true
    errorMessage.value = ""
    let formData = new FormData()
    formData.set(school_number?"logo":"photo", commons.base64ToBinary(cropper.value.getCroppedCanvas().toDataURL("image/png"), "logo.png"))
    if(school_number){
      formData.set("school_number", school_number )
    }else {
      formData.set("student_number", student_number )
    }

    saveFile(formData)
  }
}


const  saveFile = async (data) => {
  let url = school_number ? 'main/school/upload-logo' : 'main/student-details/upload-student-photo'
  return await api.post(url, data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      .then((response) => {
        if(response && response.data){
          loader.value = false
          emit("nextAction", "success")
          notificationStore.successToast("Success", response.data.message)
        }
      })
      .catch((response) => {
        if(response && response.response){
          loader.value = false
          notificationStore.errorToast("Error",response.response.data.message)
        }
      })
}





</script>
<template>
  <div>
    <form ref="form">
      <div class="mx-auto mt-4 mb-4">


        <div style="width: 50%;" class="alert alert-danger text-sm mt-3 p-2 mx-auto mb-3" role="alert" v-if="errorMessage">
          {{ errorMessage }}
        </div>

        <div style="text-align: center;">
          <img
              class="mx-auto w-[50%] border p-2 rounded-md"
              v-if="showImage"
              :src="selectedFile"
              alt=""
          />
        </div>


        <VueCropper
            v-if="showCropper"
            class="mx-auto w-[90%] h-[400px]"
            ref="cropper"
            :aspect-ratio="10 / 9"
            :src="selectedFile"
            alt="Source Image"></VueCropper>
<div v-if="showCropper" class="text-gray-500 italic text-xs text-center">Please drag the cropper (blue border) or pinch to zoom and fit the image in the frame</div>


        <input
            ref="signatureInput"
            type="file"
            accept="image/*"
            style="display: none"
            @change="onFileSelect"
        />


        <div class="text-center mt-3">
          <button
              style="background-color: #153d77;"
              v-if="uploadImageButton"
              @click="signatureInput.click()"
              class="bg-green-600 text-sm text-white active:bg-green-600 font-bold uppercase px-3 py-2 rounded-none shadow outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
              type="button">
            Upload Photo
          </button>

          <button
              v-if="saveImageButton"
              style="background-color: #ffffff; color: #1d2b36; border: solid 1px #1d2b36;"
              @click="cancelProfile"
              class="bg-green-600 text-sm  active:bg-green-600 font-bold uppercase px-3 py-2 rounded-none shadow outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
              type="button">
            Cancel
          </button>

          <button
              v-if="saveImageButton"
              style="background-color: #1d2b36; padding-left: 70px; padding-right: 70px;"
              @click="saveProfile"
              class="bg-green-600 text-sm text-white active:bg-green-600 font-bold uppercase px-10 py-2 rounded-none shadow outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
              type="button"
          >
            Save
            <span v-if="loader" style="width: 0.8rem; height: 0.8rem;"  class="spinner-border text-light ml-1" role="status">
              <span class="visually-hidden">Loading...</span>
            </span>
          </button>
        </div>


      </div>



    </form>
  </div>
</template>



<style scoped>
.noFocus:focus {
  outline: none 0 !important;
  box-shadow: none;
  -moz-box-shadow: none;
  -webkit-box-shadow: none;
}
</style>