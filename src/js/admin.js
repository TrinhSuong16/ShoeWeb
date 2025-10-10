function checkLogin() {
	let currentAccount = JSON.parse(localStorage.getItem('currentAccount'));
	if (currentAccount === null || currentAccount.role !== 'admin') {
		document.querySelector(
			'body'
		).innerHTML = `<div class="access-denied-section">
            <img class="access-denied-img" src="./assets/img/admin/access-denied.webp" alt="">
        </div>`;
		return;
	}
}
window.onload = checkLogin();

//	MODAL
const modal = document.querySelector('#modal');
const modalBody = document.querySelector('.modal__body');
const btnCloseModal = document.querySelector('.modal__close');
//
const btnHome = document.querySelector('.btn-home');
const btnLogoutAdmin = document.querySelector('.btn-out-admin');
const contentHeading = document.querySelector('.content-top h3');
const contentBody = document.querySelector('.content-body');
const overviewHeadingPduct = document.querySelector('.ow-heading--pduct');
const overviewHeadingCus = document.querySelector('.ow-heading--customer');
const overviewHeadingBill = document.querySelector('.ow-heading--bills');
const adminAvt = document.querySelector('.sb-logo img');
const adminName = document.querySelector('.sb-usr h3');
btnHome.addEventListener('click', () => {
	window.location = 'index.html';
});
btnLogoutAdmin.addEventListener('click', () => {
	window.location = 'index.html';
	localStorage.removeItem('currentAccount');
});
window.onload = loadOverview();
function loadOverview() {
	if (overviewHeadingPduct && overviewHeadingCus && overviewHeadingBill) {
		overviewHeadingPduct.innerText = totalPduct();
		overviewHeadingCus.innerText = totalCustomer();
		overviewHeadingBill.innerText = convertFormatPrice(totalBill());
	}
}

