import type { INodeProperties } from 'n8n-workflow';

const showOnlyForEntryCreate = {
	operation: ['create'],
	resource: ['entry'],
};

export const entryCreateDescription: INodeProperties[] = [
	{
		displayName: 'Type',
		name: 'type',
		type: 'options',
		options: [
			{
				name: 'Note',
				value: 'note',
			},
			{
				name: 'Remind',
				value: 'remind',
			},
		],
		default: 'note',
		required: true,
		displayOptions: {
			show: showOnlyForEntryCreate,
		},
		description: 'Type of entry to create',
		routing: {
			send: {
				type: 'body',
				property: 'type',
			},
		},
	},
	{
		displayName: 'Text',
		name: 'text',
		type: 'string',
		typeOptions: {
			rows: 5,
		},
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForEntryCreate,
		},
		description: 'Text content of the entry',
		routing: {
			send: {
				type: 'body',
				property: 'content.text',
			},
		},
	},
	{
		displayName: 'Links',
		name: 'links',
		type: 'string',
		typeOptions: {
			multipleValues: true,
			multipleValueButtonText: 'Add Link',
		},
		default: [],
		displayOptions: {
			show: showOnlyForEntryCreate,
		},
		description: 'Array of links. Each link must start with https:// and cannot be empty.',
		routing: {
			send: {
				type: 'body',
				property: 'content.links',
				value: '={{$value.filter((link) => link && link.trim() && link.trim().startsWith("https://"))}}',
			},
		},
	},
	{
		displayName: 'Reminder At',
		name: 'reminder_at',
		type: 'dateTime',
		default: '',
		required: true,
		displayOptions: {
			show: {
				...showOnlyForEntryCreate,
				type: ['remind'],
			},
		},
		description: 'Reminder time in UTC (ISO 8601 format). Required when type is "remind".',
		routing: {
			send: {
				type: 'body',
				property: 'reminder_at',
			},
		},
	},
	{
		displayName: 'Is Pinned',
		name: 'is_pinned',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnlyForEntryCreate,
		},
		description: 'Whether the entry should be pinned',
		routing: {
			send: {
				type: 'body',
				property: 'is_pinned',
			},
		},
	},
];

