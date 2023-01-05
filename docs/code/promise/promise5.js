// 先定义三个常量表示状态
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';
// TODO:
// 增加异步状态下的链式调用
// 增加回调函数执行结果的判断
// 增加识别 Promise 是否返回自己
// 增加错误捕获

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

  // TODO: 增加静态方法
  static resolve(param) {
    if (param instanceof MyPromise) {
      return param;
    }

    return new MyPromise((resolve) => {
      resolve(param);
    });
  }

  // TODO: 增加静态方法
  static reject(reason) {
    return new MyPromise((resolve, reject) => {
      reject(reason);
    });
  }

  constructor(executor) {
    // 执行器  new 的时候立即执行
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
    /**
     * 上面我们处理 then 方法的时候都是默认传入 onFulfilled、onRejected 两个回调函数，
     * 但是实际上原生 Promise 是可以选择参数的单传或者不传，都不会影响执行。
     */
    onFulfilled =
      typeof onFulfilled === 'function' ? onFulfilled : (value) => value;
    onRejected =
      typeof onRejected === 'function' ? onRejected : (value) => value;

    // 为了链式调用这里直接创建一个 MyPromise，并在后面 return 出去
    const promise = new MyPromise((resolve, reject) => {
      if (this.status === FULFILLED) {
        // 如果是链式调用这里的 res 就是一个新的 promise 对象

        // const res = onFulfilled(this.value);
        // ADD:创建微任务 等待 promise 初始化完成
        // 否则语法报错 不能在 init 之前使用promise

        // resolvePromise(promise, res, resolve, reject);
        queueMicrotask(() => {
          // ADD:
          try {
            const res = onFulfilled(this.value);
            resolvePromise(promise, res, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      } else if (this.status === REJECTED) {
        queueMicrotask(() => {
          try {
            const res = onRejected(this.reason);
            resolvePromise(promise, res, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      } else if (this.status === PENDING) {
        this.onFulfilledCallback.push(() => {
          queueMicrotask(() => {
            try {
              const res = onFulfilled(this.value);
              resolvePromise(promise, res, resolve, reject);
            } catch (error) {
              reject(error);
            }
          });
        });
        this.onRejectedCallback.push(() => {
          queueMicrotask(() => {
            try {
              const res = onRejected(this.reason);
              resolvePromise(promise, res, resolve, reject);
            } catch (error) {
              reject(error);
            }
          });
        });
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
