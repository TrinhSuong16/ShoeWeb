<template>  
  <div class="order-container">  
    <h2 class="order-header">ĐƠN HÀNG CỦA SHOE TCS</h2>  
    <div class="order-filter-section">  
      <div class="order-filter-controls">  
        <label class="order-label">Lọc:</label>  
        <select class="order-select" v-model="statusFilter" @change="filterOrders">  
          <option value="all">Tất cả</option>  
          <option v-for="status in validStatuses" :key="status" :value="status">{{ status }}</option>  
        </select>  
        <label class="order-label">Từ:</label>  
        <input type="date" class="order-date" v-model="startDate" @change="filterOrders" />  
        <label class="order-label">Đến:</label>  
        <input type="date" class="order-date" v-model="endDate" @change="filterOrders" />  
      </div>  
    </div>  
    <div class="order-table-container">  
      <div class="order-table-scroll">  
        <table class="order-table">  
          <thead>  
            <tr>  
              <th>STT</th>  
              <th>Mã Đơn Hàng</th>  
              <th>Tên Khách Hàng</th>  
              <th>Điện Thoại</th>  
              <th>Ngày Mua</th>  
              <th>Địa Chỉ</th>  
              <th>Chi tiết đơn hàng</th>  
              <th>Trạng thái đơn hàng</th>  
            </tr>  
          </thead>  
          <tbody>  
            <tr v-for="(order, index) in filteredOrders" :key="order.DH_ma">  
              <td>{{ index + 1 }}</td>  
              <td>{{ order.DH_ma }}</td>  
              <td>{{ order.KH_hoten }}</td>  
              <td>{{ order.KH_sdt }}</td>  
              <td>{{ order.DH_orderdate }}</td>  
              <td>{{ order.DH_diachi }}</td>  
              <td>  
                <button class="btn-view" @click="viewOrder(order)">Xem chi tiết</button>  
              </td>  
              <td>  
                <select v-model="order.DH_trangthai" class="order-status-dropdown">  
                  <option v-for="status in validStatuses" :key="status" :value="status">  
                    {{ status }}  
                  </option>  
                </select>  
                <button class="btn-update" @click="updateOrderStatus(order)">Cập nhật</button>  
              </td>  
            </tr>  
          </tbody>  
        </table>  
      </div>  
    </div>  
    <div v-if="selectedOrder" class="order-detail">
      <h3>Chi tiết đơn hàng</h3>
      <h4>Sản phẩm:</h4>
      <ul>
        <li v-for="product in selectedOrder.products" :key="product.SP_ma" class="product-item">
          {{ product.SP_ten }} - Số lượng: {{ product.soluong }}
        </li>
      </ul>
      <button @click="closeDetails">Đóng</button>
    </div>
  </div>  
 
</template>  

<script>  
import axios from 'axios';  

