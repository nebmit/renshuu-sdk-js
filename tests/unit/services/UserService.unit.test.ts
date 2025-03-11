import { BaseClient } from "../../../src/BaseClient";
import { UserService } from "../../../src/services/UserService";

describe("UserService (unit)", () => {
    let user: UserService;

    beforeEach(() => {
        // Overwrite the global fetch with a Jest mock
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => ({ fake: "data" }),
        } as Response);

        const base = new BaseClient({ apiKey: "testkey" });
        user = new UserService(base);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should fetch profile", async () => {
        const profile = await user.getProfile();
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
});
