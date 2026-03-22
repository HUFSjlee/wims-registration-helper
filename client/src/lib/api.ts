const API_BASE = "http://localhost:8080";
const TOKEN_KEY = "wims_auth_token";
const PENDING_REDIRECT_KEY = "wims_pending_redirect";

type ApiError = { message?: string; detail?: string };

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  userType: string;
};

type LoginApiResponse = {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
};

type SignupApiPayload = {
  userType: "PERSONAL" | "BUSINESS";
  name: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  address3: string;
  birth: string;
  gender: string;
  password: string;
};

type LoginApiPayload = {
  email: string;
  password: string;
};

export type Transfer = {
  transferId?: number;
  transferKey?: string;
  transferLink?: string;
  transferorId?: number;
  transfereeId?: number;
  speciesId?: number;
  speciesQuantity?: number;
  scientificName?: string;
  commonName?: string;
  transferorName?: string;
  transferorPhone?: string;
  maskedTransferorAddress?: string;
  transfereeName?: string;
  transfereePhone?: string;
  completed?: boolean;
  completedBy?: number;
  completedAt?: string;
};

function buildAddress(address1: string, address2: string, address3: string) {
  return [address1, address2, address3].filter(Boolean).join(" ");
}

function normalizeMeResponse(payload: {
  id: number | string;
  name: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  address3: string;
  userType: string;
}): User {
  return {
    id: String(payload.id),
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    address: buildAddress(payload.address1, payload.address2, payload.address3),
    userType: payload.userType,
  };
}

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function setPendingRedirect(path: string) {
  localStorage.setItem(PENDING_REDIRECT_KEY, path);
}

export function takePendingRedirect() {
  const path = localStorage.getItem(PENDING_REDIRECT_KEY);
  if (path) {
    localStorage.removeItem(PENDING_REDIRECT_KEY);
  }
  return path;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, init);
  if (!response.ok) {
    let message = "요청 처리 중 오류가 발생했습니다.";
    try {
      const payload = (await response.json()) as ApiError;
      if (payload?.detail) {
        message = payload.detail;
      } else if (payload?.message) {
        message = payload.message;
      }
    } catch {
      // Ignore response parsing failure and use the default message.
    }
    throw new Error(message);
  }
  return response.json() as Promise<T>;
}

export async function signup(payload: SignupApiPayload) {
  return request<User>("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function login(payload: LoginApiPayload) {
  const result = await request<LoginApiResponse>("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  setToken(result.accessToken);
  return result;
}

export async function getMe() {
  const token = getToken();
  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  const payload = await request<{
    id: number | string;
    name: string;
    email: string;
    phone: string;
    address1: string;
    address2: string;
    address3: string;
    userType: string;
  }>("/api/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });

  return normalizeMeResponse(payload);
}

export async function createTransfer(payload: {
  speciesId: number;
  scientificName: string;
  commonName: string;
  speciesQuantity: number;
  transfereePhone: string;
}) {
  const token = getToken();
  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  return request<Transfer>("/api/transfers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export async function getTransfer(tokenParam: string) {
  const token = getToken();
  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  return request<Transfer>(`/api/transfers/${tokenParam}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function submitTransfer(tokenParam: string) {
  const token = getToken();
  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  return request<Transfer>(`/api/transfers/${tokenParam}/complete`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export type RegisterSpeciesResult = {
  logId: number;
};

/** 보유 순수량 = 등록(log 1) 합 − 폐사(log 2) 합 */
export type SpeciesHolding = {
  speciesId: number;
  scientificName: string;
  commonName: string;
  quantity: number;
};

export async function getSpeciesHoldings() {
  const token = getToken();
  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }
  return request<SpeciesHolding[]>("/api/species/holdings", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function recordDeath(payload: {
  speciesId: number;
  quantity: string;
}) {
  const token = getToken();
  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }
  return request<{ logId: number }>("/api/species/death", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      speciesId: payload.speciesId,
      quantity: payload.quantity,
    }),
  });
}

export async function register(payload: {
  scientificName: string;
  commonName: string;
  quantity: string;
}) {
  const token = getToken();
  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }
  return request<RegisterSpeciesResult>("/api/species/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      scientificName: payload.scientificName,
      commonName: payload.commonName,
      quantity: payload.quantity,
    }),
  });
}
