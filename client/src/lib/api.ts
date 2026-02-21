const TOKEN_KEY = "wims_auth_token";
const PENDING_REDIRECT_KEY = "wims_pending_redirect";

type ApiError = { message?: string; detail?: string };

export type User = {
  id: string;
  name: string;
  address: string;
  phone: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type Transfer = {
  token: string;
  transferorName: string;
  transferorAddress: string;
  transferorPhone: string;
  receiverPhone: string;
  receiverName?: string;
  receiverAddress?: string;
  status: "CREATED" | "SUBMITTED";
  createdAt: string;
  submittedAt?: string;
};

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

async function request<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
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
      // ignore
    }
    throw new Error(message);
  }
  return response.json() as Promise<T>;
}

export async function signup(payload: {
  id: string;
  password: string;
  address: string;
  phone: string;
}) {
  return request<User>("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function login(payload: { id: string; password: string }) {
  const result = await request<AuthResponse>("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  setToken(result.token);
  return result;
}

export async function getMe() {
  const token = getToken();
  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }
  return request<User>("/api/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function createTransfer(receiverPhone: string) {
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
    body: JSON.stringify({ receiverPhone }),
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
  return request<Transfer>(`/api/transfers/${tokenParam}/submit`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}
