export interface CalculationResult {
  catheterDiameterMm: number;
  vesselDiameterMm: number;
  areaOccupiedPercent: number;
  riskLevel: 'low' | 'moderate' | 'high';
}

export enum MeasurementUnit {
  MM = 'mm',
  CM = 'cm'
}
