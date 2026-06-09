import { KEYS, write, read, uid } from "./storage";
import type { ManagedUser, RoleRecord, Permission, PlanRecord } from "./types";

const FIRST = ["Alex", "Sam", "Jordan", "Taylor", "Riya", "Aarav", "Priya", "Diego", "Mei", "Noah", "Liam", "Olivia", "Emma", "Lucas", "Zara", "Kai"];
const LAST = ["Carter", "Patel", "Nguyen", "Garcia", "Lee", "Brown", "Khan", "Smith", "Cohen", "Rossi", "Müller", "Tanaka", "Silva", "Kumar"];
const STATUSES = ["active", "active", "active", "inactive", "suspended"] as const;

const rand = <T,>(a: readonly T[]) => a[Math.floor(Math.random() * a.length)];
const randInt = (n: number, m: number) => Math.floor(Math.random() * (m - n + 1)) + n;

const PERMISSIONS: Omit<Permission, "id">[] = [
  { key: "surveys.view", name: "View Surveys", description: "View list of surveys", module: "Surveys" },
  { key: "surveys.create", name: "Create Survey", description: "Create new surveys", module: "Surveys" },
  { key: "surveys.edit", name: "Edit Survey", description: "Modify existing surveys", module: "Surveys" },
  { key: "surveys.delete", name: "Delete Survey", description: "Remove surveys", module: "Surveys" },
  { key: "surveys.publish", name: "Publish Survey", description: "Publish surveys live", module: "Surveys" },
  { key: "responses.view", name: "View Responses", description: "View survey responses", module: "Responses" },
  { key: "responses.export", name: "Export Responses", description: "Export response data", module: "Responses" },
  { key: "analytics.view", name: "View Analytics", description: "Access analytics dashboard", module: "Analytics" },
  { key: "users.view", name: "View Users", description: "View user list", module: "Users" },
  { key: "users.manage", name: "Manage Users", description: "Create, edit, delete users", module: "Users" },
  { key: "roles.manage", name: "Manage Roles", description: "Manage roles & permissions", module: "Roles" },
  { key: "billing.view", name: "View Billing", description: "View invoices & subscription", module: "Billing" },
  { key: "billing.manage", name: "Manage Billing", description: "Change plans & payment", module: "Billing" },
  { key: "settings.manage", name: "Manage Settings", description: "Edit organization settings", module: "Settings" },
];

export function seedAdminData(force = false) {
  if (typeof window === "undefined") return;
  if (!force && read<Permission[]>(KEYS.permissions, []).length > 0) return;

  // Permissions
  const perms: Permission[] = PERMISSIONS.map((p) => ({ ...p, id: uid() }));
  write(KEYS.permissions, perms);

  const all = perms.map((p) => p.id);
  const editor = perms.filter((p) => !p.key.startsWith("users") && !p.key.startsWith("roles") && p.key !== "billing.manage" && p.key !== "settings.manage").map((p) => p.id);
  const viewer = perms.filter((p) => p.key.endsWith(".view")).map((p) => p.id);

  // Roles
  const roles: RoleRecord[] = [
    { id: uid(), name: "Administrator", description: "Full access to all modules", permissionIds: all, createdAt: new Date().toISOString() },
    { id: uid(), name: "Editor", description: "Create and manage surveys & responses", permissionIds: editor, createdAt: new Date().toISOString() },
    { id: uid(), name: "Viewer", description: "Read-only access", permissionIds: viewer, createdAt: new Date().toISOString() },
    { id: uid(), name: "Billing Manager", description: "Manage subscription & invoices", permissionIds: perms.filter((p) => p.module === "Billing").map((p) => p.id), createdAt: new Date().toISOString() },
  ];
  write(KEYS.roles, roles);

  // Users
  const users: ManagedUser[] = Array.from({ length: 24 }).map(() => {
    const fn = rand(FIRST), ln = rand(LAST);
    return {
      id: uid(),
      firstName: fn,
      lastName: ln,
      email: `${fn}.${ln}`.toLowerCase() + "@acme.com",
      phone: `+1 555 ${randInt(100, 999)} ${randInt(1000, 9999)}`,
      roleId: rand(roles).id,
      status: rand(STATUSES),
      createdAt: new Date(Date.now() - randInt(1, 180) * 86400000).toISOString(),
      lastLogin: new Date(Date.now() - randInt(0, 30) * 86400000).toISOString(),
    };
  });
  write(KEYS.managedUsers, users);

  // Plans
  const plans: PlanRecord[] = [
    { id: uid(), name: "Free", price: 0, duration: "monthly", features: ["3 surveys", "100 responses/mo", "Basic analytics"], limits: { surveys: 3, responses: 100, users: 1 }, status: "active", createdAt: new Date().toISOString() },
    { id: uid(), name: "Basic", price: 19, duration: "monthly", features: ["25 surveys", "5,000 responses/mo", "Email support", "Advanced analytics"], limits: { surveys: 25, responses: 5000, users: 5 }, status: "active", createdAt: new Date().toISOString() },
    { id: uid(), name: "Premium", price: 49, duration: "monthly", features: ["Unlimited surveys", "Unlimited responses", "Priority support", "Custom branding", "API access"], limits: { surveys: 9999, responses: 999999, users: 50 }, status: "active", createdAt: new Date().toISOString() },
    { id: uid(), name: "Enterprise", price: 199, duration: "monthly", features: ["Everything in Premium", "SSO/SAML", "Dedicated CSM", "SLA 99.99%"], limits: { surveys: 99999, responses: 9999999, users: 9999 }, status: "inactive", createdAt: new Date().toISOString() },
  ];
  write(KEYS.plans, plans);
}
