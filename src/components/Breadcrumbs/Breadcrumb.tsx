import { BreadcrumbProps } from "@/types/breadcrumb";
import Image from "next/image";
import Link from "next/link";

const Breadcrumb = ({ levels = [] }: BreadcrumbProps) => {
  return (
    <div className="mb-5">
      <nav>
        <ol className="flex flex-wrap items-center gap-3 sm:flex-row sm:items-center sm:justify-start">
          {levels.map((level, index) => (
            <li
              key={`breadcrumb-${index}-${level?.name}`}
              className="flex items-center gap-1 sm:gap-2"
            >
              {level.path ? (
                <Link
                  href={level.path}
                  className="flex items-center font-medium text-primary"
                >
                  {level.icon && (
                    <span className="mr-1 sm:mr-2">{level.icon}</span>
                  )}
                  <span className="text-gray-8">{level.name}</span>
                </Link>
              ) : (
                <span className="flex items-center font-medium text-dark dark:text-white">
                  {level.icon && (
                    <span className="mr-1 sm:mr-2">{level.icon}</span>
                  )}
                  <span>{level.name}</span>
                </span>
              )}
              {index < levels.length - 1 && (
                <span className="mx-1">
                  <Image
                    src="/svg/chevron-right.svg"
                    width={20}
                    height={20}
                    alt="right_icon"
                  />
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
