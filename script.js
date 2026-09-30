// Troque pelo número real com DDI + DDD, apenas dígitos (ex.: 5521999999999)
const WHATSAPP = "5521999999999";

document.querySelectorAll("[data-whats]").forEach((el) => {
  const texto = encodeURIComponent(el.dataset.whats);
  el.href = `https://wa.me/${WHATSAPP}?text=${texto}`;
  el.target = "_blank";
  el.rel = "noopener";
});

document.getElementById("ano").textContent = new Date().getFullYear();
