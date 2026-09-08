export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed"
    });
  }

  const { url } = req.query;

  if (!url) {
    return res.status(400).json({
      success: false,
      message: "URL belum diberikan."
    });
  }

  let target;

  try {
    target = new URL(url);
  } catch {
    return res.status(400).json({
      success: false,
      message: "URL tidak valid."
    });
  }

  if (!["http:", "https:"].includes(target.protocol)) {
    return res.status(400).json({
      success: false,
      message: "Protocol tidak didukung."
    });
  }

  try {
    const response = await fetch(target, {
      method: "HEAD",
      redirect: "follow"
    });

    if (!response.ok) {
      return res.status(400).json({
        success: false,
        message: `HTTP ${response.status}`
      });
    }

    const contentType =
      response.headers.get("content-type") ||
      "application/octet-stream";

    const contentLength =
      response.headers.get("content-length");

    const disposition =
      response.headers.get("content-disposition") || "";

    let filename = "media-download";

    const utf =
      disposition.match(/filename\*=UTF-8''([^;]+)/i);

    const normal =
      disposition.match(/filename="?([^"]+)"?/i);

    if (utf) {
      try {
        filename = decodeURIComponent(utf[1]);
      } catch {}
    } else if (normal) {
      filename = normal[1];
    }

    filename = filename
      .replace(/[<>:"/\\|?*\x00-\x1F]/g, "_")
      .trim()
      .slice(0, 180);

    return res.status(200).json({
      success: true,
      filename: filename || "media-download",
      contentType,
      size: contentLength
        ? Number(contentLength)
        : null
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Gagal membaca file."
    });
  }
}