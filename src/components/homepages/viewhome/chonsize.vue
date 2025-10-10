<template>
  <div class="szchart">
    <div class="container">
      <div class="szchart-wp">
        <h2 class="szchart-heading">Hướng dẫn chọn size</h2>
        <p class="szchart-content">
          Nếu bạn băn khoăn không biết chọn size nào cho phù hợp với cân nặng và chiều cao của mình, đừng lo lắng! 
          Hãy xem bảng hướng dẫn chọn size bên dưới mà SHOE TCS tư vấn riêng dành cho bạn.
        </p>
        <img src="/src/assets/img/chart3.jpg" alt="Size chart giày" />
        <p class="szchart-content">
          Bảng hướng dẫn chọn size trên là bảng hướng dẫn dựa trên kinh nghiệm nhiều năm của SHOE TCS theo khảo sát nhu cầu sở thích của khách hàng. 
          Tất nhiên sẽ không tuyệt đối, sẽ có những trường hợp ngoại lệ phụ thuộc theo vóc dáng, sở thích của từng người. 
          Ví dụ có người thích mặc ôm, có người thích mặc rộng... Nếu bạn vẫn còn có những mắc thắc và băn khoăn cần được giải đáp? 
          Hãy liên hệ ngay với Bộ phận Chăm sóc khách hàng của SHOE TCS qua Hotline (08) 444 444 44 để được hỗ trợ thêm.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SizeChart",
};
</script>

<style scoped>
.szchart {
  padding: 20px;
  background-color: #fbe9e9;
}
.szchart-heading {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}
.szchart-content {
  font-size: 16px;
  line-height: 1.5;
  color: #333;
}
img {
  width: 100%;
  max-width: 500px;
  display: block;
  margin: 20px auto;
}
</style>
