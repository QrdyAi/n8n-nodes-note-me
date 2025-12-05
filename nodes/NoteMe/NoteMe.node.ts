import {
	NodeConnectionTypes,
	type INodeType,
	type INodeTypeDescription,
	type IExecuteFunctions,
	type INodeExecutionData,
	type IDataObject,
	ApplicationError,
} from 'n8n-workflow';
import { entryDescription } from './resources/entry';
import { noteMeApiRequest } from './shared/transport';

export class NoteMe implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'NoteMe',
		name: 'noteMe',
		icon: { light: 'file:../../icons/noteme.svg', dark: 'file:../../icons/noteme_dark.svg' },
		group: ['input'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Automate note creation and reminders with NoteMe. Capture notes from workflows, set date-time reminders, organize with tags, and sync everything to your mobile app.',
		defaults: {
			name: 'NoteMe',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'noteMeApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: '={{$credentials.noteMeApi.baseUrl || "https://api.noteme.qrdyai.com"}}',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Entry',
						value: 'entry',
					},
				],
				default: 'entry',
			},
			...entryDescription,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		// Execute operations
		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'entry' && operation === 'create') {
					const type = this.getNodeParameter('type', i) as string;
					const text = this.getNodeParameter('text', i) as string;
					const links = this.getNodeParameter('links', i, []) as string[];
					const attachments = this.getNodeParameter('attachments', i, []) as string[];
					const mentions = this.getNodeParameter('mentions', i, []) as string[];
					const tags = this.getNodeParameter('tags', i, []) as string[];
					const isPinned = this.getNodeParameter('is_pinned', i, false) as boolean;

					const content: IDataObject = {
						text,
					};

					if (links && links.length > 0) {
						// Validate and filter links
						const validLinks = links.filter((link) => {
							if (!link || typeof link !== 'string' || link.trim() === '') {
								return false;
							}
							const trimmedLink = link.trim();
							if (!trimmedLink.startsWith('https://')) {
								throw new ApplicationError(
									`Invalid link: "${link}". All links must start with "https://"`,
									{ level: 'warning' },
								);
							}
							return true;
						});

						if (validLinks.length > 0) {
							content.links = validLinks;
						}
					}
					if (attachments && attachments.length > 0) {
						content.attachments = attachments;
					}
					if (mentions && mentions.length > 0) {
						content.mentions = mentions;
					}

					const entry: IDataObject = {
						type,
						content,
					};

					if (type === 'remind') {
						const reminderAt = this.getNodeParameter('reminder_at', i) as string;
						entry.reminder_at = reminderAt;
					}
					if (tags && tags.length > 0) {
						entry.tags = tags;
					}
					if (isPinned !== undefined) {
						entry.is_pinned = isPinned;
					}

					const response = await noteMeApiRequest.call(this, 'POST', '/entries', entry);
					returnData.push({ json: response });
				}
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : String(error);
				if (this.continueOnFail()) {
					returnData.push({ json: { error: errorMessage }, error });
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}

