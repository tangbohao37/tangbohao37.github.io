// 主线程代码立即执行，setTimeout 是异步代码，then 会马上执行，这个时候判断
// Promise 状态，状态是 Pending，然而之前并没有判断等待这个状态

const MyPromise2 = require('./promise2');

let p = new MyPromise2((resolve, reject) => {
  setTimeout(() => {
    resolve('do resolve');
  }, 10);
});

p.then(
  (res) => {
    console.log(res);
  },
  (err) => {
    console.log(err);
  },
);

// 结果 do resolve

// 测试多次调用
const promise = new MyPromise2((resolve, reject) => {
  setTimeout(() => {
    resolve('success');
  }, 2000);
});

promise.then((value) => {
  console.log(1);
  console.log('resolve', value);
});

promise.then((value) => {
  console.log(2);
  console.log('resolve', value);
});

promise.then((value) => {
  console.log(3);
  console.log('resolve', value);
});

// 结果
// 1
// resolve success
// 2
// resolve success
// 3
// resolve success
