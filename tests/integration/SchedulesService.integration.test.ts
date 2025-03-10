import { RenshuuClient } from "../../src";

describe("SchedulesService (integration)", () => {
    const apiKey = process.env.RENSHUU_API_KEY || "";
    let client: RenshuuClient;

    beforeAll(() => {
        if (!apiKey) {
            throw new Error(
                "RENSHUU_API_KEY not set. Cannot run integration tests.",
            );
        }
        client = new RenshuuClient({ apiKey });
    });

    it("should get all schedules", async () => {
        const schedules = await client.schedules.getSchedules();
        schedules.forEach((schedule) => {
            expect(schedule).toHaveProperty("id");
            expect(schedule).toHaveProperty("name");
        });
    });

    it("should get a schedule by ID", async () => {
        // Get all schedules to find a schedule ID
        const schedules = await client.schedules.getSchedules();
        const scheduleId = schedules[0].id;

        if (!scheduleId) {
            throw new Error("No schedule ID found");
        }

        const scheduleResult = await client.schedules.getSchedule(scheduleId);
        const schedule = scheduleResult[0];
        expect(schedule).toHaveProperty("id");
        expect(schedule).toHaveProperty("name");

        expect(schedule.id).toBe(scheduleId);
    });

    it("should get schedule terms", async () => {
        // Get all schedules to find a schedule ID
        const schedules = await client.schedules.getSchedules();
        const scheduleId = schedules[0].id;

        if (!scheduleId) {
            throw new Error("No schedule ID found");
        }

        const terms = await client.schedules.getScheduleTerms(scheduleId);
        expect(terms).toHaveProperty("data");
        expect(terms).toHaveProperty("pagination");

        terms.data.forEach((term) => {
            expect(term).toHaveProperty("id");
        });

        if (terms.pagination.totalPages <= 1) {
            expect(terms.pagination.hasNext).toBe(false);
            expect(terms.pagination.hasPrev).toBe(false);
            throw new Error("Pagination integration test failed because there is only one page of terms");
        }

        // Test pagination
        const nextTerms = await terms.pagination.next();
        expect(nextTerms).toHaveProperty("data");
        expect(nextTerms).toHaveProperty("pagination");

        if (nextTerms == null) {
            throw new Error("nextTerms is null when there should be more pages");
        }

        const prevTerms = await nextTerms.pagination.prev();
        expect(prevTerms).not.toBeNull();
        expect(prevTerms).toHaveProperty("data");
        expect(prevTerms?.pagination.currentPage).toBe(terms.pagination.currentPage);
    });
});
