import React from 'react';
import {
  ArticleOutlined,
  PrintOutlined,
  HeadsetOutlined,
  FindInPageOutlined,
  SmartDisplayOutlined,
  TheatersOutlined
} from '@mui/icons-material';
import { CardTypeProps } from '@/types/card';
import clsx from 'clsx';

const CardType = ({ course, cardTypeBg }: CardTypeProps) => {

  const getIconBasedOnCardType = (type: string) => {
    const iconObject: { [key: string]: JSX.Element } = {
      'article': <ArticleOutlined fontSize='small' />,
      'featured article': <ArticleOutlined fontSize='small' />,
      'printable resource': <PrintOutlined fontSize='small' />,
      'podcast': <HeadsetOutlined fontSize='small' />,
      'research': <FindInPageOutlined fontSize='small' />,
      'workshop': <SmartDisplayOutlined fontSize='small' />,
      'video': <TheatersOutlined fontSize='small' />
    }
    return iconObject[type]
  }

  return (
    <div className={clsx("flex flex-row rounded gap-1 px-1.5 items-center py-1 min-w-max",
      cardTypeBg === "light" ? 'bg-white text-black' : 'bg-gray-6 text-white')}
    >
      {getIconBasedOnCardType(course?.content_type?.toLowerCase())}
      <p className='lg:text-sm xl:text-base text-base'>{course?.content_type}</p>
    </div>
  );
}

export default CardType;