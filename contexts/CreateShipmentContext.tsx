/**
 * Holds the in-progress shipment form across the 3 wizard screens
 * (create-shipment-1, -2, -3). Reset when the user lands on -1 or after submit.
 */
import React, { createContext, useCallback, useContext, useState, ReactNode } from 'react';
import { pickupCoordsFromDraft } from '../utils/geo';

export type ShipmentDraft = {
  pickupAddress: string;
  pickupLat?: number; pickupLng?: number;
  dropoffAddress: string;
  dropoffLat?: number; dropoffLng?: number;
  weightKg: string;       // user input — keep as string for the form, parse on submit
  loadType: string;
  dimensions: string;     // free-form for now; parsed into {lengthM, widthM, heightM} on submit
  notes: string;
  truckType: string;      // truck_types.code
  hasInsurance: boolean;
  isUrgent: boolean;
  pickupAt?: string;      // ISO datetime for scheduled pickup
};

const EMPTY: ShipmentDraft = {
  pickupAddress: '', dropoffAddress: '',
  weightKg: '', loadType: '', dimensions: '', notes: '',
  truckType: '', hasInsurance: false, isUrgent: false,
};

interface Ctx {
  draft: ShipmentDraft;
  set: (patch: Partial<ShipmentDraft>) => void;
  reset: () => void;
}

const CreateShipmentContext = createContext<Ctx | undefined>(undefined);

export function CreateShipmentProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<ShipmentDraft>(EMPTY);
  const set = useCallback((patch: Partial<ShipmentDraft>) => {
    setDraft(d => ({ ...d, ...patch }));
  }, []);
  const reset = useCallback(() => setDraft(EMPTY), []);
  return (
    <CreateShipmentContext.Provider value={{ draft, set, reset }}>
      {children}
    </CreateShipmentContext.Provider>
  );
}

export function useShipmentDraft(): Ctx {
  const ctx = useContext(CreateShipmentContext);
  if (!ctx) throw new Error('useShipmentDraft must be used within CreateShipmentProvider');
  return ctx;
}

/**
 * Parse the free-form "dimensions" string into {lengthM, widthM, heightM}.
 * Accepts "2 x 1.5 x 1.2" or "2x1.5x1.2 m" or "200x150x120 cm".
 * Returns null if unparseable.
 */
/** Build API body for quote + create from the wizard draft. */
export function draftToShipmentPayload(draft: ShipmentDraft) {
  const dims = parseDimensions(draft.dimensions);
  const pickup = pickupCoordsFromDraft(draft);
  return {
    pickupAddress: draft.pickupAddress,
    ...(pickup ? { pickup: { lat: pickup.lat, lng: pickup.lng } } : {}),
    dropoffAddress: draft.dropoffAddress,
    weightKg: parseFloat(draft.weightKg),
    dimensions: dims || undefined,
    loadType: draft.loadType || undefined,
    truckType: draft.truckType,
    hasInsurance: draft.hasInsurance,
    isUrgent: draft.isUrgent,
    pickupAt: draft.pickupAt || undefined,
    specialInstructions: draft.notes || undefined,
  };
}

export function parseDimensions(s: string): { lengthM: number; widthM: number; heightM: number } | null {
  if (!s) return null;
  const cm = /cm/i.test(s);
  const cleaned = s.replace(/m|cm|×/gi, '').trim();
  const parts = cleaned.split(/[xX*\s]+/).filter(Boolean).map(Number);
  if (parts.length !== 3 || parts.some(n => !Number.isFinite(n) || n <= 0)) return null;
  const [l, w, h] = parts;
  const f = cm ? 0.01 : 1;
  return { lengthM: l * f, widthM: w * f, heightM: h * f };
}
