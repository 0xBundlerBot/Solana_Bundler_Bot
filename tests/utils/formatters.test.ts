import { formatNumber, formatTokenAmount, formatAddress, formatTime } from '../../src/utils/formatters';

describe('formatNumber', () => {  
  test('formats regular numbers correctly', () => {
    expect(formatNumber(1234.56)).toBe('1,234.56');
    expect(formatNumber(1000000)).toBe('1,000,000.00');
  }); 

  test('formats compact numbers correctly', () => { 
    expect(formatNumber(1500, { compact: true })).toBe('1.50K');
    expect(formatNumber(1500000, { compact: true })).toBe('1.50M');
    expect(formatNumber(1500000000, { compact: true })).toBe('1.50B');
  });

  test('formats currency correctly', () => {
    expect(formatNumber(1234.56, { currency: true })).toBe('$1,234.56');
    expect(formatNumber(1500, { currency: true, compact: true })).toBe('$1.50K');
  });

  test('formats percentages correctly', () => {
    expect(formatNumber(0.1234, { percentage: true })).toBe('12.34%');
    expect(formatNumber(0.05, { percentage: true, decimals: 1 })).toBe('5.0%');
  });
});

describe('formatTokenAmount', () => {
  test('formats token amounts correctly', () => {
    expect(formatTokenAmount(1000000000, 9)).toBe('1.0000');
    expect(formatTokenAmount(500000000, 9)).toBe('0.5000');
    expect(formatTokenAmount(1234567890, 9)).toBe('1.2346');
  });

  test('handles different decimals', () => {
    expect(formatTokenAmount(1000000, 6)).toBe('1.0000');
    expect(formatTokenAmount(500000, 6)).toBe('0.5000');
  });
});

describe('formatAddress', () => {
  test('formats Solana addresses correctly', () => {
    const address = '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU';
    expect(formatAddress(address)).toBe('7xKX...gAsU');
    expect(formatAddress(address, 6, 6)).toBe('7xKXtg...TZgAsU');
  });

  test('handles short addresses', () => {
    const shortAddress = '1234567890';
    expect(formatAddress(shortAddress)).toBe('1234567890');
  });

  test('handles empty addresses', () => {
    expect(formatAddress('')).toBe('');
    expect(formatAddress(null as any)).toBe(null);
  });
});

describe('formatTime', () => {
  test('formats recent times correctly', () => {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    const oneHourAgo = now - 3600000;
    const oneDayAgo = now - 86400000;

    expect(formatTime(now - 30000)).toBe('Just now');
    expect(formatTime(oneMinuteAgo)).toBe('1m ago');
    expect(formatTime(oneHourAgo)).toBe('1h ago');
    expect(formatTime(oneDayAgo)).toBe('1d ago');
  });

  test('formats old dates correctly', () => {
    const oldDate = new Date('2023-01-01').getTime();
    const result = formatTime(oldDate);
    expect(result).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
  });
});
