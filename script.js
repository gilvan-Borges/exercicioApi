// Troque pelo número real com DDI + DDD, apenas dígitos (ex.: 5521999999999)
const WHATSAPP = "5521999999999";

document.querySelectorAll("[data-whats]").forEach((el) => {
  el.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(el.dataset.whats)}`;
  el.target = "_blank";
  el.rel = "noopener";
});
// --- Fotos do carrossel de eventos ---
// Fotos de banco de imagens gratuito (Unsplash). Para usar fotos reais da Kero Doces,
// coloque os arquivos em /fotos e troque o "src" (ex.: "fotos/casamento.jpg").
const u = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=75`;
const EVENTOS = [
  { tipo: "Casamento", titulo: "Mesa de doces finos", src: u("photo-1464349095431-e9a21285b5f3") },
  { tipo: "Aniversário", titulo: "Festa dos sonhos", src: u("photo-1558961363-fa8fdf82db35") },
  { tipo: "Chá de bebê", titulo: "Delicadeza em cada detalhe", src: u("photo-1587314168485-3236d6710814") },
  { tipo: "Corporativo", titulo: "Brindes que encantam", src: u("photo-1551024601-bec78aea704b") },
  { tipo: "Noivado", titulo: "Doce começo", src: u("photo-1488477181946-6428a0291777") },
  { tipo: "Kit presente", titulo: "Caixas personalizadas", src: u("photo-1563729784474-d77dbb933a9e") },
];
document.getElementById("carouselTrack").innerHTML = EVENTOS.map(
  (e) => `<figure class="slide"><img src="${e.src}" alt="${e.tipo}: ${e.titulo}" loading="lazy" onerror="this.remove()"><figcaption><small>${e.tipo}</small><b>${e.titulo}</b></figcaption></figure>`
).join("");

document.getElementById("ano").textContent = new Date().getFullYear();

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const loader = document.querySelector(".loader");

if (!window.gsap || reduce) {
  // Sem GSAP ou com movimento reduzido: mostra tudo estático
  loader.remove();
  document.querySelectorAll(".big-text .ch").forEach((c) => (c.style.opacity = 1));
  document.querySelectorAll("[data-count]").forEach((n) => (n.textContent = n.dataset.count + n.dataset.suffix));
} else {
  gsap.registerPlugin(ScrollTrigger, Draggable);

  // --- Quebra textos em palavras / letras ---
  document.querySelectorAll(".split").forEach((el) => {
    const words = el.textContent.trim().split(/\s+/);
    el.setAttribute("aria-label", el.textContent.trim());
    el.innerHTML = words.map((w) => `<span class="w" aria-hidden="true"><span>${w}</span></span>`).join(" ");
  });
  const big = document.querySelector(".big-text");
  big.setAttribute("aria-label", big.textContent.trim());
  big.innerHTML = big.textContent
    .trim()
    .split(/(\s+)/)
    .map((p) => (/^\s+$/.test(p) ? " " : `<span class="w" aria-hidden="true" style="display:inline-block">${[...p].map((c) => `<span class="ch">${c}</span>`).join("")}</span>`))
    .join("");

  gsap.set(".hero .eyebrow, .hero .lead, .hero .acoes, .topo, .hero-scroll", { opacity: 0 });
  gsap.set(".hero .split .w > span, .cta .split .w > span", { yPercent: 115 });

  // --- Loader + intro ---
  // A logo aparece e o loader só sai quando a página (fontes e imagens) terminou de carregar.
  const ready = Promise.race([
    Promise.all([
      new Promise((r) => (document.readyState === "complete" ? r() : window.addEventListener("load", r, { once: true }))),
      document.fonts ? document.fonts.ready : Promise.resolve(),
    ]),
    new Promise((r) => setTimeout(r, 4000)), // limite de segurança
  ]);
  const mark = gsap.timeline();
  mark.fromTo(".loader-mark", { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.9, ease: "power3.out" })
      .to(".loader-bar i", { width: "100%", duration: 1.0, ease: "power2.inOut" }, 0.1);
  Promise.all([ready, new Promise((r) => mark.eventCallback("onComplete", r))]).then(() => {
    gsap.timeline()
      .to(".loader-inner", { scale: 0.92, opacity: 0, duration: 0.45, ease: "power2.in" })
      .to(loader, { opacity: 0, duration: 0.4, ease: "power1.out" }, "-=0.15")
      .set(loader, { display: "none" })
      .to(".topo", { opacity: 1, duration: 0.6 }, "-=0.2")
      .to(".hero .eyebrow", { opacity: 1, duration: 0.6 }, "-=0.4")
      .to(".hero .split .w > span", { yPercent: 0, duration: 1, ease: "expo.out", stagger: 0.08 }, "-=0.4")
      .to(".hero .lead, .hero .acoes, .hero-scroll", { opacity: 1, duration: 0.7, stagger: 0.1 }, "-=0.6");
  });

  // --- Orbs: flutuação + parallax ---
  const desktop = window.matchMedia("(min-width: 861px)").matches;
  if (desktop) {
  gsap.to(".orb-1", { x: -60, y: 50, duration: 7, ease: "sine.inOut", repeat: -1, yoyo: true });
  gsap.to(".orb-2", { x: 70, y: -40, duration: 9, ease: "sine.inOut", repeat: -1, yoyo: true });
  gsap.to(".hero-logo .ring", { rotation: 360, duration: 60, ease: "none", repeat: -1 });
  gsap.to(".hero-logo .r2", { rotation: -360, duration: 90, ease: "none", repeat: -1 });
  gsap.from(".hero-logo img", { scale: 0.8, opacity: 0, duration: 1.6, ease: "expo.out", delay: 2.4 });
  gsap.to(".orb-3", { x: -30, y: 60, duration: 6, ease: "sine.inOut", repeat: -1, yoyo: true });
  gsap.to(".hero-content", { yPercent: 18, opacity: 0.2, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  gsap.to(".orb-1", { yPercent: 30, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  }

  // --- Marquee ---
  const track = document.querySelector(".marquee-track");
  const loop = gsap.to(track, { xPercent: -50, duration: 28, ease: "none", repeat: -1 });
  ScrollTrigger.create({
    trigger: ".marquee",
    onUpdate: (self) => gsap.to(loop, { timeScale: 1 + Math.abs(self.getVelocity()) / 400, duration: 0.3, overwrite: true }),
  });
  ScrollTrigger.addEventListener("scrollEnd", () => gsap.to(loop, { timeScale: 1, duration: 0.6 }));

  // --- Texto que "acende" letra a letra ---
  gsap.to(".big-text .ch", {
    opacity: 1, ease: "none", stagger: 0.4,
    scrollTrigger: { trigger: ".big-text", start: "top 80%", end: "bottom 45%", scrub: true },
  });

  // --- Reveals genéricos ---
  gsap.utils.toArray(".reveal").forEach((el) => {
    gsap.from(el, { y: 50, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%" } });
  });

  // --- Contadores ---
  document.querySelectorAll("[data-count]").forEach((n) => {
    const obj = { v: 0 };
    gsap.to(obj, {
      v: +n.dataset.count, duration: 2, ease: "power2.out",
      scrollTrigger: { trigger: n, start: "top 90%", once: true },
      onUpdate: () => (n.textContent = Math.round(obj.v) + n.dataset.suffix),
    });
  });

  // --- Doces: scroll horizontal com pin (desktop) ---
  const mm = gsap.matchMedia();
  mm.add("(min-width: 861px)", () => {
    const pin = document.querySelector(".doces-pin");
    const dist = () => track2.scrollWidth - (pin.clientWidth - document.querySelector(".doces-head").offsetWidth - pin.clientWidth * 0.16);
    const track2 = document.querySelector(".doces-track");
    gsap.to(track2, {
      x: () => -Math.max(0, dist()), ease: "none",
      scrollTrigger: { trigger: ".doces", start: "top top", end: () => "+=" + Math.max(0, dist()), pin: true, scrub: 0.8, invalidateOnRefresh: true },
    });
    gsap.utils.toArray(".candy").forEach((c, i) => {
      gsap.to(c, { y: -16, rotate: i % 2 ? 8 : -8, duration: 2.4 + i * 0.3, ease: "sine.inOut", repeat: -1, yoyo: true });
    });
  });
  mm.add("(max-width: 860px)", () => {
    gsap.utils.toArray(".panel").forEach((p) => {
      gsap.from(p, { y: 60, opacity: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: p, start: "top 90%" } });
    });
  });

  // --- Carrossel de eventos: arrastar, botões e parallax ---
  const car = document.getElementById("carousel");
  const ctrack = document.getElementById("carouselTrack");
  const maxX = () => Math.min(0, car.clientWidth - ctrack.scrollWidth - parseFloat(getComputedStyle(car).paddingLeft));
  const drag = Draggable.create(ctrack, {
    type: "x", edgeResistance: 0.85, cursor: "grab", activeCursor: "grabbing",
    bounds: { minX: maxX(), maxX: 0 }, allowContextMenu: true,
    onDrag: updateParallax, onThrowUpdate: updateParallax,
  })[0];
  function updateParallax() {
    const w = window.innerWidth;
    ctrack.querySelectorAll(".slide img").forEach((img) => {
      const r = img.parentElement.getBoundingClientRect();
      gsap.set(img, { x: ((r.left + r.width / 2) / w - 0.5) * -40 });
    });
  }
  const step = () => (ctrack.firstElementChild ? ctrack.firstElementChild.offsetWidth + 22 : 300);
  const go = (dir) => {
    const x = gsap.utils.clamp(maxX(), 0, gsap.getProperty(ctrack, "x") - dir * step());
    gsap.to(ctrack, { x, duration: 0.9, ease: "power3.out", onUpdate: () => { drag.update(); updateParallax(); } });
  };
  document.getElementById("next").addEventListener("click", () => go(1));
  document.getElementById("prev").addEventListener("click", () => go(-1));
  window.addEventListener("resize", () => { drag.applyBounds({ minX: maxX(), maxX: 0 }); });
  ScrollTrigger.addEventListener("refresh", () => drag.applyBounds({ minX: maxX(), maxX: 0 }));
  gsap.from(".slide", { y: 80, opacity: 0, scale: 0.94, duration: 1, stagger: 0.12, ease: "power3.out", scrollTrigger: { trigger: ".carousel", start: "top 85%" } });
  updateParallax();

  // --- Passos e depoimentos ---
  gsap.from(".passo", { y: 60, opacity: 0, duration: 1, stagger: 0.18, ease: "power3.out", scrollTrigger: { trigger: ".passos", start: "top 85%" } });

  // --- CTA ---
  gsap.to(".cta .split .w > span", {
    yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.08,
    scrollTrigger: { trigger: ".cta", start: "top 65%" },
  });
  gsap.from(".cta .lead, .cta .acoes", { y: 30, opacity: 0, duration: 1, stagger: 0.15, ease: "power3.out", scrollTrigger: { trigger: ".cta", start: "top 55%" } });
  if (desktop) gsap.to(".orb-4", { scale: 1.25, duration: 5, ease: "sine.inOut", repeat: -1, yoyo: true });

  // --- Cursor customizado + botões magnéticos ---
  const cursor = document.querySelector(".cursor");
  if (window.matchMedia("(hover: hover)").matches) {
    const cx = gsap.quickTo(cursor, "x", { duration: 0.25, ease: "power3" });
    const cy = gsap.quickTo(cursor, "y", { duration: 0.25, ease: "power3" });
    window.addEventListener("mousemove", (e) => { cursor.classList.add("on"); cx(e.clientX); cy(e.clientY); });
    document.addEventListener("mouseleave", () => cursor.classList.remove("on"));

    document.querySelectorAll("a, .panel").forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("big"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("big"));
    });
    document.querySelectorAll(".magnetic").forEach((el) => {
      const mx = gsap.quickTo(el, "x", { duration: 0.5, ease: "elastic.out(1, 0.5)" });
      const my = gsap.quickTo(el, "y", { duration: 0.5, ease: "elastic.out(1, 0.5)" });
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        mx((e.clientX - (r.left + r.width / 2)) * 0.3);
        my((e.clientY - (r.top + r.height / 2)) * 0.3);
      });
      el.addEventListener("mouseleave", () => { mx(0); my(0); });
    });
  }

  window.addEventListener("load", () => ScrollTrigger.refresh());
}
