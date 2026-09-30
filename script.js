/* ==========================================================
   CONFIGURAÇÃO (edite aqui)
   ========================================================== */
// WhatsApp com DDI + DDD, apenas dígitos (ex.: 5521999999999)
const WHATSAPP = "5521999999999";
// Medição: preencha para ativar (deixe "" para desligar)
const GA_ID = "";      // ex.: "G-XXXXXXXXXX"
const PIXEL_ID = "";   // ex.: "1234567890"

// Preços e quantidades do montador de pedido (valores de exemplo: ajuste com a doceria)
const PRODUTOS = [
  { id: "brig", nome: "Brigadeiro gourmet", un: "unidades", preco: 3.5, passo: 10, desc: "a partir de 10 un." },
  { id: "caju", nome: "Cajuzinho", un: "unidades", preco: 3.5, passo: 10, desc: "a partir de 10 un." },
  { id: "beij", nome: "Beijinho", un: "unidades", preco: 3.5, passo: 10, desc: "a partir de 10 un." },
  { id: "bomb", nome: "Bombom recheado", un: "unidades", preco: 5, passo: 10, desc: "a partir de 10 un." },
  { id: "bolo", nome: "Mini bolo", un: "unidades", preco: 18, passo: 1, desc: "porção individual" },
  { id: "kit", nome: "Kit presente", un: "kits", preco: 45, passo: 1, desc: "caixa personalizada" },
];

// Fotos de banco de imagens gratuito (Unsplash, uso livre). Para usar fotos reais da Kero Doces,
// coloque os arquivos na pasta /fotos e troque "src" por ex.: "fotos/casamento-01.jpg".
const foto = (id, w = 900) => `https://unsplash.com/photos/${id}/download?force=true&w=${w}`;
const EVENTOS = [
  { cat: "casamento", tipo: "Casamento", titulo: "Bolo com morangos e flores", id: "Xb5c2x6wJPc" },
  { cat: "festa", tipo: "Festa", titulo: "Macarons coloridos", id: "F3_MMTa0Sf4" },
  { cat: "presente", tipo: "Presente", titulo: "Caixa de chocolates", id: "--uvxmcdMv4" },
  { cat: "casamento", tipo: "Casamento", titulo: "Bolo de rosas delicadas", id: "QpocuNoy2oM" },
  { cat: "festa", tipo: "Festa", titulo: "Bolo com macarons e flores", id: "q-TT-UpsKKc" },
  { cat: "presente", tipo: "Presente", titulo: "Seleção de bombons", id: "dcPNZeSY3yk" },
  { cat: "casamento", tipo: "Casamento", titulo: "Três andares floridos", id: "MAj0LWX-TWk" },
  { cat: "festa", tipo: "Festa", titulo: "Mesa de doces pastel", id: "hV1gChgMa-k" },
  { cat: "presente", tipo: "Presente", titulo: "Trufas artesanais", id: "B1IuPxUOkH4" },
];

/* ==========================================================
   UTILIDADES
   ========================================================== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const brl = (n) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const waLink = (msg) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;

// Medição (GA4 + Meta Pixel) — só carrega se os IDs estiverem preenchidos
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
if (GA_ID) {
  const s = document.createElement("script");
  s.async = true; s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
  gtag("js", new Date()); gtag("config", GA_ID);
}
if (PIXEL_ID) {
  !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  fbq("init", PIXEL_ID); fbq("track", "PageView");
}
function track(nome, params = {}) {
  if (GA_ID) gtag("event", nome, params);
  if (PIXEL_ID && window.fbq) fbq("trackCustom", nome, params);
}

// Links de WhatsApp (botões, botão flutuante)
function bindWhats(el, msg) {
  el.href = waLink(msg);
  el.target = "_blank";
  el.rel = "noopener";
}
$$("[data-whats]").forEach((el) => {
  bindWhats(el, el.dataset.whats);
  el.addEventListener("click", () => track("whatsapp_click", { origem: el.textContent.trim() }));
});
const fab = $("#fab");
bindWhats(fab, "Olá! Vim pelo site e quero fazer um pedido.");
fab.addEventListener("click", () => track("whatsapp_click", { origem: "botao_flutuante" }));
$$("[data-track]").forEach((el) => el.addEventListener("click", () => track("clique_" + el.dataset.track)));
$("#ano").textContent = new Date().getFullYear();

/* ==========================================================
   MONTADOR DE PEDIDO
   ========================================================== */
