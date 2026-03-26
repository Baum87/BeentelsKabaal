# Infrastructuur – Beentels Kabaal Website

Een overzicht van hoe de website technisch in elkaar zit, voor wie hem beheert of overdraagt.

---

## Schema

```
┌─────────────────────────────────────────────────────────────────┐
│                        BEHEERDER                                │
│                  (e-mail + wachtwoord)                          │
└─────────────────────────┬───────────────────────────────────────┘
                          │ beentelskabaal.nl/admin
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                     DECAP CMS                                   │
│              /admin  (draait in de browser)                     │
│                                                                 │
│   Agenda beheren · Evenementen aanmaken · Foto's uploaden       │
└───────────┬─────────────────────────────────┬───────────────────┘
            │ sla op                          │ upload foto
            ▼                                 ▼
┌───────────────────────┐         ┌───────────────────────────────┐
│   NETLIFY IDENTITY    │         │         CLOUDINARY            │
│   + GIT GATEWAY       │         │                               │
│                       │         │  Opslag van alle foto's       │
│  Beheert inloggen en  │         │  Automatische compressie      │
│  schrijft wijzigingen │         │  25 GB gratis                 │
│  door naar GitHub     │         │  Geeft publieke URL terug     │
└───────────┬───────────┘         └───────────────────────────────┘
            │ commit
            ▼
┌─────────────────────────────────────────────────────────────────┐
│                        GITHUB                                   │
│               (Baum87/BeentelsKabaal)                           │
│                                                                 │
│  Broncode · index.html · styles.css · script.js                 │
│  content/agenda.json · content/evenementen.json                 │
└─────────────────────────┬───────────────────────────────────────┘
                          │ automatisch deployen
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                        NETLIFY                                  │
│             (hosting, ~1-2 min na elke wijziging)               │
│                                                                 │
│  Serveert de website publiek op beentelskabaal.nl               │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                       BEZOEKER                                  │
│                  beentelskabaal.nl                              │
│                                                                 │
│  Browser laadt agenda.json + evenementen.json                   │
│  JavaScript rendert de content op de pagina                     │
│  Foto's komen rechtstreeks van Cloudinary                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## Uitleg per onderdeel

### GitHub — jij beheert dit
Hier staat alle code: HTML, CSS, JavaScript en de content-bestanden (agenda, evenementen). Elke keer dat jij iets aanpast en pusht, of de beheerder iets opslaat via Decap CMS, komt er een nieuwe commit in deze repository.

Locatie: `github.com/Baum87/BeentelsKabaal`

---

### Netlify — volledig automatisch
Zodra er een nieuwe commit op GitHub staat, pakt Netlify dit automatisch op, bouwt de site en zet hem live. Geen handmatige actie nodig. Gratis voor kleine sites met weinig traffic. Hier koppel je ook het eigen domein aan.

---

### Decap CMS — het beheerpaneel
Toegankelijk via `beentelskabaal.nl/admin`. De beheerder logt in met e-mail en wachtwoord, voegt een evenement toe, uploadt foto's — Decap doet vervolgens zelf een git commit naar GitHub. De beheerder hoeft nooit iets van code te weten.

Gebruikersbeheer gaat via Netlify Identity: de webmaster nodigt beheerders uit per e-mail.

---

### Cloudinary — de fotobibliotheek
De beheerder sleept foto's in het uploadveld binnen Decap CMS. Cloudinary verkleint en optimaliseert ze automatisch — dit is belangrijk voor de laadsnelheid van de website. Na de upload geeft Cloudinary een publieke URL terug die automatisch in het evenement wordt opgeslagen.

Gratis account: 25 GB opslag, ruim genoeg voor jaren aan foto's.

---

### Domein — eenmalig instellen
Koop het domein bij een Nederlandse registrar, bijvoorbeeld TransIP of Antagonist. Wijs het domein via een DNS-record (CNAME of A-record) naar Netlify. Dit doe je eenmalig; daarna loopt alles automatisch inclusief het SSL-certificaat (https).

---

## De flow bij een nieuwe update

```
Beheerder logt in op /admin
    ↓
Evenement invullen (titel, datum, locatie, beschrijving)
    ↓
Foto's uploaden → Cloudinary comprimeert automatisch
    ↓
Opslaan in Decap CMS
    ↓
Decap doet automatisch een commit naar GitHub
    ↓
Netlify detecteert de commit en bouwt de site opnieuw
    ↓
Na ~60 seconden live ✅
```

---

## Kostenoverzicht

| Onderdeel | Kosten |
|---|---|
| GitHub | Gratis |
| Netlify (hosting) | Gratis |
| Decap CMS | Gratis |
| Netlify Identity | Gratis (tot 1.000 gebruikers) |
| Cloudinary (foto-opslag) | Gratis (25 GB) |
| Domein (beentelskabaal.nl) | ~€10 per jaar |

---

*Documentatie versie 1.0 – maart 2026*
