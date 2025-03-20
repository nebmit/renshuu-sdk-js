import { BaseClient } from "../BaseClient";
import {
    PaginatedResult,
    RenshuuListCompact,
    RenshuuProfile,
    RenshuuTerm,
    RenshuuTermType,
} from "../types";
import { paths } from "../types/renshuuApiTypes";
import { buildPaginationResponse } from "../utils/paginationHelper";

export class UserService {
    private readonly base: BaseClient;

    constructor(base: BaseClient) {
        this.base = base;
    }

    /**
     * Get the current user's profile (/profile)
     * @returns The user's profile
     */
    public async getProfile(): Promise<RenshuuProfile> {
        return this.base.get<
            paths["/profile"]["get"]["responses"]["200"]["content"]["application/json"]
        >("/profile");
    }

    /**
     * Get the current user's lists grouped by term type and group title (/lists)
     * @returns The user's lists grouped by term type and group title
     */
    public async getLists(): Promise<{
        [termType in RenshuuTermType]?: {
            [groupTitle: string]: RenshuuListCompact[];
        };
    }> {
        const r =
            await this.base.get<
                paths["/lists"]["get"]["responses"]["200"]["content"]["application/json"]
            >("/lists");

        return (
            r.termtype_groups?.reduce(
                (acc, { termtype, groups }) => {
                    if (!termtype || !groups) return acc;

                    groups.forEach(({ group_title, lists }) => {
                        if (!group_title || !lists) return;
                        acc[termtype] = acc[termtype] || {};
                        acc[termtype][group_title] = lists;
                    });

                    return acc;
                },
                {} as {
                    [key in RenshuuTermType]?: {
                        [groupTitle: string]: RenshuuListCompact[];
                    };
                },
            ) || {}
        );
    }

    private async getListTermsFetcher(
        page: number,
        list_id: number | string,
    ): Promise<PaginatedResult<RenshuuTerm>> {
        const r = await this.base.get<
            paths["/list/{id}"]["get"]["responses"]["200"]["content"]["application/json"]
        >(`/list/${list_id}`, { pg: page });

        return buildPaginationResponse<RenshuuTerm, [number | string]>(
            this.getListTermsFetcher.bind(this),
            r.contents?.terms ?? [],
            r.contents?.pg ?? page,
            r.contents?.total_pg ?? 1,
            list_id,
        );
    }

    /**
     * Get all terms in a user list (/list/{id})
     * @param list_id The ID of the list to fetch terms from
     * @returns A paginated list of terms
     */
    public async getListTerms(
        list_id: number | string,
    ): Promise<PaginatedResult<RenshuuTerm>> {
        return this.getListTermsFetcher(1, list_id);
    }

    private async getStudiedTermsFetcher(
        page: number,
        type: RenshuuTermType,
    ): Promise<PaginatedResult<RenshuuTerm>> {
        const r = await this.base.get<
            paths["/list/all/{termtype}"]["get"]["responses"]["200"]["content"]["application/json"]
        >(`/list/all/${type}`, { pg: page });

        return buildPaginationResponse<RenshuuTerm, [RenshuuTermType]>(
            this.getStudiedTermsFetcher.bind(this),
            r.contents?.terms ?? [],
            r.contents?.pg ?? page,
            r.contents?.total_pg ?? 1,
            type,
        );
    }

    /**
     * Get all terms studied by the user (/list/all/{termtype})
     * @param type The type of terms to fetch
     * @returns A paginated list of terms
     */
    public async getStudiedTerms(
        type: RenshuuTermType,
    ): Promise<PaginatedResult<RenshuuTerm>> {
        return this.getStudiedTermsFetcher(1, type);
    }
}
