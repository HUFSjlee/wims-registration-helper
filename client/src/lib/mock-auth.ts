"use client";

const USER_KEY = "wims_mock_user";
const USERS_KEY = "wims_mock_users";
const HOLDINGS_KEY = "wims_mock_holdings";
const TRANSFERS_KEY = "wims_mock_transfers";

export type MockUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  password?: string;
};

export type MockHolding = {
  id: string;
  commonName: string;
  scientificName: string;
  quantity: number;
  userId: string;
};

export type MockTransfer = {
  id: string;
  token: string;
  transferorId: string;
  transferorName: string;
  transferorPhone: string;
  transferorAddress: string;
  receiverPhone: string;
  speciesId: string;
  commonName: string;
  scientificName: string;
  quantity: number;
  status: "PENDING" | "COMPLETED";
  createdAt: string;
};

export function getMockUser(): MockUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as MockUser;
  } catch {
    return null;
  }
}

export function setMockUser(user: MockUser): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearMockUser(): void {
  localStorage.removeItem(USER_KEY);
}

function getMockUsers(): (MockUser & { password: string })[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function setMockUsers(users: (MockUser & { password: string })[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function registerMockUser(user: MockUser, password: string): void {
  const users = getMockUsers();
  const newUser = { ...user, password };
  setMockUsers([...users, newUser]);
  setMockUser(user);
}

export function loginMockUser(email: string, password: string): MockUser | null {
  const users = getMockUsers();
  const found = users.find((u) => u.email === email && u.password === password);
  if (!found) return null;
  const user: MockUser = {
    id: found.id,
    name: found.name,
    email: found.email,
    phone: found.phone,
    address: found.address,
  };
  setMockUser(user);
  return user;
}

export function getMockHoldings(userId?: string): MockHolding[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(HOLDINGS_KEY);
  if (!raw) return [];
  try {
    const list = JSON.parse(raw) as MockHolding[];
    return userId ? list.filter((h) => h.userId === userId) : list;
  } catch {
    return [];
  }
}

export function setMockHoldings(holdings: MockHolding[]): void {
  localStorage.setItem(HOLDINGS_KEY, JSON.stringify(holdings));
}

export function addMockHolding(holding: Omit<MockHolding, "id">): MockHolding {
  const list = getMockHoldings();
  const id = `h_${Date.now()}`;
  const newOne: MockHolding = { ...holding, id };
  setMockHoldings([...list, newOne]);
  return newOne;
}

export function updateMockHoldingQuantity(id: string, delta: number): void {
  const list = getMockHoldings();
  const idx = list.findIndex((h) => h.id === id);
  if (idx < 0) return;
  list[idx].quantity = Math.max(0, list[idx].quantity + delta);
  setMockHoldings([...list]);
}

export function getMockTransfers(): MockTransfer[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(TRANSFERS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as MockTransfer[];
  } catch {
    return [];
  }
}

export function setMockTransfers(transfers: MockTransfer[]): void {
  localStorage.setItem(TRANSFERS_KEY, JSON.stringify(transfers));
}

export function createMockTransfer(
  transferor: MockUser,
  receiverPhone: string,
  holding: MockHolding,
  quantity: number
): MockTransfer {
  const list = getMockTransfers();
  const token = `t_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  const t: MockTransfer = {
    id: `tr_${Date.now()}`,
    token,
    transferorId: transferor.id,
    transferorName: transferor.name,
    transferorPhone: transferor.phone,
    transferorAddress: transferor.address,
    receiverPhone,
    speciesId: holding.id,
    commonName: holding.commonName,
    scientificName: holding.scientificName,
    quantity,
    status: "PENDING",
    createdAt: new Date().toISOString(),
  };
  setMockTransfers([...list, t]);
  return t;
}

export function getMockTransferByToken(token: string): MockTransfer | null {
  return getMockTransfers().find((t) => t.token === token) ?? null;
}

export function completeMockTransfer(token: string, receiverId: string): void {
  const list = getMockTransfers();
  const idx = list.findIndex((t) => t.token === token);
  if (idx < 0) return;
  if (list[idx].status !== "PENDING") return;

  updateMockHoldingQuantity(list[idx].speciesId, -list[idx].quantity);
  list[idx].status = "COMPLETED";
  setMockTransfers([...list]);
  const t = list[idx];
  const holdings = getMockHoldings();
  const existing = holdings.find(
    (h) => h.userId === receiverId && h.scientificName === t.scientificName
  );
  if (existing) {
    existing.quantity += t.quantity;
    setMockHoldings([...holdings]);
  } else {
    addMockHolding({
      commonName: t.commonName,
      scientificName: t.scientificName,
      quantity: t.quantity,
      userId: receiverId,
    });
  }
}
