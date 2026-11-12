/* Historical stories are displayed only when the visitor turns places on. */
'use strict';

const HISTORIC_PLACES = [
  {
    id: 'weerdsluis', coords: [52.09746, 5.11488], period: 'C. 1613 · WEERDSLUIS', title: 'The lock that controls the city’s water',
    summary: 'At the northern edge of Utrecht, the Weerdsluis connects the city waters with the river Vecht. A water-control gate stood here around 1554; a chamber lock followed around 1613. In the 1820s it was widened and deepened for shipping, giving it much of its present form. The lock still helps regulate the water level in Utrecht’s canals.',
    locationNote: 'The marker identifies the lock complex on the Vecht.',
    sources: [['The Weerdsluis in the national heritage register', 'https://monumentenregister.cultureelerfgoed.nl/monumenten/450399'], ['The fish doorbell at the lock', 'https://visdeurbel.nl/en/about/']]
  },
  {
    id: 'weerdpoort', coords: [52.09651, 5.11613], period: '16TH–19TH CENTURY · WEERDPOORT', title: 'The northern gate and the Morning Star',
    summary: 'Weerdpoort guarded the northern entrance to Utrecht. It combined a land gate and drawbridge with a water gate across the Oudegracht, closed at night by an iron grille. In 1552 bastion Morgenster was completed nearby to strengthen the defences. The fortifications were dismantled in the nineteenth century; remains of the eastern gate tower can still be seen near Weerdbrug.',
    image: 'weerdpoort', size: [480, 282], imageAlt: 'A seventeenth-century drawing of Weerdpoort, the water gate and bastion Morgenster', credit: 'Possibly Herman Saftleven · Rijksmuseum · CC0', imageNote: 'The Weerdpoort and its surroundings, c. 1650.',
    imagePage: 'https://commons.wikimedia.org/wiki/File:Weerdpoort_te_Utrecht,_RP-T-1879-A-63.jpg',
    locationNote: 'Approximate site of the former gate near Weerdbrug.',
    sources: [['History of Weerdpoort', 'https://erfgoed.utrecht.nl/verhalen/weerdpoort'], ['Utrecht’s city defences', 'https://erfgoed.utrecht.nl/verhalen/de-utrechtse-stadsverdediging'], ['The drawing in the Rijksmuseum', 'https://id.rijksmuseum.nl/200144199']]
  },
  {
    id: 'stadskraan', coords: [52.0966948, 5.1136484], period: '1402–2022 · WEERDSINGEL', title: 'The city crane returns',
    summary: 'Beside Monicabrug stands a working reconstruction of Utrecht’s city crane, installed in 2022. People walking inside its large wooden wheels supply the power to lift heavy cargo. The original city crane stood at Ganzenmarkt on the Oudegracht, not here; it was first recorded in 1402. Other historic cranes also worked near the Weerdsluis.',
    image: 'stadskraan', size: [480, 383], imageAlt: 'Historical view of Utrecht’s city crane at its former site on the Oudegracht', credit: 'Unknown artist · Het Utrechts Archief · public domain', imageNote: 'The former crane at Ganzenmarkt, around 1800; the reconstruction now stands at Monicabrug.',
    imagePage: 'https://commons.wikimedia.org/wiki/File:Utrechtse_stadskraan_aan_de_Oudegracht.jpg',
    locationNote: 'The marker identifies the working reconstruction at Monicabrug. The original stood at Ganzenmarkt.',
    sources: [['The history of Utrecht’s city crane', 'https://www.stadskraan.nl/geschiedenis'], ['The city cranes and the Keulse Kraan', 'https://oud-utrecht.nl/nieuws/1062-stadskraan-utrecht-herrijst'], ['Location of the reconstruction', 'https://www.molens.nl/ontdek-molens/alle-molens/stadskraan-te-utrecht']]
  },
  {
    id: 'dom', coords: [52.09070, 5.12170], period: '1587 & 1674 · DOMPLEIN', title: 'The cathedral that broke in two',
    summary: 'The square between the Dom Tower and Dom Church was once occupied by the cathedral’s nave. In August 1674 a violent storm brought it down; it was never rebuilt. The open space became part of today’s Domplein. A second church, the Salvatorkerk (Oudmunster), once stood just south of the Dom. It was demolished in 1587, and traces of its foundations remain beneath the square.',
    image: 'dom', size: [480, 375], imageAlt: 'View west through the ruined nave toward the Dom Tower', imageNote: 'Looking west through the ruins of the nave toward the Dom Tower.', credit: 'Abraham Rademaker · Rijksmuseum · CC0',
    imagePage: 'https://commons.wikimedia.org/wiki/File:De_Dom_te_Utrecht_na_de_storm_van_1674_Geruwineerde_Doms-kerk_tot_Utrecht_1674_(titel_op_object),_RP-P-AO-5-22-2.jpg',
    locationNote: 'Approximate site of the former nave between the tower and the surviving church.',
    relatedImages: [
      { title: 'Interior of the Dom Church', date: '1636', kind: 'Drawing', maker: 'Pieter Jansz. Saenredam', institution: 'Het Utrechts Archief · 28594', rights: 'Public domain', size: [480, 617], src: 'assets/heritage/utrecht-08', page: 'https://commons.wikimedia.org/wiki/File:Dom-Utrecht-Pieter-Jansz-Saenredam.jpg', alt: 'Saenredam drawing of the nave and choir of Utrecht Dom Church' },
      {
        title: 'The Dom seen from the fields', date: '1648', kind: 'Etching',
        maker: 'Herman Saftleven', institution: 'Rijksmuseum · RP-P-1884-A-7795B', rights: 'Public domain',
        description: 'Twenty-six years before the storm, Saftleven showed the Dom beyond a line of trees, with pastures and a winding road in the foreground.',
        size: [480, 252], src: 'assets/heritage/utrecht-13',
        page: 'https://www.rijksmuseum.nl/en/collection/object/Gezicht-op-Utrecht-plaat-II--9c0a028ca4519d1f46082bc106e64ba9',
        alt: 'Etching with the Dom on the Utrecht skyline beyond fields and a winding road'
      },
      { title: 'Dom Tower and houses', date: '1885 copy; original subject c. 1480', kind: 'Watercolour and ink drawing', maker: 'Anonymous copyist', institution: 'Het Utrechts Archief · HUA-28684', rights: 'Public domain', size: [328, 720], src: 'assets/heritage/utrecht-10', page: 'https://commons.wikimedia.org/wiki/File:HUA-28684-Afbeelding_van_de_Domtoren_te_Utrecht_en_enkele_huizen.jpg', alt: '1885 copy of a lost church wall painting showing the Dom Tower and houses' },
    ],
    sources: [['Read the history of Domplein', 'https://erfgoed.utrecht.nl/verhalen/domplein'], ['History of the Salvatorkerk', 'https://erfgoed.utrecht.nl/verhalen/salvatorkerk'], ['See Saenredam’s 1636 drawing of the nave', 'https://verhaalvanutrecht.nl/verhalen/een-pestepidemie-verlengt-het-bezoek-van-tekenaar-saenredam/']]
  },
  {
    id: 'vredenburg', coords: [52.09250, 5.11389], period: '1577–1581 · VREDENBURG', title: 'From fortress to market square',
    summary: 'Vredenburg castle was built for Charles V at the edge of the city. After a siege, citizens began demolishing it in 1577; most of the fortress disappeared above ground by 1581. The open site became a market square.',
    image: 'vredenburg', size: [480, 324], imageAlt: 'Historic print imagining Vredenburg castle before its demolition', credit: 'Steven van Lamsweerde · Rijksmuseum · CC0', imageNote: 'A later depiction of the castle, made c. 1707–1729.',
    imagePage: 'https://commons.wikimedia.org/wiki/File:Slot_Vredenburg_te_Utrecht_in_welstand,_v%C3%B3%C3%B3r_1577_Vredenburgh_(titel_op_object),_RP-P-1936-329.jpg',
    locationNote: 'Approximate location within the former castle site.',
    sources: [['The castle and its demolition', 'https://erfgoed.utrecht.nl/verhalen/bouw-en-sloop-van-kasteel-vredenburg'], ['Trijn van Leemput and the demolition', 'https://commons.wikimedia.org/wiki/File:Trijn_Leemput_trekt_met_Utrechtse_vrouwen_op_om_slot_Vredenburg_te_slechten%2C_februari_1577%2C_RP-T-00-2321.jpg']]
  },
  {
    id: 'catharijne', coords: [52.091126, 5.113154], period: '1970–2020 · CATHARIJNESINGEL', title: 'A canal became a road — and a canal again',
    summary: 'Around 1970, part of the city moat was filled in to make way for the Catharijnebaan road beside Hoog Catharijne. Decades later, the road was removed and the water restored. Since 2020 the canal has encircled the old city again.',
    image: 'catharijne', size: [480, 640], imageAlt: 'Four-lane Catharijnebaan road beside Hoog Catharijne', credit: 'Luctor · 2008 · public domain', locationNote: 'The marker shows where this photograph was taken, at Hoog Catharijne.',
    imagePage: 'https://commons.wikimedia.org/wiki/File:Catharijnesingel.jpg',
    sources: [['The story of the city canal', 'https://erfgoed.utrecht.nl/verhalen/singelroute/een-singel-rondom'], ['A second photograph of the road', 'https://commons.wikimedia.org/wiki/File:Catharijnesingel20082.jpg']]
  },
  {
    id: 'walls', coords: [52.08531, 5.11910], period: '19TH CENTURY · CATHARIJNESINGEL', title: 'The walls became a park',
    summary: 'For centuries the city moat and walls formed a defensive boundary. From around 1830 much of the wall was dismantled. The Smeetoren on the western wall was demolished in 1855. The former fortifications around the city made room for the landscaped Zocherpark.',
    image: 'fortifications', size: [480, 358], imageAlt: 'Painting of the canal, city wall and Smeetoren before demolition', credit: 'Jan ten Compe · Centraal Museum · public domain', imageNote: 'A view of Catharijnesingel and Smeetoren, c. 1740–1760.', locationNote: 'Approximate site of the Smeetoren near today’s Bartholomeïbrug.',
    imagePage: 'https://commons.wikimedia.org/wiki/File:De_Catharijnesingel_met_de_stadswal_en_de_Smeetoren_te_Utrecht_Centraal_Museum_6849.jpg',
    sources: [['History of the Smeetoren', 'https://erfgoed.utrecht.nl/verhalen/smeetoren'], ['Explore Utrecht’s defences', 'https://erfgoed.utrecht.nl/verhalen/de-utrechtse-stadsverdediging'], ['Saftleven’s drawing of the wall by Probeertoren', 'https://commons.wikimedia.org/wiki/File:Gezicht_op_de_stadswal_van_Utrecht_bij_de_Probeertoren,_RP-T-1879-A-79.jpg'], ['Plan of the old city walls, 1814–1820', 'https://commons.wikimedia.org/wiki/File:HUA-216139-Plattegrond_van_de_stadswal_met_gracht_bolwerken_poorten_en_vier_bastions_te_Utrecht%3B_met_weergave_van_de_aangrenzende_wegen_watergangen_bebouwingsblo.jpg']]
  },
  {
    id: 'lepelenburg', coords: [52.08926, 5.12847], period: '1578–1580 · LEPELENBURG', title: 'A bastion became a park',
    summary: 'Lepelenburg was one of five large earthen bastions added to the city defences around 1578–1580. They were platforms for artillery, and the moat had to be reshaped around them. In the nineteenth century the bastion became part of the Zocherpark.',
    image: 'lepelenburg', size: [480, 580], imageAlt: 'Seventeenth-century view through a window towards buildings in Utrecht', credit: 'Herman Saftleven · Rijksmuseum · CC0', imageNote: 'The museum tentatively identifies the view as Lepelenburg or Huis Wittenhorst; the exact location is uncertain.',
    imagePage: 'https://commons.wikimedia.org/wiki/File:Gezicht_door_een_venster_op_Utrecht,_RP-T-1888-A-1488.jpg',
    locationNote: 'The marker identifies the former bastion site in the park.',
    sources: [['History of Lepelenburg', 'https://erfgoed.utrecht.nl/verhalen/bolwerk-lepelenburg']]
  },
  {
    id: 'mariakerk', coords: [52.08917, 5.11667], period: '1813–1844 · MARIAPLAATS', title: 'The church that disappeared',
    summary: 'The Romanesque Mariakerk once stood here. Most of the church was demolished in 1813; its choir followed in 1844. A covered cloister around the courtyard remains, a quiet fragment of the medieval complex.',
    image: 'mariakerk', size: [480, 634], imageAlt: 'Pieter Saenredam’s painting of the interior of the Mariakerk', credit: 'Pieter Saenredam · 1637 · Rijksmuseum · CC0',
    imagePage: 'https://commons.wikimedia.org/wiki/File:Het_transept_van_de_Mariakerk_te_Utrecht,_gezien_vanuit_het_noordoosten,_SK-A-858.jpg',
    locationNote: 'Approximate site of the church at Mariaplaats.',
    sources: [['History of the Mariakerk', 'https://erfgoed.utrecht.nl/verhalen/mariakerk']]
  },
  {
    id: 'railway', coords: [52.0878, 5.1112], period: '1866 · STATION AREA', title: 'A canal made way for the railway',
    summary: 'The railway reshaped the western edge of Utrecht in the nineteenth century. The Herengracht was filled in during 1866 to make room for railway infrastructure; the neighbouring Bloemgracht was widened and later became known as the Kruisvaart.',
    locationNote: 'The marker indicates the railway corridor where the former Herengracht ran.',
    sources: [['The railway and the Herengracht', 'https://erfgoed.utrecht.nl/verhalen/staatsspoorwegen'], ['The three canals and the railway', 'https://www.utrecht.nl/fileadmin/uploads/documenten/wonen-en-leven/bouwprojecten-en-stedelijke-ontwikkeling/bouwprojecten/zuidwest/kruisvaartkade/2017-07-startdocument-Kruisvaartkade.pdf']]
  },
  {
    id: 'croeselaan', coords: [52.08585, 5.10795], period: '1927–1931 · CROESELAAN', title: 'The canal beneath the street',
    summary: 'Part of the Blekersgracht was filled in between 1927 and 1931, allowing Croeselaan to be widened. Archaeologists later found wooden remains of a drawbridge that had crossed the canal until the filling works.',
    locationNote: 'The marker indicates the former canal corridor under Croeselaan.',
    sources: [['The Blekersgracht excavations', 'https://erfgoed.utrecht.nl/onderzoek-en-publicaties-over-erfgoed/onderzoeksrapporten-archeologie/de-blekersgracht']]
  },
  {
    id: 'sterrenburg', coords: [52.08115, 5.12195], period: '19TH CENTURY · STERRENBURG', title: 'A bastion opened to shipping',
    summary: 'A large part of the Sterrenburg bastion was removed in the nineteenth century to ease shipping along the canal. The 1854 plan records the site and the foundations of the old wall found during the works.',
    image: 'sterrenburg', size: [437, 720], imageAlt: 'Historical plan of the Sterrenburg bastion and the former city wall', credit: 'Het Utrechts Archief · 1854 · public domain',
    imagePage: 'https://commons.wikimedia.org/wiki/File:HUA-216148-Plattegrond_van_het_bastion_Sterrenburg_met_de_Stadsbuitengracht%3B_met_weergave_van_het_plantsoen_met_bebouwing_en_de_fundamenten_van_de_oude_walmuur_a.jpg',
    locationNote: 'Approximate site of the former bastion near Tolsteegpoort.',
    sources: [['Utrecht’s bastions', 'https://erfgoed.utrecht.nl/onderzoek-en-publicaties-over-erfgoed/boeken/boek-het-utrechtse-antwoord']]
  },
  {
    id: 'maliebaan', coords: [52.08855, 5.12982], period: '1637 · MALIEBAAN', title: 'A playing field outside the city',
    summary: 'Laid out in 1637, the Maliebaan was a long tree-lined course for the game of malie. It began beyond the old city; over time the surrounding area was built up into the boulevard and neighbourhood seen today.',
    image: 'maliebaan', size: [480, 300], imageAlt: 'Historic print of the tree-lined Maliebaan in Utrecht', credit: 'Jan van Vianen after Caspar Specht · Rijksmuseum · CC0', imageNote: 'The print dates from 1697 and/or 1715.',
    imagePage: 'https://commons.wikimedia.org/wiki/File:Gezicht_op_de_Maliebaan_te_Utrecht_%27t_vermakelyck_gesicht_van_de_Maliebaen_%27t_Utrecht_Alwaar_De_Vreede_Tusschen_De_koningen_van_Spangien_en_Portugal_Geteekent_is_(titel_op_object),_RP-P-1959-607.jpg',
    locationNote: 'The marker identifies the southern end of the former playing course.',
    sources: [['The history of the Maliebaan (PDF)', 'https://www.utrecht.nl/fileadmin/uploads/documenten/wonen-en-leven/verkeer/verkeersprojecten/maliebaan-malieblad/2021-10-integraal-programma-van-eisen-maliebaan.pdf']]
  },
  {
    id: 'nieuwegracht', coords: [52.0870, 5.1264], period: '1391–1393 · NIEUWEGRACHT', title: 'A newer canal, a different purpose',
    summary: 'The Nieuwegracht was dug between 1391 and 1393, east of the older Oudegracht. It was used less for trade: unlike parts of the Oudegracht, some stretches had cellars opening straight onto the water without a lower quay.',
    image: 'nieuwegracht', size: [480, 333], imageAlt: 'Seventeenth-century view of Onder de Linden on the Nieuwegracht in Utrecht', credit: 'Herman Saftleven · Rijksmuseum · CC0',
    imagePage: 'https://commons.wikimedia.org/wiki/File:Gezicht_op_Onder_de_Linden_(Nieuwe_Gracht)_te_Utrecht,_RP-T-1891-A-2427.jpg',
    locationNote: 'The marker indicates a point along the Nieuwegracht. Saftleven’s drawing shows the southern stretch known as Onder de Linden.',
    sources: [['The wharves and canals of Utrecht', 'https://erfgoed.utrecht.nl/verhalen/de-utrechtse-werven']]
  }
];

