import { BaseClient } from "../BaseClient";

export class ResourceService<T> {
    protected readonly base: BaseClient;
    private readonly resource: string;

    constructor(base: BaseClient, resource: string) {
        this.base = base;
        this.resource = resource;
    }

    /**
     * Fetch an item by ID from the resource path. Example usage:
     *
     * `const item = await service.getById("123");`
     *
     * This method calls GET /{resource}/{id}.
     *
     * @param id - The ID of the item to fetch
     * @returns The item returned by the endpoint
     */
    public async getById(id: number | string): Promise<T> {
        return this.base.get<T>(`/${this.resource}/${id}`);
    }

    /**
     * Add an item to a list. Example usage:
     *
     * `const success = await service.addToList("123", "456");`
     *
     * This method calls PUT /{resource}/{id} with the list_id parameter.
     *
     * @param id - The ID of the item to add
     * @param list_id - The ID of the list to add the item to
     * @returns True if the item was added successfully
     */
    public async addToList(
        id: number | string,
        list_id: number | string,
    ): Promise<boolean> {
        return this.base.put(`/${this.resource}/${id}`, { list_id: list_id });
    }

    /**
     * Remove an item from a list. Example usage:
     *
     * `const success = await service.removeFromList("123", "456");`
     *
     * This method calls DELETE /{resource}/{id} with the list_id parameter.
     *
     * @param id - The ID of the item to remove
     * @param list_id - The ID of the list to remove the item from
     * @returns True if the item was removed successfully
     */
    public async removeFromList(
        id: number | string,
        list_id: number | string,
    ): Promise<boolean> {
        return this.base.delete(`/${this.resource}/${id}`, {
            list_id: list_id,
        });
    }

    /**
     * Add an item to a schedule. Example usage:
     *
     * `const success = await service.addToSchedule("123", "456");`
     *
     * This method calls PUT /{resource}/{id} with the sched_id parameter.
     *
     * @param id - The ID of the item to add
     * @param schedule_id - The ID of the list to add the item to
     * @returns True if the item was added successfully
     */
    public async addToSchedule(
        id: number | string,
        schedule_id: number | string,
    ): Promise<boolean> {
        return this.base.put(`/${this.resource}/${id}`, {
            sched_id: schedule_id,
        });
    }

    /**
     * Remove an item from a schedule. Example usage:
     *
     * `const success = await service.removeFromSchedule("123", "456");`
     *
     * This method calls DELETE /{resource}/{id} with the sched_id parameter.
     *
     * @param id - The ID of the item to remove
     * @param schedule_id - The ID of the schedule to remove the item from
     * @returns True if the item was removed successfully
     */
    public async removeFromSchedule(
        id: number | string,
        schedule_id: number | string,
    ): Promise<boolean> {
        return this.base.delete(`/${this.resource}/${id}`, {
            sched_id: schedule_id,
        });
    }
}
