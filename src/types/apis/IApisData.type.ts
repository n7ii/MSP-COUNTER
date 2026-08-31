export interface IAPISDataRoot {
	header: IHeaderAPIS;
	body: IAPISDataBody[];
}

export interface IHeaderAPIS {
	timestamp: string;
	code: string;
	message: string;
	status: string;
	traceId: string;
}

export interface IAPISDataBody {
	trn_id: string;
	status: string;
	bis_date: string;
	create_date: string;
	update_date?: string;
	fail_reason: any;
}
