// OLD API (commented): POST /report/easyTax
// NEW API: GET /pay/report/easy/dashboard + GET /pay/report/easy/history
import PayReportPage from '@/pages/reports/pay/PayReportPage.tsx';

const EasyTaxReportPage = () => (
	<PayReportPage
		service='easy'
		title='EasyTax'
		soldOutLakLabel='ຍອດຊຳລະ EasyTax (LAK)'
		soldOutUsdLabel='ຍອດຊຳລະ EasyTax (USD)'
	/>
);

export default EasyTaxReportPage;
