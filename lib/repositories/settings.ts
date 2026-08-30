import { SiteSettings } from "@/types";
import { readJson, writeJson } from "./json";

const defaults: SiteSettings = {
  siteName: "DROPZONE GENERATOR",
  siteDescription: "Générez. Automatisez. Dominez.",
  slogan: "GÉNÉREZ. AUTOMATISEZ. DOMINEZ.",
  heroTitle: "DROPZONE GENERATOR",
  heroSubtitle:
    "Une plateforme sombre, rapide et pensée pour votre communauté.",
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
  faq: [
    {
      question: "Comment fonctionne DropZone ?",
      answer:
        "Choisissez un produit ou une offre puis passez votre commande.",
    },
    {
      question: "Le paiement est-il disponible ?",
      answer:
        "L'architecture est prête pour une future intégration PayPal ou Stripe.",
    },
  ],
};

export async function getSettings(): Promise<SiteSettings> {
  const current = await readJson<Partial<SiteSettings>>(
    "settings.json",
    {}
  );

  return {
    ...defaults,
    ...current,
  };
}

export async function updateSettings(
  data: Partial<SiteSettings>
): Promise<SiteSettings> {
  const current = await getSettings();

  const next: SiteSettings = {
    ...current,
    ...data,
  };

  await writeJson("settings.json", next);

  return next;
}
