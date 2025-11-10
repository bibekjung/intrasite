declare module 'react-pdf' {
  import { CSSProperties, ReactNode, FC } from 'react';

  export interface DocumentProps {
    file: string | File | ArrayBuffer | Uint8Array;
    onLoadSuccess?: (pdf: { numPages: number }) => void;
    onLoadError?: (error: Error) => void;
    loading?: ReactNode;
    error?: ReactNode;
    children?: ReactNode;
    className?: string;
    style?: CSSProperties;
  }

  export interface PageProps {
    pageNumber: number;
    scale?: number;
    width?: number;
    height?: number;
    renderTextLayer?: boolean;
    renderAnnotationLayer?: boolean;
    className?: string;
    style?: CSSProperties;
  }

  export const Document: FC<DocumentProps>;
  export const Page: FC<PageProps>;
  export const pdfjs: {
    version: string;
    GlobalWorkerOptions: {
      workerSrc: string;
    };
  };
}
