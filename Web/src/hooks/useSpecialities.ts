import { useState } from "react";
import { VITE_API_URL } from "../config/env";

type Speciality = { id: number; name: string };
type Relation = { partner_id: number; speciality_id: number };

export function useSpecialities() {
  const [specialities, setSpecialities] = useState<Speciality[]>([]);
  const [relations, setRelations] = useState<Relation[]>([]);

  const fetchSpecialities = async () => {
    const res = await fetch(`${VITE_API_URL}/api/specialities`);
    setSpecialities(await res.json());
  };

  const fetchRelations = async () => {
    const res = await fetch(`${VITE_API_URL}/api/partner_specialities`);
    setRelations(await res.json());
  };

  const getPartnerSpecialities = (partnerId: number) =>
    relations
      .filter(r => r.partner_id === partnerId)
      .map(r => specialities.find(s => s.id === r.speciality_id)?.name)
      .filter(Boolean) as string[];

  return {
    specialities,
    relations,
    fetchSpecialities,
    fetchRelations,
    getPartnerSpecialities,
  };
}
