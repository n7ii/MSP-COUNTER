// OLD API (commented): POST /report/water
// NEW API: GET /pay/report/water/dashboard + GET /pay/report/water/history
import PayReportPage from '@/pages/reports/pay/PayReportPage.tsx';

const WaterReportPage = () => (
	<PayReportPage
		service='water'
		title='ຄ່ານໍ້າປະປາ'
		soldOutLakLabel='ຍອດຊຳລະນໍ້າປະປາ (LAK)'
		soldOutUsdLabel='ຍອດຊຳລະນໍ້າປະປາ (USD)'
	/>
);

export default WaterReportPage;
