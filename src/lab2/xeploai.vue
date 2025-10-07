<script setup>
import { ref } from "vue";

const dtb = ref("")
const xeploai = ref("")

const handleXepLoai = () => {
  const diem = parseFloat(dtb.value)
  if (isNaN(diem) || diem < 0 || diem > 10) {
    xeploai.value = "Điểm không hợp lệ (0 - 10)"
  } else if (diem < 5) {
    xeploai.value = "Yếu"
  } else if (diem < 6.5) {
    xeploai.value = "Trung Bình"
  } else if (diem < 8) {
    xeploai.value = "Khá"
  } else if (diem < 9) {
    xeploai.value = "Giỏi"
  } else {
    xeploai.value = "Xuất Sắc"
  }
}
</script>

<template>
  <div>
    <h1>Xếp loại học lực</h1>
    <input min="1" type="number" v-model="dtb" placeholder="Nhập điểm (0-10)">
    <br>
    <input type="button" @click="handleXepLoai" value="Xếp loại">
    <p>Kết quả: {{ xeploai }}</p>
  </div>
</template>