// Coordinates identify a landmark or a documented viewing area.
const HISTORIC_GALLERY = [
  { title: 'Town Hall and Oudegracht', date: 'c. 1855–1880', kind: 'Albumen photograph', maker: 'Anonymous', institution: 'Rijksmuseum · RP-F-F00929-E', rights: 'CC0', coords: [52.090886, 5.120206], location: 'Oudegracht near Kalisbrug (approximate)', locationNote: 'Approximate viewpoint near Kalisbrug, looking north along Oudegracht toward the town hall and Stadhuisbrug.', approximate: true, size: [480, 593], src: 'assets/heritage/utrecht-01', page: 'https://commons.wikimedia.org/wiki/File:Stadhuis_van_Utrecht_met_op_de_voorgrond_de_Oudegracht,_RP-F-F00929-E.jpg', alt: 'Historic photograph of Utrecht town hall and Oudegracht' },
  { title: 'Oudegracht towards the Dom Tower and town hall', date: 'c. 1860–1900', kind: 'Albumen photograph', maker: 'Attributed to Andries Jager', institution: 'Rijksmuseum · RP-F-F00925-AR', rights: 'CC0', coords: [52.09173, 5.11842], location: 'North end of Bezembrug (approximate)', locationNote: 'Approximate viewpoint at the north end of Bezembrug, looking east-southeast toward Stadhuisbrug. The town hall stands on the left and the Dom Tower rises to the right beyond the buildings. The museum record does not specify the camera position.', locationSource: 'https://commons.wikimedia.org/wiki/File:HUA-1458-Gezicht_op_de_Oudegracht_Weerdzijde_te_Utrecht_met_op_de_achtergrond_de_Stadhuisbrug_en_het_Stadhuis_en_rechts_de_Domtoren.jpg', approximate: true, size: [480, 305], src: 'assets/heritage/utrecht-02', page: 'https://commons.wikimedia.org/wiki/File:Oudegracht_in_Utrecht_gezien_richting_Domtoren_en_stadhuis_Utrecht._De_Oude_Gracht._(titel_op_object),_RP-F-F00925-AR.jpg', alt: 'Oudegracht with the Dom Tower and town hall in the distance' },
  { title: 'Oudegracht and Weesbrug', date: '1850–1900', kind: 'Cabinet photograph', maker: 'Van Winsen; published by B. Brugsma Azn.', institution: 'Rijksmuseum · RP-F-F19347', rights: 'Public domain', coords: [52.087276, 5.121877], location: 'Weesbrug', locationNote: 'Depicted landmark: Weesbrug on Oudegracht.', locationSource: 'https://commons.wikimedia.org/wiki/File:Weesbrug_Utrecht.JPG', size: [480, 252], src: 'assets/heritage/utrecht-03', page: 'https://www.rijksmuseum.nl/en/collection/object/Gezicht-op-de-Oudegracht-en-de-Weesbrug-te-Utrecht--8d773700782adbd882437452a51901c9', alt: 'Historic cabinet photograph of Oudegracht and Weesbrug' },
  { title: 'Oudegracht and Bakkerbrug', date: 'c. 1890–1905', kind: 'Photochrom print', maker: 'Unknown; Library of Congress collection', institution: 'Library of Congress · ppmsc.05869', rights: 'Public domain (LOC: no known restrictions)', coords: [52.091778, 5.117210], location: 'Bakkerbrug', locationNote: 'Depicted landmark: Bakkerbrug on Oudegracht.', locationSource: 'https://commons.wikimedia.org/wiki/Category:Bakkerbrug,_Utrecht', size: [480, 347], src: 'assets/heritage/utrecht-05', page: 'https://commons.wikimedia.org/wiki/File:Utrecht_-_Oude_Gracht_en_Bakkerbrug_1900.jpg', alt: 'Color photochrom view of Oudegracht and Bakkerbrug around 1900' },
  { title: 'Vleutenswetering and De Kat windmill', date: 'c. 1840–1860', kind: 'Photograph of a historical view', maker: 'Unknown', institution: 'Het Utrechts Archief · HUA-39426', rights: 'Public domain', coords: [52.09250, 5.10605], location: 'Former De Kat windmill', locationNote: 'Depicted landmark: the former De Kat windmill by the Vleutenschevaart. The view is from the northwest.', locationSource: 'https://www.molendatabase.nl/molens/ten-bruggencate-nr-01041-c', size: [480, 404], src: 'assets/heritage/utrecht-06', page: 'https://commons.wikimedia.org/wiki/File:HUA-39426-Gezicht_op_de_Vleutenswetering_te_Utrecht_met_de_molen_De_Kat_uit_het_noordwesten.jpg', alt: 'View of Vleutenswetering and De Kat windmill' },
  { title: 'Vismarkt and Dom Tower from Stadhuisbrug', date: 'Historical view', kind: 'Archival image', maker: 'See archive record', institution: 'Het Utrechts Archief · HUA-202717', rights: 'Public domain', coords: [52.0917, 5.1197], location: 'Stadhuisbrug', locationNote: 'Documented viewpoint: Stadhuisbrug, looking toward Vismarkt and the Dom Tower.', size: [464, 720], src: 'assets/heritage/utrecht-07', page: 'https://commons.wikimedia.org/wiki/File:HUA-202717-Gezicht_op_de_Vismarkt_en_de_Domtoren_te_Utrecht_vanaf_de_Stadhuisbrug.jpg', alt: 'Vismarkt and Dom Tower seen from Stadhuisbrug' },
  { title: 'View on the Oudegracht', date: '1889', kind: 'Oil painting', maker: 'Petrus Gerardus Vertin', institution: 'Reproduction source: AAG · Wikimedia Commons', rights: 'Public domain artwork', coords: [52.08919, 5.12115], location: 'Oudegracht near Gaardbrug (approximate)', locationNote: 'The marker indicates an approximate location near Gaardbrug. The bridge in the painting and the viewpoint remain unconfirmed.', approximate: true, size: [480, 595], src: 'assets/heritage/utrecht-09', page: 'https://commons.wikimedia.org/wiki/File:View_on_the_Oudegracht,_Utrecht,_by_Petrus_Gerardus_Vertin.jpg', alt: 'Petrus Gerardus Vertin painting of the Oudegracht in Utrecht' },
  { title: 'Mariagracht and Mariawaterpoortje', date: 'c. 1755–1765', kind: 'Drawing', maker: 'Dirk Verrijk', institution: 'Het Utrechts Archief · HUA-35502', rights: 'Public domain', coords: [52.08834, 5.11337], location: 'Former Mariagracht (approximate)', locationNote: 'Verrijk drew the canal looking east toward the Mariawaterpoortje and the Dom Tower. The marker sits on the former canal alignment near an archaeological borehole that identified canal fill. The exact viewpoint remains unknown.', locationSource: 'https://archisarchief.cultureelerfgoed.nl/Archis2/Archeorapporten/37/AR33107/V-13.0101%20Utrecht.pdf', approximate: true, size: [480, 319], src: 'assets/heritage/utrecht-11', page: 'https://commons.wikimedia.org/wiki/File:HUA-35502-Gezicht_op_de_Mariagracht_te_Utrecht_uit_het_westen_met_aan_weerszijden_een_dubbele_bomenrij_en_aan_het_eind_de_stadsmuur_met_het_Mariawaterpoortje.jpg', alt: 'Dirk Verrijk drawing of Mariagracht ending at Mariawaterpoortje' },
  { title: 'View on the Oude Gracht', date: '1830', kind: 'Lithograph', maker: 'Reinier Craeyvanger', institution: 'Rijksmuseum · RP-P-OB-27.843', rights: 'CC0', coords: [52.08825, 5.12146], location: 'Oudegracht south of Hamburgerbrug (approximate)', locationNote: 'Approximate viewpoint on the southern stretch of Oudegracht, looking north toward the Dom Tower. The bridge in the print remains unconfirmed.', locationSource: 'https://id.rijksmuseum.nl/200178079', approximate: true, size: [480, 503], src: 'assets/heritage/utrecht-12', page: 'https://commons.wikimedia.org/wiki/File:Gezicht_op_de_Oude_Gracht_in_Utrecht_Zes_gezichten_op_Utrecht_(serietitel),_RP-P-OB-27.843.jpg', alt: 'Lithograph of Oudegracht, bridge and Dom Tower' },
  { title: 'Utrecht from Paardenveld', date: '1756', kind: 'Etching', maker: 'Jan Caspar Philips after Jan de Beijer', institution: 'Rijksmuseum · RP-P-1911-3165', rights: 'Public domain', coords: [52.09486, 5.11100], location: 'Paardenveld', locationNote: 'Documented viewing area: Paardenveld. The marker indicates the area rather than the artist’s exact position.', locationSource: 'https://erfgoed.utrecht.nl/verhalen/paardenveld', size: [480, 252], src: 'assets/heritage/utrecht-14', page: 'https://www.rijksmuseum.nl/en/collection/object/Gezicht-op-Utrecht--3a10cb1aa8ece6f6e21db47db7dcf4d9', alt: 'Etching showing Utrecht from Paardenveld with a windmill' },
  { title: 'Suburb outside the Waardpoort', date: '1786–1792', kind: 'Etching', maker: 'Carel Frederik Bendorp after Jan Bulthuis', institution: 'Rijksmuseum · RP-P-2019-2404', rights: 'Public domain', coords: [52.0985, 5.1138], location: 'Stenenbrug over the Vecht (approximate)', locationNote: 'The print shows the suburb outside the former Weerdpoort. The marker uses today’s Stenenbrug over the Vecht, beyond Weerdsluis, as an approximate reference point.', locationSource: 'https://www.utrecht.nl/fileadmin/uploads/documenten/wonen-en-leven/verkeer/boot/vaarkaart.pdf', approximate: true, size: [480, 252], src: 'assets/heritage/utrecht-15', page: 'https://www.rijksmuseum.nl/en/collection/object/Gezicht-op-Utrecht--afebfdb11f0feb7bd55efc77a9885a45', alt: 'Etching of the suburb outside Utrecht Waardpoort' },
  { title: 'Panoramic view of Utrecht', date: '1650–1665', kind: 'Oil painting', maker: 'Joost Cornelisz. Droochsloot', institution: 'Centraal Museum · object 2298', rights: 'Public domain', coords: [52.0908, 5.1047], location: 'Leidse Rijn near Lombokplein (approximate)', locationNote: 'The marker indicates an approximate viewpoint by the Leidse Rijn, northwest of Utrecht Centraal. The museum describes the panorama as a view from the west. The exact viewpoint remains unknown.', approximate: true, size: [480, 136], src: 'assets/heritage/utrecht-16', page: 'https://www.centraalmuseum.nl/en/collection/2298-gezicht-op-de-stad-utrecht-joost-cornelisz-droochsloot', alt: 'Panoramic painting of Utrecht from the west before the 1674 storm' },
  { title: 'Imagined view of the city of Utrecht', date: '1660–1670', kind: 'Oil painting', maker: 'Willem van Drielenburg', institution: 'Centraal Museum · object 17302', rights: 'Public domain', locationNote: 'The museum describes this as an imagined cityscape.', size: [480, 341], src: 'assets/heritage/utrecht-17', page: 'https://www.centraalmuseum.nl/en/collection/17302-gefantaseerd-gezicht-op-de-stad-utrecht-willem-van-drielenburg', alt: 'Imagined 17th-century cityscape of Utrecht by Willem van Drielenburg' },
  { title: 'Utrecht city square with the Dom Tower', date: 'c. 1800–1815', kind: 'Watercolour and ink drawing', maker: 'Jan Hendrik Verheijen', institution: 'Centraal Museum · object 23782', rights: 'Public domain', locationNote: 'This study for an imagined cityscape includes the recognizable Dom Tower.', size: [480, 356], src: 'assets/heritage/utrecht-18', page: 'https://www.centraalmuseum.nl/en/collection/23782-stadsplein-met-de-domtoren-van-utrecht-jan-hendrik-verheijen', alt: 'Watercolour study of a Utrecht square and Dom Tower' },
  { title: 'Evening view from Van Wijckskade', date: 'c. 1890', kind: 'Oil painting', maker: 'Gerrit van Dokkum', institution: 'Centraal Museum · object 18014', rights: 'Public domain', coords: [52.09642, 5.11765], location: 'Van Asch van Wijckskade at Predikherenkerkhof', locationNote: 'Documented viewing area: the corner by the passage to Predikherenkerkhof. The artist’s family home was demolished. The marker indicates the approximate corner.', locationSource: 'https://www.utrecht.nl/ondernemen/vergunningen-en-regels/goederenvervoer/voertuigbeperkingen-en-goederenvervoerroutes/nieuwe-regels-vrachtautos-en-bestelbussen-in-binnenstad', size: [480, 656], src: 'assets/heritage/utrecht-19', page: 'https://www.centraalmuseum.nl/en/collection/18014-uitzicht-bij-avond-vanuit-hoek-van-wijckskade-utrecht-gerrit-van-dokkum', alt: 'Evening view at Van Wijckskade in Utrecht' }
];


