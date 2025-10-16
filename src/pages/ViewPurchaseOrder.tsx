import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, MessageSquare } from "lucide-react";
import { FiltersSection, FilterValues } from "@/components/ViewPurchaseOrder/FiltersSection";
import { DataTable } from "@/components/ViewPurchaseOrder/DataTable";
import { EditOrderModal, CreateGRNModal } from "@/components/ViewPurchaseOrder/ActionsSection";
import { fetchPurchaseOrders, exportToCSV, PurchaseOrder } from "@/lib/api/purchaseOrders";
import { useToast } from "@/hooks/use-toast";

export default function ViewPurchaseOrder() {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const [filters, setFilters] = React.useState<FilterValues>({
    city: 'Chennai',
    facility: 'B2C_Chennai_FK_FC',
    orderType: 'normal',
    vendor: '',
    date: new Date().toISOString()
  });
  
  const [searchSKU, setSearchSKU] = React.useState('');
  const [editOrder, setEditOrder] = React.useState<PurchaseOrder | null>(null);
  const [grnOrder, setGrnOrder] = React.useState<PurchaseOrder | null>(null);

  const { data: purchaseOrders = [], isLoading, refetch } = useQuery({
    queryKey: ['purchaseOrders', filters],
    queryFn: () => fetchPurchaseOrders(filters),
  });

  const handleFetch = (newFilters: FilterValues) => {
    setFilters(newFilters);
    refetch();
  };

  const handleExportCSV = () => {
    exportToCSV(purchaseOrders);
    toast({
      title: t('po.toast.exportSuccess'),
      description: t('po.toast.exportSuccessDesc'),
    });
  };

  const handlePrint = (po: PurchaseOrder) => {
    toast({
      title: t('po.toast.printInitiated'),
      description: `${t('po.toast.printInitiatedDesc')} ${po.poId}`,
    });
    window.print();
  };

  const handleAction = (action: string) => {
    toast({
      title: t('po.toast.actionInitiated'),
      description: `${action} ${t('po.toast.actionInitiatedDesc')}`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-2xl font-bold">{t('po.title')}</h1>
          
          <div className="flex items-center gap-4">
            <Input
              placeholder={t('po.searchSKU')}
              value={searchSKU}
              onChange={(e) => setSearchSKU(e.target.value)}
              className="w-64"
            />
            <Button variant="outline" size="sm">
              <MessageSquare className="h-4 w-4 mr-2" />
              {t('po.feedback')}
            </Button>
            <div className="flex items-center gap-2 px-3 py-2 rounded-md border">
              <User className="h-4 w-4" />
              <span className="text-sm font-medium">NC3604</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Filters */}
        <FiltersSection
          onFetch={handleFetch}
          onPrintPO={() => handleAction(t('po.actions.printPO'))}
          onPrintGRN={() => handleAction(t('po.actions.printGRN'))}
          onExportCSV={handleExportCSV}
          onGenerateInvoice={() => handleAction(t('po.actions.generateInvoice'))}
          onAcknowledgeCopy={() => handleAction(t('po.actions.acknowledgeCopy'))}
        />

        {/* Data Table */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">{t('po.loading')}</div>
          </div>
        ) : (
          <DataTable
            data={purchaseOrders}
            onEdit={setEditOrder}
            onCreateGRN={setGrnOrder}
            onPrint={handlePrint}
          />
        )}
      </main>

      {/* Modals */}
      <EditOrderModal
        open={!!editOrder}
        onOpenChange={(open) => !open && setEditOrder(null)}
        order={editOrder}
      />
      
      <CreateGRNModal
        open={!!grnOrder}
        onOpenChange={(open) => !open && setGrnOrder(null)}
        order={grnOrder}
      />
    </div>
  );
}
