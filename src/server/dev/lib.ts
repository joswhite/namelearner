
export interface ClientError extends Error {
	code?: string;
	stack?: string;
	status?: number
}

export interface ErrorLogger {(ClientError): ClientError}

export interface DebugFunction {(formatter: any, ...args: any[]): void}

