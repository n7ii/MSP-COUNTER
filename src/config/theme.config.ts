import DARK_MODE from '../constants/darkMode.constant';
import { TDarkMode } from '../types/uiType/darkMode.type.ts';
import { TRounded } from '../types/uiType/rounded.type.ts';
import { TColors } from '../types/uiType/colors.type.ts';
import { TColorIntensity } from '../types/uiType/colorIntensities.type.ts';
import { TBorderWidth } from '../types/uiType/borderWidth.type.ts';
import { TLang } from '../types/uiType/lang.type.ts';

type TThemeConfigs = {
	projectTitle: string;
	projectName: string;
	language: TLang;
	theme: TDarkMode;
	themeColor: TColors;
	themeColorShade: TColorIntensity;
	rounded: TRounded;
	/**
	 * UI Components
	 *
	 * If you give "border-0", you will remove the borders on the components.
	 */
	borderWidth: TBorderWidth;
	/**
	 * Default: 'transition-all duration-300 ease-in-out'
	 *
	 * For more information;
	 *
	 * https://tailwindcss.com/docs/transition-property
	 *
	 * https://tailwindcss.com/docs/transition-duration
	 *
	 * https://tailwindcss.com/docs/transition-timing-function
	 *
	 * https://tailwindcss.com/docs/transition-delay
	 */
	transition: string;
	fontSize: 12 | 13 | 14 | 15 | 16 | 17 | 18;
};

const themeConfig: TThemeConfigs = {
	projectTitle: 'MSP',
	projectName: 'MSP E-Wallet',
	language: 'en',
	theme: DARK_MODE.SYSTEM,
	themeColor: 'emerald',
	themeColorShade: '500',
	rounded: 'rounded-lg',
	borderWidth: 'border-2',
	transition: 'transition-all duration-300 ease-in-out',
	fontSize: 13,
};

export default themeConfig;
