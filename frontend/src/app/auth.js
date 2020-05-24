export default async function isAuthenticated() {
    const resp = await fetch("/auth", {
        method: "POST",
    })

    return resp.status === 200;
}