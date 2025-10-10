<template>
  <div class="account-container">
    <h2 class="account-title">TÀI KHOẢN CỦA SHOE TCS</h2>
    <div class="account-controls">
      <div class="filter-section">
        <label for="role-select">Lọc:</label>
        <select id="role-select" v-model="filterRole">
          <option value="all">Tất cả</option>
          <option value="admin">Admin</option>
          <option value="customer">Customer</option>
        </select>
      </div>
      <input type="text" class="search-input" v-model="searchQuery" placeholder="Tìm kiếm tài khoản..." />
      <button @click="openAddForm" class="btn-add">+ Thêm tài khoản</button>
    </div>
    
    <table class="account-table">
      <thead>
        <tr>
          <th>SỐ THỨ TỰ</th>
          <th>ID</th>
          <th>QUYỀN</th>
          <th>HỌ VÀ TÊN</th>
          <th>TÊN ĐĂNG NHẬP</th>
          <th>Email</th>
          <th>SỐ ĐIỆN THOẠI</th>
          <th>THAO TÁC</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(account, index) in filteredAccounts" :key="account.TK_id">
          <td>{{ index + 1 }}</td>
          <td>{{ account.TK_id }}</td>
          <td>{{ account.TK_role }}</td>
          <td>{{ account.hoten }}</td>
          <td>{{ account.TK_username }}</td>
          <td>{{ account.email }}</td>
          <td>{{ account.sdt }}</td>
          <td>
            <button @click="editAccount(account)" class="btn-edit">Chỉnh sửa</button>
            <button @click="deleteAccount(account.TK_id)" class="btn-delete">Xóa</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="showForm" class="form-overlay">
      <div class="form-container">
        <h3>{{ isEditing ? 'CHỈNH SỬA THÔNG TIN TÀI KHOẢN' : 'THÊM TÀI KHOẢN MỚI' }}</h3>
        <input type="text" v-model="formData.NV_hoten" placeholder="Tên đầy đủ" required />
        <input type="text" v-model="formData.NV_sdt" placeholder="Số điện thoại" required />
        <input type="email" v-model="formData.NV_email" placeholder="Email" required />
        <input type="text" v-model="formData.TK_username" placeholder="Tên đăng nhập" required />
        <input type="password" v-model="formData.TK_password" placeholder="Mật khẩu" required />
        <input type="text" v-model="formData.NV_addr" placeholder="Địa chỉ" required />
        <select v-model="formData.TK_role">
          <option value="admin">Admin</option>
          <option value="customer">Customer</option>
        </select>
        <button @click="submitForm" class="btn-confirm">Xác nhận</button>
        <button @click="closeForm" class="btn-cancel">Hủy</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      accounts: [],
      searchQuery: '',
      filterRole: 'all',
      showForm: false,
      isEditing: false,
      formData: {
        NV_hoten: '',
        NV_sdt: '',
        NV_email: '',
        TK_username: '',
        TK_password: '',
        TK_role: 'customer',
        NV_addr: '',
      }
    };
  },
  computed: {
    filteredAccounts() {
      return this.accounts.filter(acc => {
        const matchesName = acc.hoten.toLowerCase().includes(this.searchQuery.toLowerCase());
        const matchesRole = this.filterRole === 'all' || acc.TK_role === this.filterRole;
        return matchesName && matchesRole;
      });
    }
  },
  methods: {
    async fetchAccounts() {
      try {
        const response = await axios.get("http://localhost:5000/api/accounts");
        this.accounts = response.data;
      } catch (error) {
        console.error("Lỗi khi lấy danh sách tài khoản:", error);
      }
    },
    openAddForm() {
      this.isEditing = false;
      this.formData = {
    NV_hoten: this.formData.hoten,
    NV_sdt: this.formData.sdt,
    TK_username: this.formData.TK_username,
    TK_password: this.formData.TK_password,
    NV_email: this.formData.email,
    NV_addr: this.formData.addr,
    TK_role: this.formData.TK_role
};

      this.showForm = true;
    },
    editAccount(account) {
      this.isEditing = true;
      this.formData = { ...account };
      this.showForm = true;
    },
    async submitForm() {
      try {
        let response;
        console.log("Form Data:", this.formData);

        if (this.isEditing) {
          response = await axios.put(`http://localhost:5000/api/update_account/${this.formData.TK_id}`, this.formData, {
            headers: { "Content-Type": "application/json" }
          });
        } else {
          response = await axios.post("http://localhost:5000/api/add_account", this.formData, {
            headers: { "Content-Type": "application/json" }
          });
        }

        if (response.status === 200 || response.status === 201) {
          alert("Thành công!");
          this.fetchAccounts();
          this.closeForm();
        } else {
          alert("Lỗi khi thêm tài khoản!");
        }
      } catch (error) {
        console.error("Lỗi khi gửi dữ liệu tài khoản:", error);
        alert("Lỗi: " + (error.response?.data?.message || error.message));
      }
    },
    async deleteAccount(id) {
      if (confirm("Bạn có chắc muốn xóa tài khoản này?")) {
        try {
          const response = await axios.delete(`http://localhost:5000/api/delete_account/${id}`);
          alert(response.data.message);
          this.fetchAccounts();
        } catch (error) {
          console.error("Lỗi xóa tài khoản:", error);
          alert("Lỗi: " + (error.response?.data?.message || error.message));
        }
      }
    },
    closeForm() {
      this.showForm = false;
    }
  },
  mounted() {
    this.fetchAccounts();
  }
};
</script>




