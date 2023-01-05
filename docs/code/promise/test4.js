const MyPromise = require('./promise4');

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

const promise2 = new MyPromise((resolve, reject) => {
  resolve(100);
  // throw new Error('执行错误');
});
promise2
  .then(
    (value) => {
      console.log(0);
      throw new Error('then 执行错误');
    },
    (err) => {
      console.log(1);
      console.log(err);
    },
  )
  .then(
    (res) => {
      console.log(2);
    },
    (err) => {
      console.log(3);
      console.log(err);
    },
  );
