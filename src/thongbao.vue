
<script setup>
defineProps({
    message: String
})
</script>

<template>
    <div class="message">
  <span>{{ message }}</span>
  </div>
</template>
<style scoped 
>
span{
  color: red;
}

</style>


