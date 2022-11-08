<script>
// import axios from "axios";
// import io from "socket.io-client";

export default {
  data() {
    return {
      name: "",
      roomName: "",
    };
  },
  mounted() {
    this.$socketio.on("isJoined", (data) => {
      if (data.error) {
        alert(data.message);
      } else {
        localStorage.setItem("userName", this.name);
        localStorage.setItem("roomName", this.roomName);
        this.$router.push(`/room`);
      }
    });
  },
  methods: {
    onChange(event) {
      this[event.target.name] = event.target.value;
    },
    async join() {
      const dto = {
        userName: this.name,
        roomName: this.roomName,
      };

      // axios
      //   .post("http://localhost:3030/join", dto)
      //   .then(() => {
      //     localStorage.setItem("userName", this.name);
      //     localStorage.setItem("roomName", this.roomName);
      //     this.$router.push(`/room`);
      //   })
      //   .catch((error) => alert(error.response.data.message));

      this.$socketio.emit("join", dto);
    },
  },
};
</script>

<template>
  <main class="justify-content-center">
    <div class="row">
      <h4 class="center">Join Chatroom</h4>
    </div>

    <div class="row">
      <input
        type="text"
        placeholder="Username"
        @change="onChange"
        v-model="name"
        class="form-control m-b-5"
      />
      <br />
      <input
        type="text"
        placeholder="Room ID"
        @change="onChange"
        v-model="roomName"
        class="form-control m-b-5"
      />
    </div>

    <div class="row">
      <button type="button" class="btn btn-primary" @click="join">Join</button>
    </div>
  </main>
</template>
