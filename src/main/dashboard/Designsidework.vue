<template>
  <section class="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow space-y-8">
    <!-- Student Info -->
    <div>
      <h2 class="text-2xl font-semibold text-gray-800 mb-1">Student Profile</h2>
      <p class="text-sm text-gray-600">
        <span class="font-medium">Student Number:</span> {{ student.student_number }}
      </p>
    </div>

    <!-- Family Members -->
    <div>
      <h3 class="text-xl font-semibold text-gray-800 mb-4">Family Members</h3>
      <div v-for="member in student.family_members" :key="member.number" class="bg-gray-50 border rounded-xl p-4 mb-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div v-for="(label, key) in familyFields" :key="key">
            <span class="font-medium">{{ label }}:</span>
            {{ member[key] || 'N/A' }}
          </div>
        </div>
      </div>
    </div>

    <!-- Languages -->
    <div>
      <h3 class="text-xl font-semibold text-gray-800 mb-4">Languages</h3>
      <ul class="list-disc pl-5 text-sm text-gray-700 space-y-1">
        <li v-for="(lang, index) in student.languages" :key="index">
          <span class="font-medium">Code:</span> {{ lang.Code }} —
          <span class="font-medium">Name:</span> {{ lang.Name || 'N/A' }}
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
const student = {
  student_number: "2bced8f4-b26e-4a16-805d-12e10927cdf7",
  family_members: [
    {
      number: "79175128-f525-444d-9e48-cd3320997499",
      surname: "Aliqua Eos aut veri",
      other_name: "Commodi odio cillum ",
      place_of_employment: "Amet iure quia accu",
      physical_contact_address: "",
      contacts: null,
      relationship: "GUARDIAN",
    },
    {
      number: "7c8740ff-21d6-4ff7-8aac-f52f25c71fa3",
      surname: "Quisquam consequatur",
      other_name: "In quas quo temporib",
      place_of_employment: "Voluptate minima sim",
      physical_contact_address: "",
      contacts: null,
      relationship: "FATHER",
    },
    {
      number: "ca7200e9-4480-4e24-9f92-886758c5a520",
      surname: "Repellendus Sint m",
      other_name: "Dolor voluptas aut i",
      place_of_employment: "Ut totam laudantium",
      physical_contact_address: "",
      contacts: null,
      relationship: "MOTHER",
    },
  ],
  languages: [
    { Name: "", Code: 8 },
    { Name: "", Code: 42 },
  ],
};

// Label map for clean looping
const familyFields = {
  relationship: "Relationship",
  surname: "Surname",
  other_name: "Other Name",
  place_of_employment: "Place of Employment",
  physical_contact_address: "Address",
  contacts: "Contacts",
};
</script>
