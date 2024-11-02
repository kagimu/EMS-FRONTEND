<script setup>
import { reactive } from "vue";

const contactInfoForm = reactive({
  name: "John Doe",
  email: "johndoe@example.com",
  phone: "+1 234 567 890",
  address: "123 Main Street, Cityville",
  facebook: "https://facebook.com/johndoe",
  twitter: "https://twitter.com/johndoe",
  linkedin: "https://linkedin.com/in/johndoe",
  instagram: "https://instagram.com/johndoe",
});
</script>

<template>
  <div id="app">
    <div class="text-[#8a8888] mt-1 border-b">
      <div class="py-1 ml-3">
        Contact Info
      </div>
    </div>

    <div class=" mt-1 px-1 ">
      
      <button style="float: right;font-size: 11px;"type="submit" class="btn btn-primary btn-sm mb-2 mr-4">
          <i class="bi bi-save2"></i>  UPDATE
          </button>

        <form class="p-4 bg-white rounded-lg shadow-md  ">
          <div class="row">
            <div class="col-lg-6">
          <h3 class="text-sm font-semibold mb-4 ">Contact Information</h3>
          <div class="mb-3">
            <label for="email" class="block text-gray-700 text-sm">Email</label>
            <input type="email" id="email" v-model="contactInfoForm.email"
                   class="form-input mt-1 block w-full border-gray-300 rounded-md" />
          </div>

          <div class="mb-3">
            <label for="phone" class="block text-gray-700 text-sm">Phone</label>
            <input type="text" id="phone" v-model="contactInfoForm.phone"
                   class="form-input mt-1 block w-full border-gray-300 rounded-md" />
          </div>

          <div class="mb-3">
            <label for="phone" class="block text-gray-700 text-sm">Whatsapp</label>
            <input type="text" id="phone" v-model="contactInfoForm.phone"
                   class="form-input mt-1 block w-full border-gray-300 rounded-md" />
          </div>

          <div class="mb-3">
            <label for="address" class="block text-gray-700 text-sm">Address</label>
            <input type="text" id="address" v-model="contactInfoForm.address"
                   class="form-input mt-1 block w-full border-gray-300 rounded-md" />
          </div>
        </div>

<div class="col-lg-6">
          <h3 class="text-sm font-semibold mt-6 mb-4">Social Media Links</h3>
          
          <div class="mb-3">
            <label for="facebook" class="block text-gray-700 text-sm">Facebook</label>
            <input type="url" id="facebook" v-model="contactInfoForm.facebook"
                   class="form-input mt-1 block w-full border-gray-300 rounded-md" />
          </div>

          <div class="mb-3">
            <label for="twitter" class="block text-gray-700 text-sm">Twitter</label>
            <input type="url" id="twitter" v-model="contactInfoForm.twitter"
                   class="form-input mt-1 block w-full border-gray-300 rounded-md" />
          </div>

          <div class="mb-3">
            <label for="linkedin" class="block text-gray-700 text-sm">LinkedIn</label>
            <input type="url" id="linkedin" v-model="contactInfoForm.linkedin"
                   class="form-input mt-1 block w-full border-gray-300 rounded-md" />
          </div>

          <div class="mb-3">
            <label for="instagram" class="block text-gray-700 text-sm">Instagram</label>
            <input type="url" id="instagram" v-model="contactInfoForm.instagram"
                   class="form-input mt-1 block w-full border-gray-300 rounded-md" />
          </div>

        </div>

</div>
        </form>
      </div>
    </div>
</template>

<style scoped>
.form-input {
  padding: 8px;
  border: 1px solid #d1d5db;
  outline: none;
  transition: border-color 0.2s;
}

.form-input:focus {
  border-color: #2563eb;
}

button {
  font-size: 14px;
  font-weight: bold;
  transition: background-color 0.3s ease;
}
</style>
