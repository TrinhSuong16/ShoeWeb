<template>
    <div id="content">
				<div class="slider">
					<div class="slider-wp">
						<i class="fa fa-angle-left slider-prev"></i>
						<div class="slider-main-wp">
							<div class="slider-main">
								<div class="slider-item">
									<img
										src="/src/assets/img/banner/banner-1.jpg"
										alt="Banner 1"
										class="slider-img"
									/>
								</div>
								<div class="slider-item">
									<img
										src="/src/assets/img/banner/banner-2.jpg"
										alt="Banner 2"
										class="slider-img"
									/>
								</div>
								<div class="slider-item">
									<img
										src="/src/assets/img/banner/banner-3.jpg"
										alt="Banner 3"
										class="slider-img"
									/>
								</div>
							</div>
						</div>
						<ul class="slider-dots">
							<li data-index="0" class="slider-dot-item active"></li>
							<li data-index="1" class="slider-dot-item"></li>
							<li data-index="2" class="slider-dot-item"></li>
						</ul>
						<i class="fa fa-angle-right slider-next"></i>
					</div>
				</div>
				<hot_product />
				<div class="category">
					<div class="container">
						<div class="category-wp">
							<div class="category-left">
								<div class="category-item">
									<!-- <a href="" class="category-link"> -->
									<img
										src="/src/assets/img/banner/category-polo.jpg"
										alt=""
										class="category-img"
									/>
									<!-- </a> -->
								</div>
							</div>
							<div class="category-mid">
								<div class="category-item">
									<!-- <a href="" class="category-link"> -->
									<img
										src="/src/assets/img/banner/category-middle.jpg"
										alt=""
										class="category-img"
									/>
									<!-- </a> -->
								</div>
							</div>
							<div class="category-right">
								<div class="category-item">
									<!-- <a href="" class="category-link"> -->
									<img
										src="/src/assets/img/banner/category-right.jpg"
										alt=""
										class="category-img"
									/>
									<!-- </a> -->
								</div>
							</div>
						</div>
					</div>
				</div>
				<sale_product/>
				<all_prod />
			</div>
</template>
<script setup>
import hot_product from './viewhome/hot_prod.vue';
import all_prod from './viewhome/all_prod.vue';
import sale_product from './viewhome/sale_product.vue';
</script>