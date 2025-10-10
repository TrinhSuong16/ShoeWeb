<template>
  <div class="login-page">
    <div class="login-box">
      <h2>ĐĂNG NHẬP</h2>

      <div class="input-group">
        <label for="username">Tài khoản</label>
        <input type="text" id="username" v-model="username" placeholder="Nhập tài khoản..." />
      </div>

      <div class="input-group">
        <label for="password">Mật khẩu</label>
        <div class="password-wrapper">
          <input :type="showPassword ? 'text' : 'password'" id="password" v-model="password" placeholder="Nhập mật khẩu..." />
          <i class="fa" :class="showPassword ? 'fa-eye' : 'fa-eye-slash'" @click="togglePassword"></i>
        </div>
      </div>

      <button class="login-btn" @click="handleLogin">Đăng nhập</button>

      <p class="register-link">
        Chưa có tài khoản?
        <router-link to="/home/register">Đăng kí</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      username: "",
      password: "",
      showPassword: false,
    };
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    async handleLogin() {
      if (!this.username || !this.password) {
        alert("Vui lòng nhập đầy đủ tài khoản và mật khẩu!");
        return;
      }

      try {
        const response = await axios.post("http://localhost:5000/login", {
          username: this.username,
          password: this.password,
        });
        
        // Lưu token vào localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        alert("Đăng nhập thành công!");
       // window.location.reload(); // Reload trang để cập nhật giao diện
        //this.$router.push("/home");
        this.$router.push('/home').then(() => {
        // ✅ Reload lại toàn bộ trang sau khi điều hướng xong
        window.location.reload();
      });
      } catch (error) {
        alert("Lỗi đăng nhập: " + (error.response?.data?.message || error.message));
      }
    },
  },
};
</script>


<style scoped>
/* Căn giữa toàn bộ trang */
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh; /* Chiều cao 100% viewport */
  background: #f8f9fa;
}

/* Chỉnh form đăng nhập */
.login-box {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 350px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}


/* Tiêu đề */
.login-box h2 {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 15px;
}

/* Ô nhập */
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

/* Nút đăng nhập */
.login-btn {
  width: 100%;
  padding: 10px;
  background: #c0392b;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: 0.3s;
}
.login-btn:hover {
  background: #a93226;
}

/* Link đăng ký */
.register-link {
  margin-top: 10px;
  font-size: 14px;
}
.register-link a {
  color: #c0392b;
  font-weight: bold;
}
</style>

