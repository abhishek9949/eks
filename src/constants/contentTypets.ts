
export const ContentType = {
    2: 'Article',
    3: 'Research',
    4: 'Podcast',
    5: 'Video',
    6: 'Workshop',
    7: 'Printable Resource',
} as const;

// Create a new array of objects containing id and name
export const ContentTypeArray = Object.entries(ContentType).map(([id, name]) => ({
    id: Number(id), // Convert string keys to numbers
    name,
  }));
  

// Export the names as an array
export const ContentTypeNames = Object.values(ContentType) as readonly string[];

// Type for ContentTypeNames
export type ContentTypeNamesType = (typeof ContentTypeNames)[number];

export default ContentType;
