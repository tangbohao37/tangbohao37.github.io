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
  constructor(executor) {
    // 执行器  new 的时候立即执行
    executor(this.resolve, this.reject);
  }

  resolve = (value) => {
    if (this.status === PENDING) {
      this.status = FULFILLED;
      this.value = value;
    }
  };
  reject = (err) => {
    if (this.status === PENDING) {
      this.status = REJECTED;
      this.reason = err;
    }
  };

  then = (onFulfilled, onRejected) => {
    if (this.status === FULFILLED) {
      onFulfilled(this.value);
    } else if (this.status === REJECTED) {
      onRejected(this.reason);
    }
  };
}

module.exports = MyPromise;
