import { RenshuuClient } from "../../src";

describe("SentencesService (integration)", () => {
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

    it("should search for a sentence", async () => {
        const result = await client.sentences.searchSentence("あいかわら");

        expect(result.data.length).toBeGreaterThan(0);
        expect(result.data.map((s) => s.id)).toContain(138695);
        expect(
            result.data.every((s) => s.hiragana?.includes("あいかわら")),
        ).toBe(true);
    });

    it("should search for a sentence with pagination", async () => {
        const prev = await client.sentences.searchSentence("あいかわら");

        const result = await prev.pagination.next();

        if (!result) {
            throw new Error("No results returned");
        }

        expect(result.pagination.currentPage).toBe(2);
        expect(result.pagination.totalPages).toBeGreaterThan(1);
        expect(result.data.length).toBeGreaterThan(0);
        expect(result.data.map((s) => s.id)).not.toContain(138695);
    });

    it("should search for a sentence by word ID", async () => {
        const result = await client.sentences.searchSentenceByWordId(1010);

        expect(result.pagination.totalPages).toBeGreaterThan(1);
        expect(result.data.length).toBeGreaterThan(0);
        expect(result.data.map((s) => s.id)).toContain(25826);
    });

    it("should search for a sentence by word ID with pagination", async () => {
        const prev = await client.sentences.searchSentenceByWordId(1010);

        const result = await prev.pagination.next();

        if (!result) {
            throw new Error("No results returned");
        }

        expect(result.pagination.currentPage).toBe(2);
        expect(result.pagination.totalPages).toBeGreaterThan(1);
        expect(result.data.length).toBeGreaterThan(0);
        expect(result.data.map((s) => s.id)).not.toContain(25826);
    });
});
