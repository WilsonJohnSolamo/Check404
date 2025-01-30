export async function checkUrls(urls) {
  const results = await Promise.all(
    urls.map(async (url) => {
      try {
        const response = await fetch(url)
        return {
          url,
          status: response.ok ? "OK" : "BROKEN",
        }
      } catch {
        return { url, status: "BROKEN" }
      }
    })
  )
  console.log(results, "JOHN OPAW")
  return results
}
