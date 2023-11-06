'use client';

import qs from 'query-string';
import axios from 'axios';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useModal } from '@/hooks/use-modal-store';
import { ChannelType } from '@prisma/client';
import { useEffect } from 'react';

const formSchema = z.object({
    name: z
        .string()
        .min(1, {
            message: '채널 이름이 필요합니다.',
        })
        .refine((name) => name !== 'general', {
            message: "채널명은 'general'이 될 수 없습니다.",
        }),
    type: z.nativeEnum(ChannelType),
});

const typeTranslation = {
    TEXT: '텍스트',
    VIDEO: '비디오',
    AUDIO: '음성',
};

const EditChannelModal = () => {
    const { isOpen, onClose, type, data } = useModal();

    const router = useRouter();

    const isModalOpen = isOpen && type === 'editChannel';
    const { server, channel } = data;

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            type: channel?.type || ChannelType.TEXT,
        },
    });

    useEffect(() => {
        if (channel) {
            form.setValue('name', channel.name);
            form.setValue('type', channel.type);
        } else {
            form.setValue('type', ChannelType.TEXT);
        }
    }, [channel, form]);

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: `/api/channels/${channel?.id}`,
                query: {
                    serverId: server?.id,
                },
            });
            await axios.post(url, values);

            form.reset();
            router.refresh();
            onClose();
        } catch (error) {
            console.log(error);
        }
    };

    const handleClose = () => {
        form.reset();
        onClose();
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="overflow-hidden bg-white p-0 text-black">
                <DialogHeader className="px-6 pt-8">
                    <DialogTitle className="text-center text-2xl font-bold">
                        채널 수정하기
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        <div className="space-y-8 px-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-bold uppercase text-zinc-500 dark:text-secondary/70">
                                            채널 이름
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                autoComplete="off"
                                                disabled={isLoading}
                                                className="border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0"
                                                placeholder="채널명을 입력하세요"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>채널 유형</FormLabel>
                                        <Select
                                            disabled={isLoading}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="border-0 bg-zinc-300/50 capitalize text-black outline-none ring-offset-0 focus:ring-0 focus:ring-offset-0">
                                                    <SelectValue placeholder="채널 유형을 선택해 주세요." />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {Object.values(ChannelType).map(
                                                    (type) => (
                                                        <SelectItem
                                                            key={type}
                                                            value={type}
                                                            className="capitalize"
                                                        >
                                                            {
                                                                typeTranslation[
                                                                    type
                                                                ]
                                                            }
                                                        </SelectItem>
                                                    ),
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            <Button variant="primary" disabled={isLoading}>
                                저장하기
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default EditChannelModal;
