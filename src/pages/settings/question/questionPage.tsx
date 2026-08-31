import { useState } from 'react';
import Subheader, {
	SubheaderLeft,
	SubheaderRight,
} from '@/components/layouts/Subheader/Subheader.tsx';
import FieldWrap from '@/components/form/FieldWrap.tsx';
import Icon from '@/components/icon/Icon.tsx';
import Input from '@/components/form/Input.tsx';
import Button from '@/components/ui/Button.tsx';
import Container from '@/components/layouts/Container/Container.tsx';
import Card, { CardBody, CardHeader, CardHeaderChild, CardTitle } from '@/components/ui/Card.tsx';
import TableTemplate, { TableCardFooterTemplate } from '@/templates/common/TableParts.template.tsx';
import PageWrapper from '@/components/layouts/PageWrapper/PageWrapper.tsx';
import { useGetQuestionQuery } from '@/pages/settings/redux/queries/questionApiSlice.ts';
import {
	useCreateQuestionMutation,
	useUpdateQuestionMutation,
} from '@/pages/settings/redux/queries/questionApiSlice.ts';
import ModalProvider from '@/components/ui/modal/modalProvider.tsx';
import toast from 'react-hot-toast';
import { AlertService } from '@/common/services/alert.service.ts';

import {
	createColumnHelper,
	getCoreRowModel,
	getPaginationRowModel,
	useReactTable,
} from '@tanstack/react-table';
import QuestionForm from '@/pages/settings/question/component/questionForm.tsx'; // Assume you have the QuestionForm components similar to FeeForm

const alert = new AlertService();

const QuestionPage = () => {
	const [globalFilter, setGlobalFilter] = useState('');
	const [pageIndex, setPageIndex] = useState(0);
	const [pageSize, setPageSize] = useState(10);

	const { data, isLoading } = useGetQuestionQuery({ page: pageIndex, size: pageSize });
	const [createQuestion] = useCreateQuestionMutation();
	const [updateQuestion] = useUpdateQuestionMutation();

	const [modalOpen, setModalOpen] = useState(false);
	const [currentQuestion, setCurrentQuestion] = useState<any | null>(null);

	console.log('currentQuestion', currentQuestion);
	const initial = currentQuestion?.questionDetailEntities?.map((q: any) => ({
		langCode: q.langCode,
		questionDetail: q.questionDetail,
	})) || [
		{
			langCode: 'lo',
			questionDetail: '', // Renamed from `question` to match your form
		},
	];

	const columnHelper = createColumnHelper<any>();
	const columns = [
		columnHelper.accessor('id', { header: 'ID', cell: (info) => info.getValue() }),
		columnHelper.accessor(
			(row) =>
				row.questionDetailEntities.find((q: any) => q.langCode === 'lo')?.questionDetail,
			{ header: 'Question (Lao)', cell: (info) => info.getValue() },
		),
		columnHelper.accessor(
			(row) =>
				row.questionDetailEntities.find((q: any) => q.langCode === 'en')?.questionDetail,
			{ header: 'Question (English)', cell: (info) => info.getValue() },
		),
		columnHelper.accessor('status', {
			header: 'Status',
			cell: (info) => (info.getValue() ? 'Active' : 'Inactive'),
		}),
		columnHelper.display({
			header: 'Actions',
			cell: (info) => (
				<div className='flex gap-2'>
					<Button
						onClick={() => openModalForEdit(info.row.original)}
						variant='solid'
						icon='HeroPencilSquare'>
						Edit
					</Button>
				</div>
			),
		}),
	];

	const openModalForCreate = () => {
		setCurrentQuestion(null);
		setModalOpen(true);
	};

	const openModalForEdit = (question: any) => {
		setCurrentQuestion(question);
		setModalOpen(true);
	};

	const handleFormSubmit = async (values: any) => {
		const updatedQuestions = values.questions.map((question: any) => {
			// Transform the question object to match the desired structure
			return {
				langCode: question.langCode,
				question: question.questionDetail, // Map `questionDetail` to `question`
			};
		});

		const updatePayload = {
			id: currentQuestion?.id, // The ID of the question to update
			questionData: {
				questions: updatedQuestions, // Use the transformed questions array
				status: values.status, // Keep the status field
			},
		};
		if (currentQuestion) {
			await updateQuestion(updatePayload)
				.unwrap()
				.then((res) => {
					if (res?.header.status === '01') {
						toast.success('Updated successfully!');
					} else {
						alert.error(res?.header.message || 'An error occurred');
					}
				});
		} else {
			const createPayload = {
				questions: updatedQuestions, // Only send questions array
			};

			await createQuestion(createPayload)
				.unwrap()
				.then((res) => {
					if (res?.header.status === '01') {
						toast.success('Question added successfully!');
					} else {
						alert.error(res?.header.message || 'An error occurred');
					}
				});
		}
		setModalOpen(false);
	};

	const table = useReactTable({
		data: data?.body?.content || [],
		columns,
		state: { globalFilter },
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		manualPagination: true,
		pageCount: data?.body?.totalPages || 1,
		initialState: {
			pagination: { pageIndex, pageSize },
		},
	});

	return (
		<PageWrapper name='Questions'>
			<ModalProvider
				isOpen={modalOpen}
				onOpenChange={() => setModalOpen(false)}
				title={currentQuestion ? 'Edit Question' : 'New Question'}
				size='2xl'>
				<QuestionForm
					initialValues={initial}
					onSubmit={handleFormSubmit}
					onCancel={() => setModalOpen(false)}
				/>
			</ModalProvider>

			<Subheader>
				<SubheaderLeft>
					<FieldWrap
						firstSuffix={<Icon className='mx-2' icon='HeroMagnifyingGlass' />}
						lastSuffix={
							globalFilter && (
								<Icon
									icon='HeroXMark'
									color='red'
									className='mx-2 cursor-pointer'
									onClick={() => setGlobalFilter('')}
								/>
							)
						}>
						<Input
							id='search'
							name='search'
							placeholder='Search...'
							value={globalFilter}
							onChange={(e) => setGlobalFilter(e.target.value)}
						/>
					</FieldWrap>
				</SubheaderLeft>
				<SubheaderRight>
					<Button onClick={openModalForCreate} variant='solid' icon='HeroPlus'>
						New Question
					</Button>
				</SubheaderRight>
			</Subheader>

			<Container>
				<Card>
					<CardHeader>
						<CardHeaderChild>
							<CardTitle>ຈັດການຄໍາຖາມ</CardTitle>
						</CardHeaderChild>
					</CardHeader>
					<CardBody>
						{isLoading ? <p>Loading...</p> : <TableTemplate table={table} />}
					</CardBody>
					<TableCardFooterTemplate
						table={table}
						onPageChange={(newPage) => setPageIndex(newPage)}
						onPageSizeChange={(newSize) => setPageSize(newSize)}>
						<div className='pagination-info'>
							<span>{`Showing ${data?.body?.numberOfElements || 0} items out of ${data?.body?.totalElements || 0} total items`}</span>
						</div>
					</TableCardFooterTemplate>
				</Card>
			</Container>
		</PageWrapper>
	);
};

export default QuestionPage;
