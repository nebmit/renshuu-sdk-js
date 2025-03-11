import { BaseClient } from "../BaseClient";
import {
    PaginatedResult,
    RenshuuSchedule,
    RenshuuTerm,
    RenshuuTermGroups,
} from "../types";
import { paths } from "../types/renshuuApiTypes";
import { buildPaginationResponse } from "../utils/paginationHelper";

export class SchedulesService {
    private base: BaseClient;

    constructor(base: BaseClient) {
        this.base = base;
    }

    /**
     * Get all schedules for the current user (/schedule)
     * @returns An array of schedules
     */
    public async getSchedules(): Promise<RenshuuSchedule[]> {
        const r =
            await this.base.get<
                paths["/schedule"]["get"]["responses"]["200"]["content"]["application/json"]
            >("/schedule");
        return r.schedules ?? [];
    }

    /**
     * Get a schedule by ID (/schedule/{id})
     * @param schedule_id The ID of the schedule to fetch
     * @returns An array of schedules
     */
    public async getSchedule(
        schedule_id: number | string,
    ): Promise<RenshuuSchedule> {
        // This is a paginated endpoint? It doesn't look like it should be.
        // Sketchy workaround to get the word by ID
        const r = await this.base.get<
            paths["/schedule/{id}"]["get"]["responses"]["200"]["content"]["application/json"]
        >(`/schedule/${schedule_id}`);

        if (r.schedules) {
            for (const schedule of r.schedules) {
                if (`${schedule.id}` === `${schedule_id}`) {
                    return schedule;
                }
            }
        }

        throw new Error(`Schedule with ID ${schedule_id} not found`);
    }

    private async getScheduleTermsFetcher(
        page: number,
        schedule_id: number | string,
        group: RenshuuTermGroups = "all",
    ): Promise<PaginatedResult<RenshuuTerm>> {
        const r = await this.base.get<
            paths["/schedule/{id}/list"]["get"]["responses"]["200"]["content"]["application/json"]
        >(`/schedule/${schedule_id}/list`, { pg: page, group: group });

        return buildPaginationResponse<
            RenshuuTerm,
            [number | string, RenshuuTermGroups]
        >(
            this.getScheduleTermsFetcher.bind(this),
            r.contents?.terms ?? [],
            r.contents?.pg ?? page,
            r.contents?.total_pg ?? 1,
            schedule_id,
            group,
        );
    }

    /**
     * Get all terms for a schedule by ID (/schedule/{id}/list)
     * @param schedule_id The ID of the schedule to fetch terms for
     * @param page The page number to fetch
     * @param group A group to filter by
     * @returns A paginated result of terms
     */
    public async getScheduleTerms(
        schedule_id: number | string,
        group: RenshuuTermGroups = "all",
    ): Promise<PaginatedResult<RenshuuTerm>> {
        // The return type of this endpoint is a bit weird. It returns the schedule as well as the terms.
        // For now, we'll just return the terms.
        return this.getScheduleTermsFetcher(1, schedule_id, group);
    }
}
