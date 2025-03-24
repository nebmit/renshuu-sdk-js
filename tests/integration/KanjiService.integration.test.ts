import { RenshuuClient } from "../../src";

describe("KanjiService (integration)", () => {
    const apiKey = process.env.RENSHUU_API_KEY ?? "";
    let client: RenshuuClient;

    beforeAll(() => {
        if (!apiKey) {
            throw new Error(
                "RENSHUU_API_KEY not set. Cannot run integration tests.",
            );
        }
        client = new RenshuuClient({ apiKey });
    });

    it("should get a kanji by id", async () => {
        const kanji = await client.kanji.getById(1);
        expect(kanji).toHaveProperty("id");
        expect(kanji).toHaveProperty("kanji");
        expect(kanji).toHaveProperty("definition");

        expect(kanji.id).toBe("1");
    });

    describe("addKanjiToSchedule", () => {
        it("should add a kanji to a schedule (schedule not found)", async () => {
            const schedules = await client.schedules.getSchedules();
            // Create a schedule ID that doesn't exist (Just assuming that, although ids can technically be strings, they are numbers)
            const fakeScheduleId =
                Math.max(...schedules.map((s) => parseInt(s.id ?? ""))) + 1;
            await expect(
                client.kanji.addToSchedule(2100, fakeScheduleId),
            ).rejects.toThrow(`Request failed with status: 404`);
        });

        it("should add a kanji to a schedule (kanji already added)", async () => {
            const schedules = await client.schedules.getSchedules();
            const scheduleId = schedules[0].id;

            if (!scheduleId) {
                throw new Error("No schedules found, cannot run test");
            }

            try {
                await client.kanji.addToSchedule(2100, scheduleId);
            } catch (e) {
                // Ignore
            }

            await expect(
                client.kanji.addToSchedule(2100, scheduleId),
            ).rejects.toThrow(`Request failed with status: 409`);
        });

        it("should add a kanji to a schedule", async () => {
            const schedules = await client.schedules.getSchedules();
            const scheduleId = schedules[0].id;

            if (!scheduleId) {
                throw new Error("No schedules found, cannot run test");
            }

            try {
                await client.kanji.removeFromSchedule(269, scheduleId);
            } catch (e) {
                // Ignore
            }

            await client.kanji.addToSchedule(269, scheduleId);
        });
    });

    it("should remove a kanji from a schedule", async () => {
        const schedules = await client.schedules.getSchedules();
        const scheduleId = schedules[0].id;

        if (!scheduleId) {
            throw new Error("No schedules found, cannot run test");
        }

        try {
            await client.kanji.addToSchedule(271, scheduleId);
        } catch (e) {
            // Ignore
        }

        await client.kanji.removeFromSchedule(271, scheduleId);
    });

    it("should search for kanji", async () => {
        const kanjis = await client.kanji.search("meeting");

        kanjis.forEach((kanji) => {
            expect(kanji).toHaveProperty("id");
            expect(kanji).toHaveProperty("kanji");
            expect(kanji).toHaveProperty("definition");
        });

        expect(kanjis.some((g) => g.kanji === "会")).toBe(true);
    });
});
