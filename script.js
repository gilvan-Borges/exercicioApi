// Troque pelo número real com DDI + DDD, apenas dígitos (ex.: 5521999999999)
const WHATSAPP = "5521999999999";

document.querySelectorAll("[data-whats]").forEach((el) => {
  el.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(el.dataset.whats)}`;
  el.target = "_blank";
  el.rel = "noopener";
});
document.getElementById("ano").textContent = new Date().getFullYear();

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const loader = document.querySelector(".loader");

if (!window.gsap || reduce) {
  // Sem GSAP ou com movimento reduzido: mostra tudo estático
  loader.remove();
  document.querySelectorAll(".big-text .ch").forEach((c) => (c.style.opacity = 1));
  document.querySelectorAll("[data-count]").forEach((n) => (n.textContent = n.dataset.count + n.dataset.suffix));
} else {
  gsap.registerPlugin(ScrollTrigger);

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
  const intro = gsap.timeline();
  intro
    .to(".loader-bar i", { width: "100%", duration: 1.1, ease: "power2.inOut" })
    .to(".loader-word", { yPercent: -120, duration: 0.6, ease: "power3.in" }, "+=0.1")
    .to(loader, { yPercent: -100, duration: 0.9, ease: "power4.inOut" }, "-=0.2")
    .set(loader, { display: "none" })
    .to(".topo", { opacity: 1, duration: 0.8 }, "-=0.3")
    .to(".hero .eyebrow", { opacity: 1, y: 0, duration: 0.8 }, "-=0.6")
    .to(".hero .split .w > span", { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.09 }, "-=0.6")
    .to(".hero .lead, .hero .acoes, .hero-scroll", { opacity: 1, duration: 0.9, stagger: 0.12 }, "-=0.7");

  // --- Orbs: flutuação + parallax ---
  gsap.to(".orb-1", { x: -60, y: 50, duration: 7, ease: "sine.inOut", repeat: -1, yoyo: true });
  gsap.to(".orb-2", { x: 70, y: -40, duration: 9, ease: "sine.inOut", repeat: -1, yoyo: true });
  gsap.to(".orb-3", { x: -30, y: 60, duration: 6, ease: "sine.inOut", repeat: -1, yoyo: true });
  gsap.to(".hero-content", { yPercent: 18, opacity: 0.2, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  gsap.to(".orb-1", { yPercent: 30, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

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
    gsap.set(".doces-track", { overflowX: "auto", paddingBottom: 10 });
  });

  // --- Passos e depoimentos ---
  gsap.from(".passo", { y: 60, opacity: 0, duration: 1, stagger: 0.18, ease: "power3.out", scrollTrigger: { trigger: ".passos", start: "top 85%" } });

  // --- CTA ---
  gsap.to(".cta .split .w > span", {
    yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.08,
    scrollTrigger: { trigger: ".cta", start: "top 65%" },
  });
  gsap.from(".cta .lead, .cta .acoes", { y: 30, opacity: 0, duration: 1, stagger: 0.15, ease: "power3.out", scrollTrigger: { trigger: ".cta", start: "top 55%" } });
  gsap.to(".orb-4", { scale: 1.25, duration: 5, ease: "sine.inOut", repeat: -1, yoyo: true });

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
