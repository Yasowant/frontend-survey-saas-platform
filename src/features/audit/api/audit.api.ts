import { api } from "@/shared/api/axios";

export interface ApiAuditLog {
  _id: string;
  userId: {
    _id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  } | null;
  action: string;
  entityType: string;
  entityId: string;
  oldValue?: Record<string, unknown> | null;
  newValue?: Record<string, unknown> | null;
  createdAt: string;
}

export const getAuditLogs = async () => {
  const response = await api.get("/audit-logs");
  return response.data;
};
