"use client";
import clsx from "clsx";
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
} from "react";
import styles from "./draggable.module.scss";

// Define the type for the Draggable component's props
type DraggableProps = {
  rootClass?: string;
  children: React.ReactNode;
  onScrollChange: (isAtStart: boolean, isAtEnd: boolean) => void;
};

// Define the type for the forwarded ref
export type DraggableRef = {
  scroll: (direction: string) => void;
};

const Draggable = forwardRef<DraggableRef, DraggableProps>(
  ({ rootClass = "", children, onScrollChange }, ref) => {
    const ourRef = useRef<HTMLDivElement>(null);
  
    useImperativeHandle(ref, () => ({
      scroll: (direction: string) => {
        if (!ourRef.current) return;
    
        const slider = ourRef.current;
        const items = Array.from(slider.children) as HTMLElement[];
    
        if (!items.length) return;
    
        // Get the carousel width
        const carouselWidth = slider.offsetWidth;
    
        // Get first item width and compute the gap
        const firstItem = items[0];
        const firstItemWidth = firstItem.offsetWidth;
        const computedStyle = window.getComputedStyle(firstItem);
        const gap = parseFloat(computedStyle.marginRight); // Get the right margin as the gap
    
        // Calculate how many cards fit in the view
        const itemsPerView = Math.floor((carouselWidth + gap) / (firstItemWidth + gap));
    
        // Get the current scroll position
        const currentScroll = slider.scrollLeft;
    
        // Find the closest card
        let closestIndex = 0;
        let minDistance = Infinity;
    
        items.forEach((item, index) => {
          const itemLeftEdge = item.offsetLeft - slider.offsetLeft; // Adjust for container
          const distance = Math.abs(currentScroll - itemLeftEdge);
    
          if (distance < minDistance) {
            minDistance = distance;
            closestIndex = index;
          }
        });
    
        // Compute the new index
        let newIndex = direction === "right" ? closestIndex + itemsPerView : closestIndex - itemsPerView;
        newIndex = Math.max(0, Math.min(newIndex, items.length - itemsPerView)); // Ensure within bounds
    
        // Compute the new scroll position (considering gaps)
        const targetItem = items[newIndex];
        let scrollLeft = targetItem.offsetLeft - slider.offsetLeft;
    
        // Ensure perfect alignment when scrolling to the first card
        if (newIndex === 0) {
          scrollLeft = 0;
        }
    
        // Scroll to the computed position
        slider.scrollTo({ left: scrollLeft, behavior: "smooth" });
    
        // Check if it's at the start or end after scrolling
        setTimeout(() => {
          const isAtStart = slider.scrollLeft <= 1; // Allow small floating point errors
          const isAtEnd =
            slider.scrollLeft + slider.offsetWidth >= slider.scrollWidth - 1;
    
          onScrollChange(isAtStart, isAtEnd);
        }, 300); // Small delay to allow scroll animation
      },
    }));

    const handleScroll = () => {
      if (!ourRef.current) return;
      const slider = ourRef.current;
      const isAtStart = slider.scrollLeft === 0;
      const isAtEnd =
        slider.scrollLeft + slider.offsetWidth >= slider.scrollWidth - 1;
      onScrollChange(isAtStart, isAtEnd);
    };

    useEffect(() => {
      const slider = ourRef.current;
      if (!slider) return;

      slider.addEventListener("scroll", handleScroll);
      handleScroll();

      return () => {
        slider.removeEventListener("scroll", handleScroll);
      };
    }, []);

    return (
      <div
        ref={ourRef}
        className={clsx(
          rootClass,
          styles.draggableContainer,
          "no-scrollbar overflow-x-auto scroll-smooth px-1 pb-1"
        )}
      >
        {React.Children.map(children, (child) => (
          <div className={clsx(styles.draggableItem)} style={{
            scrollSnapAlign: "start",
            width: `calc((100% - (var(--gap) * (var(--columns) - 1))) / var(--columns))`,
          }}>
            {child}
          </div>
        ))}
      </div>
    );
  }
);

Draggable.displayName = "Draggable";

export default Draggable;
