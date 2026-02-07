'use server';

import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';

export async function updateProfile(data: { name?: string, password?: string, oldPassword?: string }) {
    const session = await auth();
    if (!session || !session.user) throw new Error('Not authenticated');

    await dbConnect();
    const user = await User.findById(session.user.id);
    if (!user) throw new Error('User not found');

    if (data.name) user.name = data.name;
    if (data.password) {
        if (!data.oldPassword) throw new Error('Current password is required to set a new one');

        const isMatch = bcrypt.compareSync(data.oldPassword, user.password);
        if (!isMatch) throw new Error('Incorrect current password');

        user.password = bcrypt.hashSync(data.password, 10);
    }

    await user.save();
    revalidatePath('/profile');
    return { success: true };
}

export async function verifyDeletionPassword(password: string) {
    const session = await auth();
    if (!session || !session.user) return { success: false, error: 'Not authenticated' };

    await dbConnect();
    const user = await User.findById(session.user.id);
    if (!user) return { success: false, error: 'User not found' };

    // Social users might not have a password field set correctly for comparison 
    // depending on implementation, but for credentials users:
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) return { success: false, error: 'Incorrect password' };

    return { success: true };
}

export async function deleteOwnAccount() {
    const session = await auth();
    if (!session || !session.user) throw new Error('Not authenticated');

    await dbConnect();
    await User.findByIdAndDelete(session.user.id);

    // Deletion successful - note: signing out happens on client side 
    // after this action finishes to ensure clean redirect.
    return { success: true };
}
