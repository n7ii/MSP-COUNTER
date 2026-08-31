import { useRef, useEffect, useState } from 'react';
import html2canvas from 'html2canvas';

import logo from '@/assets/logo/MSP_WHITE_ICON.png';
import { useAppSelector } from '@/redux/hooks.ts';

import jsPDF from 'jspdf';
import 'jspdf-autotable';

import PhetsarathBase64 from '@/pages/reports/statement/components/fonts/PhetsarathFont.ts';
import autoTable from 'jspdf-autotable';

const Invoice = ({ transaction, customerDetail, startDate, endDate }: any) => {
	const user = useAppSelector((state) => state.auth?.user?.body);

	return (
		<div className='w-full rounded bg-white px-6 shadow-sm' id='invoice'>
			<div className='flex w-full items-center justify-between'>
				{/* Company Logo */}
				<div className='flex flex-col items-center text-right'>
					{/* Company Logo & Name */}
					<div className='flex items-center space-x-2 pr-12'>
						<img src={logo} alt='company-logo' height='80' width='80' />
						<span className='pb-2 text-lg font-bold text-green-500'>MSP</span>
					</div>

					{/* Company Info */}
					<div className='mt-2 text-left'>
						<p className='text-xs font-semibold text-black'>
							Messenger Solution Payment Co., Ltd.
						</p>
						<p className='text-xs text-black'>msp_headerquarter@msp.com.la</p>
						<p className='text-xs text-black'>
							Phakhao Village, Xaythany District, VTE
						</p>
						<p className='text-xs text-black'>Kaisone Phomvihan Street</p>
					</div>
				</div>

				{/* Wallet Statement Report */}
				<div className='pl-20 pt-2 text-right'>
					<p className='text-base font-semibold text-green-600'>
						Wallet Statement Report
					</p>
					<div className='grid grid-cols-2 gap-x-12 text-xs text-black'>
						<span className='font-light'>Wallet Name:</span>
						<span className='font-light uppercase'>
							{customerDetail?.firstNameEn || 'N/A'}
						</span>
						<span className='font-light'>Wallet No:</span>
						<span className='font-light'>{transaction?.[0]?.wlNo || 'N/A'}</span>
						<span className='font-light'>Wallet Address:</span>
						<span className='font-light'>
							{customerDetail?.addresses?.[0]?.village || 'N/A'},{' '}
							{customerDetail?.addresses?.[0]?.city || 'N/A'},{' '}
							{customerDetail?.addresses?.[0]?.province || 'N/A'}
						</span>

						<span className='font-light'>Wallet Type:</span>
						<span className='font-light'>
							{customerDetail?.locked ? 'Active' : 'Inactive'}
						</span>

						<span className='font-light'>Wallet Status:</span>
						<span className='font-light'>
							{customerDetail?.status === 1 ? 'Active' : 'Inactive'}
						</span>

						<span className='font-light'>Open:</span>
						<span className='font-light'>
							{customerDetail?.customer?.vfDocDate || 'N/A'}
						</span>
					</div>
				</div>
			</div>

			{/* Client info */}
			<div className='grid grid-cols-2 items-center'>
				<div className='text-xs leading-none'>
					<p className='font-semibold text-black'>Report By</p>
					<p className='font-light text-black'>UserID: {user?.id || 'N/A'}</p>
					<p className='font-light text-black'>Name: {user?.name || 'N/A'}</p>
					<p className='font-light text-black'>Position: {user?.role || 'N/A'}</p>
				</div>

				{/* Start and End Date Display */}
				<div className='text-right'>
					<div className='grid grid-cols-2 gap-x-4 text-xs text-black'>
						<span className='font-semibold'>Statement Period:</span>
						<span className='font-light'></span>

						<span className='font-light'>Start Date:</span>
						<span className='font-light'>{startDate || 'N/A'}</span>

						<span className='font-light'>End Date:</span>
						<span className='font-light'>{endDate || 'N/A'}</span>
					</div>
				</div>
			</div>
		</div>
	);
};

