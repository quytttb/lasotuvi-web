import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { BirthForm } from "@/components/form/BirthForm";
import { ChartResults } from "@/components/chart/ChartResults";
import { ChartWorkspace } from "@/components/chart/ChartWorkspace";
import sampleChart from "@/test/fixtures/sample-chart.json";
import { validateChartResponse } from "@/lib/chart/validate";
import * as repo from "@/lib/storage/repository";

const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => {
  server.resetHandlers();
  vi.restoreAllMocks();
});
afterAll(() => server.close());

describe("BirthForm", () => {
  it("is accessible and shows solar date field errors", async () => {
    const user = userEvent.setup();
    render(<BirthForm onSuccess={() => undefined} />);

    expect(screen.getByLabelText(/Họ tên/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Giới tính/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Giờ sinh/i)).toBeInTheDocument();

    await user.clear(screen.getByLabelText(/^Ngày$/i));
    await user.type(screen.getByLabelText(/^Ngày$/i), "31");
    await user.clear(screen.getByLabelText(/^Tháng$/i));
    await user.type(screen.getByLabelText(/^Tháng$/i), "2");
    await user.click(screen.getByTestId("submit-chart"));

    expect(await screen.findByRole("alert")).toHaveTextContent(/không hợp lệ/i);
  });

  it("submits correct BirthInfoRequest", async () => {
    const user = userEvent.setup();
    let body: unknown;
    server.use(
      http.post("http://localhost:8000/chart/generate", async ({ request }) => {
        body = await request.json();
        expect(request.headers.get("X-Request-ID")).toBeTruthy();
        return HttpResponse.json(sampleChart);
      }),
    );
    const onSuccess = vi.fn();
    render(<BirthForm onSuccess={onSuccess} />);

    await user.clear(screen.getByLabelText(/Họ tên/i));
    await user.type(screen.getByLabelText(/Họ tên/i), "Test");
    await user.click(screen.getByTestId("submit-chart"));

    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
    expect(body).toMatchObject({
      day: 15,
      month: 8,
      year: 1990,
      hour: 7,
      gender: 1,
      is_solar: true,
      timezone: 7,
      name: "Test",
      view_year: expect.any(Number),
    });
  });

  it("shows loading hints over time", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    try {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      server.use(
        http.post("http://localhost:8000/chart/generate", async () => {
          await new Promise((r) => setTimeout(r, 35_000));
          return HttpResponse.json(sampleChart);
        }),
      );
      render(<BirthForm onSuccess={() => undefined} />);
      await user.click(screen.getByTestId("submit-chart"));

      expect(await screen.findByTestId("loading-message")).toHaveTextContent(/Đang lập/i);
      await vi.advanceTimersByTimeAsync(9_000);
      expect(screen.getByTestId("loading-message")).toHaveTextContent(/khởi động/i);
      await vi.advanceTimersByTimeAsync(25_000);
      expect(screen.getByTestId("loading-message")).toHaveTextContent(/vẫn đang được xử lý/i);
    } finally {
      vi.useRealTimers();
    }
  }, 20_000);

  it("shows 429 countdown", async () => {
    const user = userEvent.setup();
    server.use(
      http.post("http://localhost:8000/chart/generate", () =>
        HttpResponse.json(
          { detail: "Too many requests", request_id: "rid-429" },
          { status: 429, headers: { "Retry-After": "5", "X-Request-ID": "rid-429" } },
        ),
      ),
    );
    render(<BirthForm onSuccess={() => undefined} />);
    await user.click(screen.getByTestId("submit-chart"));
    expect(await screen.findByTestId("api-error")).toHaveTextContent(/Too many|quá nhiều|chờ/i);
    expect(await screen.findByTestId("retry-after")).toHaveTextContent(/5s|4s|3s/);
  });

  it("shows 503 with request id and manual retry hint", async () => {
    const user = userEvent.setup();
    server.use(
      http.post("http://localhost:8000/chart/generate", () =>
        HttpResponse.json(
          { error: "Chart engine unavailable", request_id: "rid-503" },
          { status: 503, headers: { "X-Request-ID": "rid-503" } },
        ),
      ),
    );
    render(<BirthForm onSuccess={() => undefined} />);
    await user.click(screen.getByTestId("submit-chart"));
    const alert = await screen.findByTestId("api-error");
    expect(alert).toHaveTextContent(/bận|sẵn sàng|unavailable/i);
    expect(alert).toHaveTextContent("rid-503");
    expect(alert).toHaveTextContent(/thử lại thủ công/i);
  });

  it("maps 422 into form fields", async () => {
    const user = userEvent.setup();
    server.use(
      http.post("http://localhost:8000/chart/generate", () =>
        HttpResponse.json(
          {
            detail: [{ loc: ["body", "day"], msg: "Field required", type: "missing" }],
          },
          { status: 422 },
        ),
      ),
    );
    render(<BirthForm onSuccess={() => undefined} />);
    await user.click(screen.getByTestId("submit-chart"));
    const alert = await screen.findByTestId("api-error");
    expect(alert).toHaveTextContent(/Field required/i);
    expect(alert).toHaveTextContent(/day/i);
  });
});

