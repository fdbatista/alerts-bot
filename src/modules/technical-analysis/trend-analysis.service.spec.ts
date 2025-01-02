import { TrendAnalysisService } from './trend-analysis.service';

describe('TrendAnalysisService', () => {
  let service: TrendAnalysisService;

  beforeEach(() => {
    service = new TrendAnalysisService();
  });

  describe('analyzeBearishTrend', () => {
    it('should detect a bearish trend with lower peaks', () => {
      const closingPrices = [90, 92, 93, 88, 90, 91, 85, 87, 83];
      const result = service.analyzeBearishTrend(closingPrices);

      expect(result.bearish).toBe(true);
      expect(result.trendChange).toBe(false);
    });

    it('should detect no bearish trend if peaks are not consistently lower', () => {
      const data = [100, 95, 90, 92, 94];
      const result = service.analyzeBearishTrend(data);

      expect(result.bearish).toBe(false);
    });

    it('should detect a trend change when the trendline is crossed', () => {
      const closingPrices = [90, 92, 93, 88, 90, 91, 85, 87, 83, 88];
      const result = service.analyzeBearishTrend(closingPrices);

      expect(result.trendChange).toBe(true);
    });
  });

  describe('detectSMACrossovers', () => {
    it('should detect SMA10 crossing above SMA50', () => {
      const data = [
        115, 120, 118, 115, 112, 110, 108, 105, 102, 100, 98, 97, 95, 96, 99, 102, 105, 110, 115,
        120, 118, 115, 112, 110, 108, 105, 102, 100, 98, 97, 95, 96, 99, 102, 105, 110, 115, 120,
        118, 115, 112, 110, 108, 105, 102, 100, 98, 97, 95, 96, 99, 102, 105, 110, 115, 120, 118,
      ];

      const result = service.detectSMACrossovers(data);

      expect(result.sma50Cross).toBe(true);
      expect(result.sma200Cross).toBe(false);
    });

    it('should not detect a crossover if SMA10 stays below SMA50 and SMA200', () => {
      const data = [100, 99, 98, 97, 96, 95, 94, 93];
      const result = service.detectSMACrossovers(data);

      expect(result.sma50Cross).toBe(false);
      expect(result.sma200Cross).toBe(false);
    });
  });

  describe('calculateSMA', () => {
    it('should calculate correct SMA values for a given period', () => {
      const data = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      const sma10 = service['calculateSMA'](data, 3);

      expect(sma10).toEqual([0, 0, 2, 3, 4, 5, 6, 7, 8]); // First 2 are zeros due to insufficient data
    });
  });

  describe('findPeaks', () => {
    it('should correctly identify peaks in the data', () => {
      const data = [100, 102, 101, 103, 99, 105, 100];
      const peaks = service['findPeaks'](data);

      expect(peaks).toEqual([102, 103, 105]);
    });
  });

  describe('detectTrendlineCross', () => {
    it('should detect a trendline cross in the data', () => {
      const data = [100, 98, 97, 99, 101];
      const result = service['detectTrendlineCross'](data);

      expect(result).toBe(true);
    });

    it('should not detect a trendline cross if no crossing occurs', () => {
      const data = [100, 99, 98, 97, 96];
      const result = service['detectTrendlineCross'](data);

      expect(result).toBe(false);
    });
  });

  describe('checkCrossover', () => {
    it('should detect a crossover', () => {
      const smaShort = [1, 2, 3, 4, 5];
      const smaLong = [5, 4, 3, 5, 1];
      const result = service['checkCrossover'](smaShort, smaLong);

      expect(result).toBe(true);
    });

    it('should not detect a crossover if none occurs', () => {
      const smaShort = [1, 2, 3, 4, 5];
      const smaLong = [6, 6, 6, 6, 6];
      const result = service['checkCrossover'](smaShort, smaLong);

      expect(result).toBe(false);
    });
  });
});
