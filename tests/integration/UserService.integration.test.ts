import { RenshuuClient } from "../../src";

describe("UserService (integration)", () => {
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

    it("should fetch a real profile", async () => {
        const profile = await client.user.getProfile();
        expect(profile).toHaveProperty("id");
        expect(profile).toHaveProperty("real_name");
    });

    it("should fetch real user lists", async () => {
        const lists = await client.user.getLists();

        expect(lists).toHaveProperty("kanji");
        expect(lists.kanji).toHaveProperty("(not grouped)");
        expect(lists.kanji?.["(not grouped)"]).toHaveLength(1);
        expect(lists.kanji?.["(not grouped)"][0]).toHaveProperty("list_id");

        expect(lists).toHaveProperty("vocab");
        expect(lists.vocab).toHaveProperty("(not grouped)");
        expect(lists.vocab?.["(not grouped)"]).toHaveLength(1);
        expect(lists.vocab?.["(not grouped)"][0]).toHaveProperty("list_id");
    });

    it("should fetch terms from a real list", async () => {
        const lists = await client.user.getLists();
        const kanjiList = lists.kanji?.["(not grouped)"]?.[0];
        if (!kanjiList) {
            throw new Error("No kanji list found");
        }

        const terms = await client.user.getListTerms(kanjiList.list_id || "");
        expect(terms.data).toHaveLength(0);
    });

    it("should fetch studied terms", async () => {
        const terms = await client.user.getStudiedTerms("vocab");

        expect(terms.data[0]).toHaveProperty("id");
        expect(terms.data[0]).toHaveProperty("user_data");
    });
});
