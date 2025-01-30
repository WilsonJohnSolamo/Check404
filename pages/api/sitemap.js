import { toast } from "react-toastify" // Import Toastify

export async function fetchSitemapUrls(baseUrl) {
  try {
    // Ensure the base URL has no trailing slash
    const normalizedBaseUrl = baseUrl.replace(/\/+$/, "")
    const sitemapUrl = `${normalizedBaseUrl}/sitemap-0.xml`

    const response = await fetch(sitemapUrl)

    const text = await response.text()
    const parser = new DOMParser()
    const xml = parser.parseFromString(text, "application/xml")

    const urls = Array.from(xml.querySelectorAll("url loc")).map((loc) =>
      loc.textContent.trim()
    )

    return urls
  } catch (error) {
    toast.error("Error fetching sitemap: sitemap not found")
    return []
  }
}
