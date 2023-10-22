export const notNull = <T>(input: T | undefined | null): input is T => input !== null && input !== undefined;
