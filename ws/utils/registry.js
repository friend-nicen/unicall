export const corpClients = new Map();
export const getConnectionCount = () => {
  let total = 0;
  for (const m of corpClients.values()) total += m.size;
  return total;
};
