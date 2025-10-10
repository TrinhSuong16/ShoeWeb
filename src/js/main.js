// *** LẤY PRODUCT TỪ LOCALSTORAGE
let products = JSON.parse(localStorage.getItem('products')).filter(
	(item) => item.isBusiness
);
// *** SLIDER
const slider = document.querySelector('.slider');
if (slider) {
	const sliderMain = document.querySelector('.slider-main');
	const sliderItems = document.querySelectorAll('.slider-item');
	const dots = document.querySelectorAll('.slider-dot-item');
	const nextBtn = document.querySelector('.slider-next');
	const prevBtn = document.querySelector('.slider-prev');
	const lenItems = sliderItems.length;
	const sliderItemWidth = sliderItems[0].offsetWidth;
	let active = 0;
	let posX = 0;
	//
	//
	function handleChangeSlide(direction) {
		if (direction === 1) {
			if (active >= lenItems - 1) {
				// active = lenItems - 1;
				active = 0;
				posX = 0;
				sliderMain.style = `transform: translateX(${posX}px)`;
				activeDot();
				return;
			}
			posX -= sliderItemWidth;
			sliderMain.style = `transform: translateX(${posX}px)`;
			active++;
		} else if (direction === -1) {
			if (active <= 0) {
				// active = 0;
				active = lenItems - 1;
				posX = -1 * active * sliderItemWidth;
				sliderMain.style = `transform: translateX(${posX}px)`;
				activeDot();
				return;
			}
			posX += sliderItemWidth;
			sliderMain.style = `transform: translateX(${posX}px)`;
			active--;
		}
		activeDot();
	}
	nextBtn.addEventListener('click', () => {
		clearInterval(myInterval);
		handleChangeSlide(1);
		myInterval = setInterval(handleAutoChangeSlide, 4000);
	});
	//
	prevBtn.addEventListener('click', () => {
		clearInterval(myInterval);
		handleChangeSlide(-1);
		myInterval = setInterval(handleAutoChangeSlide, 4000);
	});
	//
	//
	function handleAutoChangeSlide() {
		if (active >= lenItems - 1) {
			active = 0;
			posX = -1 * active * sliderItemWidth;
			sliderMain.style = `transform: translateX(${posX}px)`;
			activeDot();
		} else handleChangeSlide(1);
	}
	//Auto change slide
	let myInterval = setInterval(handleAutoChangeSlide, 4000);
	//
	[...dots].forEach((dot) => {
		dot.addEventListener('click', (e) => {
			[...dots].forEach((dot) => dot.classList.remove('active'));
			e.target.classList.add('active');
			const indexSlide = parseInt(e.target.dataset.index);
			active = indexSlide;
			posX = -1 * active * sliderItemWidth;
			sliderMain.style = `transform: translateX(${posX}px)`;
			//
			clearInterval(myInterval);
			myInterval = setInterval(handleAutoChangeSlide, 4000);
		});
	});

	// Add active dot
	function activeDot() {
		[...dots].forEach((dot) => dot.classList.remove('active'));
		dots[active].classList.add('active');
	}
}
// *** HTML HIỆN SẢN PHẨM
let mainApp = `
	<div id="main-product">
		<div class="filter">
			<div class="container">
				<div class="filter-wp">
					<div class="filter-nav">
						<h2 class="filter-heading">HÀNG MỚI VỀ</h2>
						<div class="filter-more">
							<div class="filter-price">
								<div class="filter-title">
									<h3>Lọc theo giá</h3>
									<i class="fa fa-angle-down"></i>
								</div>
								<div class="filter-body">
									<ul class="filter-ls">
										<li class="filter-opt">
											<div id="priceDefault" onclick="priceDefault()" class="filter-opt-link"
											>Mặc định</div
											>
										</li>
										<li id="priceDecrease" onclick="priceDecrease()" class="filter-opt">
											<div class="filter-opt-link"
												>Cao đến thấp</div
											>
										</li>
										<li class="filter-opt">
											<div id="priceIncrease" onclick="priceIncrease()" class="filter-opt-link"
												>Thấp đến cao</div
											>
										</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	<!-- -->
	<!-- SEPARATE LINE -->
	<!-- -->
		<div class="separate">
			<div class="container">
				<div class="separate-main"></div>
			</div>
		</div>
		<!-- -->
		<!-- PRODUCT -->
		<!-- -->
		<div class="product">
			<div class="container">
				<div class="product-wp">
					<div class="product-ls">
						
					</div>
				</div>
			</div>
		</div>
		<!-- -->
		<!-- PANIGATION -->
		<!-- -->
		<div class="panigation">
			<div class="container">
				<div class="panigation-wp">
					<div class="panigation-list">
					</div>
				</div>
			</div>
		</div>
	</div>
`;
let content = document.getElementById('content');
//
//	*** MODAL
const modal = document.querySelector('#modal');
const modalBody = document.querySelector('.modal__body');
const btnCloseModal = document.querySelector('.modal__close');
//
//
const newProductsContainer = document.querySelector('.products-new-list');
const hotProductsContainer = document.querySelector('.products-hot-list');
const bestSellerProductsContainer = document.querySelector(
	'.products-best-seller-list'
);
if (
	newProductsContainer &&
	hotProductsContainer &&
	bestSellerProductsContainer
) {
	// tổng hàng mới về
	let newProductsList = products.filter((item) => item.newItem);
	// GET 4 sản phẩm mới về
	let newProductsListSub = newProductsList.splice(0, 4);
	// tổng hàng hot
	let hotProductsList = products.filter((item) => item.hotItem);
	let hotProductsListSub = hotProductsList.splice(0, 4);
	// tổng hàng bán chạy
	let bestSellerProductsList = products.filter((item) => item.bestSellerItem);
	let bestSellerProductsListSub = bestSellerProductsList.splice(0, 4);
	//
	// hiển thị sản phẩm trang chủ
	renderProducts(newProductsListSub, newProductsContainer);
	renderProducts(hotProductsListSub, hotProductsContainer);
	renderProducts(bestSellerProductsListSub, bestSellerProductsContainer);
}
// *** INTRODUCE
function showIntroduce() {
	content.innerHTML = `<div class="intro">
	<div class="container">
		<div class="intro-wp">
			<h2 class="intro-heading">Giới thiệu SHOE TCSTCS</h2>
			<p class="intro-content">
				Thương hiệu Giày SHOE TCSTCS được thành lập từ tháng
				10 năm 2023, là thương hiệu thời trang uy tín hàng đầu
				tại Việt Nam dành riêng cho phái mạnh.
			</p>
			<h3 class="intro-title">SỨ MỆNH</h3>
			<p class="intro-content">
				Không ngừng sáng tạo và tỉ mỉ từ công đoạn sản xuất đến
				các khâu dịch vụ, nhằm mang đến cho Quý Khách Hàng những
				trải nghiệm mua sắm đặc biệt nhất: sản phẩm chất lượng -
				dịch vụ hoàn hảo - xu hướng thời trang mới mẻ và tinh
				tế. Thông qua các sản phẩm thời trang, SHOE TCS luôn mong
				muốn truyền tải đến bạn những thông điệp tốt đẹp cùng
				với nguồn cảm hứng trẻ trung và tích cực.
			</p>
			<h3 class="intro-title">TẦM NHÌN</h3>
			<p class="intro-content">
				Với mục tiêu xây dựng và phát triển những giá trị bền
				vững, trong những năm tới, SHOE TCS sẽ trở thành thương hiệu
				dẫn đầu về thời trang phái mạnh trên thị trường Việt
				Nam.
			</p>
			<h3 class="intro-title">THÔNG ĐIỆP SHOE TCS GỬI ĐẾN BẠN</h3>
			<p class="intro-content">
				SHOW TCS muốn truyền cảm hứng tích cực đến mọi ngườingười:
				Việc mặc đẹp rất quan trọng, nó thể hiện được cá tính,
				sự tự tin và cả một phần lối sống, cách suy nghĩ của bản
				thân. Mặc thanh lịch, sống thanh lịch.
			</p>
			<h3 class="intro-title">
				Chọn SHOE TCS, bạn đang lựa chọn sự hoàn hảo cho điểm nhấn
				thời trang của chính mình!
			</h3>
		</div>
	</div>
</div>`;
}
// *** SIZECHART
function showSizeChart() {
	content.innerHTML = `<div class="szchart">
	<div class="container">
		<div class="szchart-wp">
			<h2 class="szchart-heading">Hướng dẫn chọn size</h2>
			<p class="szchart-content">
				Nếu bạn băn khoăn không biết chọn size nào cho phù hợp
				với cân nặng và chiều cao của mình, đừng lo lắng! Hãy
				xem bảng hướng dẫn chọn size bên dưới mà SHOE TCS tư vấn
				riêng dành cho bạn
			</p>
			<img src="./assets/img/chart3.jpg" alt="Size chart giày" />
			<p class="szchart-content">
				Bảng hướng dẫn chọn size trên là bảng hướng dẫn dựa trên
				kinh nghiệm nhiều năm của SHOe TCS theo khảo sát nhu cầu sở
				thích của khách hàng, tất nhiên sẽ không tuyệt đối, sẽ
				có những trường hợp ngoại lệ phụ thuộc theo vóc dáng, sở
				thích của từng người. Ví dụ có người thích mặc ôm, có
				người thích mặc rộng... Nếu bạn vẫn còn có những mắc
				thắc và băn khoăn cần được giải đáp? Hãy liên hệ ngay
				với Bộ phận Chăm sóc khách hàng của SHOE TCS qua Hotline
				(08)444 444 44 để được hỗ trợ thêm.
			</p>
		</div>
	</div>
</div>`;
}
//
// menu con
const subCategoryItems = document.querySelectorAll('.nb__center-sub-link');
const mobileSubCategoryItems = document.querySelectorAll('.mn-sub-link');
// menu cha
const categoryItems = document.querySelectorAll('.nb__center-link');
const mobileCategoryItems = document.querySelectorAll('.mn-link');
//
const btnLogin = document.querySelector('.tp-login');
const btnSearch = document.querySelector('.nb__right-btn-search');
const btnPay = document.querySelector('.nb__right-cart-btn-pay');
//
const search = document.querySelector('.nb__right-search');
const searchInput = document.querySelector('.nb__right-form-inp');

