/**
 * Remedy of the Day - Deterministic daily rotation logic.
 * Implements date-based hash selection with no-repeat guarantee within 100-day window.
 *
 * Algorithm:
 *   1. Calculate the number of days since Unix epoch (adjusted for IST midnight)
 *   2. Use modulo arithmetic over the remedy array length (100+)
 *   3. Same date always returns same remedy (deterministic)
 *   4. With 100+ unique remedies and index = dayNumber % remedyCount,
 *      no remedy repeats within any 100-consecutive-day window
 *
 * Validates: Requirements 28.1, 28.2, 28.3, 28.4, 28.5
 */

export interface Remedy {
  name: string;
  primaryUse: string;
  funFact: string;
  source: "plant" | "mineral" | "animal";
  icon: string;
  applications?: string[];
}

/**
 * Returns the source-based nature icon for a remedy.
 * Plant → 🌿, Mineral → ⛰️, Animal → 🐝
 */
export function getSourceIcon(source: Remedy["source"]): string {
  switch (source) {
    case "plant":
      return "🌿";
    case "mineral":
      return "⛰️";
    case "animal":
      return "🐝";
  }
}

/**
 * Calculates the day number from epoch, adjusted for IST (UTC+5:30).
 * This ensures the rotation resets at midnight IST regardless of user timezone.
 */
export function getDayNumberIST(date: Date): number {
  // IST offset = +5 hours 30 minutes = 330 minutes = 19800000 ms
  const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
  const istTime = date.getTime() + IST_OFFSET_MS;
  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  return Math.floor(istTime / MS_PER_DAY);
}

/**
 * Selects the remedy of the day deterministically.
 * Uses day number from epoch modulo remedy count.
 * Guarantees no repeat within 100-day window when remedies.length >= 100.
 *
 * @param date - The date to get the remedy for
 * @param remedies - Array of available remedies (must have 100+ entries)
 * @returns The selected remedy for the given date
 */
export function getRemedyOfTheDay(date: Date, remedies: Remedy[]): Remedy {
  if (remedies.length === 0) {
    throw new Error("Remedy list cannot be empty");
  }
  const dayNumber = getDayNumberIST(date);
  const index = dayNumber % remedies.length;
  return remedies[index];
}

/**
 * Default remedies database — 105 homeopathic remedies.
 * First 20+ have detailed real homeopathic information.
 * Remaining are plausible entries covering plant, mineral, and animal sources.
 */
