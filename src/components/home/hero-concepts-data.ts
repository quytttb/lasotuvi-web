export interface ConceptItem {
  id: string;
  number: string;
  title: string;
  hanzi: string;
  subtitle: string;
  tag: string;
  tagColor: string;
  description: string;
  significance: string;
}

export const CONCEPTS_DATA: ConceptItem[] = [
  {
    id: "bat-quai",
    number: "01",
    title: "Bát Quái Đồ",
    hanzi: "八卦",
    subtitle: "Càn · Đoài · Ly · Chấn · Tốn · Khảm · Cấn · Khôn",
    tag: "8 Hướng Trời Đất",
    tagColor: "var(--gold)",
    description:
      "Tám quẻ định vị 8 hướng không gian và thời tiết đất trời, giúp xác định chuẩn xác vị thế các cung trên lá số.",
    significance: "Định vị phương hướng & không gian",
  },
  {
    id: "ngu-hanh",
    number: "02",
    title: "Ngũ Hành Sinh Khắc",
    hanzi: "五行",
    subtitle: "Kim · Mộc · Thủy · Hỏa · Thổ",
    tag: "5 Yếu Tố Tự Nhiên",
    tagColor: "var(--wood)",
    description:
      "Năm yếu tố tương sinh và tương khắc lẫn nhau, là nền tảng xác định bản mệnh và độ sáng tối của các vì sao.",
    significance: "Nền tảng xem bản mệnh & tính chất sao",
  },
  {
    id: "can-chi",
    number: "03",
    title: "10 Can & 12 Chi",
    hanzi: "干支",
    subtitle: "Giáp, Ất... & Tí, Sửu, Dần, Mão...",
    tag: "Năm Tháng Ngày Giờ",
    tagColor: "var(--water)",
    description:
      "10 Can trời phối cùng 12 Chi đất tạo nên chu kỳ 60 năm hoa giáp và 12 cung cố định trên bàn cờ Tử Vi.",
    significance: "Khung giờ sinh & 60 năm hoa giáp",
  },
  {
    id: "thai-cuc",
    number: "04",
    title: "Thái Cực & Âm Dương",
    hanzi: "太極",
    subtitle: "Hai Mặt Đối Lập Hòa Hợp",
    tag: "Cội Nguồn Vạn Vật",
    tagColor: "var(--vermillion)",
    description:
      "Hai mặt sáng tối chuyển hóa nhịp nhàng, quyết định chiều thuận nghịch khi an sao và hướng đi các đại vận đời người.",
    significance: "Quyết định chiều quay đại vận",
  },
  {
    id: "chuong-ban",
    number: "05",
    title: "Bàn Tay Bấm Cung",
    hanzi: "掌盤",
    subtitle: "12 Lóng Tay Trái Của Thầy Tử Vi",
    tag: "Bí Quyết Bấm Số",
    tagColor: "var(--earth)",
    description:
      "12 lóng tay trái đại diện cho 12 cung, cho phép người xưa bấm ngón tay là an sao và tính hạn nhanh chóng.",
    significance: "An sao & tính hạn trên bàn tay",
  },
  {
    id: "tam-hop-xung-chieu",
    number: "06",
    title: "Tam Hợp & Đối Xung",
    hanzi: "三合衝照",
    subtitle: "Bộ Ba Nâng Đỡ · Hai Cung Đối Mặt",
    tag: "Thế Đứng Cung Vị",
    tagColor: "var(--gold)",
    description:
      "Thế ba cung vững như kiềng ba chân nâng đỡ nhau (Mệnh – Tài – Quan), cùng trục đối diện chiếu thẳng tác động nhau.",
    significance: "Cốt lõi xem Mệnh - Tài - Quan",
  },
  {
    id: "vong-truong-sinh",
    number: "07",
    title: "Vòng Trường Sinh",
    hanzi: "長生",
    subtitle: "12 Giai Đoạn Chu Kỳ Đời Người",
    tag: "Nhịp Sống Lên Xuống",
    tagColor: "var(--wood)",
    description:
      "12 giai đoạn mô tả chu kỳ sinh sôi, cực thịnh rồi suy tàn, giúp nhận biết thời vận đang lên hay lúc cần nghỉ ngơi.",
    significance: "Đo độ hưng thịnh & suy tàn",
  },
  {
    id: "ha-do-lac-thu",
    number: "08",
    title: "Hà Đồ & Lạc Thư",
    hanzi: "河圖洛書",
    subtitle: "Bảng 9 Cung Số Cổ Xưa",
    tag: "Nguồn Gốc Bắt Đầu",
    tagColor: "var(--water)",
    description:
      "Mật mã số học vũ trụ cổ xưa, là gốc rễ định ra Cục số để tính tuổi bắt đầu khởi phát vận hạn của mỗi người.",
    significance: "Định ra Cục số của lá số",
  },
  {
    id: "tu-hoa-phi-tinh",
    number: "09",
    title: "Tứ Hóa Bay Cung",
    hanzi: "四化",
    subtitle: "Lộc · Quyền · Khoa · Kỵ",
    tag: "4 Luồng Biến Hóa",
    tagColor: "var(--vermillion)",
    description:
      "Bốn luồng khí May Mắn, Uy Quyền, Trí Tuệ và Trở Ngại; khi bay đến cung nào sẽ kích hoạt vận hội ở cung đó.",
    significance: "Nút thắt may rủi trong đời",
  },
  {
    id: "tam-tai",
    number: "10",
    title: "Tam Tài: Thiên – Địa – Nhân",
    hanzi: "三才",
    subtitle: "Trời Định · Đất Dưỡng · Người Hành Động",
    tag: "Ba Tầng Lá Số",
    tagColor: "var(--gold)",
    description:
      "Ba tầng lá số: Thiên Bàn xem số mệnh trời ban, Địa Bàn soi tính cách sâu kín, còn Nhân Bàn thể hiện nỗ lực tự thân.",
    significance: "Hiểu rõ mệnh trời và nỗ lực bản thân",
  },
];
