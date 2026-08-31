import { useRef, useEffect, useState } from 'react';
import html2canvas from 'html2canvas';

import logo from '@/assets/logo/MSP_WHITE_ICON.png';
import { useAppSelector } from '@/redux/hooks.ts';

import jsPDF from 'jspdf';
import 'jspdf-autotable';

import PhetsarathBase64 from '@/pages/reports/statement/components/fonts/PhetsarathFont.ts';
import autoTable from 'jspdf-autotable';

// Helper function to detect Lao characters
const containsLaoCharacters = (text: string): boolean => {
	const laoRegex = /[\u0E80-\u0EFF]/;
	return laoRegex.test(text);
};

const Invoice = ({ customerDetail, startDate, endDate }: any) => {
	console.log('customerDetail', customerDetail);
	return (
		<div className='w-full rounded bg-white px-6 shadow-sm' id='invoice'>
			{/* Statement Period - Top Center */}
			<div className='mb-4 text-center'>
				<p className='mb-2 text-base font-semibold text-green-600'>Wallet Statement</p>
				<div className='inline-flex flex-col text-xs text-black'>
					<div className='flex gap-1'>
						<span className='font-light'>From Date:</span>
						<strong>{startDate || 'N/A'}</strong>
						<span className='font-light'>To</span>
						<strong>{endDate || 'N/A'}</strong>
					</div>
				</div>
			</div>

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

				{/* Wallet Information */}
				<div className='pl-44 pt-16'>
					<div className='space-y-1 text-xs text-black'>
						<div className='flex gap-2'>
							<span className='font-light'>Wallet Name:</span>
							<span className='font-light uppercase'>
								{customerDetail?.prefixCode || ''}{' '}
								{customerDetail?.firstNameEn || 'N/A'}
							</span>
						</div>

						<div className='flex gap-2'>
							<span className='font-light'>Phone number:</span>
							<span className='font-light'>{customerDetail?.tel || 'N/A'}</span>
						</div>

						<div className='flex gap-2'>
							<span className='font-light'>Wallet Address:</span>
							<span className='break-words font-light'>
								{customerDetail?.addresses?.[0]?.village || 'N/A'},{' '}
								{customerDetail?.addresses?.[0]?.city || 'N/A'},{' '}
								{customerDetail?.addresses?.[0]?.province || 'N/A'}
							</span>
						</div>

						<div className='flex gap-2'>
							<span className='font-light'>Wallet Type:</span>
							<span className='font-light'>
								{customerDetail?.customer?.locked ? 'Inactive' : 'Active'}
							</span>
						</div>

						<div className='flex gap-2'>
							<span className='font-light'>Wallet Status:</span>
							<span className='font-light'>
								{customerDetail?.customer?.status ? 'Active' : 'Inactive'}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const PDFGeneratorCustomer = ({
	transactionData,
	transSummary,
	customerDetail,
	startDate,
	endDate,
}: any) => {
	const invoiceRef = useRef<HTMLDivElement | null>(null);
	const [loading, setLoading] = useState(false);
	const hasGenerated = useRef(false);
	const user = useAppSelector((state) => state.auth?.user?.body);

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

			// Register Lao font
			pdf.addFileToVFS('Phetsarath.ttf', PhetsarathBase64);
			pdf.addFont('Phetsarath.ttf', 'Phetsarath', 'normal');

			// Set default font to Times New Roman
			pdf.setFont('times', 'normal');

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
			const tableColumnWidths = [30, 55, 55, 70, 145, 70, 70, 70];
			const totalTableWidth = tableColumnWidths.reduce((sum, width) => sum + width, 0);
			const pageWidth = pdf.internal.pageSize.getWidth();
			const tableStartX = (pageWidth - totalTableWidth) / 2;

			// Get the beforeTXN from the FIRST transaction (opening balance)
			const openingBalance =
				sortedTransactions.length > 0 ? (sortedTransactions[0]?.beforeTXN ?? 0) : 0;

			const tableBody: any = [
				// Previous Balance Row
				[
					{
						content: '',
						colSpan: 1,
						styles: {
							fontStyle: 'bold' as const,
							fillColor: [255, 255, 255],
							font: 'times',
						},
					},
					{
						colSpan: 1,
						content: '',
						styles: {
							fillColor: [255, 255, 255],
							font: 'times',
						},
					},
					{
						colSpan: 1,
						content: '',
						styles: {
							fillColor: [255, 255, 255],
							font: 'times',
						},
					},
					{
						colSpan: 1,
						content: '',
						styles: {
							fillColor: [255, 255, 255],
							font: 'times',
						},
					},
					{
						content: 'Previous Balance:',
						styles: {
							fontStyle: 'bold' as const,
							halign: 'right' as const,
							fillColor: [255, 255, 255],
							font: 'times',
						},
					},
					{
						colSpan: 1,
						content: '',
						styles: {
							fillColor: [255, 255, 255],
							font: 'times',
						},
					},
					{
						colSpan: 1,
						content: '',
						styles: {
							fillColor: [255, 255, 255],
							font: 'times',
						},
					},
					{
						content: openingBalance.toLocaleString(),
						styles: {
							fontStyle: 'bold' as const,
							halign: 'right' as const,
							fillColor: [255, 255, 255],
							font: 'times',
						},
					},
				],
				// Transaction rows with dynamic font selection
				...sortedTransactions.map((data: any, index: any) => {
					const remark = data?.remark || 'N/A';
					const hasLao = containsLaoCharacters(remark);

					return [
						{ content: index + 1, styles: { font: 'times' } },
						{
							content: data?.txnDate
								? new Date(data.txnDate).toLocaleDateString('en-GB')
								: 'N/A',
							styles: { font: 'times' },
						},
						{ content: data?.txNo || 'N/A', styles: { font: 'times' } },
						{ content: data?.rfNo || 'N/A', styles: { font: 'times' } },
						{
							content: remark,
							styles: { font: hasLao ? 'Phetsarath' : 'times' },
						},
						{
							content: data?.debit?.toLocaleString() ?? 'N/A',
							styles: { font: 'times' },
						},
						{
							content: data?.credit?.toLocaleString() ?? 'N/A',
							styles: { font: 'times' },
						},
						{
							content: data?.afterTXN?.toLocaleString() ?? 'N/A',
							styles: { font: 'times' },
						},
					];
				}),
			];

			// Generate the transaction table with sorted data
			autoTable(pdf, {
				startY: imgHeight + 50,
				margin: { top: 20, left: tableStartX, right: tableStartX },
				tableWidth: 'auto',
				head: [
					[
						'No',
						'Date',
						'Bill no',
						'Reference',
						'Description',
						'Debit',
						'Credit',
						'Balance',
					],
				],
				body: tableBody,
				theme: 'grid',
				styles: {
					font: 'times',
					fontSize: 8,
					cellPadding: { top: 4, bottom: 4, left: 3, right: 3 },
					valign: 'middle',
					lineWidth: 0.5,
					lineColor: [0, 0, 0],
				},
				headStyles: {
					fillColor: [240, 240, 240],
					textColor: [0, 0, 0],
					fontStyle: 'bold',
					fontSize: 9,
					cellPadding: { top: 4, bottom: 4, left: 3, right: 3 },
					lineWidth: 0.5,
					lineColor: [0, 0, 0],
					font: 'times',
				},
				columnStyles: {
					0: { halign: 'center', cellWidth: 30 },
					1: { cellWidth: 55 },
					2: { cellWidth: 55 },
					3: { cellWidth: 70 },
					4: { cellWidth: 145, halign: 'left' },
					5: { cellWidth: 70, halign: 'right' },
					6: { cellWidth: 70, halign: 'right' },
					7: { cellWidth: 70, halign: 'right' },
				},
			});

			// Get the final Y position after the table
			let finalY = (pdf as any).lastAutoTable.finalY;
			const totalDebitCount = sortedTransactions.filter((txn: any) => txn.debit > 0).length;
			const totalCreditCount = sortedTransactions.filter((txn: any) => txn.credit > 0).length;

			// Add summary table
			autoTable(pdf, {
				startY: finalY + 10,
				margin: { left: tableStartX, right: tableStartX },
				tableWidth: totalTableWidth,
				body: [
					// Previous Balance Row with gray background
					[
						{
							content: 'PREVIOUS BALANCE',
							colSpan: 7,
							styles: {
								fontStyle: 'bold' as const,
								halign: 'center' as const,
								fillColor: [211, 211, 211],
								lineWidth: 0.5,
								lineColor: [0, 0, 0],
								font: 'times',
							},
						},
						{
							content: openingBalance.toLocaleString(),
							styles: {
								halign: 'right' as const,
								fontStyle: 'bold' as const,
								fillColor: [255, 255, 255],
								lineWidth: 0.5,
								lineColor: [0, 0, 0],
								font: 'times',
							},
						},
					],
					// Total Debit Row
					[
						{
							content: 'TOTAL DR',
							colSpan: 6,
							styles: {
								halign: 'center' as const,
								fillColor: [255, 255, 255],
								lineWidth: 0.5,
								lineColor: [0, 0, 0],
								font: 'times',
							},
						},
						{
							content: totalDebitCount.toString(),
							styles: {
								halign: 'center' as const,
								fillColor: [255, 255, 255],
								lineWidth: 0.5,
								lineColor: [0, 0, 0],
								font: 'times',
							},
						},
						{
							content: (transSummary?.debit ?? 0).toLocaleString(),
							styles: {
								halign: 'right' as const,
								fillColor: [255, 255, 255],
								lineWidth: 0.5,
								lineColor: [0, 0, 0],
								font: 'times',
							},
						},
					],
					// Total Credit Row
					[
						{
							content: 'TOTAL CR',
							colSpan: 6,
							styles: {
								halign: 'center' as const,
								fillColor: [255, 255, 255],
								lineWidth: 0.5,
								lineColor: [0, 0, 0],
								font: 'times',
							},
						},
						{
							content: totalCreditCount.toString(),
							styles: {
								halign: 'center' as const,
								fillColor: [255, 255, 255],
								lineWidth: 0.5,
								lineColor: [0, 0, 0],
								font: 'times',
							},
						},
						{
							content: (transSummary?.credit ?? 0).toLocaleString(),
							styles: {
								halign: 'right' as const,
								fillColor: [255, 255, 255],
								lineWidth: 0.5,
								lineColor: [0, 0, 0],
								font: 'times',
							},
						},
					],
					// Ending Balance Row with gray background
					[
						{
							content: 'ENDING BALANCE',
							colSpan: 7,
							styles: {
								fontStyle: 'bold' as const,
								halign: 'center' as const,
								fillColor: [211, 211, 211],
								lineWidth: 0.5,
								lineColor: [0, 0, 0],
								font: 'times',
							},
						},
						{
							content: (transSummary?.currentBalance ?? 0).toLocaleString(),
							styles: {
								halign: 'right' as const,
								fontStyle: 'bold' as const,
								fillColor: [255, 255, 255],
								lineWidth: 0.5,
								lineColor: [0, 0, 0],
								font: 'times',
							},
						},
					],
				],
				theme: 'grid',
				styles: {
					font: 'times',
					fontSize: 9,
					cellPadding: { top: 6, bottom: 6, left: 3, right: 3 },
					textColor: [0, 0, 0],
					lineWidth: 0.5,
					lineColor: [0, 0, 0],
				},
				columnStyles: {
					0: { halign: 'center', cellWidth: 30 },
					1: { cellWidth: 55 },
					2: { cellWidth: 55 },
					3: { cellWidth: 70 },
					4: { cellWidth: 145 },
					5: { cellWidth: 70 },
					6: { cellWidth: 70 },
					7: { cellWidth: 70, halign: 'right' },
				},
			});

			// Get final Y position after summary table
			finalY = (pdf as any).lastAutoTable.finalY;

			// Add "BANK AUTHORIZED" text
			pdf.setFontSize(10);
			pdf.setFont('times', 'bold');
			const textWidth = pdf.getTextWidth('BANK AUTHORIZED');
			pdf.text('AUTHORIZED', (pageWidth - textWidth) / 2, finalY + 30);

			// Add "Report By" section at the end
			pdf.setFontSize(9);
			pdf.setFont('times', 'bold');
			pdf.text('Report By:', 40, finalY + 60);

			pdf.setFont('times', 'normal');
			pdf.setFontSize(8);
			pdf.text(`UserID: ${user?.id || 'N/A'}`, 40, finalY + 75);
			pdf.text(`Name: ${user?.name || 'N/A'}`, 40, finalY + 90);
			pdf.text(`Position: ${user?.role || 'N/A'}`, 40, finalY + 105);

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

export default PDFGeneratorCustomer;
