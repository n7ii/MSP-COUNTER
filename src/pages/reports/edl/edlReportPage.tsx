// OLD API (commented): POST /report/edl
// NEW API: GET /pay/report/edl/dashboard + GET /pay/report/edl/history
import PayReportPage from '@/pages/reports/pay/PayReportPage.tsx';

const EdlReportPage = () => (
	<PayReportPage
		service='edl'
		title='ຄ່າໄຟຟ້າ'
		soldOutLakLabel='ຍອດຊຳລະໄຟຟ້າ (LAK)'
		soldOutUsdLabel='ຍອດຊຳລະໄຟຟ້າ (USD)'
	/>
);

export default EdlReportPage;
