import { PaginatedResult } from "../types";

type PaginatedFetcher<T, Args extends unknown[]> = (
    page: number,
    ...args: Args
) => Promise<PaginatedResult<T>>;

/**
 * Build a paginated result, including next/prev closures.
 *
 * @param fetcher - The function that can re-fetch a new page
 * @param data - The actual data for the current page
 * @param currentPage - The current page number
 * @param totalPages - The total pages
 * @param extraArgs - The other arguments fetcher needs (besides page)
 */
export function buildPaginationResponse<T, Args extends unknown[]>(
    fetcher: PaginatedFetcher<T, Args>,
    data: T[],
    currentPage: number,
    totalPages: number,
    ...extraArgs: Args
): PaginatedResult<T> {
    const hasNext = currentPage < totalPages;
    const hasPrev = currentPage > 1;

    return {
        data,
        pagination: {
            currentPage,
            totalPages,
            hasNext,
            hasPrev,
            next: hasNext
                ? () => fetcher(currentPage + 1, ...extraArgs)
                : async () => null,
            prev: hasPrev
                ? () => fetcher(currentPage - 1, ...extraArgs)
                : async () => null,
        },
    };
}
