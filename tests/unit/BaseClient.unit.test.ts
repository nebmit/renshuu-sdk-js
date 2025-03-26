import { BaseClient } from "../../src/BaseClient";
import { mockFetch } from "../mocks/fetch";

import {
    UnauthorizedError,
    NotFoundError,
    ConflictError,
    RateLimitError,
    RenshuuApiError,
} from "../../src/errors";

describe("BaseClient (unit)", () => {
    let base: BaseClient;

    beforeEach(() => {
        // By default, mockFetch({}) sets up a 200 response with empty body
        mockFetch({});
        base = new BaseClient({ apiKey: "testkey" });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // ───────────────────────────────────────────────────────────
    // GET
    // ───────────────────────────────────────────────────────────
    describe("GET", () => {
        it("should send a GET request", async () => {
            await base.get("/test");
            expect(fetch).toHaveBeenCalledWith(
                "https://api.renshuu.org/v1/test",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer testkey`,
                    },
                },
            );
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

        it("should throw UnauthorizedError on a GET with 401", async () => {
            mockFetch({ error: "Unauthorized" }, 401);
            await expect(base.get("/test")).rejects.toThrow(UnauthorizedError);
        });

        it("should throw NotFoundError on a GET with 404", async () => {
            mockFetch({ error: "Not found" }, 404);
            await expect(base.get("/test")).rejects.toThrow(NotFoundError);
        });

        it("should throw RateLimitError on a GET with 429", async () => {
            mockFetch({ error: "Rate limit" }, 429);
            await expect(base.get("/test")).rejects.toThrow(RateLimitError);
        });

        it("should throw generic RenshuuApiError on a GET with unknown status", async () => {
            mockFetch({ error: "Server error" }, 500);
            await expect(base.get("/test")).rejects.toThrow(RenshuuApiError);
        });
    });

    // ───────────────────────────────────────────────────────────
    // PUT
    // ───────────────────────────────────────────────────────────
    describe("PUT", () => {
        it("should send a PUT request", async () => {
            await base.put("/test");
            expect(fetch).toHaveBeenCalledWith(
                "https://api.renshuu.org/v1/test",
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer testkey`,
                    },
                },
            );
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

        it("should throw UnauthorizedError on a PUT with 401", async () => {
            mockFetch({ error: "Unauthorized" }, 401);
            await expect(base.put("/test")).rejects.toThrow(UnauthorizedError);
        });

        it("should throw NotFoundError on a PUT with 404", async () => {
            mockFetch({ error: "Not found" }, 404);
            await expect(base.put("/test")).rejects.toThrow(NotFoundError);
        });

        it("should throw ConflictError on a PUT with 409", async () => {
            mockFetch({ error: "Conflict" }, 409);
            await expect(base.put("/test")).rejects.toThrow(ConflictError);
        });

        it("should throw RateLimitError on a PUT with 429", async () => {
            mockFetch({ error: "Rate limit" }, 429);
            await expect(base.put("/test")).rejects.toThrow(RateLimitError);
        });

        it("should throw generic RenshuuApiError on a PUT with unknown status", async () => {
            mockFetch({ error: "Server error" }, 500);
            await expect(base.put("/test")).rejects.toThrow(RenshuuApiError);
        });
    });

    // ───────────────────────────────────────────────────────────
    // DELETE
    // ───────────────────────────────────────────────────────────
    describe("DELETE", () => {
        it("should send a DELETE request", async () => {
            await base.delete("/test");
            expect(fetch).toHaveBeenCalledWith(
                "https://api.renshuu.org/v1/test",
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer testkey`,
                    },
                },
            );
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

        it("should throw UnauthorizedError on a DELETE with 401", async () => {
            mockFetch({ error: "Unauthorized" }, 401);
            await expect(base.delete("/test")).rejects.toThrow(
                UnauthorizedError,
            );
        });

        it("should throw RateLimitError on a DELETE with 429", async () => {
            mockFetch({ error: "Rate limit" }, 429);
            await expect(base.delete("/test")).rejects.toThrow(RateLimitError);
        });

        it("should throw generic RenshuuApiError on a DELETE with unknown status", async () => {
            mockFetch({ error: "Server error" }, 500);
            await expect(base.delete("/test")).rejects.toThrow(RenshuuApiError);
        });
    });
});
