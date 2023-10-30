import { currentUser, redirectToSignIn } from '@clerk/nextjs';

import { db } from '@/lib/db';

export const initialProfile = async () => {
    const user = await currentUser();

    if (!user) {
        return redirectToSignIn();
    }

    const profile = await db.profile.findUnique({
        where: {
            userId: user.id,
        },
    });

    if (profile) {
        return profile;
    }

    let name = '';

    if (user.firstName && user.lastName) {
        name = `${user.firstName} ${user.lastName}`;
    } else if (user.firstName) {
        name = user.firstName;
    } else if (user.lastName) {
        name = user.lastName;
    }

    const newProfile = await db.profile.create({
        data: {
            userId: user.id,
            name,
            imageUrl: user.imageUrl,
            email: user.emailAddresses[0].emailAddress,
        },
    });

    return newProfile;
};
