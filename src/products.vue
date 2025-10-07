<script setup>
import { ref } from "vue";
const { products } = defineProps({
    products: Array
})
const search = ref("")
const isSuccess = ref("true")
</script>

<template>
    <h1>Danh sách sản phẩm</h1>
    <span :style="{color: isSuccess ? 'green' : 'red', fontWeight: 'bold' } ">{{ search }}</span>
    <div :class="{success: isSuccess , error: !isSuccess}">Đây là message</div>
    <input type="text" class="search-input" v-model="search" placeholder="search product.....">
    <div class="row">

        <div class="col col-md-3" v-for="product in products" :key="product.id">
            <img :src="product.image" />
            <h3>{{ product.name }}</h3>
            <p>{{ product.price }}</p>
            <p>{{ product.category }}</p>
        </div>
    </div>
</template>

<style scoped>
.row {
    display: grid;
    gap: 15px;
}

.col {
    border: 1px solid #ccc;
    padding: 10px;
    text-align: center;
}
</style>
