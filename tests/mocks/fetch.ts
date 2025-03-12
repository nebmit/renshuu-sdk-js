export function mockFetch(response: any, status: number = 200) {
    global.fetch = jest.fn().mockResolvedValue({
        ok: status < 400,
        status: status,
        json: async () => response,
    } as Response);
}
