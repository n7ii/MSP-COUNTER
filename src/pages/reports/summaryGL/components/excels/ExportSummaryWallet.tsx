import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';

// ============================================
// 1. STATEMENT WALLET FORMAT (13 columns)
// ============================================
const formatStatementWalletData = (data: any[]) => {
	return data.map((item, index) => ({
		NO: index + 1,
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
		Balance: item.afterTXN || item.balance || 0,
		Type: item.stmType || '',
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

// ============================================
// 2. TRANSACTION WALLET FORMAT (9 columns)
// ============================================
const formatTransactionWalletData = (data: any[]) => {
	return data.map((item, index) => ({
		NO: index + 1,
		ID: item.id || item.txNo || '',
		Channel: item.channel || '',
		'Wallet Number': item.wlNo || item.walletNumber || '',
		'Reference Number': item.rfNo || item.receiptNo || item.referenceNumber || '',
		'Transaction Date': item.txnDate || item.dtrq || item.transactionDate || '',
		Debit: item.debit || 0,
		Credit: item.credit || 0,
		Type: item.stmType || '',
		Balance: item.afterTXN || item.balance || 0,
		Remark: item.remark || item.remarks || '',
	}));
};

// ============================================
// 3. SUMMARY GL WALLET FORMAT (10 columns)
// ============================================
const formatSummaryGLWalletData = (data: any[]) => {
	return data.map((item, index) => ({
		NO: index + 1,
		ID: item.id || item.txNo || '',
		'Reference Number': item.rfNo || item.receiptNo || item.referenceNumber || '',
		'Wallet Number': item.wlNo || item.walletNumber || '',
		Channel: item.channel || '',
		'Transaction Date': item.txnDate || item.dtrq || item.transactionDate || '',
		Debit: item.debit || 0,
		Credit: item.credit || 0,
		Balance: item.afterTXN || item.balance || 0,
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

// ============================================
// UNIFIED EXPORT FUNCTION
// ============================================
export const exportToExcel = (data: any[], fileName: string) => {
	if (!data || !data.length) {
		toast.error('No data available for export.');
		return;
	}

	try {
		let formattedData: any[];
		let sheetName: string;
		let columnWidths: { wch: number }[];
		let debitColIndex: number;
		let creditColIndex: number;

		// Determine format based on fileName
		if (fileName.toLowerCase().includes('statement')) {
			// Statement Wallet Format
			formattedData = formatStatementWalletData(data);
			sheetName = 'Statement Wallet';
			debitColIndex = 9; // Debit column index
			creditColIndex = 10; // Credit column index
			columnWidths = [
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
		} else if (fileName.toLowerCase().includes('transaction')) {
			// Transaction Wallet Format
			formattedData = formatTransactionWalletData(data);
			sheetName = 'Transaction Wallet';
			debitColIndex = 6; // Debit column index
			creditColIndex = 7; // Credit column index
			columnWidths = [
				{ wch: 8 }, // NO
				{ wch: 10 }, // ID
				{ wch: 12 }, // Channel
				{ wch: 20 }, // Wallet Number
				{ wch: 22 }, // Reference Number
				{ wch: 20 }, // Transaction Date
				{ wch: 15 }, // Debit
				{ wch: 15 }, // Credit
				{ wch: 12 }, // Type
				{ wch: 15 }, // Balance
				{ wch: 30 }, // Remark
			];
		} else {
			// Summary GL Wallet Format (default)
			formattedData = formatSummaryGLWalletData(data);
			sheetName = 'Summary GL Wallet';
			debitColIndex = 6; // Debit column index
			creditColIndex = 7; // Credit column index
			columnWidths = [
				{ wch: 8 }, // NO
				{ wch: 10 }, // ID
				{ wch: 22 }, // Reference Number
				{ wch: 20 }, // Wallet Number
				{ wch: 12 }, // Channel
				{ wch: 20 }, // Transaction Date
				{ wch: 15 }, // Debit
				{ wch: 15 }, // Credit
				{ wch: 15 }, // Balance
				{ wch: 12 }, // Status
				{ wch: 30 }, // Remark
			];
		}

		// Calculate totals
		const totalDebit = formattedData.reduce((sum, item) => sum + (Number(item.Debit) || 0), 0);
		const totalCredit = formattedData.reduce(
			(sum, item) => sum + (Number(item.Credit) || 0),
			0,
		);

		// Convert data to worksheet
		const worksheet = XLSX.utils.json_to_sheet(formattedData);
		worksheet['!cols'] = columnWidths;

		// Get the range of the worksheet
		const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');

		// Add total row
		const totalRowIndex = range.e.r + 1;
		range.e.r = totalRowIndex; // Extend range to include total row

		// Add "Total" label
		const labelCell = XLSX.utils.encode_cell({ r: totalRowIndex, c: 0 });
		worksheet[labelCell] = { t: 's', v: 'TOTAL' };

		// Add total debit
		const debitCell = XLSX.utils.encode_cell({ r: totalRowIndex, c: debitColIndex });
		worksheet[debitCell] = { t: 'n', v: totalDebit };

		// Add total credit
		const creditCell = XLSX.utils.encode_cell({ r: totalRowIndex, c: creditColIndex });
		worksheet[creditCell] = { t: 'n', v: totalCredit };

		// Update worksheet range
		worksheet['!ref'] = XLSX.utils.encode_range(range);

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
					fgColor: { rgb: '92D050' }, // Green color
				},
				alignment: {
					horizontal: 'center',
					vertical: 'center',
					wrapText: false,
				},
				border: borderStyle,
			};
		}

		// Determine which columns are numeric based on format
		let numericColumnIndices: number[] = [];
		if (fileName.toLowerCase().includes('statement')) {
			numericColumnIndices = [9, 10, 11]; // Debit, Credit, Balance
		} else if (fileName.toLowerCase().includes('transaction')) {
			numericColumnIndices = [6, 7, 9]; // Debit, Credit, Balance
		} else {
			numericColumnIndices = [6, 7, 8]; // Debit, Credit, Balance
		}

		// Style all data rows with borders
		for (let row = range.s.r + 1; row <= range.e.r - 1; row++) {
			for (let col = range.s.c; col <= range.e.c; col++) {
				const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
				if (!worksheet[cellAddress]) {
					worksheet[cellAddress] = { t: 's', v: '' };
				}

				const isNumberColumn = numericColumnIndices.includes(col);

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

		// Style the total row with yellow background
		for (let col = range.s.c; col <= range.e.c; col++) {
			const cellAddress = XLSX.utils.encode_cell({ r: totalRowIndex, c: col });
			if (!worksheet[cellAddress]) {
				worksheet[cellAddress] = { t: 's', v: '' };
			}

			const isNumberColumn = numericColumnIndices.includes(col);

			worksheet[cellAddress].s = {
				font: {
					bold: true,
					name: 'Calibri',
					sz: 11,
				},
				fill: {
					fgColor: { rgb: 'FFFF00' }, // Yellow color
				},
				alignment: {
					horizontal: isNumberColumn || col === 0 ? 'right' : 'left',
					vertical: 'center',
				},
				border: borderStyle,
			};

			// Format total numbers with thousand separators
			if (isNumberColumn && worksheet[cellAddress].v) {
				const value = Number(worksheet[cellAddress].v);
				if (!isNaN(value)) {
					worksheet[cellAddress].z = '#,##0';
				}
			}
		}

		// Set row heights
		const rowHeights = [];
		for (let i = 0; i <= range.e.r; i++) {
			rowHeights.push({ hpt: 20 });
		}
		worksheet['!rows'] = rowHeights;

		// Create workbook and export
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
		XLSX.writeFile(workbook, `${fileName}.xlsx`);

		toast.success(`Exported ${formattedData.length} records successfully.`);
	} catch (error) {
		console.error('Error exporting to Excel:', error);
		toast.error('Failed to export data to Excel.');
	}
};
