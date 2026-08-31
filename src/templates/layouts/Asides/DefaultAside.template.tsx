import Aside, { AsideBody, AsideFooter, AsideHead } from '../../../components/layouts/Aside/Aside';
import DarkModeSwitcherPart from './_parts/DarkModeSwitcher.part';
import { appPages } from '../../../config/pages.config.tsx';
import Nav, {
	NavCollapse,
	NavItem,
	NavSeparator,
	NavTitle,
} from '../../../components/layouts/Navigation/Nav';

import LogoAndAsideTogglePart from '@/templates/layouts/Asides/_parts/LogoAndAsideToggle.part.tsx';
import { Chip } from '@heroui/react';
import { useGetCustomerQuery } from '@/pages/customer/redux/queries/customerApiSlice.ts';
import UserTemplate from '@/templates/layouts/User/User.template.tsx';
import { useAppSelector } from '@/redux/hooks.ts';
import { hasAccess } from '@/utils/roleHelper';

const DefaultAsideTemplate = () => {
	const { data } = useGetCustomerQuery(
		{
			page: 0,
			size: 1,
			search: '',
			approved: false,
		},
		{
			refetchOnMountOrArgChange: true, // Refetch every time component mounts
		},
	);

	const { user } = useAppSelector((state) => state.auth);
	const userRole = user?.body?.role;

	// Helper function to check if any subpage is accessible
	const hasAccessToSubPages = (subPages: any) => {
		return Object.values(subPages).some((page: any) => hasAccess(userRole, page.roles));
	};

	return (
		<Aside>
			<AsideHead className='flex items-center space-x-2'>
				<LogoAndAsideTogglePart />
			</AsideHead>

			<AsideBody>
				<Nav>
					<NavTitle>ພາບລວມ</NavTitle>

					{hasAccess(
						userRole,
						appPages.salesAppPages.subPages.salesDashboardPage.roles,
					) && <NavItem {...appPages.salesAppPages.subPages.salesDashboardPage} />}

					{hasAccess(userRole, appPages.salesAppPages.subPages.reconcilePage.roles) && (
						<NavItem {...appPages.salesAppPages.subPages.reconcilePage} />
					)}

					<NavTitle>ຈັດການ</NavTitle>

					{hasAccess(userRole, appPages.customerPage.subPages.customerApprove.roles) && (
						<NavItem {...appPages.customerPage.subPages.customerApprove}>
							<Chip variant='flat' color='danger' className='rounded-lg leading-none'>
								{data?.body?.totalElements}
							</Chip>
						</NavItem>
					)}

					{hasAccess(
						userRole,
						appPages.customerPage.subPages.customerMangement.roles,
					) && <NavItem {...appPages.customerPage.subPages.customerMangement}></NavItem>}
					{hasAccess(userRole, appPages.customerPage.subPages.apisManage.roles) && (
						<NavItem {...appPages.customerPage.subPages.apisManage}></NavItem>
					)}
					{hasAccess(userRole, appPages.revertTransactionPage.roles) && (
						<NavItem {...appPages.revertTransactionPage}></NavItem>
					)}
					{hasAccess(userRole, appPages.usersPage.roles) &&
						hasAccessToSubPages(appPages.usersPage.subPages) && (
							<NavCollapse
								text={appPages.usersPage.text}
								to={appPages.usersPage.to}
								icon={appPages.usersPage.icon}>
								{hasAccess(
									userRole,
									appPages.usersPage.subPages.userApprove.roles,
								) && <NavItem {...appPages.usersPage.subPages.userApprove} />}
							</NavCollapse>
						)}

					{hasAccess(userRole, appPages.settingPage.roles) &&
						hasAccessToSubPages(appPages.settingPage.subPages) && (
							<NavCollapse
								text={appPages.settingPage.text}
								to={appPages.settingPage.to}
								icon={appPages.settingPage.icon}>
								{hasAccess(
									userRole,
									appPages.settingPage.subPages.txnType.roles,
								) && <NavItem {...appPages.settingPage.subPages.txnType} />}
								{hasAccess(
									userRole,
									appPages.settingPage.subPages.txnLimit.roles,
								) && <NavItem {...appPages.settingPage.subPages.txnLimit} />}
								{hasAccess(
									userRole,
									appPages.settingPage.subPages.customerType.roles,
								) && <NavItem {...appPages.settingPage.subPages.customerType} />}
								{hasAccess(userRole, appPages.settingPage.subPages.fee.roles) && (
									<NavItem {...appPages.settingPage.subPages.fee} />
								)}
								{hasAccess(userRole, appPages.settingPage.subPages.role.roles) && (
									<NavItem {...appPages.settingPage.subPages.role} />
								)}
								{hasAccess(
									userRole,
									appPages.settingPage.subPages.question.roles,
								) && <NavItem {...appPages.settingPage.subPages.question} />}
								{hasAccess(
									userRole,
									appPages.settingPage.subPages.ewallet.roles,
								) && <NavItem {...appPages.settingPage.subPages.ewallet} />}
							</NavCollapse>
						)}

					{hasAccess(userRole, appPages.reportPages.roles) &&
						hasAccessToSubPages(appPages.reportPages.subPages) && (
							<NavCollapse
								text={appPages.reportPages.text}
								to={appPages.reportPages.to}
								icon={appPages.reportPages.icon}>
								{hasAccess(userRole, appPages.reportPages.subPages.sms.roles) && (
									<NavItem {...appPages.reportPages.subPages.sms} />
								)}
								{hasAccess(
									userRole,
									appPages.reportPages.subPages.txnType.roles,
								) && <NavItem {...appPages.reportPages.subPages.txnType} />}
								{hasAccess(
									userRole,
									appPages.reportPages.subPages.statment.roles,
								) && <NavItem {...appPages.reportPages.subPages.statment} />}
								{hasAccess(
									userRole,
									appPages.reportPages.subPages.summaryGL.roles,
								) && <NavItem {...appPages.reportPages.subPages.summaryGL} />}
								{hasAccess(userRole, appPages.reportPages.subPages.water.roles) && (
									<NavItem {...appPages.reportPages.subPages.water} />
								)}
								{hasAccess(
									userRole,
									appPages.reportPages.subPages.phoneBill.roles,
								) && <NavItem {...appPages.reportPages.subPages.phoneBill} />}
								{hasAccess(userRole, appPages.reportPages.subPages.edl.roles) && (
									<NavItem {...appPages.reportPages.subPages.edl} />
								)}
								{hasAccess(
									userRole,
									appPages.reportPages.subPages.easyTax.roles,
								) && <NavItem {...appPages.reportPages.subPages.easyTax} />}
								{hasAccess(
									userRole,
									appPages.reportPages.subPages.voltey.roles,
								) && <NavItem {...appPages.reportPages.subPages.voltey} />}
							</NavCollapse>
						)}

					{hasAccess(userRole, appPages.logPages.roles) &&
						hasAccessToSubPages(appPages.logPages.subPages) && (
							<NavCollapse
								text={appPages.logPages.text}
								to={appPages.logPages.to}
								icon={appPages.logPages.icon}>
								{hasAccess(userRole, appPages.logPages.subPages.ctmLog.roles) && (
									<NavItem {...appPages.logPages.subPages.ctmLog} />
								)}
								{hasAccess(userRole, appPages.logPages.subPages.trnLog.roles) && (
									<NavItem {...appPages.logPages.subPages.trnLog} />
								)}
								{hasAccess(userRole, appPages.logPages.subPages.txnType.roles) && (
									<NavItem {...appPages.logPages.subPages.txnType} />
								)}
								{hasAccess(
									userRole,
									appPages.logPages.subPages.notification.roles,
								) && <NavItem {...appPages.logPages.subPages.notification} />}
							</NavCollapse>
						)}

					<NavSeparator />
				</Nav>
			</AsideBody>
			<AsideFooter>
				<UserTemplate />
				<DarkModeSwitcherPart />
			</AsideFooter>
		</Aside>
	);
};

export default DefaultAsideTemplate;
