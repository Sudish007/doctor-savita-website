/**
 * Mock data for First-Aid Guide scenarios.
 * Contains 20 realistic emergency/first-aid scenarios with homeopathic remedies.
 *
 * In production, this data would come from Sanity CMS (firstAidEntry schema).
 * Requirements: 36.1, 36.2, 36.3
 */

export interface FirstAidScenario {
  id: string;
  name: string;
  icon: string;
  actionSteps: string[];
  remedy: string;
  potency: string;
  dosage: string;
  emergencyWarning: string;
}

export const FIRST_AID_SCENARIOS: FirstAidScenario[] = [
  {
    id: 'fever',
    name: 'Fever',
    icon: '🌡️',
    actionSteps: [
      'Rest in a cool, well-ventilated room and wear light clothing.',
      'Apply a damp cloth to the forehead and keep hydrated with water, ORS, or coconut water.',
      'Monitor temperature every 30 minutes with a thermometer.',
      'Avoid heavy blankets — use a light sheet instead.',
    ],
    remedy: 'Aconitum Napellus',
    potency: '30C',
    dosage: '3 pellets every 2 hours until fever subsides, max 4 doses',
    emergencyWarning:
      'Seek emergency care if fever exceeds 104°F (40°C), persists more than 3 days, or is accompanied by convulsions, stiff neck, or difficulty breathing.',
  },
  {
    id: 'burns',
    name: 'Burns (Minor)',
    icon: '🔥',
    actionSteps: [
      'Immediately hold the burned area under cool running water for 10-15 minutes.',
      'Do not apply ice, butter, or toothpaste to the burn.',
      'Cover with a sterile, non-stick bandage loosely.',
      'Keep the area elevated if possible to reduce swelling.',
    ],
    remedy: 'Cantharis',
    potency: '30C',
    dosage: '3 pellets every 15 minutes for the first hour, then every 2 hours',
    emergencyWarning:
      'Seek emergency care for burns larger than your palm, burns on face/joints/genitals, deep/white/charred burns, or burns caused by chemicals or electricity.',
  },
  {
    id: 'cuts',
    name: 'Cuts and Wounds',
    icon: '🩹',
    actionSteps: [
      'Wash hands before touching the wound to prevent infection.',
      'Clean the wound gently under running water; remove debris with sterile tweezers.',
      'Apply firm pressure with a clean cloth to stop bleeding (5-10 minutes).',
      'Apply antiseptic and cover with a sterile adhesive bandage.',
      'Change dressing daily and watch for signs of infection.',
    ],
    remedy: 'Calendula',
    potency: '30C (internal) + Calendula cream externally',
    dosage: '3 pellets 3 times daily for 3 days; apply cream to wound edges',
    emergencyWarning:
      'Seek emergency care if bleeding does not stop after 10 minutes of pressure, wound is deep/gaping, caused by a rusty object, or shows signs of infection (redness, warmth, pus).',
  },
  {
    id: 'vomiting',
    name: 'Vomiting',
    icon: '🤢',
    actionSteps: [
      'Stop eating solid food and take small sips of clear fluids (ORS, diluted juice).',
      'Lie on your side to prevent choking if vomiting continues.',
      'After vomiting stops, gradually introduce bland foods (plain rice, toast).',
      'Avoid dairy, spicy, or fatty foods for 24 hours.',
    ],
    remedy: 'Ipecacuanha',
    potency: '30C',
    dosage: '3 pellets every 30 minutes, max 3 doses; repeat after 4 hours if needed',
    emergencyWarning:
      'Seek emergency care if vomiting blood or dark material, unable to keep fluids down for 12+ hours, signs of dehydration (no urination, dry mouth), or accompanied by severe abdominal pain.',
  },
  {
    id: 'food-poisoning',
    name: 'Food Poisoning',
    icon: '🍲',
    actionSteps: [
      'Stay hydrated with ORS solution, clear broth, or coconut water — small frequent sips.',
      'Avoid solid food until vomiting and nausea subside.',
      'Rest and avoid strenuous activity.',
      'Keep track of symptoms — note what food was consumed and when symptoms started.',
    ],
    remedy: 'Arsenicum Album',
    potency: '30C',
    dosage: '3 pellets every 1-2 hours during acute phase, max 6 doses in 24 hours',
    emergencyWarning:
      'Seek emergency care if symptoms last more than 3 days, high fever develops, blood in stool/vomit, severe dehydration, or if a young child or elderly person is affected.',
  },
  {
    id: 'allergic-reaction',
    name: 'Allergic Reaction',
    icon: '🤧',
    actionSteps: [
      'Identify and remove the allergen if possible (food, insect, pollen).',
      'For skin reactions: apply a cold compress to reduce itching and swelling.',
      'Take note of all symptoms including their progression.',
      'For mild reactions, wash the area with cool water and avoid scratching.',
    ],
    remedy: 'Apis Mellifica',
    potency: '30C',
    dosage: '3 pellets every 15-30 minutes for acute swelling, max 4 doses',
    emergencyWarning:
      'CALL 108 IMMEDIATELY if experiencing throat swelling, difficulty breathing, dizziness, rapid pulse, or widespread hives. This may be anaphylaxis — a life-threatening emergency.',
  },
  {
    id: 'insect-bites',
    name: 'Insect Bites and Stings',
    icon: '🐝',
    actionSteps: [
      'Remove the stinger by scraping sideways with a flat edge (do not squeeze with tweezers).',
      'Wash the area with soap and water.',
      'Apply a cold pack wrapped in cloth for 10 minutes to reduce swelling.',
      'Avoid scratching to prevent infection.',
    ],
    remedy: 'Ledum Palustre',
    potency: '30C',
    dosage: '3 pellets immediately, repeat every 2-3 hours, max 4 doses',
    emergencyWarning:
      'Seek emergency care if swelling spreads beyond the bite area, difficulty breathing or swallowing, dizziness or fainting, multiple stings, or if bitten by a scorpion or unknown insect.',
  },
  {
    id: 'headache',
    name: 'Headache',
    icon: '🤕',
    actionSteps: [
      'Rest in a quiet, dimly lit room and close your eyes.',
      'Apply a cool or warm compress to your forehead or back of neck.',
      'Stay hydrated — dehydration is a common headache trigger.',
      'Gently massage temples and the base of the skull.',
    ],
    remedy: 'Belladonna',
    potency: '30C',
    dosage: '3 pellets every 30 minutes for throbbing headache, max 3 doses',
    emergencyWarning:
      'Seek emergency care if headache is sudden and extremely severe ("thunderclap"), accompanied by fever and stiff neck, follows a head injury, or includes vision loss, confusion, or weakness on one side.',
  },
  {
    id: 'nosebleed',
    name: 'Nosebleed',
    icon: '👃',
    actionSteps: [
      'Sit upright and lean slightly forward (not backward) to prevent swallowing blood.',
      'Pinch the soft part of your nose firmly for 10-15 minutes without releasing.',
      'Apply a cold compress to the bridge of the nose.',
      'After bleeding stops, avoid blowing your nose for several hours.',
    ],
    remedy: 'Phosphorus',
    potency: '30C',
    dosage: '3 pellets once; repeat after 30 minutes if bleeding resumes, max 3 doses',
    emergencyWarning:
      'Seek emergency care if bleeding does not stop after 20 minutes of pressure, occurs after a head injury, blood flow is very heavy, or nosebleeds are recurring frequently.',
  },
  {
    id: 'sprain',
    name: 'Sprain',
    icon: '🦶',
    actionSteps: [
      'Follow RICE: Rest the injured area, apply Ice (wrapped in cloth) for 15-20 minutes.',
      'Compress with an elastic bandage (not too tight) to reduce swelling.',
      'Elevate the injured limb above heart level when possible.',
      'Avoid putting weight on the injury for at least 24-48 hours.',
    ],
    remedy: 'Arnica Montana',
    potency: '30C',
    dosage: '3 pellets every 2-3 hours on day one, then 3 times daily for 3-5 days',
    emergencyWarning:
      'Seek emergency care if you cannot bear weight at all, the joint appears deformed, there is numbness or severe swelling, or pain worsens significantly after 48 hours.',
  },
  {
    id: 'heat-stroke',
    name: 'Heat Stroke',
    icon: '☀️',
    actionSteps: [
      'Move the person to shade or an air-conditioned area immediately.',
      'Remove excess clothing and fan the body while spraying cool water.',
      'Apply ice packs to the neck, armpits, and groin areas.',
      'Give small sips of cool water if the person is conscious and alert.',
      'Do NOT give fluids if the person is vomiting or unconscious.',
    ],
    remedy: 'Glonoine',
    potency: '30C',
    dosage: '3 pellets every 15 minutes while cooling the person, max 4 doses',
    emergencyWarning:
      'CALL 108 IMMEDIATELY. Heat stroke is life-threatening. Seek emergency care for body temperature above 104°F, confusion, loss of consciousness, rapid breathing, or seizures.',
  },
  {
    id: 'diarrhea',
    name: 'Diarrhea',
    icon: '💧',
    actionSteps: [
      'Drink ORS solution (1 liter water + 6 tsp sugar + ½ tsp salt) or pre-mixed ORS packets.',
      'Continue small, frequent sips even if vomiting occurs.',
      'Eat bland foods: bananas, rice, toast, and boiled potatoes when appetite returns.',
      'Avoid milk, caffeine, alcohol, and spicy foods until resolved.',
    ],
    remedy: 'Podophyllum',
    potency: '30C',
    dosage: '3 pellets after each loose stool, max 6 doses in 24 hours',
    emergencyWarning:
      'Seek emergency care if stools contain blood or mucus, severe abdominal cramping, signs of dehydration (sunken eyes, no tears, very dark urine), or diarrhea persists beyond 3 days.',
  },
  {
    id: 'eye-irritation',
    name: 'Eye Irritation',
    icon: '👁️',
    actionSteps: [
      'Wash hands thoroughly before touching the eye area.',
      'Flush the affected eye with clean, lukewarm water for 10-15 minutes.',
      'Blink several times and let natural tears wash the eye.',
      'Do NOT rub the eye — this can worsen irritation or scratch the cornea.',
    ],
    remedy: 'Euphrasia',
    potency: '30C',
    dosage: '3 pellets 3 times daily; can also use Euphrasia eye drops (diluted)',
    emergencyWarning:
      'Seek emergency care if there is a chemical splash in the eye, embedded foreign object, sudden vision loss, severe pain, or discharge with fever.',
  },
  {
    id: 'toothache',
    name: 'Toothache',
    icon: '🦷',
    actionSteps: [
      'Rinse mouth with warm salt water (½ tsp salt in 8 oz water).',
      'Apply a cold compress externally to the cheek near the painful area.',
      'Use dental floss gently to remove any trapped food debris.',
      'Avoid very hot, cold, or sweet foods and drinks.',
    ],
    remedy: 'Plantago Major',
    potency: '30C (or Mother Tincture applied externally)',
    dosage: '3 pellets every 2 hours for pain; apply diluted MT on cotton to the tooth',
    emergencyWarning:
      'Seek emergency care if pain is severe and accompanied by fever, swelling of face/jaw, difficulty swallowing or breathing, or if there is pus drainage.',
  },
  {
    id: 'earache',
    name: 'Earache',
    icon: '👂',
    actionSteps: [
      'Apply a warm compress (warm washcloth) against the affected ear for comfort.',
      'Keep the head elevated — avoid lying flat on the painful side.',
      'Do NOT insert anything into the ear canal (no cotton buds or drops unless prescribed).',
      'Chewing gum or yawning may help relieve pressure if related to congestion.',
    ],
    remedy: 'Pulsatilla',
    potency: '30C',
    dosage: '3 pellets 3 times daily for up to 3 days',
    emergencyWarning:
      'Seek emergency care if there is discharge (pus or blood) from the ear, sudden hearing loss, high fever, severe dizziness, or pain following a head injury.',
  },
  {
    id: 'cough',
    name: 'Cough',
    icon: '😷',
    actionSteps: [
      'Stay hydrated with warm fluids — honey-lemon water, herbal tea, or warm broth.',
      'Use steam inhalation (bowl of hot water with towel over head) for 5-10 minutes.',
      'Elevate your head while sleeping with an extra pillow.',
      'Avoid smoke, dust, and strong fragrances that can trigger coughing.',
    ],
    remedy: 'Bryonia Alba',
    potency: '30C',
    dosage: '3 pellets 3 times daily for dry, painful cough; reduce as symptoms improve',
    emergencyWarning:
      'Seek emergency care if coughing up blood, difficulty breathing or wheezing, chest pain, cough persists more than 3 weeks, or high fever accompanies the cough.',
  },
  {
    id: 'cold-flu',
    name: 'Cold and Flu',
    icon: '🤒',
    actionSteps: [
      'Rest as much as possible and get adequate sleep.',
      'Drink warm fluids frequently — turmeric milk, ginger tea, hot water with honey.',
      'Gargle with warm salt water for sore throat relief.',
      'Use steam inhalation with a few drops of eucalyptus oil if available.',
      'Wash hands frequently to avoid spreading to others.',
    ],
    remedy: 'Oscillococcinum / Gelsemium',
    potency: '30C',
    dosage: '3 pellets of Gelsemium every 4 hours; Oscillococcinum as per package (early onset)',
    emergencyWarning:
      'Seek emergency care if breathing becomes difficult, chest pain develops, confusion or disorientation occurs, persistent vomiting, or symptoms suddenly worsen after initial improvement.',
  },
  {
    id: 'motion-sickness',
    name: 'Motion Sickness',
    icon: '🚗',
    actionSteps: [
      'Focus on a fixed point on the horizon; avoid reading or screen time during travel.',
      'Sit in the front seat of a car or over the wing on a plane.',
      'Get fresh air — open a window or step outside when possible.',
      'Eat light, bland snacks before and during travel; avoid heavy or greasy meals.',
    ],
    remedy: 'Cocculus Indicus',
    potency: '30C',
    dosage: '3 pellets 30 minutes before travel; repeat every 2 hours during journey',
    emergencyWarning:
      'Seek medical care if nausea and vomiting are severe and uncontrollable, dehydration develops, or if symptoms occur without any motion (may indicate an inner ear condition).',
  },
  {
    id: 'bruises',
    name: 'Bruises',
    icon: '🟣',
    actionSteps: [
      'Apply a cold compress or ice pack (wrapped in cloth) for 15-20 minutes immediately.',
      'Elevate the bruised area above heart level if possible.',
      'After 48 hours, switch to warm compresses to promote healing.',
      'Avoid massaging or pressing the bruise in the first 24 hours.',
    ],
    remedy: 'Arnica Montana',
    potency: '30C',
    dosage: '3 pellets every 3 hours on day one, then 3 times daily for 3-4 days',
    emergencyWarning:
      'Seek emergency care if bruising appears without any known injury, bruises are accompanied by severe swelling, you cannot move the affected area, or you bruise very easily and frequently.',
  },
  {
    id: 'muscle-cramps',
    name: 'Muscle Cramps',
    icon: '💪',
    actionSteps: [
      'Gently stretch and massage the cramping muscle.',
      'Apply a warm towel or heating pad to the affected area to relax the muscle.',
      'Walk around slowly if the cramp is in the leg or calf.',
      'Drink water or electrolyte solution — dehydration often causes cramps.',
      'After relief, do gentle stretches to prevent recurrence.',
    ],
    remedy: 'Magnesia Phosphorica',
    potency: '6X (biochemic/tissue salt)',
    dosage: '4 tablets dissolved in warm water, sipped frequently; repeat every 15 minutes until cramp resolves',
    emergencyWarning:
      'Seek medical care if cramps are extremely painful and do not resolve with stretching, occur frequently without obvious cause, are accompanied by muscle weakness or swelling, or affect breathing.',
  },
];
