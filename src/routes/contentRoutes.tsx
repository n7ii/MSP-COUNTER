import { lazy } from 'react';
import { appPages, authPages } from '../config/pages.config.tsx';
import EWalletLimitPage from '@/pages/settings/ewalletLimit/eWalletLitmitPage.tsx';
import ReconcilePage from '@/pages/reconcile/reconcilePage.tsx';
import ApiManagementPage from '@/pages/apisManagement/apisManagementPage.tsx';
import RevertPage from '@/pages/revert/revertPage.tsx';

// eslint-disable-next-line react-refresh/only-export-components
const NotificationPage = lazy(() => import('@/pages/logs/notification/notificationPage.tsx'));
const TrnLogPage = lazy(() => import('@/pages/logs/trnLog/trnLogPage.tsx'));
const CtmLogPage = lazy(() => import('@/pages/logs/ctmLog/ctmLogPage.tsx'));
const TxnTypeLogPage = lazy(() => import('@/pages/logs/txnReq/txnReqLogPage.tsx'));

const ApproveUserPage = lazy(() => import('@/pages/user/approve/pages/approveUserPage.tsx'));
const TxnTypePage = lazy(() => import('@/pages/settings/txnType/txnTypePage.tsx'));
const TxnLimitPage = lazy(() => import('@/pages/settings/txnLimit/txnLitmitPage.tsx'));
const CustomerTypePage = lazy(() => import('@/pages/settings/customerType/customerTypePage.tsx'));
const FeePage = lazy(() => import('@/pages/settings/fee/feePage.tsx'));
const TxnWalletReportPage = lazy(() => import('@/pages/reports/txnWallet/txnWalletReportPage.tsx'));
const CustomerApprovePage = lazy(() => import('@/pages/customer/approve/pages/approvePage.tsx'));
const ApproveDetailPage = lazy(
	() => import('@/pages/customer/approve/pages/approveDetailPage.tsx'),
);
const StatementPage = lazy(() => import('@/pages/reports/statement/statementPage.tsx'));
const SummaryGLPage = lazy(() => import('@/pages/reports/summaryGL/summaryGLPage.tsx'));
const CustomerMangement = lazy(
	() => import('@/pages/customer/management/pages/customerMangement.tsx'),
);
const RolePage = lazy(() => import('@/pages/settings/roles/rolePage.tsx'));
const QuestionPage = lazy(() => import('@/pages/settings/question/questionPage.tsx'));
const WaterReportPage = lazy(() => import('@/pages/reports/water/waterReportPage.tsx'));
const PhoneBillReportPage = lazy(() => import('@/pages/reports/phoneBill/phoneBillReportPage.tsx'));
const EdlReportPage = lazy(() => import('@/pages/reports/edl/edlReportPage.tsx'));
const EasyTaxReportPage = lazy(() => import('@/pages/reports/easyTax/easyTaxReportPage.tsx'));
const SmsReportPage = lazy(() => import('@/pages/reports/sms/smsReportPage.tsx'));
const VolteyReportPage = lazy(() => import('@/pages/reports/voltey/volteyReportPage.tsx'));
const CustomerDetailPage = lazy(
	() => import('@/pages/customer/management/pages/customerDetailPage.tsx'),
);

/**
 * FORM
 */
// const FieldWrapPage = lazy(
// 	() => import('../pages/componentsAndTemplates/form/FieldWrapPage/FieldWrap.page'),
// );
// const CheckboxPage = lazy(
// 	() => import('../pages/componentsAndTemplates/form/CheckboxPage/Checkbox.page'),
// );
// const CheckboxGroupPage = lazy(
// 	() => import('../pages/componentsAndTemplates/form/CheckboxGroupPage/CheckboxGroup.page'),
// );
// const InputPage = lazy(() => import('../pages/componentsAndTemplates/form/InputPage/Input.page'));
// const LabelPage = lazy(() => import('../pages/componentsAndTemplates/form/LabelPage/Label.page'));
// const RadioPage = lazy(() => import('../pages/componentsAndTemplates/form/RadioPage/Radio.page'));
// const RichTextPage = lazy(
// 	() => import('../pages/componentsAndTemplates/form/RichTextPage/RichText.page'),
// );
// const SelectPage = lazy(
// 	() => import('../pages/componentsAndTemplates/form/SelectPage/Select.page'),
// );
// const SelectReactPage = lazy(
// 	() => import('../pages/componentsAndTemplates/form/SelectReactPage/SelectReact.page'),
// );
// const TextareaPage = lazy(
// 	() => import('../pages/componentsAndTemplates/form/TextareaPage/Textarea.page'),
// );
// const ValidationPage = lazy(
// 	() => import('../pages/componentsAndTemplates/form/ValidationPage/Validation.page'),
// );

