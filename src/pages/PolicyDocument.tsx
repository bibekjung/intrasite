'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useToast } from '@/components/ui/toaster';
import { Shield, AlertTriangle, FileText, ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { discoverPdfs } from '@/utils/pdfList';
import { useNavigate } from 'react-router-dom';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const SECURITY_STYLE_ID = 'policy-document-security-styles';
const DEFAULT_PDF = '/SCM Technical Specifications v1.0.0.pdf';
const DEVTOOLS_THRESHOLD = 160;
const CONSOLE_CHECK_INTERVAL = 1000;
const MOUSE_LEAVE_DELAY = 500;
const CONTENT_SHOW_DELAY = 300;
const SCREENSHOT_PROTECTION_DURATION = 100;
const SCREENSHOT_HIDE_DURATION = 1000;
const OVERLAY_OPACITY = 0.02;
const OVERLAY_INIT_DELAY = 100;
const OVERLAY_RETRY_DELAY = 50;

const Z_INDEX = {
  OVERLAY_1: 999997,
  OVERLAY_2: 999996,
  PSEUDO_BEFORE: 999999,
  PSEUDO_AFTER: 999998,
  INLINE_OVERLAY_1: 999995,
  INLINE_OVERLAY_2: 999994,
  BUTTON: 1000001,
  WARNING: 1000000,
} as const;

const BLOCKED_KEYS = [
  'c',
  'C',
  'a',
  'A',
  'v',
  'V',
  'x',
  'X',
  's',
  'S',
  'p',
  'P',
] as const;
const DEVTOOLS_KEYS = ['I', 'i', 'J', 'j', 'C', 'c'] as const;

const PolicyDocument: React.FC = () => {
  const [numPages, setNumPages] = useState<number>(0);
  const [isContentHidden, setIsContentHidden] = useState<boolean>(false);
  const [showGallery, setShowGallery] = useState<boolean>(true);
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
  const [pdfs, setPdfs] = useState<Awaited<ReturnType<typeof discoverPdfs>>>(
    [],
  );
  const [_isLoadingPdfs, setIsLoadingPdfs] = useState<boolean>(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const pdfsLoadedRef = useRef<boolean>(false);
  const styleRef = useRef<HTMLStyleElement | null>(null);
  const devToolsOpenRef = useRef<boolean>(false);
  const mouseLeaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const screenshotDetectedRef = useRef<boolean>(false);
  const navigate = useNavigate();

  const { toast } = useToast();

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const showWarning = useCallback(
    (message: string) => {
      toast({
        title: 'Copy Protection',
        description: message,
        variant: 'destructive',
      });
    },
    [toast],
  );

  useEffect(() => {
    if (pdfsLoadedRef.current) return;

    const loadPdfs = async () => {
      setIsLoadingPdfs(true);
      const foundPdfs = await discoverPdfs();
      setPdfs(foundPdfs);
      setIsLoadingPdfs(false);
      pdfsLoadedRef.current = true;
    };

    loadPdfs();
  }, []);

  const pdfPath = selectedPdf ? encodeURI(selectedPdf) : encodeURI(DEFAULT_PDF);

  const handleSelectPdf = (pdfPath: string) => {
    setSelectedPdf(pdfPath);
    setShowGallery(false);
  };

  const removeSecurityStyles = useCallback(() => {
    try {
      const securityStyle = document.getElementById(SECURITY_STYLE_ID);
      if (securityStyle?.parentNode?.contains(securityStyle)) {
        securityStyle.parentNode.removeChild(securityStyle);
      }
    } catch (_error) {
      return _error;
    }
  }, []);

  // const handleBackToGallery = () => {
  //   removeSecurityStyles();
  //   setShowGallery(true);
  //   setSelectedPdf(null);
  // };

  useEffect(() => {
    if (showGallery) return;

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      e.clipboardData?.setData('text/plain', '');
      showWarning('Copying content is not allowed.');
      return false;
    };

    const handleCut = (e: ClipboardEvent) => {
      e.preventDefault();
      e.clipboardData?.setData('text/plain', '');
      showWarning('Cutting content is not allowed.');
      return false;
    };

    const handleSelectStart = (e: Event) => {
      e.preventDefault();
      return false;
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      showWarning('Right-click is disabled on this document.');
      return false;
    };

    const handleDrag = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    const isBlockedKey = (key: string): boolean => {
      return BLOCKED_KEYS.includes(key as (typeof BLOCKED_KEYS)[number]);
    };

    const isDevToolsKey = (key: string): boolean => {
      return DEVTOOLS_KEYS.includes(key as (typeof DEVTOOLS_KEYS)[number]);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const isModifier = e.ctrlKey || e.metaKey;
      const key = e.key;

      if (isModifier && isBlockedKey(key)) {
        e.preventDefault();
        showWarning('This keyboard shortcut is disabled.');
        return false;
      }

      if (key === 'F12') {
        e.preventDefault();
        showWarning('Developer tools access is restricted.');
        return false;
      }

      if (isModifier && e.shiftKey && isDevToolsKey(key)) {
        e.preventDefault();
        showWarning('Developer tools access is restricted.');
        return false;
      }

      if (isModifier && (key === 'u' || key === 'U')) {
        e.preventDefault();
        showWarning('View source is disabled.');
        return false;
      }

      if (key === 'PrintScreen') {
        e.preventDefault();
        showWarning('Screenshots are not allowed.');
        return false;
      }

      if (
        e.shiftKey &&
        (key === 'S' || key === 's') &&
        !e.ctrlKey &&
        !e.altKey
      ) {
        setIsContentHidden(true);
        showWarning('Screenshot tools are not allowed on this page.');
        e.preventDefault();

        const handleKeyUp = (ev: KeyboardEvent) => {
          if (ev.key === 'Shift' || ev.key === 's' || ev.key === 'S') {
            setIsContentHidden(false);
            window.removeEventListener('keyup', handleKeyUp);
          }
        };

        window.addEventListener('keyup', handleKeyUp);
        return false;
      }
    };

    const detectDevTools = () => {
      const widthThreshold =
        window.outerWidth - window.innerWidth > DEVTOOLS_THRESHOLD;
      const heightThreshold =
        window.outerHeight - window.innerHeight > DEVTOOLS_THRESHOLD;

      if (widthThreshold || heightThreshold) {
        if (!devToolsOpenRef.current) {
          devToolsOpenRef.current = true;
          showWarning(
            'Developer tools detected. Please close them to view the document.',
          );
        }
      } else {
        devToolsOpenRef.current = false;
      }
    };

    const devtools = { open: false };
    const element = new Image();
    Object.defineProperty(element, 'id', {
      get: function () {
        devtools.open = true;
        if (!devToolsOpenRef.current) {
          devToolsOpenRef.current = true;
          showWarning(
            'Developer tools detected. Please close them to view the document.',
          );
        }
      },
    });

    const consoleCheck = setInterval(() => {
      devtools.open = false;
      if (devtools.open && !devToolsOpenRef.current) {
        devToolsOpenRef.current = true;
        showWarning(
          'Developer tools detected. Please close them to view the document.',
        );
      }
    }, CONSOLE_CHECK_INTERVAL);

    const resizeObserver = new ResizeObserver(detectDevTools);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    document.addEventListener('copy', handleCopy);
    document.addEventListener('cut', handleCut);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('dragstart', handleDrag);
    document.addEventListener('drag', handleDrag);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('cut', handleCut);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('dragstart', handleDrag);
      document.removeEventListener('drag', handleDrag);
      document.removeEventListener('keydown', handleKeyDown);
      clearInterval(consoleCheck);
      resizeObserver.disconnect();
    };
  }, [showWarning, showGallery]);

  useEffect(() => {
    if (showGallery) {
      removeSecurityStyles();
    }
  }, [showGallery, removeSecurityStyles]);

  useEffect(() => {
    if (showGallery) return;

    const securityStyles = `
      .policy-document-container {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
        -webkit-tap-highlight-color: transparent !important;
      }
      .policy-document-container canvas,
      .policy-document-container .react-pdf__Page {
        pointer-events: auto !important;
        cursor: pointer;
      }
      .policy-document-container img {
        -webkit-user-drag: none !important;
        -khtml-user-drag: none !important;
        -moz-user-drag: none !important;
        -o-user-drag: none !important;
        user-drag: none !important;
        pointer-events: auto !important;
      }
      .screenshot-protection-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 1);
        mix-blend-mode: multiply;
        pointer-events: none !important;
        z-index: ${Z_INDEX.OVERLAY_1};
        opacity: ${OVERLAY_OPACITY};
        touch-action: none;
      }
      .screenshot-protection-overlay-2 {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 1);
        mix-blend-mode: screen;
        pointer-events: none !important;
        z-index: ${Z_INDEX.OVERLAY_2};
        opacity: ${OVERLAY_OPACITY};
        touch-action: none;
      }
      .policy-document-container::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 1);
        mix-blend-mode: multiply;
        pointer-events: none;
        z-index: ${Z_INDEX.PSEUDO_BEFORE};
        opacity: 0;
      }
      .policy-document-container::after {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 1);
        mix-blend-mode: screen;
        pointer-events: none;
        z-index: ${Z_INDEX.PSEUDO_AFTER};
        opacity: 0;
      }
      @media print {
        .policy-document-container,
        .policy-document-container * {
          display: none !important;
        }
      }
    `;

    const style = document.createElement('style');
    style.id = SECURITY_STYLE_ID;
    styleRef.current = style;
    style.textContent = securityStyles;
    document.head.appendChild(style);

    const showScreenshotProtection = () => {
      if (screenshotDetectedRef.current) return;
      screenshotDetectedRef.current = true;

      const overlays = document.querySelectorAll(
        '.screenshot-protection-overlay, .screenshot-protection-overlay-2',
      );
      overlays.forEach((overlay) => {
        (overlay as HTMLElement).style.opacity = '1';
      });

      setTimeout(() => {
        overlays.forEach((overlay) => {
          (overlay as HTMLElement).style.opacity = String(OVERLAY_OPACITY);
        });
        screenshotDetectedRef.current = false;
      }, SCREENSHOT_PROTECTION_DURATION);
    };

    const hideContent = () => {
      setIsContentHidden(true);
      showScreenshotProtection();
    };

    const showContent = () => {
      setTimeout(() => {
        setIsContentHidden(false);
      }, CONTENT_SHOW_DELAY);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        hideContent();
      } else {
        showContent();
      }
    };

    const handleBlur = () => hideContent();
    const handleFocus = () => showContent();

    const handleMouseLeave = () => {
      if (mouseLeaveTimeoutRef.current) {
        clearTimeout(mouseLeaveTimeoutRef.current);
      }
      mouseLeaveTimeoutRef.current = setTimeout(() => {
        if (document.hidden || !document.hasFocus()) {
          setIsContentHidden(true);
          setTimeout(() => {
            setIsContentHidden(false);
          }, 200);
        }
      }, MOUSE_LEAVE_DELAY);
    };

    const handleMouseEnter = () => {
      if (mouseLeaveTimeoutRef.current) {
        clearTimeout(mouseLeaveTimeoutRef.current);
        mouseLeaveTimeoutRef.current = null;
      }
    };

    const isScreenshotKey = (e: KeyboardEvent): boolean => {
      const isWinShiftS =
        (e.key === 'S' || e.key === 's') &&
        e.shiftKey &&
        (e.metaKey ||
          (navigator.platform.includes('Win') && !e.ctrlKey && !e.altKey));
      const isPrintScreen = e.key === 'PrintScreen';
      const isF12 = e.key === 'F12';
      const isCtrlShiftS =
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        (e.key === 'S' || e.key === 's');
      return isWinShiftS || isPrintScreen || isF12 || isCtrlShiftS;
    };

    const handleScreenshotKeys = (e: KeyboardEvent) => {
      if (isScreenshotKey(e)) {
        e.preventDefault();
        e.stopPropagation();
        setIsContentHidden(true);
        showWarning('Screenshot tools are not allowed on this page.');
        setTimeout(() => {
          setIsContentHidden(false);
        }, SCREENSHOT_HIDE_DURATION);
        return false;
      }
    };

    const handlePageUnload = () => {
      showScreenshotProtection();
      setIsContentHidden(true);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('keydown', handleScreenshotKeys);
    window.addEventListener('beforeunload', handlePageUnload);
    window.addEventListener('pagehide', handlePageUnload);
    window.addEventListener('unload', handlePageUnload);

    const initOverlays = () => {
      const overlays = document.querySelectorAll(
        '.screenshot-protection-overlay, .screenshot-protection-overlay-2',
      );
      if (overlays.length === 0) {
        setTimeout(initOverlays, OVERLAY_RETRY_DELAY);
        return;
      }
      overlays.forEach((overlay) => {
        (overlay as HTMLElement).style.opacity = String(OVERLAY_OPACITY);
      });
    };

    setTimeout(initOverlays, OVERLAY_INIT_DELAY);

    return () => {
      requestAnimationFrame(() => {
        try {
          const existingStyle = document.getElementById(SECURITY_STYLE_ID);
          if (existingStyle?.parentNode?.contains(existingStyle)) {
            existingStyle.parentNode.removeChild(existingStyle);
          }
          styleRef.current = null;
        } catch (error) {
          return error;
        }
      });

      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('keydown', handleScreenshotKeys);
      window.removeEventListener('beforeunload', handlePageUnload);
      window.removeEventListener('pagehide', handlePageUnload);
      window.removeEventListener('unload', handlePageUnload);

      if (mouseLeaveTimeoutRef.current) {
        clearTimeout(mouseLeaveTimeoutRef.current);
      }
    };
  }, [showWarning, showGallery]);

  if (showGallery) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">
            Policy Documents
          </h2>

          {pdfs.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <p className="text-gray-600 text-lg">No documents found</p>
              <p className="text-gray-500 text-sm mt-2">
                Add PDFs to the public folder and update src/utils/pdfList.ts
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {pdfs.map((pdf) => (
                <Card
                  key={pdf.path}
                  className="p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 bg-white"
                  onClick={() => handleSelectPdf(pdf.path)}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-red-50 rounded-lg p-4 mb-4">
                      <FileText className="h-12 w-12 text-red-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {pdf.displayName}
                    </h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectPdf(pdf.path);
                      }}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm w-full"
                    >
                      View Document
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="screenshot-protection-overlay" />
      <div className="screenshot-protection-overlay-2" />

      <div
        ref={containerRef}
        className="policy-document-container relative"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          minHeight: '100vh',
          backgroundColor: '#f5f5f5',
          padding: '20px',
          position: 'relative',
        }}
      >
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-md hover:bg-gray-50 transition pointer-events-auto"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>

        <div
          className="absolute inset-0"
          style={{
            background: 'rgba(0, 0, 0, 1)',
            mixBlendMode: 'multiply',
            zIndex: Z_INDEX.INLINE_OVERLAY_1,
            opacity: OVERLAY_OPACITY,
            pointerEvents: 'none',
            touchAction: 'none',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'rgba(0, 0, 0, 1)',
            mixBlendMode: 'screen',
            zIndex: Z_INDEX.INLINE_OVERLAY_2,
            opacity: OVERLAY_OPACITY,
            pointerEvents: 'none',
            touchAction: 'none',
          }}
        />

        {isContentHidden ? (
          <div
            className="relative z-0 flex items-center justify-center"
            style={{
              position: 'relative',
              minHeight: '80vh',
              width: '100%',
              backgroundColor: '#f5f5f5',
            }}
          >
            <div className="text-center p-8">
              <Shield className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500 text-lg font-semibold">
                Content Protected
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Out navigations are not allowed
              </p>
            </div>
          </div>
        ) : (
          <div
            className="relative z-0"
            style={{
              position: 'relative',
              filter: 'brightness(1) contrast(1)',
            }}
          >
            <Document
              file={pdfPath}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={<p style={{ color: '#666' }}>Loading document...</p>}
              error={
                <p style={{ color: 'red' }}>
                  Failed to load PDF. Make sure the file exists in the{' '}
                  <b>public</b> folder.
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
        )}

        <div
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 flex items-center gap-2 text-yellow-800 dark:text-yellow-200 text-xs shadow-lg pointer-events-none z-20"
          style={{ maxWidth: '90%', zIndex: Z_INDEX.WARNING }}
        >
          <AlertTriangle className="h-4 w-4" />
          <span>
            Unauthorized copying, sharing, or distribution of this document is
            prohibited.
          </span>
        </div>
      </div>
    </>
  );
};

export default PolicyDocument;
