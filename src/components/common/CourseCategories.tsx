import React from 'react';
import clsx from 'clsx';
import { CourseTagProps } from '@/types/card';
import { CustomTooltip } from './Tooltip';

const CourseCategories = ({
  tags,
  fontWeight = 'normal',
  fontSize = 'base',
  fontColor,
  gap = '1',
  customClass,
}: CourseTagProps) => {
  return (
    <div className={`flex gap-${gap} flex-nowrap`}>
      {tags?.map(
        (tag: string | { name: string; color: string }, index: number) => {
          const isObjectTag = typeof tag === 'object' && tag !== null;
          const tagName = isObjectTag ? tag.name : tag;
          const tagColor = isObjectTag ? tag.color : undefined;

          return (
            <div
              key={`tags-${index}-${tagName}`}
              className={clsx(
                'rounded px-2.5 border text-center whitespace-nowrap overflow-hidden text-ellipsis',
                customClass
              )}
              style={{
                borderColor: tagColor,
                color: fontColor ?? tagColor,
              }}
            >
              <CustomTooltip title={tagName}>
                <span className={`font-${fontWeight} text-${fontSize}`}>
                  {tagName}
                </span>
              </CustomTooltip>
            </div>
          );
        }
      )}
    </div>
  );
};

export default CourseCategories;
