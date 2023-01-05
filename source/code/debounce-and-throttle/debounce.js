// 防抖
function debounce(fn, wait) {
  let timer = null;

  return function () {
    let _this = this;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(function () {
      fn.apply(_this, arguments);
      timer = null;
    }, wait);
  };
}



document.addEventListener('mousemove', function () {
  fn();
});
