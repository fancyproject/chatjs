var socket = io.connect();

Vue.component('chat',{
    template: `<div>
        <message-list :messages="messages"></message-list>
        <message-form @sendMessage="addMessage"></message-form>
    </div>`,
    props: ['messages'],
    data: function(){
      return {

      }
    },
    methods: {
        addMessage(txt){
            // this.messages.push({text: txt});
        }
    }
})

Vue.component('message-list', {
    template: `<ul id="messages">
      <li v-for='message in messages'>{{ message.text }}</li>
    </ul>`,
    props: ['messages'],

});

Vue.component('message-form', {
    template: `
    <form action="">
      <input v-model="message" placeholder="..." /><a @click="sendMessage">Send</a>
    </form>`,

    data: function(){
      return {
          message: "Test message"
      }
    },
    methods: {
      sendMessage(){
          socket.emit('chat message', this.message);
          this.$emit('sendMessage',this.message);
          return true;
      }
    }
});

var app = new Vue({
  el: '#app',
  data: {
    messages: [
      {text:'test'},
      {text:'test'},
    ]
  },
  created: function() {
      socket.on('chat message', function(data) {
  			this.messages.push({text: data});
      }.bind(this));
    }
});
