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
  const [isFileSizeError, setIsFileSizeError] = useState(false);
  const [isFileTypeError, setIsFileTypeError] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsFileSizeError(false);
    setIsFileTypeError(false);

    const files = e.target.files;
    const file = files?.[0];
    if (!files || !file) {
      return;
    }

    if (file.size > FILE_MAX_SIZE) {
      setIsFileSizeError(true);
      return;
    }

    if (!FILE_TYPES.includes(file.type)) {
      setIsFileTypeError(true);
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
      {isFileSizeError && <Paragraph className="m-0 text-status-danger-300">{t('error.file-size')}</Paragraph>}
      {isFileTypeError && <Paragraph className="m-0 text-status-danger-300">{t('error.file-type')}</Paragraph>}
      <div className="mt-4 flex items-center gap-4">
        <ProfilePicture size="xl" src={photoPreview} />
        <Button className="h-fit" variant="secondary" onClick={handleFileUploadClick}>
          Edit
        </Button>
      </div>
      <input ref={fileUploadInputRef} type="file" hidden onChange={handleFileChange} />
    </div>
  );
}
