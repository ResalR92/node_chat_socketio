const moment = require('moment');

// Jan 1st 1970 00:00:10 am --- 1000 -- mili second

// var date = new Date();
// var months = ['Jan','Feb'];

// console.log(date.getMonth());


let createdAt = 1234;
let date = moment(createdAt);
date.add(100,'year').subtract(9,'months');
console.log(date.format("MMMM Do YYYY, h:mm:ss a"));

let date2 = moment().valueOf();
console.log(date2);
