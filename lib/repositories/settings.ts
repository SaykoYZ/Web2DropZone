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
  contactEmail: "",

  maintenance: false,

  snowEnabled: true,

  musicEnabled: true,
  musicVolume: 0.25,
  musicUrl:
    "https://www.youtube.com/watch?v=MuVh4zR-5DM&list=RDMuVh4zR-5DM&start_radio=1",
  musicStartSeconds: 23,

  faq: [
    {
      question: "Comment fonctionne DropZone ?",
      answer:
        "Choisissez un produit ou une offre puis passez votre commande.",
    },
    {
      question: "Comment payer ?",
      answer:
        "Le paiement peut être effectué via PayPal selon les options disponibles.",
    },
  ],

  paymentEnabled: true,
  paymentName: "PayPal — Amis et proches",
  paypalEmail: "tonymontana33250@gmail.com",
  paymentInstructions:
    "Envoyez le paiement via PayPal, puis indiquez votre numéro de commande.",
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
