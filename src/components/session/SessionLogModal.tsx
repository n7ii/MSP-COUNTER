import { useMemo, useState } from 'react';
import ModalProvider from '@/components/ui/modal/modalProvider.tsx';
import { TokenService } from '@/common/services/token.service.ts';
import { useAppSelector } from '@/redux/hooks.ts';
import { Button } from '@heroui/react';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import { LuCopy, LuCheck } from 'react-icons/lu';

const tokenService = new TokenService();

type SessionLogModalProps = {
	isOpen: boolean;
	onOpenChange: () => void;
};

const SessionLogModal = ({ isOpen, onOpenChange }: SessionLogModalProps) => {
	const user = useAppSelector((state) => state.auth?.user?.body);
	const accessToken = tokenService.getAccessToken() || '';
	const loggedAt = tokenService.getLoggedAt();
	const [copied, setCopied] = useState<'token' | 'bearer' | null>(null);

	const bearerToken = useMemo(
		() => (accessToken ? `Bearer ${accessToken}` : ''),
		[accessToken],
	);

	const copyText = async (value: string, type: 'token' | 'bearer') => {
		if (!value) {
			toast.error('ບໍ່ມີ token');
			return;
		}
		try {
			await navigator.clipboard.writeText(value);
			setCopied(type);
			toast.success('ສຳເນົາແລ້ວ');
			setTimeout(() => setCopied(null), 1500);
		} catch {
			toast.error('ສຳເນົາບໍ່ສຳເລັດ');
		}
	};

	return (
		<ModalProvider
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			title='Session Log'
			size='2xl'
			scrollBehavior='inside'>
			<div className='flex flex-col gap-4 py-2'>
				<div className='grid grid-cols-2 gap-3 rounded-lg border p-3 text-sm'>
					<div>
						<p className='text-gray-500'>ຜູ້ໃຊ້</p>
						<p className='font-semibold'>{user?.username || '-'}</p>
					</div>
					<div>
						<p className='text-gray-500'>ສິດທິ</p>
						<p className='font-semibold'>{user?.role || '-'}</p>
					</div>
					<div>
						<p className='text-gray-500'>ເວລາເຂົ້າລະບົບ</p>
						<p className='font-semibold'>
							{loggedAt ? dayjs(loggedAt).format('YYYY-MM-DD HH:mm:ss') : '-'}
						</p>
					</div>
					<div>
						<p className='text-gray-500'>Last login</p>
						<p className='font-semibold'>{user?.lastLogin || '-'}</p>
					</div>
				</div>

				<div>
					<div className='mb-2 flex items-center justify-between'>
						<p className='font-semibold'>Access Token</p>
						<Button
							size='sm'
							color='primary'
							variant='flat'
							startContent={copied === 'token' ? <LuCheck size={16} /> : <LuCopy size={16} />}
							onPress={() => copyText(accessToken, 'token')}>
							ສຳເນົາ Token
						</Button>
					</div>
					<textarea
						readOnly
						value={accessToken}
						className='h-28 w-full rounded-md border bg-zinc-50 p-2 text-xs dark:bg-zinc-900'
						onClick={(e) => e.currentTarget.select()}
					/>
				</div>

				<div>
					<div className='mb-2 flex items-center justify-between'>
						<p className='font-semibold'>Authorization Header</p>
						<Button
							size='sm'
							color='primary'
							startContent={copied === 'bearer' ? <LuCheck size={16} /> : <LuCopy size={16} />}
							onPress={() => copyText(bearerToken, 'bearer')}>
							ສຳເນົາ Bearer
						</Button>
					</div>
					<textarea
						readOnly
						value={bearerToken}
						className='h-28 w-full rounded-md border bg-zinc-50 p-2 text-xs dark:bg-zinc-900'
						onClick={(e) => e.currentTarget.select()}
					/>
				</div>
			</div>
		</ModalProvider>
	);
};

export default SessionLogModal;
