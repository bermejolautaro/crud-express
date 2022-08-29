import { MockResult } from "tests/interfaces/mock-result.interface"

export const mockResult = <T>(value: T): MockResult<T> => ({ result: value });