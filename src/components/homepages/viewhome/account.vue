<template>
  <div class="account-container">
    <h2>THÔNG TIN TÀI KHOẢN</h2>
    <div class="account-form">
      <label>Username:</label>
      <input type="text" v-model="user.username" disabled />

      <label>Password:</label>
      <input type="password" v-model="user.password" />

      <label>Họ tên:</label>
      <input type="text" v-model="user.hoten" />

      <label>Số điện thoại:</label>
      <input type="text" v-model="user.sdt" />

      <label>Email:</label>
      <input type="email" v-model="user.email" />

      <label>Địa chỉ:</label>
      <input type="text" v-model="user.addr" />

      <!-- Nút hành động -->
      <div class="actions">
        <button @click="updateAccount">Cập nhật</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      user: {
        TK_id: "", // ID tài khoản
        username: "",
        password: "",
        hoten: "",
        sdt: "",
        email: "",
        addr: "",
      },
    };
  },
  mounted() {
    this.loadUserData();
  },
  methods: {
    loadUserData() {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        this.user.TK_id = storedUser.id; // Lấy ID từ API đăng nhập
        this.user.username = storedUser.username;
        this.user.hoten = storedUser.KH_hoten;
        this.user.sdt = storedUser.KH_sdt;
        this.user.email = storedUser.KH_email;
        this.user.addr = storedUser.KH_addr;
      }
    },

    async updateAccount() {
      if (!this.user.hoten || !this.user.sdt || !this.user.email || !this.user.addr) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
      }

      try {
        const response = await axios.put(`http://localhost:5000/api/update_accountss/${this.user.TK_id}`, {
          TK_password: this.user.password,  // Gửi mật khẩu nếu muốn cập nhật
          NV_hoten: this.user.hoten,
          NV_sdt: this.user.sdt,
          NV_email: this.user.email,
          NV_addr: this.user.addr,
        });

        alert(response.data.message); // Thông báo cập nhật thành công hoặc lỗi
      } catch (error) {
        console.error("Lỗi khi cập nhật tài khoản:", error);
        alert("Cập nhật thất bại, vui lòng thử lại!");
      }
    },
  },
};
</script>



<style scoped>
.account-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  background: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  text-align: center;
}
.account-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.actions {
  margin-top: 15px;
}
button {
  margin: 5px;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background: #007bff;
  color: white;
}
button:hover {
  background: #0056b3;
}
</style>
