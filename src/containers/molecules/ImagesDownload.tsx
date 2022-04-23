import { memo, useState, VFC } from 'react';
import ky from 'ky';
import JSZip from 'jszip';
import { IconButton, Spinner, Tooltip } from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';

type Props = {
  imageUrls?: string[];
};

export const ImagesDownload: VFC<Props> = memo(({ imageUrls }) => {
  const [isLoading, setIsLoading] = useState(false);

  const download = async () => {
    if (imageUrls === undefined) return;
    setIsLoading(true);

    const imagePromises = imageUrls.map(async (imageSrc) => {
      const response = await ky(imageSrc);
      const blob = await response.blob();
      const fileName = imageSrc.slice(imageSrc.lastIndexOf('/') + 1);

      return { blob, fileName };
    });

    const images = await Promise.all(imagePromises);

    const zip = new JSZip();
    const folderName = 'download_images';
    const folder = zip.folder(folderName);

    images.forEach((image) => {
      if (image.blob && image.fileName) {
        folder?.file(image.fileName, image.blob);
      }
    });

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const zipUrl = URL.createObjectURL(zipBlob);

    const a = document.createElement('a');
    a.href = zipUrl;
    a.download = `${folderName}.zip`;

    a.click();
    a.remove();

    URL.revokeObjectURL(zipUrl);

    setIsLoading(false);
  };

  return (
    <Tooltip label="ダウンロード" bg="gray.100" color="gray.800" hasArrow>
      <IconButton
        onClick={download}
        aria-label="download"
        icon={isLoading ? <Spinner /> : <DownloadIcon boxSize={6} />}
        bgColor="white"
        size="md"
        disabled={imageUrls === undefined || isLoading}
      />
    </Tooltip>
  );
});
