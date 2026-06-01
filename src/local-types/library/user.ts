export interface IUser {
  id?: string;
  username?: string;
  name?: string;
  email?: string;
  picture?: string;
  image?: string;
}

// PUT /api/user/me — body allowlist per docs/user-api.md §3.
// Add new keys here as v1.5/v2 fields land (title, gender, linkedIn, etc.).
export interface IUpdateMePayload {
  username?: string;
}

export interface IUpdateMeResponse {
  message: string;
}

// PUT /api/user/me error envelope per docs/user-api.md §7:
// { success: false, statusCode, message: { <field>: "<message>" } | { error: "..." } }
export interface IUpdateMeErrorBody {
  success?: false;
  statusCode?: number;
  message?: Record<string, string> | string;
}
