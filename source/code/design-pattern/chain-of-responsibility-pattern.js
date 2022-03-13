//  orderType:订单类型 1:交500定金的用户 2:交200定金的用户 3:普通用户
//  pay : 是否支付定金
//  stock : 用于普通用户的手机库存
var order500 = function (orderType, pay, stock) {
  if (orderType === 1 && pay) {
    console.log("500定金,得100优惠卷");
  } else {
    return "next";
  }
};

var order200 = function (orderType, pay, stock) {
  if (orderType === 2 && pay) {
    console.log("200定金,得50优惠卷");
  } else {
    return "next";
  }
};

var orderNormal = function (orderType, pay, stock) {
  if (stock > 0) {
    console.log("普通用户，无优惠券");
  } else {
    return "next";
  }
};

Function.prototype.after = function (fn) {
  var self = this; // 指向起始方法自己
  return function () {
    // 这里 this 指向 window
    var res = self.apply(this, arguments);
    if (res === "next") {
      return fn.apply(this, arguments);
    }
    return res;
  };
};

var order = order500.after(order200).after(orderNormal);

order(1, true, 500);
