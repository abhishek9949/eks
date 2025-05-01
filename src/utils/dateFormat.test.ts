import dateFormat from './dateFormat'; // Adjust the import path if needed

describe('dateFormat', () => {
  it('should format a Date object correctly', () => {
    const date = new Date('2024-12-25');
    expect(dateFormat(date)).toBe('2024-12-25');
  });

  it('should format a valid date string correctly', () => {
    expect(dateFormat('2025-01-01')).toBe('2025-01-01');
  });

  it('should pad single digit month and day with zero', () => {
    expect(dateFormat('2025-4-7')).toBe('2025-04-07');
    expect(dateFormat('2025-04-5')).toBe('2025-04-05');
  });

  it('should throw an error for an invalid date string', () => {
    expect(() => dateFormat('invalid-date')).toThrow(TypeError);
    expect(() => dateFormat('not-a-date')).toThrow('Invalid date input');
  });

  it('should handle leap year correctly', () => {
    expect(dateFormat('2024-02-29')).toBe('2024-02-29');
  });
});
