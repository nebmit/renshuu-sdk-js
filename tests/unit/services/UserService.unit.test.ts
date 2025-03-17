import { BaseClient } from "../../../src/BaseClient";
import { UserService } from "../../../src/services/UserService";
import { mockFetch } from "../../mocks/fetch";

describe("UserService (unit)", () => {
    let service: UserService;

    beforeEach(() => {
        const base = new BaseClient({ apiKey: "testkey" });
        service = new UserService(base);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should fetch profile", async () => {
        mockFetch({ fake: "data" });
        const profile = await service.getProfile();
        expect(fetch).toHaveBeenCalledWith(
            "https://api.renshuu.org/v1/profile",
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer testkey`,
                },
            },
        );
        expect(profile).toEqual({ fake: "data" });
    });

    it("should get all lists made by the user grouped by termtype and groups", async () => {
        mockFetch({
            termtype_groups: [
                {
                    termtype: "kanji",
                    list_count: 1,
                    groups: [
                        {
                            group_title: "Group 1",
                            list_count: 1,
                            lists: [
                                {
                                    list_id: 1,
                                    title: "List 1",
                                    description: "Description 1",
                                    termtype: "kanji",
                                },
                            ],
                        },
                    ],
                },
            ],
        });
        const lists = await service.getLists();
        expect(fetch).toHaveBeenCalledWith("https://api.renshuu.org/v1/lists", {
            method: "GET",
            headers: {
                Authorization: `Bearer testkey`,
            },
        });

        expect(lists.kanji?.["Group 1"]).toEqual([
            {
                list_id: 1,
                title: "List 1",
                description: "Description 1",
                termtype: "kanji",
            },
        ]);
    });

    it("should return a paginated list of terms for a list", async () => {
        mockFetch({
            list_id: 1,
            title: "List 1",
            contents: {
                pg: 1,
                total_pg: 1,
                terms: [{ fake: "data" }],
            },
        });
        const terms = await service.getListTerms(1);
        expect(fetch).toHaveBeenCalledWith(
            "https://api.renshuu.org/v1/list/1?pg=1",
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer testkey`,
                },
            },
        );

        expect(terms.data).toEqual([{ fake: "data" }]);
        // Pagination is not being tested here, see paginationHelper.unit.test.ts
    });

    it("should return a paginated list of studied terms", async () => {
        mockFetch({
            contents: {
                pg: 1,
                total_pg: 1,
                terms: [{ fake: "data" }],
            },
        });
        const terms = await service.getStudiedTerms("vocab");
        expect(fetch).toHaveBeenCalledWith(
            "https://api.renshuu.org/v1/list/all/vocab?pg=1",
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer testkey`,
                },
            },
        );

        expect(terms.data).toEqual([{ fake: "data" }]);
        // Pagination is not being tested here, see paginationHelper.unit.test.ts
    });
});
