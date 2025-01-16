import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function createInviteToken(name: string, email: string) {
	const data = `${name}|${email}`;
	return btoa(data);
}

export function decodeInviteToken(token: string) {
	const data = atob(token);
	const [name, email] = data.split('|');
	return { name, email };
}
