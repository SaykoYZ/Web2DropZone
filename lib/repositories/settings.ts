import { SiteSettings } from "@/types";
import { readJson, writeJson } from "./json";

const defaults: SiteSettings = {
  siteName: "DROPZONE GENERATOR",
  siteDescription: "Générez. Automatisez. Dominez.",
  slogan: "GÉNÉREZ. AUTOMATISEZ. DOMINEZ.",
  heroTitle: "DROPZONE GENERATOR",
  heroSubtitle: "Une plateforme sombre, rapide et pensée pour votre communauté.",
  heroImage: "",
  logoImage: "/logo.png",
  primaryColor: "#ffffff",
  secondaryColor: "#888888",
  discordUrl: "",
  footerText: "DROPZONE — Générateur premium.",
  maintenance: false,
  contactEmail: "",
  snowEnabled: true,
  musicEnabled: true,
  musicVolume: 0.45,
  paymentEnabled: true,
  paymentName: "PayPal — Amis et proches",
  paypalEmail: "tonymontana33250@gmail.com",
  paymentInstructions: "Après ton paiement, conserve la preuve de paiement et contacte le support avec ton numéro de commande.",
  musicUrl: "https://www.youtube.com/watch?v=MuVh4zR-5DM",
  musicStartSeconds: 23,
  faq: [
    { question: "Comment fonctionne DropZone ?", answer: "Choisissez un produit ou une offre puis passez votre commande." },
    { question: "Le paiement est-il disponible ?", answer: "L'architecture est prête pour une future intégration PayPal ou Stripe." }
  ]
};

export async function getSettings() {
  const current = await readJson<SiteSettings>("settings.json", defaults);
  const merged = { ...defaults, ...current };
  if (JSON.stringify(merged) !== JSON.stringify(current)) await writeJson("settings.json", merged);
  return merged;
}
export async function updateSettings(data: Partial<SiteSettings>) {
  const current = await getSettings();
  const next = { ...current, ...data };
  await writeJson("settings.json", next);
  return next;
}