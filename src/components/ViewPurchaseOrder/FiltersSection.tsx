import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { getCities, City } from "@/lib/api/City";
import { getFacilities, Facility } from "@/lib/api/Facility";

interface FiltersSectionProps {
  onFetch: (filters: FilterValues) => void;
  onPrintPO: () => void;
  onPrintGRN: () => void;
  onExportCSV: () => void;
  onGenerateInvoice: () => void;
  onAcknowledgeCopy: () => void;
}

export interface FilterValues {
  city: string;
  facility: string;
  orderType: string;
  vendor: string;
  date: string;
}

export function FiltersSection({
  onFetch,
  onPrintPO,
  onPrintGRN,
  onExportCSV,
  onGenerateInvoice,
  onAcknowledgeCopy
}: FiltersSectionProps) {
  const { t } = useTranslation();
  
  // Fetch cities from API
  const { data: cities = [], isLoading: citiesLoading, error: citiesError } = useQuery({
    queryKey: ['cities'],
    queryFn: getCities,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch facilities from API
  const { data: facilities = [], isLoading: facilitiesLoading, error: facilitiesError } = useQuery({
    queryKey: ['facilities'],
    queryFn: getFacilities,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  const [filters, setFilters] = React.useState<FilterValues>({
    city: '',
    facility: '',
    orderType: 'normal',
    vendor: '',
    date: format(new Date(), 'yyyy-MM-dd\'T\'HH:mm')
  });

  // Search states for city and facility
  const [citySearch, setCitySearch] = React.useState('');
  const [facilitySearch, setFacilitySearch] = React.useState('');

  // Set default city when cities are loaded
  React.useEffect(() => {
    if (cities.length > 0 && !filters.city) {
      // Find Chennai or set first city as default
      const chennai = cities.find(city => city.name.toLowerCase().includes('chennai'));
      setFilters(prev => ({ 
        ...prev, 
        city: chennai ? chennai.name : cities[0].name 
      }));
    }
  }, [cities, filters.city]);

  // Filter cities based on search
  const filteredCities = React.useMemo(() => {
    if (!citySearch) return cities;
    return cities.filter(city => 
      city.name.toLowerCase().includes(citySearch.toLowerCase())
    );
  }, [cities, citySearch]);

  // Filter facilities based on selected city and search
  const filteredFacilities = React.useMemo(() => {
    let filtered = facilities;
    
    // Filter by city if selected
    if (filters.city) {
      filtered = filtered.filter(facility => 
        facility.city.name === filters.city
      );
    }
    
    // Filter by search term
    if (facilitySearch) {
      filtered = filtered.filter(facility => 
        facility.name.toLowerCase().includes(facilitySearch.toLowerCase())
      );
    }
    
    return filtered;
  }, [facilities, filters.city, facilitySearch]);

  // Set default facility when facilities are loaded or city changes
  React.useEffect(() => {
    if (filteredFacilities.length > 0) {
      // If current facility is not in filtered list, reset it
      const currentFacilityExists = filteredFacilities.some(facility => facility.name === filters.facility);
      
      if (!currentFacilityExists) {
        // Find a facility with active status or set first facility as default
        const activeFacility = filteredFacilities.find(facility => facility.activeStatus === 1);
        setFilters(prev => ({ 
          ...prev, 
          facility: activeFacility ? activeFacility.name : filteredFacilities[0].name 
        }));
      }
    } else if (filters.facility) {
      // If no facilities available for selected city, clear facility selection
      setFilters(prev => ({ ...prev, facility: '' }));
    }
  }, [filteredFacilities, filters.facility, filters.city]);

  const handleFilterChange = (key: keyof FilterValues, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        {/* First Row - Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="city">{t('po.filters.city')}</Label>
            <Select 
              value={filters.city} 
              onValueChange={(v) => handleFilterChange('city', v)}
              disabled={citiesLoading}
            >
              <SelectTrigger id="city" data-cy="city-select">
                <SelectValue placeholder={citiesLoading ? t('po.filters.loadingCities') : t('po.filters.selectCity')} />
              </SelectTrigger>
              <SelectContent data-cy="city-options">
                {citiesError ? (
                  <div className="px-2 py-1.5 text-sm text-muted-foreground" data-cy="city-error">
                    {t('po.filters.errorLoadingCities')}
                  </div>
                ) : citiesLoading ? (
                  <div className="px-2 py-1.5 text-sm text-muted-foreground">
                    {t('po.filters.loadingCities')}
                  </div>
                ) : (
                  <>
                    {/* Search input for cities */}
                    <div className="p-2 border-b">
                      <Input
                        placeholder={t('po.filters.searchCity')}
                        value={citySearch}
                        onChange={(e) => setCitySearch(e.target.value)}
                        className="h-8"
                      />
                    </div>
                    {filteredCities.length === 0 ? (
                      <div className="px-2 py-1.5 text-sm text-muted-foreground">
                        {citySearch ? t('po.filters.noCitiesFound') : t('po.filters.noCitiesAvailable')}
                      </div>
                    ) : (
                      filteredCities.map((city: City) => (
                        <SelectItem key={city.id} value={city.name} data-cy={`city-option-${city.name}`}>
                          {city.name}
                        </SelectItem>
                      ))
                    )}
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="facility">{t('po.filters.facility')}</Label>
            <Select 
              value={filters.facility} 
              onValueChange={(v) => handleFilterChange('facility', v)}
              disabled={facilitiesLoading}
            >
              <SelectTrigger id="facility" data-cy="facility-select">
                <SelectValue placeholder={facilitiesLoading ? t('po.filters.loadingFacilities') : t('po.filters.selectFacility')} />
              </SelectTrigger>
              <SelectContent data-cy="facility-options">
                {facilitiesError ? (
                  <div className="px-2 py-1.5 text-sm text-muted-foreground" data-cy="facility-error">
                    {t('po.filters.errorLoadingFacilities')}
                  </div>
                ) : facilitiesLoading ? (
                  <div className="px-2 py-1.5 text-sm text-muted-foreground">
                    {t('po.filters.loadingFacilities')}
                  </div>
                ) : (
                  <>
                    {/* Search input for facilities */}
                    <div className="p-2 border-b">
                      <Input
                        placeholder={t('po.filters.searchFacility')}
                        value={facilitySearch}
                        onChange={(e) => setFacilitySearch(e.target.value)}
                        className="h-8"
                      />
                    </div>
                    {filteredFacilities.length === 0 ? (
                      <div className="px-2 py-1.5 text-sm text-muted-foreground">
                        {facilitySearch ? t('po.filters.noFacilitiesFound') : 
                         filters.city ? t('po.filters.noFacilitiesForCity') : t('po.filters.noFacilitiesAvailable')}
                      </div>
                    ) : (
                      filteredFacilities.map((facility: Facility) => (
                        <SelectItem key={facility.id} value={facility.name} data-cy={`facility-option-${facility.name}`}>
                          {facility.name} {facility.activeStatus === 0 && '(Inactive)'}
                        </SelectItem>
                      ))
                    )}
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="orderType">{t('po.filters.orderType')}</Label>
            <Select value={filters.orderType} onValueChange={(v) => handleFilterChange('orderType', v)}>
              <SelectTrigger id="orderType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">{t('po.filters.normalOrder')}</SelectItem>
                <SelectItem value="interfacility">{t('po.filters.interfacilityOrder')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="vendor">{t('po.filters.vendor')}</Label>
            <Input
              id="vendor"
              placeholder={t('po.filters.searchVendor')}
              value={filters.vendor}
              onChange={(e) => handleFilterChange('vendor', e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="date">{t('po.filters.date')}</Label>
            <div className="relative">
              <Input
                id="date"
                type="datetime-local"
                value={filters.date}
                onChange={(e) => handleFilterChange('date', e.target.value)}
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Second Row - Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => onFetch(filters)} className="bg-primary" data-cy="fetch-button">
            {t('po.actions.fetch')}
          </Button>
          <Button onClick={onPrintPO} variant="outline">
            {t('po.actions.printPO')}
          </Button>
          <Button onClick={onPrintGRN} variant="outline">
            {t('po.actions.printGRN')}
          </Button>
          <Button onClick={onExportCSV} variant="outline">
            {t('po.actions.exportCSV')}
          </Button>
          <Button onClick={onGenerateInvoice} variant="outline">
            {t('po.actions.generateInvoice')}
          </Button>
          <Button onClick={onAcknowledgeCopy} variant="outline">
            {t('po.actions.acknowledgeCopy')}
          </Button>
        </div>
      </div>
    </Card>
  );
}

// Add React import
import * as React from "react";
