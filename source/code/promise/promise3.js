// 先定义三个常量表示状态
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise {
  // 状态
  status = PENDING;
  // 返回的值
  value = null;
  // 失败后返回的值
  reason = null;
  // 缓存成功回调
  onFulfilledCallback = [];
  // 缓存失败回调
  onRejectedCallback = [];

  constructor(executor) {
    // 执行器  new 的时候立即执行
    executor(this.resolve, this.reject);
  }

  resolve = (value) => {
    if (this.status === PENDING) {
      this.status = FULFILLED;
      this.value = value;
      while (this.onFulfilledCallback.length) {
        this.onFulfilledCallback.shift()(this.value);
      }
    }
  };
  reject = (err) => {
    if (this.status === PENDING) {
      this.status = REJECTED;
      this.reason = err;
      while (this.onRejectedCallback.length) {
        this.onRejectedCallback.shift()(this.reason);
      }
    }
  };

  then = (onFulfilled, onRejected) => {
    // TODO: 为了链式调用这里直接创建一个 MyPromise，并在后面 return 出去
    const promise = new MyPromise((resolve, reject) => {
      if (this.status === FULFILLED) {
        // TODO:创建微任务 等待 promise 初始化完成
        // 否则语法报错 不能在 init 之前使用promise
        queueMicrotask(() => {
          // 链式调用这里的 res 就可能是:一个新的 promise 对象 || 普通返回值
          const res = onFulfilled(this.value);
          // TODO:对返回值进行处理
          resolvePromise(promise, res, resolve, reject);
        });
      } else if (this.status === REJECTED) {
        // TODO:创建微任务 等待 promise 初始化完成
        // 否则语法报错 不能在 init 之前使用promise
        queueMicrotask(() => {
          // 链式调用这里的 res 就可能是:一个新的 promise 对象 || 普通返回值
          const res = onRejected(this.value);
          // TODO:对返回值进行处理
          resolvePromise(promise, res, resolve, reject);
        });
        onRejected(this.reason);
      } else if (this.status === PENDING) {
        this.onFulfilledCallback.push(onFulfilled);
        this.onRejectedCallback.push(onRejected);
      }
    });

    return promise;
  };
}

function resolvePromise(self, x, resolve, reject) {
  // ADD：
  if (x === self) {
    return reject(
      new TypeError('MyPromise Chaining cycle detected for promise #<Promise>'),
    );
  }

  // 判断x是不是 MyPromise 实例对象
  if (x instanceof MyPromise) {
    // 执行 x，调用 then 方法，目的是将其状态变为 fulfilled 或者 rejected
    // x.then(value => resolve(value), reason => reject(reason))
    // 简化之后
    x.then(resolve, reject);
  } else {
    // 普通值
    resolve(x);
  }
}

module.exports = MyPromise;
