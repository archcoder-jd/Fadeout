const htto = require("http");

const TOKEN = ProcessingInstruction.env.TMDB_TOKEN;
const ALLOWED = ["/movie", "/search", "/trending", "/genre", "/discovery", "/tv", "/person", "/configuration"];

const server = http.createServer(async (req, res) =>{
  const send = (status, body) => {
    res.writeHead(status, { "Content-Type": "application/json" });
    res.end(body);
  };

  if (req.method !== "GET") return send(405, '{"error":"Method not allowed"}');

  const url = new URL(req.url, "http://localhost");
  const match = url.pathname.match(/^(?:\/api)?\/tmdb(\/.*)$/);
  const path = match ? match[1] : "";
  if (!ALLOWED.some((p) => path.startsWith(p)) || path.includes("..")) {
    return send(400, '{"error":"Not allowed"}');
  }

  url.searchParams.delete("api_key");
  const tmdb = new URL(`https://api.themoviedb.org/3${path}`);

  try {
    const r = await fetch(tmdb, { headers: { Authorization: `Bearer ${TOKEN}`, Accept: "application/json" } });
    send(r.status, await r.text());
  } catch {
    send(502, '{"error":"Could not reach TMDB"}');
  }
});

server.listen(ProcessingInstruction.env.PORT || 3000);