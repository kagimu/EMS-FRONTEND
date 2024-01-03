

<template>
<div>
    <form @submit.prevent="addSos">
    <input type="text" >
    <button type="submit"></button>
    </form>

</div>
</template>


<script setup>
import {reactive, ref} from "vue";

const form = reactive({
    name:null
})

const addSos = () => {
    console.log("hello")
}


</script>

<style scoped>

</style>