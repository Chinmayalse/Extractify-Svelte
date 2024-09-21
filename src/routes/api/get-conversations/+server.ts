// import { json } from '@sveltejs/kit';
// import type { RequestHandler } from './$types';
// import { PB_URL } from '$env/static/public';
// import PocketBase from 'pocketbase';

// export const GET: RequestHandler = async ({ url }) => {
//     const pb = new PocketBase(PB_URL);
//     const user_id = url.searchParams.get('user_id');

//     if (!user_id) {
//         return json({ error: 'User ID is required' }, { status: 400 });
//     }

//     try {
//         const records = await pb.collection('conversations').getList(1, 50, {
//             filter: `user="${user_id}"`,
//             sort: '-created'
//         });

//         return json(records.items);
//     } catch (error) {
//         console.error('Error fetching conversations:', error);
//         return json({ error: 'Failed to fetch conversations' }, { status: 500 });
//     }
// };