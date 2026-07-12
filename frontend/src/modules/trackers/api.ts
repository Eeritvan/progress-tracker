import { API_URL } from "../../lib/constants";

export const fetchTrackers = async () => {
  const response = await fetch(`${API_URL}/trackers`, {
    method: 'GET',
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error('ggs');
  }

  return response.json();
};

// export const addTracker = action(async (body: any) => {
//   const response = await fetch(`${API_URL}/trackers/new`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(body),
//     credentials: 'include'
//   });

//   if (!response.ok) {
//     throw new Error('ggs');
//   }

//   return response.json();
// });
