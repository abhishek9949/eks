import React, { useRef, useEffect } from "react";

interface Props {
  children: React.ReactNode;
  exceptionRef?: React.RefObject<HTMLElement>;
  onClick: () => void;
  className?: string;
}

const ClickOutside: React.FC<Props> = ({
  children,
  exceptionRef,
  onClick,
  className,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickListener = (event: MouseEvent) => {
      const target = event.target as Node;

      // Check if click is outside the wrapper or exception
      const isClickedOutside =
        !wrapperRef.current?.contains(target) &&
        !(exceptionRef?.current?.contains(target) || exceptionRef?.current === target);

      if (isClickedOutside) {
        onClick();
      }
    };

    document.addEventListener("mousedown", handleClickListener);

    return () => {
      document.removeEventListener("mousedown", handleClickListener);
    };
  }, [exceptionRef, onClick]);

  return (
    <div ref={wrapperRef} className={className ?? ""}>
      {children}
    </div>
  );
};

export default ClickOutside;
