'use client';

import { Member } from '@prisma/client';
import { ChatWelcome } from './chat-welcome';
import { useChatQuery } from '@/hooks/use-chat-query';
import { Loader2, ServerCrash } from 'lucide-react';

interface ChatMessagesProps {
    name: string;
    member: Member;
    chatId: string;
    apiUrl: string;
    socketUrl: string;
    socketQuery: Record<string, string>;
    paramKey: 'channelId' | 'conversationId';
    paramValue: string;
    type: 'channel' | 'conversation';
}

export const ChatMessages = ({
    apiUrl,
    chatId,
    member,
    name,
    paramKey,
    paramValue,
    socketQuery,
    socketUrl,
    type,
}: ChatMessagesProps) => {
    const queryKey = `chat:${chatId}`;

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
        useChatQuery({
            queryKey,
            apiUrl,
            paramKey,
            paramValue,
        });

    if (status === 'pending') {
        return (
            <div className="flex flex-1 flex-col items-center justify-center">
                <Loader2 className="my-4 h-7 w-7 animate-spin text-zinc-500" />
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    로딩 중입니다...
                </p>
            </div>
        );
    }
    if (status === 'error') {
        return (
            <div className="flex flex-1 flex-col items-center justify-center">
                <ServerCrash className="my-4 h-7 w-7 text-zinc-500" />
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    오류가 발생했습니다!
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-1 flex-col overflow-y-auto py-4">
            <div className="flex-1" />
            <ChatWelcome type={type} name={name} />
        </div>
    );
};
