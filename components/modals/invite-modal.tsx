'use client';

import { useState } from 'react';
import { Check, Copy, RefreshCw } from 'lucide-react';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { useModal } from '@/hooks/use-modal-store';
import { useOrigin } from '@/hooks/use-origin';
import axios from 'axios';

const InviteModal = () => {
    const { isOpen, onOpen, onClose, type, data } = useModal();
    const origin = useOrigin();

    const isModalOpen = isOpen && type === 'invite';
    const { server } = data;

    const [copied, setCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

    const onCopy = () => {
        navigator.clipboard.writeText(inviteUrl);
        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 1000);
    };

    const onNew = async () => {
        try {
            setIsLoading(true);

            const response = await axios.patch(
                `/api/servers/${server?.id}/invite-code`,
            );

            onOpen('invite', { server: response.data });
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="overflow-hidden bg-white p-0 text-black">
                <DialogHeader className="px-6 pt-8">
                    <DialogTitle className="text-center text-2xl font-bold">
                        친구 초대하기
                    </DialogTitle>
                </DialogHeader>
                <div className="p-6">
                    <Label className="text-xs font-bold uppercase text-zinc-500 dark:text-secondary/70">
                        서버 초대 링크
                    </Label>
                    <div className="mt-2 flex items-center gap-x-2">
                        <Input
                            disabled={isLoading}
                            className="border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0"
                            defaultValue={inviteUrl}
                        />
                        <Button
                            disabled={isLoading}
                            onClick={onCopy}
                            size="icon"
                        >
                            {copied ? (
                                <Check className="h-4 w-4" />
                            ) : (
                                <Copy className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                    <Button
                        onClick={onNew}
                        disabled={isLoading}
                        variant="link"
                        size="sm"
                        className="mt-4 text-xs text-zinc-500"
                    >
                        새 링크 생성하기
                        <RefreshCw className="ml-4 h-4 w-4" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default InviteModal;
