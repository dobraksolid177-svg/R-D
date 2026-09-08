export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).send("Method not allowed");
  }

  const { url, filename } = req.query;

  if (!url) {
    return res.status(400).send("URL belum diberikan.");
  }

  let target;

  try {
    target = new URL(url);
  } catch {
    return res.status(400).send("URL tidak valid.");
  }

  if (!["http:", "https:"].includes(target.protocol)) {
    return res.status(400).send("Protocol tidak didukung.");
  }

  try {
    const response = await fetch(target, {
      redirect: "follow"
    });

    if (!response.ok || !response.body) {
      return res.status(502).send(
        `Gagal mengambil media. HTTP ${response.status}`
      );
    }

    let safeName =
      filename ||
      "media-download";

    safeName = String(safeName)
      .replace(/[<>:"/\\|?*\x00-\x1F]/g, "_")
      .trim()
      .slice(0, 180);

    if (!safeName) {
      safeName = "media-download";
    }

    const contentType =
      response.headers.get("content-type") ||
      "application/octet-stream";

    res.setHeader(
      "Content-Type",
      contentType
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${safeName}"`
    );

    const length =
      response.headers.get("content-length");

    if (length) {
      res.setHeader(
        "Content-Length",
        length
      );
    }

    const reader =
      response.body.getReader();

    while (true) {
      const { done, value } =
        await reader.read();

      if (done) break;

      res.write(
        Buffer.from(value)
      );
    }

    res.end();

  } catch (error) {
    console.error(error);

    if (!res.headersSent) {
      res.status(500).send(
        "Download gagal."
      );
    }
  }
}