(() => {
  const toggle = $('poiToggle');
  const layer = $('poiLayer');
  const panel = $('poiPanel');
  const content = $('poiContent');
  const back = $('poiBack');
  const lightbox = $('poiLightbox');
  const lightboxImage = $('poiLightboxImage');
  const lightboxClose = $('poiLightboxClose');
  const lightboxStatus = $('poiLightboxStatus');
  const lightboxSource = $('poiLightboxSource');
  const stories = HISTORIC_PLACES.map(place => ({ ...place, key: place.id }));
  const gallery = HISTORIC_GALLERY.map((item, index) => ({ ...item, key: 'image-' + (index + 1), isImage: true }));
  const mappedEntries = [...stories, ...gallery].filter(item => item.coords);
  const navigation = [];
  let markers = new Map();
  let enabled = false;
  let positionFrame = 0;
  let imageTrigger;
  let hoveredEntry;
  let focusedEntry;

  function element(tag, text, className) {
    const node = document.createElement(tag);
    if (text) node.textContent = text;
    if (className) node.className = className;
    return node;
  }

  function link(text, url, className) {
    const anchor = element('a', text, className);
    anchor.href = url;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    return anchor;
  }

  function heading(text) {
    const title = element('h2', text);
    title.tabIndex = -1;
    return title;
  }

  function listItem(item, onClick) {
    const label = item.isImage ? [item.title, item.date, item.location].filter(Boolean).join(' · ') : item.title;
    const button = element('button', '', 'poi-list-item');
    const arrow = element('span', '→');
    arrow.setAttribute('aria-hidden', 'true');
    button.type = 'button';
    button.dataset.entry = item.key;
    button.append(element('span', label), arrow);
    button.addEventListener('click', () => onClick(button));
    button.addEventListener('pointerenter', () => { hoveredEntry = item.key; updateMarkerHighlights(); });
    button.addEventListener('pointerleave', () => { hoveredEntry = null; updateMarkerHighlights(); });
    button.addEventListener('focus', () => { focusedEntry = item.key; updateMarkerHighlights(); });
    button.addEventListener('blur', () => { focusedEntry = null; updateMarkerHighlights(); });
    return button;
  }

  function makeList(entries) {
    const list = element('div', '', 'poi-list');
    for (const item of entries) list.append(listItem(item, button => openEntry(item, button, true)));
    return list;
  }

  function renderList() {
    content.replaceChildren(
      heading('Historical places'),
      element('p', 'Explore how Utrecht has changed over time.', 'poi-list-intro'),
      makeList(stories),
      element('h3', 'Historical images', 'poi-sources-title'),
      makeList(gallery)
    );
    panel.scrollTop = 0;
  }

  function navigate(trigger, render) {
    navigation.push({
      nodes: [...content.childNodes],
      scrollTop: panel.scrollTop,
      trigger,
      markerEntries: trigger.entryKeys
    });
    hoveredEntry = null;
    focusedEntry = null;
    updateMarkerHighlights();
    content.replaceChildren();
    back.hidden = false;
    render();
    panel.scrollTop = 0;
    content.querySelector('h2').focus({ preventScroll: true });
  }

  function goBack(restoreFocus = true) {
    const previous = navigation.pop();
    if (!previous) return;
    content.replaceChildren(...previous.nodes);
    back.hidden = navigation.length === 0;
    panel.scrollTop = previous.scrollTop;
    if (!restoreFocus) return;
    const replacement = previous.markerEntries && [...markers.values()].find(marker =>
      !marker.hidden && marker.entryKeys.some(key => previous.markerEntries.includes(key))
    );
    const trigger = previous.trigger.isConnected && !previous.trigger.hidden ? previous.trigger : replacement;
    (trigger || content.querySelector('h2')).focus({ preventScroll: true });
  }

  function centerOn(coords) {
    const zoom = mapB.getZoom();
    const offset = panel.offsetWidth / 2;
    const center = mapB.unproject(mapB.project(coords, zoom).add([offset, 0]), zoom);
    mapB.panTo(center, { animate: !REDUCED, duration: 0.6 });
  }

  function openEntry(item, trigger, fromList = false) {
    navigate(trigger, () => item.isImage ? renderGalleryItem(item) : renderStory(item));
    if (fromList && item.coords) centerOn(item.coords);
  }

  function imagePath(src, variant) {
    return src.replace(/\/([^/]+)$/, '/' + variant + '/$1.webp');
  }

  function renderFigure(src, size, alt, notes, original) {
    const figure = element('figure', '', 'poi-figure');
    const button = element('button', '', 'poi-image-button');
    button.type = 'button';
    button.setAttribute('aria-label', 'Enlarge image: ' + alt);
    const preview = element('img');
    preview.alt = alt;
    [preview.width, preview.height] = size;
    preview.loading = 'lazy';
    preview.decoding = 'async';
    button.append(preview);
    const fallback = element('p', 'Image unavailable. ', 'poi-story');
    fallback.append(link('Open the original', original));
    fallback.hidden = true;
    preview.addEventListener('error', () => {
      fallback.hidden = false;
      const hadFocus = document.activeElement === button;
      button.hidden = true;
      if (hadFocus) fallback.querySelector('a').focus();
    });
    preview.src = imagePath(src, 'preview');
    button.addEventListener('click', () => {
      imageTrigger = button;
      lightboxImage.hidden = true;
      lightboxImage.alt = alt;
      lightboxStatus.hidden = false;
      lightboxStatus.textContent = 'Loading image…';
      lightboxSource.href = original;
      lightbox.showModal();
      lightboxImage.src = imagePath(src, 'detail');
    });
    const caption = element('figcaption');
    for (const note of notes.filter(Boolean)) caption.append(element('span', note));
    figure.append(button, fallback, caption);
    return figure;
  }

  function appendGalleryImage(item) {
    content.append(
      renderFigure(item.src, item.size, item.alt, [item.description, item.maker, item.institution, item.rights], item.page),
      link('Open source record ↗', item.page, 'poi-image-link')
    );
  }

  function renderGalleryItem(item) {
    content.append(element('p', item.date + ' · ' + item.kind, 'poi-period'), heading(item.title));
    appendGalleryImage(item);
    content.append(element('p', item.locationNote, 'poi-story poi-location'));
    if (item.locationSource) content.append(link('Location source ↗', item.locationSource, 'poi-image-link'));
    if (item.approximate) {
      const show = element('button', 'Show approximate point on map', 'poi-map-action');
      show.type = 'button';
      show.addEventListener('click', () => centerOn(item.coords));
      content.append(show);
    }
  }

  function renderStory(place) {
    content.append(
      element('p', place.period, 'poi-period'),
      heading(place.title),
      element('p', place.summary, 'poi-story')
    );
    if (place.image) {
      content.append(
        renderFigure('assets/poi/' + place.image, place.size, place.imageAlt, [place.imageNote, place.credit], place.imagePage),
        link('View original image ↗', place.imagePage, 'poi-image-link')
      );
    }
    if (place.locationNote) content.append(element('p', place.locationNote, 'poi-story poi-location'));
    for (const image of place.relatedImages || []) {
      content.append(
        element('h3', image.title, 'poi-sources-title'),
        element('p', image.date + ' · ' + image.kind, 'poi-period')
      );
      appendGalleryImage(image);
    }
    const sources = element('div', '', 'poi-sources');
    for (const [text, url] of place.sources) sources.append(link(text + ' ↗', url));
    content.append(element('h3', 'Sources', 'poi-sources-title'), sources);
  }

  function createMarker(entries) {
    const button = element('button', '', 'poi-marker');
    button.type = 'button';
    button.entryKeys = entries.map(item => item.key);
    const isGroup = entries.length > 1;
    const label = isGroup ? entries.length + ' nearby places and images' : entries[0].title;
    button.setAttribute('aria-label', label);
    button.title = label;
    button.classList.toggle('poi-image-marker', !isGroup && entries[0].isImage);
    button.classList.toggle('poi-group-marker', isGroup);
    const dot = element('span', isGroup ? String(entries.length) : '', 'poi-dot');
    dot.setAttribute('aria-hidden', 'true');
    const ringOne = element('span', '', 'poi-ring poi-ring-one');
    const ringTwo = element('span', '', 'poi-ring poi-ring-two');
    ringOne.setAttribute('aria-hidden', 'true'); ringTwo.setAttribute('aria-hidden', 'true');
    button.append(dot, ringOne, ringTwo);
    button.addEventListener('click', () => {
      while (navigation.length) goBack(false);
      if (isGroup) {
        navigate(button, () => content.append(heading('Nearby places and images'), makeList(entries)));
      } else {
        openEntry(entries[0], button);
      }
    });
    layer.append(button);
    return button;
  }

  function updateMarkerHighlights() {
    for (const marker of markers.values()) {
      marker.classList.toggle('is-highlighted', marker.entryKeys.includes(hoveredEntry) || marker.entryKeys.includes(focusedEntry));
    }
  }

  function positionMarkers() {
    positionFrame = 0;
    if (!enabled) return;
    const size = mapB.getSize();
    const visibleWidth = size.x - panel.offsetWidth;
    const points = mappedEntries.map(item => ({ item, point: mapB.latLngToContainerPoint(item.coords) }));
    const groups = points.map(({ item, point }) => ({ entries: [item], x: point.x, y: point.y }));
    const active = document.activeElement;
    const next = new Map();
    for (const { entries, x, y } of groups) {
      const key = entries.map(item => item.key).join('|');
      const button = markers.get(key) || createMarker(entries);
      button.hidden = x < 0 || x >= visibleWidth || y < 0 || y >= size.y;
      button.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0) translate(-50%,-50%)';
      next.set(key, button);
    }
    const activeKeys = active?.entryKeys;
    if (activeKeys && ![...next.values()].some(marker => marker === active && !marker.hidden)) {
      const replacement = [...next.values()].find(marker => !marker.hidden && marker.entryKeys.some(key => activeKeys.includes(key)));
      (replacement || toggle).focus({ preventScroll: true });
    }
    for (const [key, button] of markers) if (!next.has(key)) button.remove();
    markers = next;
    updateMarkerHighlights();
  }

  function schedulePositions() {
    if (enabled && !positionFrame) positionFrame = requestAnimationFrame(positionMarkers);
  }

  function setEnabled(value) {
    enabled = value;
    toggle.classList.toggle('on', enabled);
    toggle.setAttribute('aria-expanded', String(enabled));
    toggle.setAttribute('aria-label', enabled ? 'Close historical places' : 'Show historical places');
    toggle.title = enabled ? 'Close historical places' : 'Historical places';
    layer.hidden = !enabled;
    panel.classList.toggle('is-open', enabled);
    panel.setAttribute('aria-hidden', String(!enabled));
    panel.inert = !enabled;
    document.body.classList.toggle('poi-open', enabled);
    navigation.length = 0;
    back.hidden = true;
    if (enabled) {
      leaveLens();
      renderList();
      positionMarkers();
      content.querySelector('h2').focus({ preventScroll: true });
    } else {
      toggle.focus({ preventScroll: true });
    }
    updateNotice();
  }

  toggle.addEventListener('click', () => setEnabled(!enabled));
  back.addEventListener('click', () => goBack());
  lightboxClose.addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('click', event => { if (event.target === lightbox) lightbox.close(); });
  lightbox.addEventListener('close', () => {
    lightboxImage.removeAttribute('src');
    if (imageTrigger?.isConnected) imageTrigger.focus({ preventScroll: true });
  });
  lightboxImage.addEventListener('load', () => {
    if (!lightbox.open) return;
    lightboxStatus.hidden = true;
    lightboxImage.hidden = false;
  });
  lightboxImage.addEventListener('error', () => {
    if (!lightbox.open) return;
    lightboxStatus.hidden = false;
    lightboxStatus.textContent = 'Image unavailable. Open the source record for the original.';
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || lightbox.open || !$('info').classList.contains('hidden') || !enabled || event.defaultPrevented) return;
    if (navigation.length) goBack();
    else setEnabled(false);
  });
  mapB.on('move zoom resize', schedulePositions);
})();

// Positions are in screen pixels so the same hit target works at every zoom.
function groupNearbyMarkers(points, diameter) {
  const groups = points.map(({ item, point }) => ({ entries: [item], x: point.x, y: point.y }));
  for (let i = 0; i < groups.length; i++) {
    const group = groups[i];
    const neighbor = groups.findIndex((other, j) => j > i && Math.hypot(group.x - other.x, group.y - other.y) < diameter);
    if (neighbor < 0) continue;
    const [other] = groups.splice(neighbor, 1);
    const count = group.entries.length + other.entries.length;
    group.x = (group.x * group.entries.length + other.x * other.entries.length) / count;
    group.y = (group.y * group.entries.length + other.y * other.entries.length) / count;
    group.entries.push(...other.entries);
    i = -1;
  }
  return groups;
}
