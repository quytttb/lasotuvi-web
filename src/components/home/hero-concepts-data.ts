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
      "Tám quẻ tượng trưng cho 8 hướng và các hiện tượng tự nhiên (Trời, Đất, Sấm, Gió, Nước, Lửa, Núi, Đầm). Trong Tử Vi, Bát Quái giúp định hướng không gian và hiểu sự chuyển động của đất trời.",
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
      "Năm yếu tố cơ bản nuôi dưỡng (sinh) và kiềm chế (khắc) lẫn nhau: Kim sinh Thủy, Thủy sinh Mộc, Mộc sinh Hỏa, Hỏa sinh Thổ, Thổ sinh Kim. Đây là gốc rễ để tính độ sáng của các sao và bản mệnh con người.",
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
      "Sự kết hợp giữa 10 Can trời và 12 Chi đất tạo nên chu kỳ 60 năm hoa giáp. 12 Chi cũng chính là 12 cung cố định trên bàn cờ lá số Tử Vi.",
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
      "Vòng tròn Âm Dương thể hiện hai mặt đối lập nhưng luôn chuyển hóa, nâng đỡ nhau như ngày và đêm, sáng và tối. Trong lá số, Âm Dương quyết định chiều an sao và hướng đi của các đại vận đời người.",
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
      "Cổ nhân dùng 12 lóng của 4 ngón tay trái để đại diện cho 12 cung. Nhờ vậy, người xưa chỉ cần dùng ngón tay cái bấm vòng quanh là có thể an sao và tính nhanh hạn từng năm mà không cần sách vở.",
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
      "12 cung liên kết chặt chẽ với nhau: mỗi bộ 3 cung cách đều tạo thành thế Tam Hợp chung sức giúp đỡ nhau (như Mệnh - Tài - Quan), còn hai cung đối diện qua tâm sẽ chiếu thẳng và tác động trực tiếp lên nhau.",
    significance: "Cốt lõi xem Mệnh - Tài - Quan",
  },
  {
    id: "vong-truong-sinh",
    number: "07",
    title: "Vòng Trường Sinh",
    hanzi: "長生",
    subtitle: "12 Giai Đoạn Đời Người",
    tag: "Nhịp Sống Lên Xuống",
    tagColor: "var(--wood)",
    description:
      "Mô tả vòng đời của vạn vật như nhịp sóng: sinh ra, lớn lên, đạt đến lúc mạnh mẽ nhất (Đế Vượng) rồi dần suy yếu và tái sinh. Vòng này giúp nhận biết giai đoạn nào trong đời đang gặp thời hoặc cần nghỉ ngơi.",
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
      "Hai bức tranh số học cổ xưa ghi lại quy luật vũ trụ bằng các chấm đen trắng. Từ các con số này, người xưa tìm ra Cục số (Thủy Nhị Cục, Mộc Tam Cục...) để biết thời điểm bắt đầu khởi vận của mỗi người.",
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
      "Bốn nguồn năng lượng thay đổi số phận: Lộc mang lại may mắn tài lộc, Quyền đem lại uy danh quyền hành, Khoa chủ về trí tuệ khoa cử, còn Kỵ báo hiệu trở ngại lo toan. Các luồng khí này bay sang cung nào sẽ kích hoạt chuyện ở cung đó.",
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
      "Lá số Tử Vi có 3 tầng: Thiên Bàn xem số mệnh trời định sẵn, Địa Bàn soi rọi tính cách sâu kín bên trong, và Nhân Bàn thể hiện cách con người ứng xử, nỗ lực vươn lên trước hoàn cảnh.",
    significance: "Hiểu rõ mệnh trời và nỗ lực bản thân",
  },
];
