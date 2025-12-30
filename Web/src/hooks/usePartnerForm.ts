import { useState } from "react";
import type { Partner } from "../types/partner";

export function usePartnerForm() {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPartner, setCurrentPartner] = useState<Partner | null>(null);

  const openCreate = () => {
    setIsEditing(false);
    setCurrentPartner(null);
    setOpen(true);
  };

  const openEdit = (partner: Partner) => {
    setIsEditing(true);
    setCurrentPartner(partner);
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    setCurrentPartner(null);
    setIsEditing(false);
  };

  return {
    open,
    isEditing,
    currentPartner,
    openCreate,
    openEdit,
    close,
  };
}
