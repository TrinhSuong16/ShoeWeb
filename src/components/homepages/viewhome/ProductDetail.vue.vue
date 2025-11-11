<template>
  <div class="detail-page">

    <div class="detail-card">
      <!-- Cột 1: Ảnh sản phẩm -->
      <div class="detail-left">
        <img :src="product.SP_hinh_anh" :alt="product.SP_ten" class="detail-img" />
      </div>

      <!-- Cột 2: Thông tin sản phẩm -->
      <div class="detail-right">
        <h1 class="detail-title">{{ product.SP_ten }}</h1>

        <!-- Giá và Tình trạng -->
        <div class="price-status-group">
          <p class="detail-price">
            Giá: <span>{{ product.SP_price?.toLocaleString() }} đ</span>
          </p>
          <p class="status"><strong>Tình trạng:</strong> Còn hàng</p>
        </div>

        <p class="description">
          <strong>Mô tả sản phẩm:</strong> Là sản phẩm thời trang, trẻ trung, năng động phù hợp với giới trẻ hiện nay.
        </p>
        
        <hr class="divider"/>

        <!-- Size và Số lượng -->
        <div class="selection-group">
          <div class="size-info">
            <p><strong>Size:</strong> <span class="size-value">{{ product.SP_size }}</span></p>
            <p class="notice">
              <strong>Chú ý:</strong>
              <span>
                Để xác định size có phù hợp không vui lòng click vào trang
                <router-link to="/home/chonsize">Cách chọn size</router-link>
              </span>
            </p>
          </div>

          <div class="quantity-control">
            <label for="quantity-input">Số lượng:</label>
            <input id="quantity-input" type="number" v-model="quantity" min="1" max="5" class="quantity-input" />
          </div>
        </div>

        <!-- Nút Mua hàng -->
        <div class="detail-buttons">
          <button class="btn-buy" @click="buyNow">
            Mua ngay
          </button>

          <button class="btn-cart" @click="addToCart">
            + Thêm giỏ hàng
          </button>
        </div>
        
      </div>
    </div>
    
    <!-- Custom Modal Message (thay thế alert) -->
    <div v-if="message.visible" class="custom-alert-overlay" @click="message.visible = false">
      <div class="custom-alert-box" @click.stop>
        <p>{{ message.text }}</p>
        <button @click="message.visible = false">Đóng</button>
      </div>
    </div>

  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      product: {},
      quantity: 1,
      message: {
        visible: false,
        text: ''
      }
    };
  },

  // 1. WATCHER: Lắng nghe thay đổi ID trong URL để tải lại dữ liệu (Soft Reload)
  watch: {
    '$route.params.id': {
      handler: 'fetchProductData',
      immediate: true // Chạy ngay lần đầu mounted
    }
  },

  methods: {
    // 2. HÀM TẢI DỮ LIỆU TÁCH BIỆT
    async fetchProductData() {
        // Lấy ID từ tham số URL hiện tại
        const id = this.$route.params.id; 
        if (!id) return;

        try {
            // Gọi API với ID mới
            const res = await axios.get(`http://localhost:5000/api/products/${id}`); 
            this.product = res.data;
        } catch (err) {
            console.error(`Lỗi tải dữ liệu sản phẩm ${id}:`, err);
            this.product = {}; // Đảm bảo làm rỗng sản phẩm nếu có lỗi
        }
    },
    showCustomMessage(text) {
      this.message.text = text;
      this.message.visible = true;
    },
    buyNow() {
      const buyNowProduct = {
        img: this.product.SP_hinh_anh,
        id: this.product.SP_ma,
        name: this.product.SP_ten,
        price: this.product.SP_price,
        size: this.product.SP_size,
        quantity: this.quantity
      };

      localStorage.setItem("buyNowProduct", JSON.stringify(buyNowProduct));
      this.$router.push("/buy1prod");
    },

    addToCart() {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      let item = cart.find(
        p => p.id === this.product.SP_ma
      );

      if (item) {
        if (item.quantity < 5) {
          item.quantity += this.quantity;
        } else {
          this.showCustomMessage("Bạn chỉ có thể mua tối đa 5 sản phẩm!");
          return;
        }
      } else {
        cart.push({
          img: this.product.SP_hinh_anh,
          id: this.product.SP_ma,
          name: this.product.SP_ten,
          price: this.product.SP_price,
          size: this.product.SP_size,
          quantity: this.quantity
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      this.showCustomMessage("Đã thêm sản phẩm vào giỏ hàng thành công!");
      
      // YÊU CẦU: Reload lại trang sau khi thêm vào giỏ hàng
      window.location.reload(); 
    }
  }
};
</script>

<style scoped>
/* --- Tổng quan và Container --- */
.detail-page {
  /* Thiết lập nền cho trang hoặc căn giữa nội dung */
  background-color: #f8f9fa; /* Màu nền nhẹ nhàng */
  padding: 40px 20px;
  display: flex;
  justify-content: center;
}

.detail-card {
  /* Container chính cho chi tiết sản phẩm */
  display: flex;
  max-width: 1100px; /* Thu hẹp tổng thể */
  width: 100%;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* --- Cột Ảnh (Left) --- */
.detail-left {
  flex: 0.8; /* Cột ảnh nhỏ hơn */
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.detail-img {
  width: 90%;
  max-width: 400px; /* Giảm max-width để ảnh nhỏ hơn */
  height: auto;
  border-radius: 8px;
  object-fit: contain;
  transition: transform 0.3s ease;
}

/* --- Cột Thông tin (Right) --- */
.detail-right {
  flex: 1.2; /* Cột thông tin lớn hơn */
  padding: 30px;
  display: flex;
  flex-direction: column;
}

.detail-title {
  font-size: 2.5em; /* Chữ to hơn */
  font-weight: 700;
  color: #333;
  margin-bottom: 10px; /* Khoảng cách hẹp hơn */
}

/* --- Giá và Tình trạng --- */
.price-status-group {
  display: flex;
  align-items: center;
  margin-bottom: 15px; /* Khoảng cách hẹp hơn */
  justify-content: space-between; /* Đẩy giá và tình trạng ra hai bên */
}

.detail-price {
  font-size: 2.2em; /* Chữ to hơn */
  color: #d9534f;
  font-weight: 600;
}

.detail-price span {
  font-size: 1em;
  font-weight: 700;
}

.status {
  font-size: 1.1em; /* Chữ to hơn */
  color: #5cb85c;
  font-weight: 500;
  white-space: nowrap; /* Đảm bảo không bị xuống dòng */
}

/* --- Mô tả sản phẩm --- */
.description {
  margin-bottom: 20px; /* Khoảng cách hẹp hơn */
  line-height: 1.5;
  font-size: 1.15em; /* Chữ to hơn */
  color: #555;
  text-align: left; /* Đảm bảo căn lề trái */
  width: 100%;
}

.description strong {
  color: #333;
  font-weight: 600;
}

.divider {
  border: 0;
  height: 1px;
  background: #eee;
  margin: 15px 0; /* Khoảng cách hẹp hơn */
}

/* --- Size và Số lượng (Selection Group) --- */
.selection-group {
  margin-bottom: 25px;
}

.size-info {
  margin-bottom: 15px;
  display: flex; /* Dùng flex để quản lý các dòng con */
  flex-direction: column;
}

.size-info p {
  margin-bottom: 5px;
  font-size: 1.15em; /* Chữ to hơn */
  color: #333;
  width: 100%;
}

.size-value {
  font-weight: 700;
  color: #333;
  background-color: #f0f0f0;
  padding: 4px 10px;
  border-radius: 4px;
  border: 1px solid #ddd;
  margin-left: 5px;
}

/* Dòng Chú ý (Cải tiến để sát nhau) */
.notice {
  font-size: 1.1em; /* Chữ to hơn */
  color: #777;
  line-height: 1.4;
  
  /* Căn chỉnh các phần tử trên cùng một dòng */
  display: flex;
  align-items: baseline; 
  gap: 5px; /* Khoảng cách nhỏ giữa các từ */
}

.notice strong {
  font-weight: 600;
  color: #555;
}

.notice a {
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
  white-space: nowrap; /* Giữ liên kết trên cùng một dòng */
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 15px; /* Tách biệt khỏi phần size */
}

.quantity-control label {
  font-weight: 600;
  color: #333;
  font-size: 1.1em; /* Chữ to hơn */
}

.quantity-input {
  width: 50px;
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 5px;
  text-align: center;
  font-size: 1em;
  -moz-appearance: textfield;
}

.quantity-input::-webkit-outer-spin-button,
.quantity-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* --- Nút Mua hàng --- */
.detail-buttons {
  display: flex;
  gap: 10px; /* Khoảng cách hẹp hơn */
  margin-top: auto; /* Đẩy các nút xuống cuối cột */
}

.detail-buttons button {
  padding: 10px 20px;
  font-size: 1.1em; /* Chữ to hơn */
  font-weight: 600;
  cursor: pointer;
  border: none;
  border-radius: 8px;
  transition: background-color 0.3s ease, transform 0.1s ease;
}

.btn-buy {
  flex: 1;
  background-color: #d9534f;
  color: white;
}

.btn-buy:hover {
  background-color: #c9302c;
}

.btn-cart {
  flex: 1;
  background-color: #ffc107;
  color: #333;
  border: 1px solid #ffc107;
}

.btn-cart:hover {
  background-color: #e0a800;
}

/* --- Custom Alert/Modal --- */
.custom-alert-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.custom-alert-box {
  background: white;
  padding: 30px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  max-width: 400px;
  animation: fadeIn 0.3s ease-out;
}

.custom-alert-box p {
  font-size: 1.1em;
  margin-bottom: 20px;
}

.custom-alert-box button {
  padding: 8px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.custom-alert-box button:hover {
  background-color: #0056b3;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
}

/* --- Responsive (Điều chỉnh trên màn hình nhỏ hơn) --- */
@media (max-width: 900px) {
  .detail-card {
    flex-direction: column;
    padding: 0;
  }

  .detail-left {
    padding: 20px 20px 0 20px;
    flex: 1; /* Trả về flex 1 để chiếm hết chiều rộng trên mobile */
  }

  .detail-img {
    max-width: 70%;
  }

  .detail-right {
    padding: 20px;
    flex: 1;
  }

  .price-status-group {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .detail-buttons {
    flex-direction: column;
  }
}
</style>
