import { BaseClient } from "../BaseClient";
import { PaginatedResult, RenshuuSimpleSentence } from "../types";
import { paths } from "../types/renshuuApiTypes";
import { buildPaginationResponse } from "../utils/paginationHelper";

export class SentencesService {
    private readonly base: BaseClient;

    constructor(base: BaseClient) {
        this.base = base;
    }

    private async searchSentenceFetcher(
        page: number,
        query: string,
    ): Promise<PaginatedResult<RenshuuSimpleSentence>> {
        const r = await this.base.get<
            paths["/reibun/search"]["get"]["responses"]["200"]["content"]["application/json"]
        >(`/reibun/search?value=${query}&pg=${page}`);

        // This endpoint doesn't return the total pages
        // We circumvent this by calculating using the result_count and per_page
        const totalPages = Math.ceil((r.result_count ?? 1) / (r.perPage ?? 1));

        return buildPaginationResponse<RenshuuSimpleSentence, [string]>(
            this.searchSentenceFetcher.bind(this),
            r.reibuns ?? [],
            r.pg ?? page,
            totalPages,
            query,
        );
    }

    /**
     * Search for a sentence (/reibun/search)
     * @param query The search query
     * @returns A paginated result of sentences
     */
    public async searchSentence(
        query: string,
    ): Promise<PaginatedResult<RenshuuSimpleSentence>> {
        return this.searchSentenceFetcher(1, query);
    }

    private async searchSentenceByWordIdFetcher(
        page: number,
        query: string | number,
    ): Promise<PaginatedResult<RenshuuSimpleSentence>> {
        const r = await this.base.get<
            paths["/reibun/search"]["get"]["responses"]["200"]["content"]["application/json"]
        >(`/reibun/search/${query}?pg=${page}`);

        // This endpoint doesn't return the total pages
        // We circumvent this by calculating using the result_count and per_page
        const totalPages = Math.ceil((r.result_count ?? 1) / (r.perPage ?? 1));

        return buildPaginationResponse<
            RenshuuSimpleSentence,
            [string | number]
        >(
            this.searchSentenceByWordIdFetcher.bind(this),
            r.reibuns ?? [],
            r.pg ?? page,
            totalPages,
            query,
        );
    }

    /**
     * Search for a sentence by word ID (/reibun/search/{word_id})
     * @param query The word ID to search for
     * @returns A paginated result of sentences
     */
    public async searchSentenceByWordId(
        query: string | number,
    ): Promise<PaginatedResult<RenshuuSimpleSentence>> {
        return this.searchSentenceByWordIdFetcher(1, query);
    }
}
