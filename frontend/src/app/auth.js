export default async function isAuthenticated() {
    const resp = await fetch("/api/auth", {
        method: "POST",
    })

    return resp.status === 200;
}