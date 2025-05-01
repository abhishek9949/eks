"use client";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useViewContent } from "@/hooks/useViewContent";
import { PdfViewerProps } from "@/types/mediaRenderer";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PdfViewerNew: React.FC<PdfViewerProps> = ({
  fileUrl,
  className,
  contentId,
  isPreview,
}) => {
  const [pdfUrl, setPdfUrl] = useState("");
  const isViewCountUpdated = useRef(false); 
  const viewContent = useViewContent();
  const containerRef = useRef<HTMLDivElement>(null);
  const [pageWidth, setPageWidth] = useState<number>(0);
  const [scale, setScale] = useState(1.2);

  useEffect(() => {
    if (fileUrl) {
      setPdfUrl(`/api/proxy?url=${encodeURIComponent(fileUrl)}`);
    }
  }, [fileUrl]);

  const [numPages, setNumPages] = useState<number>();

  useEffect(() => {
    const updatePageSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        if (containerWidth < 600) {
          // Small screens: Fit width
          setPageWidth(containerWidth);
          setScale(1);
        } else {
          // Larger screens: Use scale
          setPageWidth(0);
          setScale(1.2);
        }
      }
    };

    updatePageSize();
    window.addEventListener("resize", updatePageSize);
    return () => window.removeEventListener("resize", updatePageSize);
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  const handleOnPdfScroll = () => {
    if (!isViewCountUpdated.current && !isPreview) {
      viewContent(contentId);
      isViewCountUpdated.current = true; 
    }
  };

  return (
    <div className={`${className}`} ref={containerRef}>
      <div
        className="h-120 w-full flex-1 overflow-auto p-2"
        onScroll={handleOnPdfScroll}
      >
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          className="flex flex-col items-center"
        >
          {Array.from(new Array(numPages), (_, index) => (
            <Page
              key={index}
              pageNumber={index + 1}
              className="mb-4 shadow-md"
              width={pageWidth || undefined} // Use width for small screens
              scale={pageWidth ? undefined : scale}
              renderMode="canvas"
            />
          ))}
        </Document>
      </div>
    </div>
  );
};

export default PdfViewerNew;
