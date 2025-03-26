export class RenshuuApiError extends Error {
    public status: number;
    public body?: unknown;

    constructor(message: string, status: number, body?: unknown) {
        super(message);
        this.name = "RenshuuApiError";
        this.status = status;
        this.body = body;

        // Required for TS to maintain prototype chain in compiled code
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

// Common specific errors
export class UnauthorizedError extends RenshuuApiError {
    constructor(status: number, body?: unknown) {
        super("Unauthorized (401)", status, body);
        this.name = "UnauthorizedError";
    }
}

export class NotFoundError extends RenshuuApiError {
    constructor(status: number, body?: unknown) {
        super("Not Found (404)", status, body);
        this.name = "NotFoundError";
    }
}

export class ConflictError extends RenshuuApiError {
    constructor(status: number, body?: unknown) {
        super("Conflict (409)", status, body);
        this.name = "ConflictError";
    }
}

export class RateLimitError extends RenshuuApiError {
    constructor(status: number, body?: unknown) {
        super("Rate limit exceeded (429)", status, body);
        this.name = "RateLimitError";
    }
}
