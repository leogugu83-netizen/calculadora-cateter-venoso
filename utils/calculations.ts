import { CalculationResult, MeasurementUnit } from '../types';

export const calculateOccupation = (
  frenchSize: number, 
  vesselSize: number, 
  vesselUnit: MeasurementUnit
): CalculationResult | null => {
  if (!frenchSize || !vesselSize || vesselSize <= 0) return null;

  // 1 French = 1/3 mm = 0.333... mm
  const catheterDiameterMm = frenchSize / 3;
  
  // Convert vessel to mm if needed
  const vesselDiameterMm = vesselUnit === MeasurementUnit.CM 
    ? vesselSize * 10 
    : vesselSize;

  if (vesselDiameterMm <= 0) return null;

  // Area = pi * r^2
  // Ratio of Areas = (r_catheter^2) / (r_vessel^2) = (d_catheter^2) / (d_vessel^2)
  const ratioSquared = Math.pow(catheterDiameterMm, 2) / Math.pow(vesselDiameterMm, 2);
  const areaOccupiedPercent = ratioSquared * 100;

  // Clinical determination (General guidelines: <33% ideal, <45% acceptable, >45% high risk)
  let riskLevel: 'low' | 'moderate' | 'high' = 'low';
  if (areaOccupiedPercent > 45) {
    riskLevel = 'high';
  } else if (areaOccupiedPercent > 33) {
    riskLevel = 'moderate';
  }

  return {
    catheterDiameterMm,
    vesselDiameterMm,
    areaOccupiedPercent,
    riskLevel
  };
};