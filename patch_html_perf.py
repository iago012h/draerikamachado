import re

with open('/home/hiago/Área de trabalho/dentista/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. ADD JSON-LD SCHEMA
schema = """
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Dentist",
    "name": "Dra. Erika Machado - Odontologia Restauradora",
    "image": "dra-erika-machado.png",
    "@id": "",
    "url": "",
    "telephone": "+5512996841633",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Rua Rubião Júnior, 84, Sala 57",
      "addressLocality": "São José dos Campos",
      "addressRegion": "SP",
      "postalCode": "12210-180",
      "addressCountry": "BR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -23.1896,
      "longitude": -45.8841
    },
    "openingHoursSpecification": [{
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "opens": "09:00",
      "closes": "18:00"
    },{
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Saturday",
      "opens": "09:00",
      "closes": "13:00"
    }],
    "sameAs": [
      "https://www.instagram.com/dra.erika.machado/"
    ]
  }
  </script>
</head>"""

html = html.replace('</head>', schema)

# 2. LAZY LOADING (Skip brand-logo and hero image, apply to others)
# Find all <img tags and apply loading="lazy" if not already present, except for the first two
img_tags = re.findall(r'<img[^>]+>', html)
for i, img in enumerate(img_tags):
    if i > 1 and 'loading="lazy"' not in img:
        new_img = img.replace('<img ', '<img loading="lazy" ')
        html = html.replace(img, new_img)

# 3. ADD REVEAL CLASSES FOR ANIMATION
# I'll add 'reveal' to section headers, directory rows, dossier items, etc.
html = html.replace('class="hero-text-col"', 'class="hero-text-col reveal"')
html = html.replace('class="hero-photo-col"', 'class="hero-photo-col reveal"')
html = html.replace('class="editorial-section-header"', 'class="editorial-section-header reveal"')
html = html.replace('class="philosophy-sidebar"', 'class="philosophy-sidebar reveal"')
html = html.replace('class="philosophy-main-text"', 'class="philosophy-main-text reveal"')
html = html.replace('class="directory-row"', 'class="directory-row reveal"')
html = html.replace('class="guide-panel"', 'class="guide-panel reveal"')
html = html.replace('class="footer-top"', 'class="footer-top reveal"')

with open('/home/hiago/Área de trabalho/dentista/index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("HTML patched.")
