import saveAs from 'file-saver';
import { parseContentDispositionFilename } from '@/lib/utils';
export const saveAsBlob = async (response: Response, fallbackFileName: string) => {
  const filename =
    parseContentDispositionFilename(response.headers.get('Content-Disposition') ?? '') ?? fallbackFileName;
  saveAs(await response.blob(), filename);
};
