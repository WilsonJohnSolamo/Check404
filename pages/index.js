import { useState } from "react"
import { toast } from "react-toastify"

export default function Home() {
  const [baseUrl, setBaseUrl] = useState("")
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [sitemapFound, setSitemapFound] = useState(true)

  const normalizeUrl = (url) => {
    let normalizedUrl = url.trim()

    // Add protocol if missing
    if (!/^https?:\/\//i.test(normalizedUrl)) {
      normalizedUrl = `https://${normalizedUrl}`
    }

    // Add "www." if missing
    const urlObject = new URL(normalizedUrl)
    if (!urlObject.hostname.startsWith("www.")) {
      urlObject.hostname = `www.${urlObject.hostname}`
    }

    return urlObject.toString()
  }

  const handleCheckUrls = async () => {
    setLoading(true)
    setResults([])
    setSitemapFound(true)

    try {
      const res = await fetch(`/api/sitemap?baseUrl=${baseUrl}`)
      console.log(baseUrl)

      const data = await res.json()

      if (res.status === 404) {
        setSitemapFound(false)
        toast.error("No Sitemap Found!")
        return
      }

      setResults(data.urls)
    } catch (error) {
      setSitemapFound(false)
      toast.error("No Sitemap Found!")
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="bg-[#1D1F22] px-[20px] py-[60px]">
      <div className="min-h-screen text-white max-w-[1440px] w-full mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">URL Checker</h1>
        <div className="flex justify-center mb-4">
          <input
            type="text"
            placeholder="Enter base URL"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            className="border px-4 py-2 rounded-l-md text-[#1D1F22]"
          />
          <button
            onClick={handleCheckUrls}
            disabled={loading}
            className="bg-orange-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 smooth"
          >
            {loading ? "Checking..." : "Check URLs"}
          </button>
        </div>

        {loading ? (
          <p className="text-center text-white">Loading...</p>
        ) : !sitemapFound ? (
          <div className="text-center text-red-500 font-bold mt-6">
            No Sitemap Found
          </div>
        ) : (
          <table className="w-full shadow-md rounded-md text-white">
            <thead>
              <tr className="bg-[#1D1F22] border-dashed border-2">
                <th className="px-4 py-2 text-left border-dashed border-2">
                  URL
                </th>
                <th className="px-4 py-2 text-left border-dashed border-2">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="">
              {results.map((result, index) => (
                <tr
                  key={index}
                  className={` transition-all duration-300 group mb-[10px] ${
                    result.status === "OK" ? " text-green-500" : "text-red-500"
                  }`}
                >
                  <td
                    className={`px-4 py-2 border-dashed border-2 ${
                      result.status === "OK"
                        ? "group-hover:border-green-500"
                        : "group-hover:border-red-500"
                    }`}
                  >
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-white hover:underline ${
                        result.status === "OK"
                          ? "group-hover:text-green-500"
                          : "group-hover:text-red-500"
                      }`}
                    >
                      {result.url}
                    </a>
                  </td>
                  <td
                    className={`px-4 py-2 border-dashed border-2 ${
                      result.status === "OK"
                        ? "group-hover:border-green-500"
                        : "group-hover:border-red-500"
                    }`}
                  >
                    {result.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

// import { useState } from "react"
// import { fetchSitemapUrls } from "../pages/api/sitemap"
// import { checkUrls } from "../pages/api/urlChecker"
// import { ToastContainer } from "react-toastify"
// import "react-toastify/dist/ReactToastify.css"

// export default function Home() {
//   const [baseUrl, setBaseUrl] = useState("")
//   const [results, setResults] = useState([])
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState(false)

//   const normalizeUrl = (url) => {
//     let normalizedUrl = url.trim()

//     // Add protocol if missing
//     if (!/^https?:\/\//i.test(normalizedUrl)) {
//       normalizedUrl = `https://${normalizedUrl}`
//     }

//     // Add "www." if missing
//     const urlObject = new URL(normalizedUrl)
//     if (!urlObject.hostname.startsWith("www.")) {
//       urlObject.hostname = `www.${urlObject.hostname}`
//     }

//     return urlObject.toString()
//   }

//   // Replaced to now use puppeeter
//   const handleCheckUrls = async () => {
//     const normalizedUrl = normalizeUrl(baseUrl)
//     setLoading(true)
//     setResults([])

//     try {
//       const urls = await fetchSitemapUrls(normalizedUrl)
//       const checkResults = await checkUrls(urls)
//       setResults(checkResults)
//     } catch (error) {
//       console.error("Error:", error)
//       setError("An error occurred. Please check the URL or try again later.")
//     }

//     setLoading(false)
//   }

//   const brokenLinks = results.filter((result) => result.status === "BROKEN")
//   const workingLinks = results.filter((result) => result.status === "OK")

//   return (
//     <div className="bg-[#1D1F22] px-[20px] py-[60px]">
//       <div className="min-h-screen text-white max-w-[1440px] w-full mx-auto">
//         <h1 className="text-2xl font-bold text-center mb-6">URL Checker</h1>
//         <div className="flex justify-center mb-[20px]">
//           <input
//             type="text"
//             placeholder="Enter base URL"
//             value={baseUrl}
//             onChange={(e) => setBaseUrl(e.target.value)}
//             className="border px-4 py-2 rounded-l-md text-[#1D1F22] outline-none"
//           />
//           <button
//             onClick={handleCheckUrls}
//             disabled={loading}
//             className="bg-orange-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 smooth"
//           >
//             {loading ? "Checking..." : "Check URLs"}
//           </button>
//         </div>
//         {/* <div className="border-2 border-dashed mb-[20px] px-4 py-2 w-fit place-self-center">
//           <div>test</div>
//         </div> */}
//         <table className="text-[16px] text-center place-self-center mb-[20px]">
//           <tbody>
//             <tr className="text-green-500 border-2 border-dashed">
//               <td className="border-2 border-dashed p-2">Working Links:</td>
//               <td className="border-2 border-dashed p-2">
//                 {workingLinks.length}
//               </td>
//             </tr>
//             <tr className="text-red-500">
//               <td className="border-2 border-dashed p-2">Broken Links:</td>
//               <td className="border-2 border-dashed p-2">
//                 {brokenLinks.length}
//               </td>
//             </tr>
//           </tbody>
//         </table>
//         <table className="w-full shadow-md rounded-md text-white">
//           <thead>
//             <tr className="bg-[#1D1F22] border-dashed border-2">
//               <th className="px-4 py-2 text-left border-dashed border-2">
//                 URL
//               </th>
//               <th className="px-4 py-2 text-left border-dashed border-2">
//                 Status
//               </th>
//             </tr>
//           </thead>
//           <tbody className="">
//             {results.map((result, index) => (
//               <tr
//                 key={index}
//                 className={` transition-all duration-300 group mb-[10px] ${
//                   result.status === "OK" ? " text-green-500" : "text-red-500"
//                 }`}
//               >
//                 <td
//                   className={`px-4 py-2 border-dashed border-2 ${
//                     result.status === "OK"
//                       ? "group-hover:border-green-500"
//                       : "group-hover:border-red-500"
//                   }`}
//                 >
//                   <a
//                     href={result.url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className={`text-white hover:underline ${
//                       result.status === "OK"
//                         ? "group-hover:text-green-500"
//                         : "group-hover:text-red-500"
//                     }`}
//                   >
//                     {result.url}
//                   </a>
//                 </td>
//                 <td
//                   className={`px-4 py-2 border-dashed border-2 ${
//                     result.status === "OK"
//                       ? "group-hover:border-green-500"
//                       : "group-hover:border-red-500"
//                   }`}
//                 >
//                   {result.status}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       <ToastContainer />
//     </div>
//   )
// }
