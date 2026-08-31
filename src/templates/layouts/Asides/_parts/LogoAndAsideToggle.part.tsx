

import Visible from '../../../../components/utils/Visible';
import Icon from '../../../../components/icon/Icon';
import useAsideStatus from '../../../../hooks/useAsideStatus';

import {Image} from "@heroui/image";
import logo from "@/assets/logo/MSP_WHITE_ICON.png";
import {Link} from "react-router-dom";

const LogoAndAsideTogglePart = () => {
	const { asideStatus, setAsideStatus } = useAsideStatus();
	return (
		<>
			<Visible is={asideStatus}>
				<Link to='/' aria-label='Logo' className="flex items-center space-x-2">
				<Image height="50px" src={logo} alt="MSP Wallet" />
				<span className="text-green-600 pr-6  text-lg font-bold">MSP Wallet</span>
				</Link>
			</Visible>
			<button
				type='button'
				aria-label='Toggle Aside Menu'
				onClick={() => setAsideStatus(!asideStatus)}
				className='flex h-12 w-12 items-center justify-center'>
				<Icon
					icon={asideStatus ? 'HeroBars3BottomLeft' : 'HeroBars3'}
					className='text-2xl'
				/>
			</button>
		</>
	);
};

export default LogoAndAsideTogglePart;
