import { BaseClient } from "../../../src/BaseClient";
import { GrammarService } from "../../../src/services/GrammarService";
import { mockFetch } from "../../mocks/fetch";

describe("GrammarService (unit)", () => {
    let service: GrammarService;

    beforeEach(() => {
        const base = new BaseClient({ apiKey: "testkey" });
        service = new GrammarService(base);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getGrammar", () => {
        it("should return grammar by id", async () => {
            mockFetch({
                id: 1,
                title_english: "test",
                title_japanese: "テスト",
            });

            const grammar = await service.getGrammar(1);

            expect(fetch).toHaveBeenCalledWith(
                "https://api.renshuu.org/v1/grammar/1",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer testkey`,
                    },
                },
            );
            expect(grammar).toEqual({
                id: 1,
                title_english: "test",
                title_japanese: "テスト",
            });
        });
    });

    describe("addGrammarToList", () => {
        it("should add grammar to a user list", async () => {
            mockFetch({});

            await service.addGrammarToList(1, 9);
            expect(fetch).toHaveBeenCalledWith(
                "https://api.renshuu.org/v1/grammar/1?list_id=9",
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer testkey`,
                    },
                },
            );
        });
    });

    describe("addGrammarToSchedule", () => {
        it("should add grammar to a user schedule", async () => {
            mockFetch({});

            await service.addGrammarToSchedule(1, 9);
            expect(fetch).toHaveBeenCalledWith(
                "https://api.renshuu.org/v1/grammar/1?sched_id=9",
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer testkey`,
                    },
                },
            );
        });
    });

    describe("removeGrammarFromList", () => {
        it("should remove grammar from a user list", async () => {
            mockFetch({});

            await service.removeGrammarFromList(1, 9);
            expect(fetch).toHaveBeenCalledWith(
                "https://api.renshuu.org/v1/grammar/1?list_id=9",
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer testkey`,
                    },
                },
            );
        });
    });

    describe("removeGrammarFromSchedule", () => {
        it("should remove grammar from a user schedule", async () => {
            mockFetch({});

            await service.removeGrammarFromSchedule(1, 9);
            expect(fetch).toHaveBeenCalledWith(
                "https://api.renshuu.org/v1/grammar/1?sched_id=9",
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer testkey`,
                    },
                },
            );
        });
    });

    describe("searchGrammar", () => {
        it("should search for grammar", async () => {
            mockFetch({
                result_count: 1,
                total_pg: 1,
                pg: 1,
                grammar: [
                    {
                        id: 1,
                        title_english: "test",
                        title_japanese: "テスト",
                    },
                ],
            });

            const grammar = await service.searchGrammar("test");
            expect(fetch).toHaveBeenCalledWith(
                "https://api.renshuu.org/v1/grammar/search?value=test&pg=1",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer testkey`,
                    },
                },
            );
            expect(grammar.data).toEqual([
                {
                    id: 1,
                    title_english: "test",
                    title_japanese: "テスト",
                },
            ]);
        });
    });
});