const PDFGenerator = ({
	transactionData,
	transSummary,
	customerDetail,
	startDate,
	endDate,
}: any) => {
	const invoiceRef = useRef<HTMLDivElement | null>(null);
	const [loading, setLoading] = useState(false);
	const hasGenerated = useRef(false);

	const generatePDF = async () => {
		if (!invoiceRef.current) return;

		setLoading(true);
		const pdf = new jsPDF('p', 'pt', 'a4');

		try {
			// Sort transaction data by date (oldest to newest)
			const sortedTransactions = [...(transactionData || [])].sort((a, b) => {
				const dateA = new Date(a.txnDate).getTime();
				const dateB = new Date(b.txnDate).getTime();
				return dateA - dateB;
			});

			// Register and use the Lao font
			pdf.addFileToVFS('Phetsarath.ttf', PhetsarathBase64);
			pdf.addFont('Phetsarath.ttf', 'Phetsarath', 'normal');
			pdf.setFont('Phetsarath');

			// Wait before capturing to prevent rendering issues
			await new Promise((resolve) => setTimeout(resolve, 500));

			// Capture Tailwind-styled invoice (Header + Summary) using html2canvas
			const invoiceElement = invoiceRef.current;
			const canvas = await html2canvas(invoiceElement, {
				scale: 2,
				backgroundColor: '#FFFFFF',
				useCORS: true,
				width: 600,
			});

			const imgData = canvas.toDataURL('image/jpeg', 2.0);
			const imgWidth = pdf.internal.pageSize.getWidth();
			const imgHeight = (canvas.height * imgWidth) / canvas.width;

			pdf.addImage(imgData, 'PNG', 0, 30, imgWidth, imgHeight);

			// Calculate table width dynamically (8 columns)
			const tableColumnWidths = [40, 70, 70, 70, 100, 70, 70, 70];
			const totalTableWidth = tableColumnWidths.reduce((sum, width) => sum + width, 0);
			const pageWidth = pdf.internal.pageSize.getWidth();
			const tableStartX = (pageWidth - totalTableWidth) / 2;

			// Generate the transaction table with sorted data
			autoTable(pdf, {
				startY: imgHeight + 50,
				margin: { top: 20, left: tableStartX, right: tableStartX },
				tableWidth: 'auto',
				head: [
					[
						'No',
						'Bill no',
						'Date',
						'TXNREF',
						'Remark',
						'Debit',
						'Credit',
						'Remaining Balance',
					],
				],
				body: sortedTransactions.map((data: any, index: any) => [
					index + 1,
					data?.txNo || 'N/A',
					data?.txnDate ? new Date(data.txnDate).toLocaleDateString('en-GB') : 'N/A',
					data?.rfNo || 'N/A',
					data?.remark || 'N/A',
					data?.debit?.toLocaleString() ?? 'N/A',
					data?.credit?.toLocaleString() ?? 'N/A',
					data?.afterTXN?.toLocaleString() ?? 'N/A',
				]),
				theme: 'grid',
				styles: {
					font: 'Phetsarath',
					fontSize: 8,
					cellPadding: { top: 4, bottom: 4, left: 3, right: 3 },
					valign: 'middle',
					lineWidth: 0.5,
					lineColor: [0, 0, 0], // Black borders
				},
				headStyles: {
					fillColor: [240, 240, 240],
					textColor: [0, 0, 0],
					fontStyle: 'bold',
					fontSize: 9,
					cellPadding: { top: 4, bottom: 4, left: 3, right: 3 },
					lineWidth: 0.5,
					lineColor: [0, 0, 0], // Black borders
				},
				columnStyles: {
					0: { halign: 'center', cellWidth: 40 },
					1: { cellWidth: 70 },
					2: { cellWidth: 70 },
					3: { cellWidth: 70 },
					4: { cellWidth: 100, halign: 'left' },
					5: { cellWidth: 70, halign: 'right' },
					6: { cellWidth: 70, halign: 'right' },
					7: { cellWidth: 70, halign: 'right' },
				},
			});

			// Get the final Y position after the table
			const finalY = (pdf as any).lastAutoTable.finalY;

			// Get the beforeTXN from the FIRST transaction (opening balance)
			const openingBalance =
				sortedTransactions.length > 0 ? sortedTransactions[0]?.beforeTXN ?? 0 : 0;

			// Add summary table
			autoTable(pdf, {
				startY: finalY + 10,
				margin: { left: tableStartX, right: tableStartX },
				tableWidth: totalTableWidth,
				body: [
					[
						{
							content: '',
							colSpan: 6,
							styles: {
								fillColor: [255, 255, 255],
								lineWidth: 0.5,
								lineColor: [0, 0, 0],
							},
						},
						{
							content: 'Previous Balance:',
							styles: {
								fontStyle: 'bold',
								halign: 'right',
								lineWidth: 0.5,
								lineColor: [0, 0, 0],
							},
						},
						{
							content: openingBalance.toLocaleString(),
							styles: {
								halign: 'right',
								lineWidth: 0.5,
								lineColor: [0, 0, 0],
							},
						},
					],
					[
						{
							content: '',
							colSpan: 6,
							styles: {
								fillColor: [255, 255, 255],
								lineWidth: 0.5,
								lineColor: [0, 0, 0],
							},
						},
						{
							content: 'TOTAL DEBIT:',
							styles: {
								fontStyle: 'bold',
								halign: 'right',
								lineWidth: 0.5,
								lineColor: [0, 0, 0],
							},
						},
						{
							content: (transSummary?.debit ?? 0).toLocaleString(),
							styles: {
								halign: 'right',
								lineWidth: 0.5,
								lineColor: [0, 0, 0],
							},
						},
					],
					[
						{
							content: '',
							colSpan: 6,
							styles: {
								fillColor: [255, 255, 255],
								lineWidth: 0.5,
								lineColor: [0, 0, 0],
							},
						},
						{
							content: 'TOTAL CREDIT:',
							styles: {
								fontStyle: 'bold',
								halign: 'right',
								lineWidth: 0.5,
								lineColor: [0, 0, 0],
							},
						},
						{
							content: (transSummary?.credit ?? 0).toLocaleString(),
							styles: {
								halign: 'right',
								lineWidth: 0.5,
								lineColor: [0, 0, 0],
							},
						},
					],
					[
						{
							content: '',
							colSpan: 6,
							styles: {
								fillColor: [255, 255, 255],
								lineWidth: 0.5,
								lineColor: [0, 0, 0],
							},
						},
						{
							content: 'AVAILABLE BALANCE:',
							styles: {
								fontStyle: 'bold',
								halign: 'right',
								lineWidth: 0.5,
								lineColor: [0, 0, 0],
							},
						},
						{
							content: (transSummary?.currentBalance ?? 0).toLocaleString(),
							styles: {
								halign: 'right',
								fontStyle: 'bold',
								lineWidth: 0.5,
								lineColor: [0, 0, 0],
							},
						},
					],
				],
				theme: 'grid',
				styles: {
					font: 'Phetsarath',
					fontSize: 9,
					cellPadding: { top: 6, bottom: 6, left: 3, right: 3 },
					fillColor: [240, 240, 240],
					textColor: [0, 0, 0],
					lineWidth: 0.5,
					lineColor: [0, 0, 0],
				},
				columnStyles: {
					0: { cellWidth: 40 },
					1: { cellWidth: 70 },
					2: { cellWidth: 70 },
					3: { cellWidth: 70 },
					4: { cellWidth: 100 },
					5: { cellWidth: 70 },
					6: { cellWidth: 70, halign: 'right' },
					7: { cellWidth: 70, halign: 'right' },
				},
			});

			// Save the final PDF
			pdf.save('wallet-statement.pdf');
		} catch (error) {
			console.error('Error generating PDF:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (transactionData && transactionData.length > 0 && !hasGenerated.current) {
			hasGenerated.current = true;
			generatePDF();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [transactionData]);

	return (
		<>
			{loading && (
				<div className='fixed inset-0 z-50 flex items-center justify-center bg-gray-100 bg-opacity-75 dark:bg-gray-900'>
					<p className='rounded bg-white p-4 shadow dark:bg-gray-800 dark:text-white'>
						Generating PDF, please wait...
					</p>
				</div>
			)}

			<div
				ref={invoiceRef}
				style={{
					position: 'absolute',
					left: '-10000px',
					top: 0,
					backgroundColor: 'white',
				}}>
				<Invoice
					customerDetail={customerDetail}
					transSummary={transSummary}
					transaction={transactionData}
					startDate={startDate}
					endDate={endDate}
				/>
			</div>
		</>
	);
};

export default PDFGenerator;
