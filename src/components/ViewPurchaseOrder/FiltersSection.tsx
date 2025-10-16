import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";

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
  
  const [filters, setFilters] = React.useState<FilterValues>({
    city: 'Chennai',
    facility: 'B2C_Chennai_FK_FC',
    orderType: 'normal',
    vendor: '',
    date: format(new Date(), 'yyyy-MM-dd\'T\'HH:mm')
  });

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
            <Select value={filters.city} onValueChange={(v) => handleFilterChange('city', v)}>
              <SelectTrigger id="city">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Chennai">Chennai</SelectItem>
                <SelectItem value="Bangalore">Bangalore</SelectItem>
                <SelectItem value="Mumbai">Mumbai</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="facility">{t('po.filters.facility')}</Label>
            <Select value={filters.facility} onValueChange={(v) => handleFilterChange('facility', v)}>
              <SelectTrigger id="facility">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="B2C_Chennai_FK_FC">B2C_Chennai_FK_FC</SelectItem>
                <SelectItem value="B2B_Chennai_Main">B2B_Chennai_Main</SelectItem>
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
                <SelectItem value="urgent">{t('po.filters.urgentOrder')}</SelectItem>
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
          <Button onClick={() => onFetch(filters)} className="bg-primary">
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
