import {
	LuCircleCheckBig,
	LuClipboardPen,
	LuDroplet,
	LuFileChartColumnIncreasing,
	LuPhoneCall,
	LuSettings,
	LuUserCog,
	LuShieldQuestion,
	LuZap,
	LuWalletCards,
	LuFileText,
	LuBanknote,
	LuListChecks,
	LuCreditCard,
	LuUsers,
	LuReceipt,
	LuShieldCheck,
	LuFileJson,
	LuRefreshCw,
	LuUndo2,
	LuMessageSquare,
	LuGlobe,
} from 'react-icons/lu';
import { HiMiniUserGroup } from 'react-icons/hi2';

import { PiWallet } from 'react-icons/pi';
import { IoDocumentTextOutline } from 'react-icons/io5';

export const examplePages = {
	examplesPage: {
		id: 'examplesPage',
		to: '/examples-page',
		text: 'Examples Page',
		icon: 'HeroBookOpen',
	},
	duotoneIconsPage: {
		id: 'duotoneIconsPage',
		to: '/duotone-icons',
		text: 'Duotone Icons',
		icon: 'HeroCubeTransparent',
	},
};
export const appPages = {
	salesAppPages: {
		id: 'salesApp',
		to: '/sales',
		text: 'Sales',
		icon: 'HeroBanknotes',
		roles: ['ADMIN', 'ROOT', 'STAFF', 'MARKETING', 'TELLER', 'RECONSILE', 'CALLCENTER'], // All roles can access
		subPages: {
			salesDashboardPage: {
				id: 'salesDashboardPage',
				to: '/',
				text: 'Dashboard',
				icon: 'HeroRectangleGroup',
				roles: ['ADMIN', 'ROOT', 'STAFF', 'MARKETING', 'RECONSILE', 'CALLCENTER'],
			},
			reconcilePage: {
				id: 'reconcilePage',
				to: '/reconcile',
				text: 'ການກວດທຽບ',
				icon: <LuRefreshCw />,
				roles: ['ADMIN', 'ROOT', 'RECONSILE', 'STAFF'],
			},
		},
	},
	customerPage: {
		id: 'customer',
		to: '/customer',
		text: 'ຈັດການລູກຄ້າ',
		icon: <HiMiniUserGroup size='24' className='text-gray-400' />,
		roles: ['ADMIN', 'ROOT', 'STAFF', 'MARKETING', 'CALLCENTER'],
		subPages: {
			customerApprove: {
				id: 'customerApprovePage',
				to: '/customer/approve',
				text: 'ອະນຸມັດລູກຄ້າ',
				icon: <LuCircleCheckBig />,
				roles: ['ROOT', 'ADMIN', 'STAFF', 'MARKETING', 'CALLCENTER'],
			},
			customerApproveDetail: {
				id: 'customerApproveDetailPage',
				to: '/customer/approve/:id',
				text: 'Customer Approve Detail',
				icon: 'HeroRectangleGroup',
				roles: ['ROOT', 'ADMIN', 'STAFF', 'MARKETING', 'CALLCENTER'],
			},
			customerMangement: {
				id: 'customerManagementPage',
				to: '/customer/management',
				text: 'ຈັດການຂໍ້ມູນລູກຄ້າ',
				icon: <HiMiniUserGroup size='24' className='text-gray-400' />,
				roles: ['ROOT', 'ADMIN', 'STAFF', 'MARKETING', 'CALLCENTER'],
			},
			customerDetail: {
				id: 'customerDetailPage',
				to: '/customer/management/:id',
				text: 'ຈັດການຂໍ້ມູນລູກຄ້າ',
				icon: 'HeroRectangleGroup',
				roles: ['ROOT', 'ADMIN', 'STAFF', 'MARKETING', 'CALLCENTER'],
			},
			apisManage: {
				id: 'customerDetailPage',
				to: '/customer/apis-management',
				text: 'ຈັດການບັນຊີ',
				icon: <IoDocumentTextOutline />,
				roles: ['ROOT', 'ADMIN', 'MARKETING'],
			},
		},
	},
	revertTransactionPage: {
		id: 'revertTransactionPage',
		to: '/revert-transactions',
		text: 'ຈັດການການຄຶນເງິນ',
		icon: <LuUndo2 size='24' className='text-gray-400' />,
		roles: ['ADMIN', 'ROOT', 'RECONSILE'],
	},
	usersPage: {
		id: 'user',
		to: '/user',
		text: 'ຈັດການຜູ້ໃຊ້',
		icon: <LuUserCog size='24' className='text-gray-400' />,
		roles: ['ADMIN', 'ROOT'],
		subPages: {
			userApprove: {
				id: 'userApprovePage',
				to: '/user/approve',
				text: 'ຜູ້ໃຊ້',
				icon: <LuUserCog />,
				roles: ['ADMIN', 'ROOT'],
			},
		},
	},
	settingPage: {
		id: 'settingPage',
		to: '/setting',
		text: 'ຕັ້ງຄ່າລະບົບ',
		icon: <LuSettings size='24' className='text-gray-400' />,
		roles: ['ADMIN', 'ROOT'],
		subPages: {
			txnType: {
				id: 'txntypePage',
				to: '/setting/txnReq',
				text: 'ປະເພດທຸລະກໍາ',
				icon: <LuListChecks size='24' className='text-gray-400' />,
				roles: ['ROOT'],
			},
			txnLimit: {
				id: 'txnLimitPage',
				to: '/setting/txnLimit',
				text: 'ຈໍາກັດວົງເງິນ',
				icon: <LuCreditCard size='24' className='text-gray-400' />,
				roles: ['ROOT'],
			},
			customerType: {
				id: 'customerTypePage',
				to: '/setting/cusType',
				text: 'ຈັດການປະເພດລູກຄ້າ',
				icon: <LuUsers size='24' className='text-gray-400' />,
				roles: ['ROOT'],
			},
			fee: {
				id: 'feePage',
				to: '/setting/fee',
				text: 'ຈັດການຄ່າທໍານຽມ',
				icon: <LuReceipt size='24' className='text-gray-400' />,
				roles: ['ROOT'],
			},
			role: {
				id: 'rolePage',
				to: '/setting/role',
				text: 'ຈັດການສິດທິ',
				icon: <LuShieldCheck size='24' className='text-gray-400' />,
				roles: ['ROOT'], // Only ROOT
			},
			question: {
				id: 'questionPage',
				to: '/setting/question',
				text: 'ຈັດການຄໍາຖາມ',
				icon: <LuShieldQuestion size='24' className='text-gray-400' />,
				roles: ['ROOT'],
			},
			ewallet: {
				id: 'eWalletLimit',
				to: '/setting/eWalletLimit',
				text: 'ຈັດການວົງເງິນກະເປົາ E-wallet',
				icon: <PiWallet size='24' className='text-gray-400' />,
				roles: ['ROOT'],
			},
		},
	},
	reportPages: {
		id: 'reportPage',
		to: '/report',
		text: 'ລາຍງານ',
		icon: <LuFileChartColumnIncreasing size='24' className='text-gray-400' />,
		roles: ['ADMIN', 'ROOT', 'STAFF', 'MARKETING', 'RECONSILE'],
		subPages: {
			txnType: {
				id: 'reportPage',
				to: '/report/txnWalletReport',
				text: 'ລາຍງານທຸລະກໍາໃນກະເປົ່າ',
				icon: <LuWalletCards size='24' className='text-gray-400' />,
				roles: ['ADMIN', 'ROOT', 'STAFF', 'MARKETING', 'RECONSILE'],
			},
			statment: {
				id: 'statementPage',
				to: '/report/statementReport',
				text: 'ລາຍງານ statement ຂອງລູກຄ້າ',
				icon: <LuFileText size='24' className='text-gray-400' />,
				roles: ['ADMIN', 'ROOT', 'STAFF', 'MARKETING', 'RECONSILE'],
			},
			summaryGL: {
				id: 'statementPage',
				to: '/report/summaryGL',
				text: 'ລາຍງານ ບັນຊີຕິດຕາມ',
				icon: <LuBanknote size='24' className='text-gray-400' />,
				roles: ['ADMIN', 'ROOT', 'STAFF', 'MARKETING', 'RECONSILE'],
			},
			water: {
				id: 'waterPage',
				to: '/report/water',
				text: 'ລາຍງານ ຄ່ານໍ້າປະປາ',
				icon: <LuDroplet size='24' className='text-gray-400' />,
				roles: ['ADMIN', 'ROOT', 'STAFF', 'MARKETING', 'RECONSILE'],
			},
			phoneBill: {
				id: 'phoneBillPage',
				to: '/report/phoneBill',
				text: 'ລາຍງານ ຄ່າໂທລະສັບ',
				icon: <LuPhoneCall size='24' className='text-gray-400' />,
				roles: ['ADMIN', 'ROOT', 'STAFF', 'MARKETING', 'RECONSILE'],
			},
			edl: {
				id: 'edlPage',
				to: '/report/edl',
				text: 'ລາຍງານ ຄ່າໄຟຟ້າ',
				icon: <LuZap size='24' className='text-gray-400' />,
				roles: ['ADMIN', 'ROOT', 'STAFF', 'MARKETING', 'RECONSILE'],
			},
			easyTax: {
				id: 'easyTaxPage',
				to: '/report/easyTaxPage',
				text: 'ລາຍງານ ພາສິ EasyTax',
				icon: <LuClipboardPen size='24' className='text-gray-400' />,
				roles: ['ADMIN', 'ROOT', 'STAFF', 'MARKETING', 'RECONSILE'],
			},
			sms: {
				id: 'smsPage',
				to: '/report/sms',
				text: 'ລາຍງານ SMS',
				icon: <LuMessageSquare size='24' className='text-gray-400' />,
				roles: ['ADMIN', 'ROOT', 'STAFF', 'MARKETING', 'RECONSILE'],
			},
			voltey: {
				id: 'volteyPage',
				to: '/report/voltey',
				text: 'ລາຍງານ Voltey',
				icon: <LuGlobe size='24' className='text-gray-400' />,
				roles: ['ADMIN', 'ROOT', 'STAFF', 'MARKETING', 'RECONSILE'],
			},
		},
	},
	logPages: {
		id: 'logPage',
		to: '/log',
		text: 'Log',
		icon: <LuFileJson size='24' className='text-gray-400' />,
		roles: ['ADMIN', 'ROOT'],
		subPages: {
			txnType: {
				id: 'txnReqPage',
				to: '/log/txnReq',
				text: 'transaction Request',
				icon: <LuFileJson size='24' className='text-gray-400' />,
				roles: ['ADMIN', 'ROOT'],
			},
			trnLog: {
				id: 'trnLogPage',
				to: '/log/trnLog',
				text: 'transaction Log ',
				icon: <LuFileJson size='24' className='text-gray-400' />,
				roles: ['ADMIN', 'ROOT'],
			},
			notification: {
				id: 'notificationPage',
				to: '/log/notification',
				text: 'notification',
				icon: <LuFileJson size='24' className='text-gray-400' />,
				roles: ['ADMIN', 'ROOT'],
			},
			ctmLog: {
				id: 'ctmLogPage',
				to: '/log/ctmLog',
				text: 'customer log',
				icon: <LuFileJson size='24' className='text-gray-400' />,
				roles: ['ADMIN', 'ROOT'],
			},
		},
	},
};

export const authPages = {
	loginPage: {
		id: 'loginPage',
		to: '/auth',
		text: 'Login',
		icon: 'HeroArrowRightOnRectangle',
	},
	registerPage: {
		id: 'registerPage',
		to: '/signup',
		text: 'Login',
		icon: 'HeroArrowRightOnRectangle',
	},
	profilePage: {
		id: 'profilePage',
		to: '/profile',
		text: 'Profile',
		icon: 'HeroUser',
	},
};

const pagesConfig = {
	...examplePages,
	...authPages,
};

export default pagesConfig;
