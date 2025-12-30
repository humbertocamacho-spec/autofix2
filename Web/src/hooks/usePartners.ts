import { useState } from "react";
import { VITE_API_URL } from "../config/env";
import type { Partner } from "../types/partner";

export function usePartners() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch(`${VITE_API_URL}/api/partners`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPartners(await res.json());
    } catch (error) {
      console.error("Error fetching partners:", error);
    } finally {
      setLoading(false);
    }
  };

  const deletePartner = async (id: number) => {
    await fetch(`${VITE_API_URL}/api/partners/${id}`, { method: "DELETE" });
    fetchPartners();
  };

  const restorePartner = async (id: number) => {
    await fetch(`${VITE_API_URL}/api/partners/${id}/restore`, { method: "PATCH" });
    fetchPartners();
  };

  return {
    partners,
    loading,
    fetchPartners,
    deletePartner,
    restorePartner,
  };
}
