import PocketBase from 'pocketbase';

declare global {
	declare namespace App {
		interface Locals {
			pb: Pocketbase;
			user: any;
		}
		// interface PageData {}
		// interface Error {}
		// interface Platform {}
	}
	interface Chat {
		message: string;
		timestamp: string;
		session_id: string;

	}
}