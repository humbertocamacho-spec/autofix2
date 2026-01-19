import AsyncStorage from "@react-native-async-storage/async-storage";

export async function authFetch(
  url: string,
  options: RequestInit = {}
) {
  const token = await AsyncStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  return fetch(url, {
    ...options,
    headers,
  });
}
