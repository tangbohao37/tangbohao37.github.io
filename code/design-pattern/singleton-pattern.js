// 通过自执行函数+闭包 实现
var CreateDiv = (function () {
  var instants = null;
  var CreateDiv = function (html) {
    if (instants) {
      return instants;
    }
    this.html = html;
    this.init();
    instants = this;
    return instants;
  };
  CreateDiv.prototype.init = function (html) {
    this.html = html;
    var div = document.createElement('div');
    div.innerHTML = this.html;
    document.appendChild(div);
  };
  return CreateDiv;
})();

// 使用
var a = new CreateDiv();
var b = new CreateDiv();
// a === b

// 用代理实现单例
var CreateDiv = function (html) {
  this.html = html;
  this.init();
};
CreateDiv.prototype.init = function (html) {
  this.html = html;
  var div = document.createElement('div');
  div.innerHTML = this.html;
  document.appendChild(div);
};

var ProxySingletonCreateDiv = (function () {
  var instants = null;

  return function (html) {
    if (!instants) {
      instants = new CreateDiv(html);
    }
    return instants;
  };
})();

var a = ProxySingletonCreateDiv('a');
var b = ProxySingletonCreateDiv('b');
// a === b
