<template>
  <div class="search-page container">
    <h2 class="search-title">Kết quả tìm kiếm cho: "{{ keyword }}"</h2>
    
    <div v-if="products.length > 0" class="product-grid">
      <div v-for="product in products" :key="product.SP_ma" class="product-card">
        <img :src="product.SP_hinh_anh" :alt="product.SP_ten" class="product-img" />
        <h3 class="product-name">{{ product.SP_ten }}</h3>
        <p class="product-price">{{ product.SP_price.toLocaleString() }} đ</p>
        <router-link :to="`/san-pham/${product.NPS_ma}`" class="view-detail">Xem chi tiết</router-link>
      </div>
    </div>

    <div v-else class="no-result">
      <p>Không tìm thấy sản phẩm nào phù hợp.</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      keyword: "",
      products: []
    };
  },
  created() {
    this.keyword = this.$route.query.q || "";
    this.fetchSearchResults();
  },
  watch: {
    '$route.query.q'(newQuery) {
      this.keyword = newQuery;
      this.fetchSearchResults();
    }
  },
  methods: {
    fetchSearchResults() {
      if (!this.keyword.trim()) return;

      axios
        .get(`http://localhost:5000/api/search?q=${this.keyword}`)
        .then(res => {
          this.products = res.data;
        })
        .catch(() => {
          this.products = [];
        });
    }
  }
};
</script>

<style scoped>
.search-page {
  padding: 2rem 0;
}
.search-title {
  font-size: 24px;
  margin-bottom: 1rem;
}
.product-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}
.product-card {
  width: 200px;
  border: 1px solid #ccc;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
}
.product-img {
  width: 100%;
  height: auto;
}
.product-name {
  margin-top: 0.5rem;
  font-weight: bold;
}
.product-price {
  color: red;
  margin: 0.5rem 0;
}
.view-detail {
  display: inline-block;
  margin-top: 0.5rem;
  background-color: #007bff;
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 4px;
  text-decoration: none;
}
.no-result {
  font-style: italic;
  color: gray;
}
</style>
