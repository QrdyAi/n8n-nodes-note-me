import type { INodeProperties } from 'n8n-workflow';
import { entryCreateDescription } from './create';

const showOnlyForEntries = {
	resource: ['entry'],
};

export const entryDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForEntries,
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a new entry',
				description: 'Create a new note or reminder entry',
				routing: {
					request: {
						method: 'POST',
						url: '/entries',
					},
				},
			},
		],
		default: 'create',
	},
	...entryCreateDescription,
];

