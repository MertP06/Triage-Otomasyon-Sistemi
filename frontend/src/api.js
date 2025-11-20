const BASE_URL = "http://localhost:8080";

export function authHeader(auth) {
    console.log("🧪 authHeader gelen:", auth);
    if (!auth || !auth.username || !auth.password) {
        console.warn("❌ Eksik auth bilgisi:", auth);
        return {};
    }
    const token = btoa(`${auth.username}:${auth.password}`);
    console.log("✅ Authorization header:", `Basic ${token}`);
    return { Authorization: `Basic ${token}` };
}

export async function apiGet(path, auth) {
    const res = await fetch(`${BASE_URL}${path}`, {
        headers: { ...authHeader(auth) },
    });
    if (!res.ok) {
        throw await res.json().catch(() => ({
            status: res.status,
            message: res.statusText,
        }));
    }
    return res.json();
}

export async function apiPost(path, body, auth) {
    const res = await fetch(`${BASE_URL}${path}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...authHeader(auth),
        },
        body: JSON.stringify(body),
    });
    if (!res.ok) {
        throw await res.json().catch(() => ({
            status: res.status,
            message: res.statusText,
        }));
    }
    return res.json();
}

export async function apiPatch(path, auth) {
    const res = await fetch(`${BASE_URL}${path}`, {
        method: "PATCH",
        headers: { ...authHeader(auth) },
    });
    if (!res.ok) {
        throw await res.json().catch(() => ({
            status: res.status,
            message: res.statusText,
        }));
    }
    return res.json();
}
