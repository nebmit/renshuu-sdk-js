import { RenshuuClient } from "../../src";

describe("UserService (integration)", () => {
    const apiKey = process.env.RENSHUU_API_KEY || "";
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
});
