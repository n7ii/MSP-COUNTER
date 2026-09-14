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
import { Button as HeroButton, Card, CardBody } from '@heroui/react';
import DeviceDetail from '@/pages/customer/approve/components/customerTabs/deviceDetail.tsx';
import Loading from '@/components/ui/spinner/fullPageSpinner.tsx';
import UnlockAccount from '@/pages/customer/approve/components/customerTabs/unLockAccount.tsx';
import { LuRefreshCw } from 'react-icons/lu';

const ApproveDetailPage = () => {
	const { id } = useParams();
	const customerId = id;

	const {
		data: userInfo,
		isLoading,
		isError,
		error,
	} = useGetCustomerByIdQuery(
		{ customerId },
		{
			skip: !customerId,
		},
	);

	const {
		data: CustomerDoc,
		isLoading: isloadingDoc,
		isFetching: isFetchingDoc,
		refetch: refetchDocs,
	} = useGetCustomerDocsQuery(
		{
			id: customerId,
		},
		{
			skip: !customerId,
		},
	);

	const docBody = CustomerDoc?.body;
	const isMephom = Boolean(docBody?.useMeepom);
	const mspDoc = docBody?.msp;
	const meepomDoc = docBody?.meepom;

	const hasMspDocs = Array.isArray(mspDoc?.docFiles) && mspDoc.docFiles.length > 0;
	const hasMeepomDocs = Boolean(
		meepomDoc &&
			(meepomDoc.shortVideo ||
				meepomDoc.rfDocPhoto1 ||
				meepomDoc.rfDocPhoto2 ||
				meepomDoc.profilePhoto),
	);
	const hasAnyDocs = hasMspDocs || hasMeepomDocs;
	const isAlreadyVerified = userInfo?.body?.customer?.vfDoc === true;

	const handleReloadDocs = () => {
		if (!customerId) return;
		refetchDocs();
	};

	if (!customerId) {
		return <Empty text='Missing customer id' />;
	}

	if (isLoading) {
		return <Loading />;
	}

	if (isError || !userInfo?.body) {
		console.error('Failed to load customer detail', error);
		return (
			<div>
				<Empty text='No customer data available' />
			</div>
		);
	}

	const tabs = [
		{
			key: 'doc',
			title: (
				<div className='text-md flex items-center space-x-2 font-semibold'>
					<span>ເອກະສານ</span>
				</div>
			),
			content: <KycDoc isMeepom={isMephom} msp={mspDoc} meepom={meepomDoc} />,
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
	];

	return (
		<>
			{isloadingDoc && <Loading />}
			<PageWrapper name='page'>
				<Subheader>
					<SubheaderLeft>
						<Link to={appPages.customerPage.subPages.customerApprove.to}>
							<Button icon='HeroArrowLeft' className='!px-0'>
								ກັບຄືນ
							</Button>
						</Link>
						<SubheaderSeparator />
						ອະນຸມັດລູກຄ້າ (KYC)
					</SubheaderLeft>
				</Subheader>
				{userInfo.body.customer?.username ? (
					<UnlockAccount username={userInfo.body.customer.username} />
				) : null}
				<CustomerInfo
					userInfo={userInfo.body}
					isMephom={isMephom}
					CustomerDoc={CustomerDoc}
				/>
				<Container>
					<div className='px-16 py-4 pt-12'>
						<div className='mb-4 flex justify-end'>
							<HeroButton
								color='primary'
								variant='flat'
								radius='sm'
								size='sm'
								isLoading={isFetchingDoc}
								isDisabled={!customerId}
								startContent={
									!isFetchingDoc ? (
										<LuRefreshCw className='h-4 w-4' />
									) : undefined
								}
								onPress={handleReloadDocs}>
								Reload Docs
							</HeroButton>
						</div>
						<CustomerTabs variants='underlined' tabs={tabs} />

						{hasAnyDocs && !isAlreadyVerified ? (
							<ApproveOrReject customerId={id} />
						) : null}

						{!isloadingDoc && !hasAnyDocs && !isAlreadyVerified ? (
							<Card>
								<CardBody className='flex items-center justify-between overflow-visible'>
									<Empty text='ຍັງບໍ່ມີຂໍ້ມູນເອກະສານ' />
								</CardBody>
							</Card>
						) : null}
					</div>
				</Container>
			</PageWrapper>
		</>
	);
};

export default ApproveDetailPage;
