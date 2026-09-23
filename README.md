# Convite online · Caio & Carol

Site estático (HTML + CSS + JS), sem banco de dados nem integrações. Pronto para a Vercel.

## ⚠️ Campos para preencher

| O quê | Onde |
|---|---|
| Número do WhatsApp que recebe as confirmações | `config.js` → `whatsapp: ""` (ex.: `"5511987654321"`) |
| URL definitiva do site | `index.html` → troque **todas** as ocorrências de `https://SEU-SITE.vercel.app` (4 linhas marcadas com `⚠️ PREENCHER`) |

Enquanto o número estiver vazio, o botão ainda funciona: o WhatsApp abre com a mensagem escrita e pede para o convidado escolher o contato.

A mensagem pronta também pode ser editada em `config.js`.

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

## Trocar as flores pelos seus elementos

As flores estão em `assets/flores-topo.svg` (canto superior direito) e `assets/flores-base.svg` (canto inferior esquerdo).
Para usar os seus PNGs com fundo transparente, salve-os em `assets/` e troque o `src` das duas tags `<img class="flores ...">` em `index.html`. Posição e tamanho são ajustados em `styles.css` (`.flores--topo` e `.flores--base`).

A imagem de prévia é gerada a partir de `og/og-template.html`. Se você trocar as flores, gere a imagem de novo (print de 1200×630) ou monte uma no seu editor com o mesmo tamanho e salve como `assets/og-image.jpg`.

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
