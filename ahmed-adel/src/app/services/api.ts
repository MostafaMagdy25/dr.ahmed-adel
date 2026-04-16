/**
 * Centralized API service layer.
 * Replaces localStorage with real REST API calls to the backend.
 */

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

// Derive the server origin from API_BASE (strip trailing /api)
const SERVER_BASE = API_BASE.replace(/\/api\/?$/, '');

/**
 * Resolve a file path/URL to a full URL the browser can load.
 * - Absolute URLs (http/https/data:) are returned as-is.
 * - Relative paths like `/uploads/file.jpg` are prefixed with the server origin.
 * - Empty/falsy values return an empty string.
 */
export function resolveFileUrl(path: string | undefined | null): string {
  if (!path) return '';
  // Already absolute URL (Cloudinary, external, or data URI)
  if (/^(https?:\/\/|data:)/i.test(path)) return path;
  // Relative path — prepend server base
  return `${SERVER_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
}

// ─── Token helpers ──────────────────────────────────────────────────────────

export const getToken = (): string | null => localStorage.getItem('admin_token');
export const setToken = (token: string) => localStorage.setItem('admin_token', token);
export const removeToken = () => localStorage.removeItem('admin_token');

// ─── Base fetch wrapper ─────────────────────────────────────────────────────

async function request<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; message?: string; token?: string; admin?: unknown }> {
  const token = getToken();

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  };

  // Only set Content-Type for non-FormData bodies
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || `Request failed with status ${res.status}`);
  }

  return json;
}

// ─── Auth API ───────────────────────────────────────────────────────────────

export const authAPI = {
  login: async (email: string, password: string) => {
    const res = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (res.token) setToken(res.token);
    return res;
  },

  getMe: () => request('/auth/me'),

  updateProfile: (data: { name?: string; email?: string; currentPassword?: string; newPassword?: string }) =>
    request('/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),

  logout: () => {
    removeToken();
  },
};

// ─── Portfolio (aggregated public fetch) ────────────────────────────────────

export const portfolioAPI = {
  getAll: () => request('/portfolio'),
};

// ─── Hero API ───────────────────────────────────────────────────────────────

export const heroAPI = {
  get: () => request('/hero'),
  update: (data: Record<string, unknown>) =>
    request('/hero', { method: 'PUT', body: JSON.stringify(data) }),
};

// ─── About API ──────────────────────────────────────────────────────────────

export const aboutAPI = {
  get: () => request('/about'),
  update: (data: Record<string, unknown>) =>
    request('/about', { method: 'PUT', body: JSON.stringify(data) }),
};

// ─── Contact API (Contact Details) ──────────────────────────────────────────

export const contactAPI = {
  get: () => request('/contact'),
  update: (data: Record<string, unknown>) =>
    request('/contact', { method: 'PUT', body: JSON.stringify(data) }),
};

// ─── Messages API (Contact Form Submissions) ────────────────────────────────

export const messagesAPI = {
  getAll: (page = 1, limit = 10, search = '', isRead?: boolean) => {
    let url = `/messages?page=${page}&limit=${limit}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (isRead !== undefined) url += `&isRead=${isRead}`;
    return request(url);
  },
  create: (data: { name: string; email: string; subject: string; message: string }) =>
    request('/messages', { method: 'POST', body: JSON.stringify(data) }),
  markAsRead: (id: string, isRead: boolean) =>
    request(`/messages/${id}/read`, { method: 'PATCH', body: JSON.stringify({ isRead }) }),
  delete: (id: string) =>
    request(`/messages/${id}`, { method: 'DELETE' }),
};

// ─── Settings API ───────────────────────────────────────────────────────────

export const settingsAPI = {
  get: () => request('/settings'),
  update: (data: Record<string, unknown>) =>
    request('/settings', { method: 'PUT', body: JSON.stringify(data) }),
};

// ─── CRUD helper factory for collection endpoints ───────────────────────────

function createCrudAPI(endpoint: string) {
  return {
    getAll: () => request(`/${endpoint}`),
    getOne: (id: string) => request(`/${endpoint}/${id}`),
    create: (data: Record<string, unknown>) =>
      request(`/${endpoint}`, { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Record<string, unknown>) =>
      request(`/${endpoint}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) =>
      request(`/${endpoint}/${id}`, { method: 'DELETE' }),
    reorder: (orderedIds: string[]) =>
      request(`/${endpoint}/reorder`, { method: 'PUT', body: JSON.stringify({ orderedIds }) }),
  };
}

export const educationAPI = createCrudAPI('education');
export const skillsAPI = createCrudAPI('skills');
export const projectsAPI = createCrudAPI('projects');
export const volunteersAPI = createCrudAPI('volunteers');

// ─── Upload API ─────────────────────────────────────────────────────────────

export const uploadAPI = {
  upload: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return request('/upload', { method: 'POST', body: formData });
  },
  delete: (publicId: string) =>
    request(`/upload/${encodeURIComponent(publicId)}`, { method: 'DELETE' }),
};
