<template>
  <div class="statistics-container">
    <h2 class="statistics-title">THỐNG KÊ CỦA SHOE TCS</h2>

    <div class="statistics-controls">
      <div class="statistics-controls"></div>
      <div class="search-box">
        <font-awesome-icon icon="search" class="icon" />
        <input type="text" v-model="searchQuery" placeholder="Tìm kiếm sản phẩm..." />
      </div>
      <label class="order-label">Từ:</label>
      <input type="date" class="order-date" v-model="startDate" @change="filteredOrders" />
      <label class="order-label">Đến:</label>
      <input type="date" class="order-date" v-model="endDate" @change="filteredOrders" />
      <button @click="fetchOrders" class="filter-btn">Lọc</button>
    </div>

    <div class="statistics-summary">
      <div class="summary-box">
        <b><p>Số lượng đơn hàng</p></b>
        <div class="stat-content">
          <p class="stat-number">{{ totalOrders }}</p>
          <font-awesome-icon icon="receipt" class="stat-icon" />
        </div>
      </div>
      <div class="summary-box">
        <b><p>Số lượng bán ra</p></b>
        <div class="stat-content">
          <p class="stat-number">{{ totalSold }}</p>
          <font-awesome-icon icon="box" class="stat-icon" />
        </div>
      </div>
      <div class="summary-box">
        <b><p>Doanh thu</p></b>
        <div class="stat-content">
          <p class="stat-number">{{ totalRevenue.toLocaleString() }} đ</p>
          <font-awesome-icon icon="dollar-sign" class="stat-icon" />
        </div>
      </div>
    </div>

    <div class="table-container">
      <table class="statistics-table">
        <thead>
          <tr>
            <th>MÃ SẢN PHẨM</th>
            <th>ẢNH SẢN PHẨM</th>
            <th>TÊN SẢN PHẨM</th>
            <th>SỐ LƯỢNG BÁN RA</th>
            <th>SỐ LƯỢNG TỒN KHO</th>
            <th>DOANH THU</th>
            <th>THÔNG TIN CHI TIẾT</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in filteredOrders" :key="product.ma_san_pham">
            <td>{{ product.ma_san_pham }}</td>
            <td><img :src="product.anh_san_pham" alt="Sản phẩm" width="50" /></td>
            <td>{{ product.ten_san_pham }}</td>
            <td>{{ product.so_luong_ban_ra }}</td>
            <td>{{ product.so_luong_ton_kho }}</td>
            <td>{{ product.doanh_thu.toLocaleString() }} đ</td>
            <td><button class="detail-btn" @click="showDetails(product)">Xem chi tiết</button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="selectedProduct" class="modal">
      <div class="modal-content">
        <h3>CHI TIẾT ĐƠN HÀNG</h3>
        <table>
          <thead>
            <tr>
              <th>MÃ ĐƠN HÀNG</th>
              <th>NGÀY MUA</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(order, idx) in selectedProduct.orders" :key="idx">
              <td>{{ order.ma }}</td>
              <td>{{ order.ngay }}</td>
            </tr>
          </tbody>
        </table>
        <button
          style="
            background: #b22222;
            color: white;
            padding: 8px 12px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background 0.3s;
          "
          @click="selectedProduct = null"
        >
          Đóng
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      orders: [],
      searchQuery: '',
      startDate: '',
      endDate: '',
      selectedProduct: null,
      totalOrders: 0,
    };
  },
  computed: {
    filteredOrders() {
      return this.orders
        .filter((order) => {
          const matchSearch =
            !this.searchQuery ||
            order.ten_san_pham.toLowerCase().includes(this.searchQuery.trim().toLowerCase()) ||
            order.ma_san_pham.toString().includes(this.searchQuery.trim());

          const matchDateFrom =
            !this.startDate || new Date(order.ngay_mua) >= new Date(this.startDate);

          const matchDateTo =
            !this.endDate || new Date(order.ngay_mua) <= new Date(this.endDate);

          return matchSearch && matchDateFrom && matchDateTo;
        })
        .sort((a, b) => b.so_luong_ban_ra - a.so_luong_ban_ra);
    },
    totalSold() {
      return this.orders.reduce((sum, order) => sum + parseInt(order.so_luong_ban_ra || 0), 0);
    },
    totalRevenue() {
      return this.orders.reduce((sum, order) => sum + order.doanh_thu, 0);
    },
  },
  methods: {
    async fetchOrders() {
      try {
        const response = await fetch('http://localhost:5000/api/orders/summary');
        const data = await response.json();

        this.orders = data.map((order) => ({
          ...order,
          so_luong_ban_ra: parseInt(order.so_luong_ban_ra) || 0,
          so_luong_ton_kho: parseInt(order.so_luong_ton_kho) || 0,
          doanh_thu: parseFloat(order.doanh_thu) || 0,
        }));
      } catch (error) {
        console.error('Lỗi tải dữ liệu:', error);
      }
    },
    async fetchTotalOrders() {
      try {
        const response = await fetch('http://localhost:5000/api/orders/count');
        const data = await response.json();
        this.totalOrders = data.total_orders;
      } catch (error) {
        console.error('Lỗi tải số lượng đơn hàng:', error);
      }
    },
    showDetails(product) {
      // nếu API có thêm danh_sach_don_hang sau này
      this.selectedProduct = {
        orders:
          product.danh_sach_don_hang && product.danh_sach_ngay_mua
            ? product.danh_sach_don_hang.split(', ').map((ma, index) => ({
                ma,
                ngay: product.danh_sach_ngay_mua.split(', ')[index],
              }))
            : [],
      };
    },
  },
  mounted() {
    this.fetchOrders();
    this.fetchTotalOrders();
  },
};
</script>



<style scoped>
.table-container {
  width: 100%; /* Hoặc chiều rộng cố định nếu cần */
  max-height: 400px; /* Chiều cao tối đa cho bảng */
  overflow-y: auto; /* Cuộn theo chiều dọc */
  overflow-x: auto; /* Cuộn theo chiều ngang nếu bảng quá rộng */
}
.statistics-table th {
  position: sticky;
  top: 0;
  background-color: #fff; /* Màu nền của header khi cố định */
  z-index: 10; /* Đảm bảo tiêu đề luôn ở trên cùng */
}
.statistics-container {
  padding: 20px;
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
  margin-left: 260px;
}

.statistics-title {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  background: #b22222;
  color: white;
  padding: 15px;
  border-radius: 5px;
}

.statistics-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  background: white;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);

  justify-content: space-between;
}

.statistics-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
  background: white;
}

.statistics-table th, .statistics-table td {
  padding: 12px;
  border: 1px solid #ddd;
  text-align: center;
}

.statistics-table th {
  background: #b22222;
  color: white;
}

.summary-box p{
  font-size: 18px;
 
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background: white;
  padding: 20px;
}





.search-box {
  display: flex;
  align-items: center;
  background: #eee;
  padding: 5px;
  border-radius: 5px;
}

.icon {
  margin-right: 5px;
}

.statistics-summary {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

.summary-box {
  background: white;
  padding: 15px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}

.stat-content {
  display: flex;
  align-items: center;
}

.stat-number {
  font-size: 24px;
  color: #b22222;
  font-weight: bold;
  margin-right: 10px;
}

.stat-icon {
  font-size: 24px;
  color: #b22222;
}
.filter-btn, .detail-btn, .close-btn {
  background: #b22222;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}
.filter-btn:hover, .detail-btn:hover, .close-btn:hover {
  background: #8b1a1a;
}

</style>