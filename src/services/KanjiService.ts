import { BaseClient } from "../BaseClient";
import { RenshuuKanji } from "../types";
import { paths } from "../types/renshuuApiTypes";
import { ResourceService } from "./ResourceService";

export class KanjiService extends ResourceService<RenshuuKanji> {
    constructor(base: BaseClient) {
        super(base, "kanji");
    }

    /**
     * Search renshuu's kanji dictionary (/kanji/search)
     * @param query The query to search for
     * @returns The array of kanjis that match the query
     */
    public async search(query: string): Promise<Array<RenshuuKanji>> {
        const r = await this.base.get<
            paths["/kanji/search"]["get"]["responses"]["200"]["content"]["application/json"]
        >(`/kanji/search`, {
            value: query,
        });

        return r.kanjis ?? [];
    }
}
