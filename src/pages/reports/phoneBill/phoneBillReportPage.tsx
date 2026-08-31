// OLD API (commented): POST /report/phoneBill
// NEW API: GET /pay/report/phone/dashboard + GET /pay/report/phone/history
import PayReportPage from '@/pages/reports/pay/PayReportPage.tsx';

const PhoneBillReportPage = () => (
	<PayReportPage
		service='phone'
		title='ຄ່າໂທລະສັບ'
		soldOutLakLabel='ຍອດຊຳລະໂທລະສັບ (LAK)'
		soldOutUsdLabel='ຍອດຊຳລະໂທລະສັບ (USD)'
	/>
);

export default PhoneBillReportPage;
