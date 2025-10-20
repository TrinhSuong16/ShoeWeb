<template>
  <div>
    <!-- Nút mở chat -->
    <div v-if="!isChatboxOpen" class="chat-bubble" @click="toggleChatbox">
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="white">
        <path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"/>
      </svg>
    </div>

    <!-- Hộp chat -->
    <div v-else class="chatbox-fixed">
      <div class="chatbox-header">
        <strong>✨ Trợ lý AI (Gemini)</strong>
        <button class="close-btn" @click="toggleChatbox">×</button>
      </div>

      <div class="messages" ref="messagesContainer">
        <div
          v-for="(msg, i) in messages"
          :key="i"
          :class="['message', msg.role]"
        >
          <div class="bubble">
            <strong>{{ msg.role === 'user' ? 'Bạn:' : 'Gemini:' }}</strong>
            <p>{{ msg.text }}</p>
          </div>
        </div>
      </div>

      <div class="input-box">
        <input
          v-model="userInput"
          @keyup.enter="sendMessage"
          placeholder="Nhập tin nhắn..."
        />
        <button @click="sendMessage">Gửi</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from "vue";

const isChatboxOpen = ref(false);
const toggleChatbox = () => (isChatboxOpen.value = !isChatboxOpen.value);

const userInput = ref("");
const messages = ref([]);
const messagesContainer = ref(null);

const scrollToBottom = () => {
  nextTick(() => {
    const el = messagesContainer.value;
    if (el) el.scrollTop = el.scrollHeight;
  });
};

const sendMessage = async () => {
  if (!userInput.value.trim()) return;

  // Gửi tin người dùng
  const userMessage = userInput.value;
  messages.value.push({ role: "user", text: userMessage });
  userInput.value = "";
  scrollToBottom();

  try {
    const res = await fetch("http://localhost:5000/api/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage }),
    });

    if (!res.ok) throw new Error(`Lỗi server: ${res.statusText}`);

    const data = await res.json();
    messages.value.push({ role: "bot", text: data.reply });
    scrollToBottom();
  } catch (err) {
    console.error(err);
    messages.value.push({
      role: "bot",
      text: "😢 Xin lỗi, hệ thống đang gặp sự cố. Vui lòng thử lại sau.",
    });
  }
};
</script>

<style scoped>
.chat-bubble {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 65px;
  height: 65px;
  background-color: #007bff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  z-index: 9998;
  transition: transform 0.2s ease;
}
.chat-bubble:hover {
  transform: scale(1.08);
}

.chatbox-fixed {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 380px;
  height: 520px;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 14px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 9999;
}

.chatbox-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #007bff;
  color: white;
  padding: 10px 15px;
  font-size: 16px;
  border-top-left-radius: 14px;
  border-top-right-radius: 14px;
}
.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 26px;
  cursor: pointer;
  line-height: 1;
}

.messages {
  flex: 1;
  padding: 12px;
  overflow-y: auto;
  background: #f9f9f9;
}
.message {
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
}
.message.user .bubble {
  align-self: flex-end;
  background: #007bff;
  color: white;
  border-radius: 14px 14px 0 14px;
}
.message.bot .bubble {
  align-self: flex-start;
  background: #eaeaea;
  color: #333;
  border-radius: 14px 14px 14px 0;
}
.bubble {
  padding: 10px 14px;
  max-width: 75%;
  word-wrap: break-word;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.input-box {
  display: flex;
  border-top: 1px solid #ddd;
}
input {
  flex: 1;
  padding: 12px;
  border: none;
  outline: none;
  font-size: 16px;
}
button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0 16px;
  cursor: pointer;
  font-weight: bold;
}
button:hover {
  background-color: #0056b3;
}
.messages::-webkit-scrollbar {
  width: 6px;
}
.messages::-webkit-scrollbar-thumb {
  background-color: #007bff;
  border-radius: 3px;
}
.messages::-webkit-scrollbar-track {
  background: #f1f1f1;
}

</style>
