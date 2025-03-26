import { RenshuuClient } from "../../src";

describe("RenshuuClient (integration)", () => {
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

    it("should search for vocabulary", async () => {
        const words = await client.vocabulary.search("word");
        expect(words.pagination).toHaveProperty("currentPage");
        words.data.forEach((word) => {
            expect(word).toHaveProperty("id");
            expect(word).toHaveProperty("kanji_full");
            expect(word).toHaveProperty("hiragana_full");
        });

        // Test pagination
        const nextWords = await words.pagination.next();
        expect(nextWords).not.toBeNull();
        expect(nextWords!.pagination.currentPage).toBe(
            words.pagination.currentPage + 1,
        );
        nextWords!.data.forEach((word) => {
            expect(word).toHaveProperty("id");
            expect(word).toHaveProperty("kanji_full");
            expect(word).toHaveProperty("hiragana_full");
        });

        const prevWords = await nextWords!.pagination.prev();
        expect(prevWords).not.toBeNull();
        expect(prevWords!.pagination.currentPage).toBe(
            words.pagination.currentPage,
        );

        const prevWords2 = await prevWords!.pagination.prev();
        expect(prevWords2).toBeNull();
    });

    it("should fetch a word by ID", async () => {
        const word = await client.vocabulary.getById(1);
        expect(word).toHaveProperty("id");
        expect(word).toHaveProperty("kanji_full");
        expect(word).toHaveProperty("hiragana_full");

        expect(word.id).toBe("1");
    });

    it("should fetch a word by ID (not found)", async () => {
        await expect(
            client.vocabulary.getById("49302422503972390q"),
        ).rejects.toThrow("Word with ID 49302422503972390q not found");
    });

    describe("addWordToSchedule", () => {
        it("should add a word to a schedule (schedule not found)", async () => {
            const schedules = await client.schedules.getSchedules();
            // Create a schedule ID that doesn't exist (Just assuming that, although ids can technically be strings, they are numbers)
            const fakeScheduleId =
                Math.max(...schedules.map((s) => parseInt(s.id ?? ""))) + 1;
            await expect(
                client.vocabulary.addToSchedule(1, fakeScheduleId),
            ).rejects.toThrow(`Not Found (404)`);
        });

        it("should add a word to a schedule (word already added)", async () => {
            const schedules = await client.schedules.getSchedules();
            const scheduleId = schedules[0].id;

            if (!scheduleId) {
                throw new Error("No schedules found, cannot run test");
            }

            const terms = await client.schedules.getScheduleTerms(scheduleId);
            const term = terms.data[0];

            await expect(
                client.vocabulary.addToSchedule(term.id ?? "1", scheduleId),
            ).rejects.toThrow(`Conflict (409)`);
        });

        it("should add a word to a schedule", async () => {
            const schedules = await client.schedules.getSchedules();
            const scheduleId = schedules[0].id;

            if (!scheduleId) {
                throw new Error("No schedules found, cannot run test");
            }

            try {
                await client.vocabulary.removeFromSchedule(111, scheduleId);
            } catch (e) {
                // Ignore
            }

            await client.vocabulary.addToSchedule(111, scheduleId);
        });
    });

    it("should remove a word from a schedule", async () => {
        const schedules = await client.schedules.getSchedules();
        const scheduleId = schedules[0].id;

        if (!scheduleId) {
            throw new Error("No schedules found, cannot run test");
        }

        try {
            await client.vocabulary.addToSchedule(112, scheduleId);
        } catch (e) {
            // Ignore
        }

        await client.vocabulary.removeFromSchedule(112, scheduleId);
    });
});
