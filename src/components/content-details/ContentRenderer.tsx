import React from "react";
import CustomVideoPlayer from "@/components/CustomVideoPlayer";
import PdfViewer from "@/components/content-details/PdfViewer";
import Image from "next/image";
import { ContentRendererProps } from "@/types/mediaRenderer";

export default function ContentRenderer({
  contentType,
  url,
  contentId,
  isPreview,
  watchedDuration,
  fileDuration
}: Readonly<ContentRendererProps>) {
  switch (contentType) {
    case "Article":
    case "Research":
    case "Printable Resource":
      return (
        <PdfViewer
          fileUrl={url}
          className="h-120 w-full overflow-hidden rounded-md border-2 border-gray-300 !p-0 "
          contentId={contentId}
          isPreview={isPreview}
        />
      );
    case "Video":
    case "Workshop":
      return (
        <CustomVideoPlayer
          videoUrl={url}
          contentId={contentId}
          isPreview={isPreview}
          watchedDuration={watchedDuration}
          fileDuration={fileDuration}
        />
      );
    case "Podcast":
      return (
        <Image
          src={url}
          alt="audio image"
          width={1039}
          height={445}
          quality={100}
          className="h-120 w-full bg-black object-contain"
        />
      );
    default:
      return (
        <div className="flex h-124 w-full items-center justify-center border-2 border-gray-300">
          <p>Unsupported content type</p>
        </div>
      );
  }
}
