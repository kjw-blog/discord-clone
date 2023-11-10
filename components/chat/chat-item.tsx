'use client';

import { Member, Profile } from '@prisma/client';

import { UserAvatar } from '@/components/user-avatar';
import { ActionTooltip } from '@/components/action-tooltip';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

interface ChatItemProps {
    id: string;
    content: string;
    member: Member & {
        profile: Profile;
    };
    timestamp: string;
    fileUrl: string | null;
    deleted: boolean;
    currentMember: Member;
    isUpdated: boolean;
    socketUrl: string;
    socketQuery: Record<string, string>;
}

const roleIconMap = {
    GUEST: null,
    MODERATOR: <ShieldCheck className="ml-2 h-4 w-4 text-indigo-500" />,
    ADMIN: <ShieldAlert className="ml-2 h-4 w-4 text-rose-500" />,
};

export const ChatItem = ({
    content,
    currentMember,
    deleted,
    fileUrl,
    id,
    isUpdated,
    member,
    socketQuery,
    socketUrl,
    timestamp,
}: ChatItemProps) => {
    return (
        <div className="group relative flex w-full items-center p-4 transition hover:bg-black/5">
            <div className="group flex w-full items-start gap-x-2">
                <div className="cursor-pointer transition hover:drop-shadow-md">
                    <UserAvatar src={member.profile.imageUrl} />
                </div>
                <div className="flex w-full flex-col">
                    <div className="flex items-center gap-x-2">
                        <div className="flex items-center">
                            <p className="cursor-pointer text-sm font-semibold hover:underline">
                                {member.profile.name}
                            </p>
                            <ActionTooltip label={member.role}>
                                {roleIconMap[member.role]}
                            </ActionTooltip>
                        </div>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                            {timestamp}
                        </span>
                    </div>
                    {content}
                </div>
            </div>
        </div>
    );
};
