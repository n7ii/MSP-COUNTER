import React, { useState } from 'react';
import { Card, CardBody, CardHeader } from '@heroui/react';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import { LuEye } from 'react-icons/lu';

interface DocFile {
	id: number;
	pageType: string;
	url: string;
	name: string;
	createdBy: string;
}

interface DocItem {
	docType: string;
	docFiles: DocFile[];
}

interface Props {
	isMeepom: boolean;
	content: DocItem[];
}

const KycDoc: React.FC<Props> = ({ isMeepom, content }: any) => {
	// ✅ Track hover state for each card
	const [hoveredCard, setHoveredCard] = useState<number | null>(null);

	console.log('content', content);
	return (
		<div className='space-y-8 py-4'>
			{isMeepom ? (
				<>
					<section key={content?.docType}>
						<h2 className='mb-4 text-xl font-bold'>{content?.docType}</h2>
						<PhotoProvider>
							<div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
								{content && content.length > 0 ? (
									(() => {
										const docFile = content[0]; // Access first document
										const fullUrl = import.meta.env.VITE_IMAGE_MEPHOM_URL;

										console.log(
											'fullUrl + docFile.rfDocPhoto1',
											fullUrl + docFile.rfDocPhoto1,
										);
										return (
											<>
												<Card
													key={docFile.rfDocNo}
													className='z-0 w-full py-4'>
													<CardHeader className='flex-col items-start px-4 pb-0 pt-2'>
														<p className='text-tiny font-bold uppercase'>
															Document No: {docFile.rfDocNo}
														</p>
														<small className='text-default-500'>
															Created By: {docFile.createdBy}
														</small>
													</CardHeader>
													<CardBody className='overflow-visible py-2'>
														<video
															controls
															className='mx-auto mb-4 w-full max-w-[300px] rounded-xl object-cover'
															src={fullUrl + docFile.shortVideo}
															onError={() =>
																console.error(
																	'Video failed to load:',
																	fullUrl,
																)
															}>
															Your browser does not support the video
															tag.
														</video>
													</CardBody>
												</Card>

												{/* ✅ Show Additional Photos (Outside Card) */}
												<div className='mb-4 flex flex-wrap justify-center gap-4'>
													<Card
														key={docFile.rfDocNo}
														className='z-0 w-full py-4'>
														<CardHeader className='flex-col items-start px-4 pb-0 pt-2'>
															<p className='text-tiny font-bold uppercase'>
																Document No: {docFile.rfDocNo}
															</p>
															<small className='text-default-500'>
																Created By: {docFile.createdBy}
															</small>
														</CardHeader>
														<CardBody className='overflow-visible py-2'>
															<PhotoView
																src={fullUrl + docFile.rfDocPhoto1}>
																<img
																	alt='Document 1'
																	className='h-auto w-full max-w-[300px] rounded-xl object-cover'
																	src={
																		fullUrl +
																		docFile.rfDocPhoto1
																	}
																	onError={() =>
																		console.error(
																			'Image failed to load:',
																			fullUrl +
																				docFile.rfDocPhoto1,
																		)
																	}
																/>
															</PhotoView>
														</CardBody>
													</Card>
												</div>
												<Card
													key={docFile.rfDocNo}
													className='z-0 w-full py-4'>
													<CardHeader className='flex-col items-start px-4 pb-0 pt-2'>
														<p className='text-tiny font-bold uppercase'>
															Document No: {docFile.rfDocNo}
														</p>
														<small className='text-default-500'>
															Created By: {docFile.createdBy}
														</small>
													</CardHeader>
													<CardBody className='overflow-visible py-2'>
														<PhotoView
															src={fullUrl + docFile.rfDocPhoto2}>
															<img
																alt='Document 2'
																className='h-auto w-full max-w-[300px] rounded-xl object-cover'
																src={fullUrl + docFile.rfDocPhoto2}
																onError={() =>
																	console.error(
																		'Image failed to load:',
																		fullUrl +
																			docFile.rfDocPhoto2,
																	)
																}
															/>
														</PhotoView>
													</CardBody>
												</Card>
												{/* ✅ Document Details Inside Card */}
											</>
										);
									})()
								) : (
									<p className='text-center text-red-500'>
										No documents available
									</p>
								)}
							</div>
						</PhotoProvider>
					</section>
				</>
			) : (
				<>
					<section key={content?.docType}>
						<h2 className='mb-4 text-xl font-bold'>{content?.docType}</h2>
						<PhotoProvider>
							<div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
								{content?.docFiles?.map((docFile: any) => {
									const fullUrl = import.meta.env.VITE_IMAGE_URL + docFile.url;

									return (
										<Card key={docFile.id} className='z-0 w-full py-4'>
											<CardHeader className='flex-col items-start px-4 pb-0 pt-2'>
												<p className='text-tiny font-bold uppercase'>
													Page Type: {docFile.pageType}
												</p>
												<small className='text-default-500'>
													Created By: {docFile.createdBy}
												</small>
											</CardHeader>
											<CardBody className='overflow-visible py-2'>
												{docFile.pageType === 'VIDEO' ? (
													<video
														controls
														className='mx-auto w-full max-w-[300px] rounded-xl object-cover'
														src={fullUrl}
														onError={() =>
															console.error(
																'Video failed to load:',
																fullUrl,
															)
														}>
														Your browser does not support the video tag.
													</video>
												) : (
													<PhotoView src={fullUrl}>
														<div
															className='relative mx-auto w-full max-w-[300px] cursor-pointer overflow-hidden rounded-xl'
															onMouseEnter={() =>
																setHoveredCard(docFile.id)
															}
															onMouseLeave={() =>
																setHoveredCard(null)
															}>
															<img
																alt={docFile.name || 'Document'}
																className='h-auto w-full max-w-[300px] rounded-xl object-cover'
																src={fullUrl}
																onError={() =>
																	console.error(
																		'Image failed to load:',
																		fullUrl,
																	)
																}
															/>

															{/* ✅ Only show hover effect on the hovered card */}
															{hoveredCard === docFile.id && (
																<div className='absolute inset-0 flex items-center justify-center rounded-xl bg-black/50 transition-opacity duration-200'>
																	<LuEye className='text-4xl text-white' />
																</div>
															)}
														</div>
													</PhotoView>
												)}
											</CardBody>
										</Card>
									);
								})}
							</div>
						</PhotoProvider>
					</section>
				</>
			)}
		</div>
	);
};

export default KycDoc;
