(function () {
  var cfg = window.CONVITE || {};
  var numero = String(cfg.whatsapp || "").replace(/\D/g, "");
  var texto = encodeURIComponent(cfg.mensagem || "");
  var link = "https://wa.me/" + numero + "?text=" + texto;

  var botao = document.getElementById("botao-whatsapp");
  if (botao) botao.href = link;
})();
