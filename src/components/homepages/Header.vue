<template>
    <div class="navbar">
				<div class="container">
					<!-- nb = navbar -->
					<div class="nb-wp">
						<div class="nb-main">
							<!--  -->
							<!-- NAVBAR LEFT -->
							<!--  -->
							<RouterLink to="/home" class="nb__left">
                        		<a href="index.html" class="nb__left-logo">
									<img src="/src/assets/logo.png"  alt="Logo"
										class="nb__left-img"/>
								</a>
                    		</RouterLink>
							<!--  -->
							<!-- NAVBAR CENTER -->
							<!--  -->
							<div class="nb__center">
								<div class="nb__center-nav">
									<ul class="nb__center-menu">
										<li class="nb__center-item">
											
                      <router-link to="/san-pham/new_product" class="nb__center-link">Hàng mới về</router-link>
											<span class="nb__center-tag">HOT</span>
										</li>
										<!-- --has-sub-menu = có menu con -->
										<li class="nb__center-item --has-sub-menu">
											<a href="#" class="nb__center-link">GIÀY NAM</a>
											<ul class="nb__center-sub-menu">
												<li class="nb__center-sub-item">
													<router-link to="/san-pham/N01" class="nb__center-sub-link">Giày thể thao nam</router-link>
												</li>
												<li class="nb__center-sub-item">
													<router-link to="/san-pham/N02" class="nb__center-sub-link">Giày tây nam</router-link>
												</li>
												<li class="nb__center-sub-item">
													<router-link to="/san-pham/N03" class="nb__center-sub-link">Sandal nam</router-link>
												</li>
												<li class="nb__center-sub-item">
													<router-link to="/san-pham/N04" class="nb__center-sub-link">Dép nam</router-link>
												</li>
											</ul>
										</li>

										<li class="nb__center-item --has-sub-menu">
											<a href="#" class="nb__center-link">GIÀY NỮ</a>
											<ul class="nb__center-sub-menu">
												<li class="nb__center-sub-item">
													<router-link to="/san-pham/N05" class="nb__center-sub-link">Giày thể thao nữ</router-link>
												</li>
												<li class="nb__center-sub-item">
													<router-link to="/san-pham/N06" class="nb__center-sub-link">Sandal nữ</router-link>
												</li>
												<li class="nb__center-sub-item">
													<router-link to="/san-pham/N07" class="nb__center-sub-link">Dép nữ</router-link>
												</li>
											</ul>
										</li>

										<li class="nb__center-item --has-sub-menu">
											<a href="#" class="nb__center-link">PHỤ KIỆN</a>
											<ul class="nb__center-sub-menu">
												<li class="nb__center-sub-item">
													<router-link to="/san-pham/N08" class="nb__center-sub-link">Balo</router-link>
												</li>
												<li class="nb__center-sub-item">
													<router-link to="/san-pham/N09" class="nb__center-sub-link">Tất</router-link>
												</li>
												<li class="nb__center-sub-item">
													<router-link to="/san-pham/N10" class="nb__center-sub-link">Dế lót giày</router-link>
												</li>
												<li class="nb__center-sub-item">
													<router-link to="/san-pham/N11" class="nb__center-sub-link">Dây giày</router-link>
												</li>
												<li class="nb__center-sub-item">
													<router-link to="/san-pham/N12" class="nb__center-sub-link">Nước vệ sinh giày</router-link>
												</li>
											</ul>
										</li>

									</ul>
								</div>
							</div>
							<!--  -->
							<!-- NAVBAR RIGHT -->
							<!--  -->
							<div class="nb__right">
								<div class="nb__right-wp">
									<div class="nb__right-main">
										<!--  -->
										<!-- SEARCH -->
										<!--  -->
										<div class="nb__right-search-wp">
  <div class="nb__right-search">
    <div class="nb__right-inp">
      <input
        class="nb__right-form-inp"
        type="text"
        v-model="searchQuery"
        @input="fetchSuggestions"
        placeholder="Tìm kiếm..."
      />
    </div>

    <div class="nb__right-btn-search">
      <font-awesome-icon :icon="['fas', 'search']" class="icon" />
    </div>
  </div>

  <!-- Gợi ý -->
  <ul v-if="suggestions.length" class="suggest-box">
    <li
      v-for="item in suggestions"
      :key="item.SP_ma"
      @click="goToDetail(item.SP_ma)"
    >
      {{ item.SP_ten }}
    </li>
  </ul>
