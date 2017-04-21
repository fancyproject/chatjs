var socket = io.connect();

Vue.component('chat', {
  template: `<div id="chat">
        <message-list :messages="messages"></message-list>
        <notification-list :notifications="notifications"></notification-list>
        <message-form></message-form>
    </div>`,
  props: ['messages', 'notifications'],
})

Vue.component('message-list', {
  template: `<ul id="messages">
      <li v-for='message in messages'><b>{{ message.username }}</b>: {{ message.text }}</li>
    </ul>`,
  props: ['messages'],
});
Vue.component('notification-list', {
  template: `<ul id="notifications">
      <li v-for='notification in notifications'>{{ notification.text }}</li>
    </ul>`,
  props: ['notifications'],
});

Vue.component('message-form', {
  template: `
    <form action="">
      <input v-model="message" placeholder="..." @keydown="writingMessage" /><button @click="sendMessage">Send</button>
    </form>`,

  data: function() {
    return {
      message: "",
    }
  },
  methods: {
    sendMessage(event) {
      event.preventDefault();
      socket.emit('chat message', this.message);
      this.message = "";
      return false;
    },
    writingMessage() {
      socket.emit('chat writing');
      setTimeout(function() {
        socket.emit('chat writing stop');
      }, 1000);
    }
  }
});

var app = new Vue({
  el: '#app',
  data: {
    messages: [],
    notifications: []
  },
  created: function() {
    socket.on('chat message', function(data) {
      this.messages.push({
        text: data.text,
        username: data.username
      });
    }.bind(this));
    socket.on('chat writing', function(data) {
      var exists = false;
      for (let i = 0; i < this.notifications.length; i++) {
        let notification = this.notifications[i];
        if (notification.username === data.username && notification.type === 'writing') {
          notification.date = new Date();
          this.notifications[i] = notification;
          exists = true;
          break;
        }
      }
      if (!exists) {
        this.notifications.push({
          text: `${data.username} writing...`,
          username: data.username,
          type: 'writing',
          date: new Date()
        });
      }
    }.bind(this));
    socket.on('chat writing stop', function(data) {
      this.notifications = this.notifications.filter(function(notification) {
        return !(notification.username === data.username && notification.type === 'writing');
      });
    }.bind(this));
  }
});
