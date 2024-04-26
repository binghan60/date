import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js';
import { getDatabase, ref, set, remove, onChildAdded, onChildRemoved } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js';
let UserLineID;
let UserName;
let UserAvatar;
let UserColor;
const globalDate = new Date();
const globalTime = {
	year: globalDate.getFullYear(),
	month: globalDate.getMonth() + 1,
	day: globalDate.getDate(),
};
const liffId = '2004399791-1P0wl6O3';
const firebaseConfig = {
	apiKey: 'AIzaSyDiZCrASUKeHznvMqOnFleo2dEkEIBlD50',
	authDomain: 'lifffriendtools.firebaseapp.com',
	databaseURL: 'https://lifffriendtools-default-rtdb.asia-southeast1.firebasedatabase.app',
	projectId: 'lifffriendtools',
	storageBucket: 'lifffriendtools.appspot.com',
	messagingSenderId: '789353136157',
	appId: '1:789353136157:web:bc5991d0dcad127d3146f4',
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
document.addEventListener('DOMContentLoaded', () => {
	init();
});
async function init() {
	await liff.init({ liffId });
	if (!liff.isLoggedIn()) {
		liff.login({ redirectUri: location.href });
	}
	const profile = await liff.getProfile();
	UserLineID = profile.userId;
	UserName = profile.displayName;
	UserAvatar = profile.pictureUrl;
	// set(ref(db, 'user/' + UserLineID), {
	// 	UserLineID,
	// 	UserName,
	// 	UserAvatar,
	// });
	const now = new Date();
	const year = now.getFullYear();
	const month = now.getMonth() + 1;
	const day = now.getDate();
	Module.changeCalendar(year, month, day);
	onChildAdded(ref(db, 'date'), (data) => {
		const dataObj = data.val();
		const element = document.querySelector(`#day${dataObj.day}`);
		const dot = document.createElement('span');
		dot.style.backgroundColor = UserColor;
		dot.classList.add('dot', dataObj.UserLineID);
		dot.id = data.key;
		element?.appendChild(dot);
	});
	onChildRemoved(ref(db, 'date'), (data) => {
		const dot = document.querySelector(`#${data.key}`);
		dot.remove();
	});
	onChildAdded(ref(db, 'user'), (data) => {
		const user = data.val();
		const userIcon = `<div>
							<span class="icon" style="background-color:${user.color}"></span>
							<span class="userName">${user.UserName}</span>
						</div>`;
		document.querySelector('.member').innerHTML += userIcon;
		if (UserLineID === user.UserLineID) {
			UserColor = user.color;
		}
		if (UserColor) {
			document.querySelector('#loading').style.display = 'none';
		}
	});
}
Module.changeCalendar = function (year, month, day = '') {
	const daysInMonth = new Date(year, month, 0).getDate();
	const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
	const monthOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	const totalShowDay = 42;
	const whiteDay = totalShowDay - daysInMonth;
	document.querySelector('.calendar .days').innerHTML = '';
	document.querySelector('.calendar .month').innerHTML = `${year} <i class="icon fa-solid fa-caret-left" onclick="${month <= 1 ? `Module.changeCalendar(${year - 1},${month + 11})` : `Module.changeCalendar(${year},${month - 1})`}"></i> <span style="display:inline-block;text-align:center;width:160px">${monthOfYear[month - 1]}</span> <i class="icon fa-solid fa-caret-right" onclick="${month >= 12 ? `Module.changeCalendar(${year + 1},${month - 11})` : `Module.changeCalendar(${year},${month + 1})`}"></i>`;
	for (let i = 0; i < firstDayOfMonth; i++) {
		document.querySelector('.calendar .days').innerHTML += '<span></span>';
	}
	for (let i = 1; i <= daysInMonth; i++) {
		let daysHTML = `<span onclick=Module.setDot(${year},${month},${i},event) >${i}<span id=day${i} class="dots"></span></span>`;
		if (globalTime.month == month && i === globalTime.day) {
			daysHTML = `<span onclick=Module.setDot(${year},${month},${i},event) style=backGround-color:#D2E9FF>${i}<span id=day${i} class="dots"></span></span>`;
		} else if (globalTime.month > month || (globalTime.month === month && i < globalTime.day)) {
			daysHTML = `<span onclick=Module.setDot(${year},${month},${i},event) class=disable>${i}<span id=day${i} class="dots"></span></span>`;
		}
		document.querySelector('.calendar .days').innerHTML += daysHTML;
	}
	for (let i = 0; i < whiteDay - firstDayOfMonth; i++) {
		document.querySelector('.calendar .days').innerHTML += '<span></span>';
	}
};
Module.setDot = function (year, month, day, event) {
	const createTime = new Date();
	const timestamp = createTime.getTime();
	const haveDot = event.target.querySelector(`.dot.${UserLineID}`);
	if (haveDot === null) {
		set(ref(db, 'date/' + UserLineID + timestamp), {
			UserLineID,
			UserName,
			year,
			month,
			day,
			createTime,
		});
	} else {
		remove(ref(db, 'date/' + haveDot.id));
	}
};
//寫一個function針對當月生點點 給id

//在onChildAdd中儲存FireBase傳來的資料
//寫一個function在(年,月,日)創造點點
