import puppeteer from "puppeteer"

export async function checkUrls(urls) {
  const browser = await puppeteer.launch()
  const results = []

  for (let url of urls) {
    try {
      const page = await browser.newPage()
      await page.goto(url, { waitUntil: "domcontentloaded" })

      // Check the page status by evaluating the HTTP response status
      const status = await page.evaluate(() => {
        return document.readyState === "complete" ? "OK" : "BROKEN"
      })

      results.push({ url, status })
      await page.close()
    } catch (error) {
      // If an error occurs (e.g., 404), mark as broken
      results.push({ url, status: "BROKEN" })
    }
  }

  // Close the browser after all URL checks are done
  await browser.close()
  return results
}

// export async function checkUrls(urls) {
//   const results = await Promise.all(
//     urls.map(async (url) => {
//       try {
//         const response = await fetch(url)
//         return {
//           url,
//           status: response.ok ? "OK" : "BROKEN",
//         }
//       } catch {
//         return { url, status: "BROKEN" }
//       }
//     })
//   )
//   return results
// }
