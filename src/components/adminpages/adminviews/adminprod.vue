<template>  
  <div class="container">  
    <h1 class="header">TỔNG SẢN PHẨM CỦA SHOE TCS</h1>  

    <div class="toolbar">  
      <select v-model="selectedCategory">  
        <option value="tất cả">Tất cả</option>  
        <option v-for="cate in categories" :key="cate" :value="cate.toLowerCase()">  
          {{ cate }}  
        </option>  
      </select>  

      <input v-model="searchQuery" placeholder="Tìm kiếm sản phẩm..." />  
      <button @click="openAddForm" class="btn btn-add">+ Thêm sản phẩm</button>  
      <button @click="openAddStock" class="btn btn-add">+ Thêm số lượng</button>  
    </div>  

    <div class="product-list">  
      <form>  
        <div v-for="product in filteredProducts" :key="product.SP_ma" class="product-item">  
          <img :src="getImageSrc(product.SP_hinh_anh)" alt="Hình ảnh sản phẩm" />  
          <h3>{{ product.SP_ten }}</h3>  
          <p>Giá: {{ product.SP_price }} đ</p>  
          <p>Size: {{ product.SP_size }}</p>  
          <p>Màu sắc: {{ product.SP_color }}</p>  
          
          <button @click.prevent="editProduct(product)" class="btn btn-edit">Chỉnh sửa</button>  
          <button @click.prevent="deleteProduct(product.SP_ma)" class="btn btn-delete">Xóa</button>  
        </div>  
      </form>  
    </div>  

    <!-- Form Thêm Sản Phẩm -->  
    <div v-if="showAddForm" class="modal">  
      <div class="modal-content">  
        <span class="close" @click="showAddForm = false">&times;</span>  
        <h2>Thêm sản phẩm</h2>  
        <input v-model="newProduct.SP_ten" placeholder="Tên sản phẩm" />  
        <input v-model="newProduct.SP_price" placeholder="Giá sản phẩm" type="number" />  
        <input v-model="newProduct.SP_size" placeholder="Size" />  
        <input v-model="newProduct.SP_color" placeholder="Màu sắc" />  
        <select v-model="newProduct.NPS_ma">  
          <option v-for="cate in categories" :key="cate" :value="cate">{{ cate }}</option>  
        </select>  
        <input type="file" @change="handleImage" />  
        <button @click="addProduct" class="btn-save">Lưu</button>  
      </div>  
    </div>  

    <!-- Form Thêm Kho Sản Phẩm -->
<div v-if="showAddStockForm" class="modal">
  <div class="modal-content">
    <span class="close" @click="showAddStockForm = false">&times;</span>
    <h2>Thêm Số Lượng Kho</h2>
    <input v-model="stockSearchQuery" placeholder="Tìm kiếm sản phẩm..." @input="filterStockProducts" />
    
    <!-- Hiển thị danh sách gợi ý sản phẩm liên quan đến từ khóa tìm kiếm -->
    <div class="product-suggestions" v-if="filteredStockProducts.length">
      <ul class="suggestions-list">
        <li v-for="product in filteredStockProducts" :key="product.SP_ma" @click="selectProduct(product)">
          {{ product.SP_ten }}
        </li>
      </ul>
    </div>
    
    <!-- Hiển thị số lượng kho -->
    <input v-model.number="stockQuantity" placeholder="Số lượng" type="number" @input="validateStockQuantity" />
    <button @click="addStock" class="btn-save">Thêm</button>
  </div>
</div>


    <!-- Form Chỉnh Sửa Sản Phẩm -->  
    <div v-if="showEditForm" class="modal">  
      <div class="modal-content">  
        <span class="close" @click="showEditForm = false">&times;</span>  
        <h2>Chỉnh sửa sản phẩm</h2>  
        <input v-model="newProduct.SP_ten" placeholder="Tên sản phẩm" />  
        <input v-model="newProduct.SP_price" placeholder="Giá sản phẩm" type="number" />  
        <input v-model="newProduct.SP_size" placeholder="Size" />  
                <input v-model="newProduct.SP_color" placeholder="Màu sắc" />  
        <select v-model="newProduct.NPS_ma">  
          <option v-for="cate in categories" :key="cate" :value="cate">{{ cate }}</option>  
        </select>  
        <input type="file" @change="handleImage" />  
        <button @click="updateProduct" class="btn btn-save">Cập nhật</button>  
      </div>  
    </div>  
  </div>  
</template>  

<script>  
import axios from "axios";  

