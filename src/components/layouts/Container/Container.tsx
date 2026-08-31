import { forwardRef, ReactNode } from 'react';

type TContainerBreakpoint =
	| 'container'
	| 'sm:container'
	| 'md:container'
	| 'lg:container'
	| 'xl:container'
	| '2xl:container'
	| null;

interface IContainerProps {
	children: ReactNode;
	className?: string;
	breakpoint?: TContainerBreakpoint;
}

const Container = forwardRef<HTMLDivElement, IContainerProps>((props, ref) => {
	const { children, className, breakpoint, ...rest } = props;

	return (
		<div
			ref={ref}
			data-component-name='Container'
			className='px-4 py-6 sm:px-8 sm:py-8 md:px-12 md:py-10 lg:px-16 lg:py-12 xl:px-24'
			{...rest}>
			{children}
		</div>
	);
});

Container.defaultProps = {
	breakpoint: null, // Full width by default
	className: undefined,
};

Container.displayName = 'Container';

export default Container;
