import { BaseClient } from "../BaseClient";
import { PaginatedResult, RenshuuGrammar } from "../types";
import { paths } from "../types/renshuuApiTypes";
import { buildPaginationResponse } from "../utils/paginationHelper";

export class GrammarService {
    private readonly base: BaseClient;

    constructor(base: BaseClient) {
        this.base = base;
    }

    /**
     * Add grammar to a list (/grammar/{id})
     * @param grammar_id The ID of the grammar to add to the list
     * @param list_id The ID of the list to add the grammar to
     * @returns True if the grammar was added successfully
     */
    public async addGrammarToList(
        grammar_id: number | string,
        list_id: number | string,
    ): Promise<boolean> {
        return this.base.put(`/grammar/${grammar_id}`, { list_id: list_id });
    }

    /**
     * Add grammar to a schedule (/grammar/{id})
     * @param grammar_id The ID of the grammar to add to the schedule
     * @param schedule_id The ID of the schedule to add the grammar to
     * @returns True if the grammar was added successfully
     */
    public async addGrammarToSchedule(
        grammar_id: number | string,
        schedule_id: number | string,
    ): Promise<boolean> {
        return this.base.put(`/grammar/${grammar_id}`, {
            sched_id: schedule_id,
        });
    }

    /**
     * Get a grammar by ID (/grammar/{id})
     * @param id The ID of the grammar to fetch
     * @returns The grammar
     */
    public async getGrammar(id: number): Promise<RenshuuGrammar> {
        return this.base.get<
            paths["/grammar/{id}"]["get"]["responses"]["200"]["content"]["application/json"]
        >(`/grammar/${id}`);
    }

    /**
     * Remove grammar from a list (/grammar/{id})
     * @param grammar_id The ID of the grammar to remove from the list
     * @param list_id The ID of the list to remove the grammar from
     * @returns True if the grammar was removed successfully
     */
    public async removeGrammarFromList(
        grammar_id: number | string,
        list_id: number | string,
    ): Promise<boolean> {
        return this.base.delete(`/grammar/${grammar_id}?list_id=${list_id}`);
    }

    /**
     * Remove grammar from a schedule (/grammar/{id})
     * @param grammar_id The ID of the grammar to remove from the schedule
     * @param scheduleId The ID of the schedule to remove the grammar from
     * @returns True if the grammar was removed successfully
     */
    public async removeGrammarFromSchedule(
        grammar_id: number | string,
        scheduleId: number | string,
    ): Promise<boolean> {
        return this.base.delete(
            `/grammar/${grammar_id}?sched_id=${scheduleId}`,
        );
    }

    private async searchGrammarFetcher(
        page: number,
        query: string,
    ): Promise<PaginatedResult<RenshuuGrammar>> {
        const r = await this.base.get<
            paths["/grammar/search"]["get"]["responses"]["200"]["content"]["application/json"]
        >(`/grammar/search`, {
            value: query,
            pg: page,
        });

        return buildPaginationResponse<RenshuuGrammar, [string]>(
            this.searchGrammarFetcher.bind(this),
            r.grammar ?? [],
            r.pg ?? page,
            r.total_pg ?? 1,
            query,
        );
    }

    /**
     * Search renshuu's grammar dictionary (/grammar/search)
     * @param query The query to search for
     * @returns The paginated result of grammar
     */
    public async searchGrammar(
        query: string,
    ): Promise<PaginatedResult<RenshuuGrammar>> {
        return this.searchGrammarFetcher(1, query);
    }
}
