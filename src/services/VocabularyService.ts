import { BaseClient } from "../BaseClient";
import { buildPaginationResponse } from "../utils/paginationHelper";
import { PaginatedResult, RenshuuWord } from "../types";
import { paths } from "../types/renshuuApiTypes";

export class VocabularyService {
    private base: BaseClient;

    constructor(base: BaseClient) {
        this.base = base;
    }

    /**
     * Get a word by ID (/word/{id})
     * @param id The ID of the word to fetch
     * @returns The word
     */
    public async getWord(id: number | string): Promise<RenshuuWord> {
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

    /**
     * Add word to schedule (/word/{id})
     * @param word_id The ID of the word to add
     * @param schedule_id The ID of the schedule to add the word to
     * @returns True if the word was added successfully
     */
    public async addWordToSchedule(
        word_id: number | string,
        schedule_id: number | string,
    ): Promise<boolean> {
        return this.base.put(`/word/${word_id}`, { sched_id: schedule_id });
    }

    /**
     * Add word to list (/word/{id})
     * @param word_id The ID of the word to add
     * @param list_id The ID of the list to add the word to
     * @returns True if the word was added successfully
     */
    public async addWordToList(
        word_id: number | string,
        list_id: number | string,
    ): Promise<boolean> {
        return this.base.put(`/word/${word_id}`, { list_id: list_id });
    }

    private async searchWordsFetcher(
        page: number,
        query: string,
    ): Promise<PaginatedResult<RenshuuWord>> {
        const r = await this.base.get<
            paths["/word/search"]["get"]["responses"]["200"]["content"]["application/json"]
        >("/word/search", { value: query, pg: page });

        return buildPaginationResponse<RenshuuWord, [string]>(
            this.searchWordsFetcher.bind(this),
            r.words || [],
            r.pg || page,
            r.total_pg || 1,
            query,
        );
    }

    /**
     * Search for words matching a query (/word/search)
     * @param query The query to search for
     * @param page The page number to fetch
     * @returns A paginated result of words
     */
    public async searchWords(
        query: string,
    ): Promise<PaginatedResult<RenshuuWord>> {
        return this.searchWordsFetcher(1, query);
    }
}
