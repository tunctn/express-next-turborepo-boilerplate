import { createPermissionKey } from './_utils';

export type PlaylistAccessType = 'write' | 'read';

interface PlaylistAccessValidatorProps {
  playlistId: string;
  userId: string;
  type: PlaylistAccessType;
}

export const getPlaylistAccessValidatorKey = ({ playlistId, userId, type }: PlaylistAccessValidatorProps) => {
  return createPermissionKey(userId)(`playlist[${playlistId}]::type[${type}]`);
};

export const playlistAccessValidator = async ({}: PlaylistAccessValidatorProps) => {
  // const brand = await db.query.brands.findFirst({
  //   columns: { id: true },
  //   where: (b, { eq }) => eq(b.id, brandId),
  // });
  // if (!brand) return true; // Brand not found, handle it in controller.

  // const access = await db.query.userBrands.findFirst({
  //   columns: { type: true },
  //   where: (ub, { and, eq }) => and(eq(ub.brandId, brandId), eq(ub.userId, userId)),
  // });
  // // Has no access at all
  // if (!access) return false;

  // if (access.type === 'brand.owner') {
  //   if (type === 'brand.owner') return true;
  //   if (type === 'brand.manager') return true;
  //   return false;
  // }

  // if (access.type === 'brand.manager') {
  //   if (type === 'brand.manager') return true;
  //   return false;
  // }

  // // Then no access
  // return false;
  return true;
};
