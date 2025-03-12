import { PaginatedResult } from "../../../src/types";
import { buildPaginationResponse } from "../../../src/utils/paginationHelper";

describe("buildPaginationResponse", () => {
    // We'll use a mock fetcher with signature:
    //   (page: number, text: string, includeHidden: boolean) => Promise<PaginatedResult<T>>
    // so we can verify how it's called.

    let mockFetcher: jest.Mock<
        Promise<PaginatedResult<number>>,
        [number, string, boolean]
    >;

    beforeEach(() => {
        mockFetcher = jest.fn();
    });

    it("should set hasNext=true and hasPrev=false when currentPage=1, totalPages>1", async () => {
        const data = [1, 2, 3];
        const currentPage = 1;
        const totalPages = 5;
        const textArg = "example";
        const boolArg = true;

        const result = buildPaginationResponse(
            mockFetcher,
            data,
            currentPage,
            totalPages,
            textArg,
            boolArg,
        );

        expect(result.data).toBe(data);
        expect(result.pagination.currentPage).toBe(1);
        expect(result.pagination.totalPages).toBe(5);
        expect(result.pagination.hasNext).toBe(true);
        expect(result.pagination.hasPrev).toBe(false);
    });

    it("should set hasNext=false and hasPrev=true when currentPage=totalPages>1", async () => {
        const data = [10, 20];
        const currentPage = 4;
        const totalPages = 4;

        const result = buildPaginationResponse(
            mockFetcher,
            data,
            currentPage,
            totalPages,
            "testArg",
            false,
        );

        expect(result.data).toEqual([10, 20]);
        expect(result.pagination.currentPage).toBe(4);
        expect(result.pagination.totalPages).toBe(4);
        expect(result.pagination.hasNext).toBe(false);
        expect(result.pagination.hasPrev).toBe(true);
    });

    it("should define a next() function that calls fetcher with page+1 and extra args", async () => {
        // Set up
        const data = [100, 200];
        const currentPage = 2;
        const totalPages = 5;
        const textArg = "searchValue";
        const boolArg = true;

        // The mock fetcher will return another PaginatedResult (fake).
        mockFetcher.mockResolvedValueOnce({
            data: [300, 400],
            pagination: {
                currentPage: 3,
                totalPages: 5,
                hasNext: true,
                hasPrev: true,
                next: jest.fn(),
                prev: jest.fn(),
            },
        });

        const result = buildPaginationResponse(
            mockFetcher,
            data,
            currentPage,
            totalPages,
            textArg,
            boolArg,
        );

        // next() should exist since currentPage (2) < totalPages (5).
        expect(result.pagination.hasNext).toBe(true);
        expect(typeof result.pagination.next).toBe("function");

        // Call next()
        const nextResult = await result.pagination.next();
        // We expect mockFetcher to be called with page=3 (2+1) plus extra args
        expect(mockFetcher).toHaveBeenCalledWith(3, "searchValue", true);

        // And nextResult should be the mocked resolved value
        expect(nextResult).toBeDefined();
        expect(nextResult?.data).toEqual([300, 400]);
    });

    it("should return null from next() if currentPage >= totalPages", async () => {
        const currentPage = 5;
        const totalPages = 5;

        const result = buildPaginationResponse(
            mockFetcher,
            [],
            currentPage,
            totalPages,
            "foo",
            false,
        );

        expect(result.pagination.hasNext).toBe(false);
        // next should be a function that immediately returns null
        const nextVal = await result.pagination.next();
        expect(nextVal).toBeNull();
        // And confirm no fetcher call
        expect(mockFetcher).not.toHaveBeenCalled();
    });

    it("should define a prev() function that calls fetcher with page-1 and extra args", async () => {
        const data = [1];
        const currentPage = 3;
        const totalPages = 5;

        // We'll simulate a fetcher returning page=2 data
        mockFetcher.mockResolvedValueOnce({
            data: [999],
            pagination: {
                currentPage: 2,
                totalPages: 5,
                hasNext: true,
                hasPrev: true,
                next: jest.fn(),
                prev: jest.fn(),
            },
        });

        const result = buildPaginationResponse(
            mockFetcher,
            data,
            currentPage,
            totalPages,
            "fooArg",
            true,
        );

        expect(result.pagination.hasPrev).toBe(true);
        expect(typeof result.pagination.prev).toBe("function");

        const prevResult = await result.pagination.prev();
        expect(mockFetcher).toHaveBeenCalledWith(2, "fooArg", true);
        expect(prevResult?.data).toEqual([999]);
    });

    it("should return null from prev() if currentPage <= 1", async () => {
        const currentPage = 1;
        const totalPages = 5;

        const result = buildPaginationResponse(
            mockFetcher,
            [],
            currentPage,
            totalPages,
            "barArg",
            false,
        );

        expect(result.pagination.hasPrev).toBe(false);
        const prevVal = await result.pagination.prev();
        expect(prevVal).toBeNull();
        expect(mockFetcher).not.toHaveBeenCalled();
    });

    it("should handle the case where there is only 1 page", async () => {
        // page=1, totalPages=1 => no next, no prev
        const result = buildPaginationResponse(
            mockFetcher,
            [111],
            1,
            1,
            "whatever",
            false,
        );

        expect(result.pagination.hasNext).toBe(false);
        expect(result.pagination.hasPrev).toBe(false);
        expect(await result.pagination.next()).toBeNull();
        expect(await result.pagination.prev()).toBeNull();
    });

    it("should pass the returned data unmodified", async () => {
        // Just confirm the data param is returned in the final object.
        const data = [111, 222, 333];
        const res = buildPaginationResponse(
            mockFetcher,
            data,
            2,
            3,
            "arg",
            true,
        );
        expect(res.data).toBe(data);
    });
});
