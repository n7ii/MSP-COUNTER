import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import people from '@/assets/animation/people.json';
import Lottie from 'lottie-react';
import { Chip } from '@heroui/react';
import { FaCheckCircle, FaLock, FaTimesCircle, FaUnlock } from 'react-icons/fa';
import { useState } from 'react';
import { LuEye } from 'react-icons/lu';
import meephomLogo from '@/assets/logo/meephom.jpg';
import mspLogo from '@/assets/logo/MSP_WHITE_ICON.png';

const CustomerInfo = ({ userInfo, isMephom, CustomerDoc }: any) => {
	const [isHovered, setIsHovered] = useState(false);
	const baseImage = isMephom
		? import.meta.env.VITE_IMAGE_MEPHOM_URL
		: import.meta.env.VITE_IMAGE_URL;

	const profileImage = isMephom
		? CustomerDoc?.body?.meepom?.profilePhoto || CustomerDoc?.body?.meepom?.[0]?.profilePhoto
		: userInfo?.profImg;
	const isUnlocked = userInfo?.customer?.locked === false && userInfo?.customer?.status === true;
	return (
		<div className='bg-gray-100  dark:bg-[#09090B]'>
			{/* Background Image */}
			<div>
				<img
					src='https://images.unsplash.com/photo-1444628838545-ac4016a5418a?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdl&fit=crop&w=1950&q=80'
					alt='Background'
					className='h-40 w-full object-cover lg:h-60'
				/>
			</div>

			{/* Profile Card */}
			<div className='relative mx-24 -mt-24  rounded-[28px] bg-white shadow-sm dark:bg-[#18181B] dark:text-white'>
				<div className='flex flex-col space-y-6 px-12 py-6 pb-6 sm:flex-row sm:items-center sm:space-x-12 sm:space-y-0'>
					{/* Avatar and Name */}
					<div className='-mt-40 flex items-center space-x-6'>
						<PhotoProvider>
							<div
								className='relative h-44 w-44 cursor-pointer rounded-[28px] ring-[6px] ring-white dark:ring-gray-700'
								onMouseEnter={() => setIsHovered(true)}
								onMouseLeave={() => setIsHovered(false)}>
								<PhotoView src={baseImage + profileImage}>
									<div className='relative h-full w-full'>
										{profileImage ? (
											<img
												src={baseImage + profileImage}
												alt='Avatar'
												className='h-full w-full cursor-pointer rounded-[28px] object-cover'
											/>
										) : (
											<Lottie
												animationData={people}
												className='h-full w-full rounded-[28px] bg-teal-100 dark:bg-teal-900'
												autoplay
												loop
											/>
										)}

										{/* Eye Icon - Show on Hover */}
										{isHovered && (
											<div className='absolute inset-0 flex items-center justify-center rounded-[28px] bg-black/50 transition-opacity duration-200'>
												<LuEye className='text-4xl text-white' />
											</div>
										)}
									</div>
								</PhotoView>
							</div>
						</PhotoProvider>

						<div className='pt-4'>
							<h1 className='pb-2 text-3xl font-bold text-gray-900 dark:text-white'>
								{userInfo?.prefixLa}. {userInfo?.firstNameLa} {userInfo?.lastNameLa}
							</h1>
							<p className='text-lg text-gray-500 dark:text-gray-400'>
								{userInfo?.prefixCode} {userInfo?.firstNameEn}{' '}
								{userInfo?.lastNameEn}
							</p>
						</div>
					</div>

					{/* Details Section */}
					<div className='flex-grow border-t border-gray-200 pb-8 dark:border-gray-600 sm:border-l sm:border-t-0 sm:pl-6'>
						<div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
							<div>
								<dt className='text-md font-medium text-gray-500 dark:text-gray-300'>
									PHONE
								</dt>
								<dd className='text-md mt-1 text-gray-900 dark:text-gray-200'>
									{userInfo?.tel}
								</dd>
							</div>
							<div>
								<dt className='text-md font-medium text-gray-500 dark:text-gray-300'>
									ວັນເກີດ
								</dt>
								<dd className='text-md mt-1 text-gray-900 dark:text-gray-200'>
									{userInfo?.birthday || 'N/A'}
								</dd>
							</div>
							<div>
								<dt className='text-md font-medium text-gray-500 dark:text-gray-300'>
									ເພດ
								</dt>
								<dd className='text-md mt-1 text-gray-900 dark:text-gray-200'>
									{userInfo?.genderLa || 'N/A'}
								</dd>
							</div>
							<div>
								<dt className='text-md font-medium text-gray-500 dark:text-gray-300'>
									ທີ່ຢູ່
								</dt>
								<dd className='text-md mt-1 text-gray-900 dark:text-gray-200'>
									{userInfo?.addresses?.length > 0
										? userInfo.addresses.map((address: any, index: any) => (
												<div key={index}>
													<p>
														{address.village || 'N/A'},{' '}
														{address.city || 'N/A'}, ເເຂວງ{' '}
														{address.province || 'N/A'}
													</p>
												</div>
											))
										: 'N/A'}
								</dd>
							</div>
							<div>
								<dt className='text-md font-medium text-gray-500 dark:text-gray-300'>
									ວັນທີລົງທະບຽນ
								</dt>
								<dd className='text-md mt-1 text-gray-900 dark:text-gray-200'>
									{userInfo?.requestKycDate || 'N/A'}
								</dd>
							</div>
							<div>
								<dt className='text-md font-medium text-gray-500 dark:text-gray-300'>
									ອີເມວ
								</dt>
								<dd className='text-md mt-1 text-gray-900 dark:text-gray-200'>
									{userInfo?.customer?.email || 'N/A'}
								</dd>
							</div>

							{/* Locked Status */}
							<div>
								<dt className='text-md font-medium text-gray-500 dark:text-gray-300'>
									ສະຖານະ
								</dt>
								<dd className='text-md mt-1 flex items-center gap-3 pt-2 text-gray-900 dark:text-gray-200'>
									{/* Locked Status */}
									<Chip
										size='lg'
										color={isUnlocked ? 'primary' : 'danger'}
										startContent={
											isUnlocked ? (
												<FaUnlock size={14} />
											) : (
												<FaLock size={14} />
											)
										}
										variant='bordered'>
										{isUnlocked ? 'Unlocked' : 'Locked'}
									</Chip>
									{/* Enabled Status */}
									<Chip
										size='lg'
										color={userInfo?.customer?.vfDoc ? 'primary' : 'warning'}
										startContent={
											userInfo?.customer?.vfDoc ? (
												<FaCheckCircle size={14} />
											) : (
												<FaTimesCircle size={14} />
											)
										}
										variant='bordered'>
										{userInfo?.customer?.vfDoc
											? 'ອະນຸມັດເເລ້ວ'
											: 'ລໍຖ້າອະນຸມັດ'}
									</Chip>
								</dd>
							</div>
							<div>
								{userInfo?.customer?.vfDoc && (
									<>
										<dt className='text-md font-medium text-gray-500 dark:text-gray-300'>
											ອະນຸມັດຜ່ານ
										</dt>
										<dd className='text-md mt-1 flex items-center gap-3 text-gray-900 dark:text-gray-200'>
											<img
												className='w-12'
												src={isMephom ? meephomLogo : mspLogo}
												alt=''
											/>
											<Chip size='lg' variant='faded' color='primary'>
												{isMephom ? 'APB Meporm' : 'MSP'}
											</Chip>
										</dd>
									</>
								)}
							</div>
							{/* Ping Effect for vfDoc */}
							<div className='absolute right-4 top-[-10px] flex flex-col space-y-2'>
								<div className='relative inline-flex'>
									<span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-50 dark:bg-primary-600'></span>
									<span
										className={`text-md inline-flex items-center rounded-full px-4 py-1.5 font-medium text-white ${
											userInfo?.customer?.enabled
												? 'bg-teal-500'
												: 'bg-yellow-500'
										}`}>
										ສະຖານະ:{' '}
										{userInfo?.customer?.enabled ? 'Active' : 'Inactive'}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CustomerInfo;
