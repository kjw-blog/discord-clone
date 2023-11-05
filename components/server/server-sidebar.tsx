import { ChannelType, MemberRole } from '@prisma/client';
import { redirect } from 'next/navigation';
import { Hash, Video, Mic, ShieldCheck, ShieldAlert } from 'lucide-react';

import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { ServerHeader } from './server-header';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ServerSearch } from './server-search';

interface ServerSidebarProps {
    serverId: string;
}

const iconMap = {
    [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
    [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
    [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
};

const roleIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: (
        <ShieldCheck className="mr-2 h-4 w-4 text-indigo-500" />
    ),
    [MemberRole.ADMIN]: <ShieldAlert className="mr-2 h-4 w-4 text-rose-500" />,
};

export const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
    const profile = await currentProfile();

    if (!profile) {
        return redirect('/');
    }

    const server = await db.server.findUnique({
        where: {
            id: serverId,
        },
        include: {
            channels: {
                orderBy: {
                    createdAt: 'asc',
                },
            },
            members: {
                include: {
                    profile: true,
                },
                orderBy: {
                    role: 'asc',
                },
            },
        },
    });

    const textChannels = server?.channels.filter(
        (channel) => channel.type === ChannelType.TEXT,
    );
    const audioChannels = server?.channels.filter(
        (channel) => channel.type === ChannelType.AUDIO,
    );
    const videoChannels = server?.channels.filter(
        (channel) => channel.type === ChannelType.VIDEO,
    );

    const members = server?.members.filter(
        (member) => member.profileId !== profile.id,
    );

    if (!server) {
        return redirect('/');
    }

    const role = server.members.find(
        (member) => member.profileId === profile.id,
    )?.role;

    return (
        <div className="flex h-full w-full flex-col bg-[#F2F3F5] text-primary dark:bg-[#2B2D31]">
            <ServerHeader server={server} role={role} />
            <ScrollArea className="flex-1 px-3">
                <div className="mt-2">
                    <ServerSearch
                        data={[
                            {
                                label: '텍스트 채널',
                                type: 'channel',
                                data: textChannels?.map((channel) => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type],
                                })),
                            },
                            {
                                label: '음성 채널',
                                type: 'channel',
                                data: audioChannels?.map((channel) => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type],
                                })),
                            },
                            {
                                label: '비디오 채널',
                                type: 'channel',
                                data: videoChannels?.map((channel) => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type],
                                })),
                            },
                            {
                                label: '멤버',
                                type: 'member',
                                data: members?.map((member) => ({
                                    id: member.id,
                                    name: member.profile.name,
                                    icon: roleIconMap[member.role],
                                })),
                            },
                        ]}
                    />
                </div>
            </ScrollArea>
        </div>
    );
};
