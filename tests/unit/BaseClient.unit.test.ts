import { BaseClient } from "../../src/BaseClient";
import { mockFetch } from "../mocks/fetch";

describe("BaseClient (unit)", () => {
    let base: BaseClient;

    beforeEach(() => {
        mockFetch({});

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
        mockFetch({ error: "Not found" }, 404);

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
        mockFetch({ error: "Not found" }, 404);

        await expect(base.put("/test")).rejects.toThrow(
            "Request failed with status: 404",
        );
    });

    it("should send a DELETE request", async () => {
        await base.delete("/test");

        expect(fetch).toHaveBeenCalledWith("https://api.renshuu.org/v1/test", {
            method: "DELETE",
            headers: {
                Authorization: `Bearer testkey`,
            },
        });
    });

    it("should send a DELETE request with query params", async () => {
        await base.delete("/test", { param: "value" });

        expect(fetch).toHaveBeenCalledWith(
            "https://api.renshuu.org/v1/test?param=value",
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer testkey`,
                },
            },
        );
    });

    it("should error on a DELETE request with non-200 status", async () => {
        mockFetch({ error: "Unauthorized" }, 401);

        await expect(base.delete("/test")).rejects.toThrow(
            "Request failed with status: 401",
        );
    });
});
