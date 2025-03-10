import { components, paths } from "./renshuuApiTypes";

export interface PaginatedResult<T> {
    data: T[];
    pagination: {
        currentPage: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
        next: () => Promise<PaginatedResult<T> | null>;
        prev: () => Promise<PaginatedResult<T> | null>;
    };
}

export interface RenshuuClientConfig {
    apiKey: string;
    apiBaseUrl?: string;
}

// Alias the types from the OpenAPI schema
export type RenshuuProfile =
    paths["/profile"]["get"]["responses"]["200"]["content"]["application/json"];

export type Presences = components["schemas"]["Presences"];
export type TermUserData = components["schemas"]["TermUserData"];

export type RenshuuWord = components["schemas"]["Word"];
export type RenshuuKanji = components["schemas"]["Kanji"];
export type RenshuuGrammar = components["schemas"]["Grammar"];
export type RenshuuSimpleSentence = components["schemas"]["SimpleSentence"];
export type RenshuuTerm =
    | RenshuuWord
    | RenshuuKanji
    | RenshuuGrammar
    | RenshuuSimpleSentence;

export type RenshuuSchedule = components["schemas"]["Schedule"];

export type RenshuuTermGroups = NonNullable<
    NonNullable<paths["/schedule/{id}/list"]["get"]["parameters"]>["query"]
>["group"];
