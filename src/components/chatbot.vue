<template>
  <div>
    <div v-if="!isChatboxOpen" class="chat-bubble" @click="toggleChatbox">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
    </div>

    <div v-if="isChatboxOpen" class="chatbox-fixed">
      <div class="chatbox-header">
        <strong>Bot Tư Vấn</strong>
        <button class="close-btn" @click="toggleChatbox">×</button>
      </div>

      <div class="messages">
        <div
          v-for="(msg, i) in messages"
          :key="i"
          :class="['message', msg.role]"
        >
          <strong>{{ msg.role === 'user' ? 'Bạn:' : 'Bot:' }}</strong> {{ msg.text }}
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
import { ref } from "vue";

// --- PHẦN MỚI ---
// Thêm một biến trạng thái để quản lý việc đóng/mở
const isChatboxOpen = ref(false); // Mặc định là đóng

// Hàm để bật/tắt
const toggleChatbox = () => {
  isChatboxOpen.value = !isChatboxOpen.value;
};
// --- KẾT THÚC PHẦN MỚI ---

const userInput = ref("");
const messages = ref([]);

const sendMessage = async () => {
  if (!userInput.value.trim()) return;

  messages.value.push({ role: "user", text: userInput.value });
  const userMessage = userInput.value;
  userInput.value = ""; // Xóa input ngay lập tức để người dùng biết tin nhắn đã được gửi

  try {
    const res = await fetch("http://localhost:5000/api/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage }),
    });

    // Thêm kiểm tra nếu request không thành công
    if (!res.ok) {
        throw new Error(`Lỗi từ server: ${res.statusText}`);
    }

    const data = await res.json();
    messages.value.push({ role: "bot", text: data.reply });

  } catch (error) {
    // Hiển thị lỗi cho người dùng nếu có sự cố
    console.error("Lỗi khi gửi tin nhắn:", error);
    messages.value.push({ role: "bot", text: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau." });
  }
};
</script>

<style scoped>
/* --- PHẦN MỚI: CSS cho nút tròn --- */
.chat-bubble {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  background-color: #007bff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  z-index: 9998;
}

/* --- PHẦN MỚI: CSS cho header và nút đóng --- */
.chatbox-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}
.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  line-height: 1;
}

/* CSS cũ giữ nguyên */
.chatbox-fixed {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 380px;
  height: 480px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 9999;
}
.messages {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
}
.message { margin-bottom: 10px; }
.message.user { text-align: right; color: #007bff; }
.message.bot { text-align: left; color: #333; }
.input-box { display: flex; border-top: 1px solid #ddd; }
input { flex: 1; padding: 12px; border: none; outline: none; font-size: 16px; }
button { background-color: #007bff; color: white; border: none; padding: 0 16px; cursor: pointer; }
button:hover { background-color: #0056b3; }
</style>