import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js';
import { getDatabase, ref, set, remove, onChildAdded, onChildRemoved } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js';
let UserLineID;
let UserName;
let UserAvatar;
const globalDate = new Date();
const globalTime = {
	year: globalDate.getFullYear(),
	month: globalDate.getMonth() + 1,
	day: globalDate.getDate(),
};
console.log(globalTime);
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
	set(ref(db, 'user/' + UserLineID), {
		UserLineID,
		UserName,
		UserAvatar,
	});
	const now = new Date();
	const year = now.getFullYear();
	const month = now.getMonth() + 1;
	const day = now.getDate();
	Module.changeCalendar(year, month, day);
	onChildAdded(ref(db, 'date'), (data) => {
		console.log(data.val());
		const dataObj = data.val();
		const element = document.querySelector(`#day${dataObj.day}`);
		const dot = document.createElement('span');
		dot.classList.add('dot', dataObj.UserLineID);
		dot.id = data.key;
		element?.appendChild(dot);
	});
	onChildRemoved(ref(db, 'date'), (data) => {
		const dot = document.querySelector(`#${data.key}`);
		dot.remove();
	});
}
Module.changeCalendar = function (year, month, day = '') {
	day--;
	const daysInMonth = new Date(year, month, 0).getDate();
	const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
	const monthOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	const totalShowDay = 42;
	const whiteDay = totalShowDay - daysInMonth;
	document.querySelector('.calendar .days').innerHTML = '';
	document.querySelector('.calendar .month').innerHTML = `${year} <i class="icon fa-solid fa-caret-left"></i> ${monthOfYear[month - 1]} <i class="icon fa-solid fa-caret-right"></i>`;
	for (let i = 0; i < firstDayOfMonth; i++) {
		document.querySelector('.calendar .days').innerHTML += '<span></span>';
	}
	for (let i = 0; i < daysInMonth; i++) {
		let daysHTML = `<span onclick=Module.setDot(${year},${month},${i + 1},event) >${i + 1}<span id=day${i + 1} class="dots"></span></span>`;
		if (i === day) {
			daysHTML = `<span onclick=Module.setDot(${year},${month},${i + 1},event) style=backGround-color:#D2E9FF>${i + 1}<span id=day${i + 1} class="dots"></span></span>`;
		}
		if (i < day) {
			daysHTML = `<span onclick=Module.setDot(${year},${month},${i + 1},event) class=disable>${i + 1}<span id=day${i + 1} class="dots"></span></span>`;
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
