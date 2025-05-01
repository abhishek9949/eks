import React from 'react';
import clsx from 'clsx';
import { CourseTagProps } from '@/types/card';

const CourseTag = ({
  tags,
  fontWeight = 'normal',
  fontSize = 'base',
  gap = '1',
  customClass,
}: CourseTagProps) => {
  return (
    <div className={`flex gap-${gap} flex-wrap`}>
      {tags?.map(
        (tag: string | { name: string; color: string }, index: number) => {
          const isObjectTag = typeof tag === 'object' && tag !== null;
          const tagName = isObjectTag ? tag.name : tag;
          return (
            <div
              key={`tags-${index}-${tagName}`}
              className={clsx(
                'text-center',
                customClass
              )}
              
            >
              <span className={`font-${fontWeight} text-${fontSize} text-primary`}>
                #{tagName}
              </span>
            </div>
          );
        }
      )}
    </div>
  );
};

export default CourseTag;