</div>

										<!--  -->
										<!-- CART -->
										<!--  -->
                    <div
                  class="nb__right-cart-wp"
                  @click="toggleCart"
                  v-if="user && user.role === 'customer'"
                >


										<div class="icon-wrapper">
											<div class="icon-box">
											<font-awesome-icon :icon="['fas', 'shopping-cart']" class="icon" />
											<span v-if="cart.length > -1" class="cart-badge">{{ cart.length }}</span>
											</div>
										</div>
										</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
    </div>
		<div>
            <!-- form giỏ hàng -->
            <div v-if="showCart" class="cart-container">
				<div class="cart-header">
					<h3>Giỏ hàng của bạn</h3>
					<button class="close-btn" @click="toggleCart">✖</button>
				</div>

				<div class="cart-item-list"> <!-- Thêm div này để chứa danh sách sản phẩm -->
					<div v-for="(item, index) in cart" :key="index" class="cart-item">
					<img :src="item.img" :alt="item.name" class="cart-img" />
					<div class="cart-details">
						<h4>{{ item.name }}</h4>
						<p>Giá: <span class="price">{{ item.price.toLocaleString() }} đ</span></p>
						<p>Size: {{ item.size }}</p>
						<div class="quantity-controls">
						<button @click="decreaseQuantity(index)">-</button>
						<span>{{ item.quantity }}</span>
						<button @click="increaseQuantity(index)">+</button>
						</div>
					</div>
					<button class="delete-btn" @click="removeItem(index)">Xóa</button>
					</div>
				</div> <!-- Kết thúc div có thanh cuộn -->

				<div class="cart-footer">
					<p><strong>Tổng:</strong> <span class="total-price">{{ totalPrice.toLocaleString() }} đ</span></p>
					<button class="checkout-btn" @click="openCheckoutModal">Thanh toán</button>
				</div>
			
			</div>
	</div>
				<!--form đặt-->
				<div v-if="showCheckoutModal" class="mo">
					<div class="mo-content">
            <button class="close-btn" @click="closeCheckoutModal">✖</button>
						<div class="info-co">
							<h2>THANH TOÁN</h2>
							<label class="nhan">Tên đầy đủ *</label>
							<input class="in" v-model="order.KH_hoten" type="text" required />

							<label class="nhan">Email *</label>
							<input class="in" v-model="order.KH_email" type="email" required />

							<label class="nhan">Số điện thoại *</label>
							<input class="in" v-model="order.KH_sdt" type="text" required />
							<label class="nhan">Địa chỉ *</label>
							<input class="in" v-model="order.addr" type="text" placeholder="Nhập địa chỉ giao hàng" required />
							<label class="nhan">Cách thức giao hàng *</label>
							<select class="in" v-model="order.shippingMethod">
								<option>Giao hàng tận nơi</option>
								<option>Nhận tại cửa hàng</option>
							</select>

							<label class="nhan">Phương thức thanh toán *</label>
							<select class="in" v-model="order.paymentMethod">
								<option>Thanh toán khi nhận hàng</option>
								<option>Chuyển khoản</option>
							</select>

							<div v-if="order.paymentMethod === 'Chuyển khoản'" class="payment-image">
								<img src="/src/assets/img/QRcode.jpg" alt="Thông tin chuyển khoản" width="100%" />
							</div>

							
							
							<button @click="submitOrder" class="btn btn-success">Xác nhận đặt hàng</button>
						</div>

						<div class="cart-co">
							<h3>GIỎ HÀNG</h3>
							<div v-for="item in order.cart" :key="item.id" class="cart-i">
								<img :src="item.img" />
								<p>{{ item.name }} - {{ item.price }} đ x {{ item.quantity }}</p>
							</div>
						</div>
					</div>
				</div>

