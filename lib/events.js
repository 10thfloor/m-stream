export default class Events {

  constructor() {
    this.handlers = []
  }

  emit(event, args) {
    if(event && this.handlers[event]) {
      this.handlers[event].forEach((handler, index) => {
        handler.apply(this, args)
      });
    }
  }

  on(event, callback) {
    if(!this.handlers[event]) {
      this.handlers[event] = [];
    }
    this.handlers[event].push(callback);
  }

  once(event, callback) {
    const once =  (...args) => {
      callback.apply(this, [...args]);
      this.removeListener(event, once);
    }
    this.on(event, once);
  }

  removeListener(event, callback) {
    if(this.handlers[event]) {
      const index = this.handlers[event].indexOf(callback)
      this.handlers[event].splice(index, 1);
    }
  }

  removeAllListeners(event) {
    this.handlers[event] = undefined;
  }
}
