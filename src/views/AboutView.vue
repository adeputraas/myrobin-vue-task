<script>
import axios from "axios";
export default {
  data() {
    return {
      asUser: localStorage.getItem("userName"),
      message: "",
      roomName: localStorage.getItem("roomName"),
      chats: [],
    };
  },
  mounted() {
    if (localStorage.getItem("roomName") && localStorage.getItem("userName")) {
      axios
        .get(`http://localhost:3030/chat-logs/${this.roomName}`)
        .then((response) => {
          this.chats = response.data.data;
          this.$socketio.on(
            `${localStorage.getItem("roomName")}-message-received`,
            (data) => {
              if (Object.keys(data).length) {
                let container = this.$el.querySelector("#chat-log");
                container.scrollTop = container.scrollHeight;
                this.chats.push(data);
              }
            }
          );
        })
        .catch((error) => alert(error.response.data.message));
    } else {
      this.$router.push(`/`);
    }
  },
  methods: {
    onChange(event) {
      this[event.target.name] = event.target.value;
    },
    sendMessage() {
      const message = {
        userName: this.asUser,
        message: this.message,
        roomName: this.roomName,
      };
      this.$socketio.emit("chatMessage", message);
      this.message = "";
    },
    exit() {
      // this.$socketio.disconnect(); //disconnect gabisa reconnect blm nemu caranya
      this.$socketio.emit("leaveRoom");
      localStorage.clear();
      this.$router.push(`/`);
    },
  },
};
</script>
<template>
  <div class="d-flex flex-column p-4 border-container">
    <div class="d-flex">
      <button type="button" class="btn btn-outline-success" @click="exit">
        Exit
      </button>
    </div>
    <div class="d-flex">
      <h4 class="center w-100">{{ roomName }}</h4>
    </div>
    <hr />
    <div id="chat-log" class="d-flex flex-column container-chat p-2">
      <div
        class="d-flex flex-column w-100"
        :class="{ 'align-items-end': asUser === chat.userName }"
        v-for="chat in chats"
        :key="chat.id"
      >
        <b>{{ chat.userName }}</b>
        <span
          class="d-flex gap-2"
          :class="{
            'background-chat-user': asUser === chat.userName,
            'background-chat-opponent': asUser !== chat.userName,
          }"
        >
          <span class="word-break">{{ chat.message }}</span>
          <span class="fs-9 align-self-end">{{ chat.time }}</span>
        </span>
      </div>
    </div>

    <div class="d-flex mt-3">
      <input
        type="text"
        placeholder="Messages"
        @change="onChange"
        v-model="message"
        class="form-control"
      />
      <button type="button" class="btn btn-primary" @click="sendMessage">
        Sent
      </button>
    </div>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
