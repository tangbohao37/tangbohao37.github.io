var each = function (arr, callback) {
  for (let i = 0; i < arr.length; i++) {
    const element = arr[i];
    // 保持callback 内部 this 指向自己,参数传入当前对象和下标
    callback.call(element, element, i);
  }
};

each([1, 2, 3, 4], function (item, index) {
  console.log(item, index);
});

var Iterator = function (obj) {
  var current = 0;

  var next = function () {
    current += 1;
  };
  var isDone = function () {
    current >= obj.length;
  };

  var getCurrentItem = function () {
    return obj[current];
  };

  return {
    next,
    isDone,
    getCurrentItem,
  };
};
