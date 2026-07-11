/**
 * Thin fetch-based API client for TruckFlow backend.
 *
 * Why fetch and not axios? Expo already ships with fetch and we don't want
 * an extra dep. Mimics the slice of axios we'd use (baseURL, interceptors).
 *
 * Token handling: pulled from AsyncStorage on every call. AuthContext owns
 * the lifecycle (set on login, clear on logout, refreshed on 401).
 *
 * Override the base URL at boot:
 *   - .env: EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:8000/api/v1
 *   - or pass to setApiBase() once at app start.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEFAULT_BASE =
  (process.env.EXPO_PUBLIC_API_BASE_URL as string | undefined) ||
  'https://trucks-backend-9s2j.onrender.com/api/v1';

let _base = DEFAULT_BASE;

export function setApiBase(url: string) {
  _base = url.replace(/\/$/, '');
}

export function getApiBase() {
  return _base;
}

const TOKEN_KEY = '@truckflow_token';

let _onUnauthorized: (() => void) | null = null;
export function setOnUnauthorized(fn: () => void) {
  _onUnauthorized = fn;
}

export class ApiError extends Error {
  status: number;
  detail: unknown;
  constructor(status: number, detail: unknown, message: string) {
    super(message);
    this.status = status;
    this.detail = detail;
  }
}

async function authHeaders(): Promise<Record<string, string>> {
  const tok = await AsyncStorage.getItem(TOKEN_KEY);
  return tok ? { Authorization: `Bearer ${tok}` } : {};
}

type ReqOpts = {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
  skipAuth?: boolean;
};

export async function request<T = any>(path: string, opts: ReqOpts = {}): Promise<T> {
  const { method = 'GET', body, query, skipAuth } = opts;

  let url = `${_base}${path}`;
  if (query) {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null) params.append(k, String(v));
    }
    const qs = params.toString();
    if (qs) url += `?${qs}`;
  }

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (!skipAuth) Object.assign(headers, await authHeaders());

  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (e: any) {
    throw new ApiError(0, null, `network error: ${e?.message || 'unreachable'}`);
  }

  let payload: any = null;
  const text = await res.text();
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = text;
    }
  }

  if (!res.ok) {
    if (res.status === 401 && _onUnauthorized) _onUnauthorized();
    const detail = payload?.detail ?? payload;
    const msg = typeof detail === 'string' ? detail : `request failed (${res.status})`;
    throw new ApiError(res.status, detail, msg);
  }

  return payload as T;
}

// ── Types matching backend camelCase ──────────────────────────────────────
export type BackendRole = 'business' | 'driver' | 'broker' | 'admin';
export type FrontendRole = 'BUSINESS' | 'DRIVER' | 'BROKER';

export const toBackendRole = (r: FrontendRole): BackendRole =>
  r.toLowerCase() as BackendRole;
export const toFrontendRole = (r: BackendRole): FrontendRole =>
  r.toUpperCase() as FrontendRole;

export interface ApiUser {
  id: string;
  role: BackendRole;
  name: string;
  email: string;
  phone?: string | null;
  avatarUrl?: string | null;
  isOnline?: boolean | null;
  isVerified: boolean;
  emailConfirmed?: boolean;
  createdAt?: string | null;
  truckType?: string | null;
  truckNumber?: string | null;
  tripsCount?: number | null;
  ratingAvg?: number | null;
  verificationStatus?: string | null;
  payoutDetails?: Record<string, unknown> | null;
  companyName?: string | null;
  gstin?: string | null;
  billingAddress?: string | null;
  agencyName?: string | null;
}

export interface AuthOut {
  token: string;
  user: ApiUser;
}

export interface SignupPendingOut {
  ok: boolean;
  email: string;
  message: string;
}

// ── Endpoint helpers ──────────────────────────────────────────────────────
export const api = {
  // auth
  signup: (body: {
    role: BackendRole;
    name: string;
    email: string;
    phone?: string;
    password: string;
  }) => request<SignupPendingOut>('/auth/signup', { method: 'POST', body, skipAuth: true }),

  verifyOtp: (body: { email: string; token: string }) =>
    request<AuthOut>('/auth/verify-otp', { method: 'POST', body, skipAuth: true }),

  resendOtp: (email: string) =>
    request<SignupPendingOut>('/auth/resend-otp', {
      method: 'POST',
      body: { email },
      skipAuth: true,
    }),

  login: (body: { email: string; password: string }) =>
    request<AuthOut>('/auth/login', { method: 'POST', body, skipAuth: true }),

  forgotPassword: (email: string) =>
    request<{ ok: boolean; message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: { email },
      skipAuth: true,
    }),

  me: () => request<ApiUser>('/auth/me'),

  updateProfile: (body: Partial<{
    name: string; phone: string; avatarUrl: string;
    truckType: string; truckNumber: string; licenseNumber: string;
    payoutDetails: Record<string, unknown>;
    companyName: string; gstin: string; billingAddress: string;
    agencyName: string;
  }>) => request<ApiUser>('/auth/me', { method: 'PATCH', body }),

  registerPushToken: (expoToken: string, platform?: string) =>
    request<{ ok: true }>('/auth/push-tokens', {
      method: 'POST',
      body: { expoToken, platform },
    }),

  // reference (public for any authed user)
  truckTypes: () => request<any[]>('/reference/truck-types'),
  loadSizes: () => request<any[]>('/reference/load-size-categories'),
  gstConfig: () => request<{ defaultGstPct: number }>('/reference/gst-config'),

  // wallet
  wallet: () => request<{ balance: number; minBalance: number; updatedAt: string }>('/wallet'),
  walletTransactions: (kind?: string, limit = 100) =>
    request<any[]>('/wallet/transactions', { query: { kind, limit } }),
  topupDummy: (amount: number) =>
    request<{ ok: true; amount: number; newBalance: number }>('/wallet/topup', {
      method: 'POST',
      body: { amount },
    }),
  topupOrder: (amount: number) =>
    request<{ orderId: string; amount: number; keyId: string }>('/wallet/topup/order', {
      method: 'POST',
      body: { amount },
    }),
  paymentLink: (body: { payeeId: string; amount: number; description?: string; shipmentId?: string }) =>
    request<{ linkId: string; shortUrl: string; amount: number }>('/wallet/payment-link', {
      method: 'POST',
      body,
    }),
  withdraw: (amount: number, bankDetails?: object) =>
    request('/wallet/withdraw', { method: 'POST', body: { amount, bankDetails } }),

  signedUploadUrl: (bucket: 'verification' | 'vehicle' | 'avatars', filename: string) =>
    request<{ uploadUrl: string; path: string }>('/uploads/signed-url', {
      method: 'POST',
      body: { bucket, filename },
    }),

  signedDownloadUrl: (bucket: 'verification' | 'vehicle' | 'avatars', path: string) =>
    request<{ downloadUrl: string }>('/uploads/signed-download-url', {
      method: 'POST',
      body: { bucket, path },
    }),

  // verification
  driverVerificationStatus: () => request('/driver/me/verification'),
  driverSubmitVerification: (body: object) =>
    request('/driver/me/verification', { method: 'POST', body }),
  brokerVerificationStatus: () => request('/broker/me/verification'),
  brokerSubmitVerification: (body: object) =>
    request('/broker/me/verification', { method: 'POST', body }),

  // business / shipments
  quoteShipment: (body: object) => request('/shipments/quote', { method: 'POST', body }),
  createShipment: (body: object) => request('/shipments', { method: 'POST', body }),
  listMyShipments: (status?: string) =>
    request<{ items: any[]; count: number }>('/shipments', { query: { status } }),
  getShipment: (id: string) => request(`/shipments/${id}`),
  cancelShipment: (id: string) => request(`/shipments/${id}`, { method: 'DELETE' }),
  tracking: (id: string) => request(`/shipments/${id}/tracking`),
  rateShipment: (id: string, body: { stars: number; rateeRole: 'driver' | 'broker'; comment?: string }) =>
    request(`/shipments/${id}/rate`, { method: 'POST', body }),
  nearbyDrivers: (lat: number, lng: number, truckType: string) =>
    request<any[]>('/drivers/nearby', { query: { lat, lng, truckType } }),
  matchLocation: (truckType?: string) =>
    request<{ lat: number; lng: number; truckType?: string }>(
      '/reference/match-location',
      { query: truckType ? { truckType } : undefined },
    ),

  // driver
  driverSetStatus: (isOnline: boolean, location?: { lat: number; lng: number }) =>
    request('/driver/status', { method: 'PATCH', body: { isOnline, location } }),
  driverLoads: () => request<any[]>('/driver/loads'),
  driverAcceptLoad: (offerId: string) =>
    request(`/driver/loads/${offerId}/accept`, { method: 'POST' }),
  driverRejectLoad: (offerId: string) =>
    request(`/driver/loads/${offerId}/reject`, { method: 'POST' }),
  driverCurrentTrip: () => request('/driver/trips/current'),
  driverTripStatus: (tripId: string, status: 'at_pickup' | 'en_route_drop' | 'delivered', location?: { lat: number; lng: number }) =>
    request(`/driver/trips/${tripId}/status`, { method: 'POST', body: { status, location } }),
  driverTrips: (status?: string) =>
    request<any[]>('/driver/trips', { query: { status } }),
  driverEarnings: (period: 'day' | 'week' | 'month' = 'day') =>
    request('/driver/earnings', { query: { period } }),

  // broker
  brokerMyDrivers: (status?: string) => request<any[]>('/broker/drivers', { query: { status } }),
  brokerAddDriver: (body: object) => request('/broker/drivers', { method: 'POST', body }),
  brokerOpportunities: () => request<any[]>('/broker/load-opportunities'),
  brokerAcceptOpportunity: (shipmentId: string) =>
    request(`/broker/load-opportunities/${shipmentId}/accept`, { method: 'POST' }),
  brokerAssignDriver: (shipmentId: string, driverId: string) =>
    request(`/broker/load-opportunities/${shipmentId}/assign`, { method: 'POST', body: { driverId } }),
  brokerEarningsSummary: () => request('/broker/me/earnings'),
  brokerEarningsByPeriod: (period: 'day' | 'week' | 'month' = 'month') =>
    request('/broker/earnings', { query: { period } }),
  brokerActiveTrips: () => request<any[]>('/broker/trips/active'),
  brokerShipments: (status?: string) => request<any[]>('/broker/shipments', { query: { status } }),
  brokerGetCommission: () => request<{ commissionPct: number | null }>('/broker/me/commission'),
  brokerSetCommission: (pct: number) =>
    request('/broker/me/commission', { method: 'PUT', body: { commissionPct: pct } }),
  brokerRecordDriverPayment: (body: {
    driverId: string; amount: number; method?: string; reference?: string; note?: string;
  }) => request('/broker/me/driver-payments', { method: 'POST', body }),
  brokerDriverPayments: (driverId: string) =>
    request<any[]>(`/broker/me/drivers/${driverId}/payments`),
  brokerUpdateTripStatus: (
    tripId: string,
    status: 'at_pickup' | 'en_route_drop' | 'delivered',
    location?: { lat: number; lng: number },
  ) => request(`/broker/trips/${tripId}/status`, { method: 'POST', body: { status, location } }),
};

/** WebSocket base (strip /api/v1). */
export function getWsBaseUrl(): string {
  return _base.replace(/\/api\/v1\/?$/, '');
}

export async function getAuthToken(): Promise<string | null> {
  return AsyncStorage.getItem(TOKEN_KEY);
}
