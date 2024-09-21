// import { json } from '@sveltejs/kit';
// import type { RequestHandler } from './$types';
// import PocketBase from 'pocketbase';
// import { env } from '$env/dynamic/private'

// export const POST: RequestHandler = async ({ request }) => {
//     const pb = new PocketBase(env.PB_URL);
//     const { user_id, user_message, bot_response } = await request.json();

//     try {
//         const record = await pb.collection('conversations').create({
//             user: user_id,
//             user_message,
//             bot_response,
//             timestamp: new Date().toISOString()
//         });


//         return json({ success: true, id: record.id });
//         console.log("hurray");
//     } catch (error) {
//         console.error('Error storing conversation:', error);
//         return json({ success: false, error: 'Failed to store conversation' }, { status: 500 });
//     }
// };