const qtd = Object.fromEntries(PRODUTOS.map((p) => [p.id, 0]));
$("#itens").innerHTML = PRODUTOS.map((p) => `
  <li class="item" data-id="${p.id}">
    <div class="item-info"><b>${p.nome}</b><small>${brl(p.preco)} / un. · ${p.desc}</small></div>
    <div class="stepper">
      <button type="button" data-d="-1" aria-label="Diminuir ${p.nome}">−</button>
      <output aria-live="polite">0</output>
      <button type="button" data-d="1" aria-label="Aumentar ${p.nome}">+</button>
    </div>
  </li>`).join("");

function atualizaResumo() {
  const linhas = PRODUTOS.filter((p) => qtd[p.id] > 0);
  const total = linhas.reduce((t, p) => t + qtd[p.id] * p.preco, 0);
  $("#resumoLista").innerHTML = linhas.length
    ? linhas.map((p) => `<li><span>${qtd[p.id]}× ${p.nome}</span><span>${brl(qtd[p.id] * p.preco)}</span></li>`).join("")
    : '<li class="vazio">Nenhum item ainda</li>';
  $("#total").textContent = brl(total);
  $("#enviar").disabled = !linhas.length;
  $$(".item").forEach((li) => { li.querySelector("output").textContent = qtd[li.dataset.id]; li.classList.toggle("on", qtd[li.dataset.id] > 0); });
}
$("#itens").addEventListener("click", (e) => {
  const b = e.target.closest("button[data-d]");
  if (!b) return;
  const id = b.closest(".item").dataset.id;
  const p = PRODUTOS.find((x) => x.id === id);
  qtd[id] = Math.max(0, qtd[id] + Number(b.dataset.d) * p.passo);
  atualizaResumo();
});
$("#enviar").addEventListener("click", () => {
  const linhas = PRODUTOS.filter((p) => qtd[p.id] > 0);
  if (!linhas.length) return;
  const total = linhas.reduce((t, p) => t + qtd[p.id] * p.preco, 0);
  const data = $("#cData").value ? $("#cData").value.split("-").reverse().join("/") : "a combinar";
  const nome = $("#cNome").value.trim();
  const obs = $("#cObs").value.trim();
  const msg = [
    `Olá! Quero fazer uma encomenda${nome ? ` (${nome})` : ""}:`, "",
    ...linhas.map((p) => `• ${qtd[p.id]}× ${p.nome}`), "",
    `Total estimado: ${brl(total)}`,
    `Data do evento: ${data}`,
    obs ? `Observações: ${obs}` : "",
  ].filter((l, i, a) => l !== "" || (a[i - 1] !== "" && i < a.length - 1)).join("\n");
  track("pedido_enviado", { valor: total, itens: linhas.length });
  window.open(waLink(msg), "_blank", "noopener");
});
atualizaResumo();

/* ==========================================================
   FAQ: abre e fecha com animação (um aberto por vez)
   ========================================================== */
const faqs = $$(".faq-lista details");
faqs.forEach((d) => {
  const sum = d.querySelector("summary");
  const body = d.querySelector("p");
  d._anim = null;
  d.classList.toggle("is-open", d.open);
  sum.addEventListener("click", (e) => {
    e.preventDefault();
    if (d.classList.contains("is-open")) fechaFaq(d); else { faqs.forEach((o) => o !== d && fechaFaq(o)); abreFaq(d); }
  });
  d._body = body; d._sum = sum;
});
function abreFaq(d) {
  if (d._anim) d._anim.cancel();
  const ini = d.offsetHeight;
  d.open = true; d.classList.add("is-open");
  const fim = d._sum.offsetHeight + d._body.offsetHeight;
  d._anim = d.animate({ height: [ini + "px", fim + "px"] }, { duration: 420, easing: "cubic-bezier(.2,.7,.2,1)" });
  d._body.animate({ opacity: [0, 1], transform: ["translateY(-8px)", "none"] }, { duration: 420, delay: 60, easing: "ease-out", fill: "backwards" });
  d._anim.onfinish = d._anim.oncancel = () => { d._anim = null; d.style.height = ""; };
}
function fechaFaq(d) {
  if (!d.open && !d.classList.contains("is-open")) return;
  if (d._anim) d._anim.cancel();
  const ini = d.offsetHeight;
  d.classList.remove("is-open");
  d._body.animate({ opacity: [1, 0] }, { duration: 200, fill: "forwards" });
  d._anim = d.animate({ height: [ini + "px", d._sum.offsetHeight + "px"] }, { duration: 360, easing: "cubic-bezier(.4,0,.2,1)" });
  d._anim.onfinish = () => { d._anim = null; d.open = false; d.style.height = ""; d._body.getAnimations().forEach((x) => x.cancel()); };
  d._anim.oncancel = () => { d._anim = null; };
}

