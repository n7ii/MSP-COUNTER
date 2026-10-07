export type ProgressKind = 'import' | 'confirm';

export interface ProgressMessage {
	percent: number;
	state: string;
	processed: number;
	total: number;
	message?: string;
}

interface RunWithProgressOptions<T> {
	kind: ProgressKind;
	progressId: string;
	post: () => Promise<T>;
	onProgress?: (progress: ProgressMessage) => void;
}

const CONNECT_TIMEOUT_MS = 10_000;
const FAILED_MESSAGE_WAIT_MS = 5_000;
const IDLE_AFTER_POST_MS = 30_000;
const GENERIC_FAILED_MESSAGE = 'ການດຳເນີນການລົ້ມເຫຼວ';

const resolveSocketBase = (): URL => {
	const base = import.meta.env.VITE_SETTING_WS_URL || import.meta.env.VITE_SETTING_BASE_URL || '';
	const url = new URL(base, window.location.origin);
	url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
	return url;
};

export const buildSocketUrl = (kind: ProgressKind, progressId: string): URL => {
	const url = resolveSocketBase();
	url.pathname = `${url.pathname.replace(/\/+$/, '')}/salary/${kind}/progress`;
	url.search = '';
	url.searchParams.set('progressId', progressId);
	return url;
};

const toNumber = (value: unknown): number => {
	const n = Number(value);
	return Number.isFinite(n) ? n : 0;
};

export const parseProgressMessage = (raw: unknown): ProgressMessage | null => {
	if (typeof raw !== 'string') return null;

	try {
		const data = JSON.parse(raw);
		if (!data || typeof data !== 'object') return null;

		const text = data.message ?? data.error ?? data.reason;

		return {
			percent: Math.min(100, Math.max(0, toNumber(data.percent))),
			state: String(data.state ?? '').toUpperCase(),
			processed: toNumber(data.processed),
			total: toNumber(data.total),
			message: typeof text === 'string' && text.trim() ? text : undefined,
		};
	} catch {
		return null;
	}
};

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const toError = (e: unknown) => (e instanceof Error ? e : new Error(String(e)));

const openSocket = (socket: WebSocket, host: string) =>
	new Promise<void>((resolve, reject) => {
		const timer = setTimeout(() => {
			reject(new Error(`ເຊື່ອມຕໍ່ Socket ໝົດເວລາ (${host})`));
		}, CONNECT_TIMEOUT_MS);

		socket.addEventListener(
			'open',
			() => {
				clearTimeout(timer);
				resolve();
			},
			{ once: true },
		);
		socket.addEventListener(
			'error',
			() => {
				clearTimeout(timer);
				reject(new Error(`ເຊື່ອມຕໍ່ Socket ບໍ່ສຳເລັດ (${host})`));
			},
			{ once: true },
		);
	});

type PostOutcome<T> =
	| { kind: 'post'; ok: true; value: T }
	| { kind: 'post'; ok: false; error: unknown };
type FailedOutcome = { kind: 'failed'; message?: string };

/**
 * Opens the progress socket, waits until it is connected, and only then runs
 * the POST. Progress messages are forwarded to `onProgress` while the POST runs.
 */
export const runWithProgress = async <T>({
	kind,
	progressId,
	post,
	onProgress,
}: RunWithProgressOptions<T>): Promise<T> => {
	const url = buildSocketUrl(kind, progressId);
	const socket = new WebSocket(url.toString());

	const state = {
		done: false,
		closed: false,
		failed: null as FailedOutcome | null,
		lastActivity: 0,
	};
	const listeners = new Set<() => void>();
	const notify = () => [...listeners].forEach((listener) => listener());

	let resolveFailed: (outcome: FailedOutcome) => void = () => undefined;
	const failedSignal = new Promise<FailedOutcome>((resolve) => {
		resolveFailed = resolve;
	});

	const waitUntil = (predicate: () => boolean, timeoutMs?: number) =>
		new Promise<boolean>((resolve) => {
			if (predicate()) {
				resolve(true);
				return;
			}

			let timer: ReturnType<typeof setTimeout> | undefined;
			const finish = (ok: boolean) => {
				if (timer) clearTimeout(timer);
				listeners.delete(listener);
				resolve(ok);
			};
			const listener = () => {
				if (predicate()) finish(true);
			};

			if (timeoutMs !== undefined) timer = setTimeout(() => finish(false), timeoutMs);
			listeners.add(listener);
		});

	socket.onmessage = (event) => {
		const progress = parseProgressMessage(event.data);
		if (!progress) return;

		state.lastActivity = Date.now();
		onProgress?.(progress);

		if (progress.state === 'DONE') {
			state.done = true;
		} else if (progress.state === 'FAILED') {
			state.failed = { kind: 'failed', message: progress.message };
			resolveFailed(state.failed);
		}
		notify();
	};
	socket.onclose = () => {
		state.closed = true;
		notify();
	};

	try {
		await openSocket(socket, url.host);

		const postOutcome: Promise<PostOutcome<T>> = post().then(
			(value) => ({ kind: 'post', ok: true, value }) as const,
			(error) => ({ kind: 'post', ok: false, error }) as const,
		);

		const first = await Promise.race([postOutcome, failedSignal]);

		if (first.kind === 'failed') {
			if (first.message) throw new Error(first.message);

			const late = await Promise.race([postOutcome, delay(FAILED_MESSAGE_WAIT_MS).then(() => null)]);
			if (late && !late.ok) throw toError(late.error);
			throw new Error(GENERIC_FAILED_MESSAGE);
		}

		if (!first.ok) throw toError(first.error);

		const finished = () => state.done || state.closed || state.failed !== null;
		while (!finished()) {
			const before = state.lastActivity;
			const ok = await waitUntil(finished, IDLE_AFTER_POST_MS);
			if (ok || state.lastActivity === before) break;
		}

		if (state.failed) throw new Error(state.failed.message || GENERIC_FAILED_MESSAGE);

		return first.value;
	} finally {
		socket.onmessage = null;
		socket.onclose = null;
		if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
			socket.close();
		}
	}
};
