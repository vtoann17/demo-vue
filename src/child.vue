<script setup>
const props = defineProps({
    user: {
        type: Array,
        required: true
    }
})
</script>
<template>
<div>
    <div v-for="user in props.user" :key="user.id">
        <slot :user="user"></slot>
    </div>
</div>
</template>