/* ==========================================================
   FOTOS DO CARDÁPIO
   ========================================================== */
$$(".panel[data-photo]").forEach((panel) => {
  const im = new Image();
  im.className = "panel-img"; im.alt = ""; im.loading = "lazy"; im.decoding = "async";
  im.onload = () => panel.classList.add("has-img");
  im.onerror = () => im.remove();
  im.src = foto(panel.dataset.photo, 700);
  panel.prepend(im);
  panel.dataset.peek = foto(panel.dataset.photo, 500);
});

/* ==========================================================
   GALERIA DE EVENTOS (filtro + lightbox)
   ========================================================== */
const track$ = $("#carouselTrack");
let listaAtual = EVENTOS;
function renderEventos(filtro) {
  listaAtual = filtro === "todos" ? EVENTOS : EVENTOS.filter((e) => e.cat === filtro);
  track$.innerHTML = listaAtual.map((e, i) =>
    `<figure class="slide" data-i="${i}" tabindex="0" role="button" aria-label="Ampliar: ${e.titulo}"><img src="${foto(e.id, 900)}" alt="${e.tipo}: ${e.titulo}" loading="lazy" decoding="async" onerror="this.remove()"><figcaption><small>${e.tipo}</small><b>${e.titulo}</b></figcaption></figure>`
  ).join("");
}
renderEventos("todos");

