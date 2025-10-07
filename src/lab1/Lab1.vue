<script setup>
import { reactive } from "vue";
import thongTin   from "./thongtin.vue";
const cv = reactive({
  thongtin: {
    ten: "Hoàng Văn Toàn",
    vitri: "Thiết kế trang web",
    sdt: "0383983952",
    email: "toanhvpk04080@gmail.com",
    diachi: "Dak Lak",
anh: "https://reviewcongnghe.net/wp-content/uploads/2024/04/hinh-nen-may-tinh-dep-thumb.jpg"
  },
  kynang: [
    "HTML, CSS, JavaScript cơ bản",
    "Thiết kế responsive website",
    "Khả năng học hỏi nhanh",
    "Kỹ năng làm việc nhóm"
  ],
  chungchi: [
    "Chưa có chứng chỉ"
  ],
  giaithuong: [
    "Chưa có giải thưởng"
  ],
  muctieu: "Với niềm đam mê trong lĩnh vực thiết kế và phát triển website, tôi mong muốn trở thành một nhà thiết kế web chuyên nghiệp, có khả năng kết hợp sáng tạo mỹ thuật với kiến thức công nghệ để mang đến những sản phẩm trực quan, dễ sử dụng và tối ưu trải nghiệm người dùng. Tôi hướng đến việc không ngừng học hỏi các xu hướng thiết kế hiện đại, thành thạo công cụ và công nghệ mới, nhằm tạo ra các giao diện website vừa thẩm mỹ vừa thân thiện, đồng thời hỗ trợ doanh nghiệp xây dựng thương hiệu trực tuyến hiệu quả và bền vững.",
  hocvan: "2024: Cao Đẳng FPT Tây Nguyên",
  kinhnghiem: [
    {
      thoigian: "2021 – 2024",
      congty: "SVT Investment & Development Co., Ltd",
      vitri: "Front-End Developer",
      mota: [
        "Quản lý các dự án phát triển trang web từ khâu lên kế hoạch đến hoàn thiện.",
        "Tham gia đánh giá và thử nghiệm các tính năng mới để đảm bảo website hoạt động ổn định.",
        "Phát triển và tùy chỉnh các dự án web trên WordPress, PHP-Fusion và Concrete5.",
        "Làm việc trực tiếp với khách hàng để đáp ứng nhu cầu thực tế.",
        "Tích hợp quảng cáo trên web bằng cách lập trình canvas HTML5 để hoạt động ổn định trên nền web.",
        "Nghiên cứu, phát triển công nghệ mới nhằm nâng cao chất lượng sản phẩm."
      ]
    },
    {
      thoigian: "2019 – 2021",
      congty: "MW Trading Joint Stock Company",
      vitri: "Flutter Developer",
      mota: [
        "Phát triển ứng dụng di động bằng Flutter cho iOS và Android.",
        "Kết nối ứng dụng với Firebase để xử lý dữ liệu và xác thực người dùng.",
        "Tối ưu hiệu năng và trải nghiệm người dùng trên mobile app.",
        "Xây dựng Product Team để định hướng và triển khai sản phẩm."
      ]
    },
    {
      thoigian: "2017 – 2019",
      congty: "KMO & Partners",
      vitri: "Web Developer",
      mota: [
        "Thiết kế và phát triển giao diện web theo yêu cầu khách hàng.",
        "Xây dựng và tối ưu website sử dụng HTML, CSS và JavaScript.",
        "Đảm bảo website hiển thị tốt trên nhiều thiết bị và trình duyệt.",
        "Tích hợp các trang web với Facebook, Twitter và YouTube."
      ]
    }
  ]
})
</script>

<template>
    <thongTin :thongTin="cv"/>
</template>

<style scoped>
</style>
