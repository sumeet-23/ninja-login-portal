import * as React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import { PurchaseOrder } from "@/lib/api/purchaseOrders";
import { useToast } from "@/hooks/use-toast";

interface EditOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: PurchaseOrder | null;
}

export function EditOrderModal({ open, onOpenChange, order }: EditOrderModalProps) {
  const { t } = useTranslation();
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: t('po.toast.orderUpdated'),
      description: t('po.toast.orderUpdatedDesc'),
    });
    onOpenChange(false);
  };

  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('po.modal.editOrder')}</DialogTitle>
          <DialogDescription>
            {t('po.modal.editOrderDesc')} {order.poId}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-vendor">{t('po.table.vendorName')}</Label>
              <Input id="edit-vendor" defaultValue={order.vendorName} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-qty">{t('po.table.qtyTarget')}</Label>
              <Input id="edit-qty" type="number" defaultValue={order.qtyTarget} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-delivery">{t('po.table.targetDelivery')}</Label>
              <Input id="edit-delivery" type="datetime-local" defaultValue={order.targetDelivery.slice(0, 16)} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-address">{t('po.modal.address')}</Label>
              <Input id="edit-address" defaultValue={order.address} />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('po.actions.cancel')}
          </Button>
          <Button onClick={handleSave}>
            {t('po.actions.save')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface CreateGRNModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: PurchaseOrder | null;
}

export function CreateGRNModal({ open, onOpenChange, order }: CreateGRNModalProps) {
  const { t } = useTranslation();
  const { toast } = useToast();

  const handleCreate = () => {
    toast({
      title: t('po.toast.grnCreated'),
      description: t('po.toast.grnCreatedDesc'),
    });
    onOpenChange(false);
  };

  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('po.modal.createGRN')}</DialogTitle>
          <DialogDescription>
            {t('po.modal.createGRNDesc')} {order.poId}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="grn-qty">{t('po.modal.receivedQty')}</Label>
            <Input id="grn-qty" type="number" placeholder="0" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="grn-notes">{t('po.modal.notes')}</Label>
            <Input id="grn-notes" placeholder={t('po.modal.notesPlaceholder')} />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('po.actions.cancel')}
          </Button>
          <Button onClick={handleCreate}>
            {t('po.actions.create')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
