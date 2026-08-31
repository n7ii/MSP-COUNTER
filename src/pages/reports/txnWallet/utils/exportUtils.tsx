import { useState } from 'react';
import toast from 'react-hot-toast';
import { exportToExcel } from '@/pages/reports/summaryGL/components/excels/ExportSummaryWallet';
import { exportAllToExcel } from '@/pages/reports/utils/statementUtils';

// Constants
const EXPORT_PAGE_SIZE = 1000000;

interface UseExcelExportProps {
	refetch: () => Promise<any>;
	pageSize: number;
	pageIndex: number;
	setPageSize: (size: number) => void;
	setPageIndex: (index: number) => void;
	searchTriggered: boolean;
	fetchedData: any;
	selectedChannel?: string;
}

interface ExportOptions {
	typeKey?: string;
	selectedStmType?: string;
	fileName?: string;
}

export const useExcelExport = ({
	refetch,
	pageSize,
	pageIndex,
	setPageSize,
	setPageIndex,
	searchTriggered,
	fetchedData,
	selectedChannel = 'ALL',
}: UseExcelExportProps) => {
	const [isExporting, setIsExporting] = useState(false);

	/**
	 * Export filtered data by transaction type
	 */
	const exportTypeDataToExcel = async (options: ExportOptions) => {
		try {
			setIsExporting(true);

			// Validate data availability
			if (!searchTriggered || !fetchedData?.body?.content?.length) {
				toast.error('ກະລຸນາຄົ້ນຫາຂໍ້ມູນກ່ອນສົ່ງອອກ!');
				return;
			}

			const exportType = options.typeKey || options.selectedStmType || 'ALL';
			const originalPageSize = pageSize;
			const originalPageIndex = pageIndex;

			// Set large page size to fetch all data
			setPageIndex(0);
			setPageSize(EXPORT_PAGE_SIZE);

			// Wait for state update
			await new Promise((resolve) => setTimeout(resolve, 200));

			// Fetch all data
			const { data: allData } = await refetch();

			if (allData?.body?.content?.length) {
				// Filter data by transaction type
				let filteredData = allData.body.content;

				if (exportType !== 'ALL') {
					filteredData = filteredData.filter((item: any) => item.stmType === exportType);
				}

				// Apply channel filter
				if (selectedChannel !== 'ALL') {
					filteredData = filteredData.filter(
						(item: any) => item.channel === selectedChannel,
					);
				}

				// Validate filtered data
				if (filteredData.length === 0) {
					toast.error(`ບໍ່ມີຂໍ້ມູນປະເພດ ${exportType}`);
					setPageSize(originalPageSize);
					setPageIndex(originalPageIndex);
					setIsExporting(false);
					return;
				}

				console.log('Filtered data:', filteredData);

				// Generate filename
				const fileName = options.fileName || `Summary_GL_Wallet_${exportType}_Report`;

				// Export to Excel
				await exportToExcel(filteredData, fileName);
			} else {
				toast.error('ບໍ່ມີຂໍ້ມູນສຳລັບການສົ່ງອອກ');
			}

			// Restore original pagination
			setPageSize(originalPageSize);
			setPageIndex(originalPageIndex);
		} catch (error) {
			console.error('Error exporting data:', error);
			toast.error('ການສົ່ງອອກຂໍ້ມູນລົ້ມເຫລວ');
		} finally {
			setIsExporting(false);
		}
	};

	/**
	 * Export all data with multiple sheets
	 */
	const exportExcelAll = async (fileName?: string) => {
		try {
			setIsExporting(true);

			// Validate data availability
			if (!searchTriggered || !fetchedData?.body?.content?.length) {
				toast.error('ກະລຸນາຄົ້ນຫາຂໍ້ມູນກ່ອນສົ່ງອອກ!');
				return;
			}

			const originalPageSize = pageSize;
			const originalPageIndex = pageIndex;

			// Set large page size to fetch all data
			setPageIndex(0);
			setPageSize(EXPORT_PAGE_SIZE);

			// Wait for state update
			await new Promise((resolve) => setTimeout(resolve, 200));

			// Fetch all data
			const { data: allData } = await refetch();

			if (allData?.body?.content?.length) {
				// Apply channel filter
				let dataToExport = allData.body.content;
				if (selectedChannel !== 'ALL') {
					dataToExport = dataToExport.filter(
						(item: any) => item.channel === selectedChannel,
					);
				}

				console.log('Exporting all data with multiple sheets...');

				// Export with multiple sheets
				const exportFileName = fileName || 'Summary_GL_Wallet_All_Report';
				await exportAllToExcel(dataToExport, exportFileName);

				toast.success(`ສົ່ງອອກທັງໝົດສຳເລັດ ${dataToExport.length} ລາຍການ`);
			} else {
				toast.error('ບໍ່ມີຂໍ້ມູນສຳລັບການສົ່ງອອກ');
			}

			// Restore original pagination
			setPageSize(originalPageSize);
			setPageIndex(originalPageIndex);
		} catch (error) {
			console.error('Error exporting data:', error);
			toast.error('ການສົ່ງອອກຂໍ້ມູນລົ້ມເຫລວ');
		} finally {
			setIsExporting(false);
		}
	};

	/**
	 * Handle export action based on key
	 */
	const handleExport = async (key: string, options?: ExportOptions) => {
		if (key === 'EXPORT_ALL') {
			await exportExcelAll(options?.fileName);
		} else {
			await exportTypeDataToExcel({
				typeKey: key,
				...options,
			});
		}
	};

	return {
		isExporting,
		exportTypeDataToExcel,
		exportExcelAll,
		handleExport,
	};
};
