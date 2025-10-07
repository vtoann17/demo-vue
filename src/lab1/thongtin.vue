<script setup>
import { reactive, ref } from "vue";

const props = defineProps({
  thongTin: Object
});

const cv = reactive(JSON.parse(JSON.stringify(props.thongTin)));


const suaTen = ref(false);
const suaViTri = ref(false);
const suaSoDienThoai = ref(false);
const suaEmail = ref(false);
const suaDiaChi = ref(false);
</script>

<template>
  <div class="cv-container">
    <aside class="cv-sidebar">
      <div class="cv-photo">
        <img :src="cv.thongtin.anh" alt="Ảnh đại diện" />
      </div>
      <div>
        <template v-if="suaTen">
          <input v-model="cv.thongtin.ten" />
          <button @click="suaTen = false">Lưu</button>
        </template>
        <template v-else>
          <h2 @click="suaTen = true">{{ cv.thongtin.ten }}</h2>
        </template>
      </div>
      <div>
        <template v-if="suaViTri">
          <input v-model="cv.thongtin.vitri" />
          <button @click="suaViTri = false">Lưu</button>
        </template>
        <template v-else>
          <p class="job-title" @click="suaViTri = true">{{ cv.thongtin.vitri }}</p>
        </template>
      </div>
      <h3>Thông tin liên hệ</h3>
      <div>
        <template v-if="suaSoDienThoai">
          <input v-model="cv.thongtin.sdt" />
          <button @click="suaSoDienThoai = false">Lưu</button>
        </template>
        <template v-else>
          <p @click="suaSoDienThoai = true"><i class="fa-solid fa-phone"></i> {{ cv.thongtin.sdt }}</p>
        </template>
      </div>
      <div>
        <template v-if="suaEmail">
          <input v-model="cv.thongtin.email" />
          <button @click="suaEmail = false">Lưu</button>
        </template>
        <template v-else>
          <p @click="suaEmail = true"><i class="fa-solid fa-envelope"></i> {{ cv.thongtin.email }}</p>
        </template>
      </div>
      <div>
        <template v-if="suaDiaChi">
          <input v-model="cv.thongtin.diachi" />
          <button @click="suaDiaChi = false">Lưu</button>
        </template>
        <template v-else>
          <p @click="suaDiaChi = true"><i class="fa-solid fa-location-dot"></i> {{ cv.thongtin.diachi }}</p>
        </template>
      </div>
      <h3>Kỹ năng</h3>
      <ul>
        <li v-for="kn in cv.kynang" :key="i"><i class="fa-solid fa-check"></i> {{ kn }}</li>
      </ul>
      <h3>Chứng chỉ</h3>
      <ul>
        <li v-for="cchi in cv.chungchi" :key="i"><i class="fa-solid fa-certificate"></i> {{ cchi }}</li>
      </ul>
      <h3>Giải thưởng</h3>
      <ul>
        <li v-for="gt in cv.giaithuong" :key="i"><i class="fa-solid fa-trophy"></i> {{ gt }}</li>
      </ul>
    </aside>
    <main class="cv-main">
      <section>
        <h3>Mục tiêu nghề nghiệp</h3>
        <p>{{ cv.muctieu }}</p>
      </section>

      <section>
        <h3>Học vấn</h3>
        <p>{{ cv.hocvan }}</p>
      </section>

      <section>
  <h3>Kinh nghiệm làm việc</h3>
  <div v-for="knghiem in cv.kinhnghiem" :key="i" class="mb-4">
    <p>
      <strong>{{ knghiem.thoigian }}</strong> | 
      <span>{{ knghiem.congty }}</span> – 
      <em>{{ knghiem.vitri }}</em>
    </p>
    <ul>
      <li v-for="mt in knghiem.mota" :key="j">
        <i>{{ mt }}</i>
      </li>
    </ul>
  </div>
</section>

    </main>
  </div>
</template>

<style scoped>
.cv-container {
  display: flex;
  max-width: 1000px;
  margin: 20px auto;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.cv-sidebar {
  width: 30%;
  background: linear-gradient(135deg, #2d3e50, #4b6cb7);
  color: white;
  padding: 25px;
}

.cv-photo {
  text-align: center;
  margin-bottom: 20px;
}

.cv-photo img {
  border-radius: 50%;
  width: 140px;
  height: 140px;
  border: 4px solid #fff;
  object-fit: cover;
}

.cv-sidebar h2 {
  text-align: center;
  margin: 15px 0;
  font-size: 22px;
}

.cv-sidebar .job-title {
  text-align: center;
  font-style: italic;
  margin-bottom: 20px;
  font-size: 15px;
}

.cv-sidebar h3 {
  margin-top: 25px;
  font-size: 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.4);
  padding-bottom: 6px;
}

.cv-sidebar p,
.cv-sidebar li {
  margin: 8px 0;
  font-size: 14px;
  cursor: pointer;
}

.cv-sidebar p:hover {
  color: #ffda79;
}

.cv-sidebar ul {
  padding-left: 10px;
  list-style: none;
}

.cv-sidebar i {
  margin-right: 8px;
  color: #ffda79;
}

.cv-main {
  width: 70%;
  padding: 30px;
}

.cv-main section {
  margin-bottom: 30px;
}

.cv-main h3 {
  margin-bottom: 10px;
  font-size: 20px;
  color: #2d3e50;
  border-left: 4px solid #4b6cb7;
  padding-left: 8px;
}

.cv-main ul {
  list-style: none;
  padding-left: 0;
  margin: 0;
}
</style>
