<template>
  <div class="topbar">
				<div class="container">
					<!-- tp = topbar -->
					<div class="tp-wp">
						<div class="tp__left">
							<div class="tp__left-hline">
								<i class="fa fa-phone tp__left-icon"></i>
								Hotline:
								<a href="tel:0123456789" class="tp__left-phone"
									>0123 456 789
								</a>
							</div>
						</div>
						<div class="tp__right">
							<div class="tp__right-nav">
								<ul class="tp__right-menu">
									<RouterLink to="/home/gioithieu" class="tp__right-item">
                        						<div class="tp__right-link">Giới thiệu</div>
                    				</RouterLink>
									<RouterLink to="/home/chonsize" class="tp__right-item">
                        						<div class="tp__right-link">Cách chọn size</div>
                    				</RouterLink>
								</ul>
							</div>
							<!-- topbar user -->
							<div class="tp-usr">
							<div class="tp-usr-wp">
							<span class="tp-usr-icon">
								<i class="fa fa-user"></i>
							</span>

							<div class="tp-usr-acc" v-if="user">
								<!-- Đã đăng nhập -->
								<div class="tp-usr-heading" @click="toggleDropdown">
								<h3 class="tp-usr-name">{{ user.NV_hoten || user.KH_hoten }}</h3>
								<i class="fa fa-angle-down"></i>
								</div>

								<div class="tp-usr-ls" v-if="dropdownOpen">
								<RouterLink v-if="user.role === 'admin'" to="/admin">
									<div class="tp-usr-item">Quản lý cửa hàng</div>
								</RouterLink>
								<RouterLink to="/account">
									<div class="tp-usr-item">Tài khoản của tôi</div>
								</RouterLink>
								<RouterLink to="/orders" v-if="user.role === 'customer'">
									<div class="tp-usr-item">Đơn hàng đã đặt</div>
								</RouterLink>
								<div class="tp-usr-item tp-usr-item--logout" @click="logout">
									Đăng xuất
								</div>
								</div>
							</div>

							<div v-else>
								<!-- Chưa đăng nhập -->
								<RouterLink to="/home/login">
								<button class="btn btn--primary tp-login">Đăng nhập</button>
								</RouterLink>
								<RouterLink to="/home/register">
								<button class="btn btn--secondary tp-register">Đăng ký</button>
								</RouterLink>
							</div>
							</div>
						</div>
						</div>
					</div>
				</div>
			</div>

		
</template>



<script>
export default {
  data() {
    return {
      user: null,
      dropdownOpen: false,
    };
  },
  mounted() {
    this.loadUser();
  },
  methods: {
    // Lấy thông tin user từ localStorage
    loadUser() {
      const userData = localStorage.getItem("user");
      if (userData) {
        this.user = JSON.parse(userData);
      }
    },
    // Toggle dropdown menu
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen;
    },
    // Xử lý đăng nhập (thêm vào trong component đăng nhập)
    handleLogin(response) {
      localStorage.setItem("user", JSON.stringify(response.user)); // Lưu thông tin user vào localStorage
      this.user = response.user; // Cập nhật dữ liệu
      window.location.reload(); // Reload trang để cập nhật giao diện
    },
    // Xử lý đăng xuất
    logout() {
      localStorage.removeItem("user"); // Xóa thông tin user
      this.user = null;
      window.location.reload(); // Reload trang để cập nhật giao diện về trạng thái chưa đăng nhập
    },
  },
};


</script>
