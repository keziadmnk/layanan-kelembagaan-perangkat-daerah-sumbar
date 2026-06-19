export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const BACKEND_URL = API_URL.replace(/\/api\/?$/, '');

export const toDocumentProxyPath = (path = '') => {
    if (!path) return '';

    try {
        if (/^https?:\/\//i.test(path)) {
            const url = new URL(path);
            return `${url.pathname}${url.search}`.replace(/^\/minio\//, '/dokumen/');
        }
    } catch {
        return path;
    }

    return path.replace(/^\/minio\//, '/dokumen/');
};

export const buildBackendUrl = (path = '') => {
    if (!path) return BACKEND_URL;
    if (/^https?:\/\//i.test(path)) return path;
    return `${BACKEND_URL}${path.startsWith('/') ? path : `/${path}`}`;
};

export const buildProtectedFileUrl = (path = '') => {
    const url = buildBackendUrl(toDocumentProxyPath(path));
    const token = localStorage.getItem('token');
    if (!token || /^blob:/i.test(url)) return url;

    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}token=${encodeURIComponent(token)}`;
};

export const fetchProtectedFileBlobUrl = async (path = '') => {
    const token = localStorage.getItem('token');
    const response = await fetch(buildBackendUrl(toDocumentProxyPath(path)), {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'File tidak ditemukan');
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
};

const DOCUMENT_VIEWER_STORAGE_KEY = 'documentViewerItems';

const readViewerItems = () => {
    try {
        return JSON.parse(localStorage.getItem(DOCUMENT_VIEWER_STORAGE_KEY) || '{}');
    } catch {
        return {};
    }
};

export const createDocumentViewerUrl = (path = '', name = 'Dokumen', returnTo = '/dashboard') => {
    const viewerId = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const items = readViewerItems();

    items[viewerId] = {
        path,
        name,
        createdAt: Date.now(),
        returnTo,
    };

    localStorage.setItem(DOCUMENT_VIEWER_STORAGE_KEY, JSON.stringify(items));
    return `/dokumen/viewer/${viewerId}`;
};

export const getDocumentViewerItem = (viewerId = '') => {
    const items = readViewerItems();
    return items[viewerId] || null;
};

export const removeDocumentViewerItem = (viewerId = '') => {
    const items = readViewerItems();
    delete items[viewerId];
    localStorage.setItem(DOCUMENT_VIEWER_STORAGE_KEY, JSON.stringify(items));
};

