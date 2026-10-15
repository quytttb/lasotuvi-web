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
    tag: "Vũ Trụ Quan",
    tagColor: "var(--gold)",
    description:
      "Tám quẻ tương ứng 8 hướng và quy luật biến dịch của vũ trụ, xác định phương vị không gian và nền tảng quẻ Dịch.",
    significance: "Định vị phương hướng và trục biến thiên",
  },
  {
    id: "ngu-hanh",
    number: "02",
    title: "Ngũ Hành Sinh Khắc",
    hanzi: "五行",
    subtitle: "Kim · Mộc · Thủy · Hỏa · Thổ",
    tag: "Quy Luật Cơ Bản",
    tagColor: "var(--wood)",
    description:
      "Vòng tròn tương sinh tương khắc chi phối miếu hãm của các vì sao, bản mệnh và tương quan giữa các cung vị.",
    significance: "Chi phối miếu hãm & bản mệnh",
  },
  {
    id: "can-chi",
    number: "03",
    title: "Thập Can & Thập Nhị Chi",
    hanzi: "干支",
    subtitle: "10 Thiên Can · 12 Địa Chi",
    tag: "Tọa Độ Thời Gian",
    tagColor: "var(--water)",
    description:
      "Hệ tọa độ không - thời gian Đông Phương. 10 Can và 12 Chi giao hòa tạo nên 60 hoa giáp định danh vận mệnh đời người.",
    significance: "Bố cục 12 cung & 60 hoa giáp",
  },
  {
    id: "thai-cuc",
    number: "04",
    title: "Thái Cực & Lưỡng Nghi",
    hanzi: "太極",
    subtitle: "Âm Dương Thuận Nghịch · Cân Bằng Khí",
    tag: "Bản Thể Luận",
    tagColor: "var(--vermillion)",
    description:
      "Cội nguồn của vạn vật. Trong Tử Vi, Âm Dương định danh Nam Dương, Nữ Âm, chiều an sao và hướng vận chuyển đại hạn.",
    significance: "Quyết định chiều thuận nghịch an sao",
  },
  {
    id: "chuong-ban",
    number: "05",
    title: "Chưởng Bàn Bấm Độn",
    hanzi: "掌盤",
    subtitle: "12 Lóng Tay Trái · Khởi Điểm Bấm Quẻ",
    tag: "Bí Truyền Cổ Nhân",
    tagColor: "var(--earth)",
    description:
      "Bàn tay trái với 12 lóng tay cố định 12 Chi, công cụ bấm độn an hơn 100 vì sao và tính đại tiểu hạn nhanh như chớp.",
    significance: "Kỹ thuật bấm an sao truyền thống",
  },
  {
    id: "tam-hop-xung-chieu",
    number: "06",
    title: "Tam Hợp & Xung Chiếu",
    hanzi: "三合衝照",
    subtitle: "Tam Giác Tương Trợ · Trục Đối Xung",
    tag: "Hình Học Cung Vị",
    tagColor: "var(--gold)",
    description:
      "Mô hình hình học liên kết giữa 12 cung: 4 tam giác Tam Hợp kết tụ năng lượng, và 6 trục Xung Chiếu tạo thế phản chiếu.",
    significance: "Cốt lõi luận đoán Mệnh - Tài - Quan",
  },
  {
    id: "vong-truong-sinh",
    number: "07",
    title: "Vòng Trường Sinh",
    hanzi: "長生",
    subtitle: "12 Trạng Thái Chu Kỳ Sinh Mệnh",
    tag: "Sinh Khí Tuần Hoàn",
    tagColor: "var(--wood)",
    description:
      "Đồ thị hình sin tuần hoàn từ Thai, Dưỡng đến đỉnh cao Đế Vượng và thoái lui Tuyệt, phản ánh nhịp sinh khí từng cung.",
    significance: "Đo lường độ suy vượng thời vận",
  },
  {
    id: "ha-do-lac-thu",
    number: "08",
    title: "Hà Đồ & Lạc Thư",
    hanzi: "河圖洛書",
    subtitle: "Ma Phương Cửu Cung · Nguồn Gốc Định Cục",
    tag: "Nguyên Khí Thượng Cổ",
    tagColor: "var(--water)",
    description:
      "Đồ hình điểm chấm thần bí thời thượng cổ định ra Ngũ Hành Cục (Thủy Nhị, Mộc Tam, Kim Tứ, Thổ Ngũ, Hỏa Lục) của lá số.",
    significance: "Quyết định Cục số khởi vận",
  },
  {
    id: "tu-hoa-phi-tinh",
    number: "09",
    title: "Tứ Hóa Phi Tinh",
    hanzi: "四化",
    subtitle: "Hóa Lộc · Hóa Quyền · Hóa Khoa · Hóa Kỵ",
    tag: "Động Lực Biến Đổi",
    tagColor: "var(--vermillion)",
    description:
      "Mạng lưới vector mũi tên chuyển dịch giữa các cung, biểu diễn tương tác nhân quả và sự bùng nổ vận hạn trong đời.",
    significance: "Linh hồn biến hóa của Đẩu Số",
  },
  {
    id: "tam-tai",
    number: "10",
    title: "Tam Tài: Thiên – Địa – Nhân",
    hanzi: "三才",
    subtitle: "3 Tầng Cấu Trúc: Thiên Bàn · Địa Bàn · Nhân Bàn",
    tag: "Tam Thể Đồng Quy",
    tagColor: "var(--gold)",
    description:
      "Ba tầng lá số hòa quyện: Thiên Bàn định mệnh bẩm sinh, Địa Bàn soi căn cơ tiềm ẩn, và Nhân Bàn chỉ ra hành động hậu thiên.",
    significance: "Cấu trúc toàn diện của lá số Tử Vi",
  },
];
