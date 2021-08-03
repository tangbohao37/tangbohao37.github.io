const MyPromise = require('./promise3');

// 实现 链式调用
/**
 * then 方法要链式调用那么就需要返回一个 Promise 对象
 * then 方法里面 return 一个返回值作为下一个 then 方法的参数，
 * 如果是 return 一个 Promise 对象，那么就需要判断它的状态
 */

const promise1 = new MyPromise((resolve, reject) => {
  // 目前这里只处理同步的问题
  resolve('success');
});

promise1
  .then((value) => {
    console.log('resolve', value);
    return new MyPromise((resolve) => {
      resolve('do inner promise ');
    });
  })
  .then((value) => {
    console.log('resolve', value);
  });

// 结果
// resolve success
// resolve do inner promise

//TODO: 如果 then 返回自己的 promise 的话 就会发生循环调用 ,
// 使用原生 promise 会报 TypeError: Chaining cycle detected for promise #<Promise>
const promise2 = new MyPromise((resolve, reject) => {
  resolve(100);
});
const p1 = promise2.then(
  (value) => {
    console.log(value);
    return p1;
  },
  (err) => {
    // 这里不会执行
    console.log(1);
    console.log(err);
  },
);

p1.then(
  (res) => {},
  (err) => {
    // 这里会执行
    console.log(err);
  },
);
//  结果： TypeError: MyPromise Chaining cycle detected for promise #<Promise>
