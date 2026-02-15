import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { calculateOccupation } from '../utils/calculations';
import { CalculationResult, MeasurementUnit } from '../types';
import VesselVisualization from './VesselVisualization';
import InfoTooltip from './InfoTooltip';

const InfusionCalculator: React.FC = () => {
  const [french, setFrench] = useState<string>(''); // Keep as string for input handling
  const [diameter, setDiameter] = useState<string>('');
  const [unit, setUnit] = useState<MeasurementUnit>(MeasurementUnit.CM);
  const [result, setResult] = useState<CalculationResult | null>(null);

  useEffect(() => {
    const frValue = parseFloat(french);
    const diamValue = parseFloat(diameter);

    if (!isNaN(frValue) && !isNaN(diamValue) && diamValue > 0) {
      const calc = calculateOccupation(frValue, diamValue, unit);
      setResult(calc);
    } else {
      setResult(null);
    }
  }, [french, diameter, unit]);

  // Helper to format percentage safely
  const formatPercent = (val: number) => val.toLocaleString('pt-BR', { maximumFractionDigits: 1 });

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
      
      {/* Header */}
      <div className="mb-8 text-center space-y-2">
        <div className="inline-flex items-center justify-center p-3 bg-rose-100 rounded-full mb-2">
          <Activity className="w-8 h-8 text-rose-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Calculadora de Ocupação Vascular</h1>
        <p className="text-slate-500 max-w-xl mx-auto">
          Calcule a proporção de ocupação do cateter dentro do vaso sanguíneo para avaliar o risco de trombose e flebite.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-center h-full">
          <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center">
            Dados do Procedimento
          </h2>
          
          <div className="space-y-6">
            {/* Catheter Input */}
            <div>
              <label htmlFor="french" className="block text-sm font-medium text-slate-700 mb-2">
                Calibre do Cateter (French)
                <InfoTooltip content="A escala French (Fr) é usada para medir o diâmetro externo de cateteres. 1 Fr = 0.33mm." />
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="french"
                  value={french}
                  onChange={(e) => setFrench(e.target.value)}
                  placeholder="Ex: 5"
                  className="block w-full rounded-lg border-slate-300 bg-slate-50 border p-3 focus:border-rose-500 focus:ring-rose-500 transition-colors"
                />
                <span className="absolute right-4 top-3 text-slate-400 font-medium">Fr</span>
              </div>
              {result && (
                <p className="text-xs text-slate-500 mt-1">
                  ≈ {result.catheterDiameterMm.toFixed(2)} mm de diâmetro
                </p>
              )}
            </div>

            {/* Vessel Input */}
            <div>
              <label htmlFor="diameter" className="block text-sm font-medium text-slate-700 mb-2">
                Diâmetro do Vaso
                <InfoTooltip content="Medida do diâmetro interno da veia, geralmente obtida via ultrassom." />
              </label>
              <div className="flex rounded-lg shadow-sm">
                <input
                  type="number"
                  id="diameter"
                  value={diameter}
                  onChange={(e) => setDiameter(e.target.value)}
                  placeholder="Ex: 0.6"
                  className="block w-full rounded-l-lg border-slate-300 bg-slate-50 border p-3 focus:border-rose-500 focus:ring-rose-500 transition-colors"
                />
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as MeasurementUnit)}
                  className="inline-flex items-center px-4 rounded-r-lg border border-l-0 border-slate-300 bg-slate-100 text-slate-600 text-sm font-medium hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value={MeasurementUnit.CM}>cm</option>
                  <option value={MeasurementUnit.MM}>mm</option>
                </select>
              </div>
              {result && unit === MeasurementUnit.CM && (
                <p className="text-xs text-slate-500 mt-1">
                  = {result.vesselDiameterMm.toFixed(1)} mm
                </p>
              )}
            </div>
          </div>

          {/* Guidelines Mini-Card */}
          <div className="mt-8 bg-blue-50 p-4 rounded-xl border border-blue-100">
            <h3 className="text-blue-800 font-semibold text-sm mb-2 flex items-center">
              <Info className="w-4 h-4 mr-2" /> Diretrizes Clínicas
            </h3>
            <ul className="text-xs text-blue-700 space-y-1 list-disc pl-4">
              <li>Ocupação ideal: <strong>&lt; 33%</strong> (INS - Infusion Nurses Society).</li>
              <li>Ocupação aceitável: <strong>&lt; 45%</strong>.</li>
              <li>Acima de 45% aumenta drasticamente o risco de estase sanguínea e trombose.</li>
            </ul>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col h-full relative overflow-hidden">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 z-10">Visualização e Resultados</h2>
          
          {result ? (
            <div className="flex-1 flex flex-col items-center justify-between z-10">
              
              {/* The Graphic */}
              <div className="w-full flex justify-center mb-4">
                <VesselVisualization 
                  catheterDiameterMm={result.catheterDiameterMm}
                  vesselDiameterMm={result.vesselDiameterMm}
                  riskLevel={result.riskLevel}
                />
              </div>

              {/* Stats Card */}
              <div className={`w-full p-4 rounded-xl border-l-4 shadow-sm transition-all duration-500 ${
                result.riskLevel === 'low' ? 'bg-green-50 border-green-500 text-green-900' :
                result.riskLevel === 'moderate' ? 'bg-yellow-50 border-yellow-500 text-yellow-900' :
                'bg-red-50 border-red-500 text-red-900'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold uppercase tracking-wider opacity-80">Ocupação da Área</span>
                  {result.riskLevel === 'low' && <CheckCircle className="w-5 h-5 text-green-600" />}
                  {result.riskLevel === 'moderate' && <AlertTriangle className="w-5 h-5 text-yellow-600" />}
                  {result.riskLevel === 'high' && <AlertTriangle className="w-5 h-5 text-red-600" />}
                </div>
                
                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl font-bold">{formatPercent(result.areaOccupiedPercent)}%</span>
                  <span className="text-sm font-medium opacity-80">do lúmen ocupado</span>
                </div>

                <div className="mt-3 text-sm font-medium border-t border-black/5 pt-2">
                  {result.riskLevel === 'low' && "Risco Baixo: Ocupação ideal (<33%)."}
                  {result.riskLevel === 'moderate' && "Atenção: Monitorar sinais de flebite (33-45%)."}
                  {result.riskLevel === 'high' && "Risco Elevado: Considerar cateter menor ou outro vaso (>45%)."}
                </div>
              </div>

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 z-10 min-h-[300px]">
              <div className="w-24 h-24 rounded-full bg-slate-100 mb-4 flex items-center justify-center">
                <Activity className="w-10 h-10 opacity-20" />
              </div>
              <p>Insira os dados do cateter e do vaso para visualizar a simulação.</p>
            </div>
          )}

          {/* Background decoration */}
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-gradient-to-br from-rose-100 to-transparent rounded-full opacity-50 blur-3xl pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
};

export default InfusionCalculator;