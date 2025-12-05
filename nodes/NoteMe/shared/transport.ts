import type {
	IHookFunctions,
	IExecuteFunctions,
	IExecuteSingleFunctions,
	ILoadOptionsFunctions,
	IHttpRequestMethods,
	IDataObject,
	IHttpRequestOptions,
} from 'n8n-workflow';

export async function noteMeApiRequest(
	this: IHookFunctions | IExecuteFunctions | IExecuteSingleFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	resource: string,
	body: IDataObject | undefined = undefined,
	qs: IDataObject = {},
) {
	const credentials = await this.getCredentials('noteMeApi');
	const baseUrl = (credentials.baseUrl as string) || 'https://api.noteme.qrdyai.com';
	const token = credentials.token as string;

	if (!token) {
		throw new Error(
			'Token is required. Please get your token from https://noteme.qrdyai.com/redirect?go=n8n',
		);
	}

	const options: IHttpRequestOptions = {
		method: method,
		qs,
		body,
		url: `${baseUrl}/api/v1${resource}`,
		json: true,
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
	};

	return this.helpers.httpRequest(options);
}

