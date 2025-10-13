<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const demo = computed(() => store.state.count)
console.log('demo', store)

const handleClickIncrease = () => {
    store.commit('increment')
    console.log('Tăng:', store.state.count)
}

const handleClickDecrease = () => {
    store.commit('decrement')
    console.log('Giảm:', store.state.count)
}
</script>

<template>
    <div class="p-4">
        <h1>Demo Vuex</h1>
        <p>Giá trị hiện tại: {{ demo }}</p>

        <button class="btn btn-primary me-2" @click="handleClickIncrease">
            + Tăng
        </button>

        <button class="btn btn-danger" @click="handleClickDecrease">
            - Giảm
        </button>
    </div>
</template>

<style scoped>
button {
    margin-top: 10px;
}
</style>