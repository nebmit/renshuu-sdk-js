import { BaseClient } from "../BaseClient";
import { PaginatedResult, RenshuuGrammar } from "../types";
import { paths } from "../types/renshuuApiTypes";
import { buildPaginationResponse } from "../utils/paginationHelper";
import { ResourceService } from "./ResourceService";

export class GrammarService extends ResourceService<RenshuuGrammar> {
    constructor(base: BaseClient) {
        super(base, "grammar");
    }

    private async searchFetcher(
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
            this.searchFetcher.bind(this),
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
    public async search(
        query: string,
    ): Promise<PaginatedResult<RenshuuGrammar>> {
        return this.searchFetcher(1, query);
    }
}
