import { ColumnHelper } from '@tanstack/react-table';
// import { Button } from '@heroui/react';
// import { LuEye } from 'react-icons/lu';

// Status mapping configuration
const STATUS_MAP: Record<number, { label: string; color: string; bgColor: string }> = {
	0: { label: 'Normal', color: 'text-green-800', bgColor: 'bg-green-100' },
	1: { label: 'Reversal', color: 'text-blue-800', bgColor: 'bg-blue-100' },
	2: { label: 'Cancel', color: 'text-red-800', bgColor: 'bg-red-100' },
	3: { label: 'Refund', color: 'text-orange-800', bgColor: 'bg-orange-100' },
	4: { label: 'Hold', color: 'text-yellow-800', bgColor: 'bg-yellow-100' },
	5: { label: 'Reject', color: 'text-gray-800', bgColor: 'bg-gray-100' },
};

const getStatusInfo = (status: number) => {
	return (
		STATUS_MAP[status] || {
			label: 'Unknown',
			color: 'text-gray-800',
			bgColor: 'bg-gray-100',
		}
	);
};

const getWalletNumber = (row: any) => {
	const { drcrgType, ttel, ftel, wlNo } = row;

	if (drcrgType === 'C') return ttel;
	if (drcrgType === 'D') return ftel;
	return wlNo;
};

export const createColumns = (
	columnHelper: ColumnHelper<any>,
	// onViewDetails: (data: any) => void,
) => {
	return [
		columnHelper.accessor('txnDate', {
			header: 'Transaction Date',
			cell: (info) => {
				const date = new Date(info.getValue());
				return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
			},
		}),
		columnHelper.accessor('fwlNo', {
			header: 'FormAcct',
			cell: (info) => info.getValue(),
		}),
		columnHelper.accessor('twlNo', {
			header: 'ToAcct',
			cell: (info) => info.getValue(),
		}),
		columnHelper.accessor('channel', {
			header: 'Channel',
			cell: (info) => info.getValue(),
		}),
		columnHelper.accessor('fwlName', {
			header: 'Full Name',
			cell: (info) => info.getValue(),
		}),
		columnHelper.accessor('tel', {
			header: 'Wallet Number',
			cell: (info) => getWalletNumber(info.row.original),
		}),
		columnHelper.accessor('rfNo', {
			header: 'Reference Number',
			cell: (info) => info.getValue(),
		}),

		columnHelper.accessor('remark', {
			header: 'Description',
			cell: (info) => (
				<div className='max-w-md whitespace-pre-wrap break-words'>{info.getValue()}</div>
			),
		}),
		columnHelper.accessor('debit', {
			header: 'Debit',
			cell: (info) => info.getValue().toLocaleString(),
		}),
		columnHelper.accessor('credit', {
			header: 'Credit',
			cell: (info) => info.getValue().toLocaleString(),
		}),
		columnHelper.accessor('afterTXN', {
			header: 'Balance',
			cell: (info) => info.getValue().toLocaleString(),
		}),
		columnHelper.accessor('txstatus', {
			header: 'Status',
			cell: (info) => {
				const statusInfo = getStatusInfo(info.getValue());
				return (
					<span
						className={`rounded-full px-3 py-1 text-xs font-semibold ${statusInfo.bgColor} ${statusInfo.color}`}>
						{statusInfo.label}
					</span>
				);
			},
		}),

		// columnHelper.display({
		// 	header: 'Actions',
		// 	cell: (info) => (
		// 		<div className='flex gap-2'>
		// 			<Button
		// 				isIconOnly
		// 				onPress={() => onViewDetails(info.row.original)}
		// 				color='default'
		// 				variant='faded'>
		// 				<LuEye size='18' />
		// 			</Button>
		// 		</div>
		// 	),
		// }),
	];
};
