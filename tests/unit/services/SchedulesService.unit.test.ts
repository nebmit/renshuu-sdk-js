import { BaseClient } from "../../../src/BaseClient";
import { SchedulesService } from "../../../src/services/SchedulesService";

function mockFetch(response: any, status: number = 200) {
    global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: status,
        json: async () => response,
    } as Response);
}

describe("UserService (unit)", () => {
    let service: SchedulesService;

    beforeEach(() => {
        const base = new BaseClient({ apiKey: "testkey" });
        service = new SchedulesService(base);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should get all schedules", async () => {
        mockFetch({ schedules: [{ fake: "data" }] });

        const schedules = await service.getSchedules();
        expect(fetch).toHaveBeenCalledWith(
            "https://api.renshuu.org/v1/schedule",
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer testkey`,
                },
            },
        );
        expect(schedules).toEqual([{ fake: "data" }]);
    });

    it("should get a schedule by ID", async () => {
        mockFetch({
            schedules: [
                { id: 123, fake: "data" },
                { id: 456, fake: "data" },
            ],
        });

        const schedule = await service.getSchedule(123);
        expect(fetch).toHaveBeenCalledWith(
            "https://api.renshuu.org/v1/schedule/123",
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer testkey`,
                },
            },
        );
        expect(schedule).toEqual({ id: 123, fake: "data" });
    });

    it("should error when getting a schedule by ID that doesn't exist", async () => {
        mockFetch({
            schedules: [
                { id: 123, fake: "data" },
                { id: 456, fake: "data" },
            ],
        });

        await expect(service.getSchedule(789)).rejects.toThrow(
            "Schedule with ID 789 not found",
        );
    });

    it("should get schedule terms", async () => {
        mockFetch({
            schedules: [
                { id: 123, fake: "data" },
                { id: 456, fake: "data" },
            ],
            contents: {
                pg: 1,
                total_pg: 1,
                terms: [{ fake: "data" }],
            },
        });

        const terms = await service.getScheduleTerms(123);
        expect(fetch).toHaveBeenCalledWith(
            "https://api.renshuu.org/v1/schedule/123/list?pg=1&group=all",
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer testkey`,
                },
            },
        );
        expect(terms.data).toEqual([{ fake: "data" }]);
        expect(terms.pagination.currentPage).toBe(1);
        expect(terms.pagination.totalPages).toBe(1);
        expect(terms.pagination.hasNext).toBe(false);
        expect(terms.pagination.hasPrev).toBe(false);
        expect(terms.pagination.next()).resolves.toBeNull();
        expect(terms.pagination.prev()).resolves.toBeNull();
    });

    it("should get schedule terms with pagination", async () => {
        mockFetch({
            schedules: [
                { id: 123, fake: "data" },
                { id: 456, fake: "data" },
            ],
            contents: {
                pg: 1,
                total_pg: 2,
                terms: [{ fake: "data" }],
            },
        });

        const terms = await service.getScheduleTerms(123);
        expect(fetch).toHaveBeenCalledWith(
            "https://api.renshuu.org/v1/schedule/123/list?pg=1&group=all",
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer testkey`,
                },
            },
        );
        expect(terms.data).toEqual([{ fake: "data" }]);
        expect(terms.pagination.currentPage).toBe(1);
        expect(terms.pagination.totalPages).toBe(2);
        expect(terms.pagination.hasNext).toBe(true);
        expect(terms.pagination.hasPrev).toBe(false);
        expect(terms.pagination.prev()).resolves.toBeNull();

        mockFetch({
            schedules: [
                { id: 123, fake: "data" },
                { id: 456, fake: "data" },
            ],
            contents: {
                pg: 2,
                total_pg: 2,
                terms: [{ fake: "data2" }],
            },
        });

        const terms2 = await terms.pagination.next();
        expect(fetch).toHaveBeenCalledWith(
            "https://api.renshuu.org/v1/schedule/123/list?pg=2&group=all",
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer testkey`,
                },
            },
        );
        expect(terms2!.data).toEqual([{ fake: "data2" }]);
        expect(terms2!.pagination.currentPage).toBe(2);
        expect(terms2!.pagination.totalPages).toBe(2);
        expect(terms2!.pagination.hasNext).toBe(false);
        expect(terms2!.pagination.hasPrev).toBe(true);
        expect(terms2!.pagination.next()).resolves.toBeNull();

        mockFetch({
            schedules: [
                { id: 123, fake: "data" },
                { id: 456, fake: "data" },
            ],
            contents: {
                pg: 1,
                total_pg: 2,
                terms: [{ fake: "data" }],
            },
        });

        expect(terms2!.pagination.prev()).resolves.toEqual({
            data: [{ fake: "data" }],
            pagination: {
                currentPage: 1,
                totalPages: 2,
                hasNext: true,
                hasPrev: false,
                next: expect.any(Function),
                prev: expect.any(Function),
            },
        });
        expect(fetch).toHaveBeenCalledWith(
            "https://api.renshuu.org/v1/schedule/123/list?pg=1&group=all",
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer testkey`,
                },
            },
        );
    });
});
