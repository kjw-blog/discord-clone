'use client';

import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

import { useModal } from '@/hooks/use-modal-store';

const DeleteServerModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const router = useRouter();

    const isModalOpen = isOpen && type === 'deleteServer';
    const { server } = data;

    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try {
            setIsLoading(true);

            await axios.delete(`/api/servers/${server?.id}`);

            onClose();
            router.refresh();
            router.push('/');
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
                        서버 삭제
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        정말 서버를 삭제하시겠습니까?
                        <br />
                        <span className="font-semibold text-indigo-500">
                            {server?.name}
                        </span>{' '}
                        서버는 영구적으로 삭제됩니다.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="bg-gray-100 px-6 py-4">
                    <div className="flex w-full items-center justify-between">
                        <Button
                            disabled={isLoading}
                            onClick={onClose}
                            variant="ghost"
                        >
                            취소
                        </Button>
                        <Button
                            disabled={isLoading}
                            variant="primary"
                            onClick={onClick}
                        >
                            삭제
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteServerModal;
