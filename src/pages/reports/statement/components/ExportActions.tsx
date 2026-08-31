// File: pages/reports/statement/components/ExportActions.tsx

import { Button } from '@heroui/react';
import { PiFilePdf, PiMicrosoftExcelLogoFill } from 'react-icons/pi';

interface ExportActionsProps {
	onExportExcel: () => void;
	onExportPdf: (type: 'type1' | 'type2') => void;
	onExportExcelAll: () => void;
}

const ExportActions = ({ onExportExcel, onExportExcelAll, onExportPdf }: ExportActionsProps) => {
	return (
		<>
			<Button
				variant='ghost'
				radius='sm'
				color='primary'
				startContent={<PiMicrosoftExcelLogoFill size='24' />}
				onPress={onExportExcel}>
				Export Excel
			</Button>
			<Button
				variant='ghost'
				radius='sm'
				color='primary'
				disabled
				startContent={<PiMicrosoftExcelLogoFill size='24' />}
				onPress={onExportExcelAll}>
				Export Excel All
			</Button>
			<Button
				radius='sm'
				color='danger'
				startContent={<PiFilePdf size='24' />}
				onPress={() => onExportPdf('type1')}>
				Export PDF Format
			</Button>

			{/*<Button*/}
			{/*	radius='sm'*/}
			{/*	color='warning'*/}
			{/*	startContent={<PiFilePdf size='24' />}*/}
			{/*	onPress={() => onExportPdf('type2')}>*/}
			{/*	Export PDF Format All*/}
			{/*</Button>*/}
		</>
	);
};

export default ExportActions;
