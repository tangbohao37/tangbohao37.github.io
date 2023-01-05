// dom 绑定 click 事件场景
// 绑定命令函数
var setCommand = function (button, command) {
  button.onclick = function () {
    command.execute();
  };
};

// 封装命令方法
var MenuBar = {
  refresh: function () {
    console.log('刷新');
  },
};

// 封装命令类
var refreshCommand = function (receiver) {
  this.receiver = receiver;
};
refreshCommand.prototype.execute = function () {
  this.receiver.refresh();
};

// 创建命令对象
var refresh = new refreshCommand(MenuBar);

const btn = document.getElementsByTagName('button')[0];
setCommand(btn, refresh);

// dom 绑定 click 事件场景
// 绑定命令函数
var setCommand = function (button, command) {
  button.onclick = function () {
    command.execute();
  };
};

// 封装命令方法
var MenuBar = {
  refresh: function () {
    console.log('刷新');
  },
};

// 使用闭包直接传递
var refreshCommand = function (receiver) {
  return function () {
    return {
      execute: function () {
        receiver.refresh();
      },
    };
  };
};

const btn = document.getElementsByTagName('button')[0];
setCommand(btn, refresh);