/**
 * SALES
 */
const SalesDashboardPage = lazy(
	() => import('../pages/sales/SalesDashboardPage/SalesDashboard.page'),
);

const ProfilePage = lazy(() => import('../pages/Profile.page'));

/**
 * Other
 */
// const UnderConstructionPage = lazy(() => import('../pages/UnderConstruction.page'));

const contentRoutes: any[] = [
	/**
	 * SALES::BEGIN
	 */
	{
		path: appPages.salesAppPages.subPages.salesDashboardPage.to,
		element: <SalesDashboardPage />,
		allowedRoles: ['ROOT', 'ADMIN', 'STAFF', 'MARKETING', 'RECONSILE', 'TELLER', 'CALLCENTER'],
	},

	/**
	 * SALES::END
	 */
	/**
	 * CUSTOMER::BEGIN
	 */
	{
		path: `${appPages.customerPage.subPages.customerApprove.to}`,
		element: <CustomerApprovePage />,
		allowedRoles: ['ROOT', 'ADMIN', 'STAFF', 'MARKETING', 'CALLCENTER'],
	},
	{
		path: `${appPages.customerPage.subPages.customerApproveDetail.to}`,
		element: <ApproveDetailPage />,
		allowedRoles: ['ROOT', 'ADMIN', 'STAFF', 'MARKETING', 'CALLCENTER'],
	},

	{
		path: `${appPages.customerPage.subPages.customerMangement.to}`,
		element: <CustomerMangement />,
		allowedRoles: ['ROOT', 'ADMIN', 'STAFF', 'MARKETING', 'CALLCENTER'],
	},
	{
		path: `${appPages.customerPage.subPages.customerDetail.to}`,
		element: <CustomerDetailPage />,
		allowedRoles: ['ROOT', 'ADMIN', 'STAFF', 'MARKETING', 'CALLCENTER'],
	},

	{
		path: `${appPages.customerPage.subPages.apisManage.to}`,
		element: <ApiManagementPage />,
		allowedRoles: ['ROOT', 'ADMIN', 'RECONSILE'],
	},

	{
		path: `${appPages.revertTransactionPage.to}`,
		element: <RevertPage />,
		allowedRoles: ['ROOT', 'ADMIN', 'RECONSILE'],
	},
	/**
	 * CUSTOMER::END
	 */

	/**
	 * USER::BEGIN
	 */
	{
		path: `${appPages.usersPage.subPages.userApprove.to}`,
		element: <ApproveUserPage />,
		allowedRoles: ['ROOT', 'ADMIN'],
	},
	/**
	 * USER::END
	 */

	/**
	 * SETTING::BEGIN
	 */
	{
		path: `${appPages.settingPage.subPages.txnType.to}`,
		element: <TxnTypePage />,
		allowedRoles: ['ROOT', 'ADMIN'],
	},
	{
		path: `${appPages.settingPage.subPages.txnLimit.to}`,
		element: <TxnLimitPage />,
		allowedRoles: ['ROOT', 'ADMIN'],
	},
	{
		path: `${appPages.settingPage.subPages.customerType.to}`,
		element: <CustomerTypePage />,
		allowedRoles: ['ROOT', 'ADMIN'],
	},

	{
		path: `${appPages.settingPage.subPages.fee.to}`,
		element: <FeePage />,
		allowedRoles: ['ROOT', 'ADMIN'],
	},
	{
		path: `${appPages.settingPage.subPages.role.to}`,
		element: <RolePage />,
		allowedRoles: ['ROOT', 'ADMIN'],
	},
	{
		path: `${appPages.settingPage.subPages.question.to}`,
		element: <QuestionPage />,
		allowedRoles: ['ROOT', 'ADMIN'],
	},

	{
		path: `${appPages.settingPage.subPages.ewallet.to}`,
		element: <EWalletLimitPage />,
		allowedRoles: ['ROOT', 'ADMIN'],
	},

	{
		path: `${appPages.salesAppPages.subPages.reconcilePage.to}`,
		element: <ReconcilePage />,
		allowedRoles: ['ROOT', 'ADMIN', 'MARKETING', 'RECONSILE', 'TELLER', 'STAFF'],
	},

	/**
	 * SETTING::END
	 */

	/**
	 * REPORT::BEGIN
	 */
	{
		path: `${appPages.reportPages.subPages.txnType.to}`,
		element: <TxnWalletReportPage />,
		allowedRoles: ['ROOT', 'ADMIN', 'STAFF', 'MARKETING', 'RECONSILE', 'TELLER'],
	},
	{
		path: `${appPages.reportPages.subPages.statment.to}`,
		element: <StatementPage />,
		allowedRoles: ['ROOT', 'ADMIN', 'STAFF', 'MARKETING', 'RECONSILE', 'TELLER'],
	},
	{
		path: `${appPages.reportPages.subPages.summaryGL.to}`,
		element: <SummaryGLPage />,
		allowedRoles: ['ROOT', 'ADMIN', 'STAFF', 'MARKETING', 'RECONSILE', 'TELLER'],
	},

	{
		path: `${appPages.reportPages.subPages.water.to}`,
		element: <WaterReportPage />,
		allowedRoles: ['ROOT', 'ADMIN', 'STAFF', 'MARKETING', 'RECONSILE', 'TELLER'],
	},

	{
		path: `${appPages.reportPages.subPages.phoneBill.to}`,
		element: <PhoneBillReportPage />,
		allowedRoles: ['ROOT', 'ADMIN', 'STAFF', 'MARKETING', 'RECONSILE', 'TELLER'],
	},
	{
		path: `${appPages.reportPages.subPages.edl.to}`,
		element: <EdlReportPage />,
		allowedRoles: ['ROOT', 'ADMIN', 'STAFF', 'MARKETING', 'RECONSILE', 'TELLER'],
	},

	{
		path: `${appPages.reportPages.subPages.easyTax.to}`,
		element: <EasyTaxReportPage />,
		allowedRoles: ['ROOT', 'ADMIN', 'STAFF', 'MARKETING', 'RECONSILE', 'TELLER'],
	},

	{
		path: `${appPages.reportPages.subPages.sms.to}`,
		element: <SmsReportPage />,
		allowedRoles: ['ROOT', 'ADMIN', 'STAFF', 'MARKETING', 'RECONSILE', 'TELLER'],
	},
	{
		path: `${appPages.reportPages.subPages.voltey.to}`,
		element: <VolteyReportPage />,
		allowedRoles: ['ROOT', 'ADMIN', 'STAFF', 'MARKETING', 'RECONSILE', 'TELLER'],
	},

	/**
	 * LOG::BEGIN
	 */
	{
		path: appPages.logPages.subPages.ctmLog.to,
		element: <CtmLogPage />,
		allowedRoles: ['ROOT', 'ADMIN'],
	},
	{
		path: appPages.logPages.subPages.notification.to,
		element: <NotificationPage />,
		allowedRoles: ['ROOT', 'ADMIN'],
	},
	{
		path: appPages.logPages.subPages.trnLog.to,
		element: <TrnLogPage />,
		allowedRoles: ['ROOT', 'ADMIN'],
	},
	{
		path: appPages.logPages.subPages.txnType.to,
		element: <TxnTypeLogPage />,
		allowedRoles: ['ROOT', 'ADMIN'],
	},
	/**
	 * LOG::BEGIN
	 */

	{
		path: authPages.profilePage.to,
		element: <ProfilePage />,
		allowedRoles: ['ROOT', 'ADMIN', 'STAFF', 'MARKETING'],
	},
];

export default contentRoutes;
