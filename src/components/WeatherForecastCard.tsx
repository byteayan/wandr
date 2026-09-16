import React, { useState, useEffect } from 'react';
import {
  Sun,
  CloudSun,
  CloudRain,
  Wind,
  Droplets,
  Thermometer,
  Sunrise,
  Sunset,
  Sparkles,
  Luggage,
  Clock,
  RefreshCw,
  Check,
  Shirt,
} from 'lucide-react';
import {
  DestinationWeatherReport,
  DayWeatherForecast,
  fetchDestinationWeatherForecast,
} from '../utils/weatherForecastService';
import { Destination } from '../types/travel';

interface WeatherForecastCardProps {
  destination: Destination;
  durationDays: number;
  startDate?: string;
  endDate?: string;
}

export const WeatherForecastCard: React.FC<WeatherForecastCardProps> = ({
  destination,
  durationDays,
  startDate,
  endDate,
}) => {
  const [report, setReport] = useState<DestinationWeatherReport | null>(null);
  const [selectedDayNum, setSelectedDayNum] = useState<number>(1);
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>('C');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [packedItems, setPackedItems] = useState<string[]>([]);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    fetchDestinationWeatherForecast(
      destination.id,
      destination.name,
      destination.country,
      durationDays,
      startDate
    ).then((data) => {
      if (isMounted) {
        setReport(data);
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [destination.id, destination.name, destination.country, durationDays, startDate]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    const data = await fetchDestinationWeatherForecast(
      destination.id,
      destination.name,
      destination.country,
      durationDays,
      startDate
    );
    setReport(data);
    setTimeout(() => setIsRefreshing(false), 400);
  };

  const togglePackItem = (item: string) => {
    setPackedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  if (isLoading || !report) {
    return (
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-2xs animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 bg-stone-200 rounded-full w-48" />
          <div className="h-6 bg-stone-200 rounded-full w-20" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-28 bg-stone-100 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const selectedDay: DayWeatherForecast =
    report.daysForecast.find((d) => d.dayNumber === selectedDayNum) || report.daysForecast[0];

  const getWeatherIcon = (category: DayWeatherForecast['conditionCategory']) => {
    switch (category) {
      case 'sunny':
        return <Sun className="w-5 h-5 text-amber-500" />;
      case 'cloudy':
        return <CloudSun className="w-5 h-5 text-sky-500" />;
      case 'rainy':
        return <CloudRain className="w-5 h-5 text-blue-500" />;
      case 'breezy':
        return <Wind className="w-5 h-5 text-teal-500" />;
      default:
        return <Sun className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-8 border border-stone-200/90 shadow-2xs mb-10 overflow-hidden relative">
      {/* Background Decorative Accent */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-amber-100/40 via-sky-50/30 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-100 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-[10px] font-semibold uppercase tracking-wider">
              <Sun className="w-3 h-3 text-amber-600" />
              <span>{report.seasonName}</span>
            </div>
            <span className="text-[10px] text-stone-400 font-light hidden sm:inline">
              • Travel Dates: {startDate || 'Trip Range'} {endDate ? `– ${endDate}` : ''}
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 flex items-center gap-2">
            <span>Forecast & Climate:</span>
            <span className="text-[#E05A47]">{report.destinationName}</span>
          </h3>
          <p className="text-xs text-stone-500 font-light mt-0.5 max-w-xl">
            {report.climateOverview}
          </p>
        </div>

        {/* Controls: °C/°F Unit Switcher & Refresh */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Temperature Unit Switch */}
          <div className="inline-flex p-0.5 rounded-xl bg-stone-100 border border-stone-200/80 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setTempUnit('C')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                tempUnit === 'C'
                  ? 'bg-stone-900 text-white shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              °C
            </button>
            <button
              type="button"
              onClick={() => setTempUnit('F')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                tempUnit === 'F'
                  ? 'bg-stone-900 text-white shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              °F
            </button>
          </div>

          {/* Refresh Real-Time Simulation */}
          <button
            type="button"
            onClick={handleRefresh}
            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 border border-stone-200/80 transition-colors cursor-pointer"
            title="Refresh weather data"
            aria-label="Refresh weather data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Content Grid: Day Carousel + Active Day Spotlight & Packing Recommendations */}
      <div className="pt-5 space-y-6 relative z-10">
        {/* Day-by-Day Forecast Horizontal Selector Bar */}
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2.5">
            <span>{durationDays}-Day Trip Forecast</span>
            <span className="text-[11px] text-emerald-700 font-medium normal-case flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              {report.aiSuitabilityVerdict}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2.5">
            {report.daysForecast.map((day) => {
              const isSelected = day.dayNumber === selectedDayNum;
              const maxTemp = tempUnit === 'C' ? `${day.tempMaxC}°C` : `${day.tempMaxF}°F`;
              const minTemp = tempUnit === 'C' ? `${day.tempMinC}°` : `${day.tempMinF}°`;

              return (
                <button
                  key={day.dayNumber}
                  type="button"
                  onClick={() => setSelectedDayNum(day.dayNumber)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-stone-900 text-white border-stone-900 shadow-md scale-[1.02] ring-2 ring-stone-900/10'
                      : 'bg-[#FAF8F5] hover:bg-white text-stone-800 border-stone-200/80 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wider ${
                        isSelected ? 'text-[#E05A47]' : 'text-stone-400'
                      }`}
                    >
                      Day 0{day.dayNumber}
                    </span>
                    <span
                      className={`text-[10px] font-light ${isSelected ? 'text-stone-400' : 'text-stone-400'}`}
                    >
                      {day.dateStr}
                    </span>
                  </div>

                  <div className="my-1 flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-white/10' : 'bg-white shadow-2xs'
                      }`}
                    >
                      {getWeatherIcon(day.conditionCategory)}
                    </div>
                    <div>
                      <div className="text-sm font-serif font-bold leading-tight">{maxTemp}</div>
                      <div
                        className={`text-[10px] font-light ${
                          isSelected ? 'text-stone-400' : 'text-stone-500'
                        }`}
                      >
                        Low {minTemp}
                      </div>
                    </div>
                  </div>

                  <div className="mt-1 pt-1.5 border-t border-stone-200/30 flex items-center justify-between text-[10px]">
                    <span className="truncate max-w-[70px]">{day.condition.split('&')[0]}</span>
                    <span
                      className={`font-medium flex items-center gap-0.5 ${
                        day.precipitationPercent > 20
                          ? 'text-blue-500 font-semibold'
                          : isSelected
                            ? 'text-stone-400'
                            : 'text-stone-400'
                      }`}
                    >
                      <Droplets className="w-2.5 h-2.5" />
                      {day.precipitationPercent}%
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day In-Depth Weather Spotlight Card */}
        <div className="bg-[#FAF8F5] rounded-3xl p-5 sm:p-6 border border-stone-200/90 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Column: Metric Gauges */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200/80 flex items-center justify-center text-2xl shadow-2xs">
                  {getWeatherIcon(selectedDay.conditionCategory)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#E05A47] uppercase tracking-wider">
                      Day 0{selectedDay.dayNumber} Focus ({selectedDay.dayOfWeek},{' '}
                      {selectedDay.dateStr})
                    </span>
                  </div>
                  <h4 className="text-base sm:text-lg font-serif font-bold text-stone-900">
                    {selectedDay.condition}
                  </h4>
                </div>
              </div>

              <div className="text-right">
                <span className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
                  {tempUnit === 'C' ? `${selectedDay.tempMaxC}°C` : `${selectedDay.tempMaxF}°F`}
                </span>
                <span className="text-xs text-stone-400 block">
                  Night Low{' '}
                  {tempUnit === 'C' ? `${selectedDay.tempMinC}°C` : `${selectedDay.tempMinF}°F`}
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-600 font-light leading-relaxed">
              {selectedDay.summary}
            </p>

            {/* 4 Micro Weather Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              <div className="bg-white p-2.5 rounded-2xl border border-stone-200/80 flex items-center gap-2 shadow-2xs">
                <Droplets className="w-4 h-4 text-blue-500 shrink-0" />
                <div>
                  <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
                    Precipitation
                  </span>
                  <span className="text-xs font-bold text-stone-900">
                    {selectedDay.precipitationPercent}% Chance
                  </span>
                </div>
              </div>

              <div className="bg-white p-2.5 rounded-2xl border border-stone-200/80 flex items-center gap-2 shadow-2xs">
                <Wind className="w-4 h-4 text-teal-600 shrink-0" />
                <div>
                  <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
                    Wind Speed
                  </span>
                  <span className="text-xs font-bold text-stone-900">
                    {selectedDay.windSpeedKmh} km/h
                  </span>
                </div>
              </div>

              <div className="bg-white p-2.5 rounded-2xl border border-stone-200/80 flex items-center gap-2 shadow-2xs">
                <Thermometer className="w-4 h-4 text-amber-500 shrink-0" />
                <div>
                  <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
                    UV Index
                  </span>
                  <span className="text-xs font-bold text-stone-900">
                    {selectedDay.uvIndex} (Moderate)
                  </span>
                </div>
              </div>

              <div className="bg-white p-2.5 rounded-2xl border border-stone-200/80 flex items-center gap-2 shadow-2xs">
                <Droplets className="w-4 h-4 text-sky-500 shrink-0" />
                <div>
                  <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
                    Humidity
                  </span>
                  <span className="text-xs font-bold text-stone-900">
                    {selectedDay.humidityPercent}%
                  </span>
                </div>
              </div>
            </div>

            {/* Sun Hours & Daylight Horizon */}
            <div className="bg-white p-3 rounded-2xl border border-stone-200/80 flex flex-wrap items-center justify-between gap-3 text-xs shadow-2xs">
              <div className="flex items-center gap-2">
                <Sunrise className="w-4 h-4 text-amber-500" />
                <span className="text-stone-500 font-light">Sunrise:</span>
                <span className="font-semibold text-stone-800">{report.sunriseTime}</span>
              </div>

              <div className="flex items-center gap-2">
                <Sunset className="w-4 h-4 text-orange-500" />
                <span className="text-stone-500 font-light">Golden Sunset:</span>
                <span className="font-semibold text-stone-800">{report.sunsetTime}</span>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-[#E05A47] font-medium">
                <Clock className="w-3.5 h-3.5" />
                <span>Best Activity: {selectedDay.bestActivityWindow}</span>
              </div>
            </div>
          </div>

          {/* Right Column: AI Packing & Destination Advisory */}
          <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Luggage className="w-3.5 h-3.5" />
                </div>
                <h5 className="text-xs font-serif font-bold text-stone-900 uppercase tracking-wider">
                  Weather-Optimized Packing
                </h5>
              </div>
              <span className="text-[10px] font-semibold text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">
                {packedItems.length}/{report.generalPackingTips.length} Packed
              </span>
            </div>

            <p className="text-[11px] text-stone-500 font-light">
              AI recommendations based on predicted humidity and temperature ranges for{' '}
              <span className="font-medium text-stone-700">{report.destinationName}</span>:
            </p>

            {/* Checklist of Packing items */}
            <div className="space-y-1.5">
              {report.generalPackingTips.map((item) => {
                const isPacked = packedItems.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => togglePackItem(item)}
                    className={`w-full p-2 rounded-xl text-left text-xs flex items-center justify-between transition-all cursor-pointer ${
                      isPacked
                        ? 'bg-emerald-50 text-emerald-900 border border-emerald-200 line-through opacity-80'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border border-stone-200/70'
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate pr-2">
                      <Shirt className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span className="truncate">{item}</span>
                    </span>
                    <div
                      className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                        isPacked
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-stone-300 bg-white'
                      }`}
                    >
                      {isPacked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Day Specific Attire Note */}
            <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/60 text-[11px] text-amber-950 flex items-start gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong className="font-semibold">Day 0{selectedDay.dayNumber} Tip:</strong>{' '}
                {selectedDay.packingTip}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
