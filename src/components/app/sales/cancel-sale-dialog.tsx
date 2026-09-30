"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogAcceptButton,
  DialogCancelButton,
} from "@/components/shared/dialog";

type CancelSaleDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export function CancelSaleDialog({
  open,
  onOpenChange,
  onConfirm,
}: CancelSaleDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle>Cancelar venta</DialogTitle>

      <DialogContent>
        <p className="text-sm text-gray-300">
          ¿Seguro que deseas cancelar esta venta? Se perderán los productos
          agregados al ticket.
        </p>
      </DialogContent>

      <DialogFooter>
        <DialogCancelButton onClick={() => onOpenChange(false)}>
          Volver
        </DialogCancelButton>
        <DialogAcceptButton onClick={onConfirm}>
          Sí, cancelar
        </DialogAcceptButton>
      </DialogFooter>
    </Dialog>
  );
}
