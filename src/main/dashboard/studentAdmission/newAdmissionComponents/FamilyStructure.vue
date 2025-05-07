<template>
  <div>
    <p class="ml-4 mt-4 mb-10">FAMILY STRUCTURE</p>

    <form @submit.prevent="nextStep">
      <div class="row mx-auto">
        <div class="col-12">

          <!-- Step 1: Father Info -->
          <div v-if="step === 1">
            <p><strong>Father</strong></p>
            <hr />
            <div class="row mx-auto">
              <div class="col-6">
                <div class="mb-2">
                  <label class="text-sm">Surname Name *</label>
                  <input type="text" v-model="form.surname" required class="form-control form-control-sm">
                </div>
                <div class="mb-2">
                  <label class="text-sm">Other Names *</label>
                  <input type="text" v-model="form.other_name" required class="form-control form-control-sm">
                </div>
                <div class="mb-2">
                  <label class="text-sm">Is Living *</label>
                  <select class="form-select form-control-sm" v-model="form.parent_living" required>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
                <div class="mb-2">
                  <label class="text-sm">Place of Employment *</label>
                  <input type="text" v-model="form.place_of_employment" required class="form-control form-control-sm">
                </div>
              </div>

              <div class="col-6">
                <div class="mb-2">
                  <label class="text-sm">Physical Contact Address *</label>
                  <input type="text" v-model="form.physical_contact_address" required class="form-control form-control-sm">
                </div>
                <div class="mb-2">
                  <label class="text-sm">Contact Details</label>
                  <table>
                    <tr v-for="(lst, index) in phoneList" :key="index">
                      <td><input type="text" v-model="lst.phone_number" required class="form-control form-control-sm" placeholder="Phone number"></td>
                      <td><input type="email" v-model="lst.email" required class="form-control form-control-sm" placeholder="Email"></td>
                      <td>
                        <button class="btn-sm" @click.prevent="removePhone(index)">🗑</button>
                      </td>
                    </tr>
                  </table>
                  <button class="btn btn-primary btn-sm mt-2" @click.prevent="addPhone">+ Add Contacts</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 2: Mother Info -->
          <div v-if="step === 2">
            <p><strong>Mother</strong></p>
            <hr />
            <div class="row mx-auto">
              <div class="col-6">
                <div class="mb-2">
                  <label class="text-sm">Family Name *</label>
                  <input type="text" v-model="form.family_name_of_mother" required class="form-control form-control-sm">
                </div>
                <div class="mb-2">
                  <label class="text-sm">Other Names *</label>
                  <input type="text" v-model="form.mothers_other_names" required class="form-control form-control-sm">
                </div>
                <div class="mb-2">
                  <label class="text-sm">Is Living *</label>
                  <select class="form-select form-control-sm" v-model="form.mother_living" required>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
                <div class="mb-2">
                  <label class="text-sm">Place of Employment *</label>
                  <input type="text" v-model="form.mothers_place_of_employment" required class="form-control form-control-sm">
                </div>
              </div>

              <div class="col-6">
                <div class="mb-2">
                  <label class="text-sm">Mother Contact Info</label>
                  <table>
                    <tr v-for="(lst, index) in phoneMotherList" :key="index">
                      <td><input type="text" v-model="lst.mothers_phone" required class="form-control form-control-sm" placeholder="Phone"></td>
                      <td><button class="btn-sm" @click.prevent="removeMotherPhone(index)">🗑</button></td>
                    </tr>
                  </table>
                  <button class="btn btn-primary btn-sm mt-2" @click.prevent="addMotherPhone">+ Add Phone</button>

                  <table class="mt-2">
                    <tr v-for="(lst, index) in emailMotherList" :key="index">
                      <td><input type="email" v-model="lst.mothers_email" required class="form-control form-control-sm" placeholder="Email"></td>
                      <td><button class="btn-sm" @click.prevent="removeMotherEmail(index)">🗑</button></td>
                    </tr>
                  </table>
                  <button class="btn btn-primary btn-sm mt-2" @click.prevent="addMotherEmail">+ Add Email</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 3: Guardian Info -->
          <div v-if="step === 3">
            <p><strong>Guardian</strong></p>
            <hr />
            <div class="row mx-auto">
              <div class="col-6">
                <div class="mb-2">
                  <label class="text-sm">First Name *</label>
                  <input type="text" v-model="form.guardian_name" class="form-control form-control-sm" required />
                </div>
                <div class="mb-2">
                  <label class="text-sm">Other Names *</label>
                  <input type="text" v-model="form.guardian_other_names" required class="form-control form-control-sm">
                </div>
                <div class="mb-2">
                  <label class="text-sm">Relationship to Child *</label>
                  <input type="text" v-model="form.guardian_relationship" class="form-control form-control-sm" required />
                </div>
                <div class="mb-2">
                  <label class="text-sm">Place of Employment</label>
                  <input type="text" v-model="form.guardian_employment" class="form-control form-control-sm" />
                </div>
              </div>

              <div class="col-6">
                <div class="mb-2">
                  <label class="text-sm">Guadian Contact Info</label>
                  <table>
                    <tr v-for="(lst, index) in phoneMotherList" :key="index">
                      <td><input type="text" v-model="lst.mothers_phone" required class="form-control form-control-sm" placeholder="Phone"></td>
                      <td><button class="btn-sm" @click.prevent="removeMotherPhone(index)">🗑</button></td>
                    </tr>
                  </table>
                  <button class="btn btn-primary btn-sm mt-2" @click.prevent="addMotherPhone">+ Add Phone</button>

                  <table class="mt-2">
                    <tr v-for="(lst, index) in emailMotherList" :key="index">
                      <td><input type="email" v-model="lst.mothers_email" required class="form-control form-control-sm" placeholder="Email"></td>
                      <td><button class="btn-sm" @click.prevent="removeMotherEmail(index)">🗑</button></td>
                    </tr>
                  </table>
                  <button class="btn btn-primary btn-sm mt-2" @click.prevent="addMotherEmail">+ Add Email</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 4: Languages -->
          <div v-if="step === 4">
            <label class="text-sm">Languages</label>
            <table>
              <tr v-for="(lst, index) in LanguagesList" :key="index">
                <td><input type="text" v-model="lst.languages" required class="form-control" placeholder="Language"></td>
                <td><button class="btn-sm" @click.prevent="removeLanguage(index)">🗑</button></td>
              </tr>
            </table>
            <button class="btn btn-primary btn-sm mt-2" @click.prevent="addLanguage">+ Add Language</button>
          </div>

        </div>
      </div>

      <hr />
      <div class="flex justify-between mt-4">
        <button v-if="step > 1" type="button" @click="prevStep" class="btn btn-outline-secondary">Back</button>
        <button type="submit" class="btn btn-primary">
          {{ step === totalSteps ? 'Submit' : 'Next' }}
          <span v-if="buttonLoader" class="spinner-border spinner-border-sm"></span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const buttonLoader = ref(false)
