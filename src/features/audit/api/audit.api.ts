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

export interface AuditLogPage {
  items: ApiAuditLog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const getAuditLogs = async (params: {
  page?: number;
  limit?: number;
  entityType?: string;
}) => {
  const response = await api.get("/audit-logs", { params });
  return response.data as { success: boolean; message: string; data: AuditLogPage };
};
