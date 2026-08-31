import type { ReactNode } from 'react';
import { Chip } from '@heroui/react';

const TRANS_STATUS_MAP: Record<
	string,
	{ label: string; color: 'success' | 'danger' | 'warning' | 'secondary' | 'default' }
> = {
	'01': { label: 'ສຳເລັດ', color: 'success' },
	'02': { label: 'ລໍຖ້າ', color: 'secondary' },
	'03': { label: 'ຄືນເງິນ', color: 'warning' },
	'04': { label: 'ຜິດພາດ', color: 'danger' },
};

const formatValue = (value: any): string => {
	if (value === null || value === undefined || value === '') return '-';
	if (typeof value === 'number') return value.toLocaleString('en-US');
	if (typeof value === 'object') return JSON.stringify(value);
	return String(value);
};

const DetailRow = ({ label, value }: { label: string; value: ReactNode }) => (
	<div className='grid grid-cols-3 gap-2 border-b border-gray-100 px-4 py-2 last:border-b-0 dark:border-gray-700'>
		<p className='text-sm font-semibold text-gray-700 dark:text-gray-200'>{label}</p>
		<p className='col-span-2 break-all text-sm text-neutral-600 dark:text-gray-400'>{value}</p>
	</div>
);

const PayTransDetail = ({ transaction }: { transaction: any }) => {
	const transStatus = String(transaction?.transStatus || transaction?.statusTrans || '');
	const statusMapped = TRANS_STATUS_MAP[transStatus];
	const skipKeys = ['response'];

	return (
		<div className='overflow-hidden rounded-lg border border-gray-100 dark:border-gray-700'>
			<h3 className='bg-blue-50 px-4 py-2 font-semibold text-gray-900 dark:bg-gray-700 dark:text-white'>
				ລາຍລະອຽດທຸລະກໍາ
			</h3>
			<div className='bg-white dark:bg-gray-800'>
				{transStatus && (
					<DetailRow
						label='ສະຖານະທຸລະກໍາ'
						value={
							<Chip size='sm' color={statusMapped?.color || 'default'} variant='flat'>
								{statusMapped ? `${transStatus} · ${statusMapped.label}` : transStatus}
							</Chip>
						}
					/>
				)}
				{Object.entries(transaction || {})
					.filter(([key]) => !skipKeys.includes(key))
					.map(([key, value]) => {
						if (value && typeof value === 'object' && !Array.isArray(value)) {
							return Object.entries(value as Record<string, any>).map(
								([childKey, childValue]) => (
									<DetailRow
										key={`${key}.${childKey}`}
										label={`${key}.${childKey}`}
										value={formatValue(childValue)}
									/>
								),
							);
						}
						return <DetailRow key={key} label={key} value={formatValue(value)} />;
					})}
			</div>
		</div>
	);
};

export default PayTransDetail;
