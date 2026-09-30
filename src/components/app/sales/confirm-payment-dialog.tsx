"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogAcceptButton,
  DialogCancelButton,
} from "@/components/shared/dialog";

type ConfirmPaymentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  total: number;
  onConfirm: () => void;
  isPending: boolean;
};

export function ConfirmPaymentDialog({
  open,
  onOpenChange,
  total,
  onConfirm,
  isPending,
}: ConfirmPaymentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle>Confirmar pago</DialogTitle>

      <DialogContent>
        <p className="text-sm text-gray-300">
          ¿Confirmas el cobro por{" "}
          <span className="font-semibold text-white">${total.toFixed(2)}</span>?
        </p>
      </DialogContent>

      <DialogFooter>
        <DialogCancelButton>Cancelar</DialogCancelButton>
        <DialogAcceptButton onClick={onConfirm} disabled={isPending}>
          {isPending ? "Procesando..." : "Confirmar"}
        </DialogAcceptButton>
      </DialogFooter>
    </Dialog>
  );
}
