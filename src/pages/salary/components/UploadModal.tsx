import { DragEvent, FC, useRef, useState } from 'react';
import classNames from 'classnames';
import { Button, Modal, ModalBody, ModalContent, ModalHeader, Progress } from '@heroui/react';
import { LuDownload, LuFileUp } from 'react-icons/lu';
import StepBanner from '@/pages/salary/components/StepBanner.tsx';
import {
	BTN_OUTLINE,
	BTN_PRIMARY,
	EXCEL_EXTENSIONS,
	MAX_FILE_SIZE_MB,
	MAX_RECORDS,
	OperationProgress,
} from '@/pages/salary/utils.ts';

export type UploadStage = 'idle' | 'uploading' | 'checking';

interface IUploadModalProps {
	isOpen: boolean;
	onClose: () => void;
	stage: UploadStage;
	progress: OperationProgress;
	error: string | null;
	templateLoading: boolean;
	onFileSelected: (file: File) => void;
	onDownloadTemplate: () => void;
}

const UploadModal: FC<IUploadModalProps> = ({
	isOpen,
	onClose,
	stage,
	progress,
	error,
	templateLoading,
	onFileSelected,
	onDownloadTemplate,
}) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const [dragging, setDragging] = useState(false);
	const running = stage !== 'idle';

	const pick = (file: File | undefined) => {
		if (file && !running) onFileSelected(file);
		if (inputRef.current) inputRef.current.value = '';
	};

	const handleDrop = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setDragging(false);
		pick(e.dataTransfer.files?.[0]);
	};

	return (
		<Modal
			isOpen={isOpen}
			onOpenChange={(open) => {
				if (!open && !running) onClose();
			}}
			isDismissable={!running}
			hideCloseButton={running}
			size='2xl'
			placement='center'>
			<ModalContent>
				<ModalHeader className='text-xl font-semibold'>Upload File Salary</ModalHeader>
				<ModalBody className='pb-6'>
					<div
						onDragOver={(e) => {
							e.preventDefault();
							if (!running) setDragging(true);
						}}
						onDragLeave={() => setDragging(false)}
						onDrop={handleDrop}
						className={classNames(
							'flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed px-6 py-8 text-center transition-colors',
							dragging
								? 'border-[#157F3F] bg-green-50 dark:bg-green-900/20'
								: 'border-zinc-400 dark:border-zinc-600',
						)}>
						<LuFileUp size={44} className='text-zinc-500' strokeWidth={1.25} />

						{running ? (
							<div className='mt-2 w-full max-w-sm space-y-2'>
								<Progress
									aria-label='Upload progress'
									value={stage === 'checking' ? 100 : progress.percent}
									isIndeterminate={stage === 'checking'}
									color='success'
									size='md'
								/>
								<div className='text-sm text-zinc-600 dark:text-zinc-300'>
									{stage === 'checking'
										? 'Checking data...'
										: progress.total > 0
											? `Uploading ${progress.processed}/${progress.total} (${Math.round(progress.percent)}%)`
											: `Uploading... ${Math.round(progress.percent)}%`}
								</div>
							</div>
						) : (
							<>
								<div className='mt-2 text-sm font-semibold'>
									Choose a file or drag &amp; drop it here
								</div>
								<div className='text-xs text-zinc-500'>
									Maximum {MAX_FILE_SIZE_MB} MB file size
								</div>
								<Button
									className={classNames(BTN_PRIMARY, 'mt-3 min-w-36')}
									onPress={() => inputRef.current?.click()}>
									Choose File
								</Button>
							</>
						)}

						<input
							ref={inputRef}
							type='file'
							accept={EXCEL_EXTENSIONS.join(',')}
							className='hidden'
							onChange={(e) => pick(e.target.files?.[0])}
						/>
					</div>

					{error && <StepBanner variant='error'>{error}</StepBanner>}

					<ul className='space-y-0.5 text-xs text-zinc-500'>
						<li>* The attached file must be in .xls or .xlsx format only.</li>
						<li>* The attached file must contain no more than {MAX_RECORDS} records.</li>
						<li>* The file size must not exceed {MAX_FILE_SIZE_MB} MB.</li>
					</ul>

					<div>
						<Button
							variant='bordered'
							className={BTN_OUTLINE}
							isLoading={templateLoading}
							isDisabled={running}
							startContent={!templateLoading && <LuDownload size={16} />}
							onPress={onDownloadTemplate}>
							Download Format
						</Button>
					</div>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default UploadModal;