export default {  
  data() {  
    return {  
      products: [],  
      showAddForm: false,  
      showAddStockForm: false,  
      showEditForm: false,  
      searchQuery: "",  
      stockSearchQuery: "", // Biến lưu giá trị tìm kiếm trong form thêm kho  
      selectedCategory: "tất cả",  
      newProduct: {  
        SP_ten: "",  
        SP_price: "",  
        SP_size: "",  
        SP_color: "",  
        NPS_ma: "",  
        SP_hinh_anh: null,  

      },  
      stockQuantity: 0,  
      selectedProduct: "",  
      categories: ["N01", "N02", "N03", "N04", "N05", "N06", "N07", "N08", "N09", "N10", "N11", "N12"],  
    };  
  },  
  computed: {  
    filteredProducts() {  
      return this.products.filter((product) => {  
        const matchesSearch = product.SP_ten.toLowerCase().includes(this.searchQuery.toLowerCase());  
        const matchesCategory = this.selectedCategory === "tất cả" || product.NPS_ma.toLowerCase() === this.selectedCategory;  
        return matchesSearch && matchesCategory;  
      });  
    },  
    filteredStockProducts() {  
      // Lọc danh sách sản phẩm theo từ khóa tìm kiếm trong ô tìm kiếm kho  
      return this.products.filter((product) => {  
        return product.SP_ten.toLowerCase().includes(this.stockSearchQuery.toLowerCase());  
      });  
    }  
  },  
  mounted() {  
    this.fetchProducts();  
  },  
  methods: {  
    async fetchProducts() {  
      try {  
        const response = await axios.get("http://localhost:5000/api/products");  
        this.products = response.data;  
      } catch (error) {  
        console.error("Lỗi lấy danh sách sản phẩm:", error);  
      }  
    },  
    getImageSrc(base64) {  
      return base64 && base64.startsWith("data:image") ? base64 : "https://via.placeholder.com/100";  
    },  
    editProduct(product) {  
      this.newProduct = { ...product };  
      this.showEditForm = true;  
    },  
    async deleteProduct(productId) {  
      if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {  
        try {  
          await axios.delete(`http://localhost:5000/api/san_pham/${productId}`);  
          alert("Xóa sản phẩm thành công!");  
          this.fetchProducts();  
        } catch (error) {  
          console.error("Lỗi xóa sản phẩm:", error);  
        }  
      }  
    },  
    openAddForm() {  
      this.showAddForm = true;  
    },  
    openAddStock() {  
      this.showAddStockForm = true;  
    },  
    async addProduct() {  
      try {  
        const response = await axios.post("http://localhost:5000/api/san_pham", this.newProduct);  
        alert(response.data.message);  
        this.fetchProducts();  
        this.showAddForm = false;  
      } catch (error) {  
        console.error("Lỗi thêm sản phẩm:", error);  
        alert("Lỗi thêm sản phẩm!");  
      }  
    },  
    async addStock() {  
      if (!this.selectedProduct || this.stockQuantity <= 0) {  
        alert("Vui lòng chọn sản phẩm và nhập số lượng hợp lệ!");  
        return;  
      }  
      try {  
        const response = await axios.post("http://localhost:5000/api/them-kho", {  
          SP_ma: this.selectedProduct,  
          so_luong: this.stockQuantity,  
        });  
        alert(response.data.message);  
        this.showAddStockForm = false;  
        this.fetchProducts();  
      } catch (error) {  
        console.error("Lỗi thêm số lượng vào kho:", error);  
        alert("Lỗi khi thêm số lượng vào kho!");  
      }  
    },  
    async updateProduct() {  
      try {  
                const response = await axios.put(`http://localhost:5000/api/san_pham/${this.newProduct.SP_ma}`, this.newProduct);  
        alert(response.data.message);  
        this.fetchProducts();  
        this.showEditForm = false;  
      } catch (error) {  
        console.error("Lỗi cập nhật sản phẩm:", error);  
        alert("Cập nhật sản phẩm thất bại!");  
      }  
    },  
    handleImage(event) {  
      const file = event.target.files[0];  
      if (file) {  
        const reader = new FileReader();  
        reader.readAsDataURL(file);  
        reader.onload = () => {  
          this.newProduct.SP_hinh_anh = reader.result;  
        };  
      }  
    },  
    filterStockProducts() {  
      // Tự động gọi phương thức computed để lọc các sản phẩm dựa trên từ khóa tìm kiếm  
      this.filteredStockProducts;   
    },  
    selectProduct(product) {  
      this.selectedProduct = product.SP_ma; // Gán sản phẩm đã chọn vào biến selectedProduct  
      this.stockSearchQuery = product.SP_ten; // Cập nhật ô tìm kiếm với tên sản phẩm đã chọn  
    },  
     validateStockQuantity() {  
      if (this.stockQuantity < 0) {  
        this.stockQuantity = 0;  
      }  
    },  
    filterStockProducts() {  
      this.filteredStockProducts;    
    },  
  },  
};  
</script>  