</template>
<script>
import axios from "axios";
import { RouterLink } from 'vue-router';

export default {
  data() {
    return {
      searchQuery: "",
      suggestions: [],       // ✅ thêm dòng này
      cart: [],
      showCart: false,
      showCheckoutModal: false,
      order: {
        KH_ma: "",
        KH_hoten: "",
        KH_email: "",
        KH_sdt: "",
        shippingMethod: "Giao hàng tận nơi",
        paymentMethod: "Thanh toán khi nhận hàng",
        KH_addr: "",
        cart: JSON.parse(localStorage.getItem("cart")) || []
      },
      user: JSON.parse(localStorage.getItem("user")) || {}
    };
  },

  computed: {
    totalPrice() {
      return this.cart.reduce((total, item) => total + item.price * item.quantity, 0);
    }
  },

  mounted() {
    this.loadCart();
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    }
  },

  methods: {
    // ✅ Gợi ý sản phẩm (realtime)
    async fetchSuggestions() {
      if (!this.searchQuery.trim()) {
        this.suggestions = [];
        return;
      }

      const res = await axios.get("http://localhost:5000/sanpham/suggest", {
        params: { q: this.searchQuery }
      });

      this.suggestions = res.data;
    },

    // ✅ Chuyển đến trang chi tiết sản phẩm
    goToDetail(id) {
      this.searchQuery = "";
      this.suggestions = [];
      this.$router.push(`/product/${id}`);
    },

    // 💡 ĐÃ SỬA: Tìm kiếm khi nhấn ENTER (Chuyển sang Soft Reload)
    handleSearch() {
      if (this.searchQuery) {
        // Sử dụng $router.push chuẩn để điều hướng
        this.$router.push({ path: '/search', query: { q: this.searchQuery } }).catch(() => {});
        // Đảm bảo component Search (trang kết quả) có watcher cho $route.query.q
      }
    },

    ///////////////////
    openCheckoutModal() {
      const token = localStorage.getItem("token");
      // LƯU Ý: Thay thế alert() bằng Custom Modal nếu bạn đang sử dụng
      if (!token) {
        alert("Bạn cần đăng nhập để thanh toán!");
        this.$router.push("/login");
        return;
      }

      this.order.KH_ma = this.user.KH_ma || "";
      this.order.KH_hoten = this.user.KH_hoten || "";
      this.order.KH_email = this.user.KH_email || "";
      this.order.KH_sdt = this.user.KH_sdt || "";
      this.order.KH_addr = this.user.KH_addr || "";
      this.showCheckoutModal = true;
    },

    closeCheckoutModal() {
      this.showCheckoutModal = false;
      this.$router.push('/');
    },

    submitOrder() {
      const user = JSON.parse(localStorage.getItem("user"));
      const KH_ma = user ? user.KH_ma : null;

      // LƯU Ý: Thay thế alert() bằng Custom Modal nếu bạn đang sử dụng
      if (!KH_ma) {
        alert("Bạn cần đăng nhập để đặt hàng!");
        return;
      }

      const orderData = {
        KH_ma,
        DH_diachi: this.order.addr,
        DH_thanhtoan: this.order.paymentMethod,
        products: this.order.cart.map(item => ({
          SP_ma: item.id,
          soluong: item.quantity
        }))
      };

      axios.post("http://localhost:5000/api/create_order", orderData)
        .then(response => {
          // LƯU Ý: Thay thế alert() bằng Custom Modal nếu bạn đang sử dụng
          alert(response.data.message);
          this.showCheckoutModal = false;
          this.clearCart();
        })
        .catch(error => {
          // LƯU Ý: Thay thế alert() bằng Custom Modal nếu bạn đang sử dụng
          alert(error.response.data.error || "Lỗi khi đặt hàng");
        });
    },
    ////////////////////

    loadCart() {
      this.cart = JSON.parse(localStorage.getItem("cart")) || [];
    },

    toggleCart() {
      this.showCart = !this.showCart;
    },

    increaseQuantity(index) {
      if (this.cart[index].quantity < 5) {
        this.cart[index].quantity++;
        this.saveCart();
      }
    },

    decreaseQuantity(index) {
      if (this.cart[index].quantity > 1) {
        this.cart[index].quantity--;
      } else {
        this.cart.splice(index, 1);
      }
      this.saveCart();
    },

    clearCart() {
      this.cart = [];
      this.order.cart = [];
      localStorage.removeItem("cart");
    },

    removeItem(index) {
      this.cart.splice(index, 1);
      this.saveCart();
    },

    saveCart() {
      localStorage.setItem("cart", JSON.stringify(this.cart));
    },

  }
};
</script>


