import { Hash } from 'lucide-react';

interface ChatWelcomeProps {
    type: 'channel' | 'conversation';
    name: string;
}

export const ChatWelcome = ({ type, name }: ChatWelcomeProps) => {
    return (
        <div className="mb-4 space-y-2 px-4">
            {type === 'channel' && (
                <div className="flex h-[75px] w-[75px] items-center justify-center rounded-full bg-zinc-500 dark:bg-zinc-700">
                    <Hash className="h-12 w-12 text-white" />
                </div>
            )}
            <p className="text-xl font-bold md:text-3xl">
                {type === 'channel' && '#'}
                {name}
                {type === 'channel' && '에 오신 것을 환영합니다'}
            </p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {type === 'channel'
                    ? `#${name} 채널 대화의 시작점입니다.`
                    : `${name}님과 대화의 시작점입니다.`}
            </p>
        </div>
    );
};
