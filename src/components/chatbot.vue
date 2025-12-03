<template>
  <div>
    <!-- Nút mở chat -->
    <div v-if="!isChatboxOpen" class="chat-bubble" @click="toggleChatbox">
      💬
    </div>

    <!-- Hộp chat -->
    <div v-else class="chatbox-fixed">
      <div class="chatbox-header">
        <strong>Chatbot của ShoeTCS</strong>
        <button class="close-btn" @click="toggleChatbox">×</button>
      </div>

      <!-- Tin nhắn -->
      <div class="messages" ref="messagesContainer">
        <div
          v-for="(msg, i) in messages"
          :key="i"
          :class="['message', msg.role]"
        >
          <div class="bubble">
            <strong>{{ msg.role === "user" ? "Bạn:" : "Chatbot:" }}</strong>
            <p v-html="msg.text"></p>
          </div>
        </div>
      </div>

      <!-- ===== QUICK REPLIES FULL (CHỈ HIỆN LẦN ĐẦU) ===== -->
      <div v-if="showQuickReplies && !isCollapsed" class="quick-replies">
        <button
          v-for="(q, index) in quickReplies"
          :key="index"
          @click="selectQuickReply(q)"
        >
          {{ q }}
        </button>
      </div>

      <!-- ===== NÚT ĐIỀU HƯỚNG GỢI Ý ===== -->
      <div v-if="isCollapsed" class="quick-nav">
        <button @click="toggleQuickMenu">☰ Gợi ý</button>

        <div v-if="showQuickMenu" class="quick-dropdown">
          <button
            v-for="(q, index) in quickReplies"
            :key="index"
            @click="selectQuickReply(q)"
          >
            {{ q }}
          </button>
        </div>
      </div>

      <!-- Thanh nhập -->
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
import { ref, nextTick, watch } from "vue";

const isChatboxOpen = ref(false);
const toggleChatbox = () => (isChatboxOpen.value = !isChatboxOpen.value);

const userInput = ref("");
const messages = ref([]);
const messagesContainer = ref(null);

/* ================= QUICK REPLIES ================= */
const showQuickReplies = ref(true);
const isCollapsed = ref(false);
const showQuickMenu = ref(false);

const quickReplies = ref([
  "Các mẫu sản phẩm của cửa hàng",
  "Tư vấn size giày",
  "Sản phẩm bán chạy nhất của cửa hàng",
  "Tra cứu đơn hàng",
]);

const toggleQuickMenu = () => {
  showQuickMenu.value = !showQuickMenu.value;
};

const selectQuickReply = (text) => {
  userInput.value = text;
  showQuickReplies.value = false;
  isCollapsed.value = true;      // ✅ Sau lần bấm đầu → thu gợi ý vào menu
  showQuickMenu.value = false;
  sendMessage();
};

const scrollToBottom = () => {
  nextTick(() => {
    const el = messagesContainer.value;
    if (el) el.scrollTop = el.scrollHeight;
  });
};

/* ================= LỜI CHÀO ================= */
watch(isChatboxOpen, (open) => {
  if (open && messages.value.length === 0) {
    messages.value.push({
      role: "bot",
      text:
         "👋 Xin chào! Mình là trợ lý ảo của <b>ShoeTCS</b>.<br><br>" +
        "Bạn có thể hỏi mình về:<br>" +
        "🥿 <b>Sản phẩm</b> (giày, loại, size, màu...)<br>" +
        "📦 <b>Đơn hàng</b> (trạng thái, tổng tiền, gần đây...)<br>" +
        "🎁 <b>Khuyến mãi</b>, <b>đổi trả</b>, <b>giao hàng</b>...<br><br>" +
        "Hoặc mình có thể <b>tư vấn size giày</b> phù hợp cho bạn 👣",
    });
    scrollToBottom();
  }
});

/* ================= GỬI TIN NHẮN ================= */
const sendMessage = async () => {
  if (!userInput.value.trim()) return;

  const userMessage = userInput.value;

  messages.value.push({
    role: "user",
    text: userMessage,
  });

  userInput.value = "";
  showQuickReplies.value = false;
  scrollToBottom();

  try {
    const res = await fetch("http://localhost:5000/api/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage }),
    });

    const data = await res.json();

    messages.value.push({
      role: "bot",
      text: data.reply,
    });

    scrollToBottom();
  } catch (err) {
    messages.value.push({
      role: "bot",
      text: "😢 Xin lỗi, hệ thống đang gặp sự cố.",
    });
  }
};
</script>

<style scoped>
/* === Nút mở chat === */
.chat-bubble {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 70px;
  height: 70px;
  background-color: #007bff;
  color: white;
  font-size: 26px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
  z-index: 9998;
  transition: transform 0.2s ease, background 0.3s;
}
.chat-bubble:hover {
  transform: scale(1.1);
  background-color: #0056b3;
}

/* === Hộp chat === */
.chatbox-fixed {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 400px;
  height: 550px;
  background: #ffffff;
  border-radius: 18px;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 9999;
  font-family: "Segoe UI", sans-serif;
}

/* === Header === */
.chatbox-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #007bff, #5a9eff);
  color: white;
  padding: 12px 16px;
  font-size: 18px;
  font-weight: bold;
}
.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 28px;
  cursor: pointer;
  transition: transform 0.2s;
}
.close-btn:hover {
  transform: rotate(90deg);
}

/* === Tin nhắn === */
.messages {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  background: #f6f8fb;
}
.message {
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
}
.bubble {
  padding: 12px 16px;
  font-size: 16px;
  line-height: 1.5;
  max-width: 80%;
  word-wrap: break-word;
  border-radius: 18px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
.message.user .bubble {
  align-self: flex-end;
  background: #007bff;
  color: #fff;
  border-bottom-right-radius: 6px;
}
.message.bot .bubble {
  align-self: flex-start;
  background: #e6e6e6;
  color: #333;
  border-bottom-left-radius: 6px;
}

/* === Thanh nhập === */
.input-box {
  display: flex;
  border-top: 1px solid #ddd;
  background: #fafafa;
}
input {
  flex: 1;
  padding: 14px;
  border: none;
  outline: none;
  font-size: 16px;
  background: transparent;
}
button {
  background: #007bff;
  color: white;
  border: none;
  padding: 0 20px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: background 0.3s;
}
button:hover {
  background: #0056b3;
}

/* === Thanh cuộn === */
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

/* === Quick Replies (Dạng hiển thị ban đầu) === */
.quick-replies {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 10px;
  background: #ffffff;
  border-top: 1px solid #ddd;
}

.quick-replies button {
  background: #e7f1ff;
  color: #007bff;
  border: 1px solid #007bff;
  border-radius: 999px;
  padding: 6px 12px;
  font-size: 14px;
  cursor: pointer;
  transition: 0.2s;
}

.quick-replies button:hover {
  background: #007bff;
  color: #fff;
}

/* ✅ === Thanh điều hướng gợi ý (sau khi click lần đầu) === */
.quick-nav {
  padding: 6px 10px;
  border-top: 1px solid #ddd;
  background: white;
  position: relative;
}

.quick-nav button {
  background: #007bff;
  color: white;
  border: none;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}

/* ✅ === Menu xổ gợi ý === */
.quick-dropdown {
  position: absolute;
  bottom: 45px;
  right: 10px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  z-index: 10;
}

.quick-dropdown button {
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #007bff;
  background: #e7f1ff;
  font-size: 13px;
  cursor: pointer;
}
</style>