const lb = $("#lightbox"), lbTrack = $("#lbTrack"), lbView = $("#lbView");
let lbI = 0, lbChave = "", lbDx = 0;
const lbW = () => lbView.clientWidth;
function lbPos(animar) {
  lbTrack.style.transition = animar ? "transform .38s cubic-bezier(.2,.7,.2,1)" : "none";
  lbTrack.style.transform = `translate3d(${-lbI * lbW() + lbDx}px,0,0)`;
}
function lbAtualiza() {
  $("#lbCount").textContent = `${lbI + 1} / ${listaAtual.length}`;
  $("#lbPrev").style.opacity = lbI === 0 ? 0.3 : 1;
  $("#lbNext").style.opacity = lbI === listaAtual.length - 1 ? 0.3 : 1;
  // pré-carrega vizinhas para a troca ser instantânea
  [lbI - 1, lbI + 1, lbI + 2].forEach((k) => { const im = lbTrack.querySelectorAll("img")[k]; if (im && !im.src) im.src = im.dataset.src; });
}
function lbIr(i, animar = true) {
  lbI = Math.max(0, Math.min(listaAtual.length - 1, i));
  lbDx = 0; lbPos(animar); lbAtualiza();
}
function abreLB(i) {
  const chave = listaAtual.map((e) => e.id).join();
  if (chave !== lbChave) {
    lbChave = chave;
    lbTrack.innerHTML = listaAtual.map((e) =>
      `<figure class="lb-slide"><img data-src="${foto(e.id, 1200)}" alt="${e.tipo}: ${e.titulo}" draggable="false" decoding="async"><figcaption>${e.tipo} · ${e.titulo}</figcaption></figure>`
    ).join("");
  }
  lb.hidden = false; document.body.style.overflow = "hidden";
  lbI = Math.max(0, Math.min(listaAtual.length - 1, i));
  const atual = lbTrack.querySelectorAll("img")[lbI];
  if (!atual.src) atual.src = atual.dataset.src;
  lbDx = 0; lbPos(false); lbAtualiza();
  $("#lbClose").focus();
  track("galeria_ampliar", { foto: listaAtual[lbI].titulo });
}
function fechaLB() { lb.hidden = true; document.body.style.overflow = ""; }
$("#lbClose").onclick = fechaLB;
$("#lbPrev").onclick = () => lbIr(lbI - 1);
$("#lbNext").onclick = () => lbIr(lbI + 1);
window.addEventListener("resize", () => { if (!lb.hidden) lbPos(false); });
document.addEventListener("keydown", (e) => {
  if (lb.hidden) return;
  if (e.key === "Escape") fechaLB();
  if (e.key === "ArrowLeft") lbIr(lbI - 1);
  if (e.key === "ArrowRight") lbIr(lbI + 1);
});
// deslizar com o dedo/mouse, igual ao carrossel
(function () {
  let x0 = 0, y0 = 0, t0 = 0, ativo = false, horizontal = null, moveu = false;
  lbView.addEventListener("pointerdown", (e) => { ativo = true; horizontal = null; moveu = false; x0 = e.clientX; y0 = e.clientY; t0 = performance.now(); lbDx = 0; });
  lbView.addEventListener("pointermove", (e) => {
    if (!ativo) return;
    const dx = e.clientX - x0, dy = e.clientY - y0;
    if (horizontal === null && Math.hypot(dx, dy) > 8) horizontal = Math.abs(dx) > Math.abs(dy);
    if (!horizontal) return;
    moveu = true;
    if (!lbView.hasPointerCapture(e.pointerId)) lbView.setPointerCapture(e.pointerId);
    const fim = (lbI === 0 && dx > 0) || (lbI === listaAtual.length - 1 && dx < 0);
    lbDx = fim ? dx * 0.3 : dx;
    lbPos(false);
  });
  const solta = (e) => {
    if (!ativo) return; ativo = false;
    const dx = lbDx, v = Math.abs(dx) / Math.max(1, performance.now() - t0);
    if (horizontal && (Math.abs(dx) > lbW() * 0.18 || v > 0.45)) lbIr(lbI + (dx < 0 ? 1 : -1));
    else lbIr(lbI);
    if (!moveu && e.type === "pointerup" && !(e.target.closest && e.target.closest("img, figcaption"))) fechaLB();
  };
  lbView.addEventListener("pointerup", solta);
  lbView.addEventListener("pointercancel", solta);
})();
// abre só em clique de verdade (não quando o dedo arrastou o carrossel)
let downX = 0, downY = 0;
track$.addEventListener("pointerdown", (e) => { downX = e.clientX; downY = e.clientY; });
track$.addEventListener("click", (e) => {
  if (Math.hypot(e.clientX - downX, e.clientY - downY) > 10) return;
  const s = e.target.closest(".slide");
  if (s) abreLB(+s.dataset.i);
});
track$.addEventListener("keydown", (e) => { const s = e.target.closest(".slide"); if (s && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); abreLB(+s.dataset.i); } });

/* ==========================================================
   ANIMAÇÕES (GSAP)
   ========================================================== */
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const loader = $(".loader");
const desktop = window.matchMedia("(min-width: 861px)").matches;
let drag = null;
const ctrack = track$, car = $("#carousel");
const maxX = () => Math.min(0, car.clientWidth - ctrack.scrollWidth - parseFloat(getComputedStyle(car).paddingLeft));

