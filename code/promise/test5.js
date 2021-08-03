const MyPromise = require('./promise5');

// TODO: 捕获执行器中的代码，如果执行器中有代码错误，那么 Promise 的状态要变为失败
const promise = new MyPromise((resolve, reject) => {
  // resolve(100);
  throw new Error('执行错误');
});
const p1 = promise.then(
  (value) => {
    console.log(value);
    return p1;
  },
  (err) => {
    console.log(1);
    console.log(err);
  },
);

const promise1 = new MyPromise((resolve, reject) => {
  resolve(100);
  // throw new Error('执行错误');
});

promise1
  .then()
  .then()
  .then((value) => console.log(value));

const promise2 = new MyPromise((resolve, reject) => {
  reject('err');
});

promise2
  .then()
  .then()
  .then(
    (value) => console.log(value),
    (reason) => console.log(reason),
  );

// 实现 resolve 与 reject 的静态调用
MyPromise.resolve()
  .then(() => {
    console.log(0);
    return MyPromise.resolve(4);
  })
  .then((res) => {
    console.log(res);
  });
