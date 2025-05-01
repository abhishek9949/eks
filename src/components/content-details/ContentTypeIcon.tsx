import React from "react";
import { HeadsetOutlined, SmartDisplayOutlined, TheatersOutlined, ArticleOutlined } from "@mui/icons-material";
import { ContentTypeNamesType } from "@/constants/contentTypets"

interface ContentTypeIconProps {
  contentType: ContentTypeNamesType;
}

export default function ContentTypeIcon({ contentType }: Readonly<ContentTypeIconProps>) {
  const icons: { [key in ContentTypeNamesType]: React.ReactNode } = {
    Workshop: <SmartDisplayOutlined className="text-black text-1.7" />,
    Video: <TheatersOutlined className="text-black text-1.7" />,
    Podcast: <HeadsetOutlined className="text-black text-1.7" />,
    Article: <ArticleOutlined className="text-black text-1.7" />,
  };

  return (
      <div className="flex items-center gap-1 rounded bg-white p-2 px-1.5 py-1 text-black">
        {icons[contentType]}
        {contentType}
    </div>
  );
}
