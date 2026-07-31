# LasoTuVi Web

[English version](README.en.md)

Ứng dụng web tiếng Việt để lập và xem lá số Tử Vi Đẩu Số qua [LasoTuVi API](https://github.com/quytttb/lasotuvi).

## Mục tiêu sản phẩm

1. Nhập ngày, tháng, năm và giờ sinh.
2. Lập lá số qua `POST /chart/generate`.
3. Xem bàn 12 cung theo bố cục truyền thống.
4. Xem Mệnh/Cục, Can Chi, cách cục và luận giải từng cung.
5. Lưu / mở / đổi tên / xuất / xóa lá số trên thiết bị (IndexedDB).
6. In hoặc lưu PDF bằng trình duyệt (`window.print()`).
7. Không đăng nhập, không backend riêng cho frontend, không lưu dữ liệu người dùng trên server frontend.

## Stack

- Next.js 16.2.12 (App Router) · TypeScript strict · Node.js 24
- pnpm · Tailwind CSS v4
- React Hook Form · Zod 4 · `@hookform/resolvers`
- `idb` · Lucide (khi cần)
- Vitest · React Testing Library · MSW · Playwright
- ESLint flat config · Prettier

## Setup local

```bash
# Node.js 24 LTS
corepack enable
pnpm install
cp .env.example .env.local
pnpm dev
```

Mở http://localhost:3000.

## File env mẫu

```env
NEXT_PUBLIC_LASOTUVI_API_URL=http://localhost:8000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_BACKEND_REPO_URL=https://github.com/quytttb/lasotuvi
OPENAPI_SCHEMA_URL=http://localhost:8000/openapi.json
```

`NEXT_PUBLIC_*` là biến **build-time**. Đổi API URL trên Vercel rồi **rebuild/redeploy**.

## Chạy với backend local

1. Trong repo `lasotuvi`: `./run_api.sh` (mặc định `:8000`).
2. Đặt `NEXT_PUBLIC_LASOTUVI_API_URL=http://localhost:8000`.
3. Đảm bảo CORS backend cho phép `http://localhost:3000` (hoặc `*` khi credentials tắt).

Browser gọi API **trực tiếp** — không có proxy Next.js.

## Tests

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm exec playwright install chromium   # lần đầu
pnpm test:e2e
```

E2E mock API bằng Playwright route — **không** gọi Render production trong CI.

## Cập nhật OpenAPI / types

Snapshot đã commit tại `openapi/openapi.json` và `src/types/api.generated.ts`.

```bash
# Khi backend local đang chạy:
OPENAPI_SCHEMA_URL=http://localhost:8000/openapi.json pnpm api:types
```

Không tải OpenAPI trong mỗi lần `build`.

## Mô hình dữ liệu local

IndexedDB database `lasotuvi-web`, store `charts`:

```ts
type SavedChart = {
  id: string;
  schemaVersion: 1;
  title: string;
  createdAt: string;
  updatedAt: string;
  birthInput: BirthInfoRequest;
  chart: ChartResponse;
};
```

Chỉ lưu khi người dùng nhấn **Lưu lá số**. Có import JSON (validate Zod; không overwrite trùng ID trừ khi chọn ghi đè).

## Deploy Vercel

1. Import repo `lasotuvi-web` vào Vercel.
2. Framework: Next.js · Install: `pnpm install --frozen-lockfile` · Build: `pnpm build`.
3. Env:
   - `NEXT_PUBLIC_LASOTUVI_API_URL` = URL Render API
   - `NEXT_PUBLIC_SITE_URL` = domain production
4. Redeploy sau mỗi lần đổi `NEXT_PUBLIC_*`.

`vercel.json` có sẵn cấu hình cơ bản.

## CORS backend

Sau khi có domain frontend, cấu hình backend:

```env
LASOTUVI_CORS_ORIGINS=https://your-frontend.vercel.app,http://localhost:3000
```

API không dùng credentials → giai đoạn đầu có thể giữ `*`. Khi siết CORS, thêm origin production và localhost.

**Lưu ý:** Vercel preview domains đổi động; nếu backend chỉ allow origin production, preview sẽ lỗi CORS.

## Giới hạn Render Free / cold start

Máy chủ miễn phí có thể ngủ. UI hiện gợi ý sau ~8s và ~30s; timeout 90s; có nút **Hủy**. Không tự retry `POST` lập lá số.

## Tháng nhuận âm lịch

`BirthInfoRequest` hiện **không** có `is_leap_month`. Form ghi chú rõ: nhập tháng nhuận trực tiếp chưa được hỗ trợ đầy đủ.

## Privacy statement

- Lập lá số: gửi ngày giờ sinh tới API công khai để tính chart.
- Frontend không có database cloud và không analytics trong MVP.
- Lưu cục bộ chỉ khi người dùng chọn; dữ liệu nằm trên trình duyệt đó.
- Không đưa dữ liệu sinh vào URL; không log birth info ở production.

## Scripts

| Script | Mô tả |
|---|---|
| `dev` | Dev server |
| `build` / `start` | Production |
| `lint` / `typecheck` | Chất lượng mã |
| `test` / `test:watch` | Unit + component |
| `test:e2e` | Playwright |
| `api:types` | Cập nhật OpenAPI snapshot |
