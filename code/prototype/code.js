var F = function () {
  console.log(1);
};

Function.prototype.a = function () {
  console.log("a");
};
Object.prototype.b = function () {
  console.log("b");
};

var f = new F();

f.a();
f.b();
F.a();
F.b();

// 输出啥？

// 错误答案: abab
