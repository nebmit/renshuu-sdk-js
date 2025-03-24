import { BaseClient } from "../../../src/BaseClient";
import { KanjiService } from "../../../src/services/KanjiService";
import { mockFetch } from "../../mocks/fetch";

describe("KanjiService (unit)", () => {
    let service: KanjiService;

    beforeEach(() => {
        const base = new BaseClient({ apiKey: "testkey" });
        service = new KanjiService(base);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getKanji", () => {
        it("should return kanji by id", async () => {
            mockFetch({
                id: 1,
                kanji: "重",
                definition: "heavy, important",
            });

            const kanji = await service.getById(1);

            expect(fetch).toHaveBeenCalledWith(
                "https://api.renshuu.org/v1/kanji/1",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer testkey`,
                    },
                },
            );
            expect(kanji).toEqual({
                id: 1,
                kanji: "重",
                definition: "heavy, important",
            });
        });
    });

    describe("addKanjiToList", () => {
        it("should add kanji to a user list", async () => {
            mockFetch({});

            await service.addToList(1, 9);
            expect(fetch).toHaveBeenCalledWith(
                "https://api.renshuu.org/v1/kanji/1?list_id=9",
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer testkey`,
                    },
                },
            );
        });
    });

    describe("addKanjiToSchedule", () => {
        it("should add kanji to a user schedule", async () => {
            mockFetch({});

            await service.addToSchedule(1, 9);
            expect(fetch).toHaveBeenCalledWith(
                "https://api.renshuu.org/v1/kanji/1?sched_id=9",
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer testkey`,
                    },
                },
            );
        });
    });

    describe("removeKanjiFromList", () => {
        it("should remove kanji from a user list", async () => {
            mockFetch({});

            await service.removeFromList(1, 9);
            expect(fetch).toHaveBeenCalledWith(
                "https://api.renshuu.org/v1/kanji/1?list_id=9",
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer testkey`,
                    },
                },
            );
        });
    });

    describe("removeKanjiFromSchedule", () => {
        it("should remove kanji from a user schedule", async () => {
            mockFetch({});

            await service.removeFromSchedule(1, 9);
            expect(fetch).toHaveBeenCalledWith(
                "https://api.renshuu.org/v1/kanji/1?sched_id=9",
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer testkey`,
                    },
                },
            );
        });
    });

    describe("searchKanji", () => {
        it("should search for kanji", async () => {
            mockFetch({
                result_count: 1,
                kanjis: [
                    {
                        id: 1,
                        kanji: "重",
                        definition: "heavy, important",
                    },
                ],
            });

            const kanjis = await service.search("test");
            expect(fetch).toHaveBeenCalledWith(
                "https://api.renshuu.org/v1/kanji/search?value=test",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer testkey`,
                    },
                },
            );
            expect(kanjis).toEqual([
                {
                    id: 1,
                    kanji: "重",
                    definition: "heavy, important",
                },
            ]);
        });
    });
});
