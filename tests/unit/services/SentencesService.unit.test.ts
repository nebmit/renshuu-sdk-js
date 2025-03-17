import { BaseClient } from "../../../src/BaseClient";
import { SentencesService } from "../../../src/services/SentencesService";
import { mockFetch } from "../../mocks/fetch";

describe("SentenceService (unit)", () => {
    let service: SentencesService;

    beforeEach(() => {
        const base = new BaseClient({ apiKey: "testkey" });
        service = new SentencesService(base);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should search for a sentence", async () => {
        mockFetch({
            result_count: 1,
            pg: 1,
            per_page: 10,
            reibuns: [
                {
                    id: 1,
                    japanese: "カオちゃんは可愛いです。",
                    hiragana: "カオちゃんはかわいいです。",
                    meaning: {
                        en: "Kao-chan is cute.",
                    },
                },
            ],
        });

        const result = await service.searchSentence("search");

        expect(fetch).toHaveBeenCalledWith(
            "https://api.renshuu.org/v1/reibun/search?value=search&pg=1",
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer testkey`,
                },
            },
        );

        expect(result.data).toEqual([
            {
                id: 1,
                japanese: "カオちゃんは可愛いです。",
                hiragana: "カオちゃんはかわいいです。",
                meaning: {
                    en: "Kao-chan is cute.",
                },
            },
        ]);

        // Pagination is tested in paginationHelper.unit.test.ts
        // But the pagination of this endpoint is different, since it doesn't supply the total pages
        expect(result.pagination.currentPage).toEqual(1);
        expect(result.pagination.totalPages).toEqual(1);
        expect(result.pagination.hasNext).toBe(false);
        expect(result.pagination.hasPrev).toBe(false);
    });

    it("should search for a sentence with pagination", async () => {
        mockFetch({
            result_count: 67,
            pg: 2,
            perPage: 10,
            reibuns: [
                {
                    id: 1,
                    japanese: "カオちゃんは可愛いです。",
                    hiragana: "カオちゃんはかわいいです。",
                    meaning: {
                        en: "Kao-chan is cute.",
                    },
                },
            ],
        });

        const result = await service.searchSentence("search");

        expect(fetch).toHaveBeenCalledWith(
            "https://api.renshuu.org/v1/reibun/search?value=search&pg=1",
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer testkey`,
                },
            },
        );

        // Pagination is tested in paginationHelper.unit.test.ts
        // But the pagination of this endpoint is different, since it doesn't supply the total pages
        expect(result.pagination.currentPage).toEqual(2);
        expect(result.pagination.totalPages).toEqual(7);
        expect(result.pagination.hasNext).toBe(true);
        expect(result.pagination.hasPrev).toBe(true);
    });

    it("should search for a sentence by a word ID", async () => {
        mockFetch({
            result_count: 1,
            pg: 1,
            per_page: 10,
            reibuns: [
                {
                    id: 1,
                    japanese: "カオちゃんは可愛いです。",
                    hiragana: "カオちゃんはかわいいです。",
                    meaning: {
                        en: "Kao-chan is cute.",
                    },
                },
            ],
        });

        const result = await service.searchSentenceByWordId(1);

        expect(fetch).toHaveBeenCalledWith(
            "https://api.renshuu.org/v1/reibun/search/1?pg=1",
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer testkey`,
                },
            },
        );

        expect(result.data).toEqual([
            {
                id: 1,
                japanese: "カオちゃんは可愛いです。",
                hiragana: "カオちゃんはかわいいです。",
                meaning: {
                    en: "Kao-chan is cute.",
                },
            },
        ]);

        // Pagination is tested in paginationHelper.unit.test.ts
        // But the pagination of this endpoint is different, since it doesn't supply the total pages
        expect(result.pagination.currentPage).toEqual(1);
        expect(result.pagination.totalPages).toEqual(1);
        expect(result.pagination.hasNext).toBe(false);
        expect(result.pagination.hasPrev).toBe(false);
    });
});
