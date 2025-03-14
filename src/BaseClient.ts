import type { RenshuuClientConfig } from "./types";

export class BaseClient {
    private readonly apiKey: string;
    private readonly apiBaseUrl: string;

    constructor(config: RenshuuClientConfig) {
        this.apiKey = config.apiKey;
        this.apiBaseUrl = config.apiBaseUrl ?? "https://api.renshuu.org/v1";
    }

    private buildUrl(
        endpoint: string,
        params?: Record<string, string | number>,
    ): string {
        let url = `${this.apiBaseUrl}${endpoint}`;
        if (params) {
            const qs = new URLSearchParams();
            Object.entries(params).forEach(([k, v]) => qs.append(k, String(v)));
            url += `?${qs.toString()}`;
        }
        return url;
    }

    /**
     * Internal helper to send GET requests
     */
    public async get<T>(
        endpoint: string,
        params?: Record<string, string | number>,
    ): Promise<T> {
        const url = this.buildUrl(endpoint, params);

        const response = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${this.apiKey}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Request failed with status: ${response.status}`);
        }
        return response.json() as Promise<T>;
    }

    /**
     * Internal helper to send PUT requests
     */
    public async put(
        endpoint: string,
        params?: Record<string, string | number>,
    ): Promise<boolean> {
        const url = this.buildUrl(endpoint, params);

        const response = await fetch(url, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${this.apiKey}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Request failed with status: ${response.status}`);
        }

        return true;
    }

    public async delete(
        endpoint: string,
        params?: Record<string, string | number>,
    ): Promise<boolean> {
        const url = this.buildUrl(endpoint, params);

        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${this.apiKey}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Request failed with status: ${response.status}`);
        }

        return true;
    }
}
