// 节流
function throttle(fn, wait) {
  let timer = 0; // 初始值为0 则：首次立即执行   Infinity 则首次不立即执行

  return function () {
    let _this = this;
    if (Date.now() - timer >= wait) {
      fn.apply(_this, arguments);
    }
    timer = Date.now();
  };
}

const fn = throttle(function () {
  console.log(111);
}, 1000);

document.addEventListener('mousemove', function () {
  fn();
});
