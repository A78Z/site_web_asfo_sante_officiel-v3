// ---------------------------------------------------------------------------
// Senegal Administrative Divisions
// 14 Regions - 46 Departements - All Communes
// ---------------------------------------------------------------------------

export interface CommuneEntry {
  region: string;
  departement: string;
  commune: string;
}

export const SENEGAL_GEO: CommuneEntry[] = [
  // =========================================================================
  // 1. DAKAR (4 departements)
  // =========================================================================

  // --- Departement Dakar ---
  { region: "Dakar", departement: "Dakar", commune: "Biscuiterie" },
  { region: "Dakar", departement: "Dakar", commune: "Camberene" },
  { region: "Dakar", departement: "Dakar", commune: "Dieuppeul-Derkle" },
  { region: "Dakar", departement: "Dakar", commune: "Fann-Point E-Amitie" },
  { region: "Dakar", departement: "Dakar", commune: "Goree" },
  { region: "Dakar", departement: "Dakar", commune: "Grand Dakar" },
  { region: "Dakar", departement: "Dakar", commune: "Grand Yoff" },
  { region: "Dakar", departement: "Dakar", commune: "Gueule Tapee-Fass-Colobane" },
  { region: "Dakar", departement: "Dakar", commune: "Hann Bel-Air" },
  { region: "Dakar", departement: "Dakar", commune: "HLM" },
  { region: "Dakar", departement: "Dakar", commune: "Medina" },
  { region: "Dakar", departement: "Dakar", commune: "Mermoz-Sacre-Coeur" },
  { region: "Dakar", departement: "Dakar", commune: "Ngor" },
  { region: "Dakar", departement: "Dakar", commune: "Ouakam" },
  { region: "Dakar", departement: "Dakar", commune: "Parcelles Assainies" },
  { region: "Dakar", departement: "Dakar", commune: "Patte d'Oie" },
  { region: "Dakar", departement: "Dakar", commune: "Plateau" },
  { region: "Dakar", departement: "Dakar", commune: "Sicap-Liberte" },
  { region: "Dakar", departement: "Dakar", commune: "Yoff" },

  // --- Departement Guediawaye ---
  { region: "Dakar", departement: "Guediawaye", commune: "Golf Sud" },
  { region: "Dakar", departement: "Guediawaye", commune: "Guediawaye" },
  { region: "Dakar", departement: "Guediawaye", commune: "Ndiareme Limamoulaye" },
  { region: "Dakar", departement: "Guediawaye", commune: "Sam Notaire" },
  { region: "Dakar", departement: "Guediawaye", commune: "Wakhinane Nimzatt" },

  // --- Departement Pikine ---
  { region: "Dakar", departement: "Pikine", commune: "Diamaguene Sicap Mbao" },
  { region: "Dakar", departement: "Pikine", commune: "Djiddah Thiaroye Kao" },
  { region: "Dakar", departement: "Pikine", commune: "Guinaw Rail Nord" },
  { region: "Dakar", departement: "Pikine", commune: "Guinaw Rail Sud" },
  { region: "Dakar", departement: "Pikine", commune: "Keur Massar" },
  { region: "Dakar", departement: "Pikine", commune: "Malika" },
  { region: "Dakar", departement: "Pikine", commune: "Mbao" },
  { region: "Dakar", departement: "Pikine", commune: "Pikine-Est" },
  { region: "Dakar", departement: "Pikine", commune: "Pikine-Nord" },
  { region: "Dakar", departement: "Pikine", commune: "Pikine-Ouest" },
  { region: "Dakar", departement: "Pikine", commune: "Thiaroye Gare" },
  { region: "Dakar", departement: "Pikine", commune: "Thiaroye sur Mer" },
  { region: "Dakar", departement: "Pikine", commune: "Tivaouane Diacksao" },
  { region: "Dakar", departement: "Pikine", commune: "Yeumbeul Nord" },
  { region: "Dakar", departement: "Pikine", commune: "Yeumbeul Sud" },
  { region: "Dakar", departement: "Pikine", commune: "Jaxaay-Parcelles-Niakoul Rap" },

  // --- Departement Rufisque ---
  { region: "Dakar", departement: "Rufisque", commune: "Bambilor" },
  { region: "Dakar", departement: "Rufisque", commune: "Bargny" },
  { region: "Dakar", departement: "Rufisque", commune: "Diamniadio" },
  { region: "Dakar", departement: "Rufisque", commune: "Rufisque-Est" },
  { region: "Dakar", departement: "Rufisque", commune: "Rufisque-Nord" },
  { region: "Dakar", departement: "Rufisque", commune: "Rufisque-Ouest" },
  { region: "Dakar", departement: "Rufisque", commune: "Sebikhotane" },
  { region: "Dakar", departement: "Rufisque", commune: "Sendou" },
  { region: "Dakar", departement: "Rufisque", commune: "Tivaouane Peulh-Niaga" },
  { region: "Dakar", departement: "Rufisque", commune: "Yene" },

  // =========================================================================
  // 2. DIOURBEL (3 departements)
  // =========================================================================

  // --- Departement Bambey ---
  { region: "Diourbel", departement: "Bambey", commune: "Bambey" },
  { region: "Diourbel", departement: "Bambey", commune: "Baba Garage" },
  { region: "Diourbel", departement: "Bambey", commune: "Dinguiraye" },
  { region: "Diourbel", departement: "Bambey", commune: "Keur Samba Kane" },
  { region: "Diourbel", departement: "Bambey", commune: "Lambaye" },
  { region: "Diourbel", departement: "Bambey", commune: "Ngoye" },
  { region: "Diourbel", departement: "Bambey", commune: "Ndondol" },
  { region: "Diourbel", departement: "Bambey", commune: "Refane" },
  { region: "Diourbel", departement: "Bambey", commune: "Thiakhar" },

  // --- Departement Diourbel ---
  { region: "Diourbel", departement: "Diourbel", commune: "Diourbel" },
  { region: "Diourbel", departement: "Diourbel", commune: "Ndoulo" },
  { region: "Diourbel", departement: "Diourbel", commune: "Ndindy" },
  { region: "Diourbel", departement: "Diourbel", commune: "Tocky Gare" },
  { region: "Diourbel", departement: "Diourbel", commune: "Touba Mosquee" },
  { region: "Diourbel", departement: "Diourbel", commune: "Patar" },

  // --- Departement Mbacke ---
  { region: "Diourbel", departement: "Mbacke", commune: "Mbacke" },
  { region: "Diourbel", departement: "Mbacke", commune: "Touba" },
  { region: "Diourbel", departement: "Mbacke", commune: "Darou Mousty" },
  { region: "Diourbel", departement: "Mbacke", commune: "Dalla Ngabou" },
  { region: "Diourbel", departement: "Mbacke", commune: "Sadio" },
  { region: "Diourbel", departement: "Mbacke", commune: "Taif" },
  { region: "Diourbel", departement: "Mbacke", commune: "Ndame" },
  { region: "Diourbel", departement: "Mbacke", commune: "Missirah" },
  { region: "Diourbel", departement: "Mbacke", commune: "Dankou" },
  { region: "Diourbel", departement: "Mbacke", commune: "Touba Fall" },

  // =========================================================================
  // 3. FATICK (3 departements)
  // =========================================================================

  // --- Departement Fatick ---
  { region: "Fatick", departement: "Fatick", commune: "Fatick" },
  { region: "Fatick", departement: "Fatick", commune: "Diakhao" },
  { region: "Fatick", departement: "Fatick", commune: "Diarere" },
  { region: "Fatick", departement: "Fatick", commune: "Diouroup" },
  { region: "Fatick", departement: "Fatick", commune: "Fimela" },
  { region: "Fatick", departement: "Fatick", commune: "Loul Sessene" },
  { region: "Fatick", departement: "Fatick", commune: "Mbelacadiao" },
  { region: "Fatick", departement: "Fatick", commune: "Ndiob" },
  { region: "Fatick", departement: "Fatick", commune: "Niakhar" },
  { region: "Fatick", departement: "Fatick", commune: "Tattaguine" },

  // --- Departement Foundiougne ---
  { region: "Fatick", departement: "Foundiougne", commune: "Foundiougne" },
  { region: "Fatick", departement: "Foundiougne", commune: "Djilor" },
  { region: "Fatick", departement: "Foundiougne", commune: "Diossong" },
  { region: "Fatick", departement: "Foundiougne", commune: "Keur Saloum Diane" },
  { region: "Fatick", departement: "Foundiougne", commune: "Keur Samba Gueye" },
  { region: "Fatick", departement: "Foundiougne", commune: "Mbam" },
  { region: "Fatick", departement: "Foundiougne", commune: "Niodior" },
  { region: "Fatick", departement: "Foundiougne", commune: "Passy" },
  { region: "Fatick", departement: "Foundiougne", commune: "Soum" },
  { region: "Fatick", departement: "Foundiougne", commune: "Toubacouta" },
  { region: "Fatick", departement: "Foundiougne", commune: "Karang Poste" },
  { region: "Fatick", departement: "Foundiougne", commune: "Nioro Alassane Tall" },
  { region: "Fatick", departement: "Foundiougne", commune: "Djirnda" },

  // --- Departement Gossas ---
  { region: "Fatick", departement: "Gossas", commune: "Gossas" },
  { region: "Fatick", departement: "Gossas", commune: "Colobane" },
  { region: "Fatick", departement: "Gossas", commune: "Mbar" },
  { region: "Fatick", departement: "Gossas", commune: "Ouadiour" },
  { region: "Fatick", departement: "Gossas", commune: "Patar Lia" },

  // =========================================================================
  // 4. KAFFRINE (4 departements)
  // =========================================================================

  // --- Departement Birkelane ---
  { region: "Kaffrine", departement: "Birkelane", commune: "Birkelane" },
  { region: "Kaffrine", departement: "Birkelane", commune: "Keur Mboucki" },
  { region: "Kaffrine", departement: "Birkelane", commune: "Mabo" },
  { region: "Kaffrine", departement: "Birkelane", commune: "Ndiognick" },
  { region: "Kaffrine", departement: "Birkelane", commune: "Segre Gatta" },

  // --- Departement Kaffrine ---
  { region: "Kaffrine", departement: "Kaffrine", commune: "Kaffrine" },
  { region: "Kaffrine", departement: "Kaffrine", commune: "Diamagadio" },
  { region: "Kaffrine", departement: "Kaffrine", commune: "Gniby" },
  { region: "Kaffrine", departement: "Kaffrine", commune: "Kahi" },
  { region: "Kaffrine", departement: "Kaffrine", commune: "Kathiotte" },
  { region: "Kaffrine", departement: "Kaffrine", commune: "Medinatoul Salam 2" },
  { region: "Kaffrine", departement: "Kaffrine", commune: "Nganda" },

  // --- Departement Koungheul ---
  { region: "Kaffrine", departement: "Koungheul", commune: "Koungheul" },
  { region: "Kaffrine", departement: "Koungheul", commune: "Fass Thiekene" },
  { region: "Kaffrine", departement: "Koungheul", commune: "Ida Mouride" },
  { region: "Kaffrine", departement: "Koungheul", commune: "Lour Escale" },
  { region: "Kaffrine", departement: "Koungheul", commune: "Missirah Wadene" },
  { region: "Kaffrine", departement: "Koungheul", commune: "Ribot Escale" },
  { region: "Kaffrine", departement: "Koungheul", commune: "Saly Escale" },

  // --- Departement Malem Hodar ---
  { region: "Kaffrine", departement: "Malem Hodar", commune: "Malem Hodar" },
  { region: "Kaffrine", departement: "Malem Hodar", commune: "Darou Minam 2" },
  { region: "Kaffrine", departement: "Malem Hodar", commune: "Khelcom" },
  { region: "Kaffrine", departement: "Malem Hodar", commune: "Ndioum Ngainth" },
  { region: "Kaffrine", departement: "Malem Hodar", commune: "Sagna" },

  // =========================================================================
  // 5. KAOLACK (3 departements)
  // =========================================================================

  // --- Departement Guinguineo ---
  { region: "Kaolack", departement: "Guinguineo", commune: "Guinguineo" },
  { region: "Kaolack", departement: "Guinguineo", commune: "Mboss" },
  { region: "Kaolack", departement: "Guinguineo", commune: "Ngathie Nawde" },
  { region: "Kaolack", departement: "Guinguineo", commune: "Nguelou" },
  { region: "Kaolack", departement: "Guinguineo", commune: "Ourour" },
  { region: "Kaolack", departement: "Guinguineo", commune: "Fass" },

  // --- Departement Kaolack ---
  { region: "Kaolack", departement: "Kaolack", commune: "Kaolack" },
  { region: "Kaolack", departement: "Kaolack", commune: "Gandiaye" },
  { region: "Kaolack", departement: "Kaolack", commune: "Kahone" },
  { region: "Kaolack", departement: "Kaolack", commune: "Keur Baka" },
  { region: "Kaolack", departement: "Kaolack", commune: "Latmingue" },
  { region: "Kaolack", departement: "Kaolack", commune: "Ndiedieng" },
  { region: "Kaolack", departement: "Kaolack", commune: "Ndoffane" },
  { region: "Kaolack", departement: "Kaolack", commune: "Thiomby" },

  // --- Departement Nioro du Rip ---
  { region: "Kaolack", departement: "Nioro du Rip", commune: "Nioro du Rip" },
  { region: "Kaolack", departement: "Nioro du Rip", commune: "Dabali" },
  { region: "Kaolack", departement: "Nioro du Rip", commune: "Gainthe Pathe" },
  { region: "Kaolack", departement: "Nioro du Rip", commune: "Keur Maba Diakhou" },
  { region: "Kaolack", departement: "Nioro du Rip", commune: "Keur Madiabel" },
  { region: "Kaolack", departement: "Nioro du Rip", commune: "Medina Sabakh" },
  { region: "Kaolack", departement: "Nioro du Rip", commune: "Ngayene" },
  { region: "Kaolack", departement: "Nioro du Rip", commune: "Paoskoto" },
  { region: "Kaolack", departement: "Nioro du Rip", commune: "Porokhane" },
  { region: "Kaolack", departement: "Nioro du Rip", commune: "Taiba Niassene" },
  { region: "Kaolack", departement: "Nioro du Rip", commune: "Wack Ngouna" },
  { region: "Kaolack", departement: "Nioro du Rip", commune: "Keur Madongo" },
  { region: "Kaolack", departement: "Nioro du Rip", commune: "Kayemor" },
  { region: "Kaolack", departement: "Nioro du Rip", commune: "Ndrame Escale" },

  // =========================================================================
  // 6. KEDOUGOU (3 departements)
  // =========================================================================

  // --- Departement Kedougou ---
  { region: "Kedougou", departement: "Kedougou", commune: "Kedougou" },
  { region: "Kedougou", departement: "Kedougou", commune: "Bandafassi" },
  { region: "Kedougou", departement: "Kedougou", commune: "Ninefecha" },
  { region: "Kedougou", departement: "Kedougou", commune: "Tomboronkoto" },
  { region: "Kedougou", departement: "Kedougou", commune: "Dindefelo" },
  { region: "Kedougou", departement: "Kedougou", commune: "Fongolimbi" },

  // --- Departement Salemata ---
  { region: "Kedougou", departement: "Salemata", commune: "Salemata" },
  { region: "Kedougou", departement: "Salemata", commune: "Dar Salam" },
  { region: "Kedougou", departement: "Salemata", commune: "Ethiolo" },
  { region: "Kedougou", departement: "Salemata", commune: "Kevoye" },

  // --- Departement Saraya ---
  { region: "Kedougou", departement: "Saraya", commune: "Saraya" },
  { region: "Kedougou", departement: "Saraya", commune: "Bembou" },
  { region: "Kedougou", departement: "Saraya", commune: "Medina Baffe" },
  { region: "Kedougou", departement: "Saraya", commune: "Missirah Sirimana" },
  { region: "Kedougou", departement: "Saraya", commune: "Sabodala" },

  // =========================================================================
  // 7. KOLDA (3 departements)
  // =========================================================================

  // --- Departement Kolda ---
  { region: "Kolda", departement: "Kolda", commune: "Kolda" },
  { region: "Kolda", departement: "Kolda", commune: "Bagadadji" },
  { region: "Kolda", departement: "Kolda", commune: "Dialambere" },
  { region: "Kolda", departement: "Kolda", commune: "Dioulacolon" },
  { region: "Kolda", departement: "Kolda", commune: "Guiro Yero Bocar" },
  { region: "Kolda", departement: "Kolda", commune: "Mampatim" },
  { region: "Kolda", departement: "Kolda", commune: "Medina Cherif" },
  { region: "Kolda", departement: "Kolda", commune: "Salikegne" },
  { region: "Kolda", departement: "Kolda", commune: "Sinthiang Koundara" },
  { region: "Kolda", departement: "Kolda", commune: "Tankanto Escale" },

  // --- Departement Medina Yoro Foulah ---
  { region: "Kolda", departement: "Medina Yoro Foulah", commune: "Medina Yoro Foulah" },
  { region: "Kolda", departement: "Medina Yoro Foulah", commune: "Badion" },
  { region: "Kolda", departement: "Medina Yoro Foulah", commune: "Bourouco" },
  { region: "Kolda", departement: "Medina Yoro Foulah", commune: "Dabo" },
  { region: "Kolda", departement: "Medina Yoro Foulah", commune: "Fafacourou" },
  { region: "Kolda", departement: "Medina Yoro Foulah", commune: "Kerewane" },
  { region: "Kolda", departement: "Medina Yoro Foulah", commune: "Ndorna" },
  { region: "Kolda", departement: "Medina Yoro Foulah", commune: "Niaming" },
  { region: "Kolda", departement: "Medina Yoro Foulah", commune: "Pata" },
  { region: "Kolda", departement: "Medina Yoro Foulah", commune: "Bignarabe" },

  // --- Departement Velingara ---
  { region: "Kolda", departement: "Velingara", commune: "Velingara" },
  { region: "Kolda", departement: "Velingara", commune: "Bonkonto" },
  { region: "Kolda", departement: "Velingara", commune: "Diaobe-Kabendou" },
  { region: "Kolda", departement: "Velingara", commune: "Kandia" },
  { region: "Kolda", departement: "Velingara", commune: "Kounkane" },
  { region: "Kolda", departement: "Velingara", commune: "Linkering" },
  { region: "Kolda", departement: "Velingara", commune: "Medina Gounass" },
  { region: "Kolda", departement: "Velingara", commune: "Nemataba" },
  { region: "Kolda", departement: "Velingara", commune: "Pakour" },
  { region: "Kolda", departement: "Velingara", commune: "Paroumba" },
  { region: "Kolda", departement: "Velingara", commune: "Sare Coly Sallee" },
  { region: "Kolda", departement: "Velingara", commune: "Sinthiang Koundara" },
  { region: "Kolda", departement: "Velingara", commune: "Bonconto" },

  // =========================================================================
  // 8. LOUGA (3 departements)
  // =========================================================================

  // --- Departement Kebemer ---
  { region: "Louga", departement: "Kebemer", commune: "Kebemer" },
  { region: "Louga", departement: "Kebemer", commune: "Darou Mousty" },
  { region: "Louga", departement: "Kebemer", commune: "Gueoul" },
  { region: "Louga", departement: "Kebemer", commune: "Loro" },
  { region: "Louga", departement: "Kebemer", commune: "Mbadiane" },
  { region: "Louga", departement: "Kebemer", commune: "Ndande" },
  { region: "Louga", departement: "Kebemer", commune: "Sagatta Djoloff" },
  { region: "Louga", departement: "Kebemer", commune: "Sam Yabal" },
  { region: "Louga", departement: "Kebemer", commune: "Thiolom Fall" },
  { region: "Louga", departement: "Kebemer", commune: "Touba Merina" },
  { region: "Louga", departement: "Kebemer", commune: "Bandegne Ouolof" },

  // --- Departement Linguere ---
  { region: "Louga", departement: "Linguere", commune: "Linguere" },
  { region: "Louga", departement: "Linguere", commune: "Barkedji" },
  { region: "Louga", departement: "Linguere", commune: "Boulal" },
  { region: "Louga", departement: "Linguere", commune: "Dahra" },
  { region: "Louga", departement: "Linguere", commune: "Dodji" },
  { region: "Louga", departement: "Linguere", commune: "Gassane" },
  { region: "Louga", departement: "Linguere", commune: "Kamb" },
  { region: "Louga", departement: "Linguere", commune: "Labgar" },
  { region: "Louga", departement: "Linguere", commune: "Mbeuleukhe" },
  { region: "Louga", departement: "Linguere", commune: "Ouarkhokh" },
  { region: "Louga", departement: "Linguere", commune: "Ranerou Ferlo" },
  { region: "Louga", departement: "Linguere", commune: "Sagatta Gueth" },
  { region: "Louga", departement: "Linguere", commune: "Yang-Yang" },

  // --- Departement Louga ---
  { region: "Louga", departement: "Louga", commune: "Louga" },
  { region: "Louga", departement: "Louga", commune: "Coki" },
  { region: "Louga", departement: "Louga", commune: "Guet Ardo" },
  { region: "Louga", departement: "Louga", commune: "Kelle Gueye" },
  { region: "Louga", departement: "Louga", commune: "Keur Momar Sarr" },
  { region: "Louga", departement: "Louga", commune: "Leona" },
  { region: "Louga", departement: "Louga", commune: "Mbediene" },
  { region: "Louga", departement: "Louga", commune: "Nguidile" },
  { region: "Louga", departement: "Louga", commune: "Niomre" },
  { region: "Louga", departement: "Louga", commune: "Pete Ouarack" },
  { region: "Louga", departement: "Louga", commune: "Sakal" },
  { region: "Louga", departement: "Louga", commune: "Thiamene Cayor" },

  // =========================================================================
  // 9. MATAM (3 departements)
  // =========================================================================

  // --- Departement Kanel ---
  { region: "Matam", departement: "Kanel", commune: "Kanel" },
  { region: "Matam", departement: "Kanel", commune: "Dembancane" },
  { region: "Matam", departement: "Kanel", commune: "Hamady Hounare" },
  { region: "Matam", departement: "Kanel", commune: "Nabadji Civol" },
  { region: "Matam", departement: "Kanel", commune: "Ogo" },
  { region: "Matam", departement: "Kanel", commune: "Orkadiere" },
  { region: "Matam", departement: "Kanel", commune: "Ouaounde" },
  { region: "Matam", departement: "Kanel", commune: "Semme" },
  { region: "Matam", departement: "Kanel", commune: "Wounde" },
  { region: "Matam", departement: "Kanel", commune: "Wouro Sidi" },
  { region: "Matam", departement: "Kanel", commune: "Aoure" },
  { region: "Matam", departement: "Kanel", commune: "Bokiladji" },

  // --- Departement Matam ---
  { region: "Matam", departement: "Matam", commune: "Matam" },
  { region: "Matam", departement: "Matam", commune: "Agnam Civol" },
  { region: "Matam", departement: "Matam", commune: "Nabadji Civol" },
  { region: "Matam", departement: "Matam", commune: "Ourossogui" },
  { region: "Matam", departement: "Matam", commune: "Nguidjilone" },
  { region: "Matam", departement: "Matam", commune: "Ogo" },
  { region: "Matam", departement: "Matam", commune: "Thilogne" },
  { region: "Matam", departement: "Matam", commune: "Orefonde" },

  // --- Departement Ranerou ---
  { region: "Matam", departement: "Ranerou", commune: "Ranerou" },
  { region: "Matam", departement: "Ranerou", commune: "Lougre Thioly" },
  { region: "Matam", departement: "Ranerou", commune: "Velingara (Matam)" },

  // =========================================================================
  // 10. SAINT-LOUIS (3 departements)
  // =========================================================================

  // --- Departement Dagana ---
  { region: "Saint-Louis", departement: "Dagana", commune: "Dagana" },
  { region: "Saint-Louis", departement: "Dagana", commune: "Bokhol" },
  { region: "Saint-Louis", departement: "Dagana", commune: "Diama" },
  { region: "Saint-Louis", departement: "Dagana", commune: "Gae" },
  { region: "Saint-Louis", departement: "Dagana", commune: "Mbane" },
  { region: "Saint-Louis", departement: "Dagana", commune: "Ndiaye" },
  { region: "Saint-Louis", departement: "Dagana", commune: "Richard Toll" },
  { region: "Saint-Louis", departement: "Dagana", commune: "Ronkh" },
  { region: "Saint-Louis", departement: "Dagana", commune: "Ross Bethio" },
  { region: "Saint-Louis", departement: "Dagana", commune: "Rosso-Senegal" },
  { region: "Saint-Louis", departement: "Dagana", commune: "Gnith" },

  // --- Departement Podor ---
  { region: "Saint-Louis", departement: "Podor", commune: "Podor" },
  { region: "Saint-Louis", departement: "Podor", commune: "Aere Lao" },
  { region: "Saint-Louis", departement: "Podor", commune: "Bode Lao" },
  { region: "Saint-Louis", departement: "Podor", commune: "Cas-Cas" },
  { region: "Saint-Louis", departement: "Podor", commune: "Dodel" },
  { region: "Saint-Louis", departement: "Podor", commune: "Fanaye" },
  { region: "Saint-Louis", departement: "Podor", commune: "Galoya Toucouleur" },
  { region: "Saint-Louis", departement: "Podor", commune: "Gamadji Sare" },
  { region: "Saint-Louis", departement: "Podor", commune: "Guede Village" },
  { region: "Saint-Louis", departement: "Podor", commune: "Madina Diathbe" },
  { region: "Saint-Louis", departement: "Podor", commune: "Mboumba" },
  { region: "Saint-Louis", departement: "Podor", commune: "Mery" },
  { region: "Saint-Louis", departement: "Podor", commune: "Ndioum" },
  { region: "Saint-Louis", departement: "Podor", commune: "Ndiandane" },
  { region: "Saint-Louis", departement: "Podor", commune: "Pete" },
  { region: "Saint-Louis", departement: "Podor", commune: "Niandane" },
  { region: "Saint-Louis", departement: "Podor", commune: "Salde" },
  { region: "Saint-Louis", departement: "Podor", commune: "Walalde" },
  { region: "Saint-Louis", departement: "Podor", commune: "Demette" },
  { region: "Saint-Louis", departement: "Podor", commune: "Bokke Dialloube" },
  { region: "Saint-Louis", departement: "Podor", commune: "Guede Chantier" },
  { region: "Saint-Louis", departement: "Podor", commune: "Doumga Lao" },

  // --- Departement Saint-Louis ---
  { region: "Saint-Louis", departement: "Saint-Louis", commune: "Saint-Louis" },
  { region: "Saint-Louis", departement: "Saint-Louis", commune: "Gandon" },
  { region: "Saint-Louis", departement: "Saint-Louis", commune: "Fass Ngom" },
  { region: "Saint-Louis", departement: "Saint-Louis", commune: "Mpal" },
  { region: "Saint-Louis", departement: "Saint-Louis", commune: "Ndiebene Gandiol" },

  // =========================================================================
  // 11. SEDHIOU (3 departements)
  // =========================================================================

  // --- Departement Bounkiling ---
  { region: "Sedhiou", departement: "Bounkiling", commune: "Bounkiling" },
  { region: "Sedhiou", departement: "Bounkiling", commune: "Bona" },
  { region: "Sedhiou", departement: "Bounkiling", commune: "Diacounda" },
  { region: "Sedhiou", departement: "Bounkiling", commune: "Diaroume" },
  { region: "Sedhiou", departement: "Bounkiling", commune: "Inor" },
  { region: "Sedhiou", departement: "Bounkiling", commune: "Kandion Mangana" },
  { region: "Sedhiou", departement: "Bounkiling", commune: "Ndiamacouta" },
  { region: "Sedhiou", departement: "Bounkiling", commune: "Tankon" },

  // --- Departement Goudomp ---
  { region: "Sedhiou", departement: "Goudomp", commune: "Goudomp" },
  { region: "Sedhiou", departement: "Goudomp", commune: "Djibanar" },
  { region: "Sedhiou", departement: "Goudomp", commune: "Kaour" },
  { region: "Sedhiou", departement: "Goudomp", commune: "Mangaroungou Santo" },
  { region: "Sedhiou", departement: "Goudomp", commune: "Niagha" },
  { region: "Sedhiou", departement: "Goudomp", commune: "Samine" },
  { region: "Sedhiou", departement: "Goudomp", commune: "Simbandi Balante" },
  { region: "Sedhiou", departement: "Goudomp", commune: "Simbandi Brassou" },
  { region: "Sedhiou", departement: "Goudomp", commune: "Tanaff" },
  { region: "Sedhiou", departement: "Goudomp", commune: "Yarang" },

  // --- Departement Sedhiou ---
  { region: "Sedhiou", departement: "Sedhiou", commune: "Sedhiou" },
  { region: "Sedhiou", departement: "Sedhiou", commune: "Bambali" },
  { region: "Sedhiou", departement: "Sedhiou", commune: "Diende" },
  { region: "Sedhiou", departement: "Sedhiou", commune: "Djibabouya" },
  { region: "Sedhiou", departement: "Sedhiou", commune: "Djiredji" },
  { region: "Sedhiou", departement: "Sedhiou", commune: "Koussy" },
  { region: "Sedhiou", departement: "Sedhiou", commune: "Marsassoum" },
  { region: "Sedhiou", departement: "Sedhiou", commune: "Sakar" },

  // =========================================================================
  // 12. TAMBACOUNDA (4 departements)
  // =========================================================================

  // --- Departement Bakel ---
  { region: "Tambacounda", departement: "Bakel", commune: "Bakel" },
  { region: "Tambacounda", departement: "Bakel", commune: "Bele" },
  { region: "Tambacounda", departement: "Bakel", commune: "Diawara" },
  { region: "Tambacounda", departement: "Bakel", commune: "Gabou" },
  { region: "Tambacounda", departement: "Bakel", commune: "Kenieba" },
  { region: "Tambacounda", departement: "Bakel", commune: "Kidira" },
  { region: "Tambacounda", departement: "Bakel", commune: "Moudery" },
  { region: "Tambacounda", departement: "Bakel", commune: "Sadatou" },
  { region: "Tambacounda", departement: "Bakel", commune: "Sinthiou Fissa" },
  { region: "Tambacounda", departement: "Bakel", commune: "Toumboura" },
  { region: "Tambacounda", departement: "Bakel", commune: "Ballou" },

  // --- Departement Goudiry ---
  { region: "Tambacounda", departement: "Goudiry", commune: "Goudiry" },
  { region: "Tambacounda", departement: "Goudiry", commune: "Bala" },
  { region: "Tambacounda", departement: "Goudiry", commune: "Dougue" },
  { region: "Tambacounda", departement: "Goudiry", commune: "Koulor" },
  { region: "Tambacounda", departement: "Goudiry", commune: "Koussan" },
  { region: "Tambacounda", departement: "Goudiry", commune: "Goumbayel" },
  { region: "Tambacounda", departement: "Goudiry", commune: "Sinthiou Mamadou Boubou" },
  { region: "Tambacounda", departement: "Goudiry", commune: "Boutoucoufara" },

  // --- Departement Koumpentoum ---
  { region: "Tambacounda", departement: "Koumpentoum", commune: "Koumpentoum" },
  { region: "Tambacounda", departement: "Koumpentoum", commune: "Bamba Thialene" },
  { region: "Tambacounda", departement: "Koumpentoum", commune: "Kahene" },
  { region: "Tambacounda", departement: "Koumpentoum", commune: "Kouthiaba Wolof" },
  { region: "Tambacounda", departement: "Koumpentoum", commune: "Maleme Niani" },
  { region: "Tambacounda", departement: "Koumpentoum", commune: "Mereto" },
  { region: "Tambacounda", departement: "Koumpentoum", commune: "Payar" },
  { region: "Tambacounda", departement: "Koumpentoum", commune: "Ndoga Babacar" },

  // --- Departement Tambacounda ---
  { region: "Tambacounda", departement: "Tambacounda", commune: "Tambacounda" },
  { region: "Tambacounda", departement: "Tambacounda", commune: "Dialacoto" },
  { region: "Tambacounda", departement: "Tambacounda", commune: "Koussanar" },
  { region: "Tambacounda", departement: "Tambacounda", commune: "Makacolibantang" },
  { region: "Tambacounda", departement: "Tambacounda", commune: "Missirah" },
  { region: "Tambacounda", departement: "Tambacounda", commune: "Neteboulou" },
  { region: "Tambacounda", departement: "Tambacounda", commune: "Ndoga Babacar" },
  { region: "Tambacounda", departement: "Tambacounda", commune: "Sinthiou Maleme" },
  { region: "Tambacounda", departement: "Tambacounda", commune: "Tamba Soce" },

  // =========================================================================
  // 13. THIES (3 departements)
  // =========================================================================

  // --- Departement Mbour ---
  { region: "Thies", departement: "Mbour", commune: "Mbour" },
  { region: "Thies", departement: "Mbour", commune: "Diass" },
  { region: "Thies", departement: "Mbour", commune: "Fissel" },
  { region: "Thies", departement: "Mbour", commune: "Joal-Fadiouth" },
  { region: "Thies", departement: "Mbour", commune: "Malicounda" },
  { region: "Thies", departement: "Mbour", commune: "Ngueniene" },
  { region: "Thies", departement: "Mbour", commune: "Ngaparou" },
  { region: "Thies", departement: "Mbour", commune: "Popenguine-Ndayane" },
  { region: "Thies", departement: "Mbour", commune: "Saly" },
  { region: "Thies", departement: "Mbour", commune: "Sandiara" },
  { region: "Thies", departement: "Mbour", commune: "Sessene" },
  { region: "Thies", departement: "Mbour", commune: "Sindia" },
  { region: "Thies", departement: "Mbour", commune: "Somone" },
  { region: "Thies", departement: "Mbour", commune: "Tattaguine" },
  { region: "Thies", departement: "Mbour", commune: "Thiadiaye" },
  { region: "Thies", departement: "Mbour", commune: "Mbour-Diamaguene" },
  { region: "Thies", departement: "Mbour", commune: "Ndiaganiao" },

  // --- Departement Thies ---
  { region: "Thies", departement: "Thies", commune: "Thies-Est" },
  { region: "Thies", departement: "Thies", commune: "Thies-Nord" },
  { region: "Thies", departement: "Thies", commune: "Thies-Ouest" },
  { region: "Thies", departement: "Thies", commune: "Cayar" },
  { region: "Thies", departement: "Thies", commune: "Diender Guedj" },
  { region: "Thies", departement: "Thies", commune: "Fandene" },
  { region: "Thies", departement: "Thies", commune: "Keur Moussa" },
  { region: "Thies", departement: "Thies", commune: "Khombole" },
  { region: "Thies", departement: "Thies", commune: "Ndieyene Sirakh" },
  { region: "Thies", departement: "Thies", commune: "Pout" },
  { region: "Thies", departement: "Thies", commune: "Tassette" },
  { region: "Thies", departement: "Thies", commune: "Toubab Dialaw" },
  { region: "Thies", departement: "Thies", commune: "Mont-Rolland" },

  // --- Departement Tivaouane ---
  { region: "Thies", departement: "Tivaouane", commune: "Tivaouane" },
  { region: "Thies", departement: "Tivaouane", commune: "Cherif Lo" },
  { region: "Thies", departement: "Tivaouane", commune: "Darou Khoudoss" },
  { region: "Thies", departement: "Tivaouane", commune: "Mboro" },
  { region: "Thies", departement: "Tivaouane", commune: "Mekhe" },
  { region: "Thies", departement: "Tivaouane", commune: "Meouane" },
  { region: "Thies", departement: "Tivaouane", commune: "Mont-Rolland" },
  { region: "Thies", departement: "Tivaouane", commune: "Notto Gouye Diama" },
  { region: "Thies", departement: "Tivaouane", commune: "Pambal" },
  { region: "Thies", departement: "Tivaouane", commune: "Pekesse" },
  { region: "Thies", departement: "Tivaouane", commune: "Pire" },
  { region: "Thies", departement: "Tivaouane", commune: "Taiba Ndiaye" },
  { region: "Thies", departement: "Tivaouane", commune: "Koul" },
  { region: "Thies", departement: "Tivaouane", commune: "Ndande" },
  { region: "Thies", departement: "Tivaouane", commune: "Niakhene" },

  // =========================================================================
  // 14. ZIGUINCHOR (3 departements)
  // =========================================================================

  // --- Departement Bignona ---
  { region: "Ziguinchor", departement: "Bignona", commune: "Bignona" },
  { region: "Ziguinchor", departement: "Bignona", commune: "Coubalan" },
  { region: "Ziguinchor", departement: "Bignona", commune: "Diegoune" },
  { region: "Ziguinchor", departement: "Bignona", commune: "Djinaky" },
  { region: "Ziguinchor", departement: "Bignona", commune: "Kafountine" },
  { region: "Ziguinchor", departement: "Bignona", commune: "Kataba 1" },
  { region: "Ziguinchor", departement: "Bignona", commune: "Mangagoulack" },
  { region: "Ziguinchor", departement: "Bignona", commune: "Mlomp" },
  { region: "Ziguinchor", departement: "Bignona", commune: "Niamone" },
  { region: "Ziguinchor", departement: "Bignona", commune: "Ouonck" },
  { region: "Ziguinchor", departement: "Bignona", commune: "Sindian" },
  { region: "Ziguinchor", departement: "Bignona", commune: "Tenghory" },
  { region: "Ziguinchor", departement: "Bignona", commune: "Thionck Essyl" },
  { region: "Ziguinchor", departement: "Bignona", commune: "Balingore" },

  // --- Departement Oussouye ---
  { region: "Ziguinchor", departement: "Oussouye", commune: "Oussouye" },
  { region: "Ziguinchor", departement: "Oussouye", commune: "Diembering" },
  { region: "Ziguinchor", departement: "Oussouye", commune: "Mlomp" },
  { region: "Ziguinchor", departement: "Oussouye", commune: "Santhiaba Manjacque" },

  // --- Departement Ziguinchor ---
  { region: "Ziguinchor", departement: "Ziguinchor", commune: "Ziguinchor" },
  { region: "Ziguinchor", departement: "Ziguinchor", commune: "Adeane" },
  { region: "Ziguinchor", departement: "Ziguinchor", commune: "Boutoupa Camaracounda" },
  { region: "Ziguinchor", departement: "Ziguinchor", commune: "Enampore" },
  { region: "Ziguinchor", departement: "Ziguinchor", commune: "Niaguis" },
];

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

/**
 * Returns all 14 regions of Senegal (sorted alphabetically).
 */
export const getRegions = (): string[] => {
  return [...new Set(SENEGAL_GEO.map((e) => e.region))].sort();
};

/**
 * Returns all departements for a given region (sorted alphabetically).
 */
export const getDepartements = (region: string): string[] => {
  return [
    ...new Set(
      SENEGAL_GEO.filter((e) => e.region === region).map((e) => e.departement)
    ),
  ].sort();
};

/**
 * Returns all communes for a given departement (sorted alphabetically).
 */
export const getCommunes = (departement: string): string[] => {
  return [
    ...new Set(
      SENEGAL_GEO.filter((e) => e.departement === departement).map(
        (e) => e.commune
      )
    ),
  ].sort();
};