//
const cart = document.querySelector('.nb__right-cart');
//
const tpUser = document.querySelector('.tp-usr');
const tpUserName = document.querySelector('.tp-usr-name');
const tpUserLs = document.querySelector('.tp-usr-ls');
//
let productsCategoryNow = []; // sp trên của danh mục hiện tai
//
// thanh toán
btnPay.addEventListener('click', () => {
	let currentAccount = JSON.parse(localStorage.getItem('currentAccount'));
	if (currentAccount) {
		showModalPay();
	} else {
		toast({
			title: 'Không thể thanh toán',
			message: 'Hãy đăng nhập để thanh toán',
			type: 'warning',
			duration: 3000,
		});
	}
});

//
btnLogin.addEventListener('click', showModalLogin);
//
btnCloseModal.addEventListener('click', handleHideModal);
//
//
// *** LOGIN
function login() {
	let accounts = JSON.parse(localStorage.getItem('accounts'));
	//
	const userName = document.querySelector('#username');
	const password = document.querySelector('#password');
	//
	if (userName.value.trim() && password.value.trim()) {
		//true/false
		let checkLogin = accounts.some(
			(acc) =>
				acc.username === userName.value && acc.password === password.value
		);
		//
		if (checkLogin) {
			// Acc đang login
			let accLogin = accounts.find((acc) => acc.username === userName.value);
			// cap nhat currentAccount de giu dang nhap lan sau
			localStorage.setItem('currentAccount', JSON.stringify(accLogin));
			//
			//
			if (accLogin.role === 'customer') {
				tpUser.classList.add('--is-login');
				// hiển thị tên user đang đăng nhập
				checkLoginToShow(accLogin.fullname);
			} else {
				tpUser.classList.add('--is-login', '--is-admin');
				// hiển thị tên user đang đăng nhập
				checkLoginToShow(accLogin.fullname);
			}

			renderCarts(accLogin.carts);
			handleHideModal();
			// hiển thị giỏ hàng của user hiện tại
			toast({
				title: 'Đăng nhập thành công',
				message: 'Đăng nhập tài khoản thành công',
				type: 'success',
				duration: 3000,
			});
		} else {
			document.querySelector('.form-message.--login-fail').innerText =
				'Tài khoản hoặc mật khẩu không đúng';
			document
				.querySelector('.form-message.--login-fail')
				.parentNode.querySelector('.auth-form__body-icon')
				.classList.add('--invalid');
		}
	} else {
		const errEles = document.querySelectorAll('.form-message');
		errEles.forEach((errEle) => {
			let iconEle = errEle.parentNode.querySelector('.auth-form__body-icon');
			if (iconEle) iconEle.classList.toggle('--invalid');
			errEle.innerText = 'Vui lòng nhập trường này';
		});
	}
}
function showModalLogin() {
	handleHideModal();
	let htmls = `
	<div class="auth-form" id="form-1">
	<div class="auth-wp">
		<div class="auth-form__header">
			<p class="auth-form__header-icon">
				<i class="fa fa-user-circle"></i>
			</p>
			<h3 class="auth-form__header-title">ĐĂNG NHẬP</h3>
		</div>
		<p class="auth-form-line mt-20 mb-18"></p>
		<div class="auth-form__body">
			<div class="auth-form__body-group">
				<label for="username" class="auth-form__body-label">
					Tài khoản
				</label>
				<input
					type="text"
					class="auth-form__body-inp"
					id="username"
					placeholder=""
				/>
				<p class="form-message --color-red"></p>
			</div>
			<div class="auth-form__body-group">
					<label for="password" class="auth-form__body-label">
						Mật khẩu
					</label> 
					<input
						type="password"
						class="auth-form__body-inp"
						id="password"
						placeholder=""
					/>
					<p class="auth-form__body-icon " onclick="togglePsw(this)">
						<i class="fa-solid fa-eye"></i>
					</p>
					<p class="form-message --login-fail --color-red"></p>
			</div>
		</div>
		<p class="auth-form-line mt-20 mb-8"></p>
		<div class="auth-form__bottom">
			<button onclick="login()" class="btn btn--primary auth-form__bottom-btn btn-sign-in">
				Đăng nhập
			</button>
			<div class="auth-form__bottom-create-acc">
				Chưa có tài khoản?
				<p class="auth-form__bottom-create-link" onclick="showModalSignUp()">Đăng kí</p>
			</div>
		</div>
	</div>
</div>
	`;
	modalBody.innerHTML = htmls;
	// Kiem tra inp
	Validator({
		form: '#form-1',
		rules: [
			Validator.isRequired('#username'),
			Validator.isRequired('#password'),
		],
	});

	modal.addEventListener('keypress', (e) => {
		if (e.key === 'Enter') login();
	});

	handleShowModal();
}
function checkLoginToShow(nameAcc) {
	if (tpUser.classList.contains('--is-login')) {
		tpUserName.innerHTML = nameAcc;
		btnLogin.style.display = 'none';
		tpUserLs.innerHTML = '';
		if (tpUser.classList.contains('--is-admin')) {
			tpUserLs.innerHTML = `
			<div class="tp-usr-item" onclick="adminPage()">
				Quản lí cửa hàng
			</div>
			
			`;
		}
		tpUserLs.innerHTML += `
			<div class="tp-usr-item" onclick="showInfoAccount()">
				Tài khoản của tôi
			</div>
			<div class="tp-usr-item" onclick="showHistoryOrder()">
				Đơn hàng đã đặt
			</div>
			<div class="tp-usr-item" onclick="logout()">Đăng xuất</div>
		`;
	}
}
// *** LỊCH SỬ ĐƠN HÀNG
function showHistoryOrder() {
	handleHideModal();
	let currentAccount = JSON.parse(localStorage.getItem('currentAccount'));
	let historyCarts = currentAccount.orderedCarts;

	let htmls = `<div class="ordered">
		<div class="ordered-wp">
			<div class="ordered-top">
				<h3 class="ordered-heading">LỊCH SỬ ĐƠN HÀNG</h3>
			</div>
			<div class="ordered-separate --separate-horizontal"></div>
			<div class="ordered-body">
				<div class="ordered-ls">
					<h2 class="ordered-empty">
						BẠN CHƯA CÓ ĐƠN HÀNG NÀO ĐÃ ĐẶT
					</h2>
					
				</div>
			</div>
		</div>
	</div>`;
	modalBody.innerHTML = htmls;
	let orderedLs = document.querySelector('.ordered-ls');

	if (historyCarts.length) {
		let orderedProducts = ``;
		let orderedCarts = ``;
		historyCarts.forEach((item) => {
			orderedProducts = ``;
			item.carts.map((product) => {
				orderedProducts += `
						<div class="ordered-item-product">			
							<div class="ordered-item-img">
								<img src="${product.img}"/>		
							</div>
							<div class="ordered-item-info">
								<p class="ordered-item-name">${product.title}</p>
								<div class="ordered-item-desc">
									<p class="ordered-item-price">Giá:
										<span>
											${convertFormatPrice(product.price)}	
										</span>
									</p>
									<p class="ordered-item-size">Size: 
										<span>
											${product.size}
										</span>
									</p>
									<p class="ordered-item-quantity">Số lượng: 
										<span>
											${product.quantity}
										</span>
									</p>
								</div>
							</div>
						</div>
				`;
			});
			orderedCarts += `
				<div  class="ordered-item">	
					<div class="ordered-item-top">
							${orderedProducts}
					</div>
					<div class="--separate-horizontal my-4"></div>
					<div class="ordered-item-bottom">
						<div class="ordered-item-action">
							
							${
								item.isConfirm
									? "<p class='ordered-item-status active'>Đã xử lí</p>"
									: "<p class='ordered-item-status'>Chưa xử lí</p>"
							}
							<div class="ordered-item-detail">
								<div class="ordered-item-detail-title" onclick="handleShowDetail(this)">
									<i class="fa fa-eye"></i>
									Xem chi tiết
								</div>
								<div class="ordered-item-detail-body">
									<div class="ordered-item-detail-close" >
										<span onclick="handleHideDetail(this)">
											<i class="fa fa-xmark"></i>
										</span>	
									</div>
									<div class="ordered-item-detail-ls">
										<div class="ordered-item-id">
											<p>Mã đơn hàng:</p><span>${item.idOrder}</span>
										</div>
										<div class="ordered-item-date">
											<p>Ngày đặt:</p><span>${formatDate(item.dateBuy)}</span>
										</div>
										<div class="ordered-item-ship">
											<p>Hình thức giao:</p><span>${item.ship}</span>
										</div>
										<div class="ordered-item-fullname">
											<p>Tên khách hàng:</p><span>pppppppppppppppppppppp</span>
										</div>
										<div class="ordered-item-address">
											<p>Địa chỉ:</p> <span>${item.address}</span>
										</div>
										<div class="ordered-item-phone">
											<p>Điện thoại:</p> <span>${item.phone}</span>
										</div>
									</div>
								</div>
							</div>
						</div>
						<p class="ordered-item-total">Tổng tiền: <span>${convertFormatPrice(
							item.totalPrice
						)}</span></p>
					</div>
				</div>
			`;
		});
		orderedLs.innerHTML = orderedCarts;
	}

	handleShowModal();
}
function handleShowDetail(item) {
	if (
		item.parentNode
			.querySelector('.ordered-item-detail-body')
			.classList.contains('active')
	) {
		item.parentNode
			.querySelector('.ordered-item-detail-body')
			.classList.remove('active');
		return;
	}
	document
		.querySelectorAll('.ordered-item-detail-body')
		.forEach((ele) => ele.classList.remove('active'));
	item.parentNode
		.querySelector('.ordered-item-detail-body')
		.classList.add('active');
}
function handleHideDetail(item) {
	item.parentNode.parentNode.classList.remove('active');
}
// *** SIGN UP
function showModalSignUp() {
	handleHideModal();
	//
	let htmls = `
	<div class="auth-form" id="form-2">
						<div class="auth-wp">
							<div class="auth-form__header">
								<p class="auth-form__header-icon">
									<i class="fa fa-user-circle"></i>
								</p>
								<h3 class="auth-form__header-title">ĐĂNG KÝ</h3>
							</div>
							<p class="auth-form-line mt-20 mb-18"></p>
							<div class="auth-form__body">
								<!-- Ten -->
								<div class="auth-form__body-group">
									<label for="full-name" class="auth-form__body-label">
										Tên đầy đủ
									</label>
									<input
										type="text"
										class="auth-form__body-inp"
										id="full-name"
										placeholder="VD:Trịnh Chí Sương"
									/>
									<p class="form-message --color-red"></p>
								</div>
								<!-- SDT -->
								<div class="auth-form__body-group">
									<label for="phone" class="auth-form__body-label">
										Số điện thoại
									</label>
									<input
										type="text"
										class="auth-form__body-inp"
										id="phone"
										placeholder="Số điện thoại"
									/>
									<p class="form-message --color-red"></p>
								</div>
								<!-- EMAIL -->
								<div class="auth-form__body-group">
									<label for="mail" class="auth-form__body-label">
										Email
									</label>
									<input
										type="text"
										class="auth-form__body-inp"
										id="mail"
										placeholder="Email"
									/>
									<p class="form-message --color-red"></p>
								</div>
								<!-- TKHOAN -->
								<div class="auth-form__body-group">
									<label for="username" class="auth-form__body-label">
										Tài khoản
									</label>
									<input
										type="text"
										class="auth-form__body-inp"
										id="username"
										placeholder="Tài khoản"
									/>
									<p class="form-message --color-red"></p>
								</div>
								<!-- MKHAU -->
								<div class="auth-form__body-group">
									<label for="password" class="auth-form__body-label">
										Mật khẩu
									</label>
									<input
										type="password"
										class="auth-form__body-inp"
										id="password"
										placeholder="Mật khẩu"
									/>
									<p
										class="auth-form__body-icon"
										onclick="togglePsw(this)"
									>
										<i class="fa-solid fa-eye"></i>
									</p>
									<p class="form-message --color-red"></p>
								</div>
								<!-- NHAP LAI MK -->
								<div class="auth-form__body-group">
									<label
										for="confirm-password"
										class="auth-form__body-label"
									>
										Nhập lại mật khẩu
									</label>
									<input
										type="password"
										class="auth-form__body-inp"
										id="confirm-password"
										placeholder="Nhập lại mật khẩu"
									/>
									<p
										class="auth-form__body-icon"
										onclick="togglePsw(this)"
									>
										<i class="fa-solid fa-eye"></i>
									</p>
									<p class="form-message --color-red"></p>
								</div>
								</div>
								<p class="auth-form-line mt-20 mb-8"></p>

							<div class="auth-form__bottom">
								<div class="auth-form__bottom-policy">
									<div class="auth-form__bottom-group">
										<input
											type="checkbox"
											id="check-policy"
											class="auth-form__bottom-inp"
										/>
										<label for="check-policy" 
											class="auth-form__bottom-label">
												Tôi đồng ý với
											<a href="#" class="auth-form__bottom-policy-link">
												chính sách và điều khoản
											</a>
										</label>
									</div>	
								<p class="form-message-check --message-checked --color-red">
								</p>
								</div>

								<button onclick="signUp()" class="btn btn--primary auth-form__bottom-btn btn-sign-up">
									Đăng ký
								</button>
							</div>
						</div>
					</div>
	`;
	modalBody.innerHTML = htmls;

	handleShowModal();
	//

	//
	Validator({
		form: '#form-2',
		rules: [
			Validator.isRequired('#full-name'),
			Validator.isPhone('#phone'),
			Validator.isRequired('#username'),
			Validator.isPassword('#password'),
			Validator.isConfirmPassword('#confirm-password'),
			Validator.isMail('#mail'),
		],
	});
}
function signUp() {
	const fullName = document.querySelector('#full-name');
	const phone = document.querySelector('#phone');
	const mail = document.querySelector('#mail');
	const userName = document.querySelector('#username');
	const password = document.querySelector('#password');
	const confirmPsw = document.querySelector('#confirm-password');
	const checkPolicy = document.querySelector('#check-policy');
	//
	let accounts = JSON.parse(localStorage.getItem('accounts'));
	//
	if (
		userName.value.trim() &&
		password.value.trim() &&
		mail.value.trim() &&
		fullName.value.trim() &&
		phone.value.trim() &&
		confirmPsw.value.trim() &&
		checkPolicy.checked
	) {
		// Không được trùng sđt và tên đăng nhập
		let isExistAcc = accounts.some(
			(acc) =>
				acc.username.trim() === userName.value.trim() ||
				acc.phone.trim() === phone.value.trim()
			// || acc.mail.trim() === mail.value.trim()
		);
		if (!isExistAcc) {
			let maxId = 0;
			accounts.forEach((acc) => {
				if (parseInt(acc.id) > maxId) maxId = parseInt(acc.id);
			});
			let newUser = {
				id: maxId + 1,
				fullname: fullName.value,
				phone: phone.value,
				mail: mail.value,
				username: userName.value,
				password: password.value,
				role: 'customer',
				status: 1,
				carts: [],
				orderedCarts: [],
				join: new Date(),
			};
			accounts.push(newUser);
			localStorage.setItem('accounts', JSON.stringify(accounts));
			toast({
				title: 'Đăng kí thành công',
				message:
					'Đăng kí tài khoản thành công hãy đăng nhập để mua sắm thỏa thích',
				type: 'success',
				duration: 3000,
			});
			handleHideModal();
		} else {
			toast({
				title: 'Tài khoản đẫ tồn tại',
				message:
					'Tên đăng đăng nhập hoặc số điện thoại của bạn có thể đã bị trùng vui lòng nhập lại',
				type: 'warning',
				duration: 3000,
			});
		}
	} else {
		if (!document.querySelector('#check-policy').checked) {
			document.querySelector('.form-message-check').innerText =
				'Vui lòng đọc kĩ chính sách và điều khoản để đánh dấu trường này';
		}
		//
		const inpEles = document.querySelectorAll('.auth-form__body-inp');
		inpEles.forEach((inpEle) => {
			if (!inpEle.value) {
				inpEle.parentNode.querySelector('.form-message').innerText =
					'Vui lòng nhập trường này';
			}
		});
	}
}
//
// *** LOGOUT
function logout() {
	if (tpUser.classList.contains('--is-login')) {
		tpUser.classList.remove('--is-login', '--is-admin');
		checkLogoutToHide();
		localStorage.removeItem('currentAccount');
		renderCarts([]);
		toast({
			title: 'Đăng xuất',
			message: 'Đăng xuất tài khoản',
			type: 'info',
			duration: 3000,
		});
	}
}
function checkLogoutToHide() {
	if (!tpUser.classList.contains('--is-login')) {
		tpUserName.innerText = 'Tài khoản';
		btnLogin.style.display = 'block';
		tpUserLs.innerHTML = '';
		tpUserLs.innerHTML = `
			<div class="tp-usr-item" onclick="showModalLogin()">
				Đăng nhập
			</div>
			<div class="tp-usr-item" onclick="showModalSignUp()">
				Đăng ký
			</div>
			`;
	}
}
// *** SHOW SẢN PHẨM THEO DANH MỤC
function showCategory(item) {
	item.addEventListener('click', () => {
		let check = document.querySelector('.main-product');
		if (!check) content.innerHTML = mainApp;

		const productsContainer = document.querySelector('.product-ls');
		const categoryHeading = document.querySelector('.filter-heading');
		let categorySelected = item.textContent.toLowerCase();
		let productsFiltered;
		//
		if (categorySelected === 'hàng mới về') {
			productsFiltered = products.filter((pduct) => pduct.newItem);
			categoryItemNow = productsFiltered;
		} else {
			productsFiltered = products.filter(
				(pduct) =>
					pduct.categoryMain.toLowerCase().trim() ===
					categorySelected.trim()
			);
			categoryItemNow = productsFiltered;
		}
		//
		categoryHeading.innerHTML = categorySelected.toUpperCase().trim();
		//

		//
		displayListPduct(
			productsFiltered,
			perPage,
			currentPage,
			productsContainer
		);
		setupPagination(productsFiltered, perPage);
		//on mobile
		menuMobile.classList.remove('active');
		//
		// backToTop;
	});
}
function showSubCategory(item) {
	item.addEventListener('click', () => {
		let check = document.querySelector('.main-product') ? true : false;
		if (!check) content.innerHTML = mainApp;

		const categorySelected = item.textContent.toLowerCase();
		const categoryHeading = document.querySelector('.filter-heading');
		let productsFiltered = products.filter(
			(pduct) =>
				pduct.category.toLowerCase().trim() === categorySelected.trim()
		);

		const productsContainer = document.querySelector('.product-ls');

		categoryHeading.innerHTML = categorySelected.toUpperCase().trim();
		//
		categoryItemNow = productsFiltered;
		//
		displayListPduct(
			productsFiltered,
			perPage,
			currentPage,
			productsContainer
		);
		setupPagination(productsFiltered, perPage);
		menuMobile.classList.remove('active');
	});
}
// *** BIẾN LƯU TRỮ DANH SÁCH SẢN PHẨM CÓ TRONG DANH MỤC HIỆN TẠI
// *** DÙNG CHO SẮP XẾP GIÁ TĂNG/ GIẢM
let categoryItemNow;
categoryItems.forEach((cateItem) => {
	showCategory(cateItem);
	handleBackToTop();
});
subCategoryItems.forEach((cateItem) => {
	showSubCategory(cateItem);
	handleBackToTop();
});
// *** NAV STICKY
const nav = document.querySelector('.nb-wp');
const backToTop = document.querySelector('.back-to-top');
window.addEventListener('scroll', () => {
	if (window.scrollY >= nav.parentNode.offsetTop) {
		backToTop.classList.add('active');
		nav.parentNode.classList.add('--is-sticky');
	} else {
		nav.parentNode.classList.remove('--is-sticky');
		backToTop.classList.remove('active');
	}
});
// *** XEM CÓ TÀI KHOẢN ĐANG ĐĂNG NHẬP KHÔNG
window.addEventListener('load', () => {
	let currentAccount = JSON.parse(localStorage.getItem('currentAccount'));
	if (currentAccount) {
		if (currentAccount.role === 'customer') {
			tpUser.classList.add('--is-login');
			checkLoginToShow();
		} else {
			tpUser.classList.add('--is-login', '--is-admin');
			checkLoginToShow();
		}
		renderCarts(currentAccount.carts);
		checkLoginToShow(currentAccount.fullname);
	}
});
// *** TÌM KIẾM
search.addEventListener('keypress', (e) => {
	if (e.key === 'Enter') {
		btnSearch.click();
	}
});
btnSearch.addEventListener('click', (e) => {
	e.stopPropagation();
	search.classList.toggle('active');
	handleSearch();
});
function handleSearch() {
	//
	if (searchInput.value) {
		let check = document.querySelector('.main-product') ? true : false;
		if (!check) content.innerHTML = mainApp;
		//tp__right-login

		const productMain = document.querySelector('.product-ls');
		const categoryHeading = document.querySelector('.filter-heading');
		// let searchInp = searchInput.value.toLowerCase().trim();
		let searchInp = removeVietnameseTones(
			searchInput.value.toLowerCase().trim()
		);
		let productsSearch = products.filter((product) =>
			removeVietnameseTones(product.title.toLowerCase().trim()).includes(
				searchInp
			)
		);

		productsSearch.length !== 0
			? (categoryHeading.innerText = `TÌM KIẾM \'${searchInput.value}\'`)
			: (categoryHeading.innerText = 'KHÔNG TÌM THẤY SẢN PHẨM!!!');
		//
		displayListPduct(productsSearch, perPage, currentPage, productMain);
		setupPagination(productsSearch, perPage);
	}
}
//
// *** SHOW NHỮNG SẢN PHẨM ĐÃ THÊM VÀO GIỎ HÀNG
function renderCarts(carts) {
	const totalQuantity = document.querySelector('.nb__right-cart-top-quantity');
	const totalPrice = document.querySelector('.nb__right-cart-bottom-price');
	const cartLs = document.querySelector('.nb__right-cart-list');
	cartLs.innerHTML = '';
	if (carts) {
		let htmls = carts.map(
			(cart) => `
	<li class="nb__right-cart-item">
		<a href="#" class="nb__right-cart-link">
			<div class="nb__right-cart-img">
				<img src="${cart.img}"alt="${cart.title}"/>
			</div>
			<div class="nb__right-cart-info">
				<h3 class="nb__right-cart-name">
					${cart.title}
				</h3>
				<div class="nb__right-cart-price-wp">
					<p class="nb__right-cart-price">
						${convertFormatPrice(cart.price)}
					</p>
					<span class="nb__right-cart-multi">x</span>
					<p class="nb__right-cart-quantity --quantity-${cart.id}">
						${cart.quantity}
					</p>
				</div>
				<p class="nb__right-cart-size">Size: ${cart.size}</p>
			</div>
		</a>
	</li>	
`
		);
		cartLs.innerHTML = htmls.join('');
		let totalQuantityPductInCart = 0;
		let totalPricePductInCart = 0;
		carts.forEach((cart) => {
			totalQuantityPductInCart += parseInt(cart.quantity);
			totalPricePductInCart +=
				parseInt(cart.quantity) * parseInt(cart.price);
		});
		totalQuantity.innerHTML = totalQuantityPductInCart;
		totalPrice.innerHTML = convertFormatPrice(totalPricePductInCart);
	}
}
// *** SHOW SẢN PHẨM
function renderProducts(productList, productsContainer) {
	let htmls = productList.map(
		(product) =>
			`
			<div class="products-item products-item-4 products-item-2" onclick="showModalBuy(${
				product.id
			})">
				<div class="products-item-thump">
					<div class="products-item-link-img">
						<img
							
							src="${product.img}"
							alt="${product.title}"
							class="products-item-img"
						/>
					</div>
					<div class="products-item-cart">
						<div class="products-item-circle">
							<i class="fa fa-cart-shopping"></i>
						</div>
					</div>
				</div>
				<div class="products-item-info">
					<div class="products-item-link">
						<h3 class="products-item-name">
						${product.title}
						</h3>
						<p class="products-item-price">
						
						${convertFormatPrice(product.price)}
						</p>
					</div>
				</div>
			</div>
		`
	);
	productsContainer.innerHTML = htmls.join('');
}
// *** THANH TOÁN GIỎ HÀNG
function pay() {
	const fullname = document.querySelector('#full-name');
	const mail = document.querySelector('#mail');
	const phone = document.querySelector('#phone');
	const address = document.querySelector('#address');

	if (
		fullname.value.trim() &&
		mail.value.trim() &&
		phone.value.trim() &&
		address.value.trim()
	) {
		let accounts = JSON.parse(localStorage.getItem('accounts'));
		let currentAccount = JSON.parse(localStorage.getItem('currentAccount'));
		let ship = document.querySelector('.pfs-selected-content');
		let carts = currentAccount.carts;
		let totalPrice = 0;
		let totalQuantity = 0;
		let createIdOrder =
			'MĐH' + currentAccount.id + (currentAccount.orderedCarts.length + 1);

		carts.forEach((cart) => {
			cart.idOrder = createIdOrder;
			totalPrice += parseInt(cart.quantity) * parseInt(cart.price);
			totalQuantity += parseInt(cart.quantity);
		});
		let data = {
			idOrder: createIdOrder,
			idAccount: currentAccount.id,
			fullname: fullname.value,
			mail: mail.value,
			phone: phone.value,
			ship: ship.innerText.trim(),
			address: address.value,
			carts: carts,
			totalPrice: totalPrice,
			totalQuantity: totalQuantity,
			dateBuy: new Date(),
			isConfirm: false,
		};
		//update local
		let accPaid = accounts.find((acc) => acc.id === currentAccount.id);
		accPaid.orderedCarts.push(data);
		currentAccount.orderedCarts.push(data);
		accPaid.carts = [];
		currentAccount.carts = [];
		localStorage.setItem('currentAccount', JSON.stringify(currentAccount));
		localStorage.setItem('accounts', JSON.stringify(accounts));
		//
		//
		renderCarts([]);
		handleHideModal();
		toast({
			title: 'Thanh toán thành công',
			message: 'Bạn đã thanh toán giỏ hàng thành công',
			type: 'success',
			duration: 3000,
		});
	} else {
		const inpEles = document.querySelectorAll('.pay-form-inp');
		inpEles.forEach((inpEle) => {
			if (!inpEle.value) {
				inpEle.parentNode.querySelector('.form-message').innerText =
					'Vui lòng nhập trường này';
			}
		});
	}
}
// *** SHOW NHỮNG SẢN PHẨM TRONG ĐƠN HÀNG
function renderCartPay() {
	let products = JSON.parse(localStorage.getItem('products'));
	let cartsPayLs = document.querySelector('.pay-right__cart-ls');
	let currentAccount = JSON.parse(localStorage.getItem('currentAccount'));
	let cartsInCurrAcc = currentAccount ? currentAccount.carts : [];
	let htmls = cartsInCurrAcc.map((cart, index) => {
		return `
		<div class="pay-right__cart-item" >
			<div class="pay-right__cart-img">
				<img src="${cart.img}"
				alt="${cart.title}"
				/>
			</div>
			<div class="pay-right__cart-content">
				<p class="pay-right__cart-name">
					${cart.title}
				</p>
				<div class="pay-right__cart-info">
					<div class="pay-right__cart-desc">
						<p
							class="pay-right__cart-price"
						>
							Giá: <span>${convertFormatPrice(cart.price)}</span>
						</p>
						<div class="pay-right__cart-size">
							<div class="pay-right__cs-wp">
								<p class="pay-right__cs-title">
									Size:
								</p>
								<div class="pay-right__cs-body">
									<div 
										class="pay-right__cs-selected" 
										onclick="handleShowListEditSelection(this)"
									>
										<span class="pay-right__cs-content">${cart.size}</span>
										<span class="pay-right__cs-icon-down">
											<i class="fa fa-angle-down"></i>
										</span>
									</div>
									<div class="pay-right__cs-ls">
										${showEditSizeList([products.find((pd) => pd.id === cart.id).sizeLs, index])}
									</div>
								</div>
							</div>
						</div>	
					</div>
					<div class="pay-right__cart-quantity-wp">
						<div class="pay-right__cart-quantity">
							<span class="pay-right__cart-decrease"  onclick="decQuantity(${index})">
								<i class="fa fa-circle-minus"></i>
							</span>
							<input
							onchange="inputQuantity(${index})"
							id="cart-${index}"
							type="text"
							min="1"
							max="20"
							class="pay-right__cart-quantity-inp"
							value="${cart.quantity}"/>
							<span class="pay-right__cart-increase" onclick="incQuantity(${index})">
								<i class="fa fa-plus-circle"></i>
							</span>
						</div>
					</div>
					<div class="pay-right__cart-opt">
						<div class="pay-right__cart-del" onclick="delCart(${index})">
							Xóa
						</div>
					</div>
				</div>
			</div>
		</div>`;
	});

	cartsPayLs.innerHTML = htmls.join('');
	// cartsPayLs.innerHTML = htmls;
}
// *** UPDATE TỔNG TIÊN CỦA ĐƠN HÀNG TRONG NÚT THANH TOÁN
function handleUpdateBtnPay(carts) {
	//cap nhat total thanh toan
	let totalPay = 0;
	carts.forEach(
		(cart) => (totalPay += parseInt(cart.quantity) * parseInt(cart.price))
	);
	document.querySelector(
		'.pay-bottom-price'
	).innerText = `${convertFormatPrice(totalPay)}`;
}
// ***
function showModalPay() {
	handleHideModal();

	let htmls = `
	<div class="pay">
						<div class="pay-wp">
							<div class="pay-top">
								<h3 class="pay-heading">THANH TOÁN</h3>
							</div>
							<div class="pay-separate --separate-horizontal"></div>
							<div class="pay-body">
								<!-- PAY LEFT -->
								<div class="pay-left" id="form-3">
									<h3 class="pay-left-heading">
										THÔNG TIN NGƯỜI NHẬN
									</h3>
									<!-- FULL NAME -->
									<div class="pay-form-group">
										<label for="full-name" class="pay-form-label">
											Tên đầy đủ <span class="--color-red">*</span>
										</label>
										<input
											type="text"
											class="pay-form-inp"
											id="full-name"
											placeholder="VD:Trịnh CHí Sương"
										/>
										<p class="form-message --color-red"></p>
									</div>
									<!-- EMAIL -->
									<div class="pay-form-group">
										<label for="mail" class="pay-form-label">
											Email <span class="--color-red">*</span>
										</label>
										<input
											type="text"
											class="pay-form-inp"
											id="mail"
											placeholder="VD:demo2004@gmail.com"
										/>
										<p class="form-message --color-red"></p>
									</div>
									<!-- SDT -->
									<div class="pay-form-group">
										<label for="phone" class="pay-form-label">
											Số điện thoại
											<span class="--color-red">*</span>
										</label>
										<input
											type="text"
											class="pay-form-inp"
											id="phone"
											placeholder="VD:0123 456 789"
										/>
										<p class="form-message --color-red"></p>
									</div>
									<!-- SHIP -->
									<div class="pay-form-group">
										<div class="pay-form-label">
											Cách thức giao hàng
											<span class="--color-red">*</span>
										</div>
										<div class="pay-form-ship">
											<div
												class="pfs-selected"
												onclick="handleShowListSelection(this)"
											>
												<p class="pfs-selected-content">
													Giao hàng tận nơi
												</p>
											</div>
											<div class="pfs-ls">
												<div
													class="pfs-opt"
													onclick="handleShipSelected(this)"
												>
													Giao hàng tận nơi
												</div>
												<div
													onclick="handleShipSelected(this)"
													class="pfs-opt"
												>
													Nhận tại cửa hàng
												</div>
											</div>
										</div>
									</div>
									<!-- ADDRESS -->
									<div class="pay-form-group">
										<label for="address" class="pay-form-label">
											Địa chỉ
											<span class="--color-red">*</span>
										</label>
										<input
											type="text"
											class="pay-form-inp"
											id="address"
											placeholder="VD:116A Mậu thân, An Hòa, TP Cần Thơ"
										/>
										<p class="form-message --color-red"></p>
									</div>
								</div>
								<div class="pay-separate --separate-vertical"></div>
								<!-- PAY RIGHT -->
								<div class="pay-right">
									<h3 class="pay-right-heading">GIỎ HÀNG</h3>
									<div class="pay-right__cart-wp">
										<div class="pay-right__cart">
											<div class="pay-right__cart-ls"></div>
										</div>
									</div>
								</div>
							</div>
							<div class="pay-separate --separate-horizontal"></div>
							<div class="pay-bottom">
								<button class="btn btn--primary " onclick="pay()">
									THANH TOÁN
									<span class="pay-bottom-price"
										>${document.querySelector('.nb__right-cart-bottom-price').innerText}</span
									>
								</button>
							</div>
						</div>
					</div>
	`;
	modalBody.innerHTML = htmls;
	renderCartPay();
	Validator({
		form: '#form-3',
		rules: [
			Validator.isRequired('#full-name'),
			Validator.isMail('#mail'),
			Validator.isPhone('#phone'),
			Validator.isRequired('#address'),
		],
	});
	handleShowModal();
}
// ***
function showModalBuy(id) {
	handleHideModal();
	let pdBuy = products.filter((product) => product.id === id)[0];
	let htmls = `
	<div class="pduct">
		<div class="pduct-wp">
			<div class="pduct-left">
				<img
					src="${pdBuy.img}"
					alt=""
					class="pduct-left__img"
				/>
			</div>
			<!--  -->
			<div class="pduct-right">
				<div class="pduct-info">
					<h3 class="pduct-name">
						${pdBuy.title}
					</h3>
					<p class="pduct-price">Giá: <span>${convertFormatPrice(pdBuy.price)}</span></p>
					<p class="pduct-status">
						Tình trạng: 
						<span>
							${pdBuy.status === 1 ? 'còn hàng' : 'hết hàng'}
						</span>
					</p>
				</div>
				<span class="pduct-separate"></span>
				<div class="pduct-desc">
					<h3>Mô tả sản phẩm:</h3>
					<p>
						${pdBuy.title}
					</p>
					<p>Loại sản phẩm: <span>${pdBuy.category}</span></p>
					<p>Size: ${pdBuy.sizeLs.join(' ')}</p>
				</div>
				<div class="pduct-desc">
					<h3>Hướng dẫn bảo quản sản phẩm:</h3>
					<p>
						Hạn chế giặt máy, nên giặt tay, lộn trái khi giặt<br/>Nên phơi nơi nắng nhẹ, tránh ánh nắng trực tiếp.
					</p>
					
				</div>

				<span class="pduct-separate"></span>
				<div class="pduct-selection">
					<div class="pduct-size">
						<div class="ps-wp">
							<h3>
								Lựa chọn size
								<span class="--color-red">*</span>
							</h3>
							<div class="ps-body">
								<div class="ps-selected" onclick="handleShowListSelection(this)">
									<span class="ps-content">${pdBuy.sizeLs[0]}</span>
									<span>
										<i class="fa fa-angle-down"></i>
									</span>
								</div>
								<div class="ps-ls">
									${showSizeList(pdBuy.sizeLs)}
								</div>
							</div>
						</div>
					</div>
					<!-- *** -->
					<div class="pduct-quantity">
						<div class="pq-wp">
							<h3>
								Số lượng sản phẩm
								<span class="--color-red">*</span>
							</h3>
							<div class="pq-body">
								<div class="pq-selected" onclick="handleShowListSelection(this)">
									<span class="pq-content">1</span>
									<span>
										<i class="fa fa-angle-down"></i>
									</span>
							</div>
							<div class="pq-ls">
								${showQuantity(10)}
							</div>
						</div>
					</div>
				</div>
			</div>					
			<span class="pduct-separate"></span>
			<div class="pduct-bottom">
				<div class="pb-wp">
					<button class="btn btn--primary pduct-buy-btn" onclick="payNow(${pdBuy.id})">
						<i class="fa fa-cart-shopping"></i>
						Thanh toán ngay
					</button>
					<button class="btn btn--primary pduct-add-btn" onclick="addCart(${pdBuy.id})">
						<i class="fa fa-plus"></i>
						Thêm giỏ hàng
					</button>
				</div>
			</div>
		</div>
	</div>	
	`;
	modalBody.innerHTML = htmls;
	handleShowModal();
}