export const DEFAULT_REMEDIES: Remedy[] = [
  // ─── Real Detailed Remedies (1-25) ────────────────────────────────────────
  {
    name: "Arnica Montana",
    primaryUse: "Trauma, bruises, muscle soreness, and post-surgical healing",
    funFact: "Known as 'mountain daisy,' it grows in the high meadows of the Alps and Himalayas.",
    source: "plant",
    icon: "🌿",
    applications: ["Sports injuries", "Post-operative recovery", "Sprains", "Jet lag fatigue"],
  },
  {
    name: "Nux Vomica",
    primaryUse: "Digestive problems, hangover symptoms, and irritability from overwork",
    funFact: "Derived from the seeds of the Strychnine tree native to Southeast Asia.",
    source: "plant",
    icon: "🌿",
    applications: ["Acidity", "Constipation", "Insomnia from stress", "Overindulgence"],
  },
  {
    name: "Belladonna",
    primaryUse: "Sudden high fevers, throbbing headaches, and inflammation",
    funFact: "Its name means 'beautiful lady' — Renaissance women used it to dilate pupils for beauty.",
    source: "plant",
    icon: "🌿",
    applications: ["Acute fever", "Sore throat", "Earache", "Sunstroke"],
  },
  {
    name: "Bryonia Alba",
    primaryUse: "Joint pain worsened by movement, dry coughs, and constipation",
    funFact: "The root can grow up to 6 feet long and was used in ancient Greek medicine.",
    source: "plant",
    icon: "🌿",
    applications: ["Arthritis", "Pleurisy", "Headaches from dehydration", "Dry mucous membranes"],
  },
  {
    name: "Calcarea Carbonica",
    primaryUse: "Slow development in children, bone weakness, and anxiety",
    funFact: "Prepared from the middle layer of oyster shells — pure calcium carbonate.",
    source: "mineral",
    icon: "⛰️",
    applications: ["Teething problems", "Slow bone healing", "Night sweats", "Fear of heights"],
  },
  {
    name: "Pulsatilla",
    primaryUse: "Earaches, eye infections, and hormonal issues in women",
    funFact: "Called the 'wind flower' because it sways in the gentlest breeze.",
    source: "plant",
    icon: "🌿",
    applications: ["Sinusitis", "Menstrual irregularities", "Styes", "Food intolerance"],
  },
  {
    name: "Sulphur",
    primaryUse: "Chronic skin conditions like eczema, psoriasis, and itching",
    funFact: "One of the oldest medicines known — used in fumigation since 2000 BCE.",
    source: "mineral",
    icon: "⛰️",
    applications: ["Acne", "Burning sensations", "Body odor", "Morning diarrhea"],
  },
  {
    name: "Lycopodium Clavatum",
    primaryUse: "Bloating, liver disorders, and lack of confidence",
    funFact: "Made from club moss spores that are so fine they were once used as flash powder in photography.",
    source: "plant",
    icon: "🌿",
    applications: ["Flatulence", "Right-sided complaints", "Hair loss", "Stage fright"],
  },
  {
    name: "Phosphorus",
    primaryUse: "Respiratory issues, bleeding tendencies, and anxiety about health",
    funFact: "Named after the Greek word for 'light bearer' — it glows in the dark.",
    source: "mineral",
    icon: "⛰️",
    applications: ["Bronchitis", "Nosebleeds", "Laryngitis", "Fear of thunderstorms"],
  },
  {
    name: "Sepia",
    primaryUse: "Hormonal imbalances, fatigue, and indifference in women",
    funFact: "Prepared from cuttlefish ink — the same ink used by artists for centuries.",
    source: "animal",
    icon: "🐝",
    applications: ["Menopause symptoms", "Morning sickness", "Prolapse", "Brown facial patches"],
  },
  {
    name: "Apis Mellifica",
    primaryUse: "Insect stings, allergic swelling, and burning pains relieved by cold",
    funFact: "Made from the whole honeybee — matching the symptoms of a bee sting itself.",
    source: "animal",
    icon: "🐝",
    applications: ["Urticaria", "Edema", "Ovarian cysts", "Jealousy-related complaints"],
  },
  {
    name: "Rhus Toxicodendron",
    primaryUse: "Joint stiffness relieved by movement, restlessness, and skin blisters",
    funFact: "Derived from poison ivy — in homeopathic doses it treats the very rashes it causes.",
    source: "plant",
    icon: "🌿",
    applications: ["Rheumatism", "Herpes", "Sprains", "Restless legs"],
  },
  {
    name: "Ignatia Amara",
    primaryUse: "Grief, emotional shock, and contradictory symptoms from stress",
    funFact: "Named after St. Ignatius of Loyola — Jesuit missionaries brought it from the Philippines.",
    source: "plant",
    icon: "🌿",
    applications: ["Bereavement", "Lump in throat", "Sighing", "Insomnia from grief"],
  },
  {
    name: "Natrum Muriaticum",
    primaryUse: "Cold sores, migraines from sun, and suppressed grief",
    funFact: "Simply common table salt — but in potentized form it treats deep emotional wounds.",
    source: "mineral",
    icon: "⛰️",
    applications: ["Hay fever", "Water retention", "Headaches", "Craving for salt"],
  },
  {
    name: "Arsenicum Album",
    primaryUse: "Food poisoning, anxiety with restlessness, and burning pains",
    funFact: "Potentized arsenic becomes a powerful healer — one of homeopathy's greatest paradoxes.",
    source: "mineral",
    icon: "⛰️",
    applications: ["Gastroenteritis", "Asthma worse at night", "Perfectionism", "Fear of disease"],
  },
  {
    name: "Chamomilla",
    primaryUse: "Teething pain in children, colic, and extreme irritability",
    funFact: "Ancient Egyptians dedicated chamomile to their sun god due to its golden flower center.",
    source: "plant",
    icon: "🌿",
    applications: ["Teething", "Earache in children", "Insomnia", "One cheek red, one pale"],
  },
  {
    name: "Gelsemium",
    primaryUse: "Anticipatory anxiety, flu with weakness, and trembling",
    funFact: "Made from yellow jasmine — a beautiful but poisonous vine native to North America.",
    source: "plant",
    icon: "🌿",
    applications: ["Stage fright", "Exam anxiety", "Drowsy flu", "Drooping eyelids"],
  },
  {
    name: "Aconitum Napellus",
    primaryUse: "Sudden onset colds, panic attacks, and fear after shock",
    funFact: "Known as 'monkshood' — wolves were once poisoned with it, earning its other name 'wolfsbane'.",
    source: "plant",
    icon: "🌿",
    applications: ["Sudden fever", "Panic attacks", "Croup", "Ailments from cold wind"],
  },
  {
    name: "Mercurius Solubilis",
    primaryUse: "Mouth ulcers, excessive salivation, and throat infections",
    funFact: "Hahnemann invented this special preparation because elemental mercury was too toxic.",
    source: "mineral",
    icon: "⛰️",
    applications: ["Tonsillitis", "Dental abscesses", "Night sweats", "Metallic taste"],
  },
  {
    name: "Lachesis",
    primaryUse: "Left-sided complaints, menopausal hot flashes, and jealousy",
    funFact: "Derived from bushmaster snake venom — the prover nearly died testing it in the 1800s.",
    source: "animal",
    icon: "🐝",
    applications: ["Hot flashes", "Sore throat worse on left", "Suspicion", "Tight clothing intolerance"],
  },
  {
    name: "Thuja Occidentalis",
    primaryUse: "Warts, skin growths, and vaccine side effects",
    funFact: "Called the 'Tree of Life' — Native Americans used it to prevent scurvy.",
    source: "plant",
    icon: "🌿",
    applications: ["Warts", "Genital warts", "Oily skin", "Fixed ideas"],
  },
  {
    name: "Silicea",
    primaryUse: "Weak immunity, slow-healing wounds, and brittle nails",
    funFact: "Made from silicon dioxide — the same material that makes up quartz crystals and sand.",
    source: "mineral",
    icon: "⛰️",
    applications: ["Boils", "Ingrown toenails", "Splinter expulsion", "Shy temperament"],
  },
  {
    name: "Cantharis",
    primaryUse: "Urinary tract infections with burning pain and urgency",
    funFact: "Prepared from the Spanish Fly beetle — historically misused as an aphrodisiac.",
    source: "animal",
    icon: "🐝",
    applications: ["Cystitis", "Burns", "Blisters", "Intense thirst"],
  },
  {
    name: "Hepar Sulphuris",
    primaryUse: "Infected wounds, boils, and extreme sensitivity to cold",
    funFact: "Created by Hahnemann himself by burning oyster shell with sulfur flowers.",
    source: "mineral",
    icon: "⛰️",
    applications: ["Abscesses", "Croup", "Splinter-like pains", "Irritability"],
  },
  {
    name: "Hypericum Perforatum",
    primaryUse: "Nerve injuries, puncture wounds, and shooting nerve pain",
    funFact: "Known as St. John's Wort — it blooms around the feast of St. John on June 24th.",
    source: "plant",
    icon: "🌿",
    applications: ["Crushed fingers", "Dental nerve pain", "Tailbone injuries", "Post-surgery nerve pain"],
  },
  // ─── Plausible Remedies (26-105) ────────────────────────────────────────────
  {
    name: "Allium Cepa",
    primaryUse: "Streaming colds with watery eyes and sneezing",
    funFact: "Made from red onion — it treats the very symptoms onion-chopping causes.",
    source: "plant",
    icon: "🌿",
  },
  {
    name: "Argentum Nitricum",
    primaryUse: "Performance anxiety, digestive upset from nerves",
    funFact: "Silver nitrate was once used to mark newborns' eyes against infection.",
    source: "mineral",
    icon: "⛰️",
  },
  {
    name: "Aurum Metallicum",
    primaryUse: "Depression, heart conditions, and suicidal thoughts",
    funFact: "Prepared from pure gold — addressing the 'gold standard' of despair.",
    source: "mineral",
    icon: "⛰️",
  },
  {
    name: "Baryta Carbonica",
    primaryUse: "Developmental delays in children and senility in elderly",
    funFact: "Barium carbonate connects the extremes of life — childhood and old age.",
    source: "mineral",
    icon: "⛰️",
  },
  {
    name: "Borax",
    primaryUse: "Mouth thrush, fear of downward motion, and motion sickness",
    funFact: "Children needing Borax are startled by any sudden downward movement.",
    source: "mineral",
    icon: "⛰️",
  },
  {
    name: "Carbo Vegetabilis",
    primaryUse: "Extreme exhaustion, bloating, and collapse-like states",
    funFact: "Called the 'corpse reviver' for its ability to help near-collapse patients.",
    source: "plant",
    icon: "🌿",
  },
  {
    name: "Causticum",
    primaryUse: "Paralysis, hoarseness, and burns with rawness",
    funFact: "Hahnemann's unique creation — no exact chemical equivalent exists in nature.",
    source: "mineral",
    icon: "⛰️",
  },
  {
    name: "China Officinalis",
    primaryUse: "Weakness from fluid loss, periodic fevers, and anemia",
    funFact: "The very first substance Hahnemann tested — launching homeopathy in 1790.",
    source: "plant",
    icon: "🌿",
  },
  {
    name: "Cina",
    primaryUse: "Worm infestations in children, grinding teeth, and irritability",
    funFact: "Made from wormwood — children needing it often bore into their noses.",
    source: "plant",
    icon: "🌿",
  },
  {
    name: "Colocynthis",
    primaryUse: "Severe cramping abdominal pain relieved by bending double",
    funFact: "The bitter apple gourd is so intensely bitter that one drop flavors gallons.",
    source: "plant",
    icon: "🌿",
  },
  {
    name: "Conium Maculatum",
    primaryUse: "Glandular hardness, vertigo, and ascending paralysis",
    funFact: "This is the poison hemlock that killed Socrates in ancient Athens.",
    source: "plant",
    icon: "🌿",
  },
  {
    name: "Cuprum Metallicum",
    primaryUse: "Muscle cramps, spasms, and convulsions",
    funFact: "Copper workers historically developed cramping — leading to its homeopathic use.",
    source: "mineral",
    icon: "⛰️",
  },
  {
    name: "Drosera",
    primaryUse: "Whooping cough, barking cough, and spasmodic cough at night",
    funFact: "The sundew plant traps insects with sticky dew drops on its leaves.",
    source: "plant",
    icon: "🌿",
  },
  {
    name: "Dulcamara",
    primaryUse: "Ailments from damp cold weather, warts, and stiff joints",
    funFact: "Called bittersweet — its berries taste bitter first, then sweet.",
    source: "plant",
    icon: "🌿",
  },
  {
    name: "Ferrum Phosphoricum",
    primaryUse: "Early stages of fever and inflammation before symptoms localize",
    funFact: "The 'first aid' remedy — used at the very onset before a clear picture emerges.",
    source: "mineral",
    icon: "⛰️",
  },
  {
    name: "Graphites",
    primaryUse: "Cracked skin, eczema with honey-like discharge, and obesity",
    funFact: "Made from the same graphite in pencils — it addresses sticky, thick skin issues.",
    source: "mineral",
    icon: "⛰️",
  },
  {
    name: "Hamamelis",
    primaryUse: "Varicose veins, hemorrhoids, and venous congestion",
    funFact: "Witch hazel has been used by Native Americans for centuries as a healing wash.",
    source: "plant",
    icon: "🌿",
  },
  {
    name: "Iodum",
    primaryUse: "Thyroid disorders, weight loss despite eating well, and restlessness",
    funFact: "Iodine was discovered accidentally when seaweed ash was treated with sulfuric acid.",
    source: "mineral",
    icon: "⛰️",
  },
  {
    name: "Ipecacuanha",
    primaryUse: "Persistent nausea, morning sickness, and bleeding with nausea",
    funFact: "This Brazilian root's name means 'road-side sick-making plant' in Tupi language.",
    source: "plant",
    icon: "🌿",
  },
  {
    name: "Kali Bichromicum",
    primaryUse: "Thick stringy nasal discharge, sinus headaches, and ulcers",
    funFact: "Potassium bichromate produces the characteristic stringy mucus it treats.",
    source: "mineral",
    icon: "⛰️",
  },
  {
    name: "Kali Carbonicum",
    primaryUse: "Back pain, asthma worse at 3 AM, and rigidity",
    funFact: "People needing this remedy are often duty-bound, rule-following personalities.",
    source: "mineral",
    icon: "⛰️",
  },
  {
    name: "Ledum Palustre",
    primaryUse: "Puncture wounds, insect bites, and injuries relieved by cold",
    funFact: "Wild rosemary grows in bogs — it treats wounds that feel cold to touch.",
    source: "plant",
    icon: "🌿",
  },
  {
    name: "Magnesia Phosphorica",
    primaryUse: "Menstrual cramps relieved by heat and pressure, neuralgic pains",
    funFact: "Known as the homeopathic 'hot water bottle' — warmth always helps.",
    source: "mineral",
    icon: "⛰️",
  },
  {
    name: "Medorrhinum",
    primaryUse: "Chronic conditions with morning aggravation, warts, and asthma",
    funFact: "A nosode remedy — prepared from disease products to treat inherited tendencies.",
    source: "animal",
    icon: "🐝",
  },
  {
    name: "Natrum Phosphoricum",
    primaryUse: "Acid reflux, sour stomach, and yellow creamy discharges",
    funFact: "Sodium phosphate helps the body process acids — the body's natural antacid.",
    source: "mineral",
    icon: "⛰️",
  },
  {
    name: "Natrum Sulphuricum",
    primaryUse: "Asthma in damp weather, head injuries, and liver troubles",
    funFact: "Glauber's salt is essential for the body's water balance mechanism.",
    source: "mineral",
    icon: "⛰️",
  },
  {
    name: "Nitricum Acidum",
    primaryUse: "Splinter-like pains, warts that bleed, and irritability",
    funFact: "Patients needing this remedy often hold grudges and never forget offenses.",
    source: "mineral",
    icon: "⛰️",
  },
  {
    name: "Opium",
    primaryUse: "Constipation without urge, drowsiness, and fright aftereffects",
    funFact: "In homeopathic potency, it treats the very stupor and sluggishness opium causes.",
    source: "plant",
    icon: "🌿",
  },
  {
    name: "Petroleum",
    primaryUse: "Deep cracked skin in winter, travel sickness, and eczema",
    funFact: "Rock oil has been seeping from the earth for millions of years before human use.",
    source: "mineral",
    icon: "⛰️",
  },
  {
    name: "Phytolacca",
    primaryUse: "Sore throats radiating to ears, mastitis, and glandular swelling",
    funFact: "Pokeweed berries were once used as ink — even for the US Declaration of Independence.",
    source: "plant",
    icon: "🌿",
  },
  {
    name: "Podophyllum",
    primaryUse: "Profuse watery diarrhea, liver problems, and teething diarrhea",
    funFact: "May apple grows beneath forest canopies — the fruit ripens underground.",
    source: "plant",
    icon: "🌿",
  },
  {
    name: "Ruta Graveolens",
    primaryUse: "Tendon and ligament injuries, eye strain, and bruised bones",
    funFact: "Rue was worn by judges to protect against jail fever in courtrooms.",
    source: "plant",
    icon: "🌿",
  },
  {
    name: "Sarsaparilla",
    primaryUse: "Urinary infections with pain at end of urination, skin eruptions",
    funFact: "Once the main flavoring in root beer before synthetic alternatives appeared.",
    source: "plant",
    icon: "🌿",
  },
  {
    name: "Spigelia",
    primaryUse: "Left-sided headaches, heart palpitations, and worm symptoms",
    funFact: "Pink root was used by Native Americans specifically for intestinal parasites.",
    source: "plant",
    icon: "🌿",
  },
  {
    name: "Spongia Tosta",
    primaryUse: "Dry barking croup, thyroid goiter, and heart valve issues",
    funFact: "Roasted sea sponge was the original treatment for goiter before iodine was discovered.",
    source: "animal",
    icon: "🐝",
  },
  {
    name: "Staphysagria",
    primaryUse: "Suppressed anger, surgical wounds, and styes",
    funFact: "Stavesacre seeds were used in ancient Rome to kill head lice.",
    source: "plant",
    icon: "🌿",
  },
  {
    name: "Stramonium",
    primaryUse: "Night terrors, violent behavior, and fear of dark",
    funFact: "Jimson weed causes hallucinations — in potency it calms terror and violence.",
    source: "plant",
    icon: "🌿",
  },
  {
    name: "Symphytum",
    primaryUse: "Bone fractures, eye injuries from blunt trauma",
    funFact: "Called 'knitbone' since medieval times for its remarkable bone-healing properties.",
    source: "plant",
    icon: "🌿",
  },
  {
    name: "Tabacum",
    primaryUse: "Severe motion sickness with cold sweat, nausea, and pallor",
    funFact: "Tobacco in potency treats the very nausea and dizziness it causes when smoked.",
    source: "plant",
    icon: "🌿",
  },
  {
    name: "Tuberculinum",
    primaryUse: "Recurrent respiratory infections, restlessness, and desire to travel",
    funFact: "A nosode that addresses inherited tubercular tendencies across generations.",
    source: "animal",
    icon: "🐝",
  },
  {
    name: "Urtica Urens",
    primaryUse: "Hives, burns, gout, and allergic skin reactions",
    funFact: "Stinging nettle causes the very welts and burning it treats homeopathically.",
    source: "plant",
    icon: "🌿",
  },
  {
    name: "Veratrum Album",
    primaryUse: "Violent vomiting and diarrhea with cold sweat and collapse",
    funFact: "White hellebore was used in ancient times to treat insanity and plague.",
    source: "plant",
    icon: "🌿",
  },
  {
    name: "Zincum Metallicum",
    primaryUse: "Restless legs, nervous exhaustion, and suppressed eruptions",
    funFact: "Zinc deficiency mirrors many symptoms this remedy treats — twitching and weakness.",
    source: "mineral",
    icon: "⛰️",
  },
  {
    name: "Aethusa Cynapium",
    primaryUse: "Milk intolerance in infants, violent vomiting of milk",
    funFact: "Fool's parsley resembles regular parsley but is mildly toxic to children.",
    source: "plant",
    icon: "🌿",
  },
  {
    name: "Alumina",
    primaryUse: "Severe constipation, dryness of mucous membranes, and confusion",
    funFact: "Aluminum oxide is one of the hardest substances — yet it treats softness and sluggishness.",
    source: "mineral",
    icon: "⛰️",
  },
  {
    name: "Anacardium",
    primaryUse: "Exam anxiety, indecision, and feeling of a plug in body parts",
    funFact: "Marking nut juice was used as indelible ink for marking laundry in India.",
    source: "plant",
    icon: "🌿",
  },
  {
    name: "Antimonium Crudum",
    primaryUse: "Thick white-coated tongue, overeating effects, and crusty skin",
    funFact: "Antimony was used by Egyptian women as eye makeup (kohl) thousands of years ago.",
    source: "mineral",
    icon: "⛰️",
  },
  {
    name: "Antimonium Tartaricum",
    primaryUse: "Rattling chest with inability to expectorate, drowsy and weak",
    funFact: "Tartar emetic was once given to make patients vomit as a 'cure' for many diseases.",
    source: "mineral",
    icon: "⛰️",
  },
  {
    name: "Baptisia",
    primaryUse: "Severe flu with rapid prostration, foul discharges, and confusion",
    funFact: "Wild indigo was used by Native Americans as a dye and antiseptic wash.",
    source: "plant",
    icon: "🌿",
  },
  {
    name: "Berberis Vulgaris",
    primaryUse: "Kidney stones, gallstones, and radiating pains from a central point",
    funFact: "Barberry root bark is bright yellow — matching the jaundice it can treat.",
    source: "plant",
    icon: "🌿",
  },
  {
    name: "Calcarea Fluorica",
    primaryUse: "Hard lumps, varicose veins, and loose ligaments",
    funFact: "Calcium fluoride gives tooth enamel its hardness — the body's natural armor.",
    source: "mineral",
    icon: "⛰️",
  },
  {
    name: "Calcarea Phosphorica",
    primaryUse: "Growing pains in children, non-union fractures, and school headaches",
    funFact: "This salt makes up the mineral portion of bones — essential for growth.",
    source: "mineral",
    icon: "⛰️",
  },
  {
    name: "Calendula",
    primaryUse: "Wound healing, cuts, surgical incisions, and torn muscles",
    funFact: "Marigold flowers bloom with the calendar months — hence the name Calendula.",
    source: "plant",
    icon: "🌿",
  },
  {
    name: "Cannabis Sativa",
    primaryUse: "Urinary tract infections, asthma, and confusion",
    funFact: "Hemp fiber has been cultivated for over 10,000 years for rope and textiles.",
    source: "plant",
    icon: "🌿",
  },
  {
    name: "Carcinosin",
    primaryUse: "Perfectionism, suppressed emotions, and family history of cancer",
    funFact: "A nosode addressing deep-seated inherited tendencies toward over-responsibility.",
    source: "animal",
    icon: "🐝",
  },
  {
    name: "Chelidonium Majus",
    primaryUse: "Liver and gallbladder complaints, right-sided pain under scapula",
    funFact: "Greater celandine exudes orange sap — matching the bile-colored complaints it treats.",
    source: "plant",
    icon: "🌿",
  },
  {
    name: "Coffea Cruda",
    primaryUse: "Insomnia from mental excitement, toothache, and oversensitivity",
    funFact: "Unroasted coffee beans in potency calm the very overstimulation coffee causes.",
    source: "plant",
    icon: "🌿",
  },
  {
    name: "Crotalus Horridus",
    primaryUse: "Hemorrhagic conditions, sepsis, and right-sided complaints",
    funFact: "Rattlesnake venom affects blood clotting — in potency it treats bleeding disorders.",
    source: "animal",
    icon: "🐝",
  },
  {
    name: "Digitalis",
    primaryUse: "Slow irregular pulse, heart failure, and liver enlargement",
    funFact: "Foxglove gave us the heart drug digitoxin — homeopathy uses its energetic pattern.",
    source: "plant",
    icon: "🌿",
  },
  {
    name: "Echinacea",
    primaryUse: "Blood poisoning, recurring infections, and snake bites",
    funFact: "Plains Indians used purple coneflower for more ailments than any other plant.",
    source: "plant",
    icon: "🌿",
  },
  {
    name: "Eupatorium Perfoliatum",
    primaryUse: "Dengue-like fever with bone-breaking pains and vomiting",
    funFact: "Called 'boneset' because it treated break-bone fever in Colonial America.",
    source: "plant",
    icon: "🌿",
  },
  {
    name: "Euphrasia",
    primaryUse: "Eye inflammation, burning tears, and hay fever with eye symptoms",
    funFact: "Known as 'eyebright' — it has been used for eye complaints since the 14th century.",
    source: "plant",
    icon: "🌿",
  },
  {
    name: "Fluoric Acid",
    primaryUse: "Varicose veins, dental decay, and premature aging",
    funFact: "Hydrofluoric acid etches glass — in potency it strengthens bones and teeth.",
    source: "mineral",
    icon: "⛰️",
  },
  {
    name: "Kali Muriaticum",
    primaryUse: "Ear infections with thick white discharge, tonsillitis",
    funFact: "Potassium chloride helps dissolve the fibrin that creates thick sticky mucus.",
    source: "mineral",
    icon: "⛰️",
  },
  {
    name: "Kali Phosphoricum",
    primaryUse: "Mental exhaustion, nervous fatigue, and insomnia from overwork",
    funFact: "The great nerve nutrient — potassium phosphate feeds nerve and brain tissue.",
    source: "mineral",
    icon: "⛰️",
  },
  {
    name: "Lac Caninum",
    primaryUse: "Sore throat alternating sides, breast pain, and low self-esteem",
    funFact: "Dog's milk was used therapeutically in ancient Rome and Greece.",
    source: "animal",
    icon: "🐝",
  },
  {
    name: "Lilium Tigrinum",
    primaryUse: "Uterine prolapse, hurried feeling, and heart palpitations",
    funFact: "Tiger lily's striking appearance mirrors the dramatic emotional state it treats.",
    source: "plant",
    icon: "🌿",
  },
  {
    name: "Lithium Carbonicum",
    primaryUse: "Joint pains, urinary difficulties, and mood swings",
    funFact: "Lithium springs have been visited for healing since ancient Roman times.",
    source: "mineral",
    icon: "⛰️",
  },
  {
    name: "Magnesia Carbonica",
    primaryUse: "Colic in infants, sour-smelling stools, and toothache",
    funFact: "Magnesium carbonate is so light it was once called 'magnesia alba' — white lightness.",
    source: "mineral",
    icon: "⛰️",
  },
  {
    name: "Mezereum",
    primaryUse: "Skin eruptions with thick crusts, bone pains worse at night",
    funFact: "Daphne bark is so acrid that just touching it can blister the skin.",
    source: "plant",
    icon: "🌿",
  },
  {
    name: "Moschus",
    primaryUse: "Fainting spells, hysteria, and spasmodic conditions",
    funFact: "Musk deer produce this scent to attract mates from miles away.",
    source: "animal",
    icon: "🐝",
  },
  {
    name: "Muriaticum Acidum",
    primaryUse: "Deep exhaustion, mouth ulcers, and hemorrhoids during illness",
    funFact: "Hydrochloric acid is naturally present in our stomach for digestion.",
    source: "mineral",
    icon: "⛰️",
  },
  {
    name: "Naja Tripudians",
    primaryUse: "Heart valve problems, suicidal depression, and left-sided headaches",
    funFact: "Indian cobra venom has a peculiar affinity for the heart and nervous system.",
    source: "animal",
    icon: "🐝",
  },
  {
    name: "Oleander",
    primaryUse: "Scalp eruptions, heart weakness, and diarrhea from undigested food",
    funFact: "Every part of this beautiful garden shrub is highly poisonous.",
    source: "plant",
    icon: "🌿",
  },
  {
    name: "Palladium",
    primaryUse: "Ovarian pain, need for approval, and wounded pride",
    funFact: "This rare metal was named after the asteroid Pallas — goddess of wisdom.",
    source: "mineral",
    icon: "⛰️",
  },
  {
    name: "Platina",
    primaryUse: "Menstrual problems, numbness, and feelings of superiority",
    funFact: "Platinum is so rare that all ever mined would fit in an average living room.",
    source: "mineral",
    icon: "⛰️",
  },
  {
    name: "Plumbum Metallicum",
    primaryUse: "Colic with abdominal retraction, paralysis, and constipation",
    funFact: "Lead poisoning in Roman aqueducts may have contributed to the empire's fall.",
    source: "mineral",
    icon: "⛰️",
  },
  {
    name: "Psorinum",
    primaryUse: "Chronic skin conditions, despair of recovery, and offensive discharges",
    funFact: "This nosode from scabies vesicle addresses deep hereditary skin tendencies.",
    source: "animal",
    icon: "🐝",
  },
  {
    name: "Ranunculus Bulbosus",
    primaryUse: "Intercostal neuralgia, shingles, and blister-like eruptions",
    funFact: "Buttercup juice is so acrid that cattle avoid grazing on it.",
    source: "plant",
    icon: "🌿",
  },
  {
    name: "Sabadilla",
    primaryUse: "Violent sneezing, hay fever, and worm infestations",
    funFact: "Cevadilla seeds from Mexico were the original insecticide powder.",
    source: "plant",
    icon: "🌿",
  },
  {
    name: "Sabina",
    primaryUse: "Heavy menstrual bleeding, threatened miscarriage, and joint pains",
    funFact: "Savin juniper was historically known for its powerful effect on the uterus.",
    source: "plant",
    icon: "🌿",
  },
  {
    name: "Sambucus Nigra",
    primaryUse: "Suffocating nasal blockage in infants, croup, and night sweats",
    funFact: "Elder trees were considered magical — folklore says witches lived under them.",
    source: "plant",
    icon: "🌿",
  },
  {
    name: "Secale Cornutum",
    primaryUse: "Poor circulation, gangrene, and burning pains relieved by cold",
    funFact: "Ergot fungus on rye caused medieval 'St. Anthony's Fire' epidemics.",
    source: "plant",
    icon: "🌿",
  },
  {
    name: "Selenium",
    primaryUse: "Hair loss, sexual weakness, and exhaustion from heat",
    funFact: "Named after the Moon goddess Selene — it was discovered in 1817.",
    source: "mineral",
    icon: "⛰️",
  },
  {
    name: "Senecio Aureus",
    primaryUse: "Suppressed menses, urinary issues, and anemia in young women",
    funFact: "Golden ragwort blooms in bright yellow clusters along stream banks.",
    source: "plant",
    icon: "🌿",
  },
];
