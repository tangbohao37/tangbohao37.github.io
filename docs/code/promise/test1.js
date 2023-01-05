const MyPromise = require('./promise1');

// 测试1
let p = new MyPromise((resolve, reject) => {
  resolve('do resolve');
  reject('do reject');
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

