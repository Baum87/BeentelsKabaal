# Beentels Kabaal – Website

Officiële website van fanfare Beentels Kabaal uit Bentelo.

## Technische stack

| Onderdeel | Technologie |
|---|---|
| Hosting | [Netlify](https://netlify.com) |
| CMS | [Decap CMS](https://decapcms.org) via `/admin` |
| Authenticatie | Netlify Identity |
| Foto-opslag | [Cloudinary](https://cloudinary.com) |
| Code | Vanilla HTML, CSS, JavaScript |

## Projectstructuur

```
BeentelsKabaal/
├── admin/
│   ├── index.html          # Decap CMS beheerpaneel
│   └── config.yml          # CMS configuratie (velden, collecties)
├── content/
│   ├── agenda.json         # Agendapunten (beheerd via CMS)
│   ├── evenementen.json    # Evenementen + foto's (beheerd via CMS)
│   └── over-ons.json       # Afbeeldingen "Over ons" sectie
├── images/                 # Statische afbeeldingen / SVG placeholders
├── optredens/
│   ├── evenement.html      # Dynamische fotoalbum pagina
│   └── optreden.css        # Stijlen voor fotoalbum pagina's
├── index.html              # Hoofdpagina
├── styles.css              # Alle stijlen
├── script.js               # JavaScript (content laden, animaties)
└── netlify.toml            # Netlify configuratie
```

## Hoe content wordt beheerd

Beheerders loggen in op `/admin` met e-mail en wachtwoord (via Netlify Identity). Zij kunnen:

- **Agenda** — agendapunten toevoegen, bewerken of verwijderen
- **Evenementen** — fotoalbums aanmaken met omslagfoto en fotogalerij
- **Over ons** — de twee afbeeldingen in de "Over ons" sectie vervangen

Wijzigingen worden automatisch als commit opgeslagen in GitHub. Netlify deployt daarna automatisch de nieuwe versie (~60 seconden).

## Lokaal ontwikkelen

```bash
# Clone de repo
git clone https://github.com/Baum87/BeentelsKabaal.git

# Open index.html in een lokale server (bijv. Live Server in VS Code)
# Let op: /content/*.json worden geladen via fetch(), dus een lokale server is vereist
```

## Beheerder toevoegen

1. Ga naar Netlify dashboard → jouw project → Identity
2. Klik "Invite users"
3. Vul het e-mailadres in — de beheerder ontvangt een uitnodigingsmail

## Cloudinary

Foto's worden opgeslagen in Cloudinary en automatisch gecomprimeerd. Credentials staan in `admin/config.yml`. De `api_key` is een publieke sleutel en veilig om in de repository te bewaren. De `api_secret` staat **nooit** in de code.

## Domein

Het domein `beentelskabaal.nl` wijst via een CNAME-record naar Netlify. SSL-certificaat wordt automatisch beheerd door Netlify.

## Contact

Vragen over de website: kabaal@live.nl
