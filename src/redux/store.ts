import { configureStore } from '@reduxjs/toolkit';
import authSlice from '@/redux/slices/auth/authSlice';
import userApiSlice from '@/pages/user/redux/queries/userApiSlice';
import { setupListeners } from '@reduxjs/toolkit/query';
import txnTypeApiSlice from '@/pages/settings/redux/queries/txnTypeApiSlice.ts';
import txnLimitApiSlice from '@/pages/settings/redux/queries/txnLimitApiSlice.ts';
import customerTypeApiSlice from '@/pages/settings/redux/queries/customerTypeApiSlice.ts';
import feesApiSlice from '@/pages/settings/redux/queries/feeApiSlice.ts';
import txnWalletApiSlice from '@/pages/reports/redux/queries/txnWalletApiSlice.ts';
import customerApiSlice from '@/pages/customer/redux/queries/customerApiSlice.ts';
import roleApiSlice from '@/pages/settings/redux/queries/roleApiSlice.ts';
import questionApiSlice from '@/pages/settings/redux/queries/questionApiSlice.ts';
import dashBroadApiSlice from '@/redux/queries/dashBroadApiSlice.ts';
import logApiSlice from '@/pages/logs/redux/queries/logApiSlice.ts';
import walletLimitApiSlice from '@/pages/settings/redux/queries/eWalletLimitApiSlice.ts';
import apisManagementApiSlice from '@/pages/apisManagement/redux/apisApiSlice.ts';
import revertApiSlice from '@/pages/revert/redux/queries/revertApiSlice.ts';
import volteyApiSlice from '@/pages/reports/redux/queries/volteyApiSlice.ts';
import payReportApiSlice from '@/pages/reports/redux/queries/payReportApiSlice.ts';

export const store = configureStore({
	reducer: {
		auth: authSlice,
		[userApiSlice.reducerPath]: userApiSlice.reducer,
		[txnTypeApiSlice.reducerPath]: txnTypeApiSlice.reducer,
		[txnLimitApiSlice.reducerPath]: txnLimitApiSlice.reducer,
		[customerTypeApiSlice.reducerPath]: customerTypeApiSlice.reducer,
		[feesApiSlice.reducerPath]: feesApiSlice.reducer,
		[txnWalletApiSlice.reducerPath]: txnWalletApiSlice.reducer,
		[customerApiSlice.reducerPath]: customerApiSlice.reducer,
		[roleApiSlice.reducerPath]: roleApiSlice.reducer,
		[questionApiSlice.reducerPath]: questionApiSlice.reducer,
		[dashBroadApiSlice.reducerPath]: dashBroadApiSlice.reducer,
		[logApiSlice.reducerPath]: logApiSlice.reducer,
		[walletLimitApiSlice.reducerPath]: walletLimitApiSlice.reducer,
		[apisManagementApiSlice.reducerPath]: apisManagementApiSlice.reducer,
		[revertApiSlice.reducerPath]: revertApiSlice.reducer,
		[volteyApiSlice.reducerPath]: volteyApiSlice.reducer,
		[payReportApiSlice.reducerPath]: payReportApiSlice.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware()
			.concat(userApiSlice.middleware)
			.concat(txnTypeApiSlice.middleware)
			.concat(txnLimitApiSlice.middleware)
			.concat(customerTypeApiSlice.middleware)
			.concat(feesApiSlice.middleware)
			.concat(txnWalletApiSlice.middleware)
			.concat(customerApiSlice.middleware)
			.concat(roleApiSlice.middleware)
			.concat(questionApiSlice.middleware)
			.concat(dashBroadApiSlice.middleware)
			.concat(logApiSlice.middleware)
			.concat(walletLimitApiSlice.middleware)
			.concat(apisManagementApiSlice.middleware)
			.concat(revertApiSlice.middleware)
			.concat(volteyApiSlice.middleware)
			.concat(payReportApiSlice.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
