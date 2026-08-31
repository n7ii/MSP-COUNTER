import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';

// Format data according to the Statement Wallet template
const formatWalletStatementData = (data: any[]): any[] => {
	return data.map((item, index) => ({
		NO: index + 1 || '',
		ID: item.id || item.txNo || '',
		'From Acc': item.fwlNo || item.fromAcc || item.fromAccount || '',
		'To Acc': item.twlNo || item.toAcc || item.toAccount || '',
		Channel: item.channel || '',
		'Full Name': item.twlName || item.fwlName || item.fullName || item.customerName || '',
		'Wallet Number': item.wlNo || item.walletNumber || item.walletNo || '',
		'Reference Number': item.rfNo || item.receiptNo || item.referenceNumber || '',
		'Transaction Date': item.txnDate || item.dtrq || item.transactionDate || '',
		Debit: item.debit || 0,
		Credit: item.credit || 0,
		Balance: item.afterTXN || item.balance || '',
		Status:
			item.status !== undefined
				? item.status
					? 'Active'
					: 'Inactive'
				: item.txstatus === 0
					? 'Success'
					: 'Failed',
		Remark: item.remark || item.remarks || '',
	}));
};

// Calculate totals for Credit and Debit
const calculateTotals = (data: any[]): { totalDebit: number; totalCredit: number } => {
	const totalDebit = data.reduce((sum, item) => {
		const debit = typeof item.Debit === 'number' ? item.Debit : parseFloat(item.Debit) || 0;
		return sum + debit;
	}, 0);

	const totalCredit = data.reduce((sum, item) => {
		const credit = typeof item.Credit === 'number' ? item.Credit : parseFloat(item.Credit) || 0;
		return sum + credit;
	}, 0);

	return { totalDebit, totalCredit };
};

// Export to Excel with custom formatting (main function)
export const exportWalletStatementToExcel = (
	data: any[],
	fileName: string = 'Statement_Wallet',
) => {
	if (!data || !data.length) {
		toast.error('No data available for export.');
		return;
	}

	try {
		// Format the data according to the template
		const formattedData = formatWalletStatementData(data);

		// Calculate totals
		const { totalDebit, totalCredit } = calculateTotals(formattedData);

		// Add total row
		const totalRow = {
			NO: '',
			ID: '',
			'From Acc': '',
			'To Acc': '',
			Channel: '',
			'Full Name': '',
			'Wallet Number': '',
			'Reference Number': '',
			'Transaction Date': 'TOTAL',
			Debit: totalDebit,
			Credit: totalCredit,
			Balance: '',
			Status: '',
			Remark: '',
		};

		// Combine data with total row
		const dataWithTotal = [...formattedData, totalRow];

		// Convert data to worksheet
		const worksheet = XLSX.utils.json_to_sheet(dataWithTotal);

		// Set column widths for better readability
		const columnWidths = [
			{ wch: 8 }, // NO
			{ wch: 8 }, // ID
			{ wch: 15 }, // From Acc
			{ wch: 15 }, // To Acc
			{ wch: 12 }, // Channel
			{ wch: 20 }, // Full Name
			{ wch: 18 }, // Wallet Number
			{ wch: 20 }, // Reference Number
			{ wch: 18 }, // Transaction Date
			{ wch: 15 }, // Debit
			{ wch: 15 }, // Credit
			{ wch: 15 }, // Balance
			{ wch: 12 }, // Status
			{ wch: 20 }, // Remark
		];
		worksheet['!cols'] = columnWidths;

		// Get the range of the worksheet
		const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');

		// Define border style
		const borderStyle = {
			top: { style: 'thin', color: { rgb: '000000' } },
			bottom: { style: 'thin', color: { rgb: '000000' } },
			left: { style: 'thin', color: { rgb: '000000' } },
			right: { style: 'thin', color: { rgb: '000000' } },
		};

		// Style the header row with green background
		for (let col = range.s.c; col <= range.e.c; col++) {
			const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
			if (!worksheet[cellAddress]) continue;

			worksheet[cellAddress].s = {
				font: {
					bold: true,
					color: { rgb: '000000' },
					name: 'Calibri',
					sz: 11,
				},
				fill: {
					fgColor: { rgb: '92D050' }, // Green color matching the template
				},
				alignment: {
					horizontal: 'center',
					vertical: 'center',
					wrapText: false,
				},
				border: borderStyle,
			};
		}

		// Style all data rows with borders (excluding total row)
		for (let row = range.s.r + 1; row < range.e.r; row++) {
			for (let col = range.s.c; col <= range.e.c; col++) {
				const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
				if (!worksheet[cellAddress]) {
					worksheet[cellAddress] = { t: 's', v: '' };
				}

				worksheet[cellAddress].s = {
					font: {
						name: 'Calibri',
						sz: 11,
					},
					alignment: {
						horizontal: 'left',
						vertical: 'center',
					},
					border: borderStyle,
				};
			}
		}

		// Style the total row (last row) with bold font and yellow background
		const totalRowIndex = range.e.r;
		for (let col = range.s.c; col <= range.e.c; col++) {
			const cellAddress = XLSX.utils.encode_cell({ r: totalRowIndex, c: col });
			if (!worksheet[cellAddress]) {
				worksheet[cellAddress] = { t: 's', v: '' };
			}

			worksheet[cellAddress].s = {
				font: {
					bold: true,
					name: 'Calibri',
					sz: 11,
					color: { rgb: '000000' },
				},
				fill: {
					fgColor: { rgb: 'FFFF00' }, // Yellow background for total row
				},
				alignment: {
					horizontal: col === 7 ? 'right' : 'left', // Right align "TOTAL" text
					vertical: 'center',
				},
				border: borderStyle,
			};
		}

		// Set row heights
		const rowHeights = [];
		for (let i = 0; i <= range.e.r; i++) {
			rowHeights.push({ hpt: 20 }); // 20 points height for all rows
		}
		worksheet['!rows'] = rowHeights;

		// Create a new workbook and append the worksheet
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, 'Statement Wallet');

		// Write the workbook to file
		XLSX.writeFile(workbook, `${fileName}.xlsx`);

		toast.success(`Exported ${formattedData.length} records successfully.`);
	} catch (error) {
		console.error('Error exporting to Excel:', error);
		toast.error('Failed to export data to Excel.');
	}
};

// Wrapper function to maintain compatibility with your existing code
export const exportToExcel = (data: any[], fileName: string) => {
	exportWalletStatementToExcel(data, fileName);
};
