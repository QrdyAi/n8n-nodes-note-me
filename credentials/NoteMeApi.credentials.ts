import type {
	Icon,
	ICredentialType,
	INodeProperties,
	ICredentialTestRequest,
} from 'n8n-workflow';

export class NoteMeApi implements ICredentialType {
	name = 'noteMeApi';

	displayName = 'NoteMe API';

	icon: Icon = { light: 'file:../icons/noteme.svg', dark: 'file:../icons/noteme_dark.svg' };

	documentationUrl = 'https://docs.qrdyai.com/noteme/n8n-integration';

	properties: INodeProperties[] = [
		{
			displayName: 'Token',
			name: 'token',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description:
				'Get your token from <a href="https://docs.qrdyai.com/noteme/n8n-integration" target="_blank">NoteMe settings</a>. Log in to noteme.qrdyai.com, go to settings, and copy your token.',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'hidden',
			default: 'https://api.noteme.qrdyai.com',
			required: true,
		},
	];

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl || "https://api.noteme.qrdyai.com"}}',
			url: '/api/v1/entries',
			method: 'GET',
			headers: {
				Authorization: '=Bearer {{$credentials.token}}',
			},
		},
	};
}

