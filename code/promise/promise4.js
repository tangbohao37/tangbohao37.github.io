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
    // TODO：捕获异常
    try {
      executor(this.resolve, this.reject);
    } catch (error) {
      this.reject(error);
    }
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
    // 为了链式调用这里直接创建一个 MyPromise，并在后面 return 出去
    const promise = new MyPromise((resolve, reject) => {
      if (this.status === FULFILLED) {
        queueMicrotask(() => {
          // TODO：捕获异常
          try {
            const res = onFulfilled(this.value);
            resolvePromise(promise, res, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      } else if (this.status === REJECTED) {
        // TODO：捕获异常
        queueMicrotask(() => {
          try {
            const res = onRejected(this.reason);
            resolvePromise(promise, res, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      } else if (this.status === PENDING) {
        this.onFulfilledCallback.push(onFulfilled);
        this.onRejectedCallback.push(onRejected);
      }
    });

    return promise;
  };
}

function resolvePromise(self, x, resolve, reject) {
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