<style scoped>
.container {
  padding: 20px;
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
  margin-left: 260px;
  height: 800px; /* hoặc giá trị phù hợp */
  overflow-y: auto;
  width: 100%;
}
.header {
  background: #b41d1d;
  color: white;
  text-align: center;
  padding: 15px;
  font-size: 24px;
}
.filter-bar {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
}
.product-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.product-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 5px;
}
.product-img {
  width: 50px;
  height: 50px;
}
.product-actions button {
  margin-left: 5px;
  padding: 5px 10px;
}
.modal {
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
.modal-content {
  background: white;
  padding: 20px;
  width: 400px;
  border-radius: 10px;
}

.toolbar {
    background-color: #f8f8f8;
    padding: 15px;
    border-radius: 10px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 10px;
}

.toolbar select {
    padding: 8px 12px;
    border-radius: 5px;
    border: 1px solid #ccc;
    background-color: white;
    font-size: 14px;
    font-weight: bold;
}

.toolbar input {
    border: none;
    background-color: #ccc;
    padding: 8px 12px;
    border-radius: 5px;
    font-size: 14px;
    width: 200px;
    outline: none;
}

.toolbar input::placeholder {
    color: #666;
}

.toolbar .btn-add {
    background-color: #b22222;
    color: white;
    font-weight: bold;
    padding: 8px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s;
}

.toolbar .btn-add:hover {
    background-color: #8b0000;
}
/* Tạo nền mờ khi hiển thị modal */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Khung modal chính */
.modal-content {
  background: white;
  width: 600px;
  max-width: 90%;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
  position: relative;
}

/* Nút đóng */
.close {
  position: absolute;
  top: 15px;
  right: 20px;
  font-size: 24px;
  cursor: pointer;
}

/* Tiêu đề */
.modal-content h2 {
  text-align: center;
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 20px;
}

/* Ô nhập liệu */
.modal-content input,
.modal-content select {
  width: calc(100% - 20px);
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}

/* Input file */
.modal-content input[type="file"] {
  border: none;
}

/* Nút chọn hình ảnh */
.btn-upload {
  display: block;
  width: 100%;
  background: #b71c1c;
  color: white;
  text-align: center;
  padding: 10px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  border: none;
  margin-top: 10px;
}

.btn-upload:hover {
  background: #880e0e;
}

/* Nút lưu */
.btn-save {
  display: block;
  width: 100%;
  background: #b71c1c;
  color: white;
  text-align: center;
  padding: 10px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  border: none;
  margin-top: 10px;
}

.btn-save:hover {
  background: #880e0e;
}

/* Chia cột cho input */
.modal-content .input-group {
  display: flex;
  justify-content: space-between;
}

.modal-content .input-group input {
  width: 48%;
}

.product-list {
  display: block;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px;
  background-color: #f1dada; /* Light gray background */
   overflow-y: scroll;
   height: 600px; /* Thiết lập chiều cao cố định */
  overflow-y: scroll; /* Bật thanh cuộn dọc */
  border: 1px solid #ccc; /* Thêm viền để phân biệt */
  margin-top: 20px; /* Thêm khoảng cách với header */
}
.product-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background: #fff;
  margin-bottom: 10px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-item:hover {
  transform: scale(1.02);
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.product-item img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}

.product-item h3 {
  font-size: 18px;
  margin: 0;
  color: #333;
}

.product-item p {
  margin: 5px 0;
  font-size: 14px;
  color: #555;
}

.product-actions {
  margin-left: auto;
  display: flex;
  gap: 10px;
}

.btn {
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.btn-edit {
  background: #007bff;
  color: white;
}

.btn-edit:hover {
  background: #0056b3;
}

.btn-delete {
  background: #dc3545;
  color: white;
}

.btn-delete:hover {
  background: #b02a37;
}

.product-suggestions {
  max-height: 200px;
  overflow-y: auto;
  margin-top: 10px;
  background-color: #f8f8f8;
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #ddd;
}

.suggestions-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.suggestions-list li {
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.suggestions-list li:hover {
  background-color: #f1f1f1;
}

</style>

