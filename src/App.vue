<template>
  <div class="app container-fluid p-0 m-0">
    <notifications position="bottom right" />
    <router-view :key="$route.fullPath"></router-view>


  </div>
<!-- 
   <div class="floating-help-button" @click="toggleContactDetails">
      Need Help?
    </div>

    <div v-if="showContactDetails" class="contact-details">
      <h5>Contact Us</h5>
      <p><strong>Phone:</strong> <i class="bi bi-phone ml-1" style="color:orange;font-size: 20px;"></i> +2 567 800 000</p>
      <p><strong>Email:</strong> <i class="bi bi-envelope ml-1" style="color:blue;font-size: 18px;"></i> help@wholesome.com</p>
      <p><strong> WhatsApp:</strong> <i class="bi bi-whatsapp ml-1" style="color:green;font-size: 20px;"></i> +2 567 700 000</p>
      <button @click="toggleContactDetails" class="close-btn">Close</button>
    </div> -->
  
</template>

<script setup>
// import {ref} from "vue";
// const showContactDetails = ref(false);

// const toggleContactDetails = () => {
//   showContactDetails.value = !showContactDetails.value;
// }

</script>

<style scoped>
.app{
  overflow-x: hidden;
  overflow-y: scroll;
  height: 100vh;
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

.container, .container-fluid, .container-lg, .container-md, .container-sm, .container-xl, .container-xxl {
  padding:0px;
}


.floating-help-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #007bff;
  color: white;
  padding: 12px 20px;
  border-radius: 25px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  font-weight: bold;
  z-index: 1100;
  transition: background-color 0.3s;
}
.floating-help-button:hover {
  background-color: #0056b3;
}

/* Contact Details Box */
.contact-details {
  position: fixed;
  bottom: 80px;
  right: 20px;
  background-color: #fff;
  color: #333;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 1100;
  width: 250px;
  font-size: 14px;
}

/* Close Button inside Contact Box */
.close-btn {
  background-color: red;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  float: right;
}

</style>
