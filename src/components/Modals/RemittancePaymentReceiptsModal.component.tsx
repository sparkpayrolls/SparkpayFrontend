import React from 'react';
import NiceModal from '@ebay/nice-modal-react';
import { ModalLayout } from './ModalLayout.component';
import { Button } from '../Button/Button.component';
import { FileStorageSVG } from '../svg';

// Helper function to decode URL encodings and clean up filenames
const decodeFilename = (url: string): string => {
  try {
    // Extract filename from URL
    const filename = url.split('/').pop() || 'receipt';
    // Decode URL encodings like %20 -> space, %2F -> /, etc.
    const decoded = decodeURIComponent(filename);
    // Remove any remaining URL parameters or query strings
    return decoded.split('?')[0].split('#')[0];
  } catch (error) {
    // Fallback if decoding fails
    return url.split('/').pop() || 'receipt';
  }
};

type RemittancePaymentReceiptsModalProps = {
  receipts: string[];
};

export const RemittancePaymentReceiptsModal = NiceModal.create(
  (props: RemittancePaymentReceiptsModalProps) => {
    const { receipts } = props;

    const handleView = (url: string) => () => {
      window.open(url, '_blank');
    };

    const handleDownload = (url: string) => () => {
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      // Use decoded filename for better UX
      const filename = decodeFilename(url);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    return (
      <ModalLayout title="Remittance Payment Receipts">
        {() => (
          <div className="p-6">
            <div className="grid grid-cols-1 gap-4">
              {receipts.map((url, index) => (
                <ReceiptCard
                  key={`${url}-${index}`}
                  url={url}
                  onView={handleView(url)}
                  onDownload={handleDownload(url)}
                />
              ))}
            </div>
          </div>
        )}
      </ModalLayout>
    );
  },
);

// Receipt Card Component
interface ReceiptCardProps {
  url: string;
  onView: () => void;
  onDownload: () => void;
}

const ReceiptCard: React.FC<ReceiptCardProps> = (props) => {
  const { url, onView, onDownload } = props;
  // Determine if it's an image based on file extension
  const fileExtension = url.split('.').pop()?.toLowerCase();
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(
    fileExtension || '',
  );
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.style.display = 'none';
    target.nextElementSibling?.classList.remove('hidden');
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      {/* Preview Section */}
      <div className="h-48 bg-gray-50 flex items-center justify-center relative overflow-hidden">
        {isImage ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={decodeFilename(url)}
              className="w-full h-full object-cover"
              onError={handleImageError}
            />

            <div className="hidden absolute inset-0 flex items-center justify-center">
              <FileStorageSVG />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400">
            <FileStorageSVG />
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        <h3
          className="font-medium text-gray-900 text-sm mb-2"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {decodeFilename(url)}
        </h3>

        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span className="flex items-center">
            <svg
              className="w-3 h-3 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
            {fileExtension?.toUpperCase() || 'FILE'}
          </span>
          <span className="text-xs text-gray-400">
            {isImage ? 'Image' : 'Document'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button
            size="small"
            onClick={onView}
            className="flex-1 flex items-center justify-center"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path
                fillRule="evenodd"
                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                clipRule="evenodd"
              />
            </svg>
            View
          </Button>

          <Button
            size="small"
            onClick={onDownload}
            className="flex-1 flex items-center justify-center"
            primary
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Download
          </Button>
        </div>
      </div>
    </div>
  );
};
