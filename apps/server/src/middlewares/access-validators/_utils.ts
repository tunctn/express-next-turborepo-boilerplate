export const createPermissionKey = (userId: string) => {
  const baseKey = `permissions::user[${userId}]`;
  return (key: string) => `${baseKey}::${key}::`;
};
