import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';

// Export to Excel Function
export const exportAllToExcel = (data: any[], fileName: string) => {
	if (!data || !data.length) {
		toast.error('No data available for export.');
		return;
	}

	// Convert data to worksheet
	const worksheet = XLSX.utils.json_to_sheet(data);

	// Create a new workbook and append the worksheet
	const workbook = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(workbook, worksheet, 'Statement');

	// Write the workbook to file
	XLSX.writeFile(workbook, `${fileName}.xlsx`);
};