if (!window.gsap || reduce) {
  // Sem GSAP ou movimento reduzido: tudo estático e funcional
  loader.remove();
  $$(".big-text .ch").forEach((c) => (c.style.opacity = 1));
  $$("[data-count]").forEach((n) => (n.textContent = n.dataset.count + n.dataset.suffix));
  $$(".chip").forEach((c) => c.addEventListener("click", () => {
    $$(".chip").forEach((x) => { x.classList.toggle("on", x === c); x.setAttribute("aria-selected", x === c); });
    renderEventos(c.dataset.filter);
  }));
  track$.parentElement.style.overflowX = "auto";
} else {
  gsap.registerPlugin(ScrollTrigger, Draggable);

  // --- Quebra textos em palavras / letras ---
  $$(".split").forEach((el) => {
    const words = el.textContent.trim().split(/\s+/);
    el.setAttribute("aria-label", el.textContent.trim());
    el.innerHTML = words.map((w) => `<span class="w" aria-hidden="true"><span>${w}</span></span>`).join(" ");
  });
  const bigText = $(".big-text");
  bigText.setAttribute("aria-label", bigText.textContent.trim());
  bigText.innerHTML = bigText.textContent.trim().split(/(\s+)/)
    .map((p) => (/^\s+$/.test(p) ? " " : `<span class="w" aria-hidden="true" style="display:inline-block">${[...p].map((c) => `<span class="ch">${c}</span>`).join("")}</span>`))
    .join("");

  gsap.set(".hero .eyebrow, .hero .swap, .hero .lead, .hero .acoes, .topo, .hero-scroll", { opacity: 0 });
  gsap.set(".hero .split .w > span, .cta .split .w > span", { yPercent: 115 });
  gsap.set(".fab", { scale: 0, opacity: 0 });

  // --- Loader: a logo se desenha; sai quando a página terminou de carregar ---
  const linhas = $$(".loader-mark .lg-lines path");
  linhas.forEach((p) => { const L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = L; });
  gsap.set(".loader-mark .lg-text", { opacity: 0, y: 8 });
  gsap.set(".loader-mark .lg-dot", { scale: 0, transformOrigin: "50% 50%" });
  const ready = Promise.race([
    Promise.all([
      new Promise((r) => (document.readyState === "complete" ? r() : window.addEventListener("load", r, { once: true }))),
      document.fonts ? document.fonts.ready : Promise.resolve(),
    ]),
    new Promise((r) => setTimeout(r, 4000)),
  ]);
  const draw = gsap.timeline();
  draw
    .to(linhas[0], { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut" })
    .to(linhas[1], { strokeDashoffset: 0, duration: 0.8, ease: "power2.inOut" }, 0.2)
    .to(linhas.slice(2), { strokeDashoffset: 0, duration: 0.7, ease: "power1.out", stagger: 0.025 }, 0.5)
    .to(".loader-mark .lg-text", { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, 0.9)
    .to(".loader-mark .lg-dot", { scale: 1, duration: 0.35, ease: "back.out(3)", stagger: 0.08 }, 1.1);
  Promise.all([ready, new Promise((r) => draw.eventCallback("onComplete", r))]).then(() => {
    gsap.timeline()
      .to(".loader-inner", { scale: 0.94, opacity: 0, duration: 0.45, delay: 0.25, ease: "power2.in" })
      .to(loader, { opacity: 0, duration: 0.4, ease: "power1.out" }, "-=0.15")
      .set(loader, { display: "none" })
      .to(".topo", { opacity: 1, duration: 0.6 }, "-=0.2")
      .to(".hero .eyebrow", { opacity: 1, duration: 0.6 }, "-=0.4")
      .to(".hero .split .w > span", { yPercent: 0, duration: 1, ease: "expo.out", stagger: 0.08 }, "-=0.4")
      .to(".hero .swap, .hero .lead, .hero .acoes, .hero-scroll", { opacity: 1, duration: 0.7, stagger: 0.1 }, "-=0.6")
      .to(".fab", { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(2)" }, "-=0.2");
  });

  // --- Troca de palavras no topo ---
  const palavras = ["casamentos", "aniversários", "presentes", "chás de bebê", "eventos corporativos"];
  const sw = $(".swap-w"); let si = 0;
  (function trocar() {
    gsap.delayedCall(2.6, () => {
      gsap.to(sw, { yPercent: -110, opacity: 0, duration: 0.4, ease: "power2.in", onComplete: () => {
        si = (si + 1) % palavras.length; sw.textContent = palavras[si];
        gsap.fromTo(sw, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.55, ease: "power3.out", onComplete: trocar });
      } });
    });
  })();

  // --- Orbs, anéis e parallax do topo (somente desktop) ---
  if (desktop) {
    gsap.to(".orb-1", { x: -60, y: 50, duration: 7, ease: "sine.inOut", repeat: -1, yoyo: true });
    gsap.to(".orb-2", { x: 70, y: -40, duration: 9, ease: "sine.inOut", repeat: -1, yoyo: true });
    gsap.to(".orb-3", { x: -30, y: 60, duration: 6, ease: "sine.inOut", repeat: -1, yoyo: true });
    gsap.to(".hero-logo .ring", { rotation: 360, duration: 60, ease: "none", repeat: -1 });
    gsap.to(".hero-logo .r2", { rotation: -360, duration: 90, ease: "none", repeat: -1 });
    gsap.from(".hero-logo img", { scale: 0.8, opacity: 0, duration: 1.6, ease: "expo.out", delay: 2.4 });
    gsap.to(".hero-content", { yPercent: 18, opacity: 0.2, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    gsap.to(".orb-1", { yPercent: 30, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    gsap.to(".orb-4", { scale: 1.25, duration: 5, ease: "sine.inOut", repeat: -1, yoyo: true });
  }

  // --- Marquee ---
  const loop = gsap.to(".marquee-track", { xPercent: -50, duration: 28, ease: "none", repeat: -1 });
  ScrollTrigger.create({ trigger: ".marquee", onUpdate: (self) => gsap.to(loop, { timeScale: 1 + Math.abs(self.getVelocity()) / 400, duration: 0.3, overwrite: true }) });
  ScrollTrigger.addEventListener("scrollEnd", () => gsap.to(loop, { timeScale: 1, duration: 0.6 }));

  // --- Texto que "acende" letra a letra ---
  gsap.to(".big-text .ch", { opacity: 1, ease: "none", stagger: 0.4, scrollTrigger: { trigger: ".big-text", start: "top 80%", end: "bottom 45%", scrub: true } });

  // --- Reveals e contadores ---
  $$(".reveal").forEach((el) => gsap.from(el, { y: 50, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%" } }));
  $$("[data-count]").forEach((n) => {
    const o = { v: 0 };
    gsap.to(o, { v: +n.dataset.count, duration: 2, ease: "power2.out", scrollTrigger: { trigger: n, start: "top 90%", once: true }, onUpdate: () => (n.textContent = Math.round(o.v) + n.dataset.suffix) });
  });

  // --- Cor do fundo muda suavemente entre seções ---
  $$("[data-bg]").forEach((sec) => ScrollTrigger.create({
    trigger: sec, start: "top 55%", end: "bottom 45%",
    onEnter: () => gsap.to(document.body, { backgroundColor: sec.dataset.bg, duration: 0.9 }),
    onEnterBack: () => gsap.to(document.body, { backgroundColor: sec.dataset.bg, duration: 0.9 }),
  }));

  // --- Botão flutuante: mensagem muda conforme a seção ---
  $$("[data-whats-msg]").forEach((sec) => ScrollTrigger.create({
    trigger: sec, start: "top 60%", end: "bottom 60%",
    onToggle: (s) => s.isActive && bindWhats(fab, sec.dataset.whatsMsg),
  }));

  // --- Cardápio: scroll horizontal com pin (desktop) e swipe (mobile) ---
  const mm = gsap.matchMedia();
  mm.add("(min-width: 861px)", () => {
    const pin = $(".doces-pin"), trk = $(".doces-track");
    const dist = () => trk.scrollWidth - (pin.clientWidth - $(".doces-head").offsetWidth - pin.clientWidth * 0.16);
    gsap.to(trk, { x: () => -Math.max(0, dist()), ease: "none", scrollTrigger: { trigger: ".doces", start: "top top", end: () => "+=" + Math.max(0, dist()), pin: true, scrub: 0.8, invalidateOnRefresh: true } });
    $$(".candy").forEach((c, i) => gsap.to(c, { y: -16, rotate: i % 2 ? 8 : -8, duration: 2.4 + i * 0.3, ease: "sine.inOut", repeat: -1, yoyo: true }));
  });
  mm.add("(max-width: 860px)", () => {
    $$(".panel").forEach((p) => gsap.from(p, { y: 60, opacity: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: p, start: "top 90%" } }));
  });

  // --- Carrossel de eventos: arrastar, botões, parallax, filtro e zoom ---
  const upd = () => {
    const w = window.innerWidth;
    $$(".slide img", ctrack).forEach((img) => {
      const r = img.parentElement.getBoundingClientRect();
      gsap.set(img, { x: ((r.left + r.width / 2) / w - 0.5) * -40 });
    });
  };
  drag = Draggable.create(ctrack, {
    type: "x", edgeResistance: 0.85, cursor: "grab", activeCursor: "grabbing",
    bounds: { minX: maxX(), maxX: 0 }, allowContextMenu: true,
    onDrag: upd, onThrowUpdate: upd,
  })[0];
  const step = () => (ctrack.firstElementChild ? ctrack.firstElementChild.offsetWidth + 22 : 300);
  const go = (dir) => gsap.to(ctrack, { x: gsap.utils.clamp(maxX(), 0, gsap.getProperty(ctrack, "x") - dir * step()), duration: 0.9, ease: "power3.out", onUpdate: () => { drag.update(); upd(); } });
  $("#next").addEventListener("click", () => go(1));
  $("#prev").addEventListener("click", () => go(-1));
  const rebound = () => { drag.applyBounds({ minX: maxX(), maxX: 0 }); };
  window.addEventListener("resize", rebound);
  ScrollTrigger.addEventListener("refresh", rebound);
  gsap.from(".slide", { y: 80, opacity: 0, scale: 0.94, duration: 1, stagger: 0.12, ease: "power3.out", scrollTrigger: { trigger: ".carousel", start: "top 85%" } });
  upd();

  $$(".chip").forEach((c) => c.addEventListener("click", () => {
    $$(".chip").forEach((x) => { x.classList.toggle("on", x === c); x.setAttribute("aria-selected", x === c); });
    track("galeria_filtro", { filtro: c.dataset.filter });
    gsap.to(".slide", { opacity: 0, y: 20, duration: 0.25, stagger: 0.03, onComplete: () => {
      renderEventos(c.dataset.filter);
      gsap.set(ctrack, { x: 0 }); rebound(); drag.update();
      gsap.fromTo(".slide", { opacity: 0, y: 40, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.07, ease: "power3.out" });
      upd();
    } });
  }));

  // --- Montador, passos, FAQ e depoimentos ---
  gsap.from(".item", { y: 30, opacity: 0, duration: 0.7, stagger: 0.08, ease: "power3.out", scrollTrigger: { trigger: ".builder", start: "top 85%" } });
  gsap.from(".resumo", { y: 40, opacity: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: ".builder", start: "top 85%" } });
  gsap.from(".passo", { y: 60, opacity: 0, duration: 1, stagger: 0.18, ease: "power3.out", scrollTrigger: { trigger: ".passos", start: "top 85%" } });
  gsap.from("details", { y: 30, opacity: 0, duration: 0.7, stagger: 0.08, ease: "power3.out", scrollTrigger: { trigger: ".faq-lista", start: "top 88%" } });

  // --- CTA ---
  gsap.to(".cta .split .w > span", { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger: ".cta", start: "top 65%" } });
  gsap.from(".cta .lead, .cta .acoes", { y: 30, opacity: 0, duration: 1, stagger: 0.15, ease: "power3.out", scrollTrigger: { trigger: ".cta", start: "top 55%" } });

  // --- Cursor customizado, prévia de foto e botões magnéticos (somente com mouse) ---
  if (window.matchMedia("(hover: hover)").matches) {
    const cursor = $(".cursor"), peek = $(".peek"), peekImg = $("img", peek);
    const cx = gsap.quickTo(cursor, "x", { duration: 0.25, ease: "power3" }), cy = gsap.quickTo(cursor, "y", { duration: 0.25, ease: "power3" });
    const px = gsap.quickTo(peek, "x", { duration: 0.5, ease: "power3" }), py = gsap.quickTo(peek, "y", { duration: 0.5, ease: "power3" });
    window.addEventListener("mousemove", (e) => { cursor.classList.add("on"); cx(e.clientX); cy(e.clientY); px(e.clientX + 24); py(e.clientY - 120); });
    document.addEventListener("mouseleave", () => cursor.classList.remove("on"));
    $$("a, button, .panel, .slide, summary").forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("big"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("big"));
    });
    $$(".panel[data-peek]").forEach((p) => {
      p.addEventListener("mouseenter", () => { if (!p.classList.contains("has-img")) return; peekImg.src = p.dataset.peek; gsap.to(peek, { opacity: 1, scale: 1, duration: 0.3 }); });
      p.addEventListener("mouseleave", () => gsap.to(peek, { opacity: 0, scale: 0.9, duration: 0.25 }));
    });
    $$(".magnetic").forEach((el) => {
      const mx = gsap.quickTo(el, "x", { duration: 0.5, ease: "elastic.out(1, 0.5)" }), my = gsap.quickTo(el, "y", { duration: 0.5, ease: "elastic.out(1, 0.5)" });
      el.addEventListener("mousemove", (e) => { const r = el.getBoundingClientRect(); mx((e.clientX - (r.left + r.width / 2)) * 0.3); my((e.clientY - (r.top + r.height / 2)) * 0.3); });
      el.addEventListener("mouseleave", () => { mx(0); my(0); });
    });
  }

  window.addEventListener("load", () => ScrollTrigger.refresh());
}
