"use client";
import { useUpdateWatchDuration } from "@/hooks/useUpdateWatchDuration";
import { useViewContent } from "@/hooks/useViewContent";
import { CustomAudioPlayerProps } from "@/types/mediaRenderer";
import React, { useEffect, useRef, useState } from "react";

const CustomAudioPlayer = ({
  contentId,
  fileUrls,
  isPreview,
  watchedDuration,
  fileDuration
}: CustomAudioPlayerProps) => {
  const [isAudioContentViewed, setIsAudioContentViewed] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const viewContent = useViewContent();
  const updateWatchDuration = useUpdateWatchDuration();
  const lastWatchedTimeRef = useRef(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      lastWatchedTimeRef.current = Math.min(audio.currentTime, fileDuration);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      if (!isPreview) updateWatchDuration(contentId, lastWatchedTimeRef.current, "audio");
    };
  }, [fileUrls?.fileUrl]);

  // start the audio from the previous watched duration
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio) {

      const loadAudio = () => {
        audio.load();
      };
    
      const handleLoadedMetadata = () => {
        if (watchedDuration && watchedDuration < fileDuration) {
          audio.currentTime = watchedDuration; // Start from last watched duration
        }
      };

      audio.addEventListener("loadedmetadata", handleLoadedMetadata);
      loadAudio();
      return () => {
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      };
    }
  }, [watchedDuration, fileUrls?.fileUrl]);

  const handlePlayAudio = () => {
    if (!isAudioContentViewed && !isPreview) {
      viewContent(contentId);
      setIsAudioContentViewed(true);
    }
  };

  const handlePauseAudio = () => {
    if (!isPreview) updateWatchDuration(contentId, lastWatchedTimeRef.current, "audio");
  }

  return (
    <audio
      key={fileUrls?.fileUrl}
      controls
      className="mt-3 w-full px-1"
      controlsList="nodownload"
      draggable="false"
      onContextMenu={(e) => e.preventDefault()}
      onPlay={handlePlayAudio}
      onPause={handlePauseAudio}
      ref={audioRef}
    >
      <source src={fileUrls.fileUrl} type="audio/mp3" />
      <track kind="captions" srcLang="en" label="English" default />
    </audio>
  );
};

export default CustomAudioPlayer;
