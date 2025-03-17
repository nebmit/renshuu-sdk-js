import { BaseClient } from "./BaseClient";
import { SchedulesService } from "./services/SchedulesService";
import { SentencesService } from "./services/SentencesService";
import { UserService } from "./services/UserService";
import { VocabularyService } from "./services/VocabularyService";
import type { RenshuuClientConfig } from "./types";

/**
 * The main Renshuu API client
 */
export class RenshuuClient {
    private readonly base: BaseClient;
    public schedules: SchedulesService;
    public sentences: SentencesService;
    public user: UserService;
    public vocabulary: VocabularyService;

    /**
     * Create a new Renshuu API client
     * @param config The configuration for the client
     */
    constructor(config: RenshuuClientConfig) {
        this.base = new BaseClient(config);
        this.schedules = new SchedulesService(this.base);
        this.sentences = new SentencesService(this.base);
        this.user = new UserService(this.base);
        this.vocabulary = new VocabularyService(this.base);
    }
}
