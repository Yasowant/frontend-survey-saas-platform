import type {
  Survey,
  SurveyResponse,
  User,
  Subscription,
  Invoice,
  Notification,
  AuditLog,
  Question,
  Section,
  ManagedUser,
  RoleRecord,
  Permission,
  PlanRecord,
} from "./types";

const isBrowser = typeof window !== "undefined";

export const KEYS = {
  auth: "ssm:auth",
  users: "ssm:users",
  surveys: "ssm:surveys",
  responses: "ssm:responses",
  subscription: "ssm:subscription",
  invoices: "ssm:invoices",
  notifications: "ssm:notifications",
  audit: "ssm:audit",
  settings: "ssm:settings",
  theme: "ssm:theme",
  seeded: "ssm:seeded:v2",
  managedUsers: "ssm:managed-users",
  roles: "ssm:roles",
  permissions: "ssm:permissions",
  plans: "ssm:plans",
} as const;

export function read<T>(key: string, fallback: T): T {
  if (!isBrowser) return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function write<T>(key: string, value: T): void {
  if (!isBrowser) return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function remove(key: string): void {
  if (!isBrowser) return;
  localStorage.removeItem(key);
}

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

// ---------- Domain helpers ----------
export const surveysRepo = {
  list: () => read<Survey[]>(KEYS.surveys, []),
  get: (id: string) => surveysRepo.list().find((s) => s.id === id),
  save: (s: Survey) => {
    const all = surveysRepo.list();
    const idx = all.findIndex((x) => x.id === s.id);
    if (idx >= 0) all[idx] = s;
    else all.unshift(s);
    write(KEYS.surveys, all);
  },
  remove: (id: string) =>
    write(
      KEYS.surveys,
      surveysRepo.list().filter((s) => s.id !== id),
    ),
};

export const responsesRepo = {
  list: () => read<SurveyResponse[]>(KEYS.responses, []),
  bySurvey: (id: string) => responsesRepo.list().filter((r) => r.surveyId === id),
  add: (r: SurveyResponse) => write(KEYS.responses, [r, ...responsesRepo.list()]),
};

export const notifRepo = {
  list: () => read<Notification[]>(KEYS.notifications, []),
  set: (n: Notification[]) => write(KEYS.notifications, n),
  unread: () => notifRepo.list().filter((n) => !n.read).length,
};

export const auditRepo = {
  list: () => read<AuditLog[]>(KEYS.audit, []),
  add: (entry: Omit<AuditLog, "id" | "timestamp">) => {
    const log: AuditLog = {
      ...entry,
      id: uid(),
      timestamp: new Date().toISOString(),
    };
    write(KEYS.audit, [log, ...auditRepo.list()].slice(0, 500));
  },
};

export const invoicesRepo = {
  list: () => read<Invoice[]>(KEYS.invoices, []),
  add: (i: Invoice) => write(KEYS.invoices, [i, ...invoicesRepo.list()]),
};

export const subRepo = {
  get: (): Subscription =>
    read<Subscription>(KEYS.subscription, {
      planId: "free",
      startedAt: new Date().toISOString(),
      renewsAt: new Date(Date.now() + 30 * 86400000).toISOString(),
    }),
  set: (s: Subscription) => write(KEYS.subscription, s),
};

export const authRepo = {
  get: () => read<{ user: User | null }>(KEYS.auth, { user: null }),
  set: (user: User | null) => write(KEYS.auth, { user }),
};

// ---------- Admin / Management repos ----------
function crud<T extends { id: string }>(key: string) {
  return {
    list: () => read<T[]>(key, []),
    get: (id: string) => read<T[]>(key, []).find((x) => x.id === id),
    save: (item: T) => {
      const all = read<T[]>(key, []);
      const idx = all.findIndex((x) => x.id === item.id);
      if (idx >= 0) all[idx] = item;
      else all.unshift(item);
      write(key, all);
    },
    remove: (id: string) =>
      write(
        key,
        read<T[]>(key, []).filter((x) => x.id !== id),
      ),
    setAll: (items: T[]) => write(key, items),
  };
}

export const managedUsersRepo = crud<ManagedUser>(KEYS.managedUsers);
export const rolesRepo = crud<RoleRecord>(KEYS.roles);
export const permissionsRepo = crud<Permission>(KEYS.permissions);
export const plansRepo = crud<PlanRecord>(KEYS.plans);

export type { Question, Section };
