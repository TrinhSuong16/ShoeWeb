function Validator(options) {
	function validate(inpEle, rule) {
		let errMess = rule.test(inpEle.value);
		let errMessEle = inpEle.parentElement.querySelector('.form-message');
		errMess ? (errMessEle.innerText = errMess) : (errMessEle.innerText = '');
		//
		let iconEle = errMessEle.parentNode.querySelector(
			'.auth-form__body-icon'
		);
		if (iconEle) {
			iconEle.classList.remove('--invalid');
			iconEle.classList.add('--invalid');
		}
	}
	function validateCheckBox(inpEle, rule) {
		let errMess = rule.test(inpEle.checked);
		let errMessEle =
			inpEle.parentElement.parentElement.querySelector('.form-message');
		errMess ? (errMessEle.innerText = errMess) : (errMessEle.innerText = '');
	}

	let formEle = document.querySelector(options.form);
	if (formEle) {
		options.rules.forEach((rule) => {
			let inpEle = formEle.querySelector(rule.selector);
			if (inpEle) {
				inpEle.onblur = () => {
					if (inpEle.attributes[0].nodeValue === 'checkbox') {
						validateCheckBox(inpEle, rule);
						// console.log(inpEle.checked);
					} else validate(inpEle, rule);
				};
			}
		});
	}
}

// Nguyen tac cua cac rule
//1.khi co loi thi => mess loi
//2.khi khong co loi => undefine
Validator.isRequired = function (selector) {
	return {
		selector,
		test(value) {
			return value.trim() ? undefined : 'Vui lòng nhập trường này';
		},
	};
};
Validator.isPhone = function (selector) {
	return {
		selector,
		test(value) {
			let regex = /^\d{10}$/;
			return value.match(regex) ? undefined : 'Số điện thoại không hợp lệ';
		},
	};
};
Validator.isMail = function (selector) {
	return {
		selector,
		test(value) {
			// let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
			let regex = /^\w+([\.-]?\w+)*@gmail*(\.\w{2,3})+$/;
			// let regex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
			return value.match(regex) ? undefined : 'Trường này phải là email';
		},
	};
};
Validator.isPassword = function (selector) {
	return {
		selector,
		test(value) {
			let regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
			return value.match(regex)
				? undefined
				: 'Mật khẩu 6-20 ký tự, ít nhất một chữ thường, hoa, số';
		},
	};
};

Validator.isPasswordNew = function (selector) {
	return {
		selector,
		test(value) {
			let regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
			return value.match(regex) ? undefined : 'Mật khẩu không hợp lệ';
		},
	};
};
Validator.isConfirmPassword = function (selector) {
	return {
		selector,
		test(value) {
			if (value) {
				let psw = document.querySelector('#password').value;
				if (psw.length > 0) {
					return psw.match(value)
						? undefined
						: 'Mật khẩu nhập lại không trùng';
				} else {
					return 'Nhập mật khẩu trước khi nhập trường này';
				}
			} else return 'Trường này khồng được để trống';
		},
	};
};

// doi dinh dang tien VND
function convertFormatPrice(price) {
	const VND = new Intl.NumberFormat('vi-VN', {
		style: 'currency',
		currency: 'VND',
	});
	return VND.format(price);
}
// chuyen tieng viet ve khong dau
function removeVietnameseTones(str) {
	str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
	str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
	str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
	str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
	str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
	str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
	str = str.replace(/đ/g, 'd');
	str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
	str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
	str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
	str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
	str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
	str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
	str = str.replace(/Đ/g, 'D');
	// Some system encode vietnamese combining accent as individual utf-8 characters
	// Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
	str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
	str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
	// Remove extra spaces
	// Bỏ các khoảng trắng liền nhau
	str = str.replace(/ + /g, ' ');
	str = str.trim();
	// Remove punctuations
	// Bỏ dấu câu, kí tự đặc biệt
	str = str.replace(
		/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
		' '
	);
	return str;
}
// Format Date
function formatDate(date) {
	let fm = new Date(date);
	let yyyy = fm.getFullYear();
	let mm = fm.getMonth() + 1;
	let dd = fm.getDate();
	if (dd < 10) dd = '0' + dd;
	if (mm < 10) mm = '0' + mm;
	return dd + '/' + mm + '/' + yyyy;
}
