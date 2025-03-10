import { BaseClient } from "../BaseClient";
import { RenshuuProfile } from "../types";
import { paths } from "../types/renshuuApiTypes";

export class UserService {
    private base: BaseClient;

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
}
