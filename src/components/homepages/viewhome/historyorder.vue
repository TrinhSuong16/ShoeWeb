<template>
  <h2 class="text-2xl font-bold mb-4 text-center">Lịch Sử Đơn Hàng</h2>
  <div class="max-w-4xl mx-auto p-6">
    <div v-if="loading" class="text-center">Đang tải...</div>
    <div v-else-if="orders.length === 0" class="text-center text-gray-500">Không có đơn hàng nào.</div>

    <!-- Thêm class orders-container để tạo thanh cuộn -->
    <div v-else class="orders-container space-y-4">
      <div
        v-for="order in orders"
        :key="order.DH_ma"
        class="border border-gray-300 rounded-lg p-4 bg-white shadow-lg">
        <div class="flex justify-between items-center">
          <div>
            <p class="font-semibold">Mã đơn: {{ order.DH_ma }}</p>
            <p>Ngày đặt: {{ formatDate(order.DH_orderdate) }}</p>
            <p>Giá trị: <span class="font-bold text-blue-600">{{ formatPrice(order.DH_totalprice) }}</span></p>
            <p class="font-semibold">Trạng thái: {{ order.DH_trangthai }}</p>
          </div>
          <button
            class="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
            @click="toggleDetails(order.DH_ma)"
          >
            {{ order.showDetails ? 'Ẩn' : 'Xem' }} chi tiết
          </button>
        </div>

        <div v-if="order.showDetails" class="mt-3 bg-gray-100 p-3 rounded-lg">
          <p class="font-semibold">Địa chỉ: {{ order.DH_diachi }}</p>
          <p>Thanh toán: {{ order.DH_thanhtoan }}</p>

          <h4 class="mt-2 font-semibold">Chi tiết sản phẩm:</h4>
          <ul class="list-disc list-inside">
            <li v-for="product in order.chitiet" :key="product.SP_ma">
              Mã sản phẩm: <strong>{{ product.SP_ma }}</strong> - Số lượng: <strong>{{ product.soluong }}</strong>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      orders: [],
      loading: true,
    };
  },
  methods: {
    // Phương thức lấy lịch sử đơn hàng
    async fetchOrders() {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        // Kiểm tra xem có thông tin người dùng trong localStorage không
        if (!user || !user.KH_ma) {
          console.error("Không tìm thấy mã khách hàng trong localStorage!");
          return;
        }

        const KH_ma = user.KH_ma;

        // Lấy lịch sử đơn hàng của khách hàng theo KH_ma
        const response = await axios.get(`http://localhost:5000/history/${KH_ma}`); // API sử dụng backtick

        // Cập nhật danh sách đơn hàng với chi tiết ẩn ban đầu
        this.orders = response.data.orders.map(order => ({
          ...order,
          showDetails: false, // Mặc định ẩn chi tiết
        }));
      } catch (error) {
        console.error("Lỗi khi lấy đơn hàng:", error);
      } finally {
        this.loading = false;
      }
    },

    // Phương thức toggle chi tiết đơn hàng
    toggleDetails(orderId) {
      this.orders = this.orders.map(order =>
        order.DH_ma === orderId ? { ...order, showDetails: !order.showDetails } : order
      );
    },

    // Định dạng ngày tháng
    formatDate(date) {
      return new Date(date).toLocaleDateString("vi-VN");
    },

    // Định dạng giá
    formatPrice(price) {
      return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
    }
  },
  mounted() {
    // Khi component được mount, lấy lịch sử đơn hàng
    this.fetchOrders();
  }
};
</script>



<style scoped>

.max-w-4xl {
  max-width: 1000px; /* Điều chỉnh chiều rộng */
  
  margin:  auto;
  background: #f9f4f4; /* Màu nền giống popup giỏ hàng */
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Tiêu đề */
h2 {
  text-align: center;
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

/* Bọc danh sách đơn hàng để tạo thanh cuộn */
.orders-container {
    display: flex;
    flex-wrap: wrap;
    max-height: 800px; /* Hoặc thử bỏ max-height */
    overflow-y: scroll; /* Luôn hiển thị thanh cuộn */
    position: relative; /* Đảm bảo phần tử nằm đúng vị trí */
}

/* Tùy chỉnh thanh cuộn */
.orders-container::-webkit-scrollbar {
  width: 6px;
}

.orders-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.orders-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.orders-container::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Đơn hàng */
.border {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  background: white;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.border:hover {
  transform: scale(1.02);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

/* Thông tin đơn hàng */
.font-semibold {
  font-weight: 600;
  color: #222;
  margin-bottom: 4px;
}

.text-blue-600 {
  color: #e60000; /* Đổi sang màu đỏ như giỏ hàng */
  font-weight: bold;
}

/* Nút bấm */
button {
  padding: 6px 12px;
  background: #e60000; /* Màu đỏ như nút xóa */
  color: white;
  font-size: 14px;
  border-radius: 6px;
  transition: background 0.3s;
}

button:hover {
  background: #c40000;
}

/* Nút thanh toán */
.btn-pay {
  background: #008000; /* Màu xanh như nút Thanh Toán */
  padding: 8px 16px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 6px;
}

.btn-pay:hover {
  background: #006600;
}

/* Chi tiết đơn hàng */
.bg-gray-100 {
  background: #f9fafb;
  padding: 10px;
  border-radius: 8px;
  margin-top: 8px;
}

/* Danh sách sản phẩm */
.list-inside {
  list-style: none;
  padding-left: 0;
  display :flex;
}

.list-inside li {
  background: #f5f5f5;
  padding: 8px;
  border-radius: 6px;
  margin-bottom: 5px;
  font-size: 14px;
}

.list-inside li strong {
  color: #222;
}

</style>

