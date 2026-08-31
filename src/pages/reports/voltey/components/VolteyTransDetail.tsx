import { Chip } from '@heroui/react';
import type { ReactNode } from 'react';

type VolteyTransDetailProps = {
	transaction: any;
};

const TRANS_STATUS_MAP: Record<string, { label: string; color: 'success' | 'danger' | 'warning' | 'secondary' | 'default' }> =
	{
		'01': { label: 'ສຳເລັດ', color: 'success' },
		'02': { label: 'ລໍຖ້າ', color: 'secondary' },
		'03': { label: 'ຄືນເງິນ', color: 'warning' },
		'04': { label: 'ຜິດພາດ', color: 'danger' },
	};

const formatMoney = (value?: number, ccy?: string) => {
	if (value === null || value === undefined) return '-';
	return `${Number(value).toLocaleString('en-US', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})} ${ccy || ''}`.trim();
};

const formatValue = (value: any) => {
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

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
	<div className='overflow-hidden rounded-lg border border-gray-100 dark:border-gray-700'>
		<h3 className='bg-blue-50 px-4 py-2 font-semibold text-gray-900 dark:bg-gray-700 dark:text-white'>
			{title}
		</h3>
		<div className='bg-white dark:bg-gray-800'>{children}</div>
	</div>
);

const VolteyTransDetail = ({ transaction }: VolteyTransDetailProps) => {
	const user = transaction?.userDetail || {};
	const transStatus = String(transaction?.transStatus || '');
	const statusMapped = TRANS_STATUS_MAP[transStatus];

	return (
		<div className='flex flex-col gap-4'>
			{transaction?.qrCode && (
				<div className='flex justify-center'>
					<img
						src={transaction.qrCode}
						alt='eSIM QR'
						className='h-44 w-44 rounded-lg border bg-white p-2'
					/>
				</div>
			)}

			<Section title='ຂໍ້ມູນລູກຄ້າ'>
				<DetailRow label='ຊື່ກະເປົາ' value={formatValue(user.wlname)} />
				<DetailRow label='ເລກກະເປົາ' value={formatValue(user.wlno)} />
				<DetailRow label='ຜູ້ໃຊ້' value={formatValue(user.username)} />
				<DetailRow label='ອີເມວ' value={formatValue(user.email)} />
				<DetailRow label='ເບີໂທ' value={formatValue(user.tel)} />
			</Section>

			<Section title='ທຸລະກໍາ'>
				<DetailRow label='ລະຫັດ' value={formatValue(transaction.id)} />
				<DetailRow label='ວັນທີທຸລະກໍາ' value={formatValue(transaction.txnDate)} />
				<DetailRow label='ເລກທຸລະກໍາ' value={formatValue(transaction.txnNo)} />
				<DetailRow label='ເລກອ້າງອີງ' value={formatValue(transaction.reference)} />
				<DetailRow label='CBS Ref' value={formatValue(transaction.cbsRefNo)} />
				<DetailRow
					label='ສະຖານະທຸລະກໍາ'
					value={
						<Chip size='sm' color={statusMapped?.color || 'default'} variant='flat'>
							{statusMapped ? `${transStatus} · ${statusMapped.label}` : transStatus || '-'}
						</Chip>
					}
				/>
				<DetailRow label='ຜົນລັບ' value={`${formatValue(transaction.resultCode)} · ${formatValue(transaction.resultMessage)}`} />
				<DetailRow label='ວັນທີສ້າງ' value={formatValue(transaction.createAt)} />
			</Section>

			<Section title='ແພັກເກັດ'>
				<DetailRow label='ຊື່' value={formatValue(transaction.name)} />
				<DetailRow label='ລະຫັດແພັກເກັດ' value={formatValue(transaction.code)} />
				<DetailRow label='Slug' value={formatValue(transaction.slug)} />
				<DetailRow label='ຂໍ້ມູນ' value={formatValue(transaction.dataAmount)} />
				<DetailRow label='ວັນ' value={formatValue(transaction.durationDays)} />
				<DetailRow label='ຄວາມໄວ' value={formatValue(transaction.speed)} />
				<DetailRow label='ປະເທດ' value={formatValue(transaction.country)} />
				<DetailRow label='ລາຍລະອຽດ' value={formatValue(transaction.description)} />
			</Section>

			<Section title='ລາຄາ'>
				<DetailRow label='ລາຄາ (LAK)' value={formatMoney(transaction.priceLak, 'LAK')} />
				<DetailRow label='ລາຄາ (USD)' value={formatMoney(transaction.priceUsd, 'USD')} />
				<DetailRow label='ລາຄາຂາຍ (LAK)' value={formatMoney(transaction.retailPriceLak, 'LAK')} />
				<DetailRow label='ລາຄາຂາຍ (USD)' value={formatMoney(transaction.retailPriceUsd, 'USD')} />
				<DetailRow label='ຄ່າທຳນຽມ' value={formatMoney(transaction.fee, transaction.feeCcy || 'LAK')} />
				<DetailRow label='ອັດຕາແລກປ່ຽນ' value={formatValue(transaction.rate)} />
				<DetailRow label='ຈຳນວນ' value={formatValue(transaction.quantity)} />
			</Section>

			<Section title='eSIM'>
				<DetailRow label='ICCID' value={formatValue(transaction.iccId)} />
				<DetailRow label='ລະຫັດເປີດໃຊ້' value={formatValue(transaction.activationCode)} />
				<DetailRow label='SMDP' value={formatValue(transaction.smdpAddress)} />
				<DetailRow label='ສະຖານະ SIM' value={formatValue(transaction.simStatus)} />
				<DetailRow label='ສະຖານະແພັກເກັດ' value={formatValue(transaction.planStatus)} />
				<DetailRow label='ເລກອໍເດີ' value={formatValue(transaction.orderNumber)} />
				<DetailRow label='Order ID' value={formatValue(transaction.orderId)} />
				<DetailRow label='ສະຖານະອໍເດີ' value={formatValue(transaction.status)} />
				<DetailRow label='ເປີດໃຊ້ເມື່ອ' value={formatValue(transaction.activatedAt)} />
				<DetailRow label='ໝົດອາຍຸ' value={formatValue(transaction.expiresAt)} />
			</Section>

			<Section title='ຄືນເງິນ'>
				<DetailRow label='Revert Code' value={formatValue(transaction.revertCode)} />
				<DetailRow label='Revert Ref' value={formatValue(transaction.revertRefNo)} />
				<DetailRow label='Revert Txn' value={formatValue(transaction.revertTxnNo)} />
			</Section>
		</div>
	);
};

export default VolteyTransDetail;
