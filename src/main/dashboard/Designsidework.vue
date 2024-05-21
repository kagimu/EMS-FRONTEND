<template>
  <div>
    <table class="table">
      <thead>
        <tr>
          <th scope="col"></th>
          <th scope="col" v-for="header in headers" :key="header">{{ header }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="group in feedingGroups" :key="group.group_name">
          <th scope="row">{{ group.group_name }}</th>
          <td v-for="header in headers.slice(1)" :key="header">
            <div v-if="getMealCourses(group, header)">
              <div v-for="meal in getMealCourses(group, header)" :key="meal">{{ meal }}</div>
            </div>
            <div v-else>{{ getError(group, header) }}</div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const data = {
  headers: [" ", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  feeding_group: [
    {
      group_name: "Group 1",
      meal_courses: [
        { day: "Mon", meal_courses: ["Dinner", "Break"], error: "No meal course(s) set" },
        { day: "Tue", meal_courses: ["Dinner", "Break"], error: "No meal course(s) set" },
        { day: "Wed", meal_courses: null, error: "No meal course(s) set" },
        { day: "Thu", meal_courses: ["Break", "Dinner"], error: "No meal course(s) set" },
        { day: "Fri", meal_courses: null, error: "No meal course(s) set" },
        { day: "Sat", meal_courses: null, error: "No meal course(s) set" },
        { day: "Sun", meal_courses: ["Break", "Dinner"], error: "No meal course(s) set" }
      ]
    },
    {
      group_name: "Group 2",
      meal_courses: [
        { day: "Mon", meal_courses: null, error: "No meal course(s) set" },
        { day: "Tue", meal_courses: null, error: "No meal course(s) set" },
        { day: "Wed", meal_courses: ["Break", "Dinner"], error: "No meal course(s) set" },
        { day: "Thu", meal_courses: null, error: "No meal course(s) set" },
        { day: "Fri", meal_courses: null, error: "No meal course(s) set" },
        { day: "Sat", meal_courses: null, error: "No meal course(s) set" },
        { day: "Sun", meal_courses: null, error: "No meal course(s) set" }
      ]
    }
  ]
};

const headers = ref(data.headers);
const feedingGroups = ref(data.feeding_group);

const getMealCourses = (group, day) => {
  const mealCourse = group.meal_courses.find(meal => meal.day === day);
  return mealCourse ? mealCourse.meal_courses : null;
};

const getError = (group, day) => {
  const mealCourse = group.meal_courses.find(meal => meal.day === day);
  return mealCourse ? mealCourse.error : "";
};
</script>

<style scoped>
.table {
  width: 100%;
  margin: 20px 0;
  border-collapse: collapse;
}
.table th, .table td {
  border: 1px solid #ddd;
  padding: 8px;
}
.table th {
  background-color: #f2f2f2;
  text-align: center;
}
</style>
