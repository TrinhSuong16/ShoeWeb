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

export const chatbotService = {
  async getResponse(userMessage) {
    const lower = userMessage.toLowerCase();

    // ============ 1️⃣ XEM NHÓM SẢN PHẨM ============
    if (lower.includes("loại") || lower.includes("nhóm") || lower.includes("danh sách")) {
      const [rows] = await db.execute("SELECT NPS_ten FROM nhom_san_pham");
      if (rows.length === 0) return "Hiện chưa có loại sản phẩm nào trong hệ thống.";
      const text = rows.map(r => `- ${r.NPS_ten}`).join("<br>");
      return `👟 Các nhóm sản phẩm hiện có:<br>${text}<br><br>💡 Bạn có thể hỏi thêm:<br>• “Các sản phẩm trong Giày thể thao nam”<br>• “Sandal nữ còn hàng không?”`;
    }

    // ============ 2️⃣ XEM SẢN PHẨM THEO NHÓM ============
    if (lower.includes("thuộc") || lower.includes("trong") || lower.includes("của nhóm")) {
      const [nhomSP] = await db.execute("SELECT * FROM nhom_san_pham");
      const foundNhom = nhomSP.find(n => lower.includes(n.NPS_ten.toLowerCase()));

      if (!foundNhom) return "😅 Mình không xác định được bạn đang nói đến nhóm sản phẩm nào.";

      const [rows] = await db.execute(
        `SELECT SP_ten, SP_price FROM san_pham WHERE NPS_ma = ? LIMIT 10`,
        [foundNhom.NPS_ma]
      );

      if (rows.length === 0)
        return `😢 Hiện nhóm sản phẩm "${foundNhom.NPS_ten}" chưa có sản phẩm nào.`;

      const list = rows
        .map(r => `- ${r.SP_ten}: ${r.SP_price?.toLocaleString("vi-VN") || "Đang cập nhật"}₫`)
        .join("<br>");

      return `🥿 Các sản phẩm trong nhóm <b>${foundNhom.NPS_ten}</b>:<br>${list}<br><br>💡 Bạn có thể hỏi:<br>• “Chi tiết ${rows[0].SP_ten}”<br>• “Giày nào còn size 42?”`;
    }

    // ============ 3️⃣ TÌM SẢN PHẨM THEO TÊN ============
// === TÌM SẢN PHẨM THEO NHÓM HOẶC TÊN ===
const [groups] = await db.execute("SELECT NPS_ten FROM nhom_san_pham");
const groupNames = groups.map(g => g.NPS_ten.toLowerCase());

// Tìm xem người dùng có nhắc tới nhóm sản phẩm nào không
const foundGroup = groupNames.find(name => lower.includes(name));

// Nếu có nhóm sản phẩm được nhắc đến
if (foundGroup) {
  const [rows] = await db.execute(
    `SELECT SP_ten, SP_color, SP_size, SP_price, SP_hinh_anh
     FROM san_pham s
     JOIN nhom_san_pham n ON s.NPS_ma = n.NPS_ma
     WHERE LOWER(n.NPS_ten) LIKE ? OR LOWER(s.SP_ten) LIKE ?
     LIMIT 5`,
    [`%${foundGroup}%`, `%${foundGroup}%`]
  );

  if (rows.length > 0) {
    // Nếu chỉ có 1 sản phẩm → trả thông tin chi tiết
    if (rows.length === 1) {
      const p = rows[0];
      return (
        `✨ <b>Thông tin sản phẩm:</b><br>` +
        `Tên: ${p.SP_ten}<br>` +
        `Màu: ${p.SP_color || "Chưa có"}<br>` +
        `Size: ${p.SP_size || "Đang cập nhật"}<br>` +
        `Giá: ${p.SP_price ? p.SP_price.toLocaleString("vi-VN") + "₫" : "Đang cập nhật"}<br>`
      );
    } else {
      // Nếu có nhiều sản phẩm → liệt kê danh sách
      let reply = `🛍️ <b>Các sản phẩm thuộc nhóm "${foundGroup}":</b><br>`;
      rows.forEach((p, i) => {
        reply += `${i + 1}. ${p.SP_ten} - ${p.SP_price ? p.SP_price.toLocaleString("vi-VN") + "₫" : "Chưa có giá"}<br>`;
      });
      return reply;
    }
  } else {
    return `😅 Hiện chưa có sản phẩm nào thuộc nhóm "${foundGroup}".`;
  }
}

// okkkkkkkkkkkkk Nếu người dùng hỏi về thông tin / chi tiết sản phẩm
if (
  lower.includes("chi tiết") ||
  lower.includes("thông tin") ||
  lower.includes("xem sản phẩm") ||
  lower.includes("cho tôi biết") ||
  lower.includes("giới thiệu")
) {
  // 🔍 Làm sạch câu nhập để trích tên sản phẩm
  const productName = lower
    .replace(/(chi tiết|thông tin|xem|sản phẩm|cho tôi biết|giới thiệu|về|của|hãng)/g, "")
    .trim();

  if (productName && productName.length > 1) {
    const [rowsByName] = await db.execute(
      `SELECT SP_ma, SP_ten, SP_color, SP_size, SP_price, SP_hinh_anh 
       FROM san_pham 
       WHERE LOWER(SP_ten) LIKE ? 
       LIMIT 1`,
      [`%${productName}%`]
    );

    if (rowsByName.length > 0) {
      const p = rowsByName[0];

      // ✅ Trả về HTML sản phẩm + nút Thêm vào giỏ hàng
      return `
        <div style="font-family: Arial; line-height:1.6">
          ✨ <b>Thông tin sản phẩm:</b><br>
          👟 <b>${p.SP_ten}</b><br>
          🎨 Màu: ${p.SP_color || "Chưa có"}<br>
          📏 Size: ${p.SP_size || "Đang cập nhật"}<br>
          💰 Giá: ${p.SP_price ? Number(p.SP_price).toLocaleString("vi-VN") + "₫" : "Đang cập nhật"}<br>
          ${
            p.SP_hinh_anh
              ? `<br><img src="${p.SP_hinh_anh}" alt="${p.SP_ten}" style="max-width:220px;border-radius:12px;margin-top:10px;">`
              : ""
          }
          <br>
          <button 
            class="add-to-cart-btn" 
            style="margin-top:10px;padding:6px 12px;border:none;border-radius:8px;
                   background-color:#007bff;color:white;cursor:pointer"
            onclick="addToCart('${p.SP_ma}', '${p.SP_ten.replace(/'/g, "\\'")}', '${p.SP_price}', '${p.SP_color}', '${p.SP_size}', '${p.SP_hinh_anh}')">
            🛒 Thêm vào giỏ hàng
          </button>
        </div>
      `;
    }
  }

  // ❌ Không tìm thấy sản phẩm
  return `😢 Xin lỗi, mình không tìm thấy sản phẩm bạn muốn xem thông tin. Bạn có thể nhập rõ hơn, ví dụ: "Chi tiết sản phẩm Nike Air Max".`;
}




   // ổn============ 4️⃣ TÌM THEO tên + MÀU / SIZE ============
if (
  lower.includes("màu") ||
  lower.includes("size") ||
 
  lower.includes("mua")
) {
  // 🔍 Bắt thông tin: tên sản phẩm, màu, size
  const sizeMatch = lower.match(/size\s*(\d{1,3})/);
  const colorMatch = lower.match(/màu\s+([\p{L}\s]+)/u);

  // Lấy tên sản phẩm (VD: "nike air max")
  let productName = lower
    .replace(/tôi muốn mua|mua|tôi muốn|cho tôi hỏi|có|giày/g, "")
    .replace(/màu\s+([\p{L}\s]+)/u, "")
    .replace(/size\s*\d{1,3}/, "")
    .trim();

  let query = `
    SELECT SP_ten, SP_color, SP_size, SP_price
    FROM san_pham
    WHERE 1=1
  `;
  const params = [];

  // Nếu có tên sản phẩm
  if (productName && productName.length > 1) {
    query += " AND LOWER(SP_ten) LIKE ?";
    params.push(`%${productName}%`);
  }

  // Nếu có màu
  if (colorMatch) {
    const color = colorMatch[1].trim().toLowerCase();
    query += " AND LOWER(SP_color) LIKE ?";
    params.push(`%${color}%`);
  }

  // Nếu có size
  if (sizeMatch) {
    query += " AND SP_size = ?";
    params.push(sizeMatch[1]);
  }

  // ✅ THỰC THI TRUY VẤN
  const [rows] = await db.execute(query, params);

  // Nếu không tìm thấy
  if (rows.length === 0) {
    // Nếu có tên sản phẩm → fallback gợi ý sản phẩm tương tự
    if (productName) {
      const [suggestions] = await db.execute(
        `SELECT SP_ten, SP_color, SP_size, SP_price 
         FROM san_pham 
         WHERE LOWER(SP_ten) LIKE ? 
         LIMIT 5`,
        [`%${productName}%`]
      );
      if (suggestions.length > 0) {
        const suggestionText = suggestions
          .map(
            (r) =>
              `👟 ${r.SP_ten} — ${r.SP_color || "Không rõ"} (size ${
                r.SP_size || "?"
              }): ${r.SP_price ? r.SP_price.toLocaleString("vi-VN") + "₫" : "Đang cập nhật"}`
          )
          .join("<br>");
        return `😢 Không tìm thấy sản phẩm chính xác theo yêu cầu.<br><br>💡 Gợi ý gần đúng:<br>${suggestionText}`;
      }
    }

    return `😢 Không tìm thấy sản phẩm nào phù hợp với yêu cầu của bạn.`;
  }
  // Nếu có kết quả
  const text = rows
    .map(
      (r) =>
        `👟 <b>${r.SP_ten}</b> — ${r.SP_color || "Không rõ"} (size ${r.SP_size || "?"}): <b>${
          r.SP_price ? r.SP_price.toLocaleString("vi-VN") + "₫" : "Đang cập nhật"
        }</b>`
    )
    .join("<br>");
  return `🎨 <b>Kết quả tìm thấy:</b><br>${text}`;
}



// ============ 5️⃣ KIỂM TRA SẢN PHẨM CÒN HÀNG / HẾT HÀNG ============
if (
  lower.includes("còn hàng") ||
  lower.includes("hết hàng") ||
  lower.includes("còn không") ||
  lower.includes("có hàng") ||
  lower.includes("hết chưa")
) {
  // 1️⃣ Bắt size và màu nếu có
  const sizeMatch = lower.match(/size\s*(\d{1,3})/);
  const colorMatch = lower.match(/màu\s+([\p{L}\s]+)/u);

  // 2️⃣ Xử lý phần tên sản phẩm
  let productName = lower
    .replace(/\b(còn hàng|hết hàng|có còn|còn không|còn|hết|có hàng|hết chưa|có|không)\b/g, "")
    .replace(/\b(tôi muốn mua|mua|muốn|cho tôi|cho mình|xem|kiểm tra|giúp|tìm|xem giúp)\b/g, "")
    .replace(/\b(sản phẩm|shop|cửa hàng|của|hãng|loại)\b/g, "")
    // loại bỏ color/size phần đã bắt nếu còn sót
    .replace(/màu\s+[\p{L}\s]+/u, "")
    .replace(/size\s*\d{1,3}/, "")
    .trim();

  // ✅ Giữ lại chữ “giày” nếu nó nằm trong tên (vd: “giày adidas”)
  productName = productName.replace(/^\s*giày\s*/, "").trim();

  // Xóa ký tự dư (ngoài chữ/số/dấu cách)
  productName = productName.replace(/[^\p{L}\d\s\-]/gu, "").trim();

  // 3️⃣ Nếu có tên sản phẩm rõ ràng → truy vấn theo tên, kèm màu & size nếu có
  if (productName && productName.length > 0) {
    let query = `
      SELECT s.SP_ten, s.SP_color, s.SP_size, s.SP_price, k.so_luong
      FROM san_pham s
      LEFT JOIN kho_san_pham k ON s.SP_ma = k.SP_ma
      WHERE LOWER(s.SP_ten) LIKE ?
    `;
    const params = [`%${productName}%`];

    if (colorMatch) {
      const color = colorMatch[1].trim().toLowerCase();
      query += " AND LOWER(s.SP_color) LIKE ?";
      params.push(`%${color}%`);
    }

    if (sizeMatch) {
      query += " AND s.SP_size = ?";
      params.push(sizeMatch[1]);
    }

    query += " LIMIT 10";
    const [rows] = await db.execute(query, params);

    // Không có kết quả → fallback gợi ý
    if (rows.length === 0) {
      const [suggest] = await db.execute(
        `SELECT SP_ten, SP_color, SP_size, SP_price, 
                (SELECT k2.so_luong FROM kho_san_pham k2 WHERE k2.SP_ma = s.SP_ma LIMIT 1) as so_luong
         FROM san_pham s
         WHERE LOWER(s.SP_ten) LIKE ?
         LIMIT 5`,
        [`%${productName}%`]
      );

      if (suggest.length > 0) {
        const suggestionText = suggest
          .map(
            (r) =>
              `👟 <b>${r.SP_ten}</b> — ${r.SP_color || "Không rõ"} (size ${
                r.SP_size || "?"
              }) — ${r.so_luong > 0 ? `<b>Còn ${r.so_luong}</b>` : "Hết hàng"}`
          )
          .join("<br>");
        return `😢 Không tìm thấy chính xác theo yêu cầu (tên/màu/size).<br>💡 Gợi ý liên quan:<br>${suggestionText}`;
      }
      return `😢 Mình không tìm thấy sản phẩm “${productName}” (hoặc không có màu/size bạn yêu cầu).`;
    }

    // 4️⃣ Có kết quả: hiển thị rõ trạng thái còn / hết hàng
    const text = rows
      .map((r) => {
        const stock =
          r.so_luong !== null && r.so_luong !== undefined
            ? r.so_luong
            : "Không rõ";
        const status =
          stock > 0
            ? `<b style="color:green;">Còn ${stock}</b>`
            : `<span style="color:red;">Hết hàng</span>`;
        return `👟 <b>${r.SP_ten}</b> — ${r.SP_color || "Không rõ"} (size ${
          r.SP_size || "?"
        }) — Giá: ${
          r.SP_price
            ? r.SP_price.toLocaleString("vi-VN") + "₫"
            : "Đang cập nhật"
        } — ${status}`;
      })
      .join("<br>");

    return `📦 Kết quả kiểm tra tồn kho cho "<b>${productName}</b>":<br>${text}`;
  }

  // 5️⃣ Nếu chỉ hỏi chung: "còn hàng không?" → gợi ý 1 số sản phẩm đang có hàng
  const [allRows] = await db.execute(
    `SELECT s.SP_ten, s.SP_color, s.SP_size, s.SP_price, k.so_luong
     FROM san_pham s
     JOIN kho_san_pham k ON s.SP_ma = k.SP_ma
     WHERE k.so_luong > 0
     LIMIT 10`
  );

  if (allRows.length === 0)
    return "😢 Hiện tại shop không có sản phẩm nào còn hàng.";

  const listText = allRows
    .map(
      (r) =>
        `- <b>${r.SP_ten}</b> — ${r.SP_color || "Không rõ"} (size ${
          r.SP_size || "?"
        }) — Còn ${r.so_luong}`
    )
    .join("<br>");
  return `📦 Một số sản phẩm đang còn hàng:<br>${listText}`;
}




    // ổn============ 6️⃣ SẢN PHẨM MỚI RA / BÁN CHẠY ============ 
    if (lower.includes("mới ra") || lower.includes("mới nhất")) {
      const [rows] = await db.execute(
        "SELECT SP_ten, SP_price FROM san_pham ORDER BY SP_ma DESC LIMIT 5"
      );
      const text = rows.map(r => `- ${r.SP_ten}: ${r.SP_price?.toLocaleString("vi-VN")}₫`).join("<br>");
      return `🆕 Các sản phẩm mới nhất:<br>${text}`;
    }

    if (lower.includes("bán chạy") || lower.includes("phổ biến") || lower.includes("hot") || lower.includes("nhiều nhất")) {
      const [rows] = await db.execute(`
        SELECT s.SP_ten, SUM(c.soluong) AS tong_ban
        FROM chitiet_hoadon c
        JOIN san_pham s ON s.SP_ma = c.SP_ma
        GROUP BY s.SP_ma
        ORDER BY tong_ban DESC
        LIMIT 10
      `);
      if (rows.length === 0) return "Chưa có dữ liệu bán chạy.";
      const text = rows.map(r => `- ${r.SP_ten} (Đã bán ${r.tong_ban})`).join("<br>");
      return `🔥 Top sản phẩm bán chạy:<br>${text}`;
    }

    /////////////////////////////////////////////////////////////////////
    // 📦 TRA CỨU ĐƠN HÀNG (theo mã đơn, mã KH, SĐT hoặc email)
if (
  lower.includes("đơn hàng") ||
  lower.includes("đơn") ||
  lower.includes("dh") ||
  lower.includes("tra cứu đơn")
) {
  try {
    // ====== 1️⃣ TRA THEO MÃ ĐƠN HÀNG (VD: "DH161001") ======
    const maDHMatch = lower.match(/dh\s*(\d{6})/i); // <-- sửa lại regex: đúng 6 số
    if (maDHMatch) {
      const maDH = `DH${maDHMatch[1]}`.toUpperCase();

      const [rows] = await db.execute(
        `SELECT d.DH_ma, d.DH_orderdate, d.DH_totalprice, d.DH_trangthai,
                d.DH_diachi, d.DH_thanhtoan, k.KH_hoten, k.KH_sdt, k.KH_email
         FROM don_hang d
         JOIN khach_hang k ON d.KH_ma = k.KH_ma
         WHERE d.DH_ma = ?`,
        [maDH]
      );

      if (rows.length === 0)
        return `❌ Không tìm thấy đơn hàng có mã <b>${maDH}</b>.`;

      const d = rows[0];
      return (
        `📦 <b>Thông tin đơn hàng ${d.DH_ma}</b><br>` +
        `👤 Khách hàng: ${d.KH_hoten}<br>` +
        `📞 SĐT: ${d.KH_sdt}<br>` +
        `📧 Email: ${d.KH_email || "(không có)"}<br>` +
        `📍 Địa chỉ giao: ${d.DH_diachi}<br>` +
        `🗓️ Ngày đặt: ${new Date(d.DH_orderdate).toLocaleString("vi-VN")}<br>` +
        `💰 Tổng tiền: ${d.DH_totalprice.toLocaleString("vi-VN")}₫<br>` +
        `💳 Thanh toán: ${d.DH_thanhtoan}<br>` +
        `🚚 Trạng thái: <b>${d.DH_trangthai}</b>`
      );
    }

    // ====== 2️⃣ TRA THEO MÃ KHÁCH HÀNG ======
    const maKHMatch = lower.match(/kh\s*(\d{3,6})/i); // KH + 3–6 số
    if (maKHMatch) {
      const maKH = `KH${maKHMatch[1]}`.toUpperCase();

      const [rows] = await db.execute(
        `SELECT DH_ma, DH_orderdate, DH_totalprice, DH_trangthai
         FROM don_hang WHERE KH_ma = ? ORDER BY DH_orderdate DESC`,
        [maKH]
      );

      if (rows.length === 0)
        return `❌ Không tìm thấy đơn hàng nào của khách hàng <b>${maKH}</b>.`;

      let text = `📋 <b>Các đơn hàng của khách ${maKH}</b><br>`;
      rows.forEach((r) => {
        text +=
          `🧾 <b>${r.DH_ma}</b> - ${new Date(r.DH_orderdate).toLocaleString("vi-VN")}<br>` +
          `💰 ${r.DH_totalprice.toLocaleString("vi-VN")}₫ - 🚚 ${r.DH_trangthai}<br><br>`;
      });
      return text;
    }

    // ====== 3️⃣ TRA THEO SĐT / EMAIL ======
    const phoneMatch = lower.match(/0\d{9,10}/);
    const emailMatch = lower.match(/[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/);

    let customer = null;
    if (phoneMatch) {
      [customer] = await db.execute(
        "SELECT KH_ma, KH_hoten FROM khach_hang WHERE KH_sdt = ?",
        [phoneMatch[0]]
      );
    } else if (emailMatch) {
      [customer] = await db.execute(
        "SELECT KH_ma, KH_hoten FROM khach_hang WHERE KH_email = ?",
        [emailMatch[0]]
      );
    }

    if (customer && customer.length > 0) {
      const kh = customer[0];
      const [rows] = await db.execute(
        `SELECT DH_ma, DH_orderdate, DH_totalprice, DH_trangthai
         FROM don_hang WHERE KH_ma = ? ORDER BY DH_orderdate DESC`,
        [kh.KH_ma]
      );

      if (rows.length === 0)
        return `❌ Khách hàng <b>${kh.KH_hoten}</b> (Mã ${kh.KH_ma}) chưa có đơn hàng nào.`;

      let text = `📋 <b>Các đơn hàng của ${kh.KH_hoten}</b><br>`;
      rows.forEach((r) => {
        text +=
          `🧾 <b>${r.DH_ma}</b> - ${new Date(r.DH_orderdate).toLocaleString("vi-VN")}<br>` +
          `💰 ${r.DH_totalprice.toLocaleString("vi-VN")}₫ - 🚚 ${r.DH_trangthai}<br><br>`;
      });
      return text;
    }

    // ====== 4️⃣ KHÔNG TÌM THẤY ======
    return "❗ Bạn có thể nhập:\n- Mã đơn hàng (VD: DH161001)\n- Mã khách hàng (VD: KH001)\n- Hoặc số điện thoại/email khách để tra cứu.";
  } catch (error) {
    console.error("Lỗi tra cứu đơn hàng:", error);
    return "⚠️ Xin lỗi, hệ thống đang gặp sự cố khi tra cứu đơn hàng.";
  }
}

// ============ 6️⃣ TƯ VẤN SIZE GIÀY (CHUẨN VIỆT NAM) ============
if (
  lower.includes("tư vấn") ||
  lower.includes("chọn") ||
  lower.includes("phù hợp") ||
  lower.includes("size giày")
) {
  return `
    🦶 <b>Tư vấn size giày</b><br>
    Hãy nhập số đo bàn chân của bạn theo cú pháp sau để mình gợi ý size phù hợp nhé 👇<br><br>
    👉 <b>Ví dụ:</b> <code>25.3, 9.8</code><br>
    (trong đó <b>25.3</b> là chiều dài cm, <b>9.8</b> là chiều rộng cm)
  `;
}

// ============ 7️⃣ XỬ LÝ KHI NGƯỜI DÙNG NHẬP SỐ ĐO ============
const numberPattern = /^\s*([\d\.]+)[,\s]+([\d\.]+)\s*$/;
const match = lower.match(numberPattern);
if (match) {
  const length = parseFloat(match[1]);
  const width = parseFloat(match[2]);

  if (isNaN(length) || isNaN(width)) {
    return "⚠️ Vui lòng nhập số hợp lệ (ví dụ: 25.3, 9.8)";
  }

  // === BẢNG SIZE CHUẨN VIỆT NAM (cm) ===
  const sizeVN = [
    { vn: 38, min: 23.0, max: 23.5 },
    { vn: 39, min: 23.6, max: 24.0 },
    { vn: 40, min: 24.1, max: 24.5 },
    { vn: 41, min: 24.6, max: 25.0 },
    { vn: 42, min: 25.1, max: 25.5 },
    { vn: 43, min: 25.6, max: 26.0 },
    { vn: 44, min: 26.1, max: 26.5 },
    { vn: 45, min: 26.6, max: 27.0 },
  ];

  const found = sizeVN.find((s) => length >= s.min && length <= s.max);
  if (!found)
    return `😕 Với chiều dài <b>${length}cm</b>, mình chưa tìm thấy size Việt Nam phù hợp.`;

  // === Gợi ý theo chiều rộng bàn chân ===
  let widthNote = "";
  if (width < 8.5)
    widthNote = " (bàn chân hơi hẹp, nên chọn giày form ôm)";
  else if (width > 10)
    widthNote = " (bàn chân rộng, nên chọn giày form rộng hoặc tăng 0.5 size)";

  return `
    ✅ <b>Kết quả tư vấn size:</b><br>
    • Chiều dài: <b>${length} cm</b><br>
    • Chiều rộng: <b>${width} cm</b>${widthNote}<br><br>
    👉 <b>Size giày Việt Nam phù hợp:</b> <b>Size ${found.vn}</b><br>
    (Tương đương <b>EU ${found.vn - 1}</b>, US khoảng <b>${found.vn - 33}</b>)
  `;
}

if (
  lower.includes("khuyến mãi") ||
  lower.includes("giảm giá") ||
  lower.includes("sale") ||
  lower.includes("ưu đãi")
) {
  return (
    "🔥 <b>Khuyến mãi hấp dẫn tại ShoeTCS!</b><br>" +
    "👟 Giảm <b>10-30%</b> cho toàn bộ sản phẩm giày thể thao trong tháng này.<br>" +
    "🚚 Miễn phí vận chuyển cho đơn từ <b>500.000₫</b> trở lên.<br><br>" +
    "👉 Hãy xem thêm tại mục <b>Khuyến mãi</b> trên website hoặc gõ 'xem sản phẩm giảm giá' để mình giúp nhé!"
  );
}

if (
  lower.includes("đổi trả") ||
  lower.includes("bảo hành") ||
  lower.includes("trả hàng") ||
  lower.includes("hoàn tiền")
) {
  return (
    "♻️ <b>Chính sách đổi trả & bảo hành</b><br>" +
    "• Đổi hàng trong vòng <b>7 ngày</b> nếu sản phẩm bị lỗi từ nhà sản xuất.<br>" +
    "• Sản phẩm phải còn nguyên tem, hộp và chưa qua sử dụng.<br>" +
    "• Hỗ trợ <b>đổi size miễn phí 1 lần</b>.<br><br>" +
    "👉 Liên hệ qua hotline <b>1900 9999</b> hoặc chat trực tiếp để được hỗ trợ nhanh nhất nhé!"
  );
}

if (
  lower.includes("giao hàng") ||
  lower.includes("ship") ||
  lower.includes("vận chuyển") ||
  lower.includes("vận giao")
) {
  return (
    "🚚 <b>Chính sách giao hàng tại ShoeTCS</b><br>" +
    "• Giao hàng toàn quốc trong <b>2-5 ngày làm việc</b>.<br>" +
    "• Miễn phí vận chuyển với đơn từ <b>500.000₫</b>.<br>" +
    "• Có thể <b>kiểm tra hàng trước khi thanh toán</b>.<br><br>" +
    "👉 Bạn muốn mình tra giúp tình trạng đơn hàng của bạn không?"
  );
}



if (
  lower.includes("mẫu") ||
  lower.includes("mua") ||
  lower.includes("tìm") ||
  lower.includes("gợi") ||
  lower.includes("xem") ||
  lower.includes("cho")
) {
  console.log("✅ Vào nhánh gợi ý sản phẩm");

  // --- Trích xuất giá ---
  const priceMatch = lower.match(/(\d+(?:[\.,]\d+)?)(\s?(tr|trieu|triệu|nghìn|nghin|k))?/g);
  console.log("💰 Giá tìm thấy:", priceMatch);

  let minPrice = 0, maxPrice = Infinity;

  const parsePrice = (txt) => {
    let m = txt.match(/(\d+(?:[\.,]\d+)?)(\s?(tr|trieu|triệu|nghìn|nghin|k))?/);
    if (!m) return 0;
    let num = parseFloat(m[1].replace(",", "."));
    const unit = m[3] || "";
    if (unit.includes("triệu") || unit.includes("trieu") || unit.includes("tr")) num *= 1_000_000;
    else if (unit.includes("nghìn") || unit.includes("nghin") || unit.includes("k")) num *= 1_000;
    return num;
  };

  if (priceMatch?.length >= 2) {
    minPrice = parsePrice(priceMatch[0]);
    maxPrice = parsePrice(priceMatch[1]);
  } else if (priceMatch?.length === 1) {
    const num = parsePrice(priceMatch[0]);
    if (lower.includes("dưới")) maxPrice = num;
    else if (lower.includes("trên")) minPrice = num;
    else {
      minPrice = num * 0.8;
      maxPrice = num * 1.2;
    }
  }

  console.log(`➡️ minPrice=${minPrice}, maxPrice=${maxPrice}`);

  // --- Màu sắc ---
  const colors = ["đen", "trắng", "nâu", "hồng", "xanh", "đỏ", "vàng", "cam", "xám"];
  const color = colors.find(c => lower.includes(c)) || "";
  console.log("🎨 Màu:", color);

  // --- Truy vấn SQL ---
  let query = `
    SELECT s.SP_ten, s.SP_color, s.SP_size, s.SP_price, s.SP_hinh_anh, k.so_luong
    FROM san_pham s
    LEFT JOIN kho_san_pham k ON s.SP_ma = k.SP_ma
    WHERE 1=1
  `;
  const params = [];

  if (color) {
    query += " AND LOWER(s.SP_color) LIKE ?";
    params.push(`%${color}%`);
  }

  if (minPrice > 0 && maxPrice < Infinity) {
    query += " AND s.SP_price BETWEEN ? AND ?";
    params.push(minPrice, maxPrice);
  } else if (maxPrice < Infinity) {
    query += " AND s.SP_price <= ?";
    params.push(maxPrice);
  } else if (minPrice > 0) {
    query += " AND s.SP_price >= ?";
    params.push(minPrice);
  }

  query += " ORDER BY s.SP_price ASC LIMIT 5";
  console.log("📘 SQL:", query, params);

  try {
    const [rows] = await db.execute(query, params);
    console.log("📦 Kết quả:", rows);

    if (!rows || rows.length === 0) {
      return res.json({ reply: "😥 Không tìm thấy sản phẩm nào phù hợp với yêu cầu của bạn." });
    }

    let reply = "👟 <b>Gợi ý sản phẩm phù hợp:</b><br>";
    rows.forEach(p => {
      reply += `
        <div style="margin:10px 0;padding:10px;border:1px solid #ddd;border-radius:10px;background:#fafafa;">
          <b>${p.SP_ten}</b><br>
          Màu: ${p.SP_color || "Đang cập nhật"}<br>
          Size: ${p.SP_size || "Đang cập nhật"}<br>
          Giá: <b>${p.SP_price ? Number(p.SP_price).toLocaleString("vi-VN") + "₫" : "Đang cập nhật"}</b><br>
          Số lượng còn: ${p.so_luong ?? "Chưa rõ"}<br>
          ${p.SP_hinh_anh ? `<img src="${p.SP_hinh_anh}" style="width:120px;border-radius:8px;margin-top:5px;" />` : ""}
        </div>
      `;
    });

    return res.json({ reply });
  } catch (err) {
    console.error("❌ Lỗi SQL:", err);
    return res.json({ reply: "⚠️ Có lỗi khi truy vấn dữ liệu sản phẩm." });
  }
}


    //////////////////////////////////////////////////////////////////////
 

    // ============ 8️⃣ MẶC ĐỊNH ============
    return (
     "👋 Xin chào! Mình là trợ lý ảo của <b>ShoeTCS</b>.<br><br>" +
        "Bạn có thể hỏi mình về:<br>" +
        "🥿 <b>Sản phẩm</b> (giày, loại, size, màu...)<br>" +
        "📦 <b>Đơn hàng</b> (trạng thái, tổng tiền, gần đây...)<br>" +
        "🎁 <b>Khuyến mãi</b>, <b>đổi trả</b>, <b>giao hàng</b>...<br><br>" +
        "Hoặc mình có thể <b>tư vấn size giày</b> phù hợp cho bạn 👣"
    );
  },
};


