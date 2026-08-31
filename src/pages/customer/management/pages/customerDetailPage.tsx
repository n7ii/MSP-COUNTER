import { useNavigate, useParams } from 'react-router-dom';
import CustomerInfo from '@/pages/customer/approve/components/customerInfo.tsx';
import Subheader, {
	SubheaderLeft,
	SubheaderSeparator,
} from '@/components/layouts/Subheader/Subheader.tsx';

import Button from '@/components/ui/Button.tsx';
import PageWrapper from '@/components/layouts/PageWrapper/PageWrapper.tsx';

import {
	useGetCustomerByIdQuery,
	useGetCustomerDocsQuery,
} from '@/pages/customer/redux/queries/customerApiSlice.ts';

import Empty from '@/components/ui/Empty.tsx';

import Loading from '@/components/ui/spinner/fullPageSpinner.tsx';
import CustomerTabs from '@/pages/customer/management/pages/components/customerMangeTabs/sidebar.tsx';
import { LuFileText, LuLock, LuShieldQuestion, LuUser } from 'react-icons/lu';
import CustomerSatusManage from '@/pages/customer/management/pages/functions/customerStatus/customerStatusManage.tsx';
import CustomerInfoManage from '@/pages/customer/management/pages/functions/customerInfo/customerInfoManage.tsx';
import CustomerResetPw from '@/pages/customer/management/pages/functions/customerResetPw/customerResetPw.tsx';
import CustomerUnlockOtp from '@/pages/customer/management/pages/functions/customerUnlockOtp/customerUnlockOtp.tsx';
import CustomerUnlockQuestion from '@/pages/customer/management/pages/functions/customerUnlockQuestion/customerUnlockQuestion.tsx';

const CustomerDetailPage = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const customerId = id;

	const { data: userInfo, isLoading } = useGetCustomerByIdQuery({ customerId });

	const { data: CustomerDoc } = useGetCustomerDocsQuery({ id });

	const isMephom = CustomerDoc?.body?.useMeepom;

	console.log('userInfo', userInfo?.body?.tel);

	if (isLoading) {
		return <Loading />;
	}

	if (!userInfo) {
		return (
			<div>
				<Empty text='No customer data available' />
			</div>
		);
	}
	const tabsData = [
		{
			key: 'profile',
			title: 'ແກ້ໄຂຂໍ້ມູນສ່ວນຕົວ',
			icon: <LuUser size={18} />,
			content: <CustomerInfoManage userInfo={userInfo?.body} />,
		},
		{
			key: 'deposit',
			title: 'ຈັດການສະຖານະຂອງບັນຊີ',
			icon: <LuFileText size={18} />,
			content: <CustomerSatusManage username={userInfo?.body?.customer?.username} />,
		},
		{
			key: 'statements',
			title: 'ປ່ຽນລະຫັດຜ່ານ',
			icon: <LuLock size={18} />,
			content: <CustomerResetPw customerId={customerId} />,
		},

		{
			key: 'otpUnlock',
			title: 'ປົດລ໋ອກ OTP',
			icon: <LuLock size={18} />,
			content: <CustomerUnlockOtp userInfo={userInfo} />,
		},
		{
			key: 'QuestionUnlock',
			title: 'ປົດລ໋ອກ ຄໍາຖາມ',
			icon: <LuShieldQuestion size={18} />,
			content: <CustomerUnlockQuestion userInfo={userInfo} />,
		},
		// {
		// 	key: 'support',
		// 	title: 'ສະຫນັບສະຫນູນ',
		// 	icon: <LuPhone size={18} />,
		// 	content: <p>Customer Support</p>,
		// },
	];

	return (
		<>
			{isLoading && <Loading />}
			<PageWrapper name='page'>
				<Subheader>
					<SubheaderLeft>
						<Button icon='HeroArrowLeft' className='!px-0' onClick={() => navigate(-1)}>
							ກັບຄືນ
						</Button>
						<SubheaderSeparator />
						ຈັດການຂໍ້ມູນລູກຄ້າ
					</SubheaderLeft>
				</Subheader>

				<CustomerInfo
					isMephom={isMephom}
					CustomerDoc={CustomerDoc}
					userInfo={userInfo.body}
				/>

				<div className='px-24 py-12'>
					<CustomerTabs tabs={tabsData} />
				</div>
			</PageWrapper>
		</>
	);
};

export default CustomerDetailPage;
