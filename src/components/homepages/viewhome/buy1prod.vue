<template>
  <div class="mo-overlay"></div>
  <div class="mo-content">
    <button class="close-btn" @click="$router.go(-1)">✖</button>
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

    <div class="cart-co" v-if="product">
      <h3>Thông tin sản phẩm</h3>
      <div class="cart-i">
        <img :src="product.img" />
        <p>{{ product.name }} - {{ product.price.toLocaleString() }} đ x {{ product.quantity }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      order: {
        KH_hoten: "",
        KH_email: "",
        KH_sdt: "",
        addr: "",
        shippingMethod: "Giao hàng tận nơi",
        paymentMethod: "Thanh toán khi nhận hàng"
      },
      product: null,
      user: JSON.parse(localStorage.getItem("user")) || {}
    };
  },
  mounted() {
    const productData = JSON.parse(localStorage.getItem('buyNowProduct'));
    console.log("Dữ liệu nhận ở trang /buy1prod:", productData);
    if (!productData) {
      alert("Không tìm thấy sản phẩm! Quay về trang chủ.");
      this.$router.push('/');
    } else {
      this.product = productData;
    }
    this.loadUserData();
  },
  methods: {
    submitOrder() {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.KH_ma) {
        alert("Bạn cần đăng nhập để đặt hàng!");
        return;
      }

      const orderData = {
        KH_ma: user.KH_ma,
        DH_diachi: this.order.addr,
        DH_thanhtoan: this.order.paymentMethod,
        products: [{
          SP_ma: this.product.id,
          soluong: this.product.quantity
        }]
      };

      axios.post("http://localhost:5000/api/create_order", orderData)
        .then(response => {
          alert(response.data.message);
          localStorage.removeItem("buyNowProduct");
          this.$router.push('/');
        })
        .catch(error => {
          alert(error.response?.data?.error || "Lỗi khi đặt hàng");
        });
    },
    loadUserData() {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        this.order.KH_hoten = storedUser.KH_hoten || "";
        this.order.KH_email = storedUser.KH_email || "";
        this.order.KH_sdt = storedUser.KH_sdt || "";
        this.order.addr = storedUser.KH_addr || "";
      }
    }
  }
};
</script>

<style>
.mo-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.mo-content {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  width: 700px;
  padding: 20px;
  border-radius: 10px;
  display: flex;
  gap: 20px;
  z-index: 1000;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.info-co { width: 55%; }
.cart-co { width: 45%; border-left: 2px solid #ddd; padding-left: 20px; }

.nhan { display: block; font-weight: bold; margin-top: 10px; }
.in { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 5px; }

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

.btn-success {
  width: 100%;
  background: red;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}
.btn-success:hover { background: darkred; }
</style>
