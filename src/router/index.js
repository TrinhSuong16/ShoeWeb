import { createRouter, createWebHistory } from 'vue-router';
import AdminContent from '../components/adminpages/admincontent.vue';
import ShowProduct from '../components/adminpages/adminviews/adminprod.vue';
import ShowAcc from '../components/adminpages/adminviews/adminAcc.vue';
import ShowBill from '../components/adminpages/adminviews/adminbill.vue';
import ShowStatistic from '../components/adminpages/adminviews/adminstatistic.vue';
import Gioithieu from '../components/homepages/viewhome/gioithieu.vue';
import Main from '@/components/homepages/main.vue';
import Chonsize from '@/components/homepages/viewhome/chonsize.vue';
import LoginModal from '@/components/homepages/viewhome/LoginModal.vue';
import RegisterModal from '@/components/homepages/viewhome/RegisterModal.vue';
import groupprod from '@/components/homepages/viewhome/groupprod.vue';
import historyorder from '@/components/homepages/viewhome/historyorder.vue'
import account from '@/components/homepages/viewhome/account.vue';
import new_prod from '@/components/homepages/viewhome/new_prod.vue';
import buy1prod from '@/components/homepages/viewhome/buy1prod.vue';

const routes = [
        { path: '/', redirect: '/home' }, // Mặc định vào trang admin
        { path: '/home', component: Main },
        { path: '/home/gioithieu', component: Gioithieu },
        { path: '/home/chonsize', component: Chonsize},
        { path: '/home/login', component: LoginModal},
        { path: '/home/register', component: RegisterModal},
        { path: '/orders', component: historyorder},
        { path: '/account', component: account},

        { path: '/admin', component: AdminContent },
        { path: '/admin/products', component: ShowProduct },
        { path: '/admin/accounts', component: ShowAcc },
        { path: '/admin/orders', component: ShowBill },
        { path: '/admin/statistics', component: ShowStatistic },
        { path: '/san-pham/new_product', component: new_prod },
        {
          path: '/san-pham/:NPS_ma',
          name: 'Category',
          component: groupprod,
          props: true
        },
         { path: '/buy1prod', component: buy1prod },
         {
  path: "/product/:id",
  name: "ProductDetail",
  component: () => import("../components/homepages/viewhome/ProductDetail.vue.vue")
}


 ];


const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
