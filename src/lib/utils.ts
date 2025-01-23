import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { nanoid } from 'nanoid';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function createInviteToken(name: string, email: string, inviteId: string) {
	const data = `${name}|${email}|${inviteId}`;
	return btoa(data);
}

export function decodeInviteToken(token: string) {
	const data = atob(token);
	const [name, email, inviteId] = data.split('|');
	return { name, email, inviteId };
}

export function handleTypeSafeError(error: unknown, message: any, form: any) {
	const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
	return message(form, 'Unexpected error: ' + errorMessage, { status: 500 });
}

export function generateUserId() {
	return nanoid(16);
}
