import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import Events from './events';

export default class ClientStream extends Events {

    constructor(name) {
      super();
      this.subId = undefined;
      this.connected = false;
      this.streamName = `stream-${name}`;
      this.collection = new Mongo.Collection(this.streamName);
      this.pendingEvents = [];
    }

    init(callback) {
      this.collection.find({}).observe({
        added: (item) => {
          if(item.type === 'subId') {
            this.subId = item._id;
            this.connected = true;
            this.pendingEvents.forEach((event) => {
              this.emit(event.streamId, event.message);
            });
          } else {
            super.emit(item.streamId, item.message);
          }
        }
      });

      Meteor.subscribe(this.streamName);
      return this;
    }

    emit(streamId, ...message) {
      if(this.connected) {
        Meteor.call(this.streamName, streamId, this.subId, this.userId, message);
      } else {
        this.pendingEvents.push({ streamId, message });
      }
    }
}
