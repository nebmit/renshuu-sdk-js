import { BaseClient } from "../BaseClient";
import { PaginatedResult, RenshuuWord } from "../types";
import { paths } from "../types/renshuuApiTypes";
import { buildPaginationResponse } from "../utils/paginationHelper";
import { ResourceService } from "./ResourceService";

export class VocabularyService extends ResourceService<RenshuuWord> {
    constructor(base: BaseClient) {
        super(base, "word");
    }

    /**
     * Get a word by ID (/word/{id})
     * @param id The ID of the word to fetch
     * @returns The word
     */
    public async getById(id: number | string): Promise<RenshuuWord> {
        // This is a paginated endpoint? It doesn't look like it should be.
        // Sketchy workaround to get the word by ID
        const r = await this.base.get<
            paths["/word/{id}"]["get"]["responses"]["200"]["content"]["application/json"]
        >(`/word/${id}`);

        if (r.words) {
            for (const word of r.words) {
                if (`${word.id}` === `${id}`) {
                    return word;
                }
            }
        }

        throw new Error(`Word with ID ${id} not found`);
    }

    private async searchFetcher(
        page: number,
        query: string,
    ): Promise<PaginatedResult<RenshuuWord>> {
        const r = await this.base.get<
            paths["/word/search"]["get"]["responses"]["200"]["content"]["application/json"]
        >("/word/search", { value: query, pg: page });

        return buildPaginationResponse<RenshuuWord, [string]>(
            this.searchFetcher.bind(this),
            r.words ?? [],
            r.pg ?? page,
            r.total_pg ?? 1,
            query,
        );
    }

    /**
     * Search for words matching a query (/word/search)
     * @param query The query to search for
     * @returns A paginated result of words
     */
    public async search(query: string): Promise<PaginatedResult<RenshuuWord>> {
        return this.searchFetcher(1, query);
    }
}
