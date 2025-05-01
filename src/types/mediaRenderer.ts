export interface FileUrls {
  fileUrl?: string;
  thumbnailUrl?: string;
}

export interface CustomAudioPlayerProps {
  contentId: string;
  fileUrls: FileUrls;
  isPreview: boolean;
  watchedDuration: number;
  fileDuration: number;
}

export interface CustomVideoPlayerProps {
  videoUrl: string;
  contentId: string;
  isPreview: boolean;
  watchedDuration: number;
  fileDuration: number;
}

export interface PdfViewerProps {
  fileUrl: string;
  className?: string;
  contentId: string;
  isPreview: boolean;
}

export interface ContentRendererProps {
  contentType: string;
  url: string;
  contentId: string;
  isPreview: boolean;
  watchedDuration: number;
  fileDuration: number;
}