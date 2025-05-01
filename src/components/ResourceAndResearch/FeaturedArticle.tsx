import CourseCategories from "@/components/common/CourseCategories";
import ImageComponent from "@/components/common/ImageComponent";
import React from "react";
import { FeaturedArticleProps } from "@/types/course";
import Link from "next/link";

const FeaturedArticle = ({ article }: FeaturedArticleProps) => {
  const constructDurationAndModuleObject = () => {
    const durationAndModule = [
      { name: article?.duration, color: "gray-3" },
      { name: article?.modules, color: "gray-3" },
    ];
    return durationAndModule;
  };

  return (
    <Link href="/content-details/1">
      <div
        className="h-2"
        style={{ backgroundColor: article?.courseColor }}
      ></div>
      <div className="grid grid-cols-12 gap-2 shadow-card">
        <div className="col-span-3">
          <ImageComponent
            course={article}
            height="22.7vh"
            imageCustomClass="!rounded-none"
            cardTypeBg="dark"
            isFeatured
          />
        </div>
        <div className="col-span-9 flex flex-col gap-2 p-2">
          <CourseCategories
            tags={article?.tags}
            fontSize="lg"
            fontWeight="medium"
            customClass="!py-1"
          />
          <p className="text-2xl font-medium text-black">{article?.title}</p>
          <p className="text-lg font-normal text-gray-4">
            {article?.description}
          </p>
          <CourseCategories
            tags={constructDurationAndModuleObject()}
            fontSize="lg"
            fontColor="gray-5"
            gap="2.5"
            customClass="!py-1"
          />
        </div>
      </div>
    </Link>
  );
};

export default FeaturedArticle;
