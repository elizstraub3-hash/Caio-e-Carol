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

/* ---------- Mural de recados ---------- */
(function () {
  var trilho = document.querySelector(".js-recados-trilho");
  var form = document.querySelector(".js-form-recado");
  if (!trilho || !form) return;

  var controles = document.querySelector(".recados__controles");
  var contador = document.querySelector(".js-recados-contador");
  var aviso = document.querySelector(".js-recado-aviso");
  var contagem = document.querySelector(".js-recado-contagem");
  var atual = 0;
  var automatico = null;

  var slides = function () { return trilho.querySelectorAll(".recado"); };

  var criarSlide = function (r) {
    var fig = document.createElement("figure");
    fig.className = "recado";
    var q = document.createElement("blockquote");
    q.textContent = r.mensagem;
    var c = document.createElement("figcaption");
    c.textContent = r.nome;
    fig.appendChild(q); fig.appendChild(c);
    return fig;
  };

  var irPara = function (i) {
    var lista = slides();
    if (!lista.length) return;
    atual = (i + lista.length) % lista.length;
    trilho.scrollTo({ left: lista[atual].offsetLeft - 20, behavior: "smooth" });
    atualizarContador();
  };
  var atualizarContador = function () {
    var total = slides().length;
    controles.hidden = total < 2;
    contador.textContent = (atual + 1) + " / " + total;
  };
  var iniciarAuto = function () {
    clearInterval(automatico);
    if (slides().length < 2) return;
    automatico = setInterval(function () { irPara(atual + 1); }, 6000);
  };
  var pararAuto = function () { clearInterval(automatico); };

  // descobre o slide visível quando o convidado arrasta com o dedo
  var t;
  trilho.addEventListener("scroll", function () {
    clearTimeout(t);
    t = setTimeout(function () {
      var centro = trilho.scrollLeft + trilho.clientWidth / 2, melhor = 0, dist = Infinity;
      slides().forEach(function (s, i) {
        var d = Math.abs(s.offsetLeft + s.clientWidth / 2 - centro);
        if (d < dist) { dist = d; melhor = i; }
      });
      atual = melhor; atualizarContador();
    }, 120);
  });
  ["touchstart", "pointerdown", "focusin"].forEach(function (ev) { trilho.addEventListener(ev, pararAuto, { passive: true }); });
  document.querySelector(".js-recados-ant").addEventListener("click", function () { pararAuto(); irPara(atual - 1); });
  document.querySelector(".js-recados-prox").addEventListener("click", function () { pararAuto(); irPara(atual + 1); });

  var mostrar = function (recados) {
    if (!recados.length) return;
    trilho.innerHTML = "";
    recados.forEach(function (r) { trilho.appendChild(criarSlide(r)); });
    atual = 0; atualizarContador(); iniciarAuto();
  };

  fetch("/api/recados")
    .then(function (r) { return r.json(); })
    .then(function (dados) {
      if (!dados.configurado) return; // mural ainda não ativado na Vercel
      form.hidden = false;
      mostrar(dados.recados || []);
    })
    .catch(function () {});

  var textarea = form.querySelector("textarea");
  textarea.addEventListener("input", function () { contagem.textContent = textarea.value.length + " / 300"; });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var botao = form.querySelector("button[type=submit]");
    var dados = { nome: form.nome.value, mensagem: form.mensagem.value, site: form.site.value };
    botao.disabled = true; botao.textContent = "Enviando...";
    aviso.textContent = "";
    fetch("/api/recados", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(dados) })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) {
        if (!res.ok) throw new Error(res.j.erro || "Erro");
        if (res.j.recado) {
          var inicial = trilho.querySelector(".recado--inicial");
          if (inicial) inicial.remove();
          trilho.insertBefore(criarSlide(res.j.recado), trilho.firstChild);
          atual = 0; atualizarContador(); irPara(0); iniciarAuto();
        }
        form.reset(); contagem.textContent = "0 / 300";
        aviso.textContent = "Recado enviado com carinho! 🤍";
      })
      .catch(function (err) { aviso.textContent = err.message && err.message !== "Erro" ? err.message : "Não foi possível enviar agora. Tente novamente."; })
      .then(function () { botao.disabled = false; botao.textContent = "Enviar recado"; });
  });
})();