function totalPduct() {
	let totalPd = 0;
	let products = JSON.parse(localStorage.getItem('products'));
	products.forEach((item) => {
		if (item.isBusiness) totalPd++;
	});
	return totalPd;
}
function totalCustomer() {
	let totalCus = 0;
	let accounts = JSON.parse(localStorage.getItem('accounts'));
	accounts.forEach((item) => {
		if (item.role === 'customer') totalCus++;
	});
	return totalCus;
}
function totalBill() {
	let totalBill = 0;
	let accounts = JSON.parse(localStorage.getItem('accounts'));
	accounts.forEach((item) => (totalBill += totalPrice(item.orderedCarts)));
	return totalBill;
}
function totalPrice(orders) {
	let total = 0;
	orders.forEach((order) => {
		if (order.isConfirm) {
			total += order.totalPrice;
		}
	});
	return total;
}
//
function handleSearchCart(inpEle) {
	const accounts = JSON.parse(localStorage.getItem('accounts'));
	let cartsOrderedInAcc = [];
	accounts.forEach((item) => {
		cartsOrderedInAcc.push(item.orderedCarts);
	});
	const orderedLs = cartsOrderedInAcc.flat();
	let searchInp = removeVietnameseTones(inpEle.value.toLowerCase().trim());
	let ordersSearch = orderedLs.filter(
		(order) =>
			removeVietnameseTones(order.fullname.toLowerCase().trim()).includes(
				searchInp
			) ||
			removeVietnameseTones(order.phone.toLowerCase().trim()).includes(
				searchInp
			) ||
			removeVietnameseTones(order.idOrder.toLowerCase().trim()).includes(
				searchInp
			)
	);
	const cartTable = contentBody.querySelector('#cart-ls-body');
	if (ordersSearch.length) {
		cartTable.innerHTML = '';
		renderCarts(ordersSearch, cartTable);
	} else
		cartTable.innerHTML = `<tr class="cart-item"><td colspan="8" class="--color-red">KHÔNG TỒN TẠI ĐƠN HÀNG</td></tr>`;
}
function handleSearchAcc(inpEle) {
	const accounts = JSON.parse(localStorage.getItem('accounts'));
	let searchInp = removeVietnameseTones(inpEle.value.toLowerCase().trim());
	let accountsSearch = accounts.filter(
		(acc) =>
			removeVietnameseTones(acc.fullname.toLowerCase().trim()).includes(
				searchInp
			) ||
			removeVietnameseTones(acc.phone.toLowerCase().trim()).includes(
				searchInp
			) ||
			removeVietnameseTones(acc.username.toLowerCase().trim()).includes(
				searchInp
			)
	);

	const accountLs = contentBody.querySelector('#account-ls-body');
	if (accountsSearch.length) {
		accountLs.innerHTML = '';
		renderAccounts(accountsSearch, accountLs);
	} else
		accountLs.innerHTML = `<tr class="account-item"><td colspan="8" class="--color-red">KHÔNG TỒN TẠI TÀI KHOẢN</td></tr>`;
}
function handleSearchProduct(inpEle) {
	const products = JSON.parse(localStorage.getItem('products'));
	let searchInp = removeVietnameseTones(inpEle.value.toLowerCase().trim());
	let productsSearch = products.filter((product) =>
		removeVietnameseTones(product.title.toLowerCase().trim()).includes(
			searchInp
		)
	);
	const productLs = document.querySelector('.products-ls');
	console.log(productsSearch.length);
	if (productsSearch.length) renderProducts(productsSearch, productLs);
	else
		productLs.innerHTML = `<h3 class="products-empty">KHÔNG TỒN TẠI SẢN PHẨM</h3>`;
}
function handleSortMoney(selected) {
	console.log(selected.value);
	const accounts = JSON.parse(localStorage.getItem('accounts'));
	let listStatistic = listProductsSold(productsInOrdered(accounts));
	let listStatisticSorted;
	if (selected.value === 'mặc định') {
		listStatisticSorted = listStatistic;
	} else if (selected.value === 'tăng dần') {
		listStatisticSorted = listStatistic.sort((product1, product2) => {
			let val1 = parseInt(product1.totalQuantity) * parseInt(product1.price);
			let val2 = parseInt(product2.totalQuantity) * parseInt(product2.price);
			return val1 - val2;
		});
	} else {
		listStatisticSorted = listStatistic.sort((product1, product2) => {
			let val1 = parseInt(product1.totalQuantity) * parseInt(product1.price);
			let val2 = parseInt(product2.totalQuantity) * parseInt(product2.price);
			return val2 - val1;
		});
	}
	console.log('listStatisticSorted:', listStatisticSorted);
	const statisticTable = contentBody.querySelector('#statistic-ls-body');
	if (listStatisticSorted.length) {
		renderStatistic(listStatisticSorted, statisticTable);
		//
	} else
		statisticTable.innerHTML = `<tr><td colspan="6" class="--color-red"><h3>KHÔNG TÌM THẤY</h3></td></tr>`;
}
function handleSearchStatisticCart(inpEle) {
	const accounts = JSON.parse(localStorage.getItem('accounts'));
	let listStatistic = listProductsSold(productsInOrdered(accounts));
	let searchInp = removeVietnameseTones(inpEle.value.toLowerCase().trim());
	let listStatisticSearched = listStatistic.filter((item) =>
		removeVietnameseTones(item.title.toLowerCase().trim()).includes(searchInp)
	);
	const statisticTable = contentBody.querySelector('#statistic-ls-body');
	if (listStatisticSearched.length) {
		renderStatistic(listStatisticSearched, statisticTable);
		//
	} else
		statisticTable.innerHTML = `<tr><td colspan="6" class="--color-red"><h3>KHÔNG TÌM THẤY</h3></td></tr>`;
}
function handleFilterProduct(selected) {
	let productsFiltered;
	const products = JSON.parse(localStorage.getItem('products'));
	if (selected.value === 'tất cả') productsFiltered = products;
	else
		productsFiltered = products.filter(
			(product) => product.category === selected.value
		);
	//
	//
	const productLs = contentBody.querySelector('.products-ls');
	renderProducts(productsFiltered, productLs);
}
function handleFilterStatisticProduct(selected) {
	let listStatisticFiltered;
	const accounts = JSON.parse(localStorage.getItem('accounts'));
	let listStatistic = listProductsSold(productsInOrdered(accounts));
	if (selected.value === 'tất cả') listStatisticFiltered = listStatistic;
	else
		listStatisticFiltered = listStatistic.filter(
			(product) => product.category === selected.value
		);
	//
	const statisticTable = contentBody.querySelector('#statistic-ls-body');
	if (listStatisticFiltered.length !== 0) {
		renderStatistic(listStatisticFiltered, statisticTable);
	} else {
		statisticTable.innerHTML = `
			<tr>
				<td colspan="6"><h3 style='text-align:center ' class="--color-red">KHÔNG TÌM THẤY</h3></td>
			</tr>`;
	}
}
function handleFilterStatusOrder(selected) {
	let ordersFiltered;

	const accounts = JSON.parse(localStorage.getItem('accounts'));
	let cartsOrderedInAcc = [];
	accounts.forEach((item) => {
		cartsOrderedInAcc.push(item.orderedCarts);
	});
	const orderedLs = cartsOrderedInAcc.flat();

	if (selected.value === 'tất cả') ordersFiltered = orderedLs;
	else if (selected.value === 'đã xử lí')
		ordersFiltered = orderedLs.filter((order) => order.isConfirm);
	else ordersFiltered = orderedLs.filter((order) => !order.isConfirm);
	//
	//

	const cartTable = contentBody.querySelector('#cart-ls-body');
	renderCarts(ordersFiltered, cartTable);
}
function handleFilterRoleAccount(selected) {
	let accountsFiltered;
	const accounts = JSON.parse(localStorage.getItem('accounts'));
	if (selected.value === 'tất cả') accountsFiltered = accounts;
	else
		accountsFiltered = accounts.filter(
			(product) => product.role === selected.value
		);
	//
	//
	const accountLs = contentBody.querySelector('#account-ls-body');
	accountLs.innerHTML = '';
	renderAccounts(accountsFiltered, accountLs);
}
function handleFilterDateStatistic() {
	let dateFrom = document.querySelector('#statistic-form-date-from').value;
	let dateTo = document.querySelector('#statistic-form-date-to').value;
	let accounts = JSON.parse(localStorage.getItem('accounts'));
	let statisticLsFiltered;
	console.log(dateFrom, dateTo);
	let cartsOrderedInAcc = [];
	accounts.forEach((item) => {
		cartsOrderedInAcc.push(item.orderedCarts);
	});

	const orderedLs = cartsOrderedInAcc.flat().filter((item) => item.isConfirm);

	if (dateFrom > dateTo && dateTo !== '' && dateFrom !== '') {
		alert('Khoảng thời gian không hợp lệ !');
		return;
	}
	if (dateFrom !== '' && dateTo === '') {
		ordersFiltered = orderedLs.filter((item) => {
			return new Date(item.dateBuy) >= new Date(dateFrom).setHours(0, 0, 0);
		});
	} else if (dateFrom === '' && dateTo !== '') {
		ordersFiltered = orderedLs.filter((item) => {
			return new Date(item.dateBuy) <= new Date(dateTo).setHours(23, 59, 59);
		});
	} else if (dateFrom != '' && dateTo != '') {
		ordersFiltered = orderedLs.filter((item) => {
			return (
				new Date(item.dateBuy) >= new Date(dateFrom).setHours(0, 0, 0) &&
				new Date(item.dateBuy) <= new Date(dateTo).setHours(23, 59, 59)
			);
		});
	}

	// console.log(ordersFiltered);
	// ordersFiltered.forEach((item) => {
	// 	console.log(item.carts);
	// });
	console.log(ordersFiltered);

	let list = [];
	ordersFiltered.forEach((order) => {
		if (order.isConfirm) {
			list.push(order.carts);
		}
	});
	let listStatistic = listProductsSold(list.flat());
	const statisticTable = contentBody.querySelector('#statistic-ls-body');
	statisticTable.innerHTML = '';
	if (listStatistic.length !== 0)
		renderStatistic(listStatistic, statisticTable);
	else
		statisticTable.innerHTML = `<tr style="text-align: center">
				<td colspan="6">
					<h3 class='--color-red'>KHÔNG TÌM THẤY</h3>
				</td>
			</tr>`;
}
function handleFilterDateAcc() {
	let dateFrom = document.querySelector('#account-form-date-from').value;
	let dateTo = document.querySelector('#account-form-date-to').value;
	let accounts = JSON.parse(localStorage.getItem('accounts'));
	let accountsFiltered;
	if (dateFrom > dateTo && dateTo !== '' && dateFrom !== '') {
		alert('Khoảng thời gian không hợp lệ !');
		return;
	}
	if (dateFrom !== '' && dateTo === '') {
		accountsFiltered = accounts.filter((item) => {
			return new Date(item.join) >= new Date(dateFrom).setHours(0, 0, 0);
		});
	} else if (dateFrom === '' && dateTo !== '') {
		accountsFiltered = accounts.filter((item) => {
			return new Date(item.join) <= new Date(dateTo).setHours(23, 59, 59);
		});
	} else if (dateFrom != '' && dateTo != '') {
		accountsFiltered = accounts.filter((item) => {
			return (
				new Date(item.join) >= new Date(dateFrom).setHours(0, 0, 0) &&
				new Date(item.join) <= new Date(dateTo).setHours(23, 59, 59)
			);
		});
	}
	const accountLs = contentBody.querySelector('#account-ls-body');
	accountLs.innerHTML = '';
	renderAccounts(accountsFiltered, accountLs);
	// console.log(dateFrom, dateTo, accountsFiltered);
}
function handleFilterDateOrder() {
	let dateFrom = document.querySelector('#cart-form-date-from').value;
	let dateTo = document.querySelector('#cart-form-date-to').value;
	let accounts = JSON.parse(localStorage.getItem('accounts'));
	let ordersFiltered;

	let cartsOrderedInAcc = [];
	accounts.forEach((item) => {
		cartsOrderedInAcc.push(item.orderedCarts);
	});
	const orderedLs = cartsOrderedInAcc.flat();
	console.log(orderedLs);
	if (dateFrom > dateTo && dateTo !== '' && dateFrom !== '') {
		alert('Khoảng thời gian không hợp lệ !');
		return;
	}
	if (dateFrom !== '' && dateTo === '') {
		ordersFiltered = orderedLs.filter((item) => {
			return new Date(item.dateBuy) >= new Date(dateFrom).setHours(0, 0, 0);
		});
	} else if (dateFrom === '' && dateTo !== '') {
		ordersFiltered = orderedLs.filter((item) => {
			return new Date(item.dateBuy) <= new Date(dateTo).setHours(23, 59, 59);
		});
	} else if (dateFrom != '' && dateTo != '') {
		ordersFiltered = orderedLs.filter((item) => {
			return (
				new Date(item.dateBuy) >= new Date(dateFrom).setHours(0, 0, 0) &&
				new Date(item.dateBuy) <= new Date(dateTo).setHours(23, 59, 59)
			);
		});
	}
	console.log(ordersFiltered);
	const cartTable = contentBody.querySelector('#cart-ls-body');
	cartTable.innerHTML = '';
	renderCarts(ordersFiltered, cartTable);
}
function handleChangeStatusCart(idOrder) {
	const accounts = JSON.parse(localStorage.getItem('accounts'));
	let cartsOrderedInAcc = [];
	accounts.forEach((item) => {
		cartsOrderedInAcc.push(item.orderedCarts);
	});
	if (confirm('Bạn đã kiểm tra kĩ đơn hàng')) {
		cartsOrderedInAcc
			.flat()
			.find((item) => item.idOrder === idOrder).isConfirm = true;
		localStorage.setItem('accounts', JSON.stringify(accounts));
		showBills();
	}
}
function showOverview() {
	contentBody.innerHTML = '';
	let html = `	
	<div class="overview">
		<div class="overview-wp">
			<div class="ow-ls">
				<div class="ow-item item-3">
					<div class="ow-top">
						<h3 class="ow-heading">${totalCustomer()}</h3>
					</div>
					<div class="ow-thump">
						<img
							src="./assets/img/admin/s1.png"
							alt="KHÁCH HÀNG"
						/>
					</div>
					<div class="ow-bottom">
						<h3 class="ow-title">Khách hàng</h3>
						<p class="ow-desc">
							Khách hàng mục tiêu là một nhóm đối tượng
							khách hàng trong phân khúc thị trường mục
							tiêu mà doanh nghiệp bạn đang hướng tới.
						</p>
					</div>
				</div>
				<div class="ow-item item-3">
					<div class="ow-top">
						<h3 class="ow-heading">${totalPduct()}</h3>
					</div>
					<div class="ow-thump">
						<img
							src="./assets/img/admin/s2.png"
							alt="SẢN PHẨM"
						/>
					</div>
					<div class="ow-bottom">
						<h3 class="ow-title">Sản phẩm</h3>
						<p class="ow-desc">
							Sản phẩm là bất cứ cái gì có thể đưa vào
							thị trường để tạo sự chú ý, mua sắm, sử
							dụng hay tiêu dùng nhằm thỏa mãn một nhu
							cầu hay ước muốn. Nó có thể là những vật
							thể, dịch vụ, con người, địa điểm, tổ
							chức hoặc một ý tưởng.
						</p>
					</div>
				</div>
				<div class="ow-item item-3">
					<div class="ow-top">
						<h3 class="ow-heading">${convertFormatPrice(totalBill())}</h3>
					</div>
					<div class="ow-thump">
						<img
							src="./assets/img/admin/s3.png"
							alt="DOANH THU"
						/>
					</div>
					<div class="ow-bottom">
						<h3 class="ow-title">Doanh thu</h3>
						<p class="ow-desc">
							Doanh thu của doanh nghiệp là toàn bộ số
							tiền sẽ thu được do tiêu thụ sản phẩm,
							cung cấp dịch vụ với sản lượng.
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>`;
	contentBody.innerHTML = html;
	contentHeading.innerText = 'TRANG TỔNG QUAN CỦA SHOE TCS';
}
function showPducts() {
	const categories = [
		'Giày thể thao nam',
		'Giày tây nam',
		'Sandal nam',
		'Dép nam',
		'Giày thể thao nữ',
		'Sandal nữ',
		'Dép nữ',
		'Balo',
		'Tất',
		'Đế lót giày',
		'Dây giày',
		'Nước vệ sinh giày',
	];
	let filterLs = categories.map(
		(cate) => `
		<option value='${cate.toLowerCase()}' class='product-form-opt'>
			${cate}
		</option>
	`
	);
	contentHeading.innerText = 'TỔNG SẢN PHẨM CỦA SHOE TCS';
	contentBody.innerHTML = '';
	contentBody.innerHTML = `
	<div class="products">
		<div class="products-wp">
			<div class="products-top">
				<div class="products-features">
					<div class="products-filter">
						<form action="" class="products-form">
								<div class="products-form-group">
									<label
										for="products-form-select"
										class="products-form-label"
									>
										Lọc:
									</label>
									<select
										id="products-form-select"
										class="products-form-select"
										onchange="handleFilterProduct(this)"
									>
										<option value='tất cả' class='product-form-opt'>
											Tất cả
										</option>
										${filterLs.join('')}		
									</select>
								</div>
						</form>
					</div>
					<div class="products-search">
						<span class="products-search__icon"
							><i class="fa fa-search"></i
						></span>
						<input
							type="text"
							class="products-search__inp"
							id="products-search"
							placeholder="Tìm kiếm sản phẩm..."
							oninput="handleSearchProduct(this)"
						/>
					</div>
					
					<div class="products-add">
						<div 
							class="btn btn--primary btn-add"
							onclick="showAddProduct()"
						>
							<span><i class="fa fa-plus"></i></span>
							<span>Thêm sản phẩm</span>
						</div>
					</div>
					
				</div>
			</div>
			<div class="products-body">
				<div class="products-body__wp">
					<div class="products-ls">
						
					</div>
				</div>
			</div>
		</div>
	</div>
	`;
	const products = JSON.parse(localStorage.getItem('products'));
	const productLs = contentBody.querySelector('.products-ls');
	renderProducts(products, productLs);
}
function showAccs() {
	contentHeading.innerText = 'TÀI KHOẢN CỦA SHOE TCS';
	contentBody.innerHTML = '';
	contentBody.innerHTML = `
		<div class="account">
			<div class="account-wp">
				<div class="account-top">
					<div class="account-features">
						<div class="account-filter">
							<form class="account-form">
								<div class="account-form-group">
									<label
										for="account-form-select"
										class="account-form-label"
									>
										Lọc:
									</label>
									<select
										id="account-form-select"
										class="account-form-select"
										onchange="handleFilterRoleAccount(this)"
									>
										<option value='tất cả' class='account-form-opt'>
											Tất cả
										</option>
										<option value='admin' class='account-form-opt'>
											Admin
										</option>
										<option value='customer' class='account-form-opt'>
											Khách hàng
										</option>
									</select>
								</div>
								<div class="account-form-group">
									<label
										for="account-form-date-from"
										class="account-form-label"
									>
										Từ:
									</label>
									<input 
										type="date"
										onchange="handleFilterDateAcc()"
										id="account-form-date-from"
										class="account-form-inp"
									/>
									<label
										for="account-form-date-to"
										class="account-form-label"
									>
										Đến:
									</label>
									<input 
										type="date"
										onchange="handleFilterDateAcc()"
										id="account-form-date-to"
										class="account-form-inp"
									/>
								</div>
							</form>
						</div>
						<div class="account-search">
							<span class="account-search__icon">
								<i class="fa fa-search"></i>
							</span>
							<input
								type="text"
								class="account-search__inp"
								id="account-search"
								placeholder="Tìm kiếm tài khoản..."
								oninput="handleSearchAcc(this)"
							/>
						</div>
						<div class="account-add">
							<div 
								class="btn btn--primary btn-add"
								onclick="showAddAcc()"
							>
								<span><i class="fa fa-plus"></i></span>
								<span>Thêm tài khoản</span>
							</div>
						</div>
						
					</div>
				</div>
				<div class="account-body">
					<div class="account-body__wp">	
						<table id="account-ls">
							<thead>
								<tr>
									<th>STT</th>
									<th>HỌ TÊN</th>
									<th>ROLE</th>
									<th>TÀI KHOẢN</th>
									<th>ĐIỆN THOẠI</th>
									<th>EMAIL</th>
									<th>NGÀY ĐĂNG KÍ</th>
									<th colspan="3">ACTION</th>
								</tr>
							</thead>	
							<tbody id="account-ls-body">
							
							</tbody>
						</table>
						
					</div>
				</div>
			</div>
		</div>
	`;

	const accounts = JSON.parse(localStorage.getItem('accounts'));
	console.log(contentBody);
	const accountTable = contentBody.querySelector('#account-ls-body');
	renderAccounts(accounts, accountTable);
}
function showBills() {
	contentBody.innerHTML = '';
	let html = `<div class="cart">
	<div class="cart-wp">
		<div class="cart-top">
			<div class="cart-features">
				<div class="cart-filter">
					<form class="cart-form">
						<div class="cart-form-group">
							<label
								for="cart-form-select"
								class="cart-form-label"
							>
								Lọc:
							</label>
							<select
								id="cart-form-select"
								class="cart-form-select"
								onchange="handleFilterStatusOrder(this)"
							>
								<option
									value="tất cả"
									class="cart-form-opt"
								>
									Tất cả
								</option>
								<option
									value="đã xử lí"
									class="cart-form-opt"
								>
									Đã xử lí
								</option>
								<option
									value="chưa xử lí"
									class="cart-form-opt"
								>
									Chưa xử lí
								</option>
							</select>
						</div>
						<div class="cart-form-group">
							<label
								for="cart-form-date-from"
								class="cart-form-label"
							>
								Từ:
							</label>
							<input
								type="date"
								onchange="handleFilterDateOrder()"
								id="cart-form-date-from"
								class="cart-form-inp"
							/>
							<label
								for="cart-form-date-to"
								class="cart-form-label"
							>
								Đến:
							</label>
							<input
								type="date"
								onchange="handleFilterDateOrder()"
								id="cart-form-date-to"
								class="cart-form-inp"
							/>
						</div>
					</form>
				</div>
				<div class="cart-search">
					<span class="cart-search__icon">
						<i class="fa fa-search"></i>
					</span>
					<input
						type="text"
						class="cart-search__inp"
						id="cart-search"
						placeholder="Tìm kiếm đơn hàng..."
						oninput="handleSearchCart(this)"
					/>
				</div>
			</div>
		</div>
		<div class="cart-body">
			<div class="cart-body__wp">
				<table id="cart-ls">
					<thead>
						<tr>
							<th>STT</th>
							<th>MÃ ĐƠN HÀNG</th>
							<th>TÊN KHÁCH HÀNG</th>
							<th>ĐIỆN THOẠI</th>
							<th>NGÀY MUA</th>
							<th>ĐỊA CHỈ</th>
							<th colspan="2">ACTION</th>
						</tr>
					</thead>
					<tbody id="cart-ls-body">
						
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>`;
	contentBody.innerHTML = html;
	contentHeading.innerText = 'ĐƠN HÀNG CỦA SHOE TCS';

	const accounts = JSON.parse(localStorage.getItem('accounts'));
	let cartsOrderedInAcc = [];
	accounts.forEach((item) => {
		cartsOrderedInAcc.push(item.orderedCarts);
	});

	const orderedLs = cartsOrderedInAcc.flat();
	const cartTable = contentBody.querySelector('#cart-ls-body');
	console.log(orderedLs);
	renderCarts(orderedLs, cartTable);
}
//
function totalOrdered() {
	let sum = 0;
	let accounts = JSON.parse(localStorage.getItem('accounts'));
	accounts.forEach((acc) => {
		acc.orderedCarts.forEach((order) => {
			if (order.isConfirm) sum++;
		});
	});
	return sum;
}
function totalProductSold() {
	let sum = 0;
	const accounts = JSON.parse(localStorage.getItem('accounts'));
	let listStatistic = listProductsSold(productsInOrdered(accounts));

	listStatistic.forEach((item) => {
		sum += item.totalQuantity;
	});
	return sum;
}
function totalRevenue() {
	let sum = 0;
	let accounts = JSON.parse(localStorage.getItem('accounts'));
	let listStatistic = listProductsSold(productsInOrdered(accounts));

	listStatistic.forEach((item) => {
		sum += parseInt(item.totalQuantity) * parseInt(item.price);
	});
	return sum;
}
// showStatistic();
function showStatistic() {
	handleHideModal();
	const categories = [
		'Giày thể thao nam',
		'Giày tây nam',
		'Sandal nam',
		'Dép nam',
		'Giày thể thao nữ',
		'Sandal nữ',
		'Dép nữ',
		'Balo',
		'Tất',
		'Đế lót giày',
		'Dây giày',
		'Nước vệ sinh giày',
	];
	let filterLs = categories.map(
		(cate) => `
		<option value='${cate.toLowerCase()}' class='statistic-form-opt'>
			${cate}
		</option>
	`
	);
	contentHeading.innerText = 'THỐNG KÊ CỦA SHOE TCS';
	contentBody.innerHTML = '';
	let html = `

	<div class="statistic">
		<div class="statistic-wp">
			<div class="statistic-top">
				<div class="statistic-features">
					<div class="statistic-form-group">
						<label
							for="cart-form-select"
							class="cart-form-label"
						>
							Lọc:
						</label>
						<select
							id="cart-form-select"
							class="cart-form-select"
							onchange="handleFilterStatisticProduct(this)"
						>
							<option
								value="tất cả"
								class="cart-form-opt"
							>
								Tất cả
							</option>
							${filterLs}
						</select>
					</div>
					<div class="statistic-search">
						<span class="statistic-search__icon">
							<i class="fa fa-search"></i>
						</span>
						<input
							type="text"
							class="statistic-search__inp"
							id="statistic-search"
							placeholder="Tìm kiếm sản phẩm..."
							oninput="handleSearchStatisticCart(this)"
						/>
					</div>
					<div class="statistic-filter">
						<!-- dung chung filter date voi carts -->
						<div class="statistic-form-group">
							<label
								for="statistic-form-date-from"
								class="cart-form-label"
							>
								Từ:
							</label>
							<input
								type="date"
								onchange="handleFilterDateStatistic()"
								id="statistic-form-date-from"
								class="cart-form-inp"
							/>
							<label
								for="statistic-form-date-to"
								class="cart-form-label"
							>
								Đến:
							</label>
							<input
								type="date"
								onchange="handleFilterDateStatistic()"
								id="statistic-form-date-to"
								class="cart-form-inp"
							/>
						</div>
						<div class="statistic-form-group">
							<label
								for="statistic-form-select"
								class="statistic-form-label"
							>
								Doanh thu:
							</label>
							<select
								id="statistic-form-select"
								class="statistic-form-select"
								onchange="handleSortMoney(this)"
							>
								<option
									value="mặc định"
									class="statistic-form-opt"
								>
									Mặc định
								</option>
								<option
									value="tăng dần"
									class="statistic-form-opt"
								>
									Tăng dần
								</option>
								<option
									value="giảm dần"
									class="statistic-form-opt"
								>
									Giảm dần
								</option>
							</select>
						</div>
					</div>
				</div>
			</div>
			<div class="statistic-top-ls">
				<div class="statistic-top-item">
					<div class="statistic-info">
						<p class="statistic-title">
							Số lượng đơn hàng
						</p>
						<p class="statistic-quantity">${totalOrdered()}</p>
					</div>
					<div class="statistic-icon">
						<i class="fa fa-file-lines"></i>
					</div>
				</div>
				<div class="statistic-top-item">
					<div class="statistic-info">
						<p class="statistic-title">
							Số lượng bán ra
						</p>
						<p class="statistic-quantity">${totalProductSold()}</p>
					</div>
					<div class="statistic-icon">
						<i class="fa fa-shirt"></i>
					</div>
				</div>
				<div class="statistic-top-item">
					<div class="statistic-info">
						<p class="statistic-title">Doanh thu</p>
						<p class="statistic-quantity">${convertFormatPrice(totalRevenue())}</p>
					</div>
					<div class="statistic-icon">
						<i class="fa fa-dollar"></i>
					</div>
				</div>
			</div>
			<div class="statistic-body">
				<div class="statistic-body__wp">
					<table id="statistic-ls">
						<thead>
							<tr>
								<th>STT</th>
								<th>ẢNH SẢN PHẨM</th>
								<th>TÊN SẢN PHẨM</th>
								<th>SỐ LƯỢNG BÁN RA</th>
								<th>DOANH THU</th>
								<th>ACTION</th>
							</tr>
						</thead>
						<tbody id="statistic-ls-body"></tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
	`;
	contentBody.innerHTML = html;
	const statisticTable = contentBody.querySelector('#statistic-ls-body');
	const accounts = JSON.parse(localStorage.getItem('accounts'));
	let listStatistic = listProductsSold(productsInOrdered(accounts));
	renderStatistic(listStatistic, statisticTable);
}
// tao mang dung cho thong ke
function productsInOrdered(accounts) {
	let list = [];
	accounts.forEach((acc) => {
		acc.orderedCarts.forEach((order) => {
			if (order.isConfirm) {
				list.push(order.carts);
			}
		});
	});

	// console.log(list.flat());
	return list.flat();
}
function listProductsSold(arr) {
	let listResult = [];
	let products = JSON.parse(localStorage.getItem('products'));
	products.forEach((pd) => {
		let data = {
			id: pd.id,
			title: pd.title,
			category: pd.category,
			totalQuantity: 0,
			price: 0,
			img: '',
			idOrder: [],
			hasSold: 0,
		};
		listResult.push(data);
	});
	arr.forEach((item) => {
		let a = listResult.findIndex((it) => it.id === item.id);
		if (listResult[a]) {
			listResult[a].hasSold = 1;
			listResult[a].totalQuantity += parseInt(item.quantity);
			listResult[a].price = item.price;
			listResult[a].img = item.img;
			listResult[a].idOrder.push(item.idOrder);
		}
	});
	return listResult.filter((item) => item.hasSold);
}
//
function showDetailStatisticProduct(lsIdOrder) {
	console.log('lsIdOrder: ', lsIdOrder.split(','));
	let accounts = JSON.parse(localStorage.getItem('accounts'));
	let orderLs = [];
	accounts.forEach((acc) => {
		acc.orderedCarts.forEach((order) => {
			if (lsIdOrder.includes(order.idOrder)) {
				orderLs.push(order);
			}
			// console.log('ls:', lsIdOrder, '???', 'idor:', order.idOrder);
		});
	});
	let detailLs = ``;
	orderLs.map((item) => {
		detailLs += `
		<tr>
								<td>${item.idOrder}</td>
								<td class="min-w-120">${formatDate(item.dateBuy)}</td>
							</tr>
		`;
	});
	handleHideModal();
	let htmls = `
	<div class="detail">
		<div class="detail-wp">
			<div class="detail-top">
				<h3>CHI TIẾT ĐƠN HÀNG</h3>
			</div>
			<div class="--separate-horizontal"></div>
			<div class="detail-body">
				<div class="detail-body-wp">
					<table width="100%">
						<thead>
							<tr>
								<th>MÃ ĐƠN HÀNG</th>
								
								<th>NGÀY MUA</th>
							</tr>
						</thead>
						<tbody>
							${detailLs}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
	`;
	modalBody.innerHTML = htmls;
	handleShowModal();
}
//
function showDetailCart(idOrder) {
	handleHideModal();
	const accounts = JSON.parse(localStorage.getItem('accounts'));
	let cartsOrderedInAcc = [];
	accounts.forEach((item) => {
		cartsOrderedInAcc.push(item.orderedCarts);
	});
	const orderedShowDetail = cartsOrderedInAcc
		.flat()
		.find((item) => item.idOrder === idOrder);
	let orderedLs = ``;
	orderedShowDetail.carts.forEach((cart) => {
		orderedLs += `
		<div class="detail-item">
			<div class="detail-img">
				<img
					src="${cart.img}"
					alt="${cart.title}"
				/>
			</div>
			<div class="detail-info">
				<p class="detail-name">
				${cart.title}
				</p>
				<p class="detail-price">
					Giá: <span>${convertFormatPrice(cart.price)}</span>
				</p>
				<p class="detail-size">
					Size: <span>${cart.size}</span>
				</p>
				<p class="detail-quantity">
					Số lượng: <span>${cart.quantity}</span>
				</p>
			</div>
		</div>
		`;
	});

	let htmls = `
	<div class="detail">
		<div class="detail-wp">
			<div class="detail-top">
				<h3>CHI TIẾT ĐƠN HÀNG</h3>
			</div>
			<div class="--separate-horizontal"></div>
			<div class="detail-body">
				<div class="detail-body-wp">
						<div class="detail-ls">
							${orderedLs}
						</div>
				</div>
			</div>
		</div>
	</div>
	`;

	/*
		
	*/
	modalBody.innerHTML = htmls;
	handleShowModal();
}
//
function renderStatistic(productsShow, productsContainer) {
	let htmls = productsShow.map((product, index) => {
		return `
		<tr class="statistic-item">
			<td>${index + 1}</td>
			<td>
				<div class="statistic-item-img">
					<img src="${product.img}">
				</div>
			</td>
			<td>${product.title}</td>
			<td>${product.totalQuantity}</td>
			<td>${convertFormatPrice(
				parseInt(product.price) * parseInt(product.totalQuantity)
			)}</td>
			<td>
				<button
					class="btn btn--primary statistic-detail"
					onclick="showDetailStatisticProduct('${product.idOrder.toString()}')"
				>
					Xem chi tiết
				</button>
			</td>
		</tr>
		`;
	});
	productsContainer.innerHTML = htmls.join('');
}
//
function renderCarts(cartsShow, cartsContainer) {
	let htmls = cartsShow.map((cart, index) => {
		let statusEle = cart.isConfirm
			? `
				<button
					class="btn cart-status active"
				>
					Đã xử lí
				</button>
			`
			: `
				<button
					class="btn cart-status"
					onclick="handleChangeStatusCart('${cart.idOrder}')"
				>
					Chưa xử lí
				</button>
			`;

		return `
		<tr class="cart-item">
		<td>${index + 1}</td>
		<td>${cart.idOrder}</td>
		<td>${cart.fullname}</td>
		<td>${cart.phone}</td>
		<td>${formatDate(cart.dateBuy)}</td>
		<td>${cart.address}</td>
		<td>
			${statusEle}
		</td>
		<td>
			<button
				class="btn btn--primary cart-detail"
				onclick="showDetailCart('${cart.idOrder}')"
			>
				Xem chi tiết
			</button>
		</td>
	</tr>
		`;
	});
	cartsContainer.innerHTML = htmls.join('');
}
//
function renderProducts(productsShow, productsContainer) {
	let htmls = productsShow.map((product) => {
		let newItemEle = product.newItem
			? `
			<p class="products-new">
				<span>SẢN PHẨM MỚI</span>
			</p>`
			: '';
		let existEle = !product.isBusiness
			? `
			<p class="products-exist">
				<span>SẢN PHẨM NGỪNG KINH DOANH</span>
			</p>`
			: '';
		let editEle = product.isBusiness
			? `
				<button
					onclick="showEditProduct(${product.id})"
					class="btn btn--primary products-edit"
				>
					Chỉnh sửa
				</button>
				<button
					onclick="handleStopBusinessProduct(${product.id})"
					class="btn btn--primary products-del"
				>
					Ngừng kinh doanh
				</button>
				<button
					onclick="handleDelProduct(${product.id})"
					class="btn btn--primary products-del"
				>
					Xóa
				</button>
			`
			: `
				<button
					onclick="handleRecoveryProduct(${product.id})"
					class="btn btn--primary products-recovery"
				>
					Khôi phục
				</button>
				<button
					onclick="handleDelProduct(${product.id})"
					class="btn btn--primary products-del"
				>
					Xóa
				</button>
			`;
		///
		return `
			<div class="products-item">
				<div class="products-info">
					<div class="products-img">
						<img
							src="${product.img}"
							alt="${product.title}"
						/>
					</div>
					<div class="products-detail">
						<p class="products-name">
							${product.title}
						</p>
						<p class="products-price">
						${convertFormatPrice(product.price)}
						</p>
						<div class="products-more">
							<p class="products-category">
								<span>${product.category.toUpperCase()}</span>
								${existEle}
								${newItemEle}
							</p>

						</div>
					</div>
				</div>
				<div class="products-action">
					${editEle}
				</div>
			</div>
		`;
	});
	productsContainer.innerHTML = htmls.join('');
}
//
function renderAccounts(accountsShow, accountsContainer) {
	let htmls = accountsShow.map((account, index) => {
		let editEle = account.status
			? `
			
					<td>
						<button
							onclick="showEditAccount(${account.id})"
							class="btn btn--primary account-edit"
						>
							Chỉnh sửa
						</button>
					</td>
					<td>
						<button
							onclick="handleCancelAccount(${account.id})"
							class="btn btn--primary account-edit"
						>
							Tạm ngưng
						</button>
					</td>
					<td>
						<button
							onclick="handleDelAccount(${account.id})"
							class="btn btn--primary account-del"
						>
							Xóa
						</button>
					</td>
				`
			: `
			
				<td>
					<button
						onclick="handleRecoveryAccount(${account.id})"
						class="btn btn--primary accounts-recovery"
					>
						Khôi phục
					</button>
					
				</td>
			
			`;

		return `
			<tr class="account-item">
				<td>${++index}</td>
				<td>${account.fullname}</td>
				<td>${account.role.toUpperCase()}</td>
				<td>${account.username}</td>
				<td>${account.phone}</td>
				<td>${account.mail}</td>
				<td>${formatDate(account.join)}</td>
				${editEle}
			</tr>
			`;
	});
	accountsContainer.innerHTML += htmls.join('');
}
//
function showEditAccount(id) {
	let accounts = JSON.parse(localStorage.getItem('accounts'));
	let accEdit = accounts.find((item) => item.id === id);
	console.log(accEdit);
	handleHideModal();
	let htmls = `
	<div class="add">
	<div class="add-wp">
		<div class="add-top">
			<h3>CHỈNH SỬA THÔNG TIN TÀI KHOẢN</h3>
		</div>
		<div class="--separate-horizontal"></div>
		<div class="add-body">
			<div class="add-right">
				<div class="ar-wp">
					<div class="ar-form" id="form-6">
						<div class="ar-form-group">
							<label
								for="ar-form-fullname"
								class="ar-form-label"
								>Tên đầy đủ</label
							>
							<div class="ar-form-inp-wp">
								<input
									type="text"
									id="ar-form-fullname"
									class="ar-form-inp"
									value ="${accEdit.fullname}"
								/>
								<p class="form-message --color-red"></p>
							</div>
						</div>
						<div class="ar-form-group">
							<label
								for="ar-form-phone"
								class="ar-form-label"
								>Só điện thoại</label
							>
							<div class="ar-form-inp-wp">
								<input
									type="text"
									id="ar-form-phone"
									class="ar-form-inp"
									value ="${accEdit.phone}"
								/>
								<p class="form-message --color-red"></p>
							</div>
						</div>
						<div class="ar-form-group">
							<label
								for="ar-form-mail"
								class="ar-form-label"
								>Email</label
							>
							<div class="ar-form-inp-wp">
								<input
									type="text"
									id="ar-form-mail"
									class="ar-form-inp"
									value ="${accEdit.mail}"
									
								/>
								<p class="form-message --color-red"></p>
							</div>
						</div>
						<div class="ar-form-group">
							<label
								for="ar-form-password"
								class="ar-form-label"
								>Mật khẩu</label
							>
							<div class="ar-form-inp-wp">
								<input
									type="text"
									id="ar-form-password"
									class="ar-form-inp"
									value ="${accEdit.password}"
								/>
								<p class="form-message --color-red"></p>
							</div>
						</div>
					</div>
					<div class="ar-btn-add">
						<button
							class="btn btn--primary"
							onclick="handleEditAccount(${accEdit.id})"
						>
							Xác nhận
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
	`;
	modalBody.innerHTML = htmls;
	handleShowModal();
}
function handleEditAccount(id) {
	const fullname = document.querySelector('#ar-form-fullname');
	const phone = document.querySelector('#ar-form-phone');
	const password = document.querySelector('#ar-form-password');
	const mail = document.querySelector('#ar-form-mail');
	//
	let accounts = JSON.parse(localStorage.getItem('accounts'));
	let accountsToCompare = accounts.filter((acc) => acc.id !== id);
	//
	if (fullname.value && password.value && phone.value && mail.value) {
		let isExistAcc = accountsToCompare.some(
			(acc) =>
				acc.phone.trim() === phone.value.trim() ||
				acc.mail.trim() === mail.value.trim()
		);
		if (!isExistAcc) {
			let accEdit = accounts.find((item) => item.id === id);
			console.log(accEdit);
			accEdit.fullname = fullname.value;
			accEdit.phone = phone.value;
			accEdit.password = password.value;
			accEdit.mail = mail.value;
			localStorage.setItem('accounts', JSON.stringify(accounts));
			toast({
				title: 'Sửa thành công',
				message: 'Sửa tài khoản thành công',
				type: 'success',
				duration: 3000,
			});
			handleHideModal();
			showAccs();
		} else {
			toast({
				title: 'Tài khoản đẫ tồn tại',
				message:
					'Email hoặc số điện thoại của bạn có thể đã bị trùng vui lòng chọn lại',
				type: 'warning',
				duration: 3000,
			});
		}
	} else {
		//
		const inpEles = document.querySelectorAll('.ar-form-inp');
		inpEles.forEach((inpEle) => {
			if (!inpEle.value) {
				inpEle.parentNode.querySelector('.form-message').innerText =
					'Vui lòng nhập trường này';
			}
		});
	}
}
function handleDelAccount(id) {
	if (confirm('Bạn có muốn xóa tài khoản này?')) {
		let accounts = JSON.parse(localStorage.getItem('accounts'));
		let index = accounts.indexOf(accounts.find((acc) => acc.id === id));
		accounts.splice(index, 1);
		localStorage.setItem('accounts', JSON.stringify(accounts));
		showAccs();
	}
}
function handleCancelAccount(id) {
	if (confirm('Bạn có muốn tạm ngưng tài khoản sản phẩm này?')) {
		let accounts = JSON.parse(localStorage.getItem('accounts'));
		accounts.find((acc) => acc.id === id).status = 0;
		localStorage.setItem('accounts', JSON.stringify(accounts));
		showAccs();
	}
}
function handleRecoveryAccount(id) {
	if (confirm('Bạn có muốn khôi phục tài khoản sản phẩm này?')) {
		let accounts = JSON.parse(localStorage.getItem('accounts'));
		accounts.find((acc) => acc.id === id).status = 1;
		localStorage.setItem('accounts', JSON.stringify(accounts));
		showAccs();
	}
}
//
function showAddAcc() {
	handleHideModal();
	let htmls = `
	<div class="add">
	<div class="add-wp">
		<div class="add-top">
			<h3>THÊM TÀI KHOẢN MỚI</h3>
		</div>
		<div class="--separate-horizontal"></div>
		<div class="add-body">
			<div class="add-right">
				<div class="ar-wp">
					<div class="ar-form" id="form-6">
						<div class="ar-form-group">
							<label
								for="ar-form-fullname"
								class="ar-form-label"
								>Tên đầy đủ</label
							>
							<div class="ar-form-inp-wp">
								<input
									type="text"
									id="ar-form-fullname"
									class="ar-form-inp"
								/>
								<p class="form-message --color-red"></p>
							</div>
						</div>
						<div class="ar-form-group">
							<label
								for="ar-form-phone"
								class="ar-form-label"
								>Só điện thoại</label
							>
							<div class="ar-form-inp-wp">
								<input
									type="text"
									id="ar-form-phone"
									class="ar-form-inp"
								/>
								<p class="form-message --color-red"></p>
							</div>
						</div>
						<div class="ar-form-group">
							<label
								for="ar-form-mail"
								class="ar-form-label"
								>Email</label
							>
							<div class="ar-form-inp-wp">
								<input
									type="text"
									id="ar-form-mail"
									class="ar-form-inp"
								/>
								<p class="form-message --color-red"></p>
							</div>
						</div>
						<div class="ar-form-group">
							<label
								for="ar-form-username"
								class="ar-form-label"
								>Tên đăng nhập</label
							>
							<div class="ar-form-inp-wp">
								<input
									type="text"
									id="ar-form-username"
									class="ar-form-inp"
								/>
								<p class="form-message --color-red"></p>
							</div>
						</div>
						<div class="ar-form-group">
							<label
								for="ar-form-password"
								class="ar-form-label"
								>Mật khẩu</label
							>
							<div class="ar-form-inp-wp">
								<input
									type="text"
									id="ar-form-password"
									class="ar-form-inp"
								/>
								<p class="form-message --color-red"></p>
							</div>
						</div>
						<div class="ar-form-group">
							<label class="ar-form-label"
								>Loại tài khoản</label
							>
							<div class="ar-form-inp-wp">
								<select
									id="ar-form-role"
									class="ar-form-selection"
								>
									<option value="admin">Admin</option>
									<option value="customer">
										Customer
									</option>
								</select>
								<p class="form-message --color-red"></p>
							</div>
						</div>
					</div>
					<div class="ar-btn-add">
						<button
							class="btn btn--primary"
							onclick="handleAddAccount()"
						>
							Thêm tài khoản
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
	`;
	modalBody.innerHTML = htmls;
	Validator({
		form: '#form-6',
		rules: [
			Validator.isRequired('#ar-form-fullname'),
			Validator.isRequired('#ar-form-username'),
			Validator.isMail('#ar-form-mail'),
			Validator.isPhone('#ar-form-phone'),
			Validator.isPassword('#ar-form-password'),
		],
	});
	handleShowModal();
}
function handleAddAccount() {
	const fullname = document.querySelector('#ar-form-fullname');
	const phone = document.querySelector('#ar-form-phone');
	const username = document.querySelector('#ar-form-username');
	const password = document.querySelector('#ar-form-password');
	const role = document.querySelector('#ar-form-role');
	const mail = document.querySelector('#ar-form-mail');
	//
	let accounts = JSON.parse(localStorage.getItem('accounts'));
	//
	if (
		username.value &&
		password.value &&
		fullname.value &&
		phone.value &&
		role.value &&
		mail.value
	) {
		// Không được trùng sđt và tên đăng nhập
		let isExistAcc = accounts.some(
			(acc) =>
				acc.username.trim() === username.value.trim() ||
				acc.phone.trim() === phone.value.trim() ||
				acc.mail.trim() === mail.value.trim()
		);
		if (!isExistAcc) {
			let maxId = 0;
			accounts.forEach((acc) => {
				if (parseInt(acc.id) > maxId) maxId = parseInt(acc.id);
			});
			let newUser = {
				id: maxId + 1,
				fullname: fullname.value,
				phone: phone.value,
				mail: mail.value,
				username: username.value,
				password: password.value,
				role: role.value.toLowerCase(),
				status: 1,
				carts: [],
				orderedCarts: [],
				join: new Date(),
			};
			accounts.push(newUser);
			localStorage.setItem('accounts', JSON.stringify(accounts));
			toast({
				title: 'Thêm thành công',
				message: 'Thêm tài khoản thành công',
				type: 'success',
				duration: 3000,
			});
			handleHideModal();
			showAccs();
		} else {
			toast({
				title: 'Tài khoản đẫ tồn tại',
				message:
					'Tên đăng đăng nhập hoặc email hoặc số điện thoại của bạn có thể đã bị trùng vui lòng chọn lại',
				type: 'warning',
				duration: 3000,
			});
		}
	} else {
		//
		const inpEles = document.querySelectorAll('.ar-form-inp');
		inpEles.forEach((inpEle) => {
			if (!inpEle.value) {
				inpEle.parentNode.querySelector('.form-message').innerText =
					'Vui lòng nhập trường này';
			}
		});
	}
}
//
function showAddProduct() {
	handleHideModal();
	let htmls = `
	<div class="add">
		<div class="add-wp">
			<div class="add-top">
				<h3>THÊM SẢN PHẨM MỚI</h3>
			</div>
			<div class="--separate-horizontal"></div>
			<div class="add-body">
				<div class="add-left">
					<div class="al-wp">
						<div class="al-img">
							<img
								src="./assets/img/admin/blank-image.png"
								alt="Hình ảnh trống"
								id="product-prev-img"
							/>
						</div>
						<div class="al-form-group">
							<label
								for="al-form-upload"
								class="btn btn--primary al-form-label"
								>Chọn hình ảnh</label
							>
							<div class="al-form-inp-wp">
								<input
									accept="image/jpeg, image/png, image/jpg"
									type="file"
									class="al-form-inp"
									id="al-form-upload"
									onchange="uploadImage(this)"
								/>
								<p class="form-message --color-red">
									
								</p>
							</div>
						</div>
					</div>
				</div>
				<div class="--separate-vertical"></div>
				<div class="add-right">
					<div class="ar-wp">
						<div class="ar-form" id="form-5">
							<div class="ar-form-group">
								<label
									for="ar-form-name"
									class="ar-form-label"
									>Tên sản phẩm</label
								>
								<div class="ar-form-inp-wp">
									<input
										type="text"
										id="ar-form-name"
										class="ar-form-inp"
										placeholder="Nhập tên sản phẩm"
									/>
									<p class="form-message --color-red">
										
									</p>
								</div>
							</div>
							<div class="ar-form-group">
								<label
									for="ar-form-price"
									class="ar-form-label"
									>Giá sản phẩm</label
								>
								<div class="ar-form-inp-wp">
									<input
										type="text"
										id="ar-form-price"
										class="ar-form-inp"
										placeholder="VD: 350000"
									/>
									<p class="form-message --color-red">
										
									</p>
								</div>
							</div>
							<div class="ar-form-group">
								<label
									for="ar-form-size"
									class="ar-form-label"
									>Size sản phẩm</label
								>
								<div class="ar-form-inp-wp">
									<input
										type="text"
										id="ar-form-size"
										class="ar-form-inp"
										placeholder="VD: S, M, L, XL hoặc 29, 30, 31,..."
									/>
									<p class="form-message --color-red">
										
									</p>
								</div>
							</div>
							<div class="ar-form-group">
								<label
									for="ar-form-category"
									class="ar-form-label"
									>Danh mục</label
								>
								<div class="ar-form-group-wp">
									<select
										id="ar-form-category"
										class="ar-form-selection"
									>
										<option value="">
											Chọn danh mục
										</option>
										<option value="giày thể thao nam">
											Giày thể thao nam
										</option>
										<option value="giày tây nam">
											Giày tây nam
										</option>
										<option value="sandal nam">
											Sandal nam
										</option>
										<option value="dép nam">
											Dép nam
										</option>
										<option value="giày thể thao nữ">
											Giày thể thao nữ
										</option>
										<option value="sandal nu">
											Sandal nữ
										</option>
										<option value="dép nữ">
											Dép nữ
										</option>
										<option value="balo">
											Balo
										</option>
										<option value="tất">
											Tất
										</option>
										<option value="đế lót giày">Đế lót giày</option>
										<option value="dây giày">Dây giày</option>
										<option value="nước vệ sinh giày">Nước vệ sinh giày</option>
									</select>
									<p class="form-message --color-red">
										
									</p>
								</div>
							</div>
						</div>
						<div class="ar-btn-add">
							<button class="btn btn--primary" onclick="handleAddProduct()">
								Thêm sản phẩm
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	`;
	modalBody.innerHTML = htmls;
	handleShowModal();
}
function handleAddProduct() {
	let name = document.querySelector('#ar-form-name');
	let price = document.querySelector('#ar-form-price');
	let size = document.querySelector('#ar-form-size');
	let category = document.querySelector('#ar-form-category');
	// <img/>
	let srcImg = getPathImage(document.querySelector('#product-prev-img').src);
	if (
		name.value &&
		price.value &&
		size.value &&
		category.value &&
		!isNaN(price.value)
	) {
		let cateMain;
		let str = category.value.slice(0, category.value.indexOf(' '));
		if (str.toLowerCase() === 'giày nam') cateMain = 'giày nam';
		else if (str.toLowerCase() === 'giày nữ') cateMain = 'giày nữ';
		else cateMain = 'phụ kiện';

		let productNew = {
			id: createIdProduct(),
			title: name.value,
			price: parseInt(price.value),
			sizeLs: size.value.toUpperCase().split(','),
			status: 1,
			isBusiness: 1,
			img: srcImg,
			category: category.value,
			categoryMain: cateMain,
			newItem: true,
		};
		// !!! upload local
		if (confirm('Bạn đã kiểm tra kĩ thông tin và muốn thêm sản phẩm')) {
			let products = JSON.parse(localStorage.getItem('products'));
			products.unshift(productNew);
			localStorage.setItem('products', JSON.stringify(products));
			handleHideModal();
			toast({
				title: 'Thêm thành công',
				message: 'Thêm sản phẩm thành công',
				type: 'success',
				duration: 3000,
			});
			showPducts();
		}
	} else {
		//Hiện các err mess
		let formGroupEles = document.querySelectorAll('.ar-form-group');
		formGroupEles.forEach((formGroupEle) => {
			let inpEle = formGroupEle.querySelector('.ar-form-inp');
			if (inpEle) {
				let errEle = inpEle.parentNode.querySelector('.form-message');
				errEle.innerText = '';
				if (!inpEle.value)
					errEle.innerText = 'Trường này không được để trống';
			}
		});
		if (!category.value) {
			category.parentNode.querySelector('.form-message').innerText = '';
			category.parentNode.querySelector('.form-message').innerText =
				'Vui lòng chọn danh dục cho sản phẩm';
		}
	}
}
//
function handleConfirmEditProduct(id) {
	let products = JSON.parse(localStorage.getItem('products'));
	let productEdit = products.find((product) => product.id === id);
	let name = document.querySelector('#er-form-name');
	let price = document.querySelector('#er-form-price');
	let size = document.querySelector('#er-form-size');
	let category = document.querySelector('#er-form-category');
	// <img/>
	let srcImg = getPathImage(document.querySelector('#product-prev-img').src);
	if (
		name.value &&
		price.value &&
		size.value &&
		category.value &&
		!isNaN(price.value)
	) {
		let cateMain;
		let str = category.value.slice(0, category.value.indexOf(' '));
		if (str.toLowerCase() === 'giày nam') cateMain = 'giày nam';
		else if (str.toLowerCase() === 'giày nữ') cateMain = 'giày nữ';
		else cateMain = 'phụ kiện';

		let productNew = {
			id: id,
			title: name.value,
			price: parseInt(price.value),
			sizeLs: size.value.toUpperCase().split(','),
			status: 1,
			isBusiness: 1,
			img: srcImg,
			category: category.value,
			categoryMain: cateMain,
			newItem: productEdit.newItem ? true : false,
		};
		// !!! upload local
		console.log(productNew);
		productEdit.title = productNew.title;
		productEdit.price = productNew.price;
		productEdit.sizeLs = productNew.sizeLs;
		productEdit.img = productNew.img;
		productEdit.category = productNew.category;
		productEdit.categoryMain = productNew.categoryMain;

		// CONFIRM
		if (!confirm('Bạn có muốn chỉnh sửa?')) {
			handleHideModal();
			return;
		}
		//
		localStorage.setItem('products', JSON.stringify(products));
		handleHideModal();
		showPducts();
	} else {
		//Hiện các err mess
		let formGroupEles = document.querySelectorAll('.er-form-group');
		formGroupEles.forEach((formGroupEle) => {
			let inpEle = formGroupEle.querySelector('.er-form-inp');
			if (inpEle) {
				let errEle = inpEle.parentNode.querySelector('.form-message');
				errEle.innerText = '';
				if (!inpEle.value)
					errEle.innerText = 'Trường này không được để trống';
			}
		});
		if (!category.value) {
			category.parentNode.querySelector('.form-message').innerText = '';
			category.parentNode.querySelector('.form-message').innerText =
				'Vui lòng chọn danh dục cho sản phẩm';
		}
	}
}
function showEditProduct(id) {
	// handleHideModal();
	let productEdit = JSON.parse(localStorage.getItem('products')).find(
		(product) => product.id === id
	);
	let htmls = `
	<div class="edit">
		<div class="edit-wp">
			<div class="edit-top">
				<h3>CHỈNH SỬA SẢN PHẨM</h3>
			</div>
			<div class="--separate-horizontal"></div>
			<div class="edit-body">
				<div class="edit-left">
					<div class="el-wp">
						<div class="el-img">
							<img
								src="${productEdit.img}"
								alt="${productEdit.title}"
								id="product-prev-img"
							/>
						</div>
						<div class="el-form-group">
							<label
								for="el-form-upload"
								class="btn btn--primary el-form-label"
								>Chọn hình ảnh</label
							>
							<div class="el-form-inp-wp">
								<input
									accept="image/jpeg, image/png, image/jpg"
									type="file"
									class="el-form-inp"
									id="el-form-upload"
									onchange="uploadImage(this)"
								/>
								<p class="form-message --color-red">		
								</p>
							</div>
						</div>
					</div>
				</div>
				<div class="--separate-vertical"></div>
				<div class="edit-right">
					<div class="er-wp">
						<div class="er-form" id="form-5">
							<div class="er-form-group">
								<label
									for="er-form-name"
									class="er-form-label"
									>Tên sản phẩm</label
								>
								<div class="er-form-inp-wp">
									<input
										type="text"
										id="er-form-name"
										class="er-form-inp"
										value="${productEdit.title}"
									/>
									<p class="form-message --color-red">
										
									</p>
								</div>
							</div>
							<div class="er-form-group">
								<label
									for="er-form-price"
									class="er-form-label"
									>Giá sản phẩm</label
								>
								<div class="er-form-inp-wp">
									<input
										type="text"
										id="er-form-price"
										class="er-form-inp"
										value="${productEdit.price}"
									/>
									<p class="form-message --color-red">
										
									</p>
								</div>
							</div>
							<div class="er-form-group">
								<label
									for="er-form-size"
									class="er-form-label"
									>Size sản phẩm</label
								>
								<div class="er-form-inp-wp">
									<input
										type="text"
										id="er-form-size"
										class="er-form-inp"
										value="${productEdit.sizeLs.join(',')}"
									/>
									<p class="form-message --color-red">
										
									</p>
								</div>
							</div>
							<div class="er-form-group">
								<label
									for="er-form-category"
									class="er-form-label"
									>Danh mục</label
								>
								<div class="er-form-group-wp">
									<select
										id="er-form-category"
										class="er-form-selection"
									>
										<option value="${productEdit.category}">
										${productEdit.category}
										<option value="giày thể thao nam">
											Giày thể thao nam
										</option>
										<option value="giày tây nam">
											Giày tây nam
										</option>
										<option value="sandal nam">
											Sandal nam
										</option>
										<option value="dép nam">
											Dép nam
										</option>
										<option value="giày thể thao nữ">
											Giày thể thao nữ
										</option>
										<option value="sandal nữ">
											Sandal nữ
										</option>
										<option value="dép nữ">
											Dép nữ
										</option>
										<option value="balo">
											Balo
										</option>
										<option value="tất">
											Tất
										</option>
										<option value="đế lót giày">Đế lót giày</option>
										<option value="dây giày">Dây giày</option>
										<option value="nước vệ sinh giày">Nước vệ sinh giày</option>
									</select>
									<p class="form-message --color-red">
										
									</p>
								</div>
							</div>
						</div>
						<div class="er-btn-edit">
							<button class="btn btn--primary" onclick="handleConfirmEditProduct(${
								productEdit.id
							})">
								Xác nhận
							</button>
							<button class="btn btn--primary" onclick="handleResetProduct(${
								productEdit.id
							})">
								Reset
							</button>
							<button class="btn btn--primary" onclick="handleHideModal()">
								Hủy bỏ
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	`;
	modalBody.innerHTML = htmls;
	// Kiem tra inp
	handleShowModal();
}
//
//
function handleResetProduct(id) {
	showEditProduct(id);
	handleShowModal();
}
//
//
function handleStopBusinessProduct(id) {
	if (confirm('Bạn có chắc chắn ngừng kinh doanh sản phẩm này?')) {
		let products = JSON.parse(localStorage.getItem('products'));
		products.find((product) => product.id === id).isBusiness = false;
		localStorage.setItem('products', JSON.stringify(products));
		showPducts();
	}
}
//
function handleRecoveryProduct(id) {
	if (confirm('Bạn có chắc chắn khôi phục sản phẩm này?')) {
		let products = JSON.parse(localStorage.getItem('products'));
		products.find((product) => product.id === id).isBusiness = true;
		localStorage.setItem('products', JSON.stringify(products));
		showPducts();
	}
}
//
function handleDelProduct(id) {
	if (confirm('Bạn có chắc chắn xóa sản phẩm này?')) {
		let products = JSON.parse(localStorage.getItem('products'));
		let index = products.indexOf(
			products.find((product) => product.id === id)
		);
		// console.log(index);
		products.splice(index, 1);
		// console.log(products);
		localStorage.setItem('products', JSON.stringify(products));
		showPducts();
	}
}

