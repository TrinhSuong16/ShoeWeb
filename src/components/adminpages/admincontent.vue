<template>
    <div class="dashboard">
        <div class="dashboard-header">
            <h3>TRANG TỔNG QUAN CỦA SHOE TCS</h3>
        </div>
        <div class="dashboard-content">
            <div class="card-container">
                <div class="dashboard-card customer">
                     <h3 class="card-title">{{ totalCustomer }}</h3>
                    <div class="card-image">
                        <img src="/src/assets/img/admin/s1.png" alt="Khách hàng" />
                    </div>
                    <h3 class="card-label">Khách hàng</h3>
                    <p class="card-description">
                        Khách hàng mục tiêu là một nhóm đối tượng khách hàng trong phân khúc thị trường mục tiêu mà doanh nghiệp bạn đang hướng tới.
                    </p>
                </div>

                <div class="dashboard-card product">
                     <h3 class="card-title">{{ totalProducts }}</h3>
                    <div class="card-image">
                        <img src="/src/assets/img/admin/s2.png" alt="Sản phẩm" />
                    </div>
                    <h3 class="card-label">Sản phẩm</h3>
                    <p class="card-description">
                        Sản phẩm là bất cứ cái gì có thể đưa vào thị trường để tạo sự chú ý, mua sắm, sử dụng hay tiêu dùng nhằm thỏa mãn một nhu cầu hay ước muốn.
                    </p>
                </div>

                <div class="dashboard-card revenue">
                    <h3 class="card-title">{{ formattedRevenue }}</h3>
                    <div class="card-image">
                        <img src="/src/assets/img/admin/s3.png" alt="Doanh thu" />
                    </div>
                    <h3 class="card-label">Doanh thu</h3>
                    <p class="card-description">
                        Doanh thu của doanh nghiệp là toàn bộ số tiền sẽ thu được do tiêu thụ sản phẩm, cung cấp dịch vụ với sản lượng.
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import axios from "axios"; // Nếu dùng axios

export default {
  data() {
    return {
        totalRevenue: 0,
      totalProducts: 0,
      totalCustomer:0,
    };
  },
  
  mounted() {
    this.fetchTotalProducts();
    this.fetchTotalCustomer();
    this.fetchTotalRevenue();
  },
  computed: {
    formattedRevenue() {
      return this.totalRevenue.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
    }
  },
  methods: {
    async fetchTotalProducts() {
      try {
        const response = await axios.get("http://localhost:5000/api/total_products");
        this.totalProducts = response.data.total; // Cập nhật số lượng sản phẩm
      } catch (error) {
        console.error("Lỗi lấy tổng sản phẩm:", error);
      }
    },
    async fetchTotalCustomer() {
      try {
        const response = await axios.get("http://localhost:5000/api/customer");
        this.totalCustomer = response.data.total; 
      } catch (error) {
        console.error("Lỗi lấy tổng khách hàng:", error);
      }
    },
    async fetchTotalRevenue() {
      try {
        const response = await axios.get("http://localhost:5000/api/total_revenue");
        this.totalRevenue = response.data.totalRevenue || 0;
      } catch (error) {
        console.error("Lỗi khi lấy doanh thu:", error);
      }
    },
  },
};
</script>
<style scoped>
.dashboard {
    width: 75%;
    padding: 20px;
    padding: 20px;
  background: #eedcdc;
  display: flex;
  flex-direction: column;
  margin-left: 260px; 
}

.dashboard-header {
    padding: 20px;
    background: #b22222;
    text-align: center;
    color: white;
    font-size: 20px;
    font-weight: bold;

}

.dashboard-content {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

.card-container {
    display: flex;
    justify-content: space-around;
    gap: 20px;
    flex-wrap: wrap;
    width: 100%;
}

.dashboard-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;
    width: 320px;
    text-align: center;
    transition: transform 0.3s ease-in-out;
}

.dashboard-card:hover {
    transform: scale(1.05);
}

.card-title {
    font-size: 24px;
    font-weight: bold;
}

.card-image img {
    width: 100px;
    height: auto;
    margin: 15px 0;
}

.card-label {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 5px;
}

.card-description {
    font-size: 14px;
    color: #666;
}

/* Màu sắc cho từng mục */
.customer .card-title {
    color: #ff5733;
}

.product .card-title {
    color: #ffbf00;
}

.revenue .card-title {
    color: #4caf50;
}
</style>
