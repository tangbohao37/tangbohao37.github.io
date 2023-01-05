var events = {
  clientList: [],
  listener: function (client, cb) {
    if (!this.clientList[client]) {
      this.clientList[client] = [];
    } else {
      this.clientList[client].push(cb);
    }
  },
  trigger: function (client, ...rest) {
    var cbs = this.clientList[client];
    if (!cbs || !cbs.length) {
      return;
    }
    for (let i = 0; i < cbs.length; i++) {
      const cb = cbs[i];
      cb.apply(this, rest);
    }
  },
};

events.listener('abc', function (...args) {
  console.log(this); // events
  console.log(args); // [1,2,3]
});

events.trigger('abc', 1, 2, 3);
