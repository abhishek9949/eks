export const stringToColor = (text: string) => {
  let hash = 0;
  if (text) {
    for (const char of text) {
      hash = char?.charCodeAt(0) + ((hash << 5) - hash);
    }
  }
  return `#${[0, 1, 2]
    .map((i) => `00${((hash >> (i * 8)) & 0xff).toString(16)}`.slice(-2))
    .join("")}`;
};

export function timeDifference(createdAt: string) {
  const createdDate = new Date(createdAt).getTime();
  const now = new Date().getTime();

  const diffInMilliseconds = now - createdDate;
  const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
  const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) {
    return "Just now";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
  } else {
    return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
  }
}

export const truncateString = (strData: string, limit = 22) => {
  return strData.length > limit ? strData.slice(0, limit) + "..." : strData;
};

export const darkenColor = (hex: string, percent: number) => {
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);

  r = Math.max(0, Math.floor(r * (1 - percent)));
  g = Math.max(0, Math.floor(g * (1 - percent)));
  b = Math.max(0, Math.floor(b * (1 - percent)));

  return `rgb(${r}, ${g}, ${b})`;
};

export const formatDuration = (seconds: number) => {
  if (seconds < 60) {
    return `${Math.floor(seconds)} sec`;
  }

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const hrs = Math.floor(mins / 60);
  const remainingMins = mins % 60;

  const parts: string[] = [];

  if (hrs > 0) {
    parts.push(`${hrs} hr`);
  }
  if (remainingMins > 0) {
    parts.push(`${remainingMins} min`);
  }
  if (secs > 0) {
    parts.push(`${Math.round(secs)} sec`);
  }

  return parts.join(" ");
};

export const getMaximumContentCards = () => {
  if (typeof window !== "undefined") {
    if (window?.matchMedia("(max-width: 399px)").matches) {
      return { cards: 1, pageSize: 9 };
    } else if (
      window?.matchMedia("(min-width: 399px) and (max-width: 1023px)").matches
    ) {
      return { cards: 2, pageSize: 8 };
    } else if (
      window?.matchMedia("(min-width: 1024px) and (max-width: 1268.98px)")
        .matches
    ) {
      return { cards: 3, pageSize: 9 };
    } else {
      return { cards: 4, pageSize: 8 };
    }
  }
  return { cards: 4, pageSize: 8 };
};

export const getDateAndTimeFromTimestamp = (timestamp: string | number) => {
  const dt = new Date(timestamp);
  const formattedDateTime = `${(dt.getMonth() + 1).toString().padStart(2, "0")}/${dt
    .getDate()
    .toString()
    .padStart(2, "0")} ${dt.getHours().toString().padStart(2, "0")}:${dt
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
  return formattedDateTime;
};

// Capitalize the first letter of each word
export function capitalizeWords(str: string) {
  return str
    ?.split(" ")
    ?.map((word) => word?.charAt(0).toUpperCase() + word.slice(1))
    ?.join(" ");
}

// Capitalize the first letter
export const capitalizeFirstLetter = (message: string) => {
  if (!message) return message; // Handle empty or null strings
  return message?.charAt(0).toUpperCase() + message?.slice(1);
}

export const getTimeFromTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // Convert 24-hour to 12-hour format
  return `${hours}:${minutes} ${ampm}`;
};

export const areArraysEqualAsSets = (arr1: number[], arr2: number[]) => {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);

  if (set1.size !== set2.size) return false;

  return Array.from(set1).every((num) => set2.has(num));
};

export const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();

  const isSameDay = date.toDateString() === now.toDateString();

  // Get yesterday
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  // Get day difference
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (isSameDay) {
    // Show time: HH:MM AM/PM
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (isYesterday) {
    return 'Yesterday';
  } else if (diffInDays < 7) {
    // Day of the week (e.g., "Mon")
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  } else {
    // Show date: e.g., Apr 1
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}

export const countWords = (html: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const text = doc.body.textContent ?? "";
  return text.trim().split(/\s+/).filter(Boolean).length;
};