describe("ChartResults", () => {
  it("renders 12 palaces, major stars, Thân/Tuần/Triệt markers", () => {
    const chart = validateChartResponse(sampleChart);
    // Ensure markers exist for assertion
    chart.earth_plate.palaces[0].is_body_palace = true;
    chart.earth_plate.palaces[0].is_xun = true;
    chart.earth_plate.palaces[1].is_triet = true;

    render(<ChartResults chart={chart} />);
    expect(screen.getByTestId("chart-board").querySelectorAll("[data-palace-index]")).toHaveLength(
      12,
    );
    expect(screen.getAllByText("Thân").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Tuần").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Triệt").length).toBeGreaterThan(0);

    const major = chart.earth_plate.palaces.flatMap((p) =>
      p.stars.filter((s) => s.category === 1).map((s) => s.name),
    );
    if (major[0]) expect(screen.getAllByText(major[0]).length).toBeGreaterThan(0);

    const withMiao = chart.earth_plate.palaces
      .flatMap((p) => p.stars)
      .find((s) => s.miao_wang_label);
    if (withMiao?.miao_wang_label) {
      expect(screen.getAllByText(withMiao.miao_wang_label).length).toBeGreaterThan(0);
    }
  });

  it("does not crash when optional fields are null", () => {
    const chart = validateChartResponse(sampleChart);
    chart.birth_info.name = null;
    chart.chart_meta = null;
    chart.earth_plate.chart_meta = null;
    chart.earth_plate.palaces[0].palace_name = null;
    chart.earth_plate.palaces[0].stem_name = null;
    chart.earth_plate.palaces[0].da_xian_age = null;
    chart.earth_plate.palaces[0].xiao_xian_branch = null;
    chart.earth_plate.palaces[0].yue_xian = null;
    chart.earth_plate.palaces[0].stars[0] = {
      ...chart.earth_plate.palaces[0].stars[0],
      element: null,
      category: null,
      miao_wang: null,
      miao_wang_label: null,
      mutagen: null,
      is_auspicious: null,
    };
    expect(() => render(<ChartResults chart={chart} />)).not.toThrow();
  });
});

describe("ChartWorkspace save", () => {
  it("saves successfully", async () => {
    const user = userEvent.setup();
    server.use(
      http.post("http://localhost:8000/chart/generate", () => HttpResponse.json(sampleChart)),
    );
    vi.spyOn(repo, "checkStorageAvailability").mockResolvedValue({ available: true });
    vi.spyOn(repo, "saveChart").mockResolvedValue({
      id: "1",
      schemaVersion: 1,
      title: "Nguyễn Văn A",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      birthInput: validateChartResponse(sampleChart).birth_info,
      chart: validateChartResponse(sampleChart),
    });

    render(<ChartWorkspace />);
    await user.click(screen.getByTestId("submit-chart"));
    await screen.findByTestId("save-chart");
    await user.click(screen.getByTestId("save-chart"));
    expect(await screen.findByTestId("save-success")).toBeInTheDocument();
  });

  it("shows quota error", async () => {
    const user = userEvent.setup();
    server.use(
      http.post("http://localhost:8000/chart/generate", () => HttpResponse.json(sampleChart)),
    );
    vi.spyOn(repo, "checkStorageAvailability").mockResolvedValue({ available: true });
    vi.spyOn(repo, "saveChart").mockRejectedValue(
      new Error("Bộ nhớ trình duyệt đã đầy. Hãy xóa bớt lá số đã lưu hoặc giải phóng dung lượng rồi thử lại."),
    );

    render(<ChartWorkspace />);
    await user.click(screen.getByTestId("submit-chart"));
    await screen.findByTestId("save-chart");
    await user.click(screen.getByTestId("save-chart"));
    expect(await screen.findByTestId("save-error")).toHaveTextContent(/đầy/i);
  });
});
