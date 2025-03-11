import { BaseClient } from "../../src/BaseClient";

describe("BaseClient (unit)", () => {
    let base: BaseClient;

    beforeEach(() => {
        // Overwrite the global fetch with a Jest mock
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => ({ fake: "data" }),
        } as Response);

        base = new BaseClient({ apiKey: "testkey" });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should send a GET request", async () => {
        await base.get("/test");
        expect(fetch).toHaveBeenCalledWith("https://api.renshuu.org/v1/test", {
            method: "GET",
            headers: {
                Authorization: `Bearer testkey`,
            },
        });
    });

    it("should send a GET request with query params", async () => {
        await base.get("/test", { param: "value" });
        expect(fetch).toHaveBeenCalledWith(
            "https://api.renshuu.org/v1/test?param=value",
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer testkey`,
                },
            },
        );
    });

    it("should error on a GET request with non-200 status", async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: false,
            status: 404,
            json: async () => ({ error: "Not found" }),
        } as Response);

        await expect(base.get("/test")).rejects.toThrow(
            "Request failed with status: 404",
        );
    });

    it("should send a PUT request", async () => {
        await base.put("/test");
        expect(fetch).toHaveBeenCalledWith("https://api.renshuu.org/v1/test", {
            method: "PUT",
            headers: {
                Authorization: `Bearer testkey`,
            },
        });
    });

    it("should send a PUT request with query params", async () => {
        await base.put("/test", { param: "value" });
        expect(fetch).toHaveBeenCalledWith(
            "https://api.renshuu.org/v1/test?param=value",
            {
                method: "PUT",
                headers: {
                    Authorization: `Bearer testkey`,
                },
            },
        );
    });

    it("should error on a PUT request with non-200 status", async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: false,
            status: 404,
            json: async () => ({ error: "Not found" }),
        } as Response);

        await expect(base.put("/test")).rejects.toThrow(
            "Request failed with status: 404",
        );
    });
});
