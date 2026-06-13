insert into public.presentations (id, title, description, slug, theme, is_active)
values (
  '11111111-1111-1111-1111-111111111111',
  'Kernfusion und Kernspaltung',
  'Die Energiequellen von Sternen und Menschen',
  'kernfusion-und-kernspaltung',
  '{
    "colors": {
      "white": "#FFFFFF",
      "blue": "#0033A0",
      "gray": "#1A1A1A",
      "orange": "#FFB300"
    }
  }',
  true
)
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  theme = excluded.theme,
  is_active = excluded.is_active;

insert into public.presentation_settings (presentation_id, site_title, seo_description, default_transition, enable_particles, enable_offline_cache)
values (
  '11111111-1111-1111-1111-111111111111',
  'Kernfusion und Kernspaltung',
  'Interaktive Physik-Präsentation für die 11. Klasse.',
  'fade',
  true,
  true
)
on conflict (presentation_id) do update set
  site_title = excluded.site_title,
  seo_description = excluded.seo_description,
  default_transition = excluded.default_transition,
  enable_particles = excluded.enable_particles,
  enable_offline_cache = excluded.enable_offline_cache;

insert into public.slides
(presentation_id, title, subtitle, slug, slide_type, content_json, design_json, animation_json, interactive_config, status, sort_order, presenter_notes)
values
('11111111-1111-1111-1111-111111111111','Kernfusion und Kernspaltung','Die Energiequellen von Sternen und Menschen','titel','title',
'{"eyebrow":"Physik 11. Klasse","body":"Eine Reise vom Atomkern bis zur Zukunft der Energie.","bullets":[]}',
'{"backgroundColor":"#1A1A1A","textAlignment":"center","accentColor":"#FFB300","spaceHero":true}',
'{"transition":"zoom","intro":"solar"}','{}','published',1,'Langsam beginnen. Die erste Slide soll Aufmerksamkeit erzeugen.'),
('11111111-1111-1111-1111-111111111111','Warum Energie wichtig ist','Unsere Gesellschaft braucht zuverlässige, saubere und bezahlbare Energie.','warum-energie-wichtig-ist','split_media_text',
'{"body":"Kernenergie ist ein Beispiel dafür, wie winzige Veränderungen im Atomkern riesige Energiemengen freisetzen können.","bullets":["Strom, Wärme und Industrie benötigen Energie.","Fossile Energieträger verursachen CO₂.","Kernprozesse haben eine sehr hohe Energiedichte."]}',
'{"backgroundColor":"#FFFFFF","textAlignment":"left","mediaPosition":"left","accentColor":"#0033A0"}','{"transition":"fade"}','{}','published',2,'Den Bezug zum Alltag herstellen.'),
('11111111-1111-1111-1111-111111111111','Was ist Kernenergie?','Energie aus dem Inneren des Atomkerns.','was-ist-kernenergie','infographic',
'{"body":"Bei chemischen Reaktionen ändern sich Elektronenhüllen. Bei Kernenergie verändert sich der Atomkern selbst.","labels":["Atomkern","Protonen","Neutronen","Bindungsenergie"],"visualization":"atom_structure"}',
'{"backgroundColor":"#FFFFFF","textAlignment":"left","accentColor":"#0033A0"}','{"transition":"parallax"}','{"type":"atom_structure"}','published',3,'Unterschied chemisch/nuklear betonen.'),
('11111111-1111-1111-1111-111111111111','Was ist Kernspaltung?','Ein schwerer Atomkern zerbricht in kleinere Kerne.','was-ist-kernspaltung','infographic',
'{"body":"Trifft ein Neutron auf Uran-235, kann der Kern instabil werden und sich spalten. Dabei entstehen neue Neutronen und Energie.","bullets":["schwerer Kern","Neutron als Auslöser","Spaltprodukte","Energie und weitere Neutronen"],"visualization":"fission"}',
'{"backgroundColor":"#FFFFFF","textAlignment":"left","accentColor":"#0033A0"}','{"transition":"fade"}','{"type":"fission"}','published',4,'Nicht zu technisch werden.'),
('11111111-1111-1111-1111-111111111111','Uran-235 und Neutronen','Uran-235 ist leicht spaltbar.','uran-235-und-neutronen','split_media_text',
'{"body":"Uran-235 kann ein langsames Neutron aufnehmen. Danach wird der Kern so instabil, dass er sich teilt.","bullets":["Uran-235 besitzt 92 Protonen und 143 Neutronen.","Ein zusätzliches Neutron kann die Spaltung auslösen.","Die frei werdenden Neutronen können weitere Spaltungen starten."]}',
'{"backgroundColor":"#FFFFFF","textAlignment":"left","mediaPosition":"right","accentColor":"#0033A0"}','{"transition":"slide"}','{}','published',5,'Zahlen ruhig nennen, aber nicht auswendig lernen lassen.'),
('11111111-1111-1111-1111-111111111111','Kettenreaktion','Eine Spaltung kann weitere Spaltungen auslösen.','kettenreaktion','infographic',
'{"body":"Wenn genügend Neutronen weitere Kerne treffen, entsteht eine Kettenreaktion. Im Reaktor wird sie kontrolliert.","labels":["Neutron","Uran-235","Spaltprodukte","Kontrolle"],"visualization":"chain_reaction"}',
'{"backgroundColor":"#FFFFFF","textAlignment":"center","accentColor":"#FFB300"}','{"transition":"zoom"}','{"type":"chain_reaction"}','published',6,'Kontrollierte und unkontrollierte Kettenreaktion unterscheiden.'),
('11111111-1111-1111-1111-111111111111','Energie aus Kernspaltung','Wärme wird zu elektrischem Strom.','energie-aus-kernspaltung','split_media_text',
'{"body":"Die Spaltung erhitzt Wasser. Dampf treibt eine Turbine an, die einen Generator bewegt.","bullets":["Kernreaktor erzeugt Wärme.","Dampf treibt Turbinen an.","Generator wandelt Bewegung in Strom um."]}',
'{"backgroundColor":"#FFFFFF","textAlignment":"left","mediaPosition":"left","accentColor":"#0033A0"}','{"transition":"fade"}','{}','published',7,'Vergleich mit Kohlekraftwerk: Wärme -> Dampf -> Turbine.'),
('11111111-1111-1111-1111-111111111111','Vorteile der Kernspaltung','Sehr viel Energie auf wenig Raum.','vorteile-der-kernspaltung','quote',
'{"quote":"Ein Kilogramm Kernbrennstoff kann millionenfach mehr Energie liefern als ein Kilogramm Kohle.","author":"Didaktische Vereinfachung","body":"Der wichtigste Vorteil ist die enorme Energiedichte bei geringen direkten CO₂-Emissionen im Betrieb."}',
'{"backgroundColor":"#EEF4FF","textAlignment":"center","accentColor":"#0033A0"}','{"transition":"fade"}','{}','published',8,'Bei „CO₂-arm“ immer den Betrieb meinen.'),
('11111111-1111-1111-1111-111111111111','Risiken der Kernspaltung','Technik mit hohen Sicherheitsanforderungen.','risiken-der-kernspaltung','split_media_text',
'{"body":"Kernkraftwerke müssen sicher betrieben werden. Zusätzlich bleiben radioaktive Abfälle über lange Zeit problematisch.","bullets":["radioaktiver Abfall","Unfallrisiken","hohe Baukosten","gesellschaftliche Akzeptanz"]}',
'{"backgroundColor":"#FFFFFF","textAlignment":"left","mediaPosition":"right","accentColor":"#0033A0"}','{"transition":"fade"}','{}','published',9,'Sachlich bleiben, keine Dramatisierung.'),
('11111111-1111-1111-1111-111111111111','Was ist Kernfusion?','Leichte Atomkerne verschmelzen zu schwereren Kernen.','was-ist-kernfusion','infographic',
'{"body":"Bei der Fusion verbinden sich leichte Kerne. Wenn die Masse der Produkte etwas kleiner ist, wird die Differenz als Energie frei.","bullets":["leichte Kerne","extreme Temperaturen","Energie durch Massendifferenz"],"visualization":"fusion"}',
'{"backgroundColor":"#FFFFFF","textAlignment":"left","accentColor":"#FFB300"}','{"transition":"parallax"}','{"type":"fusion"}','published',10,'Formel E=mc² knapp erwähnen.'),
('11111111-1111-1111-1111-111111111111','Deuterium und Tritium','Zwei Wasserstoff-Isotope für die Fusion.','deuterium-und-tritium','comparison',
'{"left":{"title":"Deuterium","items":["1 Proton","1 Neutron","kommt in Wasser vor"]},"right":{"title":"Tritium","items":["1 Proton","2 Neutronen","radioaktiv","muss meist erzeugt werden"]},"body":"Diese beiden Kerne können zu Helium fusionieren und ein Neutron freisetzen."}',
'{"backgroundColor":"#FFFFFF","textAlignment":"center","accentColor":"#0033A0"}','{"transition":"slide"}','{}','published',11,'Isotop kurz erklären: gleiche Protonenzahl, andere Neutronenzahl.'),
('11111111-1111-1111-1111-111111111111','Kernfusion in der Sonne','Sterne leuchten durch Fusion.','kernfusion-in-der-sonne','full_image',
'{"body":"In der Sonne verschmelzen Wasserstoffkerne über mehrere Zwischenschritte zu Helium. Dabei entsteht Licht und Wärme.","caption":"Die Sonne ist unser natürliches Beispiel für Kernfusion."}',
'{"backgroundColor":"#1A1A1A","textAlignment":"left","accentColor":"#FFB300","overlay":"dark"}','{"transition":"zoom"}','{}','published',12,'An dieser Stelle auf die Startanimation zurückverweisen.'),
('11111111-1111-1111-1111-111111111111','Warum Fusion so schwierig ist','Atomkerne stoßen sich elektrisch ab.','warum-fusion-schwierig-ist','split_media_text',
'{"body":"Für Fusion müssen Kerne extrem nah zusammenkommen. Dafür braucht man Temperaturen von vielen Millionen Grad und ein stabiles Plasma.","bullets":["positive Kerne stoßen sich ab","Plasma muss eingeschlossen werden","Energiegewinn ist technisch sehr anspruchsvoll"]}',
'{"backgroundColor":"#FFFFFF","textAlignment":"left","mediaPosition":"left","accentColor":"#0033A0"}','{"transition":"fade"}','{}','published',13,'Coulomb-Abstoßung einfach erklären.'),
('11111111-1111-1111-1111-111111111111','ITER und aktuelle Forschung','Fusion wird weltweit erforscht.','iter-und-aktuelle-forschung','video',
'{"body":"Forschungsanlagen wie ITER untersuchen, wie ein heißes Plasma lange genug stabil gehalten werden kann.","videoEmbedUrl":"","caption":"Hier kann später ein eigenes Video oder ein YouTube/Vimeo-Link eingefügt werden."}',
'{"backgroundColor":"#FFFFFF","textAlignment":"center","accentColor":"#0033A0"}','{"transition":"fade"}','{}','published',14,'Später im Admin ein Video ergänzen.'),
('11111111-1111-1111-1111-111111111111','Fusion vs. Spaltung','Zwei Wege zur Energie aus dem Atomkern.','vergleich-fusion-vs-spaltung','comparison',
'{"left":{"title":"Kernspaltung","items":["schwere Kerne werden geteilt","heute in Kraftwerken genutzt","radioaktive Abfälle problematisch"]},"right":{"title":"Kernfusion","items":["leichte Kerne verschmelzen","Sonne und Sterne","technisch noch Forschungsfeld"]}}',
'{"backgroundColor":"#FFFFFF","textAlignment":"center","accentColor":"#0033A0"}','{"transition":"slide"}','{}','published',15,'Hier den roten Faden zusammenführen.'),
('11111111-1111-1111-1111-111111111111','Zukunft der Energiegewinnung','Keine einzelne Technologie löst alles.','zukunft-der-energiegewinnung','quote',
'{"quote":"Die Energiezukunft wird wahrscheinlich aus mehreren Lösungen bestehen: erneuerbare Energien, Speicher, Effizienz und vielleicht Fusion.","author":"Zusammenfassung","body":"Kerntechnik zeigt, wie eng Physik, Technik, Politik und Gesellschaft verbunden sind."}',
'{"backgroundColor":"#EEF4FF","textAlignment":"center","accentColor":"#0033A0"}','{"transition":"fade"}','{}','published',16,'Differenziert abschließen.'),
('11111111-1111-1111-1111-111111111111','Fazit','Kernenergie ist Physik mit großer Wirkung.','fazit','title',
'{"body":"Kernspaltung ist heute nutzbar, aber umstritten. Kernfusion ist wissenschaftlich faszinierend, aber technisch noch schwierig.","bullets":["Atomkerne speichern enorme Energie.","Kontrolle ist der entscheidende Punkt.","Wissenschaftliche Bewertung braucht Chancen und Risiken."]}',
'{"backgroundColor":"#FFFFFF","textAlignment":"center","accentColor":"#0033A0"}','{"transition":"zoom"}','{}','published',17,'Letzter inhaltlicher Gedanke vor Quellen.'),
('11111111-1111-1111-1111-111111111111','Quellen','','quellen','sources',
'{"body":"Die Quellenübersicht wird automatisch aus den Quellen aller veröffentlichten Slides erzeugt."}',
'{"backgroundColor":"#FFFFFF","textAlignment":"left","accentColor":"#0033A0"}','{"transition":"fade"}','{}','published',18,'Quellen im Admin ergänzen und aktuell halten.')
on conflict (presentation_id, slug) do update set
  title = excluded.title,
  subtitle = excluded.subtitle,
  slide_type = excluded.slide_type,
  content_json = excluded.content_json,
  design_json = excluded.design_json,
  animation_json = excluded.animation_json,
  interactive_config = excluded.interactive_config,
  status = excluded.status,
  sort_order = excluded.sort_order,
  presenter_notes = excluded.presenter_notes;

insert into public.sources (slide_id, source_type, title, author, url, publisher, published_at, accessed_at, notes)
select s.id, 'website', 'Nuclear explained', 'U.S. Energy Information Administration', 'https://www.eia.gov/energyexplained/nuclear/', 'EIA', null, current_date, 'Grundlagen zu Kernenergie und Kernspaltung.'
from public.slides s where s.slug = 'was-ist-kernspaltung'
on conflict do nothing;

insert into public.sources (slide_id, source_type, title, author, url, publisher, published_at, accessed_at, notes)
select s.id, 'website', 'Fusion energy', 'International Atomic Energy Agency', 'https://www.iaea.org/topics/fusion-energy', 'IAEA', null, current_date, 'Grundlagen zu Kernfusion und Forschung.'
from public.slides s where s.slug = 'was-ist-kernfusion'
on conflict do nothing;

insert into public.sources (slide_id, source_type, title, author, url, publisher, published_at, accessed_at, notes)
select s.id, 'website', 'ITER: The Way to New Energy', 'ITER Organization', 'https://www.iter.org/', 'ITER Organization', null, current_date, 'Informationen zu ITER und Fusionsforschung.'
from public.slides s where s.slug = 'iter-und-aktuelle-forschung'
on conflict do nothing;
