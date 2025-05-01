import React, { useRef, useState, useEffect } from "react";
import PlayIcon from "@mui/icons-material/PlayArrow"; // Play icon
import PauseIcon from "@mui/icons-material/Pause"; // Pause icon
import Hls from "hls.js";
import { useViewContent } from "@/hooks/useViewContent";
import { useUpdateWatchDuration } from "@/hooks/useUpdateWatchDuration";
import { CustomVideoPlayerProps } from "@/types/mediaRenderer";

const CustomVideoPlayer: React.FC<CustomVideoPlayerProps> = ({
  videoUrl,
  contentId,
  isPreview,
  watchedDuration,
  fileDuration
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  let intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [showPlayPauseButton, setShowPlayPauseButton] = useState(true);
  const [hasVideoViewed, setHasVideoViewed] = useState(false);
  const viewContent = useViewContent();
  const updateWatchDuration = useUpdateWatchDuration();
  const lastWatchedTimeRef = useRef(0);

  const handleViewContent = () => {
    viewContent(contentId);
  };

  useEffect(() => {
    if (!hasVideoViewed && isPlaying && !isPreview) {
      handleViewContent();
      setHasVideoViewed(true);
    }
  }, [hasVideoViewed, isPlaying]);

  useEffect(() => {
    if (!videoUrl) return;

    const video = videoRef.current;

    if (video && Hls.isSupported()) {
      if (!hasVideoViewed && isPlaying && !isPreview) {
        handleViewContent();
        setHasVideoViewed(true);
      }
      const hls = new Hls();
      hls.loadSource(videoUrl); // Load the M3U8 video source
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log("HLS Manifest Loaded");
      });

      const handleTimeUpdate = () => {
        lastWatchedTimeRef.current = Math.min(video.currentTime, fileDuration);
      };
      video.addEventListener("timeupdate", handleTimeUpdate);
      
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        video.removeEventListener("timeupdate", handleTimeUpdate);
        if (!isPreview) updateWatchDuration(contentId, lastWatchedTimeRef.current, "video");
        hls.destroy(); // Cleanup when unmounting
      };
    } else if (video?.canPlayType("application/vnd.apple.mpegurl")) {
      // Safari supports M3U8 natively
      video.src = videoUrl;
    }
  }, [videoUrl]);
  
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleLoadedMetadata = () => {
        if (watchedDuration && watchedDuration < fileDuration) {
          video.currentTime = watchedDuration; // Start from last watched duration
        }
      };

      video.addEventListener("loadedmetadata", handleLoadedMetadata);
      return () => video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    }
  }, [watchedDuration]);

  const handleOnVideoPause = () => {
    setIsPlaying(false);
    if (!isPreview) updateWatchDuration(contentId, lastWatchedTimeRef.current, "video");
  }

  // Play/Pause Toggle
  const togglePlayPause = () => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      // onVideoStatusChange(isPlaying); // Call the callback function with the status
      setIsPlaying(!isPlaying);
    }
  };

  // Prevent right-click
  const preventRightClick = (e: React.MouseEvent) => e.preventDefault();

  const handleMouseEnter = () => {
    setShowPlayPauseButton(true);
  };

  const handleMouseLeave = () => {
    setShowPlayPauseButton(false);
  };

  return (
    <button
      className="relative flex w-full items-center justify-center overflow-hidden rounded-md border-2 border-gray-300 bg-black"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={videoUrl}
        className="h-124 w-full  rounded-md"
        controls
        onContextMenu={preventRightClick} // Prevent right-click
        disablePictureInPicture // Disable Picture-in-Picture
        controlsList="nodownload" // Remove download option
        onPause={handleOnVideoPause}
        onPlay={() => setIsPlaying(true)}
      >
        {/* Add a track for captions */}
        <track
          kind="captions"
          src="captions-file.vtt" // Path to the captions file (WebVTT format)
          srcLang="en"
          label="English"
          default
        />
      </video>

      {/* Play/Pause Button */}
      {showPlayPauseButton && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <button
            className="pointer-events-auto flex items-center justify-center rounded-full border-5 border-white  p-4 duration-300"
            onClick={togglePlayPause}
          >
            {isPlaying ? (
              <PauseIcon style={{ color: "white", fontSize: 36 }} />
            ) : (
              <PlayIcon style={{ color: "white", fontSize: 36 }} />
            )}
          </button>
        </div>
      )}
    </button>
  );
};
export default CustomVideoPlayer;
