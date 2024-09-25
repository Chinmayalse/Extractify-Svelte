import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, locals }) => {
    const { email } = await request.json();

    // Check if the email is provided
    if (!email) {
        return json({ message: 'Email is required' }, { status: 400 });
    }

    try {
        // Call PocketBase's requestPasswordReset method
        await locals.pb.collection('users').requestPasswordReset(email);

        // Respond with success
        return json({ success: true }, { status: 200 });
    } catch (error) {
        console.error(error); // Log the error for debugging
        return json({ message: 'Failed to send reset email' }, { status: 500 });
    }
};