// *** TẠO DỮ LIỆU GIỎ HÀNG BẰNG ID SP, SIZE, QUANTITY
function setDataProductBuy(id, size, quantity) {
	// const quantityContent = document.querySelector('.pq-content');
	// const sizeContent = document.querySelector('.ps-content');
	let data = {
		productBuy: products.filter((product) => product.id === id)[0],
		quantity: quantity,
		size: size,
	};
	let dataAddCart = {
		id: data.productBuy.id,
		title: data.productBuy.title,
		img: data.productBuy.img,
		category: data.productBuy.category,
		categoryMain: data.productBuy.categoryMain,
		price: data.productBuy.price,
		size: size,
		quantity: quantity,
		idOrder: '',
	};
	return dataAddCart;
}
function checkRepeatPduct(data) {
	let cartsInCurrAcc = JSON.parse(
		localStorage.getItem('currentAccount')
	).carts;
	return cartsInCurrAcc.some(
		(cart) => cart.id === data.id && cart.size === data.size
	);
}
function addCart(id) {
	let accounts = JSON.parse(localStorage.getItem('accounts'));
	//
	//nếu có tk mới được thêm giỏ hàng hoặc mua
	let currentAccount = JSON.parse(localStorage.getItem('currentAccount'));
	//
	const psSelected = document.querySelector('.ps-content');
	const pqSelected = document.querySelector('.pq-content');
	if (currentAccount) {
		//lay carts trong currAcc
		let cartsInCurrAcc = currentAccount.carts;
		const data = setDataProductBuy(
			id,
			psSelected.innerText,
			pqSelected.innerText
		);
		//
		if (!checkRepeatPduct(data)) {
			currentAccount.carts.push(data);
			// accNow[0].carts.push(data);
			localStorage.setItem('currentAccount', JSON.stringify(currentAccount));
		} else {
			//trung san pham
			cartsInCurrAcc = JSON.parse(
				localStorage.getItem('currentAccount')
			).carts;
			let cartRepeat = cartsInCurrAcc.find((cart) => cart.id === data.id);
			let currQuantity = parseInt(cartRepeat.quantity);
			currQuantity += parseInt(pqSelected.innerText);
			//
			currentAccount.carts.find((cart) => cart.id === data.id).quantity =
				currQuantity;
			//
			localStorage.setItem('currentAccount', JSON.stringify(currentAccount));
		}
		cartsInCurrAcc = JSON.parse(localStorage.getItem('currentAccount')).carts;
		// set cart trong account
		accounts.find((acc) => acc.id == currentAccount.id).carts =
			cartsInCurrAcc;
		localStorage.setItem('accounts', JSON.stringify(accounts));

		//
		renderCarts(cartsInCurrAcc);
		handleHideModal();
	} else {
		toast({
			title: 'Không thể mua sắm',
			message: 'Hãy đăng nhập để có thể mua sắm với nhiều ưu đãi hơn ',
			type: 'warning',
			duration: 3000,
		});
		handleHideModal();
	}
}
// *** THANH TOÁN NGAY
function payNow(id) {
	handleHideModal();
	let currentAccount = JSON.parse(localStorage.getItem('currentAccount'));
	if (currentAccount) {
		addCart(id);
		showModalPay();
	} else {
		toast({
			title: 'Không thể mua sắm',
			message: 'Hãy đăng nhập để có thể mua sắm với nhiều ưu đãi hơn ',
			type: 'warning',
			duration: 3000,
		});
		handleHideModal();
	}
}
// *** SỬA SIZE, TĂNG/ GIẢM SỐ LƯỢNG SẢN PHẨM TRONG GIỎ HÀNG
function handleShowListEditSelection(item) {
	const list = item.parentNode.querySelector('.pay-right__cs-ls');
	list.classList.toggle('active');
	//
}
function handleEditSize(index, sizeVal) {
	let currentAccount = JSON.parse(localStorage.getItem('currentAccount'));

	currentAccount.carts[index].size = sizeVal;
	localStorage.setItem('currentAccount', JSON.stringify(currentAccount));
	//
	let accounts = JSON.parse(localStorage.getItem('accounts'));
	accounts.find((acc) => acc.id === currentAccount.id).carts =
		currentAccount.carts;
	// cap nhat data
	localStorage.setItem('accounts', JSON.stringify(accounts));

	renderCarts(currentAccount.carts);
	//

	document.querySelectorAll('.pay-right__cart-opt')[index].innerHTML = `
	<div class="pay-right__cart-del" onclick="delCart(${index})">
		Xóa
	</div>

	`;
}
function showEditSizeList([...data]) {
	return data[0]
		.map(
			(sz) =>
				`<div onclick="handleEditSelected(this,${data[1]})" class="pay-right__cs-opt">${sz}</div>`
		)
		.join('');
}
function handleEditSelected(...data) {
	// tao ra index cua san pham
	let indexCartItem = data[1];
	let itemSzEle = data[0];
	itemSzEle.parentNode.parentNode.querySelector(
		'.pay-right__cs-content'
	).innerText = itemSzEle.innerText;
	itemSzEle.parentNode.classList.remove('active');
	//

	let dataSz = [itemSzEle.innerText, indexCartItem];
	document.querySelectorAll('.pay-right__cart-opt')[
		indexCartItem
	].innerHTML = `
		<div class="pay-right__cart-done" 
			onclick="handleEditSize(${indexCartItem}, '${itemSzEle.innerText}')"
		>
			Xong
		</div>
		<div class="pay-right__cart-del" onclick="delCart(${indexCartItem})">
			Xóa
		</div>
	`;
}
function showQuantity(quantity) {
	let htmls = ``;
	for (let i = 1; i <= quantity; i++)
		htmls += `<div onclick="handleSelected(this)" class="pq-opt">${i}</div>`;
	return htmls;
}
function showSizeList(sizeLs) {
	return sizeLs
		.map(
			(sz) =>
				`<div onclick="handleSelected(this)" class="ps-opt">${sz}</div>`
		)
		.join('');
}
function handleShowListSelection(item) {
	const list = item.parentNode.children[1];
	const opts = list.children;
	list.classList.toggle('active');
}
function handleSelected(item) {
	const selected = item.parentNode.parentNode.children[0];
	const list = item.parentNode.parentNode.children[1];
	selected.children[0].innerHTML = item.textContent;
	list.classList.remove('active');
}
function handleShipSelected(item) {
	item.parentNode.classList.remove('active');
	item.parentNode.parentNode.querySelector('.pfs-selected-content').innerText =
		item.innerText.trim();
	// return item.innerText.trim();
}
function delCart(idCart) {
	if (confirm('Bạn có muốn xóa sản phẩm khỏi giỏ hàng')) {
		let currentAccount = JSON.parse(localStorage.getItem('currentAccount'));
		let accounts = JSON.parse(localStorage.getItem('accounts'));
		//
		let idCartDel = currentAccount.carts[idCart].id;
		let newCarts = currentAccount.carts.filter(
			(cart) => cart.id !== idCartDel
		);
		// cap nhat gio hang sau khi xoa
		currentAccount.carts = newCarts;
		accounts.find((acc) => acc.id === currentAccount.id).carts = newCarts;
		localStorage.setItem('accounts', JSON.stringify(accounts));
		localStorage.setItem('currentAccount', JSON.stringify(currentAccount));
		//
		handleUpdateBtnPay(newCarts);
		renderCartPay();
		renderCarts(newCarts);
	}
}
function handleEditQuantity(...data) {
	let quantityVal = data[0];
	let index = data[1];
	// cap nhat so luong san pham
	let currentAccount = JSON.parse(localStorage.getItem('currentAccount'));
	currentAccount.carts[index].quantity = quantityVal;
	localStorage.setItem('currentAccount', JSON.stringify(currentAccount));
	//
	let accounts = JSON.parse(localStorage.getItem('accounts'));
	accounts.find((acc) => acc.id === currentAccount.id).carts =
		currentAccount.carts;
	// cap nhat data
	localStorage.setItem('accounts', JSON.stringify(accounts));
	//cap nhat total thanh toan
	handleUpdateBtnPay(currentAccount.carts);

	// cap nhat gio hang bé
	renderCarts(currentAccount.carts);
	//
	document.querySelectorAll('.pay-right__cart-opt')[index].innerHTML = `
		<div class="pay-right__cart-done">
			Xóa
		</div>
	`;
}
function inputQuantity(index) {
	let quantityEle = document.querySelector(`#cart-${index}`);
	let quantityVal = parseInt(quantityEle.value);
	if (quantityVal <= 0 && quantityVal >= 10) return;

	let data = [quantityVal, index];
	let optEle = document.querySelectorAll('.pay-right__cart-opt');

	optEle[index].innerHTML = `
		<div class="pay-right__cart-done" onclick ="handleEditQuantity(${data})">
			Xong
		</div>
		<div class="pay-right__cart-del" onclick="delCart(${index})">
			Xóa
		</div>
	`;
}
function decQuantity(index) {
	let quantityEle = document.querySelector(`#cart-${index}`);
	let quantityVal = parseInt(quantityEle.value);
	if (quantityVal <= 1) return;
	quantityEle.value = --quantityVal;

	let data = [quantityVal, index];
	let optEle = document.querySelectorAll('.pay-right__cart-opt');

	optEle[index].innerHTML = `
		<div class="pay-right__cart-done" onclick ="handleEditQuantity(${data})">
			Xong
		</div>
		<div class="pay-right__cart-del" onclick="delCart(${index})">
			Xóa
		</div>
	`;
}
function incQuantity(index) {
	let quantityEle = document.querySelector(`#cart-${index}`);
	let quantityVal = parseInt(quantityEle.value);
	if (quantityVal >= 10) return;
	quantityEle.value = ++quantityVal;

	let data = [quantityVal, index];
	let optEle = document.querySelectorAll('.pay-right__cart-opt');
	optEle[index].innerHTML = `
		<div class="pay-right__cart-done" onclick ="handleEditQuantity(${data})">
			Xong
		</div>
		<div class="pay-right__cart-done">
			Xóa
		</div>
	`;
}
//
// *** DÙNG CHO PHÂN TRANG
let perPage = 12; // sp trên 1 trang
let currentPage = 1; // trang hiện tại
let totalPage = 0; // tổng trang
let perProducts = []; // sp trên trang hiện tai
//
function displayListPduct(productAll, perPage, currentPage, productsContainer) {
	let start = (currentPage - 1) * perPage;
	let end = (currentPage - 1) * perPage + perPage;
	productsCategoryNow = productAll;
	perProducts = productAll.slice(start, end);
	renderProducts(perProducts, productsContainer);
}
function handleChangePage(currentPage) {
	let listPani = document.querySelectorAll('.panigation-link');
	listPani.forEach((itemPagi) =>
		itemPagi.parentNode.classList.remove('active')
	);
	listPani[currentPage].parentNode.classList.add('active');
	//
	let start = (currentPage - 1) * perPage;
	let end = (currentPage - 1) * perPage + perPage;
	perProducts = productsCategoryNow.slice(start, end);
	let productsContainer = document.querySelector('.product-ls');
	renderProducts(perProducts, productsContainer);
	handleBackToTop();
}
function setupPagination(productAll, perPage) {
	const panigationList = document.querySelector('.panigation-list');
	panigationList.innerHTML = '';
	panigationList.innerHTML += `<div class="panigation-item --pani-prev" onclick="handlePrevPage()">
					<div class="panigation-link">
						<i class="fa fa-angle-left"></i>
					</div>
			</div>`;

	let page_count = Math.ceil(productAll.length / perPage);
	for (let i = 1; i <= page_count; i++) {
		panigationList.innerHTML += `
				<div class="panigation-item" onclick="handleChangePage(${i})">
						<div class="panigation-link" >${i}</div>
				</div>
	
			`;
	}
	panigationList.innerHTML += `<div class="panigation-item" onclick="handleNextPage()">
				<div class="panigation-link">
					<i class="fa fa-angle-right --pani-next"></i>
				</div>
			</div>`;
	//
	//active trang hiện tại
	document
		.querySelectorAll('.panigation-link')[1]
		.parentNode.classList.add('active');
}
function handlePrevPage() {
	let currentPage = document.querySelector(
		'.panigation-item.active'
	).innerText;
	if (currentPage === '1') return;
	//
	currentPage = parseInt(currentPage);
	let start = (currentPage - 1 - 1) * perPage;
	let end = (currentPage - 1 - 1) * perPage + perPage;
	perProducts = productsCategoryNow.slice(start, end);
	let productsContainer = document.querySelector('.product-ls');
	renderProducts(perProducts, productsContainer);
	//
	let listPani = document.querySelectorAll('.panigation-link');
	listPani.forEach((itemPagi) =>
		itemPagi.parentNode.classList.remove('active')
	);
	document
		.querySelectorAll('.panigation-link')
		[currentPage - 1].parentNode.classList.add('active');
	handleBackToTop();
}
function handleNextPage() {
	let currentPage = document.querySelector(
		'.panigation-item.active'
	).innerText;
	let page_count = Math.ceil(productsCategoryNow.length / perPage);
	if (currentPage === page_count.toString()) return;
	//
	currentPage = parseInt(currentPage);
	let start = (currentPage + 1 - 1) * perPage;
	let end = (currentPage + 1 - 1) * perPage + perPage;
	perProducts = productsCategoryNow.slice(start, end);
	let productsContainer = document.querySelector('.product-ls');
	renderProducts(perProducts, productsContainer);
	//
	let listPani = document.querySelectorAll('.panigation-link');
	listPani.forEach((itemPagi) =>
		itemPagi.parentNode.classList.remove('active')
	);
	document
		.querySelectorAll('.panigation-link')
		[currentPage + 1].parentNode.classList.add('active');
	handleBackToTop();
}
//
// *** DÙNG CHO SẮP XẾP
function priceDefault(item) {
	const productMain = document.querySelector('.product-ls');

	displayListPduct(categoryItemNow, perPage, currentPage, productMain);
	setupPagination(categoryItemNow, perPage);
}
function priceDecrease(item) {
	let categoryItemNowSorted = [...categoryItemNow];
	categoryItemNowSorted.sort(
		(product1, product2) =>
			parseInt(product2.price) - parseInt(product1.price)
	);
	const productMain = document.querySelector('.product-ls');
	displayListPduct(categoryItemNowSorted, perPage, currentPage, productMain);
	setupPagination(categoryItemNowSorted, perPage);
}
function priceIncrease(item) {
	let categoryItemNowSorted = [...categoryItemNow];
	categoryItemNowSorted.sort(
		(product1, product2) =>
			parseInt(product1.price) - parseInt(product2.price)
	);
	const productMain = document.querySelector('.product-ls');
	displayListPduct(categoryItemNowSorted, perPage, currentPage, productMain);
	setupPagination(categoryItemNowSorted, perPage);
}
//
// *** DÙNG CHO THÔNG TIN TÀI KHOẢN
function showInfoAccount() {
	handleHideModal();
	let currentAccount = JSON.parse(localStorage.getItem('currentAccount'));
	let htmls = `<div class="account">
	<div class="account-wp">
		<div class="account-top">
			<h3 class="account-heading">THÔNG TIN TÀI KHOẢN</h3>
		</div>
		<div class="account-separate --separate-horizontal"></div>
		<div class="account-body">
			<div class="ab-wp" id="form-4">
				<!-- FULL NAME -->
				<div class="ab-info-group">
					<label for="fullname" class="ab-info-label"
						>Họ tên</label
					>
					<div class="ab-info-content">
						<p class="ab-info-value">${currentAccount.fullname}</p>
					</div>
					<!-- <input
						type="text"
						id="full-name"
						class="ab-info-inp"
						value="Trịnh Chí Sương"
					/> -->
				</div>								
				<!-- PHONE -->
				<div class="ab-info-group">
					<label for="phone" class="ab-info-label"
						>Số điện thoại</label
					>
					<div class="ab-info-content">
						<p class="ab-info-value">${currentAccount.phone}</p>
					</div>
					<!-- <input
						type="text"
						id="phone"
						class="ab-info-inp"
						value="0344887316"
					/> -->
				</div>
				<!-- USER NAME -->
				<div class="ab-info-group">
					<label for="username" class="ab-info-label"
						>Tên tài khoản</label
					>
					<div class="ab-info-content">
						<p class="ab-info-value" id="username">${currentAccount.username}</p>
					</div>
					<!-- <input
						type="text"
						id="username"
						class="ab-info-inp"
						value="admin"
					/> -->
				</div>
				<!-- MAIL -->
				<div class="ab-info-group">
					<label for="mail" class="ab-info-label"
						>Email</label
					>
					<div class="ab-info-content">
						<p class="ab-info-value" id="mail">${currentAccount.mail}</p>
					</div>
										<!-- <input
						type="text"
						id="mail"
						class="ab-info-inp"
						value="Trinhsuong2000@gmail.com"
					/> -->
				</div>

			</div>
		</div>
		<div class="account-separate --separate-horizontal"></div>
		<div class="account-bottom">
			<button
				class="btn btn--primary"
				onclick="handleEditInfo()"
			>
				Chỉnh sửa
			</button>
			<button
				class="btn btn--primary"
				onclick="handleEditPassword()"
			>
				Đổi mật khẩu
			</button>
			<!-- <button class="btn btn--primary" onclick="handleConfirmEditInfo()">Xác nhận</button> -->
		</div>
	</div>
</div>`;
	modalBody.innerHTML = htmls;
	handleShowModal();
}
function handleConfirmEditPass() {
	let currentAccount = JSON.parse(localStorage.getItem('currentAccount'));
	let accounts = JSON.parse(localStorage.getItem('accounts'));
	let currPsw = document.querySelector('input[id="currpsw"]');
	let newPsw = document.querySelector('input[id="newpass"]');
	let confirmPsw = document.querySelector('input[id="confirmpass"]');

	if (!(currPsw.value && newPsw.value && confirmPsw.value)) {
		if (!currPsw.value)
			currPsw.parentNode.querySelector('.form-message').innerText =
				'Trường này không được để trống';
		if (!newPsw.value)
			newPsw.parentNode.querySelector('.form-message').innerText =
				'Trường này không được để trống';
		if (!confirmPsw.value)
			confirmPsw.parentNode.querySelector('.form-message').innerText =
				'Trường này không được để trống';
		return;
	}
	//
	if (!(currPsw.value.trim() === currentAccount.password)) {
		currPsw.parentNode.querySelector('.form-message').innerText =
			'Mật khẩu không đúng';
		return;
	} else {
		if (!(newPsw.value.trim() === currentAccount.password)) {
			if (!(newPsw.value.trim() === confirmPsw.value.trim())) {
				confirmPsw.parentNode.querySelector('.form-message').innerText =
					'Mật khẩu không trùng khớp';
				return;
			}
		} else {
			newPsw.parentNode.querySelector('.form-message').innerText =
				'Mật khẩu trùng với mật khẩu cũ';
			return;
		}
	}
	currentAccount.password = newPsw.value.trim();
	localStorage.setItem('currentAccount', JSON.stringify(currentAccount));
	accounts.find((acc) => acc.id === currentAccount.id).password =
		newPsw.value.trim();
	localStorage.setItem('accounts', JSON.stringify(accounts));
	//
	let accWrapper = document.querySelector('.account-wp');
	let htmls = `
	<div class="account-top">
	<h3 class="account-heading">THÔNG TIN TÀI KHOẢN</h3>
</div>
<div class="account-separate --separate-horizontal"></div>
<div class="account-body">
	<div class="ab-wp" id="form-4">
		<!-- FULL NAME -->
		<div class="ab-info-group">
			<label for="fullname" class="ab-info-label"
				>Họ tên</label
			>
			<div class="ab-info-content">
				<p class="ab-info-value">${currentAccount.fullname}</p>
			</div>
			<!-- <input
				type="text"
				id="full-name"
				class="ab-info-inp"
				value="Trịnh Chí Sương"
			/> -->
		</div>								
		<!-- PHONE -->
		<div class="ab-info-group">
			<label for="phone" class="ab-info-label"
				>Số điện thoại</label
			>
			<div class="ab-info-content">
				<p class="ab-info-value">${currentAccount.phone}</p>
			</div>
			<!-- <input
				type="text"
				id="phone"
				class="ab-info-inp"
				value="0344887316"
			/> -->
		</div>
		<!-- USER NAME -->
		<div class="ab-info-group">
			<label for="username" class="ab-info-label"
				>Tên tài khoản</label
			>
			<div class="ab-info-content">
				<p class="ab-info-value" id="username">${currentAccount.username}</p>
			</div>
			<!-- <input
				type="text"
				id="username"
				class="ab-info-inp"
				value="admin"
			/> -->
		</div>
		<!-- MAIL -->
		<div class="ab-info-group">
			<label for="mail" class="ab-info-label"
				>Email</label
			>
			<div class="ab-info-content">
				<p class="ab-info-value" id="mail">${currentAccount.mail}</p>
			</div>
								<!-- <input
				type="text"
				id="mail"
				class="ab-info-inp"
				value="trinhsuong2000@gmail.com"
			/> -->
		</div>

	</div>
</div>
<div class="account-separate --separate-horizontal"></div>
<div class="account-bottom">
	<button
		class="btn btn--primary"
		onclick="handleEditInfo()"
	>
		Chỉnh sửa
	</button>
	<button
		class="btn btn--primary"
		onclick="handleEditPassword()"
	>
		Đổi mật khẩu
	</button>
	<!-- <button class="btn btn--primary" onclick="handleConfirmEditInfo()">Xác nhận</button> -->
</div>
	`;
	accWrapper.innerHTML = htmls;
	toast({
		title: 'Đổi mật khẩu thành công',
		message: 'Bạn đã đổi mật khẩu thành công',
		type: 'success',
		duration: 3000,
	});
}
function handleEditPassword() {
	let infoAccountBody = document.querySelector('.ab-wp');
	let infoAccountBottom = document.querySelector('.account-bottom');
	let htmls = `
	<div class="ab-info-group">
		<label for="currpsw" class="ab-info-label"
			>Mật khẩu hiện tại</label
		>
		<div class="ab-info-content">
			<input
				type="password"
				id="currpsw"
				class="ab-info-inp"
				value=""
			/>
			<p class="form-message --color-red"></p>
		</div>		
	</div>
	<div class="ab-info-group">
		<label for="newpass" class="ab-info-label"
			>Mật khẩu mới</label
		>
		<div class="ab-info-content">
			<input
				type="password"
				id="newpass"
				class="ab-info-inp"
				value=""
			/>
			<p class="form-message --color-red"></p>
		</div>		
	</div>
	<div class="ab-info-group">
		<label for="confirmpass" class="ab-info-label"
			>Xác nhận mật khẩu</label
		>
		<div class="ab-info-content">
			<input
				type="password"
				id="confirmpass"
				class="ab-info-inp"
				value=""
			/>
			<p class="form-message --color-red"></p>
		</div>		
	</div>
	`;
	let htmls1 = `
		<button class="btn btn--primary" onclick="handleConfirmEditPass()">Xác nhận</button>
		<button class="btn btn--primary" onclick="handleCancelEditPass()">Hủy bỏ</button>
	
	`;
	infoAccountBody.innerHTML = htmls;
	infoAccountBottom.innerHTML = htmls1;
	Validator({
		form: '#form-4',
		rules: [
			Validator.isRequired('#currpsw'),
			Validator.isPassword('#newpass'),
			Validator.isPassword('#confirmpass'),
		],
	});
}
function handleEditInfo() {
	const infoGroupEles = document.querySelectorAll('.ab-info-group');
	infoGroupEles.forEach((infoGroupEle) => {
		let labelEle = infoGroupEle.querySelector('label');
		let valueEle = infoGroupEle.querySelector('.ab-info-value');
		//
		if (labelEle.attributes.for.nodeValue !== 'username') {
			infoGroupEle.querySelector('.ab-info-content').innerHTML = `
			
				<input
					type="text"
					id="${labelEle.attributes['for'].nodeValue}"
					class="ab-info-inp"
					value="${valueEle.innerText}"
				/>
				<p class="form-message --color-red"></p>
			
			
			`;
		}
	});

	Validator({
		form: '#form-4',
		rules: [
			Validator.isRequired('#username'),
			Validator.isPhone('#phone'),
			Validator.isMail('#mail'),
		],
	});

	document.querySelector('.account-heading').innerText = 'CHỈNH SỬA THÔNG TIN';
	let htmls = `
	<button class="btn btn--primary" onclick="handleConfirmEditInfo()">Xác nhận</button>
	<button class="btn btn--primary" onclick="handleResetInfo()">Reset</button>
	`;
	document.querySelector('.account-bottom').innerHTML = htmls;

	//
}
function handleConfirmEditInfo() {
	let accounts = JSON.parse(localStorage.getItem('accounts'));
	let currentAccount = JSON.parse(localStorage.getItem('currentAccount'));
	let accountsToCompare = accounts.filter(
		(acc) => acc.id !== currentAccount.id
	);
	// check xem có bị trùng với các acc còn lại không
	let isContains = [];

	const infoGroupEles = document.querySelectorAll('.ab-info-group');
	//

	//
	infoGroupEles.forEach((infoGroupEle) => {
		let inputEle = infoGroupEle.querySelector('.ab-info-inp');
		let messageEle = infoGroupEle.querySelector('.form-message');
		let checkContains = false;
		if (inputEle) {
			if (inputEle.value.trim()) {
				checkContains = accountsToCompare.some(
					(acc) =>
						acc[inputEle.attributes.id.nodeValue].toLowerCase().trim() ===
						inputEle.value.toLowerCase().trim()
				);
				if (checkContains) {
					messageEle.innerText = 'Giá trị đã tồn tại vui lòng nhập lại';
					isContains.push(true);
				} else messageEle.innerText = '';
			} else {
				messageEle.innerText = 'Vui lòng nhập trường này';
			}
		}
	});

	//
	if (!isContains.some((item) => item)) {
		const infoGroupEles = document.querySelectorAll('.ab-info-group');
		infoGroupEles.forEach((infoGroupEle) => {
			let contentEle = infoGroupEle.querySelector('.ab-info-content');
			let inputEle = contentEle.querySelector('.ab-info-inp');
			//
			// console.log([inputEle]);
			if (inputEle) {
				contentEle.innerHTML = `
			<p class="ab-info-value" id="${inputEle.attributes.id.nodeValue}">${inputEle.value}</p>
			`;
			}
		});
		document.querySelector('.account-heading').innerText =
			'THÔNG TIN TÀI KHOẢN';
		document.querySelector('.account-bottom').innerHTML = `
			<button class="btn btn--primary" onclick="handleEditInfo()">Chỉnh sửa</button>
			<button class="btn btn--primary" onclick="handleEditPassword()">Đổi mật khẩu</button>
			`;
	}
	// !!! updata localstorage...
	currentAccount.fullname = document.querySelector('#fullname').innerText;
	currentAccount.phone = document.querySelector('#phone').innerText;
	currentAccount.mail = document.querySelector('#mail').innerText;
	localStorage.setItem('currentAccount', JSON.stringify(currentAccount));
	let accEdited = accounts.find((acc) => acc.id === currentAccount.id);
	accEdited.fullname = currentAccount.fullname;
	accEdited.phone = currentAccount.phone;
	accEdited.mail = currentAccount.mail;
	localStorage.setItem('accounts', JSON.stringify(accounts));
}
function handleResetInfo() {
	let currentAccount = JSON.parse(localStorage.getItem('currentAccount'));
	let dataBackup = {
		fullname: currentAccount.fullname,
		phone: currentAccount.phone,
		mail: currentAccount.mail,
	};
	document.querySelector('input[id="fullname"]').value = dataBackup.fullname;
	document.querySelector('input[id="phone"]').value = dataBackup.phone;
	document.querySelector('input[id="mail"]').value = dataBackup.mail;

	const infoGroupEles = document.querySelectorAll('.ab-info-group');
	//

	//
	infoGroupEles.forEach((infoGroupEle) => {
		let messageEle = infoGroupEle.querySelector('.form-message');
		if (messageEle) {
			messageEle.innerText = '';
		}
	});
}
function handleCancelEditPass() {
	let currentAccount = JSON.parse(localStorage.getItem('currentAccount'));
	let htmls = `<div class="account">
	<div class="account-wp">
		<div class="account-top">
			<h3 class="account-heading">THÔNG TIN TÀI KHOẢN</h3>
		</div>
		<div class="account-separate --separate-horizontal"></div>
		<div class="account-body">
			<div class="ab-wp" id="form-4">
				<!-- FULL NAME -->
				<div class="ab-info-group">
					<label for="fullname" class="ab-info-label"
						>Họ tên</label
					>
					<div class="ab-info-content">
						<p class="ab-info-value">${currentAccount.fullname}</p>
					</div>
					<!-- <input
						type="text"
						id="full-name"
						class="ab-info-inp"
						value="Trịnh Chí Sương"
					/> -->
				</div>								
				<!-- PHONE -->
				<div class="ab-info-group">
					<label for="phone" class="ab-info-label"
						>Số điện thoại</label
					>
					<div class="ab-info-content">
						<p class="ab-info-value">${currentAccount.phone}</p>
					</div>
					<!-- <input
						type="text"
						id="phone"
						class="ab-info-inp"
						value="0344887316"
					/> -->
				</div>
				<!-- USER NAME -->
				<div class="ab-info-group">
					<label for="username" class="ab-info-label"
						>Tên tài khoản</label
					>
					<div class="ab-info-content">
						<p class="ab-info-value" id="username">${currentAccount.username}</p>
					</div>
					<!-- <input
						type="text"
						id="username"
						class="ab-info-inp"
						value="admin"
					/> -->
				</div>
				<!-- MAIL -->
				<div class="ab-info-group">
					<label for="mail" class="ab-info-label"
						>Email</label
					>
					<div class="ab-info-content">
						<p class="ab-info-value" id="mail">${currentAccount.mail}</p>
					</div>
										<!-- <input
						type="text"
						id="mail"
						class="ab-info-inp"
						value="trinhsuong2000@gmail.com"
					/> -->
				</div>

			</div>
		</div>
		<div class="account-separate --separate-horizontal"></div>
		<div class="account-bottom">
			<button
				class="btn btn--primary"
				onclick="handleEditInfo()"
			>
				Chỉnh sửa
			</button>
			<button
				class="btn btn--primary"
				onclick="handleEditPassword()"
			>
				Đổi mật khẩu
			</button>
			<!-- <button class="btn btn--primary" onclick="handleConfirmEditInfo()">Xác nhận</button> -->
		</div>
	</div>
</div>`;
	modalBody.innerHTML = htmls;
}

