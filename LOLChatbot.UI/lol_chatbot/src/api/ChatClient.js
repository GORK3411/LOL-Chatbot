import { apiRequest } from "./apiClient";

function buildQueryString(params) {
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      query.append(key, value);
    }
  }

  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
}

export function getChatById(id) {
  return apiRequest(`/api/chat/${id}`, {
    method: "GET",
  });
}

export function createChat(chatName) {
  return apiRequest(`/api/chat${buildQueryString({ chatName })}`, {
    method: "POST",
  });
}

export function deleteChat(id) {
  return apiRequest(`/api/chat/delete/${id}`, {
    method: "DELETE",
  });
}

export function getChatsByUserId(userId) {
  return apiRequest(`/api/chat/user/${userId}`, {
    method: "GET",
  });
}

export function addMessageToChat(chatId, message) {
  return apiRequest(
    `/api/chat/${chatId}/messages${buildQueryString({ message })}`,
    {
      method: "POST",
    },
  );
}

export function renameChat(id, newName) {
  return apiRequest(`/api/chat/${id}/rename${buildQueryString({ newName })}`, {
    method: "PUT",
  });
}
