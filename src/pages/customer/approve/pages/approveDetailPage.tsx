import { Link, useParams } from 'react-router-dom';
import CustomerInfo from '@/pages/customer/approve/components/customerInfo.tsx';
import Subheader, {
	SubheaderLeft,
	SubheaderSeparator,
} from '@/components/layouts/Subheader/Subheader.tsx';
import { appPages } from '@/config/pages.config.tsx';
import Button from '@/components/ui/Button.tsx';
import PageWrapper from '@/components/layouts/PageWrapper/PageWrapper.tsx';
import CustomerTabs from '@/pages/customer/approve/components/customerTabs/customerTabs.tsx';
import {
	useGetCustomerByIdQuery,
	useGetCustomerDocsQuery,
} from '@/pages/customer/redux/queries/customerApiSlice.ts';
import KycDoc from '@/pages/customer/approve/components/customerTabs/kycDoc.tsx';
import Empty from '@/components/ui/Empty.tsx';
import Container from '@/components/layouts/Container/Container.tsx';
import ApproveOrReject from '@/pages/customer/approve/components/customerTabs/approveOrReject.tsx';
import { Card, CardBody } from '@heroui/react';
import DeviceDetail from '@/pages/customer/approve/components/customerTabs/deviceDetail.tsx';
import Loading from '@/components/ui/spinner/fullPageSpinner.tsx';
import UnlockAccount from '@/pages/customer/approve/components/customerTabs/unLockAccount.tsx';

const ApproveDetailPage = () => {
	const { id } = useParams();
	const customerId = id;

	const { data: userInfo, isLoading } = useGetCustomerByIdQuery({ customerId });

	const profileId = userInfo?.body?.profileId;

	console.log('profileId', profileId);

	const { data: CustomerDoc, isLoading: isloadingDoc } = useGetCustomerDocsQuery(
		{
			id: profileId,
		},
		{
			skip: !profileId,
		},
	);

	const isMephom = CustomerDoc?.body?.useMeepom;

	// Determine which documents to use
	const documents =
		userInfo?.documents && !isMephom && userInfo?.documents?.length > 0
			? userInfo.documents[0]
			: CustomerDoc?.body?.msp && !isMephom
				? CustomerDoc?.body?.msp
				: isMephom && CustomerDoc?.body?.meepom
					? CustomerDoc?.body?.meepom
					: [];

	if (isLoading) {
		return <Loading />;
	}
	// Early return if no userInfo is available
	if (!userInfo)
		return (
			<div>
				<Empty text='No customer data available' />
			</div>
		);

	const tabs = [
		{
			key: 'doc',
			title: (
				<div className='text-md flex items-center space-x-2 font-semibold'>
					<span>ເອກະສານ</span>
				</div>
			),
			content: <KycDoc isMeepom={isMephom} content={documents} />,
		},
		{
			key: 'device',
			title: (
				<div className='text-md flex items-center space-x-2 font-semibold'>
					<span>ອຸປະກອນ</span>
				</div>
			),
			content: <DeviceDetail customerId={customerId} />,
		},
		// {
		// 	key: 'approve',
		// 	title: (
		// 		<div className='text-md flex items-center space-x-2 font-semibold'>
		// 			<span>ການອະນຸມັດ</span>
		// 		</div>
		// 	),
		// 	content: <KycDoc content={documents} />,
		// },
	];

	return (
		<>
			{isloadingDoc && <Loading />}
			{isLoading && <Loading />}
			<PageWrapper name='page'>
				<Subheader>
					<SubheaderLeft>
						<Link to={`../${appPages.customerPage.subPages.customerApprove.to}`}>
							<Button icon='HeroArrowLeft' className='!px-0'>
								ກັບຄືນ
							</Button>
						</Link>
						<SubheaderSeparator />
						ອະນຸມັດລູກຄ້າ (KYC)
					</SubheaderLeft>
				</Subheader>
				<UnlockAccount username={userInfo?.body?.customer?.username} />
				<CustomerInfo userInfo={userInfo.body} />
				<Container>
					<div className='px-16 py-4 pt-12'>
						<CustomerTabs variants='underlined' tabs={tabs} />
						{documents?.docFiles?.length > 0 &&
						userInfo?.body?.customer?.vfDoc !== true ? ( // Show if vfDoc is not true
							<>
								<ApproveOrReject customerId={id} />
							</>
						) : null}

						{documents?.docFiles?.length === 0 &&
						userInfo?.body?.customer?.vfDoc !== true ? (
							<Card>
								<CardBody className='flex items-center justify-between overflow-visible'>
									<Empty text='ຍັງບໍ່ມີຂໍ້ມູນເອກະສານ' />
								</CardBody>
							</Card>
						) : null}
					</div>
					{/*no doc submit*/}
					{(!documents || documents.length === 0) &&
						CustomerDoc?.meepom == null &&
						CustomerDoc?.msp == null && (
							<>
								<div>
									<Empty text='ຍັງບໍ່ມີການ ຍຶນຍັນຕົວຕົນ' />
								</div>
							</>
						)}
				</Container>
			</PageWrapper>
		</>
	);
};

export default ApproveDetailPage;
