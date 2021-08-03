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
      // TODO:当状态改变后,执行回调队列的方法
      while (this.onFulfilledCallback.length) {
        this.onFulfilledCallback.shift()(this.value);
      }
    }
  };
  reject = (err) => {
    if (this.status === PENDING) {
      this.status = REJECTED;
      this.reason = err;
      // TODO:当状态改变后,执行回调队列的方法
      while (this.onRejectedCallback.length) {
        this.onRejectedCallback.shift()(this.reason);
      }
    }
  };

  then = (onFulfilled, onRejected) => {
    if (this.status === FULFILLED) {
      onFulfilled(this.value);
    } else if (this.status === REJECTED) {
      onRejected(this.reason);
    } else if (this.status === PENDING) {
      // TODO: 因为不知道后面状态的变化情况，所以将成功回调和失败回调存储起来 等到执行成功失败函数的时候再传递
      this.onFulfilledCallback.push(onFulfilled);
      this.onRejectedCallback.push(onRejected);
    }
    // 加入异步
  };
}

module.exports = MyPromise;
