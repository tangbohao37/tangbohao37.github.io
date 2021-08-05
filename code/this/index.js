function pubsub() {
  const subscribers = [];
  return {
    getLen: function () {
      return subscribers.length;
    },
    subscribe: function (subscriber) {
      subscribers.push(subscriber);
    },
    publish: function (publication) {
      for (let i = 0; i < subscribers.length; i++) {
        subscribers[i](publication);
      }
      // subscribers.forEach(function (sub) {
      //   sub(publication);
      // });
    },
  };
}

const my = new pubsub();

my.subscribe(function () {
  this.length = 0;
});

my.publish();

console.log(my.getLen());
