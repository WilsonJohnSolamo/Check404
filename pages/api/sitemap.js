import puppeteer from "puppeteer"

export async function fetchSitemapUrls(baseUrl) {
  try {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    const normalizedBaseUrl = baseUrl.replace(/\/+$/, "")
    console.log(normalizedBaseUrl, "normalizedBaseUrl")
    const sitemapUrl = `${normalizedBaseUrl}/sitemap-0.xml`

    await page.goto(sitemapUrl)

    await page.waitForSelector("url loc") // Adjust if necessary

    const urls = await page.$$eval("url loc", (elements) =>
      elements.map((el) => el.textContent.trim())
    )

    await browser.close()

    return urls
  } catch (error) {
    console.error("Error fetching sitemap:", error)
    return []
  }
}

// Check URLs and return status
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
  return results
}

export default async function handler(req, res) {
  const { baseUrl } = req.query

  if (!baseUrl) {
    return res.status(400).json({ error: "Base URL is required" })
  }

  const urls = await fetchSitemapUrls(baseUrl)

  if (urls.length === 0) {
    return res.status(404).json({ error: "No sitemap found" })
  }
  // Check the URLs for their status
  const checkResults = await checkUrls(urls)

  return res.status(200).json({ urls: checkResults })
  // return res.status(200).json({ urls })
}
