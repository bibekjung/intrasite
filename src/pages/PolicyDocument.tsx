'use client';

import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PolicyDocument: React.FC = () => {
  const [numPages, setNumPages] = useState<number>(0);

  // Called when PDF successfully loads
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  // File path — must exist in /public
  const pdfPath = '/SCM_Technical_Specifications.pdf';

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: '20px',
      }}
    >
      <Document
        file={pdfPath}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={<p style={{ color: '#666' }}>Loading document...</p>}
        error={
          <p style={{ color: 'red' }}>
            Failed to load PDF. Make sure the file exists in the <b>public</b>{' '}
            folder.
          </p>
        }
      >
        {Array.from(new Array(numPages), (_, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            scale={1.2}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        ))}
      </Document>
    </div>
  );
};

export default PolicyDocument;
