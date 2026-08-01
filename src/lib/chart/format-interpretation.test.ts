import { describe, expect, it } from "vitest";

import { parseInterpretation } from "@/lib/chart/format-interpretation";

const majorSample =
  "Khi Thiên Cơ đóng cung Huynh đệ — cung luận về anh chị em — quan hệ ngang hàng mang dấu Thiên Cơ. Thiên Cơ chủ trí tuệ, mưu lược và biến đổi liên tục. Đắc địa hoặc được lục cát / hóa Lộc–Quyền–Khoa nâng: đắc địa hoặc hóa Lộc/Khoa phát huy trí tuệ. Hãm địa hoặc hội lục sát / hóa Kỵ: hãm hoặc hóa Kỵ dễ phân tích triệt tiêu hành động. Hướng xử lý gắn Huynh đệ: chốt một ưu tiên trong tuần. Nên xem thêm đối cung và tam phương tứ chính. Nội dung mang tính tham khảo văn hóa/nghiên cứu. [Tương tác Ngũ Hành: Hành Sao khắc Bản Mệnh (Tử), Sao gây bất lợi.]";

const minorSample =
  "Giải Thần tại cung Huynh đệ (luận anh chị em, ngang hàng và cộng sự gần) đóng vai trò củng cố đối với chủ đề quan hệ ngang hàng. Giải Thần chủ tháo gỡ, giảm nạn, tìm lối thoát khi cung bị áp. Trong bối cảnh hợp tác, cạnh tranh và chỗ dựa trong nhóm, mặt thuận thường là: hóa giải, có người/cách gỡ rối. Mặt lệch cần để ý: ỷ vào “sẽ tự gỡ” mà chậm xử. Khi cùng cung với chính tinh sáng và ít sát, Giải Thần dễ củng cố lực cung. Khi chính tinh vốn yếu hoặc đã hội nhiều sát, ảnh hưởng của Giải Thần lên Huynh đệ dễ bị phóng đại — cần đọc kèm toàn cục, không tách một phụ tinh để kết luận. Gợi ý thực tế: ghi nhận Giải Thần như một “màu” của quan hệ ngang hàng, rồi chỉnh một thói quen nhỏ thay vì sợ sao. Chỉ mang tính tham khảo.";

describe("parseInterpretation", () => {
  it("splits major text and extracts ngũ hành note", () => {
    const parsed = parseInterpretation(majorSample);
    expect(parsed.isMinorTemplate).toBe(false);
    expect(parsed.elementNote).toMatch(/Hành Sao khắc Bản Mệnh/);
    expect(parsed.paragraphs.length).toBeGreaterThanOrEqual(3);
    expect(parsed.paragraphs[0]).toMatch(/Thiên Cơ/);
    expect(parsed.paragraphs.some((p) => p.startsWith("Đắc địa"))).toBe(true);
    expect(parsed.paragraphs.some((p) => p.startsWith("Hãm địa"))).toBe(true);
  });

  it("extracts compact fields from minor-star template", () => {
    const parsed = parseInterpretation(minorSample);
    expect(parsed.isMinorTemplate).toBe(true);
    expect(parsed.minor?.role).toMatch(/củng cố/);
    expect(parsed.minor?.nature).toMatch(/tháo gỡ/);
    expect(parsed.minor?.favorable).toMatch(/hóa giải/);
    expect(parsed.minor?.caution).toMatch(/chậm xử/);
    expect(parsed.paragraphs).toEqual([]);
  });
});
