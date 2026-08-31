import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import '@/assets/styles/_sweetAlert.scss';

const MySwal = withReactContent(Swal);

export class AlertService {
	confirmModal(text: string) {
		return MySwal.fire({
			title: 'ຢືນຢັນ',
			text,
			icon: 'question',
			showCancelButton: true,
			confirmButtonColor: '#2563EB',
			cancelButtonColor: '#EF4444',
			confirmButtonText: 'ຕົກລົງ',
			cancelButtonText: 'ຍົກເລີກ',
			allowOutsideClick: false,
			customClass: {
				container: 'sweetalert-container',
				popup: 'sweetalert-popup',
				// icon: 'sweetalert-icon',
				title: 'sweetalert-title',
				htmlContainer: 'sweetalert-text',
				confirmButton: 'sweetalert-buttons',
				cancelButton: 'sweetalert-buttons-danger',
			},
		});
	}

	confirmWithInputModal(titile: string, text: string) {
		return MySwal.fire({
			title: titile,
			input: 'textarea',
			text,
			showCancelButton: true,
			confirmButtonText: 'ຕົກລົງ',
			cancelButtonText: 'ຍົກເລີກ',
			allowOutsideClick: false,
			preConfirm: (value) => {
				if (!value) {
					Swal.showValidationMessage(
						'<i class="fa fa-info-circle"></i> ກະລຸນາປ້ອນຄໍາເຫັນ',
					);
				}

				return value;
			},
			customClass: {
				container: 'sweetalert-container',
				popup: 'sweetalert-popup',
				title: 'sweetalert-title',
				htmlContainer: 'sweetalert-text',
				confirmButton: 'sweetalert-buttons',
				cancelButton: 'sweetalert-buttons-danger',
			},
		});
	}

	async success(text: string, title?: string) {
		await MySwal.fire({
			icon: 'success',
			title: title ?? 'ສໍາເລັດ...',
			text,
			allowOutsideClick: false,
			customClass: {
				container: 'sweetalert-container',
				popup: 'sweetalert-popup',
				title: 'sweetalert-title',
				htmlContainer: 'sweetalert-text',
				confirmButton: 'sweetalert-buttons',
				closeButton: 'sweetalert-buttons',
			},
		});
	}

	async warning(text: string, title?: string) {
		await MySwal.fire({
			icon: 'warning',
			title: title ?? 'Oops...',
			text,
			allowOutsideClick: false,
			customClass: {
				container: 'sweetalert-container',
				popup: 'sweetalert-popup',
				title: 'sweetalert-title',
				htmlContainer: 'sweetalert-text',
				confirmButton: 'sweetalert-buttons',
			},
		});
	}

	async error(text: string, title?: string) {
		await MySwal.fire({
			icon: 'error',
			title: title ?? 'Oops...',
			text,
			allowOutsideClick: false,
			customClass: {
				container: 'sweetalert-container',
				popup: 'sweetalert-popup',
				title: 'sweetalert-title',
				htmlContainer: 'sweetalert-text',
				confirmButton: 'sweetalert-buttons',
			},
		});
	}
}
