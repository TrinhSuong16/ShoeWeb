<template>
    <div id="sidebar" class="sidebar">
        <div class="sidebar__top">
            <div class="sidebar__logo">
                <img src="/src/assets/img/admin/avt1.jpg" alt="TCS" />
            </div>
            <div class="sidebar__user">
                <h3>Trịnh Chí Sương</h3>
            </div>
        </div>
        <div class="sidebar__body">
            <ul class="sidebar__menu">
                <li class="sidebar__item">
                    <RouterLink to="/admin" class="sidebar__link">
                        <div class="icon-wrapper">
                            <div class="icon-box">
                                <font-awesome-icon :icon="['fas', 'tachometer-alt']" class="icon" /> <!-- Tổng quan -->
                            </div>
                        </div>
                        <p class="sidebar__title">Tổng quan</p>
                    </RouterLink>
                </li>
                <li class="sidebar__item">
                    <RouterLink to="/admin/products" class="sidebar__link">
                        <div class="icon-wrapper">
                            <div class="icon-box">
                                  <font-awesome-icon :icon="['fas', 'box-open']" /> 
                            </div>
                        </div>                        
                        <p class="sidebar__title">Sản phẩm</p>
                    </RouterLink>
                </li>
                <li class="sidebar__item">
                    <RouterLink to="/admin/accounts" class="sidebar__link">
                        <div class="icon-wrapper">
                            <div class="icon-box">
                                <font-awesome-icon :icon="['fas', 'user']" class="icon"/>
                            </div>
                        </div>  
                        <p class="sidebar__title">Tài khoản</p>
                    </RouterLink>
                </li>
                <li class="sidebar__item">
                    <RouterLink to="/admin/orders" class="sidebar__link">
                        <div class="icon-wrapper">
                            <div class="icon-box">
                            <font-awesome-icon :icon="['fas', 'shopping-cart']" class="icon" />
                            </div>
                        </div>
                        <p class="sidebar__title">Đơn hàng</p>
                    </RouterLink>
                </li>
                <li class="sidebar__item">
                    <RouterLink to="/admin/statistics" class="sidebar__link">
                        <div class="icon-wrapper">
                            <div class="icon-box">
                              <font-awesome-icon :icon="['fas', 'chart-bar']" class="icon"/>
                            </div>
                        </div>
                        <p class="sidebar__title">Thống kê</p>
                    </RouterLink>
                </li>
            </ul>
        </div>
        <div class="sidebar__bottom">
            <RouterLink to="/home">
                 <button class="btn btn--home">Về trang chủ</button>
            </RouterLink>

            <div class="btn btn--logout"  @click="logout">
				Đăng xuất
			</div>
        </div>
    </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';

</script>

<script >
    export default {
  data() {
    return {
      user: null,
    };
  },
  methods: {
    // Xử lý đăng xuất
    logout() {
      localStorage.removeItem("user"); // Xóa thông tin user
      this.user = null;
      this.$router.push("/home/login"); // Chuyển hướng về trang đăng nhập
    },
  },
};
</script>

<style scoped>
.icon-box {
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.icon {
  font-size: 20px;
  color: #070707;
}
/* Sidebar */
.sidebar {
    width: 250px;
    background: #ebe1e1;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 20px;
}

/* Avatar & User */
.sidebar__top {
    text-align: center;
}
.sidebar__logo img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 3px solid #c10000;
}
.sidebar__user h3 {
    margin-top: 10px;
    font-size: 18px;
    font-weight: bold;
    color: #c10000;
}

/* Menu */
.sidebar__menu {
    width: 100%;
    list-style: none;
    padding: 0;
}
.sidebar__item {
    width: 100%;
}
.sidebar__link {
    display: flex;
    align-items: center;
    padding: 12px;
    text-decoration: none;
    color: black;
    font-size: 16px;
    transition: 0.3s;
}
.sidebar__link:hover {
    background: #c10000;
    color: white;
}
.sidebar__icon {
    width: 40px;
    text-align: center;
    font-size: 18px;
}

/* Bottom Buttons */
.sidebar__bottom {
    margin-top: auto;
    padding: 20px;
    width: 100%;
    text-align: center;
}
.btn {
    width: 90%;
    padding: 10px;
    border: none;
    font-size: 16px;
    cursor: pointer;
    margin-bottom: 10px;
    color: white;
}
.btn--home {
    background: #c10000;
}
.btn--logout {
    background: #c10000;
}
.btn:hover {
    opacity: 0.8;
}
.sidebar__title {
    font-weight: bold;
}
</style>

