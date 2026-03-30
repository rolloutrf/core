export async function fetchCached(url: string): Promise<Response> {
  const key = `_ghc_${url}`
  try {
    const cached = sessionStorage.getItem(key)
    if (cached) return new Response(cached, { status: 200 })
  } catch {}

  const res = await fetch(url)
  if (!res.ok) return res

  const text = await res.text()
  try { sessionStorage.setItem(key, text) } catch {}
  return new Response(text, { status: 200 })
}
