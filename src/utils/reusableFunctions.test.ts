import {
    stringToColor,
    timeDifference,
    truncateString,
    darkenColor,
    formatDuration,
    getMaximumContentCards,
    getDateAndTimeFromTimestamp,
    capitalizeWords,
    getTimeFromTimestamp,
    areArraysEqualAsSets,
  } from './reusableFunctions';
  
  describe('stringToColor', () => {
    it('should return a hex color string', () => {
      expect(stringToColor('test')).toMatch(/^#[0-9a-f]{6}$/i);
    });
  
    it('should return same color for same input', () => {
      expect(stringToColor('hello')).toBe(stringToColor('hello'));
    });
  });
  
  describe('timeDifference', () => {
    it('should return "Just now" for current timestamp', () => {
      expect(timeDifference(new Date().toISOString())).toBe('Just now');
    });
  
    it('should return "X minutes ago"', () => {
      const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      expect(timeDifference(fiveMinsAgo)).toBe('5 minutes ago');
    });
  
    it('should return "X hours ago"', () => {
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
      expect(timeDifference(twoHoursAgo)).toBe('2 hours ago');
    });
  
    it('should return "X days ago"', () => {
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
      expect(timeDifference(threeDaysAgo)).toBe('3 days ago');
    });
  });
  
  describe('truncateString', () => {
    it('should truncate if longer than limit', () => {
      expect(truncateString('Hello World, this is a long string', 10)).toBe('Hello Worl...');
    });
  
    it('should return same string if under limit', () => {
      expect(truncateString('Short', 10)).toBe('Short');
    });
  });
  
  describe('darkenColor', () => {
    it('should darken color by given percent', () => {
      expect(darkenColor('#336699', 0.5)).toBe('rgb(25, 51, 76)');
    });
  });
  
  describe('formatDuration', () => {
    it('should format seconds under 60', () => {
      expect(formatDuration(45)).toBe('45 sec');
    });
  
    it('should format minutes and seconds', () => {
      expect(formatDuration(125)).toBe('2 min 5 sec');
    });
  
    it('should format hours, minutes and seconds', () => {
      expect(formatDuration(3675)).toBe('1 hr 1 min 15 sec');
    });
  });
  
  describe('getMaximumContentCards', () => {
    beforeEach(() => {
      // Mock window.matchMedia
      window.matchMedia = jest.fn().mockImplementation((query) => ({
        matches: query.includes('max-width: 399px'),
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));
    });
  
    it('should return 1 card and 9 pageSize for small screens', () => {
      expect(getMaximumContentCards()).toEqual({ cards: 1, pageSize: 9 });
    });
  });
  
  describe('getDateAndTimeFromTimestamp', () => {
    it('should return formatted date and time', () => {
      const result = getDateAndTimeFromTimestamp('2024-12-31T14:30:00Z');
      expect(result).toMatch(/\d{2}\/\d{2} \d{2}:\d{2}/);
    });
  });
  
  describe('capitalizeWords', () => {
    it('should capitalize first letter of each word', () => {
      expect(capitalizeWords('hello world')).toBe('Hello World');
    });
  });
  
  describe('getTimeFromTimestamp', () => {
    it('should return time in hh:mm AM/PM format', () => {
      const result = getTimeFromTimestamp('2024-12-31T14:45:00Z');
      expect(result).toMatch(/\d{1,2}:\d{2} (AM|PM)/);
    });
  });
  
  describe('areArraysEqualAsSets', () => {
    it('should return true for same elements in any order', () => {
      expect(areArraysEqualAsSets([1, 2, 3], [3, 2, 1])).toBe(true);
    });
  
    it('should return false for different elements', () => {
      expect(areArraysEqualAsSets([1, 2, 3], [4, 5, 6])).toBe(false);
    });
  
    it('should return false for different lengths', () => {
      expect(areArraysEqualAsSets([1, 2, 3], [1, 2])).toBe(false);
    });
  });
  