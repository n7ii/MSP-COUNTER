import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';

// Format data according to the Transaction Wallet template
const formatTransactionWalletData = (data: any[]): any[] => {
	return data.map((item: any, index) => ({
		NO: index + 1 || '',
		ID: item.id || item.txNo || '',
		Channel: item.channel || '',
		'Wallet Number': item.wlNo || item.walletNumber || '',
		'Reference Number': item.rfNo || item.receiptNo || item.referenceNumber || '',
		'Transaction Date': item.txnDate || item.dtrq || item.transactionDate || '',
		Debit: item.debit || 0,
		Credit: item.credit || 0,
		Balance: item.afterTXN || item.balance || 0,
		Type: item.stmType || '',
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

// Export to Excel with custom formatting for Transaction Wallet
export const exportTransactionWalletToExcel = (
	data: any[],
	fileName: string = 'Transaction_Wallet_Report',
) => {
	if (!data || !data.length) {
		toast.error('No data available for export.');
		return;
	}

	try {
		// Format the data according to the template
		const formattedData = formatTransactionWalletData(data);

		// Calculate totals
		const { totalDebit, totalCredit } = calculateTotals(formattedData);

		// Add total row
		const totalRow = {
			NO: '',
			ID: '',
			Channel: '',
			'Wallet Number': '',
			'Reference Number': '',
			'Transaction Date': 'TOTAL',
			Debit: totalDebit,
			Credit: totalCredit,
			Balance: '',
			Type: '',
			Remark: '',
		};

		// Combine data with total row
		const dataWithTotal = [...formattedData, totalRow];

		// Convert data to worksheet
		const worksheet = XLSX.utils.json_to_sheet(dataWithTotal);

		// Set column widths for better readability
		const columnWidths = [
			{ wch: 10 }, // NO
			{ wch: 10 }, // ID
			{ wch: 12 }, // Channel
			{ wch: 20 }, // Wallet Number
			{ wch: 22 }, // Reference Number
			{ wch: 20 }, // Transaction Date
			{ wch: 15 }, // Debit
			{ wch: 15 }, // Credit
			{ wch: 15 }, // Balance
			{ wch: 15 }, // Type
			{ wch: 30 }, // Remark
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

				// Determine alignment based on column (numbers right-aligned, text left-aligned)
				const isNumberColumn = col >= 5 && col <= 7; // Debit, Credit, Balance columns

				worksheet[cellAddress].s = {
					font: {
						name: 'Calibri',
						sz: 11,
					},
					alignment: {
						horizontal: isNumberColumn ? 'right' : 'left',
						vertical: 'center',
					},
					border: borderStyle,
				};

				// Format numbers with thousand separators
				if (isNumberColumn && worksheet[cellAddress].v) {
					const value = Number(worksheet[cellAddress].v);
					if (!isNaN(value) && value !== 0) {
						worksheet[cellAddress].z = '#,##0';
					}
				}
			}
		}

		// Style the total row (last row) with bold font and yellow background
		const totalRowIndex = range.e.r;
		for (let col = range.s.c; col <= range.e.c; col++) {
			const cellAddress = XLSX.utils.encode_cell({ r: totalRowIndex, c: col });
			if (!worksheet[cellAddress]) {
				worksheet[cellAddress] = { t: 's', v: '' };
			}

			const isNumberColumn = col >= 6 && col <= 8; // Debit, Credit, Balance columns

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
					horizontal: isNumberColumn || col === 4 ? 'right' : 'left', // Right align "TOTAL" text and numbers
					vertical: 'center',
				},
				border: borderStyle,
			};

			// Format numbers with thousand separators in total row
			if (isNumberColumn && worksheet[cellAddress].v) {
				const value = Number(worksheet[cellAddress].v);
				if (!isNaN(value) && value !== 0) {
					worksheet[cellAddress].z = '#,##0';
				}
			}
		}

		// Set row heights
		const rowHeights = [];
		for (let i = 0; i <= range.e.r; i++) {
			rowHeights.push({ hpt: 20 }); // 20 points height for all rows
		}
		worksheet['!rows'] = rowHeights;

		// Create a new workbook and append the worksheet
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, 'Transaction Wallet');

		// Write the workbook to file
		XLSX.writeFile(workbook, `${fileName}.xlsx`);

		toast.success(`Exported ${formattedData.length} records successfully.`);
	} catch (error) {
		console.error('Error exporting to Excel:', error);
		toast.error('Failed to export data to Excel.');
	}
};

// Wrapper function to maintain compatibility with existing code
export const exportToExcel = (data: any[], fileName: string) => {
	// Check if it's a transaction wallet export based on filename
	if (fileName.includes('Transaction_Wallet')) {
		exportTransactionWalletToExcel(data, fileName);
	} else {
		// For other exports, you can add different logic or use a default format
		exportTransactionWalletToExcel(data, fileName);
	}
};
