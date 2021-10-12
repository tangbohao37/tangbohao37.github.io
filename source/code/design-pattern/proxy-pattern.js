var MyImg = (function () {
  var img = document.createElement('img');
  document.body.appendChild(img);
  return {
    setSrc: function (src) {
      img.src = src;
    },
  };
})();

var ProxyImg = (function () {
  var img = new Image();
  img.onload = function () {
    // 这里this 只想 img 标签
    MyImg.setSrc(this.src);
  };
  return {
    setImage: function (src) {
      MyImg.setSrc('loading.gif');
      img.src = src;
    },
  };
})();

ProxyImg.setImage('src.png');

// 乘积
var mult = function () {
  var a = 1;
  for (let i = 0; i < arguments.length; i++) {
    const element = arguments[i];
    a = a * element;
  }
  return a;
};

// 代理缓存工厂

var createProxyFactory = function (fn) {
  var cache = {};
  return function () {
    var arr = Array.prototype.join.call(arguments, ',');
    if (arr in cache) {
      return cache[arr];
    }
    return (cache[arr] = fn(arguments));
  };
};

var proxyMult = createProxyFactory(mult);

console.log(proxyMult(1, 2, 3, 4));
console.log(proxyMult(1, 2, 3, 4));
