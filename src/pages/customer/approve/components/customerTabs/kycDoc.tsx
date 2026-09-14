import { useState } from 'react';
import { Card, CardBody, CardHeader, Chip } from '@heroui/react';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import { LuEye } from 'react-icons/lu';

interface Props {
	isMeepom?: boolean;
	msp?: any;
	meepom?: any;
}

const DocMetaCards = ({
	docNo,
	exp,
}: {
	docNo?: string | null;
	exp?: string | null;
}) => {
	if (!docNo && !exp) return null;

	return (
		<div className='mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2'>
			{docNo ? (
				<div className='rounded-2xl border-2 border-primary-200 bg-primary-50 px-6 py-5 dark:border-primary-700 dark:bg-primary-950/40'>
					<p className='text-sm font-semibold uppercase tracking-wide text-primary-600 dark:text-primary-300'>
						Doc No
					</p>
					<p className='mt-1 break-all text-3xl font-bold leading-tight text-gray-900 dark:text-white'>
						{docNo}
					</p>
				</div>
			) : null}
			{exp ? (
				<div className='rounded-2xl border-2 border-amber-200 bg-amber-50 px-6 py-5 dark:border-amber-700 dark:bg-amber-950/40'>
					<p className='text-sm font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300'>
						Exp
					</p>
					<p className='mt-1 text-3xl font-bold leading-tight text-gray-900 dark:text-white'>
						{exp}
					</p>
				</div>
			) : null}
		</div>
	);
};

const MediaCard = ({
	title,
	subtitle,
	children,
}: {
	title: string;
	subtitle?: string;
	children: React.ReactNode;
}) => (
	<Card className='z-0 w-full py-4'>
		<CardHeader className='flex-col items-start px-4 pb-0 pt-2'>
			<p className='text-tiny font-bold uppercase'>{title}</p>
			{subtitle ? <small className='text-default-500'>{subtitle}</small> : null}
		</CardHeader>
		<CardBody className='overflow-visible py-2'>{children}</CardBody>
	</Card>
);

const HoverImage = ({
	src,
	alt,
	id,
	hoveredCard,
	setHoveredCard,
}: {
	src: string;
	alt: string;
	id: string | number;
	hoveredCard: string | number | null;
	setHoveredCard: (id: string | number | null) => void;
}) => (
	<PhotoView src={src}>
		<div
			className='relative mx-auto w-full max-w-[300px] cursor-pointer overflow-hidden rounded-xl'
			onMouseEnter={() => setHoveredCard(id)}
			onMouseLeave={() => setHoveredCard(null)}>
			<img
				alt={alt}
				className='h-auto w-full max-w-[300px] rounded-xl object-cover'
				src={src}
				onError={() => console.error('Image failed to load:', src)}
			/>
			{hoveredCard === id && (
				<div className='absolute inset-0 flex items-center justify-center rounded-xl bg-black/50 transition-opacity duration-200'>
					<LuEye className='text-4xl text-white' />
				</div>
			)}
		</div>
	</PhotoView>
);

const KycDoc = ({ msp, meepom }: Props) => {
	const [hoveredCard, setHoveredCard] = useState<string | number | null>(null);

	const meepomBase = import.meta.env.VITE_IMAGE_MEPHOM_URL || '';
	const mspBase = import.meta.env.VITE_IMAGE_URL || '';

	const hasMeepom =
		!!meepom &&
		(meepom.shortVideo || meepom.rfDocPhoto1 || meepom.rfDocPhoto2 || meepom.profilePhoto);
	const hasMsp = Array.isArray(msp?.docFiles) && msp.docFiles.length > 0;

	if (!hasMeepom && !hasMsp) {
		return <p className='py-8 text-center text-red-500'>No documents available</p>;
	}

	return (
		<div className='space-y-10 py-4'>
			{hasMeepom && (
				<section>
					<div className='mb-4 flex flex-wrap items-center gap-3'>
						<h2 className='text-xl font-bold'>
							{meepom.rfDocTypeName || 'Meepom Document'}
						</h2>
						<Chip size='sm' color='secondary' variant='flat'>
							Meepom
						</Chip>
					</div>
					<DocMetaCards docNo={meepom.rfDocNo} />
					<PhotoProvider>
						<div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
							{meepom.profilePhoto ? (
								<MediaCard title='Profile Photo'>
									<HoverImage
										id='meepom-profile'
										src={meepomBase + meepom.profilePhoto}
										alt='Profile'
										hoveredCard={hoveredCard}
										setHoveredCard={setHoveredCard}
									/>
								</MediaCard>
							) : null}

							{meepom.shortVideo ? (
								<MediaCard title='Short Video' subtitle={meepom.username}>
									<video
										controls
										className='mx-auto w-full max-w-[300px] rounded-xl object-cover'
										src={meepomBase + meepom.shortVideo}
										onError={() =>
											console.error(
												'Video failed to load:',
												meepomBase + meepom.shortVideo,
											)
										}>
										Your browser does not support the video tag.
									</video>
								</MediaCard>
							) : null}

							{meepom.rfDocPhoto1 ? (
								<MediaCard title='Document Photo 1'>
									<HoverImage
										id='meepom-photo1'
										src={meepomBase + meepom.rfDocPhoto1}
										alt='Document 1'
										hoveredCard={hoveredCard}
										setHoveredCard={setHoveredCard}
									/>
								</MediaCard>
							) : null}

							{meepom.rfDocPhoto2 ? (
								<MediaCard title='Document Photo 2'>
									<HoverImage
										id='meepom-photo2'
										src={meepomBase + meepom.rfDocPhoto2}
										alt='Document 2'
										hoveredCard={hoveredCard}
										setHoveredCard={setHoveredCard}
									/>
								</MediaCard>
							) : null}
						</div>
					</PhotoProvider>
				</section>
			)}

			{hasMsp && (
				<section>
					<div className='mb-6 flex flex-wrap items-center gap-3'>
						<h2 className='text-xl font-bold'>{msp.docType || msp.name || 'MSP Document'}</h2>
						<Chip size='sm' color='primary' variant='flat'>
							MSP
						</Chip>
					</div>

					<DocMetaCards docNo={msp.dno} exp={msp.exp} />

					<PhotoProvider>
						<div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
							{msp.docFiles.map((docFile: any) => {
								const fullUrl = mspBase + docFile.url;
								return (
									<MediaCard
										key={docFile.id}
										title={`Page Type: ${docFile.pageType}`}
										subtitle={`Created By: ${docFile.createdBy}`}>
										{docFile.pageType === 'VIDEO' ? (
											<video
												controls
												className='mx-auto w-full max-w-[300px] rounded-xl object-cover'
												src={fullUrl}
												onError={() =>
													console.error('Video failed to load:', fullUrl)
												}>
												Your browser does not support the video tag.
											</video>
										) : (
											<HoverImage
												id={docFile.id}
												src={fullUrl}
												alt={docFile.name || 'Document'}
												hoveredCard={hoveredCard}
												setHoveredCard={setHoveredCard}
											/>
										)}
									</MediaCard>
								);
							})}
						</div>
					</PhotoProvider>
				</section>
			)}
		</div>
	);
};

export default KycDoc;
