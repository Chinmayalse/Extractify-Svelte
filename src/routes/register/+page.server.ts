import { fail, redirect } from '@sveltejs/kit';
import type { ClientResponseError, LocalAuthStore } from 'pocketbase';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    // Additional load logic if necessary
    return {};
};

export const actions: Actions = {
    register: async ({ locals, request }) => {
        const data = await request.formData();
        const email = data.get('email');
        const password = data.get('password');

        // Validate email and password
        if (!email || !password) {
            return fail(400, { emailRequired: email === null, passwordRequired: password === null });
        }

        // Set password confirmation
        data.set('passwordConfirm', password?.toString());

        try {
            // Create a new user
            await locals.pb.collection('users').create(data);
            // Authenticate the user immediately after registration
            await locals.pb.collection('users').authWithPassword(email.toString(), password.toString());
            // Optionally send a verification email
            await locals.pb.collection('users').requestVerification(email.toString());
        } catch (error) {
            const errorObj = error as ClientResponseError;
            return fail(500, { fail: true, message: errorObj.data.message });
        }

        // Redirect to dashboard after successful registration and login
        throw redirect(303, '/dashboard');
    },
};

