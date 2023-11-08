'use client';

import { X } from 'lucide-react';
import Image from 'next/image';

import { UploadDropzone } from '@/lib/uploadthing';
import '@uploadthing/react/styles.css';

interface FileUploadProps {
    onChange: (url?: string) => void;
    value: string;
    endpoint: 'messageFile' | 'serverImage';
}

export const FileUpload = ({ onChange, value, endpoint }: FileUploadProps) => {
    const fileType = value?.split('.').pop();

    if (value && fileType !== 'pdf') {
        return (
            <div className="relative h-20 w-20">
                <Image
                    fill
                    src={value}
                    alt="Upload"
                    className="rounded-full bg-zinc-300"
                />
                <button
                    onClick={() => onChange('')}
                    className="absolute right-0 top-0 rounded-full bg-rose-500 p-1 text-white shadow-sm"
                    type="button"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        );
    }

    return (
        <UploadDropzone
            content={{
                label: '이미지를 선택하거나 드래그 해오세요.',
                allowedContent: '이미지 (4MB)',
                button: ({ ready }) => {
                    return '파일 업로드';
                },
            }}
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
                onChange(res?.[0].url);
            }}
            onUploadError={(error: Error) => {
                console.log(error);
            }}
        />
    );
};
