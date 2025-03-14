import { BaseClient } from "../../../src/BaseClient";
import { VocabularyService } from "../../../src/services/VocabularyService";
import { mockFetch } from "../../mocks/fetch";

describe("UserService (unit)", () => {
    let service: VocabularyService;

    beforeEach(() => {
        const base = new BaseClient({ apiKey: "testkey" });
        service = new VocabularyService(base);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should get a word by ID", async () => {
        mockFetch({
            words: [
                { id: 123, fake: "data" },
                { id: 456, fake: "data" },
            ],
        });

        const word = await service.getWord(123);

        expect(fetch).toHaveBeenCalledWith(
            "https://api.renshuu.org/v1/word/123",
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer testkey`,
                },
            },
        );
        expect(word).toEqual({ id: 123, fake: "data" });
    });

    it("should error when getting a word by ID that doesn't exist", async () => {
        mockFetch({
            words: [
                { id: 123, fake: "data" },
                { id: 456, fake: "data" },
            ],
        });

        await expect(service.getWord(789)).rejects.toThrow(
            "Word with ID 789 not found",
        );
    });

    it("should add a word to a schedule", async () => {
        mockFetch({});

        const success = await service.addWordToSchedule(123, 456);

        expect(fetch).toHaveBeenCalledWith(
            "https://api.renshuu.org/v1/word/123?sched_id=456",
            {
                method: "PUT",
                headers: {
                    Authorization: `Bearer testkey`,
                },
            },
        );
        expect(success).toBe(true);
    });

    it("should add a word to a list", async () => {
        mockFetch({});

        const success = await service.addWordToList(123, 456);

        expect(fetch).toHaveBeenCalledWith(
            "https://api.renshuu.org/v1/word/123?list_id=456",
            {
                method: "PUT",
                headers: {
                    Authorization: `Bearer testkey`,
                },
            },
        );
        expect(success).toBe(true);
    });

    it("should search for words", async () => {
        mockFetch({
            words: [
                { id: 123, fake: "data" },
                { id: 456, fake: "data" },
            ],
            total_pg: 1,
            pg: 1,
        });

        const words = await service.searchWords("test");

        expect(fetch).toHaveBeenCalledWith(
            "https://api.renshuu.org/v1/word/search?value=test&pg=1",
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer testkey`,
                },
            },
        );
        expect(words.data).toEqual([
            { id: 123, fake: "data" },
            { id: 456, fake: "data" },
        ]);
        expect(words.pagination.currentPage).toBe(1);
        expect(words.pagination.totalPages).toBe(1);
        expect(words.pagination.hasNext).toBe(false);
        expect(words.pagination.hasPrev).toBe(false);
        expect(words.pagination.next()).resolves.toBeNull();
        expect(words.pagination.prev()).resolves.toBeNull();
    });

    it("should remove a word from a schedule", async () => {
        mockFetch({});

        const success = await service.removeWordFromSchedule(123, 456);

        expect(fetch).toHaveBeenCalledWith(
            "https://api.renshuu.org/v1/word/123?sched_id=456",
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer testkey`,
                },
            },
        );
        expect(success).toBe(true);
    });

    it("should remove a word from a list", async () => {
        mockFetch({});

        const success = await service.removeWordFromList(123, 456);

        expect(fetch).toHaveBeenCalledWith(
            "https://api.renshuu.org/v1/word/123?list_id=456",
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer testkey`,
                },
            },
        );
        expect(success).toBe(true);
    });
});
