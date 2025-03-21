import { BaseClient } from "../BaseClient";
import { RenshuuKanji } from "../types";
import { paths } from "../types/renshuuApiTypes";

export class KanjiService {
    private readonly base: BaseClient;

    constructor(base: BaseClient) {
        this.base = base;
    }

    /**
     * Add kanji to a list (/kanji/{id})
     * @param kanji_id The ID of the kanji to add to the list
     * @param list_id The ID of the list to add the kanji to
     * @returns True if the kanji was added successfully
     */
    public async addKanjiToList(
        kanji_id: number | string,
        list_id: number | string,
    ): Promise<boolean> {
        return this.base.put(`/kanji/${kanji_id}`, { list_id: list_id });
    }

    /**
     * Add kanji to a schedule (/kanji/{id})
     * @param kanji_id The ID of the kanji to add to the schedule
     * @param schedule_id The ID of the schedule to add the kanji to
     * @returns True if the kanji was added successfully
     */
    public async addKanjiToSchedule(
        kanji_id: number | string,
        schedule_id: number | string,
    ): Promise<boolean> {
        return this.base.put(`/kanji/${kanji_id}`, {
            sched_id: schedule_id,
        });
    }

    /**
     * Get a kanji by ID (/kanji/{id})
     * @param id The ID of the kanji to fetch
     * @returns The kanji
     */
    public async getKanji(id: number): Promise<RenshuuKanji> {
        return this.base.get<
            paths["/kanji/{kanji}"]["get"]["responses"]["200"]["content"]["application/json"]
        >(`/kanji/${id}`);
    }

    /**
     * Remove kanji from a list (/kanji/{id})
     * @param kanji_id The ID of the kanji to remove from the list
     * @param list_id The ID of the list to remove the kanji from
     * @returns True if the kanji was removed successfully
     */
    public async removeKanjiFromList(
        kanji_id: number | string,
        list_id: number | string,
    ): Promise<boolean> {
        return this.base.delete(`/kanji/${kanji_id}?list_id=${list_id}`);
    }

    /**
     * Remove kanji from a schedule (/kanji/{id})
     * @param kanji_id The ID of the kanji to remove from the schedule
     * @param scheduleId The ID of the schedule to remove the kanji from
     * @returns True if the kanji was removed successfully
     */
    public async removeKanjiFromSchedule(
        kanji_id: number | string,
        scheduleId: number | string,
    ): Promise<boolean> {
        return this.base.delete(`/kanji/${kanji_id}?sched_id=${scheduleId}`);
    }

    /**
     * Search renshuu's kanji dictionary (/kanji/search)
     * @param query The query to search for
     * @returns The array of kanjis that match the query
     */
    public async searchKanji(query: string): Promise<Array<RenshuuKanji>> {
        const r = await this.base.get<
            paths["/kanji/search"]["get"]["responses"]["200"]["content"]["application/json"]
        >(`/kanji/search`, {
            value: query,
        });

        return r.kanjis ?? [];
    }
}
