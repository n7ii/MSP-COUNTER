import { TAllColors } from '../types/uiType/colors.type.ts';
import { TColorIntensity } from '../types/uiType/colorIntensities.type.ts';

export const textColor = (color: TAllColors | undefined, shade: TColorIntensity | undefined) => {
	if (typeof color === 'undefined') return null;
	if (['inherit', 'current', 'transparent', 'black', 'white'].includes(color)) {
		return `text-${color}`;
	}
	if (typeof shade === 'undefined') return `text-${color}-500`;
	return `text-${color}-${shade}`;
};

const textColorUtil = (
	color: TAllColors | undefined,
	shade: TColorIntensity | undefined,
	opacity?: string,
	cond?: string,
) => {
	const value = textColor(color, shade) as string;
	const conditional = typeof cond === 'string' ? cond : '';

	if (opacity) return `${conditional}${value}/${opacity}`;
	return `${conditional}${value}`;
};

export default textColorUtil;
