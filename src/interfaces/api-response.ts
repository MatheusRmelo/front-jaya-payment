export interface APIResponse<T> {
    message: string,
    result: T | null,
    ok: boolean
}