import { Permission, PermissionState } from '@prisma/client';

export const getHighestPermissionState = (states: Array<Permission>) => {
	let result: PermissionState = PermissionState.NONE;
	for (const permission of states) {
		if (permission.allowed === PermissionState.ALL) return PermissionState.ALL;
		if (permission.allowed === PermissionState.OWN) result = PermissionState.OWN;
		if (permission.allowed === PermissionState.NONE) continue;
	}
	return result;
};
