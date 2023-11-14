'use client';

import { useState, useEffect } from 'react';
import { LiveKitRoom, VideoConference } from '@livekit/components-react';
import '@livekit/components-styles';
import { Channel } from '@prisma/client';
import { useUser } from '@clerk/nextjs';
import { Loader2 } from 'lucide-react';

interface MediaRoomProps {
    chatId: string;
    video: boolean;
    audio: boolean;
}

export const MediaRoom = ({ audio, chatId, video }: MediaRoomProps) => {
    const { user } = useUser();
    const [token, setToken] = useState('');

    useEffect(() => {
        let name = '';
        const email = user?.emailAddresses[0].emailAddress;

        if ((!user?.firstName && !user?.lastName) || !email) {
            return;
        }

        if (user?.firstName && user?.lastName) {
            name = `${user?.firstName} ${user?.lastName}`;
        } else if (user?.firstName) {
            name = user?.firstName;
        } else if (user?.lastName) {
            name = user?.lastName;
        } else {
            name = email.split('@')[0];
        }

        (async () => {
            try {
                const res = await fetch(
                    `/api/livekit?room=${chatId}&username=${name}`,
                );
                const data = await res.json();
                setToken(data.token);
            } catch (e) {
                console.log(e);
            }
        })();
    }, [user?.firstName, user?.lastName, chatId, user?.emailAddresses]);

    if (token === '') {
        return (
            <div className="flex flex-1 flex-col items-center justify-center">
                <Loader2 className="my-4 h-7 w-7 animate-spin text-zinc-500" />
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    로딩중...
                </p>
            </div>
        );
    }

    return (
        <LiveKitRoom
            data-lk-theme="default"
            serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
            token={token}
            connect={true}
            video={video}
            audio={audio}
        >
            <VideoConference />
        </LiveKitRoom>
    );
};
