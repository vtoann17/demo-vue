<script setup>
import Child from './child.vue'

const users = [
  { id: 1, name: 'An',   score: 9.2 },
  { id: 2, name: 'Bình', score: 8.5 },
  { id: 3, name: 'Chi',  score: 9.0 },
]
</script>
<template>
    <div>
        <h2>Danh sách học sinh</h2>
        <Child :user="users">
            <template #default="{ user }">
        <p>{{ user.id }} - {{ user.name }} - Điểm: {{ user.score }}</p>
      </template>
        </Child>
    </div>
</template>