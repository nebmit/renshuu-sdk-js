import { RenshuuClient } from "../../src";

describe("GrammarService (integration)", () => {
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

    it("should get a grammar by id", async () => {
        const grammar = await client.grammar.getGrammar(1);
        expect(grammar).toHaveProperty("id");
        expect(grammar).toHaveProperty("title_english");
        expect(grammar).toHaveProperty("title_japanese");

        expect(grammar.id).toBe("1");
    });

    describe("addGrammarToSchedule", () => {
        it("should add a grammar to a schedule (schedule not found)", async () => {
            const schedules = await client.schedules.getSchedules();
            // Create a schedule ID that doesn't exist (Just assuming that, although ids can technically be strings, they are numbers)
            const fakeScheduleId =
                Math.max(...schedules.map((s) => parseInt(s.id ?? ""))) + 1;
            await expect(
                client.grammar.addGrammarToSchedule(1, fakeScheduleId),
            ).rejects.toThrow(`Request failed with status: 404`);
        });

        it("should add a grammar to a schedule (grammar already added)", async () => {
            const schedules = await client.schedules.getSchedules();
            const scheduleId = schedules[0].id;

            if (!scheduleId) {
                throw new Error("No schedules found, cannot run test");
            }

            try {
                await client.grammar.addGrammarToSchedule(1, scheduleId);
            } catch (e) {
                // Ignore
            }

            await expect(
                client.grammar.addGrammarToSchedule(1, scheduleId),
            ).rejects.toThrow(`Request failed with status: 409`);
        });

        it("should add a grammar to a schedule", async () => {
            const schedules = await client.schedules.getSchedules();
            const scheduleId = schedules[0].id;

            if (!scheduleId) {
                throw new Error("No schedules found, cannot run test");
            }

            try {
                await client.grammar.removeGrammarFromSchedule(111, scheduleId);
            } catch (e) {
                // Ignore
            }

            await client.grammar.addGrammarToSchedule(111, scheduleId);
        });
    });

    it("should remove a grammar from a schedule", async () => {
        const schedules = await client.schedules.getSchedules();
        const scheduleId = schedules[0].id;

        if (!scheduleId) {
            throw new Error("No schedules found, cannot run test");
        }

        try {
            await client.grammar.addGrammarToSchedule(112, scheduleId);
        } catch (e) {
            // Ignore
        }

        await client.grammar.removeGrammarFromSchedule(112, scheduleId);
    });

    it("should search for grammar", async () => {
        const result = await client.grammar.searchGrammar("ながら");

        result.data.forEach((grammar) => {
            expect(grammar).toHaveProperty("id");
            expect(grammar).toHaveProperty("title_english");
            expect(grammar).toHaveProperty("title_japanese");
        });

        expect(result.data.some((g) => g.title_japanese === "ながら")).toBe(
            true,
        );
    });
});
