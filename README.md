# Convite online · Caio & Carol

Site estático (HTML + CSS + JS), sem banco de dados nem integrações. Pronto para a Vercel.

## Configurações

| O quê | Onde |
|---|---|
| Número do WhatsApp que recebe as confirmações | `config.js` → `whatsapp` (atual: `554198706820`) |
| Mensagem pronta (com campos de adultos e crianças) | `config.js` → `mensagem` |
| Chave Pix de presente | `config.js` → `pix` |
| Data/hora da contagem regressiva | `index.html` → `data-alvo="2026-10-31T12:30:00-03:00"` |
| Endereço do site (prévia do link) | `index.html` → linhas com `https://caio-e-carol.vercel.app` |

## Publicar na Vercel

1. Em vercel.com → **Add New… → Project**, importe este repositório.
2. Framework Preset: **Other**. Não precisa de comando de build nem de pasta de saída.
3. Clique em **Deploy**.
4. Copie a URL gerada (ou o domínio próprio), cole em `index.html` no lugar de `https://SEU-SITE.vercel.app` e faça um novo commit. A Vercel publica a nova versão sozinha.

## Prévia no WhatsApp

- Título: **"Você recebeu um convite especial de Caio e de Carol"**
- Imagem: `assets/og-image.jpg` (1200×630, com "Caio & Carol")
- O WhatsApp guarda a prévia em cache. Teste com um link que você **ainda não enviou**. Se precisar forçar a atualização, envie o link com `?v=2` no final.
- Para conferir antes de enviar: https://www.opengraph.xyz ou o Sharing Debugger do Facebook.

## Flores

Elementos em aquarela e traço fino (PNG com fundo transparente, convertidos para WebP para carregar rápido no celular):

- `assets/buque-topo.webp`: buquê do canto superior esquerdo
- `assets/buque-base.webp`: buquê do canto inferior direito
- `assets/ramo-traco.webp` e `assets/rosa-traco.webp`: desenhos em traço fino

Posição e tamanho ficam em `styles.css` (`.buque--topo`, `.buque--base`, `.traco--ramo`, `.traco--rosa`).
A imagem de prévia (`assets/og-image.jpg`) é gerada a partir de `og/og-template.html`.

## Música e fotos

- Música de abertura: `assets/musica.mp3` (Eu e Minha Casa · Julliany Souza & Léo Brandão, comprimida para 96 kbps). Toca quando o convidado toca em **Abrir convite**. Os celulares não deixam tocar som sozinho sem esse toque. O botão redondo no canto pausa ou volta a tocar.
- Mural do casal: `assets/foto-1.webp`, `foto-2.webp`, `foto-3.webp` (recortadas em 4:5 e clareadas). Para trocar, substitua os arquivos mantendo os nomes.
- Os arquivos originais enviados (PNG, JPEG, MP3) ficam na raiz do repositório e não são publicados (`.vercelignore`).

## Estrutura

```
index.html        página do convite + metatags de compartilhamento
styles.css        visual
fonts.css         fontes hospedadas no próprio site
config.js         ⚠️ número do WhatsApp e mensagem
script.js         monta o link do WhatsApp
assets/           flores, fontes, imagem de prévia, ícones
og/               modelo usado para gerar a imagem de prévia
vercel.json       configuração de cache
```
