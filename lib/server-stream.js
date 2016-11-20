import { Meteor } from 'meteor/meteor';
import { EventEmitter } from 'events';
import Fibers from 'fibers';

export default class ServerStream {

  constructor(name) {
    this.streamName = `stream-${name}`
    this.events = new EventEmitter();
    this.events.setMaxListeners(0);
    this.filters = [];
    this.permissions = {
      read: {
        results: {},
      },
      write: {
        results: {}
      }
    }
  }

  init() {
    const events = this.events;
    const streamName = this.streamName;
    const checkPermissions = this.checkPermissions.bind(this);
    const applyFilters = this.applyFilters.bind(this);

    Meteor.publish(streamName, function() {
      const subId = Meteor.uuid();
      const publication = this;

      publication.added(streamName, subId, { type: 'subId' });
      publication.ready();

      function onItem(item){
        const _id = Meteor.uuid();
        Fibers(() => {
          if(checkPermissions('read', item, publication.userId)
              && subId !== item.subId) {

              publication.added(streamName, _id, item);
              setTimeout(()=> publication.removed(streamName, _id), 100);
              // ^^^ Thar be dragons...
          }
        }).run();
      }

      events.on('item', onItem);

    });

    Meteor.methods({
      [this.streamName](streamId, subId, userId, message) {

        const methodContext = this;
        let item = { streamId, subId, userId, message };

        Fibers(() => {
          if(checkPermissions('write', item, methodContext.userId)) {
            item = applyFilters(item);
            events.emit('item', item);
          }
        }).run();
      }
    })
    return this;
  }

  addFilter(cb) {
    this.filters.push(cb);
  }

  applyFilters(item) {
    this.filters.forEach((filterFn) => {
      filterFn(item);
    });
    return item;
  }

  readPermission(fn, cache) {
    this.permissions.read.fn = fn;
    this.permissions.read.cache = !cache ? true : cache;
  }

  writePermission(fn, cache) {
    this.permissions.write.fn = fn;
    this.permissions.write.cache = !cache ? true : cache;
  }

  checkPermissions(permission, item, userId){

    const namespace = `${item.streamId}-${item.subId}`;
    let result = this.permissions[permission].results[namespace];

    if(!result) {
      const fn = this.permissions[permission].fn;
      if(fn) {
        result = fn(item, userId);
        return result;
      } else {
        return !Meteor.Collection.insecure
      }
    } else {
      return result;
    }
  }
}