// *** ẨN/ HIỆN MODAL
function handleShowModal() {
	modal.classList.toggle('open');
	modal.classList.remove('hide');
}
function handleHideModal() {
	modal.classList.toggle('hide');
	modal.classList.remove('open');
}
modal.addEventListener('click', (e) => {
	if (e.target === e.currentTarget) handleHideModal();
});
//ESC close modal
window.onkeydown = function (event) {
	if (event.keyCode == 27) {
		btnCloseModal.click();
	}
};

// *** ẨN/ HIỆN MẬT KHẨU
function togglePsw(ele) {
	let typeInp = ele.parentNode.children[1].attributes[0];
	typeInp.nodeValue === 'password'
		? (typeInp.nodeValue = 'text')
		: (typeInp.nodeValue = 'password');
	if (ele.children[0].classList.contains('fa-solid')) {
		ele.children[0].classList.remove('fa-solid');
		ele.children[0].classList.add('fa-regular');
	} else {
		ele.children[0].classList.remove('fa-regular');
		ele.children[0].classList.add('fa-solid');
	}
}
// *** BACK TO TOP
function handleBackToTop() {
	document.body.scrollTop = 0; // For Safari
	document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}
// *** CHUYỂN SANG ADMIN
function adminPage() {
	window.location = 'admin.html';
}
//
//
// *** DÙNG TRÊN MOBILE (RESPONSIVE)
let btnOpenMenu = document.querySelector('.nb__right-bars-btn');
let btnCloseMenu = document.querySelector('.mn-close');
let menuMobile = document.querySelector('.mobile');
let overlayMenuMobile = document.querySelector('.mobile-overlay');
overlayMenuMobile.addEventListener('click', (e) => {
	if (e.target === e.currentTarget) menuMobile.classList.remove('active');
});
btnOpenMenu.addEventListener('click', () => {
	menuMobile.classList.add('active');
});
btnCloseMenu.addEventListener('click', () => {
	menuMobile.classList.remove('active');
});

mobileCategoryItems.forEach((cateItem) => {
	showCategory(cateItem);
});
mobileSubCategoryItems.forEach((cateItem) => {
	showSubCategory(cateItem);
});
