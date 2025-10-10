<template>
  <div class="register-container">
    <div class="register-box">
      <h2>ĐĂNG KÝ</h2>

      <div class="input-group">
        <label for="fullname">Tên đầy đủ</label>
        <input type="text" id="fullname" v-model="fullname" placeholder="VD: Trịnh Chí Sương" />
      </div>

      <div class="input-group">
        <label for="phone">Số điện thoại</label>
        <input type="text" id="phone" v-model="phone" placeholder="Số điện thoại" />
      </div>

      <div class="input-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" placeholder="Email" />
      </div>

      <div class="input-group">
        <label for="address">Địa chỉ</label>
        <input type="text" id="address" v-model="address" placeholder="Nhập địa chỉ của bạn" />
      </div>

      <div class="input-group">
        <label for="username">Tài khoản</label>
        <input type="text" id="username" v-model="username" placeholder="Tài khoản" />
      </div>

      <div class="input-group">
        <label for="password">Mật khẩu</label>
        <input type="password" id="password" v-model="password" placeholder="Mật khẩu" />
      </div>

      <div class="input-group">
        <label for="confirmPassword">Nhập lại mật khẩu</label>
        <input type="password" id="confirmPassword" v-model="confirmPassword" placeholder="Nhập lại mật khẩu" />
      </div>

      <div class="checkbox-group">
        <input type="checkbox" id="agree" v-model="agree" />
        <label for="agree">Tôi đồng ý với chính sách và điều khoản</label>
      </div>

      <button class="register-btn" @click="handleRegister">Đăng ký</button>

      <p class="login-link">
        Đã có tài khoản? <router-link to="/home/login">Đăng nhập</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      fullname: "",
      phone: "",
      email: "",
      address: "",
      username: "",
      password: "",
      confirmPassword: "",
      agree: false,
    };
  },
  methods: {
    async handleRegister() {
      if (!this.fullname || !this.phone || !this.email || !this.address || !this.username || !this.password || !this.confirmPassword) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
      }
      if (this.password !== this.confirmPassword) {
        alert("Mật khẩu nhập lại không khớp!");
        return;
      }
      if (!this.agree) {
        alert("Bạn phải đồng ý với chính sách và điều khoản!");
        return;
      }

      const userData = {
        NV_hoten: this.fullname,
        NV_sdt: this.phone,
        NV_email: this.email,
        NV_addr: this.address,
        TK_username: this.username,
        TK_password: this.password,
      };

      try {
        const response = await axios.post("http://localhost:5000/api/register", userData);

        alert(response.data.message);
        this.$router.push("/home/login"); // Chuyển hướng đến trang đăng nhập sau khi đăng ký thành công
      } catch (error) {
        alert("Lỗi đăng ký: " + (error.response?.data?.message || error.message));
      }
    },
  },
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 85vh;
  background: #fcf6f4;
}

.register-box {
  background: rgb(244, 243, 243);
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h2 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 15px;
}

.input-group {
  text-align: left;
  margin-bottom: 10px;
}

.input-group label {
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
}

.input-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.checkbox-group {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.checkbox-group input {
  margin-right: 5px;
}

.register-btn {
  width: 100%;
  padding: 10px;
  background: #c0392b;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: 0.3s;
  margin-top: 10px;
}

.register-btn:hover {
  background: #a93226;
}

.login-link {
  margin-top: 10px;
  font-size: 14px;
}

.login-link a {
  color: #c0392b;
  font-weight: bold;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>
