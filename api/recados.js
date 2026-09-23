// Mural de recados: guarda cada recado como um arquivo JSON no Vercel Blob.
// Precisa da variável BLOB_READ_WRITE_TOKEN, criada ao conectar um Blob Store ao projeto.
const { put, list } = require("@vercel/blob");

const PASTA = "recados/";
const MAX_NOME = 40;
const MAX_MENSAGEM = 300;

const limpar = (texto, max) =>
  String(texto || "")
    .replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, max);

const lerCorpo = (req) =>
  new Promise((resolve) => {
    if (req.body && typeof req.body === "object") return resolve(req.body);
    let dados = "";
    req.on("data", (c) => { dados += c; if (dados.length > 10000) req.destroy(); });
    req.on("end", () => { try { resolve(JSON.parse(dados || "{}")); } catch (e) { resolve({}); } });
  });

module.exports = async (req, res) => {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return res.status(200).json({ configurado: false, recados: [] });
  }

  try {
    if (req.method === "GET") {
      const { blobs } = await list({ prefix: PASTA, limit: 1000 });
      const recados = (await Promise.all(
        blobs.map((b) => fetch(b.url).then((r) => r.json()).catch(() => null))
      )).filter(Boolean);
      recados.sort((a, b) => (b.data || "").localeCompare(a.data || ""));
      res.setHeader("Cache-Control", "public, s-maxage=15, stale-while-revalidate=60");
      return res.status(200).json({ configurado: true, recados });
    }

    if (req.method === "POST") {
      const corpo = await lerCorpo(req);
      if (corpo.site) return res.status(200).json({ ok: true }); // armadilha para robôs
      const nome = limpar(corpo.nome, MAX_NOME);
      const mensagem = limpar(corpo.mensagem, MAX_MENSAGEM);
      if (nome.length < 2 || mensagem.length < 3) {
        return res.status(400).json({ erro: "Preencha seu nome e o recado." });
      }
      const recado = { nome, mensagem, data: new Date().toISOString() };
      const id = Date.now() + "-" + Math.random().toString(36).slice(2, 8);
      await put(PASTA + id + ".json", JSON.stringify(recado), {
        access: "public",
        contentType: "application/json",
        addRandomSuffix: false,
      });
      return res.status(201).json({ ok: true, recado });
    }

    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ erro: "Método não permitido." });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ erro: "Não foi possível acessar o mural agora." });
  }
};