<style>
.suggest-box {
  background: white;
  border: 1px solid #ddd;
  position: absolute;
  width: 100%;
  z-index: 99;
  list-style: none;
  margin-top: 5px;
  padding: 0;
  max-height: 200px;
  overflow-y: auto;
}

.suggest-box li {
  padding: 8px 10px;
  cursor: pointer;
}

.suggest-box li:hover {
  background: #f0f0f0;
}





.cart-icon {
  position: fixed;
  top: 20px;
  right: 20px;
  font-size: 24px;
  cursor: pointer;
  position: relative;
}

.cart-badge {
  position: absolute;
  top: -5px;
  right: -10px;
  background: #de4444;
  color: white;
  font-size: 14px;
  padding: 3px 6px;
  border-radius: 50%;
}

.cart-container {
  position: absolute;
  top: 170px; /* Điều chỉnh khoảng cách dưới icon giỏ hàng */
  right: 20px;
  background: rgb(243, 232, 232);
  width: 400px;
  max-width: 90%;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

.cart-item-list {
  max-height: 350px; 
  overflow-y: auto; 
  padding-right: 10px; 
}

.cart-item-list::-webkit-scrollbar {
  width: 6px;
}

.cart-item-list::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.cart-item-list::-webkit-scrollbar-thumb:hover {
  background: #555;
}
.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.cart-item {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ddd;
  padding: 10px 0;
}

.cart-img {
  width: 50px;
  height: 50px;
  margin-right: 10px;
}

.cart-details {
  flex-grow: 1;
}

.price {
  color: red;
  font-weight: bold;
}

.quantity-controls {
  display: flex;
  align-items: center;
}

.quantity-controls button {
  padding: 3px 7px;
  margin: 0 5px;
  border: none;
  cursor: pointer;
}

.delete-btn {
  background: red;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}

.cart-footer {
	margin-top: 10px;
  text-align: right;
}

.total-price {
  font-size: 18px;
  font-weight: bold;
  color: red;
  margin-top: 20px;
}

.checkout-btn {
  background: green;
  color: white;
  padding: 8px 15px;
  border: none;
  cursor: pointer;
  margin-top: 10px;
}
.payment-image {
  margin-top: 10px;
  text-align: center;
}

.payment-image img {
  max-width: 100%;
  border-radius: 10px;
}



.mo {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.mo-content {
    background: white;
    width: 700px; /* Tăng chiều rộng để đủ không gian */
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    position: relative;
    display: flex; /* Chia thành 2 cột */
    gap: 20px;
}

.close-btn {
    position: absolute;
    top: 10px;
    right: 15px;
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
}

/* Cột thông tin */
.info-co {
    width: 55%;
}

/* Cột giỏ hàng */
.cart-co {
    width: 45%;
    border-left: 2px solid #ddd;
    padding-left: 20px;
}

/* Label và input */
.nhan {
    display: block;
    font-weight: bold;
    margin-top: 10px;
}

.in {
    width: 100%;
    padding: 8px;
    margin-top: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

/* Giỏ hàng */
.cart-i {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ddd;
    padding: 10px 0;
}

.cart-i img {
    width: 50px;
    margin-right: 10px;
    border-radius: 5px;
}

/* Nút xác nhận */
.btn-success {
    width: 100%;
    background: red;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    margin-top: 15px;
}

.btn-success:hover {
    background: darkred;
}


</style>