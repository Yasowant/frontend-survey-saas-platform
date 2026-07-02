import { api } from "@/shared/api/axios";

export interface ApiNotification {
  _id: string;
  userId: string;
  type: "survey_created" | "survey_published" | "survey_closed" | "system";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export const getNotifications = async () => {
  const response = await api.get("/notifications");
  return response.data;
};

export const markNotificationRead = async (id: string) => {
  const response = await api.patch(`/notifications/${id}/read`);
  return response.data;
};

export const markAllNotificationsRead = async () => {
  const response = await api.patch("/notifications/read-all");
  return response.data;
};
