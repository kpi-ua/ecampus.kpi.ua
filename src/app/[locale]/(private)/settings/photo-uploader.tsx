'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ProfilePicture } from '@/components/ui/profile-picture';
import { Paragraph } from '@/components/typography/paragraph';
import { useTranslations } from 'next-intl';

const FILE_MAX_SIZE = 1024 * 1024; // 1 Mb
const FILE_TYPES = ['image/png', 'image/jpeg'];

interface PhotoUploaderProps {
  photoSrc: string;
  onFileUpload: (file: File) => void;
}

export function PhotoUploader({ photoSrc, onFileUpload }: PhotoUploaderProps) {
  const t = useTranslations('private.settings');

  const fileUploadInputRef = useRef<HTMLInputElement>(null);

  const [photoPreview, setPhotoPreview] = useState(photoSrc);

  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');

    const files = e.target.files;
    const file = files?.[0];
    if (!files || !file) {
      return;
    }

    if (!FILE_TYPES.includes(file.type)) {
      setError(t('error.file-type'));
      return;
    }

    if (file.size > FILE_MAX_SIZE) {
      setError(t('error.file-size'));
      return;
    }

    setPhotoPreview(URL.createObjectURL(file));
    onFileUpload(file);
  };

  const handleFileUploadClick = () => {
    fileUploadInputRef.current?.click();
  };

  return (
    <div className="flex flex-col">
      {error && <Paragraph className="text-status-danger-300 m-0">{error}</Paragraph>}
      <div className="mt-4 flex items-center gap-4">
        <ProfilePicture size="xl" src={photoPreview} />
        <Button className="h-fit" variant="secondary" onClick={handleFileUploadClick}>
          {t('button.edit')}
        </Button>
      </div>
      <input ref={fileUploadInputRef} accept={FILE_TYPES.join(', ')} type="file" hidden onChange={handleFileChange} />
    </div>
  );
}
