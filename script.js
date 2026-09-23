(function () {
  var cfg = window.CONVITE || {};

  /* ---------- WhatsApp ---------- */
  var numero = String(cfg.whatsapp || "").replace(/\D/g, "");
  var link = "https://wa.me/" + numero + "?text=" + encodeURIComponent(cfg.mensagem || "");
  document.querySelectorAll(".js-whatsapp").forEach(function (a) { a.href = link; });

  /* ---------- Contagem regressiva ---------- */
  var caixa = document.querySelector(".contagem");
  if (caixa) {
    var alvo = new Date(caixa.getAttribute("data-alvo")).getTime();
    var fim = document.querySelector(".contagem__fim");
    var campos = {};
    caixa.querySelectorAll("[data-unidade]").forEach(function (el) { campos[el.getAttribute("data-unidade")] = el; });
    var dois = function (n) { return n < 10 ? "0" + n : String(n); };

    var atualizar = function () {
      var falta = alvo - Date.now();
      if (falta <= 0) {
        caixa.hidden = true;
        fim.hidden = false;
        fim.textContent = falta > -12 * 3600 * 1000 ? "É hoje! 🤍" : "Obrigado por celebrar conosco!";
        clearInterval(timer);
        return;
      }
      var s = Math.floor(falta / 1000);
      campos.dias.textContent = Math.floor(s / 86400);
      campos.horas.textContent = dois(Math.floor(s % 86400 / 3600));
      campos.min.textContent = dois(Math.floor(s % 3600 / 60));
      campos.seg.textContent = dois(s % 60);
    };
    var timer = setInterval(atualizar, 1000);
    atualizar();
  }

  /* ---------- Pix ---------- */
  var pix = String(cfg.pix || "").replace(/\D/g, "");
  var pixFormatado = pix.length === 14
    ? pix.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5")
    : pix;
  document.querySelectorAll(".js-pix-texto").forEach(function (el) { el.textContent = pixFormatado; });

  document.querySelectorAll(".js-copiar-pix").forEach(function (botaoPix) {
    var rotulo = botaoPix.querySelector("span");
    var avisar = function (msg) {
      rotulo.textContent = msg;
      botaoPix.classList.add("copiado");
      setTimeout(function () { rotulo.textContent = "Copiar chave Pix"; botaoPix.classList.remove("copiado"); }, 2500);
    };
    var copiarAntigo = function () {
      var t = document.createElement("textarea");
      t.value = pix; t.setAttribute("readonly", ""); t.style.position = "fixed"; t.style.opacity = "0";
      document.body.appendChild(t); t.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (e) {}
      document.body.removeChild(t);
      avisar(ok ? "Chave copiada!" : "Chave: " + pix);
    };
    botaoPix.addEventListener("click", function () {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(pix).then(function () { avisar("Chave copiada!"); }, copiarAntigo);
      } else {
        copiarAntigo();
      }
    });
  });

  /* ---------- Mural: foto ampliada ---------- */
  var dialogo = document.querySelector(".foto-ampliada");
  if (dialogo && dialogo.showModal) {
    var img = dialogo.querySelector("img");
    document.querySelectorAll(".polaroid").forEach(function (b) {
      b.addEventListener("click", function () {
        img.src = b.getAttribute("data-foto");
        img.alt = b.querySelector("img").alt;
        dialogo.showModal();
      });
    });
    dialogo.addEventListener("click", function () { dialogo.close(); });
  }
})();

/* ---------- Abertura + música ---------- */
(function () {
  var abertura = document.querySelector(".abertura");
  var abrir = document.querySelector(".js-abrir");
  var audio = document.querySelector(".js-audio");
  var botao = document.querySelector(".js-musica");
  if (!abertura || !abrir) return;

  var marcar = function () { botao.classList.toggle("tocando", !audio.paused); };

  var tocar = function () {
    audio.volume = 0;
    var p = audio.play();
    if (p && p.then) p.then(subirVolume, function () {}).then(marcar, marcar);
    else subirVolume();
  };
  var subirVolume = function () {
    var v = 0;
    var t = setInterval(function () {
      v = Math.min(1, v + 0.05);
      try { audio.volume = v; } catch (e) {} // iOS ignora volume, sem problema
      if (v >= 1) clearInterval(t);
    }, 120);
  };

  abrir.addEventListener("click", function () {
    tocar();
    botao.hidden = false;
    abertura.classList.add("saindo");
    document.body.classList.remove("fechado");
    document.body.classList.add("aberto");
    setTimeout(function () { abertura.remove(); }, 900);
  });

  botao.addEventListener("click", function () {
    if (audio.paused) audio.play().then(marcar, marcar); else audio.pause();
    marcar();
  });
  audio.addEventListener("play", marcar);
  audio.addEventListener("pause", marcar);

  // pausa quando o convidado sai do app/aba (ex.: ao abrir o WhatsApp)
  document.addEventListener("visibilitychange", function () {
    if (document.hidden && !audio.paused) audio.pause();
  });
})();

/* ---------- Chuva de rosas ---------- */
(function () {
  var cfg = window.CONVITE || {};
  if (cfg.chuvaDeRosas === false) return;
  if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var imagens = ["assets/rosa-1.webp", "assets/rosa-2.webp"];
  var total = Math.max(1, Math.min(40, cfg.rosas || 14));
  var chuva = document.createElement("div");
  chuva.className = "chuva";
  chuva.setAttribute("aria-hidden", "true");
  document.body.appendChild(chuva);

  var sortear = function (min, max) { return min + Math.random() * (max - min); };

  var criarRosa = function (atraso) {
    var rosa = document.createElement("div");
    var img = document.createElement("img");
    var tamanho = sortear(18, 40);
    var duracao = sortear(9, 16);
    rosa.className = "chuva__rosa";
    rosa.style.left = sortear(-4, 98) + "vw";
    rosa.style.width = tamanho + "px";
    rosa.style.opacity = sortear(.75, 1).toFixed(2);
    rosa.style.animationDuration = duracao + "s";
    rosa.style.animationDelay = atraso + "s";
    img.src = imagens[Math.random() < .5 ? 0 : 1];
    img.alt = "";
    img.style.animationDuration = sortear(2.2, 4) + "s";
    img.style.animationDelay = -sortear(0, 4) + "s";
    rosa.appendChild(img);
    // quando termina de cair, nasce outra no topo
    rosa.addEventListener("animationend", function (e) {
      if (e.target !== rosa) return;
      rosa.remove();
      criarRosa(0);
    });
    chuva.appendChild(rosa);
  };

  for (var i = 0; i < total; i++) criarRosa(sortear(0, 12));
})();