export default {  
  data() {  
    return {  
      statusFilter: "all", // Giá trị mặc định của bộ lọc là 'Tất cả'  
      startDate: "",  
      endDate: "",  
      orders: [],  
      filteredOrders: [],  
            selectedOrder: null,
      validStatuses: [  
        'Chưa xử lý',   
        'Đã xử lý',   
        'Chờ vận chuyển',   
        'Đang vận chuyển',   
        'Đã giao',   
        'Đã đóng hàng',   
        'Chờ nhận hàng'  
      ]  
    };  
  },  
  methods: {  
    
    viewOrder(order) {
      this.selectedOrder = order;
    },
    closeDetails() {
      this.selectedOrder = null;
    },
    async fetchOrders() {  
      try {  
        const response = await axios.get('http://localhost:5000/api/orders');  
        this.orders = await Promise.all(response.data.map(async (order) => {  
          // Gọi API để lấy trạng thái đơn hàng  
          const statusResponse = await axios.get(`http://localhost:5000/order-status/${order.DH_ma}`);  
          const orderStatus = statusResponse.data.status || 'Chưa xử lý'; // Giá trị mặc định nếu không có  

          return {  
            ...order,  
            DH_trangthai: orderStatus // Cập nhật trạng thái từ API  
          };  
        }));  
        this.filterOrders();  
      } catch (error) {  
        console.error("Lỗi khi lấy dữ liệu đơn hàng:", error);  
      }  
    },  
    filterOrders() {  
      this.filteredOrders = this.orders.filter(order => {  
        const matchesStatus = this.statusFilter === "all" || order.DH_trangthai === this.statusFilter;  
        const orderDate = new Date(order.DH_orderdate);  
        const start = this.startDate ? new Date(this.startDate) : null;  
        const end = this.endDate ? new Date(this.endDate) : null;  
        const matchesDate = (!start || orderDate >= start) && (!end || orderDate <= end);  
        return matchesStatus && matchesDate;  
      });  
    },  
    async updateOrderStatus(order) {  
      try {  
        const response = await axios.put('http://localhost:5000/api/orders/update-status', {  
          orderId: order.DH_ma,  
          newStatus: order.DH_trangthai  
        });  

        if (response.data.success) {  
          alert("Cập nhật trạng thái thành công!");  
        } else {  
          alert("" + response.data.message);  
        }  
      } catch (error) {  
        console.error("Lỗi khi cập nhật trạng thái:", error);  
        alert("Có lỗi xảy ra khi cập nhật!");  
      }  
    }  
  },  
  processOrder(order) {
      order.processed = true;
      const storedOrders = JSON.parse(localStorage.getItem('processedOrders')) || {};
      storedOrders[order.DH_ma] = true;
      localStorage.setItem('processedOrders', JSON.stringify(storedOrders));
      this.filterOrders();
    }
  ,
  mounted() {  
    this.fetchOrders();  
  }  
};  
</script>  




<style>
.order-status-dropdown {
  margin-right: 10px;
}
.btn-update {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 5px;
}
.btn-update:hover {
  background-color: #218838;
}
.order-container {
  padding: 20px;
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
  margin-left: 260px; 
}
.order-header {
  background: #b22222;
  color: white;
  padding: 10px;
  text-align: center;
  border-radius: 5px;
}
.order-filter-section {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}
.order-filter-controls {
  display: flex;
  align-items: center;
}
.order-label {
  margin: 0 5px;
  font-weight: bold;
}
.order-select, .order-date, .order-search-input {
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
}
.order-search-input {
  width: 200px;
}


.order-detail {
  margin-top: 20px;

  padding: 20px;
  border: 1px solid #ddd;
  background-color: #cbc7c7;
  font-size: 20px;
  font-weight: bold;
}
.order-detail h4{
    margin-top: 20px;

}
.order-detail button{
    margin-top: 10px;
    background-color: #e4b4b4;
}
.product-item {
    margin-top: 20px;
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 5px;
}
.order-table-container {
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
}
.order-table-scroll {
  overflow-y: auto;
  max-height: 350px;
}
.btn-process.processed {
  background-color: #28a745;
}




.order-table {
  width: 100%;
  border-collapse: collapse;
}
.order-table th, .order-table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}
.order-table th {
  background: #b22222;
  color: white;
}
.btn-view {
  background: #b22222;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.btn-view:hover {
  background: #a01e1e;
}
.orders-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.orders-box {
  width: 80%;
  max-width: 1200px;
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
}

.orders-table th,
.orders-table td {
  text-align: center;
  padding: 10px;
  border: 1px solid #ddd;
}

.orders-table th {
  background-color: #b71c1c;
  color: white;
}

.search-bar {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}
.order-container {
  padding: 20px;
}
.order-header {
  text-align: center;
  margin-bottom: 20px;
}
.order-filter-section {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.order-filter-controls, .order-search {
  display: flex;
  align-items: center;
  gap: 10px;
}
.order-table {
  width: 100%;
  border-collapse: collapse;
}
.order-table th, .order-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}
.btn-view, .btn-process {
  background-color: #007bff;
  color: white;
  padding: 5px 10px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  margin-right: 5px;
}
.btn-process {
  background-color: #28a745;
}
.btn-view:hover {
  background-color: #0056b3;
}
.btn-process:hover {
  background-color: #218838;
}
.order-detail {
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
}
</style>
