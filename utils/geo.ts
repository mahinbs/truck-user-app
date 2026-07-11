import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

import { api } from './api';

const CACHE_KEY = '@truckflow/last_location/v2';

export type LatLng = { lat: number; lng: number };

export async function cacheLocation(loc: LatLng): Promise<void> {
  await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(loc));
}

export async function getCachedLocation(): Promise<LatLng | null> {
  const raw = await AsyncStorage.getItem(CACHE_KEY);
  if (!raw) return null;
  try {
    const p = JSON.parse(raw) as LatLng;
    if (typeof p.lat === 'number' && typeof p.lng === 'number') return p;
  } catch {
    /* ignore */
  }
  return null;
}

async function readGps(): Promise<LatLng> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Location permission denied');
  }
  const pos = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });
  const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
  await cacheLocation(loc);
  return loc;
}

/** Always read GPS — used when driver goes online. */
export async function getFreshDeviceLocation(): Promise<LatLng> {
  return readGps();
}

/** GPS first; falls back to shared cache only if permission denied. */
export async function getDeviceLocation(): Promise<LatLng> {
  try {
    return await readGps();
  } catch {
    const cached = await getCachedLocation();
    if (cached) return cached;
    throw new Error('Location permission denied');
  }
}

/**
 * Snap business pickup to an online driver's DB location so both sides match.
 * Falls back to device GPS if no driver is online yet.
 */
export async function getSyncedPickupLocation(truckType?: string): Promise<LatLng> {
  try {
    const loc = await api.matchLocation(truckType);
    if (typeof loc?.lat === 'number' && typeof loc?.lng === 'number') {
      await cacheLocation({ lat: loc.lat, lng: loc.lng });
      return { lat: loc.lat, lng: loc.lng };
    }
  } catch {
    /* no online driver — use device */
  }
  return getDeviceLocation();
}

export function hasPickupCoords(draft: {
  pickupLat?: number;
  pickupLng?: number;
}): boolean {
  return draft.pickupLat != null && draft.pickupLng != null;
}

export function pickupCoordsFromDraft(draft: {
  pickupLat?: number;
  pickupLng?: number;
}): LatLng | null {
  if (!hasPickupCoords(draft)) return null;
  return { lat: draft.pickupLat!, lng: draft.pickupLng! };
}

/** Prefer online driver DB location, then draft, then cache, then GPS. */
export async function resolvePickupCoords(draft: {
  pickupLat?: number;
  pickupLng?: number;
  truckType?: string;
}): Promise<LatLng> {
  try {
    const synced = await api.matchLocation(draft.truckType || undefined);
    if (typeof synced?.lat === 'number' && typeof synced?.lng === 'number') {
      const loc = { lat: synced.lat, lng: synced.lng };
      await cacheLocation(loc);
      return loc;
    }
  } catch {
    /* no online driver for this truck type */
  }

  const fromDraft = pickupCoordsFromDraft(draft);
  if (fromDraft) return fromDraft;

  const cached = await getCachedLocation();
  if (cached) return cached;

  return getFreshDeviceLocation();
}

/** Push latest GPS to backend while driver stays online. */
export async function pushDriverLocationHeartbeat(
  toggleDriverStatus: (isOnline: boolean, location?: LatLng) => Promise<void>,
): Promise<LatLng | null> {
  try {
    const loc = await getFreshDeviceLocation();
    await toggleDriverStatus(true, loc);
    return loc;
  } catch {
    return null;
  }
}