const step = ref(1)
const totalSteps = 4

const form = ref({
  surname: null,
  other_name: null,
  parent_living: null,
  place_of_employment: null,
  physical_contact_address: null,
  family_name_of_mother: null,
  mothers_place_of_employment: null,
  mother_living: null,
  mothers_other_names: null,

  // Guardian
  guardian_name: null,
  guardian_relationship: null,
  guardian_employment: null,
  guardian_contact: null
})

// Dynamic fields
const phoneList = ref([{ phone_number: "", email: "" }])
const phoneMotherList = ref([{ mothers_phone: "" }])
const emailMotherList = ref([{ mothers_email: "" }])
const LanguagesList = ref([{ languages: "" }])

const nextStep = () => {
  if (step.value < totalSteps) {
    step.value++
  } else {
    submitForm()
  }
}
const prevStep = () => step.value--

const addPhone = () => phoneList.value.push({ phone_number: "", email: "" })
const removePhone = (index) => phoneList.value.splice(index, 1)
const addMotherPhone = () => phoneMotherList.value.push({ mothers_phone: "" })
const removeMotherPhone = (index) => phoneMotherList.value.splice(index, 1)
const addMotherEmail = () => emailMotherList.value.push({ mothers_email: "" })
const removeMotherEmail = (index) => emailMotherList.value.splice(index, 1)
const addLanguage = () => LanguagesList.value.push({ languages: "" })
const removeLanguage = (index) => LanguagesList.value.splice(index, 1)

const submitForm = () => {
  buttonLoader.value = true

  const studentNumber = "STU12345"

  const fatherContacts = []
  phoneList.value.forEach(p => {
    if (p.phone_number) fatherContacts.push(p.phone_number)
    if (p.email) fatherContacts.push(p.email)
  })

  const motherContacts = []
  phoneMotherList.value.forEach(p => {
    if (p.mothers_phone) motherContacts.push(p.mothers_phone)
  })
  emailMotherList.value.forEach(p => {
    if (p.mothers_email) motherContacts.push(p.mothers_email)
  })

  const langs = LanguagesList.value.map(l => l.languages)

  const familyMembers = []

  if (form.value.surname || form.value.other_name) {
    familyMembers.push({
      number: "F001",
      type: "FATHER",
      student_number: studentNumber,
      surname: form.value.surname,
      other_name: form.value.other_name,
      place_of_employment: form.value.place_of_employment,
      physical_contact_address: form.value.physical_contact_address,
      contacts: fatherContacts
    })
  }

  if (form.value.family_name_of_mother || form.value.mothers_other_names) {
    familyMembers.push({
      number: "M001",
      type: "MOTHER",
      student_number: studentNumber,
      surname: form.value.family_name_of_mother,
      other_name: form.value.mothers_other_names,
      place_of_employment: form.value.mothers_place_of_employment,
      physical_contact_address: form.value.physical_contact_address,
      contacts: motherContacts
    })
  }

  if (form.value.guardian_name) {
    familyMembers.push({
      number: "G001",
      type: "GUARDIAN",
      student_number: studentNumber,
      full_name: form.value.guardian_name,
      relationship: form.value.guardian_relationship,
      place_of_employment: form.value.guardian_employment,
      contacts: [form.value.guardian_contact]
    })
  }

  const finalData = {
    student_number: studentNumber,
    family_members: familyMembers,
    languages: langs
  }

  alert("Final Submission:\n" + JSON.stringify(finalData, null, 2))
  buttonLoader.value = false
}
</script>

<style scoped>
button.btn-sm {
  background-color: transparent;
  border: none;
  color: red;
}
</style>
