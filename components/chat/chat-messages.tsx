'use client';

import { Fragment } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Member, Message, Profile } from '@prisma/client';
import { Loader2, ServerCrash } from 'lucide-react';

import { useChatQuery } from '@/hooks/use-chat-query';
import { useChatSocket } from '@/hooks/use-chat-socket';

import { ChatWelcome } from './chat-welcome';
import { ChatItem } from './chat-item';

const DATE_FORMAT = 'yyyy MMM d , HH:mm';

type MessageWithMemberWithProfile = Message & {
    member: Member & {
        profile: Profile;
    };
};

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
    const addKey = `chat:${chatId}:messages`;
    const updateKey = `chat:${chatId}:messages:update`;

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
        useChatQuery({
            queryKey,
            apiUrl,
            paramKey,
            paramValue,
        });

    useChatSocket({
        queryKey,
        addKey,
        updateKey,
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
            <div className=" mt-auto flex flex-col-reverse">
                {data?.pages?.map((group, i) => (
                    <Fragment key={i}>
                        {group.items.map(
                            (message: MessageWithMemberWithProfile) => (
                                <ChatItem
                                    key={message.id}
                                    id={message.id}
                                    member={message.member}
                                    currentMember={member}
                                    content={message.content}
                                    fileUrl={message.fileUrl}
                                    deleted={message.deleted}
                                    timestamp={format(
                                        new Date(message.createdAt),
                                        DATE_FORMAT,
                                        { locale: ko },
                                    )}
                                    isUpdated={
                                        message.updatedAt !== message.createdAt
                                    }
                                    socketUrl={socketUrl}
                                    socketQuery={socketQuery}
                                />
                            ),
                        )}
                    </Fragment>
                ))}
            </div>
        </div>
    );
};