<style>
/* Container tổng thể */
.account-container {
  padding: 20px;
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
  margin-left: 260px; /* Dịch chuyển nội dung sang phải để tránh đè lên sidebar */
}

/* Tiêu đề */
.account-title {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  background: #b22222;
  color: white;
  padding: 15px;
  border-radius: 5px;
}

/* Thanh điều khiển */
.account-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}

/* Ô tìm kiếm */
.search-input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

/* Nút thêm tài khoản */
.btn-add {
  background: #b22222;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-add:hover {
  background: #8b0000;
}

/* Bảng tài khoản */
.account-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
  background: white;
}

.account-table th, .account-table td {
  padding: 12px;
  border: 1px solid #ddd;
  text-align: center;
}

.account-table th {
  background: #b22222;
  color: white;
}

/* Các nút trong bảng */
.btn-edit, .btn-suspend, .btn-delete {
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  color: white;
}

.btn-edit {
  background: #ffa500;
}

.btn-edit:hover {
  background: #e69500;
}

.btn-suspend {
  background: #b22222;
}

.btn-suspend:hover {
  background: #8b0000;
}

.btn-delete {
  background: #8b0000;
}

.btn-delete:hover {
  background: #660000;
}

/* Sidebar cố định */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  height: 100vh;
  background: #b22222;
  color: white;
  padding: 15px;
}

/* Định dạng modal form thêm tài khoản */
.form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-container {
  background: white;
  padding: 30px;
  border-radius: 8px;
  width: 500px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.form-container h2 {
  text-align: center;
  font-size: 22px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
}

.form-group input, .form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.btn-confirm {
  background: #b22222;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: block;
  width: 100%;
  text-align: center;
  font-size: 16px;
}

.btn-confirm:hover {
  background: #8b0000;
}

.btn-cancel {
  background: #ccc;
  color: black;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: block;
  width: 100%;
  text-align: center;
  font-size: 16px;
  margin-top: 10px;
}

.btn-cancel:hover {
  background: #bbb;
}
.form-overlay {
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

.form-container {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  text-align: center;
}

.form-container h3 {
  font-size: 20px;
  margin-bottom: 15px;
  font-weight: bold;
}

.form-container input,
.form-container select {
  width: 100%;
  padding: 10px;
  margin: 8px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.form-container button {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-confirm {
  background-color: #d32f2f;
  color: white;
  font-size: 16px;
}

.btn-cancel {
  background-color: #ccc;
  color: black;
  font-size: 16px;
}

</style>