window.onload = () => {
	let currentUser = JSON.parse(localStorage.getItem('currentAccount'));
	adminName.innerText = currentUser.fullname;
	adminAvt.src = currentUser.avt;
};
//ESC close modal
window.onkeydown = function (event) {
	if (event.keyCode == 27) {
		btnCloseModal.click();
	}
};
btnCloseModal.addEventListener('click', handleHideModal);
//
modal.addEventListener('click', (e) => {
	if (e.target === e.currentTarget) handleHideModal();
});
//
function handleShowModal() {
	modal.classList.toggle('open');
	modal.classList.remove('hide');
}
function handleHideModal() {
	modal.classList.toggle('hide');
	modal.classList.remove('open');
}
// function handleEdit() {}
// function handleDelete() {}
// function handleRecovery() {}

//
// Create id new product
function createIdProduct() {
	let totalQuantity = 0;
	let products = JSON.parse(localStorage.getItem('products'));
	products.forEach((product) => totalQuantity++);
	return ++totalQuantity;
}
// Change Img
function uploadImage(ele) {
	let path = './assets/img/products/' + ele.value.split('\\')[2];
	console.log('path:', path);
	document.querySelector('#product-prev-img').setAttribute('src', path);
}
function getPathImage(path) {
	let patharr = path.split('/');
	return './assets/img/products/' + patharr[patharr.length - 1];
}
