import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ====== KẾT NỐI MYSQL ======
const db = await mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "S16012004",
  database: process.env.DB_NAME || "shoe_",
});

console.log("✅ Đã kết nối MySQL thành công!");

export const chatbotService = {
  async getResponse(userMessage) {
    const lower = userMessage.toLowerCase();

    // ===========================================================
    // 1️⃣ CÂU HỎI VỀ SẢN PHẨM
    // ===========================================================
    if (lower.includes("giày") || lower.includes("sản phẩm")) {
      // Danh sách loại giày
      if (lower.includes("loại") || lower.includes("danh sách") || lower.includes("nhóm")) {
        const [rows] = await db.execute("SELECT NPS_ten FROM nhom_san_pham LIMIT 10");
        if (rows.length === 0) return "Hiện chưa có loại sản phẩm nào trong hệ thống.";
        const text = rows.map(r => `- ${r.NPS_ten}`).join("\n");
        return `Các loại giày hiện có:\n${text}`;
      }

      // Danh sách sản phẩm
      if (lower.includes("hiện có") || lower.includes("sản phẩm")) {
        const [rows] = await db.execute("SELECT SP_ten, SP_price FROM san_pham LIMIT 10");
        const text = rows.map(r => `- ${r.SP_ten}: ${r.SP_price} VNĐ`).join("\n");
        return `Dưới đây là một số sản phẩm đang bán:\n${text}`;
      }

      // Còn hàng hay không
      if (lower.includes("còn hàng") || lower.includes("kho")) {
        const [rows] = await db.execute(
          "SELECT s.SP_ten, k.so_luong FROM san_pham s JOIN kho_san_pham k ON s.SP_ma = k.SP_ma WHERE k.so_luong > 0 LIMIT 10"
        );
        if (rows.length === 0) return "Hiện tại các sản phẩm đều đã hết hàng 😢";
        const text = rows.map(r => `- ${r.SP_ten} (SL: ${r.so_luong})`).join("\n");
        return `Các sản phẩm còn hàng:\n${text}`;
      }

      // Tìm theo màu hoặc size
      if (lower.includes("màu") || lower.includes("size") || lower.includes("kích thước")) {
        const [rows] = await db.execute("SELECT SP_ten, SP_color, SP_size, SP_price FROM san_pham LIMIT 10");
        const text = rows.map(r => `- ${r.SP_ten}: màu ${r.SP_color}, size ${r.SP_size}, giá ${r.SP_price} VNĐ`).join("\n");
        return `Một vài sản phẩm và thông tin chi tiết:\n${text}`;
      }
    }

    // ===========================================================
    // 2️⃣ CÂU HỎI VỀ ĐƠN HÀNG
    // ===========================================================
    if (lower.includes("đơn hàng") || lower.includes("hóa đơn")) {
      // Danh sách đơn gần nhất
      if (lower.includes("gần đây") || lower.includes("mới nhất")) {
        const [rows] = await db.execute(
          "SELECT DH_ma, DH_orderdate, DH_totalprice, DH_trangthai FROM don_hang ORDER BY DH_orderdate DESC LIMIT 5"
        );
        if (rows.length === 0) return "Hiện chưa có đơn hàng nào trong hệ thống.";
        const text = rows
          .map(r => `- Mã: ${r.DH_ma}, Ngày: ${r.DH_orderdate}, Tổng: ${r.DH_totalprice} VNĐ, Trạng thái: ${r.DH_trangthai}`)
          .join("\n");
        return `Các đơn hàng gần đây:\n${text}`;
      }

      // Trạng thái đơn hàng
      if (lower.includes("trạng thái") || lower.includes("tình trạng")) {
        const [rows] = await db.execute(
          "SELECT DH_ma, DH_trangthai FROM don_hang ORDER BY DH_orderdate DESC LIMIT 5"
        );
        const text = rows.map(r => `- Đơn ${r.DH_ma}: ${r.DH_trangthai}`).join("\n");
        return `Trạng thái các đơn hàng gần đây:\n${text}`;
      }

      // Tổng tiền đơn hàng
      if (lower.includes("tổng tiền") || lower.includes("giá trị")) {
        const [rows] = await db.execute(
          "SELECT DH_ma, DH_totalprice FROM don_hang ORDER BY DH_orderdate DESC LIMIT 5"
        );
        const text = rows.map(r => `- ${r.DH_ma}: ${r.DH_totalprice} VNĐ`).join("\n");
        return `Tổng giá trị các đơn gần đây:\n${text}`;
      }
    }

    // ===========================================================
    // 3️⃣ CÂU HỎI CHUNG (FAQ)
    // ===========================================================
    const faqList = [
      { key: ["mở cửa", "hoạt động"], answer: "Shop mở cửa từ 8:00 sáng đến 21:00 tối mỗi ngày." },
      { key: ["địa chỉ", "ở đâu", "chi nhánh"], answer: "Shop có 3 chi nhánh: Quận 1, Quận 7 và Thủ Đức." },
      { key: ["đổi trả", "bảo hành"], answer: "Shop hỗ trợ đổi trả trong vòng 7 ngày nếu sản phẩm chưa sử dụng." },
      { key: ["khuyến mãi", "giảm giá"], answer: "Hiện đang có chương trình giảm 20% cho đơn hàng trên 2 triệu đồng." },
      { key: ["ship", "giao hàng"], answer: "Shop giao hàng toàn quốc, miễn phí đơn từ 1 triệu đồng." },
    ];

    for (const f of faqList) {
      if (f.key.some(k => lower.includes(k))) {
        return f.answer;
      }
    }

    // ===========================================================
    // 4️⃣ MẶC ĐỊNH: HỎI GEMINI
    // ===========================================================
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(userMessage);
      return result.response.text();
    } catch (err) {
      console.error("❌ Lỗi Gemini:", err);
      return "Xin lỗi, hiện tôi không thể trả lời câu hỏi này.";
    }
  },
};
