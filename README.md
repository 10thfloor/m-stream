## M-Stream
A Cavalier ES2015 re-write of Arunoda's Meteor-Streams package.
Original source: https://github.com/arunoda/meteor-streams/tree/master/lib

#### Usage

Client:
```js
import ClientStream from 'meteor/mmack:m-stream';

const stream = new ClientStream('test').init();

Template.example.onRendered(function() {

  stream.on('test', (streamContent) => {
    console.log('Stream handler:', streamContent);
  });

});

Template.example.events({
  'click.message'(e){
      stream.emit('test', 'Button Clicked!');
  }
});
```

Server:
```js
import ServerStream from 'meteor/mmack:m-stream';

const stream = new ServerStream('test').init();

stream.readPermission((item, userId) => {
  return true;
});
```
