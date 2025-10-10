<template>
  <div>
    <h2>SẢN PHẨM MỚI</h2>
    <div class="product-grid">
      <div 
        v-for="product in products" 
        :key="product.SP_ma" 
        class="product-card"
        @click="openModal(product)"
      >
        <img :src="product.SP_hinh_anh" :alt="product.SP_ten" />
        <h3>{{ product.SP_ten }}</h3>
        <p>{{ product.SP_price.toLocaleString() }} đ</p>
      </div>
    </div>

    <!-- Modal Hiển thị Chi tiết Sản phẩm -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <button class="close-btn" @click="closeModal">✖</button>
        <img :src="selectedProduct.SP_hinh_anh" :alt="selectedProduct.SP_ten" />
        <div class="modal-content">
          <h2>{{ selectedProduct.SP_ten }}</h2>
          <p><strong>Giá:</strong> <span style="color: red">{{ selectedProduct.SP_price.toLocaleString() }} đ</span></p>
          <p><strong>Tình trạng:</strong> Còn hàng</p>
          <p><strong>Mô tả sản phẩm:</strong> Là sản phẩm thời trang , trẻ trung, năng động phù hợp với giới trẻ hiện nay.</p>
          
          <div>
            <p><strong ><b>Size:</b></strong> <span>{{ selectedProduct.SP_size.toLocaleString() }} </span></p>
            <p><strong ><b>Chú ý:</b></strong> <span>Để xác định size có phù hợp không vui lòng click vào trang <router-link to="/home/chonsize"><b>Cách chọn size</b></router-link> </span></p>
            <label for="quantity">Số lượng:</label>
            <input type="number" v-model="quantity" min="1" max="5" />
          </div>

          <div class="button-group">
            <button @click="buyNow">Mua ngay</button>
            <button @click="addToCart(selectedProduct)">+ Thêm giỏ hàng</button>
          </div>
        </div>
      </div>
</div>
  </div>
</template>

<script>
import axios from 'axios';
import Header from '../Header.vue';
export default {
  props: ['NPS_ma'],
  data() {
    return {
      products: [],
      showModal: false,
      selectedProduct: {},
      selectedSize: "",
      quantity: 1,
    };
  },
  computed: {
    categoryName() {
      return this.categories[this.NPS_ma] || "Không xác định";
    }
  },
  watch: {
    NPS_ma: "fetchProducts"
  },
  mounted() {
    this.fetchProducts();
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await axios.get(`http://localhost:5000/api/latest-products`);
        this.products = response.data;
      } catch (error) {
        console.error("Lỗi tải danh sách sản phẩm:", error);
      }
    },
    openModal(product) {
      this.selectedProduct = product;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
   buyNow() {
      const buyNowProduct = {
        img: this.selectedProduct.SP_hinh_anh,
        id: this.selectedProduct.SP_ma,
        name: this.selectedProduct.SP_ten,
        price: this.selectedProduct.SP_price,
        size: this.selectedSize || "Mặc định",
        quantity: this.quantity
      };
      localStorage.setItem('buyNowProduct', JSON.stringify(buyNowProduct));
      this.$router.push('/buy1prod');
    },
      addToCart(product) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Tìm sản phẩm trong giỏ hàng (nếu có size, so sánh theo size)
        let item = cart.find(p => p.id === product.SP_ma && (!product.SP_size || p.size === this.selectedSize));

        if (item) {
            // Nếu sản phẩm đã có, tăng số lượng (giới hạn 5)
            if (item.quantity < 5) {
                item.quantity += this.quantity;
            } else {
                alert("Bạn chỉ có thể mua tối đa 5 sản phẩm!");
            }
        } else {
            // Nếu chưa có, thêm sản phẩm vào giỏ hàng
            cart.push({
                img: product.SP_hinh_anh,
                id: product.SP_ma,
                name: product.SP_ten,
                price:  product.SP_price, // Kiểm tra API trả về giá nào
                size: this.selectedSize || "Mặc định", // Nếu không có size, để "Mặc định"
                quantity: this.quantity
            });
        }

        // Lưu giỏ hàng vào localStorage
        localStorage.setItem('cart', JSON.stringify(cart));

        // Cập nhật giỏ hàng trong Vue để hiển thị đúng
        this.cart = cart;
        alert("Đã thêm vào giỏ hàng!");
        window.location.reload();
    }
      }

};
</script>

<style scoped>
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;
  background-color: #f9f9f9;
}
.product-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.product-card {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: center;
  cursor: pointer;
}
.product-card {
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  text-align: center;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.product-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.product-card h3 {
  margin: 15px 0;
  font-size: 1.2em;
  color: #333;
}

.product-card p {
  color: #e74c3c;
  font-weight: bold;
  font-size: 1.1em;
  margin-bottom: 15px;
}

.product-card button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
  margin-bottom: 15px;
  font-size: 1em;
  transition: background-color 0.3s ease;
}

.product-card button:hover {
  background-color: #2980b9;
}

h2 {
  text-align: center;
  font-size: 2em;
  color: #2c3e50;
  margin-bottom: 20px;
  padding-top: 20px;
}
.modal-overlay {
 position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* Đảm bảo modal luôn nằm trên cùng */
  overflow: hidden; 
}

.modal {
  background: white;
  display: flex;
  width: 60%;
  max-width: 900px;
  border-radius: 5px;
  padding: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  position: relative;
}

.modal img {
  width: 300px;
  height: auto;
  border-radius: 5px;
}

.modal-content {
  flex: 1;
  padding-left: 20px;
}

.modal h2 {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}

.modal p {
  font-size: 14px;
  margin-bottom: 8px;
}

.modal select, .modal input {
  width: 100px;
  padding: 5px;
  margin-left: 10px;
}

.button-group {
  margin-top: 15px;
  display: flex;
  gap: 10px;
}

.button-group button {
  background-color: #c00;
  color: white;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  font-size: 14px;
}

.button-group button:hover {
  background-color: #900;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #c00;
  border: none;
  font-size: 18px;
  cursor: pointer;
   color: white;
}

</style>