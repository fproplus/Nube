import { useState, useRef, useEffect, useCallback } from "react";
import { User, Sliders, Globe, Utensils, UtensilsCrossed, Flame, Activity, BookOpen, Zap, Moon, Leaf, Sprout, Droplets, Dumbbell, Trophy, Lightbulb, Info, Unlock, Microscope, Shield, Heart, Bone, Sparkles, WifiOff, Fish, Lock } from "lucide-react";
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
// Coming Soon Mode - set to false to disable
const COMING_SOON = false;

if (COMING_SOON && window.location.hostname === 'nubetracker.com') {
  window.location.href = '/coming-soon.html';
}

const T = {
  en: {
    appTitle:"NuBe", appSubtitle:"What food can do.",
    searchPlaceholder:"Add a food... (e.g. chicken, spinach, turmeric)",
    tabToday:"Today", tabHistory:"Streaks", tabInsights:"Nutrition Check", tabBrowse:"Browse",
    vitamins:"Vitamins", minerals:"Minerals", activeBenefits:"Benefits",
    synergiesDetected:"Synergies Unlocked",
    syn1:"Black Pepper + Turmeric → Curcumin absorption x20",
    syn2:"Vitamin C + Iron → Iron absorption supercharged",
    syn3:"Avocado + Fat-soluble vitamins → Better A/E/K uptake",
    syn4:"Vitamin D + Calcium → Bone absorption maximised",
    syn5:"Vitamin D + Magnesium → Magnesium activates Vitamin D",
    syn6:"Vitamin K + Vitamin D → Calcium directed to bones",
    syn7:"Ginger + Turmeric → Anti-inflammatory power doubled",
    syn8:"Green Tea + Lemon → EGCG absorption boosted by Vitamin C",
    syn9:"Garlic + Vitamin C → Allicin effect amplified",
    syn10:"Omega-3 + Vitamin E → Fatty acids protected from oxidation",
    potentialSynergies:"Almost there...",
    addToUnlock:(missing,benefit)=>`Add ${missing} to unlock: ${benefit}`,
    streakTitle:"Your Streak", streakDays:"days", streakNone:"Start your streak today!",
    heatmapTitle:"Last 30 Days",
    noFoodsYet:"What did you eat today?", noFoodsTip:"Try: chicken, spinach, blueberries, turmeric",
    todaySummary:"Today's Verdict", missingTip:"Missing",
    alreadyEaten:"Already eaten today", topSources:"Top sources to add",
    clearAll:"Clear all",
    powerLabels:["Rest Day","Getting Started","Building Up","Solid Foundation","Strong Day","Powerhouse","Elite Fuel"],
    powerEmoji:["😴","🌱","💧","🌿","💪","⚡","🏆"],
    milestones:{
      firstFood:"First food logged! Let's go! 🚀", firstGreens:"First greens of the day! 🥬",
      firstProtein:"Protein locked in! 💪", firstSpice:"Spice it up! 🌶️",
      vitCovered:"Vitamins looking great! ✨", minCovered:"Minerals on point! ⚡",
      halfPower:"Halfway to Elite! Keep pushing! 🔥", elite:"ELITE FUEL! Incredible day! 🏆",
      streak3:"3 day streak! You're consistent! 🔥", streak7:"7 day streak! Unstoppable! 🔥🔥",
    },
    verdictLabels:{
      elite:"Elite day! Your body thanks you. 🏆", great:"Great day! Nearly at peak nutrition. 💪",
      solid:"Solid day! Good foundation. 🌿", ok:"Decent start. Add more variety tomorrow.",
      low:"Light day. Every bit counts - keep going! 🌱",
    },
    missingTips:{D:"Add salmon or eggs",B12:"Try salmon, eggs, or beef",B2:"Eggs or liver would nail it",B5:"Avocado or oats",E:"Almonds or sunflower seeds"},
    vitNames:{A:"Vitamin A",B1:"B1 Thiamine",B2:"B2 Riboflavin",B3:"B3 Niacin",B5:"B5 Pantothenic",B6:"Vitamin B6",B9:"B9 Folate",B12:"Vitamin B12",C:"Vitamin C",D:"Vitamin D",E:"Vitamin E",K:"Vitamin K"},
    catNames:{Protein:"Protein",Vegetable:"Vegetable",Fruit:"Fruit",Grain:"Grain",Legume:"Legume","Nut/Seed":"Nut/Seed",Spice:"Spice",Special:"Special","Fat/Oil":"Fat/Oil",Dairy:"Dairy",SoulFood:"Soul Food"},
    dayLabel:(d)=>d.toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short"}),
    todayMark:"Today",
    synergyModalTitle:"Synergies explained",
    synergyPossible:"Synergies you could unlock today",
    benefitDisclaimer:"This is general nutritional information, not medical advice.",
    preferencesBtn:"Preferences",preferencesTitle:"Your Preferences",dietLabel:"Diet",
    dietAll:"All",dietVegetarian:"Vegetarian",dietVegan:"Vegan",dietPescatarian:"Pescatarian",
    hiddenFoods:"Hidden foods",clearExcluded:"Show all foods again",savePreferences:"Save preferences",
    excludeToast:"Hidden. You can restore it in Preferences.",
  },
  de: {
    appTitle:"NuBe", appSubtitle:"What food can do.",
    searchPlaceholder:"Lebensmittel... (z.B. Hähnchen, Spinat, Kurkuma)",
    tabToday:"Heute", tabHistory:"Streak", tabInsights:"Nährwert-Check", tabBrowse:"Lexikon",
    vitamins:"Vitamine", minerals:"Mineralstoffe", activeBenefits:"Vorteile",
    synergiesDetected:"Synergien freigeschaltet",
    syn1:"Schwarzer Pfeffer + Kurkuma → Curcumin-Aufnahme x20",
    syn2:"Vitamin C + Eisen → Eisenaufnahme maximiert",
    syn3:"Avocado + Fettlösliche Vitamine → Bessere A/E/K Aufnahme",
    syn4:"Vitamin D + Calcium → Knochenaufnahme maximiert",
    syn5:"Vitamin D + Magnesium → Magnesium aktiviert Vitamin D",
    syn6:"Vitamin K + Vitamin D → Calcium wird in Knochen eingelagert",
    syn7:"Ingwer + Kurkuma → Entzündungshemmende Kraft verdoppelt",
    syn8:"Grüner Tee + Zitrone → EGCG-Aufnahme durch Vitamin C gesteigert",
    syn9:"Knoblauch + Vitamin C → Allicin-Wirkung verstärkt",
    syn10:"Omega-3 + Vitamin E → Fettsäuren vor Oxidation geschützt",
    potentialSynergies:"Fast geschafft...",
    addToUnlock:(missing,benefit)=>`${missing} hinzufügen um freizuschalten: ${benefit}`,
    streakTitle:"Dein Streak", streakDays:"Tage", streakNone:"Starte deinen Streak heute!",
    heatmapTitle:"Letzte 30 Tage",
    noFoodsYet:"Was hast du heute gegessen?", noFoodsTip:"Probiere: Hähnchen, Spinat, Blaubeeren, Kurkuma",
    todaySummary:"Tages-Fazit", missingTip:"Fehlt noch",
    alreadyEaten:"Heute bereits gegessen", topSources:"Noch hinzufügen",
    clearAll:"Alle löschen",
    powerLabels:["Ruhetag","Anfang gemacht","Aufbauend","Gute Basis","Starker Tag","Kraftpaket","Elite Fuel"],
    powerEmoji:["😴","🌱","💧","🌿","💪","⚡","🏆"],
    milestones:{
      firstFood:"Erster Eintrag! Los geht's! 🚀", firstGreens:"Erstes Gemüse! 🥬",
      firstProtein:"Protein gesichert! 💪", firstSpice:"Gewürz an Bord! 🌶️",
      vitCovered:"Vitamine top! ✨", minCovered:"Mineralstoffe top! ⚡",
      halfPower:"Halbzeit! Weiter so! 🔥", elite:"ELITE FUEL! Unglaublich! 🏆",
      streak3:"3 Tage in Folge! 🔥", streak7:"7 Tage Streak! 🔥🔥",
    },
    verdictLabels:{
      elite:"Elite-Tag! Dein Körper dankt dir. 🏆", great:"Großartiger Tag! Fast am Peak. 💪",
      solid:"Solider Tag! Gute Basis. 🌿", ok:"Guter Anfang. Morgen mehr Vielfalt.",
      low:"Leichter Tag. Jedes Bisschen zählt! 🌱",
    },
    missingTips:{D:"Morgen Lachs oder Eier",B12:"Lachs, Eier oder Rindfleisch",B2:"Eier oder Leber",B5:"Avocado oder Haferflocken",E:"Mandeln oder Sonnenblumenkerne"},
    vitNames:{A:"Vitamin A",B1:"B1 Thiamin",B2:"B2 Riboflavin",B3:"B3 Niacin",B5:"B5 Pantothensäure",B6:"Vitamin B6",B9:"B9 Folat",B12:"Vitamin B12",C:"Vitamin C",D:"Vitamin D",E:"Vitamin E",K:"Vitamin K"},
    catNames:{Protein:"Protein",Vegetable:"Gemüse",Fruit:"Obst",Grain:"Getreide",Legume:"Hülsenfrüchte","Nut/Seed":"Nüsse/Samen",Spice:"Gewürz",Special:"Besonders","Fat/Oil":"Fett/Öl",Dairy:"Milchprodukte",SoulFood:"Soul Food"},
    dayLabel:(d)=>d.toLocaleDateString("de-DE",{weekday:"short",day:"numeric",month:"short"}),
    todayMark:"Heute",
    synergyModalTitle:"Synergien erklärt",
    synergyPossible:"Synergien die du heute noch freischalten könntest",
    benefitDisclaimer:"Dies sind allgemeine Ernährungshinweise, keine medizinische Beratung.",
    preferencesBtn:"Einstellungen",preferencesTitle:"Deine Einstellungen",dietLabel:"Ernährungsweise",
    dietAll:"Alles",dietVegetarian:"Vegetarisch",dietVegan:"Vegan",dietPescatarian:"Pescetarisch",
    hiddenFoods:"Ausgeblendete Lebensmittel",clearExcluded:"Alle Lebensmittel wieder anzeigen",
    savePreferences:"Einstellungen speichern",excludeToast:"Ausgeblendet. In Einstellungen wiederherstellbar.",
  }
};

const BENEFIT_INFO = {
  en: {
    "Omega-3 fatty acids": "Omega-3s (EPA & DHA) are essential polyunsaturated fatty acids that reduce systemic inflammation, support brain cell membranes and help regulate heart rhythm. The body cannot produce them — dietary intake is the only source.",
    "Anti-inflammatory": "Certain foods contain compounds (e.g. curcumin, quercetin, EPA/DHA) that down-regulate inflammatory signalling pathways (NF-κB). Chronic low-grade inflammation is linked to metabolic disease, so regular intake of anti-inflammatory foods matters.",
    "Brain and heart health": "DHA makes up ~30% of the fatty acids in the brain's grey matter. Omega-3s also reduce triglycerides and blood pressure, two major cardiovascular risk factors.",
    "Lean muscle support": "Skeletal muscle protein synthesis requires a full set of essential amino acids plus adequate leucine as a trigger. High-quality animal proteins provide both in optimal ratios.",
    "High bioavailable protein": "Bioavailability describes how efficiently protein is absorbed and used. Eggs score 100 on the Protein Digestibility Corrected Amino Acid Score (PDCAAS). Animal proteins typically score higher than plant proteins.",
    "Immune function": "The immune system depends on zinc, selenium, vitamin C and B6 for lymphocyte proliferation, antibody production and oxidative defence. Deficiency in any of these impairs response time and severity.",
    "Complete protein": "A complete protein contains all nine essential amino acids (histidine, isoleucine, leucine, lysine, methionine, phenylalanine, threonine, tryptophan, valine) in sufficient quantities for human needs.",
    "Choline for brain health": "Choline is a precursor to acetylcholine, the key neurotransmitter for memory and muscle control. Eggs are one of the richest dietary sources. The body synthesises some choline but not enough to meet daily needs.",
    "Probiotics": "Probiotics are live microorganisms that, when consumed in adequate amounts, confer a health benefit. They help maintain gut barrier integrity, compete with pathogens and modulate immune responses.",
    "Bone health": "Bone mineral density depends on calcium, phosphorus, vitamin D3 (absorption), vitamin K2 (directs calcium into bone) and magnesium. Adequate intake from youth onwards is the strongest predictor of fracture risk later in life.",
    "Antioxidant-rich": "Antioxidants (e.g. polyphenols, carotenoids, vitamins C & E) neutralise reactive oxygen species (ROS). Excess ROS causes oxidative stress, which damages DNA, proteins and cell membranes and accelerates ageing.",
    "Sulforaphane (cancer-protective)": "Sulforaphane is a glucosinolate breakdown product found in cruciferous vegetables. It activates the Nrf2 pathway, upregulating the body's own detoxification enzymes. Multiple epidemiological studies associate high cruciferous vegetable intake with reduced cancer risk.",
    "Beta-carotene": "Beta-carotene is a provitamin A carotenoid. The body converts it to retinol (vitamin A) as needed, making it a safe dietary source. It also acts as an antioxidant, quenching singlet oxygen in cell membranes.",
    "Allicin (antimicrobial)": "Allicin is produced when garlic is crushed or chopped, activating the enzyme alliinase. It exhibits broad-spectrum antimicrobial activity against bacteria, fungi and some viruses, and inhibits platelet aggregation.",
    "Antimicrobial": "Antimicrobial compounds in food (allicin in garlic, carvacrol in oregano, lauric acid in coconut) disrupt microbial cell membranes or inhibit enzyme activity. These are not a replacement for medical treatment but support the body's natural defences.",
    "Lycopene (heart health)": "Lycopene is a red carotenoid antioxidant concentrated in tomatoes (especially cooked). It reduces LDL oxidation and lowers markers of arterial inflammation, making it cardioprotective.",
    "Prebiotic inulin": "Inulin is a soluble dietary fibre that resists digestion in the small intestine and is fermented by Bifidobacteria in the colon, increasing their population and producing short-chain fatty acids (SCFAs) like butyrate.",
    "MCT fatty acids (quick energy)": "Medium-chain triglycerides (MCTs) are absorbed directly into the portal circulation and metabolised in the liver to produce ketones — an alternative fuel for the brain and muscles that bypasses the usual fat digestion pathway.",
    "Lauric acid (antimicrobial)": "Lauric acid constitutes ~50% of coconut fat. It is converted in the body to monolaurin, which disrupts the lipid membranes of viruses and bacteria. Evidence is mostly in vitro; benefits in humans require adequate intake.",
    "Curcumin (anti-inflammatory)": "Curcumin is the main active polyphenol in turmeric. It inhibits the pro-inflammatory transcription factor NF-κB and the enzyme COX-2. Bioavailability is very low on its own but increases ~20-fold when combined with piperine (black pepper).",
    "Piperine enhances absorption": "Piperine inhibits intestinal and hepatic glucuronidation enzymes, slowing the metabolism of many nutrients and drugs. For curcumin, 20 mg piperine increases bioavailability by ~2000%.",
    "Blood sugar regulation": "Foods like cinnamon, apple cider vinegar and fibre-rich whole grains slow gastric emptying and glucose absorption, blunting post-meal blood sugar spikes and reducing insulin demand.",
    "Vitamin K2 (bone health)": "Vitamin K2 (menaquinone, especially MK-7) activates osteocalcin, a protein that binds calcium into bone matrix. It also activates matrix Gla protein, which prevents calcium from depositing in arteries.",
    "EGCG (powerful antioxidant)": "Epigallocatechin gallate (EGCG) is the most abundant catechin in green tea. It is one of the most potent plant antioxidants studied, with evidence for reducing LDL oxidation, supporting fat metabolism and modulating inflammation.",
    "L-theanine (calm focus)": "L-theanine is an amino acid found almost exclusively in tea. It increases alpha brain wave activity, promoting a state of relaxed alertness without sedation. Combined with caffeine, it smooths the stimulant effect.",
    "Flavanols (heart health)": "Cocoa flavanols (epicatechin and catechin) increase nitric oxide bioavailability, which relaxes blood vessel walls (vasodilation), lowering blood pressure and improving endothelial function.",
    "Bromelain digestive enzyme": "Bromelain is a mixture of cysteine proteases from pineapple. It breaks down protein in the digestive tract, reducing bloating and supporting digestion. It also has mild anti-inflammatory and fibrinolytic properties.",
    "Anthocyanins (brain health)": "Anthocyanins are water-soluble flavonoid pigments (blue/purple colour) that cross the blood-brain barrier and accumulate in brain regions associated with memory. Studies show improved cognitive function and protection against age-related decline.",
    "Collagen precursors": "Bone broth is rich in glycine, proline and hydroxyproline — the amino acids that form collagen. The body uses these as building blocks to synthesise new collagen for skin, cartilage and connective tissue.",
    "Gut lining repair": "Glutamine (abundant in bone broth) is the primary fuel for enterocytes (gut lining cells). Adequate intake supports tight junction integrity, reducing intestinal permeability ('leaky gut').",
    "Melatonin (sleep quality)": "Melatonin is a hormone produced by the pineal gland that regulates the sleep-wake cycle. Cherries are one of the few dietary sources. Studies show tart cherry juice can increase melatonin levels and improve sleep duration.",
    "Tryptophan for serotonin": "Tryptophan is an essential amino acid and the sole dietary precursor to serotonin (via 5-HTP) and melatonin. Adequate intake supports mood regulation, gut motility and sleep quality.",
    "Sustained energy": "Complex carbohydrates with a low glycaemic index (whole grains, legumes) are broken down slowly, providing a steady glucose supply to the brain and muscles without sharp insulin spikes.",
    "Potassium source": "Potassium is the primary intracellular cation. It counterbalances sodium, helps regulate blood pressure via the renin-angiotensin system and is essential for muscle contraction and nerve impulse transmission.",
    "Iron & Zinc boost": "Haem iron (from meat) is absorbed at 15–35% efficiency versus 2–20% for non-haem iron. Zinc from animal sources is similarly more bioavailable due to the absence of phytate inhibitors found in plant foods.",
    "B12 from beef": "Vitamin B12 is synthesised exclusively by microorganisms and found naturally only in animal products. It is essential for myelin sheath formation, DNA synthesis and red blood cell maturation. Deficiency causes irreversible neurological damage.",
  },
  de: {
    "Omega-3": "Omega-3-Fettsäuren (EPA & DHA) sind essentielle mehrfach ungesättigte Fettsäuren, die systemische Entzündungen reduzieren, Gehirnzellmembranen unterstützen und den Herzrhythmus regulieren. Der Körper kann sie nicht selbst herstellen.",
    "Entzündungshemmend": "Bestimmte Lebensmittel enthalten Verbindungen (z.B. Curcumin, Quercetin, EPA/DHA), die entzündliche Signalwege hemmen. Chronische Entzündungen sind mit Stoffwechselerkrankungen verbunden.",
    "Gehirn- und Herzgesundheit": "DHA macht ~30% der Fettsäuren in der grauen Gehirnmasse aus. Omega-3s senken auch Triglyceride und Blutdruck, zwei Hauptrisikofaktoren für Herz-Kreislauf-Erkrankungen.",
    "Muskelaufbau": "Die Proteinsynthese der Skelettmuskeln benötigt alle essentiellen Aminosäuren plus ausreichend Leucin als Auslöser. Hochwertige tierische Proteine liefern beides in optimalen Verhältnissen.",
    "Hochwertiges Protein": "Bioverfügbarkeit beschreibt, wie effizient Protein absorbiert und genutzt wird. Eier erzielen 100 auf dem PDCAAS. Tierische Proteine schneiden typischerweise besser ab als pflanzliche.",
    "Immunfunktion": "Das Immunsystem benötigt Zink, Selen, Vitamin C und B6 für Lymphozytenproliferation, Antikörperproduktion und oxidativen Schutz.",
    "Vollständiges Protein": "Ein vollständiges Protein enthält alle neun essentiellen Aminosäuren in ausreichenden Mengen für den menschlichen Bedarf.",
    "Cholin für Gehirn": "Cholin ist ein Vorläufer von Acetylcholin, dem wichtigsten Neurotransmitter für Gedächtnis und Muskelkontrolle. Eier sind eine der reichsten Nahrungsquellen.",
    "Probiotika": "Probiotika sind lebende Mikroorganismen, die in ausreichenden Mengen einen gesundheitlichen Nutzen bringen. Sie helfen, die Darmbarriere aufrechtzuerhalten und das Immunsystem zu modulieren.",
    "Knochengesundheit": "Die Knochenmineraldichte hängt von Kalzium, Phosphor, Vitamin D3, Vitamin K2 und Magnesium ab. Eine ausreichende Zufuhr ist der stärkste Prädiktor für das spätere Frakturrisiko.",
    "Antioxidantienreich": "Antioxidantien neutralisieren reaktive Sauerstoffspezies (ROS). Übermäßige ROS verursachen oxidativen Stress, der DNA, Proteine und Zellmembranen schädigt.",
    "Sulforaphan": "Sulforaphan ist ein Abbauprodukt aus Kreuzblütlern. Es aktiviert den Nrf2-Weg und reguliert die körpereigenen Entgiftungsenzyme hoch.",
    "Beta-Carotin": "Beta-Carotin ist ein Provitamin-A-Carotinoid. Der Körper wandelt es bei Bedarf in Retinol (Vitamin A) um. Es wirkt auch als Antioxidans.",
    "Allicin (antimikrobiell)": "Allicin entsteht beim Zerkleinern von Knoblauch. Es zeigt breites antimikrobielles Spektrum gegen Bakterien, Pilze und einige Viren.",
    "Antimikrobiell": "Antimikrobielle Verbindungen in Lebensmitteln stören mikrobielle Zellmembranen. Diese ersetzen keine medizinische Behandlung, unterstützen aber die natürlichen Abwehrkräfte.",
    "Lycopin": "Lycopin ist ein rotes Carotinoid-Antioxidans, konzentriert in Tomaten (besonders gekocht). Es reduziert LDL-Oxidation und senkt Marker arterieller Entzündung.",
    "Präbiotisches Inulin": "Inulin ist ein löslicher Ballaststoff, der im Dickdarm von Bifidobakterien fermentiert wird und kurzkettige Fettsäuren wie Butyrat produziert.",
    "MCT-Fettsäuren (schnelle Energie)": "Mittelkettige Triglyceride (MCTs) werden direkt in den Blutkreislauf aufgenommen und in der Leber zu Ketonen metabolisiert.",
    "Laurinsäure (antimikrobiell)": "Laurinsäure (~50% des Kokosfetts) wird im Körper in Monolaurin umgewandelt, das Lipidmembranen von Viren und Bakterien stört.",
    "Curcumin": "Curcumin ist das wichtigste Polyphenol in Kurkuma. Es hemmt den entzündungsfördernden Transkriptionsfaktor NF-κB. Die Bioverfügbarkeit steigt ~20-fach mit Piperin.",
    "Piperin steigert Aufnahme": "Piperin hemmt Darm-Glukuronidierungsenzyme. Für Curcumin erhöht es die Bioverfügbarkeit um ~2000%.",
    "Blutzuckerregulation": "Zimt, Apfelessig und ballaststoffreiche Vollkornprodukte verlangsamen die Magenentleerung und dämpfen den postprandialen Blutzuckeranstieg.",
    "Vitamin K2 (Knochen)": "Vitamin K2 aktiviert Osteocalcin (Kalzium in Knochen) und Matrix-Gla-Protein (verhindert Kalziumablagerungen in Arterien).",
    "EGCG": "Epigallocatechingallat (EGCG) ist das stärkste Catechin im grünen Tee mit Belegen für LDL-Oxidationsreduktion.",
    "L-Theanin": "L-Theanin erhöht Alpha-Gehirnwellenaktivität und fördert entspannte Wachheit ohne Sedierung.",
    "Flavanole": "Kakao-Flavanole erhöhen die Stickstoffmonoxid-Bioverfügbarkeit, entspannen Blutgefäßwände und verbessern die Endothelfunktion.",
    "Bromelain-Enzym": "Bromelain baut Protein im Verdauungstrakt ab, reduziert Blähungen und hat milde entzündungshemmende Eigenschaften.",
    "Anthocyane": "Anthocyane überwinden die Blut-Hirn-Schranke. Studien zeigen verbesserte kognitive Funktion und Schutz vor altersbedingtem Abbau.",
    "Kollagenvorstufen": "Knochenbrühe ist reich an Glycin, Prolin und Hydroxyprolin – den Aminosäuren für Kollagensynthese.",
    "Darmschleimsanierung": "Glutamin ist der Hauptbrennstoff für Enterozyten und unterstützt die Integrität der Tight Junctions.",
    "Melatonin": "Melatonin reguliert den Schlaf-Wach-Rhythmus. Kirschen sind eine der wenigen Nahrungsquellen.",
    "Tryptophan fuer Serotonin": "Tryptophan ist die einzige Nahrungsvorstufe von Serotonin und Melatonin.",
    "Anhaltende Energie": "Komplexe Kohlenhydrate werden langsam abgebaut und liefern Gehirn und Muskeln gleichmäßig Glukose.",
    "Kaliumquelle": "Kalium reguliert den Blutdruck und ist für Muskelkontraktion und Nervenübertragung unerlässlich.",
    "Eisen & Zink": "Häm-Eisen wird mit 15–35% Effizienz absorbiert, gegenüber 2–20% für Nicht-Häm-Eisen.",
  }
};

const SYNERGY_DETAILS = {
  en: [
    {id:"turmeric_pepper",title:"Black Pepper + Turmeric",emoji:"🌶️+🌿",short:"Curcumin absorption x20",explanation:"Curcumin, turmeric's active compound, is poorly absorbed on its own — most is metabolised before reaching the bloodstream. Piperine in black pepper inhibits the liver enzyme CYP3A4 and intestinal glucuronidation, slowing curcumin breakdown and increasing its bioavailability by approximately 2000%. Just a pinch of pepper makes a significant difference.",needs:["Turmeric","Black Pepper"]},
    {id:"vitc_iron",title:"Vitamin C + Iron",emoji:"🍊+🥩",short:"Iron absorption supercharged",explanation:"Non-haem iron is absorbed as Fe³⁺ but must be reduced to Fe²⁺ for intestinal uptake. Vitamin C acts as a reducing agent, forming a soluble complex that resists inhibitory effects of phytates and polyphenols. Adding a vitamin-C-rich food to an iron-rich meal can increase absorption 2–6 fold.",needs:["Bell Pepper","Orange","Lemon","Kiwi","Broccoli","Strawberries","Mandarin","Raspberries","Lime","Cauliflower"]},
    {id:"avocado_fatvit",title:"Avocado + Fat-soluble Vitamins",emoji:"🥑+🥗",short:"Better A, E & K uptake",explanation:"Vitamins A, D, E and K are fat-soluble — they need dietary fat to be absorbed. Avocado's oleic acid is incorporated into mixed micelles in the small intestine, dramatically increasing absorption of carotenoids and fat-soluble vitamins. Studies show up to 4–5x more beta-carotene absorption when avocado is added to a salad.",needs:["Avocado"]},
    {id:"vitd_calcium",title:"Vitamin D + Calcium",emoji:"☀️+🦴",short:"Bone absorption maximised",explanation:"Vitamin D3 (calcitriol) is essential for calcium absorption in the gut. Without adequate Vitamin D, only 10–15% of dietary calcium is absorbed; with sufficient Vitamin D this rises to 30–40%. Vitamin D upregulates the calcium transport protein calbindin in intestinal cells, making the combination far more effective than either alone.",needs:["Salmon","Sardines","Mackerel","Trout","Eggs","Mushrooms","Champignon","Portobello Mushroom","Kefir","Oat Milk","Soy Milk"]},
    {id:"vitd_magnesium",title:"Vitamin D + Magnesium",emoji:"☀️+⚡",short:"Magnesium activates Vitamin D",explanation:"Magnesium is a cofactor for the enzymes that convert Vitamin D into its active form (calcitriol). Without adequate magnesium, Vitamin D supplementation or dietary intake cannot be properly activated. Studies show magnesium-deficient individuals fail to respond to Vitamin D therapy until magnesium is replenished.",needs:["Cocoa (Raw)","Pumpkin Seeds","Chia Seeds","Almonds","Quinoa","Spinach","Dark Chocolate (85%)","Flaxseeds","Sesame Seeds"]},
    {id:"vitk_vitd",title:"Vitamin K + Vitamin D",emoji:"🥬+☀️",short:"Calcium directed to bones",explanation:"Vitamin D increases calcium absorption but without Vitamin K2, that calcium may deposit in arteries rather than bones. Vitamin K2 activates osteocalcin (directs calcium into bone matrix) and Matrix Gla Protein (prevents arterial calcification). Together they form the complete bone-building and cardiovascular-protective duo.",needs:["Kale","Spinach","Broccoli","Green Asparagus","Avocado","Leek","Brussels Sprouts","Green Beans"]},
    {id:"ginger_turmeric",title:"Ginger + Turmeric",emoji:"🫚+🌿",short:"Anti-inflammatory power doubled",explanation:"Both ginger (gingerols/shogaols) and turmeric (curcumin) independently inhibit NF-κB and COX-2 inflammatory pathways. When combined, they act on overlapping and complementary targets, producing additive and potentially synergistic anti-inflammatory effects. Traditional Ayurvedic and Asian medicine has combined these roots for centuries.",needs:["Ginger","Turmeric"]},
    {id:"greentea_lemon",title:"Green Tea + Lemon",emoji:"🍵+🍋",short:"EGCG absorption boosted by Vitamin C",explanation:"EGCG (epigallocatechin gallate), green tea's most potent antioxidant, is highly unstable in the alkaline intestinal environment and rapidly degrades. Vitamin C (ascorbic acid) from lemon stabilises EGCG and prevents its oxidation, increasing the amount reaching the bloodstream by up to 13-fold according to some studies.",needs:["Green Tea","Lemon"]},
    {id:"garlic_vitc",title:"Garlic + Vitamin C",emoji:"🧄+🍊",short:"Allicin effect amplified",explanation:"Allicin, garlic's primary active compound, is unstable and rapidly oxidises after formation. Vitamin C acts as an antioxidant that protects allicin from oxidative degradation, prolonging its antimicrobial and cardiovascular-protective effects in the body. The combination also shows enhanced immune-boosting activity in vitro studies.",needs:["Garlic","Bell Pepper","Orange","Kiwi","Strawberries","Broccoli","Kale"]},
    {id:"omega3_vite",title:"Omega-3 + Vitamin E",emoji:"🐟+🌻",short:"Fatty acids protected from oxidation",explanation:"Omega-3 polyunsaturated fatty acids (EPA & DHA) are highly susceptible to lipid peroxidation — oxidative damage that renders them inactive or even harmful. Vitamin E (alpha-tocopherol) is a fat-soluble antioxidant that embeds in cell membranes and lipid particles, specifically protecting polyunsaturated fatty acids from oxidative degradation and preserving their anti-inflammatory activity.",needs:["Salmon","Mackerel","Sardines","Trout","Sea Bass","Swordfish Steak","Prawns","Walnuts","Chia Seeds","Flaxseeds","Hemp Seeds"]},
  ],
  de: [
    {id:"turmeric_pepper",title:"Schwarzer Pfeffer + Kurkuma",emoji:"🌶️+🌿",short:"Curcumin-Aufnahme x20",explanation:"Curcumin, der Wirkstoff in Kurkuma, wird allein kaum aufgenommen. Piperin in schwarzem Pfeffer hemmt das Leberenzym CYP3A4 und die intestinale Glucuronidierung, verlangsamt den Curcumin-Abbau und erhöht seine Bioverfügbarkeit um ca. 2000%. Schon eine Prise Pfeffer macht einen erheblichen Unterschied.",needs:["Kurkuma","Schwarzer Pfeffer"]},
    {id:"vitc_iron",title:"Vitamin C + Eisen",emoji:"🍊+🥩",short:"Eisenaufnahme maximiert",explanation:"Nicht-Häm-Eisen liegt als Fe³⁺ vor und muss für die Darmaufnahme zu Fe²⁺ reduziert werden. Vitamin C wirkt als Reduktionsmittel und bildet einen löslichen Komplex, der die Hemmwirkung von Phytaten und Polyphenolen überwindet. Eine vitamin-C-reiche Mahlzeit kann die Eisenaufnahme 2–6-fach steigern.",needs:["Paprika","Orange","Zitrone","Kiwi","Brokkoli","Erdbeeren","Mandarine","Himbeeren","Limette","Blumenkohl"]},
    {id:"avocado_fatvit",title:"Avocado + Fettlösliche Vitamine",emoji:"🥑+🥗",short:"Bessere A, E & K Aufnahme",explanation:"Vitamine A, D, E und K sind fettlöslich. Die Ölsäure der Avocado wird in gemischte Mizellen eingebaut und erhöht die Aufnahme von Carotinoiden und fettlöslichen Vitaminen aus mitgegessenen Lebensmitteln dramatisch. Studien zeigen bis zu 4–5x mehr Beta-Carotin-Absorption mit Avocado.",needs:["Avocado"]},
    {id:"vitd_calcium",title:"Vitamin D + Calcium",emoji:"☀️+🦴",short:"Knochenaufnahme maximiert",explanation:"Vitamin D3 (Calcitriol) ist essenziell für die Calciumabsorption im Darm. Ohne ausreichend Vitamin D werden nur 10–15% des Nahrungscalciums aufgenommen; mit ausreichend Vitamin D steigt dies auf 30–40%. Vitamin D reguliert das Calciumtransportprotein Calbindin in Darmzellen hoch.",needs:["Lachs","Sardinen","Makrele","Forelle","Eier","Pilze","Champignon","Portobello","Kefir","Hafermilch","Sojamilch"]},
    {id:"vitd_magnesium",title:"Vitamin D + Magnesium",emoji:"☀️+⚡",short:"Magnesium aktiviert Vitamin D",explanation:"Magnesium ist ein Cofaktor für die Enzyme, die Vitamin D in seine aktive Form (Calcitriol) umwandeln. Ohne ausreichend Magnesium kann Vitamin D nicht richtig aktiviert werden. Studien zeigen, dass magnesiumdefiziente Personen erst nach Magnesiumauffüllung auf Vitamin-D-Therapie ansprechen.",needs:["Rohkakao","Kürbiskerne","Chiasamen","Mandeln","Quinoa","Spinat","Dunkle Schokolade (85%+)","Leinsamen","Sesam"]},
    {id:"vitk_vitd",title:"Vitamin K + Vitamin D",emoji:"🥬+☀️",short:"Calcium wird in Knochen eingelagert",explanation:"Vitamin D erhöht die Calciumabsorption, aber ohne Vitamin K2 kann sich das Calcium in Arterien ablagern statt in Knochen. Vitamin K2 aktiviert Osteocalcin (leitet Calcium in die Knochenmatrix) und Matrix-Gla-Protein (verhindert arterielle Verkalkung). Zusammen bilden sie das komplette Knochenaufbau-Duo.",needs:["Grünkohl","Spinat","Brokkoli","Grüner Spargel","Avocado","Lauch","Rosenkohl","Grüne Bohnen"]},
    {id:"ginger_turmeric",title:"Ingwer + Kurkuma",emoji:"🫚+🌿",short:"Entzündungshemmende Kraft verdoppelt",explanation:"Sowohl Ingwer (Gingerole/Shogaole) als auch Kurkuma (Curcumin) hemmen unabhängig voneinander NF-κB und COX-2 Entzündungswege. In Kombination wirken sie auf überlappende und komplementäre Ziele und erzeugen additive, möglicherweise synergistische entzündungshemmende Effekte.",needs:["Ingwer","Kurkuma"]},
    {id:"greentea_lemon",title:"Grüner Tee + Zitrone",emoji:"🍵+🍋",short:"EGCG-Aufnahme durch Vitamin C gesteigert",explanation:"EGCG, das wirksamste Antioxidans im grünen Tee, ist im alkalischen Darmumfeld hochgradig instabil und zerfällt schnell. Vitamin C aus der Zitrone stabilisiert EGCG und verhindert seine Oxidation, was die im Blutkreislauf ankommende Menge laut einigen Studien bis zu 13-fach erhöht.",needs:["Grüner Tee","Zitrone"]},
    {id:"garlic_vitc",title:"Knoblauch + Vitamin C",emoji:"🧄+🍊",short:"Allicin-Wirkung verstärkt",explanation:"Allicin, der primäre Wirkstoff des Knoblauchs, ist instabil und oxidiert schnell nach seiner Bildung. Vitamin C wirkt als Antioxidans, das Allicin vor oxidativem Abbau schützt und seine antimikrobiellen und kardiovaskulären Schutzeffekte verlängert.",needs:["Knoblauch","Paprika","Orange","Kiwi","Erdbeeren","Brokkoli","Grünkohl"]},
    {id:"omega3_vite",title:"Omega-3 + Vitamin E",emoji:"🐟+🌻",short:"Fettsäuren vor Oxidation geschützt",explanation:"Omega-3-Fettsäuren (EPA & DHA) sind hochgradig anfällig für Lipidperoxidation – oxidativen Schaden, der sie inaktiv oder sogar schädlich macht. Vitamin E (Alpha-Tocopherol) ist ein fettlösliches Antioxidans, das sich in Zellmembranen einbettet und mehrfach ungesättigte Fettsäuren spezifisch vor oxidativem Abbau schützt.",needs:["Lachs","Makrele","Sardinen","Forelle","Dorade","Schwertfischsteak","Garnelen","Walnüsse","Chiasamen","Leinsamen"]},
  ],
};

const NUTRIENT_INFO = {
  vitamins:{
    A:{en:{role:"Eye health, immune function and skin repair.",tops:["Liver (Beef)","Kale","Sweet Potato","Carrot","Spinach","Mango"]},de:{role:"Augengesundheit und Immunfunktion.",tops:["Rinderleber","Grünkohl","Süßkartoffel","Karotte","Spinat","Mango"]}},
    B1:{en:{role:"Energy metabolism and nerve function.",tops:["Oats","Lentils","Sunflower Seeds","Brown Rice","Quinoa","Pineapple"]},de:{role:"Energiestoffwechsel und Nervenfunktion.",tops:["Haferflocken","Linsen","Sonnenblumenkerne","Vollkornreis","Quinoa","Ananas"]}},
    B2:{en:{role:"Energy production and skin health.",tops:["Liver (Beef)","Eggs","Skyr","Mackerel","Almonds","Mushrooms"]},de:{role:"Energieproduktion und Hautgesundheit.",tops:["Rinderleber","Eier","Skyr","Makrele","Mandeln","Pilze"]}},
    B3:{en:{role:"DNA repair and energy metabolism.",tops:["Chicken Breast","Tuna","Liver (Beef)","Turkey","Salmon","Beef","Mushrooms"]},de:{role:"DNA-Reparatur und Energiestoffwechsel.",tops:["Hähnchenbrust","Thunfisch","Rinderleber","Pute","Lachs","Rindfleisch","Pilze"]}},
    B5:{en:{role:"Hormone production and wound healing.",tops:["Liver (Beef)","Avocado","Mushrooms","Salmon","Eggs","Oats"]},de:{role:"Hormonproduktion und Wundheilung.",tops:["Rinderleber","Avocado","Pilze","Lachs","Eier","Haferflocken"]}},
    B6:{en:{role:"Brain health and mood regulation.",tops:["Chicken Breast","Salmon","Banana","Avocado","Beef","Sweet Potato"]},de:{role:"Gehirngesundheit und Stimmung.",tops:["Hähnchenbrust","Lachs","Banane","Avocado","Rindfleisch","Süßkartoffel"]}},
    B9:{en:{role:"Cell division and DNA synthesis.",tops:["Liver (Beef)","Lentils","Spinach","Chickpeas","Avocado","Green Asparagus"]},de:{role:"Zellteilung und DNA-Synthese.",tops:["Rinderleber","Linsen","Spinat","Kichererbsen","Avocado","Grüner Spargel"]}},
    B12:{en:{role:"Nerve function. Only in animal foods — vegans should supplement or use nutritional yeast.",tops:["Liver (Beef)","Oysters","Salmon","Tuna","Mackerel","Beef","Beef Steak","Trout","Prawns","Eggs","Nutritional Yeast"]},de:{role:"Nervenfunktion. Nur in tierischen Lebensmitteln — Veganer sollten supplementieren oder Nährhefe nutzen.",tops:["Rinderleber","Austern","Lachs","Thunfisch","Makrele","Rindfleisch","Rumpsteak","Forelle","Garnelen","Eier","Nährhefe"]}},
    C:{en:{role:"Immune powerhouse and collagen synthesis.",tops:["Bell Pepper","Kiwi","Orange","Strawberries","Broccoli","Kale","Mango","Mandarin","Raspberries","Kohlrabi","Cauliflower"]},de:{role:"Immunbooster und Kollagensynthese.",tops:["Paprika","Kiwi","Orange","Erdbeeren","Brokkoli","Grünkohl","Mango","Mandarine","Himbeeren","Kohlrabi","Blumenkohl"]}},
    D:{en:{role:"Bone strength and immune modulation.",tops:["Salmon","Sardines","Mackerel","Trout","Eggs","Tuna","Mushrooms","Champignon","Portobello Mushroom","Kefir","Oat Milk","Soy Milk"]},de:{role:"Knochenstärke und Immunmodulation.",tops:["Lachs","Sardinen","Makrele","Forelle","Eier","Thunfisch","Pilze","Champignon","Portobello","Kefir","Hafermilch","Sojamilch"]}},
    E:{en:{role:"Cell membrane protection and skin health.",tops:["Sunflower Seeds","Almonds","Avocado","Olive Oil","Spinach","Salmon"]},de:{role:"Zellmembranschutz und Hautgesundheit.",tops:["Sonnenblumenkerne","Mandeln","Avocado","Olivenöl","Spinat","Lachs"]}},
    K:{en:{role:"Blood clotting and bone health.",tops:["Kale","Spinach","Broccoli","Green Asparagus","Brussels Sprouts","Avocado"]},de:{role:"Blutgerinnung und Knochengesundheit.",tops:["Grünkohl","Spinat","Brokkoli","Grüner Spargel","Rosenkohl","Avocado"]}},
  },
  minerals:{
    Calcium:{en:{role:"Bone strength, muscle contraction and nerve signalling.",tops:["Parmesan","Emmental","Skyr","Cheddar","Gouda","Greek Yogurt","Sardines","Kefir","Sesame Seeds","Tahini","Tofu","Pak Choi","Oat Milk"]},de:{role:"Knochen- und Zahnstärke.",tops:["Parmesan","Emmentaler","Skyr","Cheddar","Gouda","Griechischer Joghurt","Sardinen","Kefir","Sesam","Tahini","Tofu","Pak Choi","Hafermilch"]}},
    Copper:{en:{role:"Iron metabolism and antioxidant enzymes.",tops:["Liver (Beef)","Oysters","Dark Chocolate (85%+)","Cocoa (Raw)","Walnuts"]},de:{role:"Eisenstoffwechsel und antioxidative Enzyme.",tops:["Rinderleber","Austern","Dunkle Schokolade (85%+)","Rohkakao","Walnüsse"]}},
    Iron:{en:{role:"Oxygen transport. Pair with Vitamin C for best absorption.",tops:["Liver (Beef)","Oysters","Beef","Lentils","Spinach","Pumpkin Seeds","Sesame Seeds","Amaranth","Tofu","Tempeh"]},de:{role:"Sauerstofftransport.",tops:["Rinderleber","Austern","Rindfleisch","Linsen","Spinat","Kürbiskerne","Sesam","Amaranth","Tofu","Tempeh"]}},
    Magnesium:{en:{role:"500+ enzyme reactions, sleep and stress.",tops:["Cocoa (Raw)","Pumpkin Seeds","Chia Seeds","Almonds","Quinoa","Spinach"]},de:{role:"500+ Enzymreaktionen, Schlaf und Stress.",tops:["Rohkakao","Kürbiskerne","Chiasamen","Mandeln","Quinoa","Spinat"]}},
    Manganese:{en:{role:"Bone formation and antioxidant defense.",tops:["Oats","Brown Rice","Quinoa","Spinach","Cinnamon","Pineapple"]},de:{role:"Knochenbildung und antioxidativer Schutz.",tops:["Haferflocken","Vollkornreis","Quinoa","Spinat","Zimt","Ananas"]}},
    Phosphorus:{en:{role:"Bone strength and energy production (ATP).",tops:["Chicken Breast","Salmon","Sardines","Beef","Quinoa","Skyr","Eggs"]},de:{role:"Knochen und Energieproduktion (ATP).",tops:["Hähnchenbrust","Lachs","Sardinen","Rindfleisch","Quinoa","Skyr","Eier"]}},
    Potassium:{en:{role:"Blood pressure and heart rhythm.",tops:["Avocado","Sweet Potato","Banana","Salmon","Tomato","Lentils","Kiwi"]},de:{role:"Blutdruck und Herzrhythmus.",tops:["Avocado","Süßkartoffel","Banane","Lachs","Tomate","Linsen","Kiwi"]}},
    Selenium:{en:{role:"Thyroid function and immune support.",tops:["Oysters","Sardines","Prawns","Trout","Swordfish Steak","Tuna","Salmon","Sunflower Seeds","Chicken Breast","Eggs"]},de:{role:"Schilddrüsenfunktion und Immununterstützung.",tops:["Austern","Sardinen","Garnelen","Forelle","Schwertfischsteak","Thunfisch","Lachs","Sonnenblumenkerne","Hähnchenbrust","Eier"]}},
    Zinc:{en:{role:"Immune function and wound healing.",tops:["Oysters","Beef Steak","Lamb Chops","Pumpkin Seeds","Beef","Liver (Beef)","Lentils","Quinoa","Sesame Seeds","Tempeh","Tofu"]},de:{role:"Immunfunktion und Wundheilung.",tops:["Austern","Rumpsteak","Lammkotelett","Kürbiskerne","Rindfleisch","Rinderleber","Linsen","Quinoa","Sesam","Tempeh","Tofu"]}},
  }
};

const HEALTH_GOALS = {
  en:[
    {id:"gut",icon:Activity,label:"Gut Health",desc:"Feed your microbiome. A diverse gut = stronger immunity, better mood, clearer skin.",keywords:["Probiotics","Prebiotic","Beta-glucan","Bromelain","Gut health","Gut lining","Gut diversity","Inulin","pectin"]},
    {id:"energy",icon:Zap,label:"Energy & Focus",desc:"Fuel your brain and muscles with B-vitamins, iron and slow-burning carbs.",keywords:["Energy","B-vitamins","Iron","Sustained energy","Quick energy","Brain","Theobromine","L-theanine"]},
    {id:"sleep",icon:Moon,label:"Sleep & Recovery",desc:"Tryptophan, magnesium and melatonin — the sleep trifecta.",keywords:["Sleep","Melatonin","Tryptophan","Magnesium","stress","Recovery"]},
    {id:"immune",icon:Shield,label:"Immune System",desc:"Vitamin C, zinc, selenium and beta-glucan keep your defenses strong.",keywords:["Immune","Antioxidant","Selenium","Zinc","Vitamin C","antimicrobial","Anti-inflammatory","EGCG"]},
    {id:"muscle",icon:Dumbbell,label:"Muscle & Strength",desc:"Protein, leucine and zinc for building and repairing muscle tissue.",keywords:["muscle","Protein","Leucine","Testosterone","Omega-3","Post-workout","Iron","B12"]},
    {id:"heart",icon:Heart,label:"Heart Health",desc:"Omega-3, potassium and flavanols keep your cardiovascular system in top shape.",keywords:["Heart","Omega-3","Potassium","Flavanols","Lycopene","Oleocanthal","ALA"]},
    {id:"bone",icon:Bone,label:"Bone Health",desc:"Calcium, Vitamin D and K2 work together to keep your bones strong for life.",keywords:["Bone","Calcium","Vitamin D","K2","Phosphorus","collagen"]},
    {id:"skin",icon:Sparkles,label:"Skin & Glow",desc:"Collagen, Vitamin C, E and zinc for clear, radiant skin.",keywords:["Skin","collagen","Vitamin C","Vitamin E","Zinc","Beta-carotene","Lycopene","Antioxidant"]},
  ],
  de:[
    {id:"gut",icon:Activity,label:"Darmgesundheit",desc:"Füttere dein Mikrobiom. Ein vielfältiger Darm = stärkere Immunität, bessere Stimmung.",keywords:["Probiotika","Präbiotikum","Beta-Glucan","Bromelain","Darmgesundheit","Darmschleimhaut","Darmflora","Inulin","Pektin"]},
    {id:"energy",icon:Zap,label:"Energie & Fokus",desc:"Versorge Gehirn und Muskeln mit B-Vitaminen, Eisen und langsam brennenden Kohlenhydraten.",keywords:["Energie","B-Vitamine","Eisen","Anhaltende Energie","Schnelle Energie","Gehirn","Theobromin","L-Theanin"]},
    {id:"sleep",icon:Moon,label:"Schlaf & Erholung",desc:"Tryptophan, Magnesium und Melatonin — das Schlaf-Trifecta.",keywords:["Schlaf","Melatonin","Tryptophan","Magnesium","Stressregulation","Muskelregeneration"]},
    {id:"immune",icon:Shield,label:"Immunsystem",desc:"Vitamin C, Zink, Selen und Beta-Glucan halten deine Abwehr stark.",keywords:["Immun","Antioxidantien","Selen","Zink","Vitamin C","antimikrobiell","Entzündungshemmend","EGCG"]},
    {id:"muscle",icon:Dumbbell,label:"Muskel & Kraft",desc:"Protein, Leucin und Zink für Muskelaufbau und Regeneration.",keywords:["Muskel","Protein","Leucin","Testosteron","Omega-3","Post-Workout","Eisen","B12"]},
    {id:"heart",icon:Heart,label:"Herzgesundheit",desc:"Omega-3, Kalium und Flavanole halten dein Herz-Kreislauf-System fit.",keywords:["Herz","Omega-3","Kalium","Flavanole","Lycopin","Oleocanthal","ALA"]},
    {id:"bone",icon:Bone,label:"Knochengesundheit",desc:"Kalzium, Vitamin D und K2 arbeiten zusammen für starke Knochen.",keywords:["Knochen","Kalzium","Vitamin D","K2","Phosphorus","Kollagen"]},
    {id:"skin",icon:Sparkles,label:"Haut & Glow",desc:"Kollagen, Vitamin C, E und Zink für klare, strahlende Haut.",keywords:["Haut","Kollagen","Vitamin C","Vitamin E","Zink","Beta-Carotin","Lycopin","Antioxidantien"]},
  ],
};

const FOODS_RAW = [
  {en:"Chicken Breast",de:"Hähnchenbrust",cat:"Protein",v:{B3:3,B6:3,B12:2,B2:1},m:{Phosphorus:3,Selenium:3,Zinc:2},b:{en:["Lean muscle support","High bioavailable protein","Immune function"],de:["Muskelaufbau","Hochwertiges Protein","Immunfunktion"]}},
  {en:"Salmon",de:"Lachs",cat:"Protein",v:{B12:3,D:3,B3:2,B6:2,E:1},m:{Selenium:3,Phosphorus:2,Potassium:2},b:{en:["Omega-3 fatty acids","Anti-inflammatory","Brain and heart health"],de:["Omega-3","Entzündungshemmend","Gehirn- und Herzgesundheit"]}},
  {en:"Eggs",de:"Eier",cat:"Protein",v:{B12:3,D:2,A:2,B2:2,E:1,K:1},m:{Selenium:3,Phosphorus:2,Zinc:1},b:{en:["Complete protein","Choline for brain health","Eye health"],de:["Vollständiges Protein","Cholin für Gehirn","Augengesundheit"]}},
  {en:"Beef",de:"Rindfleisch",cat:"Protein",aliases:["Faschiertes","Fleischpflanzl","Hack","Gehacktes"],v:{B12:3,B3:2,B6:2,B2:1},m:{Zinc:3,Iron:3,Selenium:2,Phosphorus:2},b:{en:["High bioavailable iron","Complete protein","Energy support"],de:["Bioverfügbares Eisen","Vollständiges Protein","Energieunterstützung"]}},
  {en:"Minced Meat",de:"Hackfleisch",cat:"Protein",aliases:["Faschiertes","Fleischpflanzl","Hack","Gehacktes"],v:{B12:2,B3:2,B6:2,B2:1},m:{Zinc:2,Iron:2,Selenium:1,Phosphorus:2},b:{en:["Complete protein","Iron source","B12 boost"],de:["Vollständiges Protein","Eisenquelle","B12-Schub"]}},
  {en:"Sardines",de:"Sardinen",cat:"Protein",v:{B12:3,D:3,B3:2,E:1},m:{Calcium:3,Selenium:3,Phosphorus:3},b:{en:["Omega-3 fatty acids","Bone health","Anti-inflammatory"],de:["Omega-3","Knochengesundheit","Entzündungshemmend"]}},
  {en:"Tuna",de:"Thunfisch",cat:"Protein",v:{B12:3,B3:3,B6:2,D:2},m:{Selenium:3,Phosphorus:2},b:{en:["Lean protein","Heart health","Brain support"],de:["Mageres Protein","Herzgesundheit","Gehirnunterstützung"]}},
  {en:"Turkey",de:"Pute",cat:"Protein",v:{B3:3,B6:2,B12:2,B2:1},m:{Selenium:3,Zinc:2,Phosphorus:2},b:{en:["Tryptophan for serotonin","Lean muscle","Immune function"],de:["Tryptophan fuer Serotonin","Muskelaufbau","Immunfunktion"]}},
  {en:"Liver (Beef)",de:"Rinderleber",cat:"Protein",v:{A:3,B12:3,B2:3,B9:3,B3:2,C:1},m:{Iron:3,Copper:3,Zinc:3,Selenium:3},b:{en:["Most nutrient-dense food","Detox support","Energy metabolism"],de:["Nährstoffreichstes Lebensmittel","Entgiftung","Energiestoffwechsel"]}},
  {en:"Skyr",de:"Skyr",cat:"Dairy",v:{B12:3,B2:2,B5:1},m:{Calcium:3,Phosphorus:3,Zinc:1,Potassium:1},b:{en:["Highest protein dairy","Probiotics","Bone health"],de:["Höchster Proteingehalt","Probiotika","Knochengesundheit"]}},
  {en:"Whey Protein",de:"Whey Protein",cat:"Dairy",v:{B2:2,B12:2,B5:1},m:{Calcium:2,Phosphorus:2,Selenium:2,Zinc:1},b:{en:["Fastest absorbing protein","Leucine (muscle synthesis)","Post-workout recovery"],de:["Schnellstes Protein","Leucin (Muskelsynthese)","Post-Workout"]}},
  {en:"Quark (Low-fat)",de:"Magerquark",cat:"Dairy",v:{B12:2,B2:2,B5:1},m:{Calcium:3,Phosphorus:2,Selenium:1},b:{en:["Casein (slow protein)","Bone health","High protein low fat"],de:["Kasein","Knochengesundheit","Viel Protein wenig Fett"]}},
  {en:"Kefir",de:"Kefir",cat:"Dairy",v:{B12:3,B2:2,D:1,K:1},m:{Calcium:3,Phosphorus:2,Potassium:1},b:{en:["Most probiotic-rich dairy","Gut diversity","Immune modulation"],de:["Probiotikareinstes Milchprodukt","Darmflora","Immunmodulation"]}},
  {en:"Oat Milk",de:"Hafermilch",cat:"Dairy",v:{B2:2,B12:2,D:2,B1:1},m:{Calcium:2,Phosphorus:1,Potassium:1},b:{en:["Most popular plant milk","Beta-glucan (cholesterol)","Fortified B12 & D","Gut health"],de:["Beliebteste Pflanzenmilch","Beta-Glucan (Cholesterin)","Angereichert mit B12 & D","Darmgesundheit"]}},
  {en:"Soy Milk",de:"Sojamilch",cat:"Dairy",v:{B12:2,D:2,B2:1,B9:1},m:{Calcium:2,Phosphorus:2,Potassium:2},b:{en:["Only plant milk with complete protein","Fortified B12 & D","Heart health","Isoflavones"],de:["Einzige Pflanzenmilch mit komplettem Protein","Angereichert B12 & D","Herzgesundheit","Isoflavone"]}},
  {en:"Coconut Yogurt",de:"Kokosjoghurt",cat:"Dairy",v:{B12:1,D:1},m:{Calcium:1,Magnesium:2,Potassium:1},b:{en:["Probiotic dairy-free alternative","MCT fatty acids","Gut diversity","Lactose-free"],de:["Probiotische milchfreie Alternative","MCT-Fettsäuren","Darmflora","Laktosefrei"]}},
  {en:"Greek Yogurt",de:"Griechischer Joghurt",cat:"Dairy",v:{B12:2,B2:2,B5:1},m:{Calcium:3,Phosphorus:2,Zinc:1,Potassium:1},b:{en:["Probiotics","Bone health","High protein"],de:["Probiotika","Knochengesundheit","Hoher Proteingehalt"]}},
  {en:"Mackerel",de:"Makrele",cat:"Protein",v:{B12:3,D:3,B3:2,B6:1},m:{Selenium:3,Phosphorus:2,Potassium:2},b:{en:["Richest omega-3 fish","Anti-inflammatory","Brain health"],de:["Omega-3-reichster Fisch","Entzündungshemmend","Gehirngesundheit"]}},
  {en:"Oysters",de:"Austern",cat:"Protein",v:{B12:3,D:1},m:{Zinc:3,Selenium:3,Iron:3,Copper:3},b:{en:["Highest zinc food","Immune powerhouse","Heart health"],de:["Zinkreichstes Lebensmittel","Immunbooster","Herzgesundheit"]}},
  {en:"Spinach",de:"Spinat",cat:"Vegetable",v:{K:3,A:3,C:2,B9:3,E:2,B2:1},m:{Iron:2,Magnesium:2,Manganese:3},b:{en:["Antioxidant-rich","Bone health","Blood health"],de:["Antioxidantienreich","Knochengesundheit","Blutgesundheit"]}},
  {en:"Broccoli",de:"Brokkoli",cat:"Vegetable",v:{C:3,K:3,B9:2,A:1,B6:1},m:{Calcium:1,Potassium:1},b:{en:["Sulforaphane (cancer-protective)","Detox support","Immune boost"],de:["Sulforaphan","Entgiftung","Immunbooster"]}},
  {en:"Kale",de:"Grünkohl",cat:"Vegetable",v:{K:3,C:3,A:3,B9:2,E:1},m:{Calcium:2,Manganese:2,Potassium:1},b:{en:["Powerful antioxidants","Bone and heart health","Eye health"],de:["Starke Antioxidantien","Knochen- und Herzgesundheit","Augengesundheit"]}},
  {en:"Sweet Potato",de:"Süßkartoffel",cat:"Vegetable",v:{A:3,C:2,B6:2,B5:1},m:{Potassium:3,Manganese:2},b:{en:["Beta-carotene","Blood sugar regulation","Gut health"],de:["Beta-Carotin","Blutzuckerregulation","Darmgesundheit"]}},
  {en:"Carrot",de:"Karotte",cat:"Vegetable",v:{A:3,K:2,C:1,B6:1},m:{Potassium:1},b:{en:["Beta-carotene","Eye health","Antioxidant-rich"],de:["Beta-Carotin","Augengesundheit","Antioxidantienreich"]}},
  {en:"Garlic",de:"Knoblauch",cat:"Vegetable",v:{C:1,B6:2,B1:1},m:{Manganese:2,Selenium:1},b:{en:["Allicin (antimicrobial)","Immune powerhouse","Heart health"],de:["Allicin (antimikrobiell)","Immunbooster","Herzgesundheit"]}},
  {en:"Bell Pepper",de:"Paprika",cat:"Vegetable",v:{C:3,A:2,B6:2,E:1,K:1},m:{Potassium:1},b:{en:["Highest vitamin C veg","Antioxidant-rich","Eye health"],de:["Höchster Vitamin-C-Gehalt","Antioxidantienreich","Augengesundheit"]}},
  {en:"Tomato",de:"Tomate",cat:"Vegetable",v:{C:2,A:1,K:1,B9:1},m:{Potassium:2},b:{en:["Lycopene (heart health)","Antioxidant-rich","Skin health"],de:["Lycopin","Antioxidantienreich","Hautgesundheit"]}},
  {en:"Green Asparagus",de:"Grüner Spargel",cat:"Vegetable",v:{K:3,B9:3,C:2,A:1,E:1,B2:1},m:{Potassium:1,Iron:1},b:{en:["Prebiotic inulin","Folate powerhouse","Detox support","Anti-inflammatory"],de:["Präbiotisches Inulin","Folat-Kraftpaket","Entgiftung","Entzündungshemmend"]}},
  {en:"White Asparagus",de:"Weißer Spargel",cat:"Vegetable",v:{B9:2,C:1,K:1,B1:1},m:{Potassium:1},b:{en:["Gentle on digestion","Prebiotic fibre","Traditional detox vegetable","Low calorie"],de:["Bekömmlich für die Verdauung","Präbiotische Ballaststoffe","Traditionelles Entgiftungsgemüse","Kalorienarm"]}},
  {en:"Asparagus",de:"Spargel",cat:"Vegetable",v:{K:3,B9:3,C:1,A:1,E:1},m:{Potassium:1},b:{en:["Prebiotic inulin","Detox support","Anti-inflammatory"],de:["Präbiotisches Inulin","Entgiftung","Entzündungshemmend"]}},
  {en:"Beetroot",de:"Rote Bete",cat:"Vegetable",v:{B9:3,C:1,B6:1},m:{Potassium:2,Iron:1,Manganese:2},b:{en:["Nitrates (blood pressure & endurance)","Folate-rich","Liver detox support","Anti-inflammatory betalains"],de:["Nitrate (Blutdruck & Ausdauer)","Folat-reich","Leberentgiftung","Entzündungshemmende Betalaine"]}},
  {en:"Mushrooms",de:"Pilze",cat:"Vegetable",v:{D:2,B2:2,B3:2,B5:2,B9:1},m:{Selenium:2,Copper:2,Phosphorus:1},b:{en:["Only plant source of vitamin D","Beta-glucan (immune)","Gut health"],de:["Einzige Pflanzenquelle für Vitamin D","Beta-Glucan","Darmgesundheit"]}},
  {en:"Champignon",de:"Champignon",cat:"Vegetable",v:{D:2,B2:3,B3:3,B5:2,B9:1},m:{Selenium:2,Copper:2,Phosphorus:2,Potassium:1},b:{en:["Most common vitamin D mushroom","B-vitamin powerhouse","Immune support","Gut health"],de:["Häufigster Vitamin-D-Pilz","B-Vitamin-Kraftpaket","Immununterstützung","Darmgesundheit"]}},
  {en:"Zucchini",de:"Zucchini",cat:"Vegetable",v:{C:2,B6:2,K:1,B9:1,A:1},m:{Potassium:2,Manganese:1,Magnesium:1},b:{en:["Low calorie","Gut health","Blood sugar regulation","Antioxidant-rich"],de:["Kalorienarm","Darmgesundheit","Blutzuckerregulation","Antioxidantienreich"]}},
  {en:"Cucumber",de:"Gurke",cat:"Vegetable",v:{C:1,K:2,B9:1},m:{Potassium:1,Magnesium:1},b:{en:["Hydration (96% water)","Gut health","Anti-inflammatory","Low calorie"],de:["Hydration (96% Wasser)","Darmgesundheit","Entzündungshemmend","Kalorienarm"]}},
  {en:"Cauliflower",de:"Blumenkohl",cat:"Vegetable",v:{C:3,K:2,B9:3,B6:2,B5:1},m:{Potassium:1,Manganese:1,Phosphorus:1},b:{en:["Sulforaphane (cancer-protective)","Choline source","Gut health","Anti-inflammatory"],de:["Sulforaphan","Cholinquelle","Darmgesundheit","Entzündungshemmend"]}},
  {en:"Kohlrabi",de:"Kohlrabi",cat:"Vegetable",v:{C:3,B6:2,B9:1,K:1},m:{Potassium:2,Manganese:1},b:{en:["Vitamin C powerhouse","Gut health (fibre)","Blood sugar regulation","Anti-inflammatory"],de:["Vitamin-C-Kraftpaket","Darmgesundheit","Blutzuckerregulation","Entzündungshemmend"]}},
  {en:"Leek",de:"Lauch",cat:"Vegetable",v:{K:3,C:2,B9:2,A:2,B6:1},m:{Manganese:2,Iron:1,Potassium:1},b:{en:["Prebiotic inulin","Vitamin K powerhouse","Heart health","Allicin (antimicrobial)"],de:["Präbiotisches Inulin","Vitamin-K-Kraftpaket","Herzgesundheit","Allicin (antimikrobiell)"]}},
  {en:"Celery",de:"Sellerie",cat:"Vegetable",v:{K:3,C:1,B9:1,A:1},m:{Potassium:2,Manganese:1},b:{en:["Apigenin (anti-inflammatory)","Blood pressure support","Gut health","Hydration"],de:["Apigenin (entzündungshemmend)","Blutdruckunterstützung","Darmgesundheit","Hydration"]}},
  {en:"Onion",de:"Zwiebel",cat:"Vegetable",v:{C:2,B6:2,B9:1},m:{Potassium:1,Manganese:1},b:{en:["Quercetin (antioxidant)","Prebiotic inulin","Heart health","Antimicrobial"],de:["Quercetin (Antioxidans)","Präbiotisches Inulin","Herzgesundheit","Antimikrobiell"]}},
  {en:"Fennel",de:"Fenchel",cat:"Vegetable",v:{C:2,K:2,B9:2,B6:1},m:{Potassium:2,Manganese:2,Calcium:1,Iron:1},b:{en:["Anethole (anti-inflammatory)","Gut health","Digestive support","Bone health"],de:["Anethol (entzündungshemmend)","Darmgesundheit","Verdauungsunterstützung","Knochengesundheit"]}},
  {en:"Radish",de:"Radieschen",cat:"Vegetable",v:{C:2,B9:1,K:1},m:{Potassium:1},b:{en:["Liver detox","Gut health","Anti-inflammatory","Low calorie"],de:["Leberentgiftung","Darmgesundheit","Entzündungshemmend","Kalorienarm"]}},
  {en:"Corn",de:"Mais",cat:"Vegetable",v:{B1:2,B3:2,B9:2,C:1},m:{Phosphorus:2,Magnesium:1,Manganese:1,Potassium:1},b:{en:["Sustained energy","Lutein & zeaxanthin (eye health)","Gut health (fibre)","B-vitamins"],de:["Anhaltende Energie","Lutein & Zeaxanthin (Augengesundheit)","Darmgesundheit","B-Vitamine"]}},
  {en:"Olives",de:"Oliven",cat:"Fat/Oil",v:{E:2,K:1,A:1},m:{Iron:2,Copper:1},b:{en:["Oleocanthal (anti-inflammatory)","Heart health","Antioxidant-rich","Healthy monounsaturated fats"],de:["Oleocanthal (entzündungshemmend)","Herzgesundheit","Antioxidantienreich","Gesunde einfach ungesättigte Fette"]}},
  {en:"Sun-dried Tomatoes",de:"Getrocknete Tomaten",cat:"Vegetable",v:{C:2,A:2,K:1,B9:1},m:{Potassium:3,Iron:2,Manganese:1},b:{en:["Lycopene (heart health)","Concentrated antioxidants","Potassium-rich","Gut health"],de:["Lycopin (Herzgesundheit)","Konzentrierte Antioxidantien","Kaliumreich","Darmgesundheit"]}},
  {en:"Capers",de:"Kapern",cat:"Spice",v:{K:2,A:1,C:1},m:{Iron:1,Copper:1},b:{en:["Quercetin (antioxidant)","Antimicrobial","Liver detox","Anti-inflammatory"],de:["Quercetin (Antioxidans)","Antimikrobiell","Leberentgiftung","Entzündungshemmend"]}},
  {en:"Artichoke Hearts",de:"Artischockenherzen",cat:"Vegetable",v:{C:2,K:1,B9:3,B1:1},m:{Magnesium:2,Potassium:2,Iron:1,Phosphorus:2,Manganese:1},b:{en:["Prebiotic inulin","Liver detox (cynarin)","Gut health","Highest folate vegetable"],de:["Präbiotisches Inulin","Leberentgiftung (Cynarin)","Darmgesundheit","Folatreichstes Gemüse"]}},
  {en:"Croutons",de:"Croutons",cat:"SoulFood",v:{B1:1,B3:1},m:{Phosphorus:1},b:{en:["Quick energy","Satisfying crunch","Classic salad topping 🥗"],de:["Schnelle Energie","Befriedigender Crunch","Klassisches Salattopping 🥗"]}},
  {en:"Balsamic Vinegar",de:"Balsamico",cat:"Special",v:{},m:{Potassium:1,Manganese:1},b:{en:["Polyphenol antioxidants","Blood sugar regulation","Gut health (acetic acid)","Heart health"],de:["Polyphenol-Antioxidantien","Blutzuckerregulation","Darmgesundheit (Essigsäure)","Herzgesundheit"]}},
  {en:"Apple Cider Vinegar",de:"Apfelessig",cat:"Special",v:{},m:{Potassium:1},b:{en:["Blood sugar regulation","Gut health (acetic acid)","Antimicrobial","Digestive support"],de:["Blutzuckerregulation","Darmgesundheit (Essigsäure)","Antimikrobiell","Verdauungsunterstützung"]}},
  {en:"Pak Choi",de:"Pak Choi",cat:"Vegetable",v:{C:3,K:3,A:3,B9:2,B6:1},m:{Calcium:2,Potassium:1,Manganese:1},b:{en:["Calcium-rich leafy green","Sulforaphane (cancer-protective)","Eye health","Immune powerhouse"],de:["Kalziumreiche Blattgrüne","Sulforaphan","Augengesundheit","Immunbooster"]}},
  {en:"Iceberg Lettuce",de:"Eisbergsalat",cat:"Vegetable",v:{K:2,A:1,C:1,B9:1},m:{Potassium:1},b:{en:["Hydration (95% water)","Low calorie","Gut health","Antioxidant-rich"],de:["Hydration (95% Wasser)","Kalorienarm","Darmgesundheit","Antioxidantienreich"]}},
  {en:"Romaine Lettuce",de:"Römersalat",cat:"Vegetable",v:{K:3,A:3,C:2,B9:2,B1:1},m:{Potassium:2,Calcium:1,Manganese:1},b:{en:["Vitamin K powerhouse","Beta-carotene","Folate-rich","Eye health"],de:["Vitamin-K-Kraftpaket","Beta-Carotin","Folatreich","Augengesundheit"]}},
  {en:"Lamb's Lettuce",de:"Feldsalat",cat:"Vegetable",v:{C:3,A:3,K:2,B9:2,E:1},m:{Potassium:2,Iron:1,Manganese:1},b:{en:["Highest vitamin C of all lettuces","Beta-carotene","Iron source","Anti-inflammatory"],de:["Meistes Vitamin C aller Salate","Beta-Carotin","Eisenquelle","Entzündungshemmend"]}},
  {en:"Arugula",de:"Rucola",cat:"Vegetable",v:{K:3,A:2,C:2,B9:2,E:1},m:{Calcium:2,Potassium:1,Manganese:1,Iron:1},b:{en:["Glucosinolates (cancer-protective)","Calcium-rich leafy green","Antioxidant-rich","Digestive support"],de:["Glucosinolate","Kalziumreiche Blattgrüne","Antioxidantienreich","Verdauungsunterstützung"]}},
  {en:"Mixed Salad Leaves",de:"Blattsalat Mix",cat:"Vegetable",v:{K:2,A:2,C:1,B9:1},m:{Potassium:1,Iron:1},b:{en:["Antioxidant-rich","Low calorie","Gut health","Hydration"],de:["Antioxidantienreich","Kalorienarm","Darmgesundheit","Hydration"]}},
  {en:"Endive",de:"Endivie",cat:"Vegetable",v:{K:3,A:2,C:1,B9:2},m:{Potassium:1,Calcium:1,Manganese:1},b:{en:["Prebiotic inulin","Liver detox","Gut health","Bitter compounds (digestion)"],de:["Präbiotisches Inulin","Leberentgiftung","Darmgesundheit","Bitterstoffe (Verdauung)"]}},
  {en:"Radicchio",de:"Radicchio",cat:"Vegetable",v:{K:3,C:1,B9:1,E:1},m:{Potassium:1,Manganese:1},b:{en:["Anthocyanins (brain health)","Prebiotic inulin","Liver detox","Bitter compounds (digestion)"],de:["Anthocyane (Gehirngesundheit)","Präbiotisches Inulin","Leberentgiftung","Bitterstoffe (Verdauung)"]}},
  {en:"Spinach Leaves",de:"Babyspinat",cat:"Vegetable",v:{K:3,A:3,C:2,B9:3,E:2,B2:1},m:{Iron:2,Magnesium:2,Manganese:3},b:{en:["Antioxidant-rich","Bone health","Blood health","Iron powerhouse"],de:["Antioxidantienreich","Knochengesundheit","Blutgesundheit","Eisen-Kraftpaket"]}}, 
  {en:"Brussels Sprouts",de:"Rosenkohl",cat:"Vegetable",v:{K:3,C:3,B9:2,B6:1,A:1},m:{Potassium:1,Manganese:1},b:{en:["Glucosinolates","Gut health","Anti-inflammatory"],de:["Glucosinolate","Darmgesundheit","Entzündungshemmend"]}},
  {en:"Red Cabbage",de:"Rotkraut",cat:"Vegetable",v:{C:3,K:2,B6:2,A:1,B9:1},m:{Potassium:2,Manganese:1},b:{en:["Anthocyanins (brain health)","Highest vitamin C of all cabbages","Gut health","Anti-inflammatory"],de:["Anthocyane (Gehirngesundheit)","Meistes Vitamin C aller Kohlsorten","Darmgesundheit","Entzündungshemmend"]}},
  {en:"Sauerkraut",de:"Sauerkraut",cat:"Vegetable",v:{C:2,K:2,B9:1,B6:1},m:{Iron:1,Manganese:1,Potassium:1},b:{en:["Most probiotic-rich fermented vegetable","Gut diversity","Immune support","Vitamin C preserved by fermentation"],de:["Probiotikareiche Fermentierung","Darmflora","Immununterstützung","Vitamin C durch Fermentierung erhalten"]}},
  {en:"Potato",de:"Kartoffel",cat:"Vegetable",aliases:["Erdapfel","Erdäpfel"],v:{C:2,B6:3,B1:1,B3:1},m:{Potassium:3,Phosphorus:1,Magnesium:1,Iron:1},b:{en:["High potassium (more than banana)","Vitamin B6 & C","Resistant starch (gut health when cooled)","Sustained energy"],de:["Viel Kalium (mehr als Banane)","Vitamin B6 & C","Resistente Stärke (Darmgesundheit nach Kühlen)","Anhaltende Energie"]}},
  {en:"Banana",de:"Banane",cat:"Fruit",v:{B6:3,C:1,B5:1},m:{Potassium:3,Magnesium:1,Manganese:2},b:{en:["Potassium source","Muscle recovery","Mood support"],de:["Kaliumquelle","Muskelregeneration","Stimmungsunterstützung"]}},
  {en:"Blueberries",de:"Blaubeeren",cat:"Fruit",v:{C:2,K:2,E:1},m:{Manganese:2},b:{en:["Anthocyanins (brain health)","Highest antioxidant fruit","Memory support"],de:["Anthocyane","Stärkste Antioxidantien","Gedächtnisunterstützung"]}},
  {en:"Avocado",de:"Avocado",cat:"Fruit",v:{K:3,B9:3,C:2,E:2,B5:2,B6:2},m:{Potassium:3,Magnesium:1},b:{en:["Healthy fats","Boosts fat-soluble vitamin absorption","Heart health"],de:["Gesunde Fette","Verbessert Vitaminaufnahme","Herzgesundheit"]}},
  {en:"Orange",de:"Orange",cat:"Fruit",v:{C:3,B9:2,B1:1},m:{Potassium:1},b:{en:["Immune powerhouse","Enhances iron absorption","Skin health"],de:["Immunbooster","Verbessert Eisenaufnahme","Hautgesundheit"]}},
  {en:"Apple",de:"Apfel",cat:"Fruit",v:{C:1,K:1},m:{Potassium:1},b:{en:["Quercetin antioxidant","Gut health (pectin)","Heart health"],de:["Quercetin-Antioxidans","Darmgesundheit","Herzgesundheit"]}},
  {en:"Strawberries",de:"Erdbeeren",cat:"Fruit",v:{C:3,B9:1,K:1},m:{Manganese:1},b:{en:["Antioxidant-rich","Heart health","Anti-inflammatory"],de:["Antioxidantienreich","Herzgesundheit","Entzündungshemmend"]}},
  {en:"Mango",de:"Mango",cat:"Fruit",v:{C:3,A:3,B6:1,E:1,K:1},m:{Potassium:1},b:{en:["Beta-carotene","Immune support","Eye health"],de:["Beta-Carotin","Immununterstützung","Augengesundheit"]}},
  {en:"Kiwi",de:"Kiwi",cat:"Fruit",v:{C:3,K:3,E:1,B9:1},m:{Potassium:1},b:{en:["Vitamin C powerhouse","Sleep quality","Gut health"],de:["Vitamin-C-Kraftpaket","Schlafqualität","Darmgesundheit"]}},
  {en:"Pear",de:"Birne",cat:"Fruit",v:{C:1,K:2,B9:1},m:{Potassium:2,Copper:1},b:{en:["Quercetin antioxidant","Gut health (pectin)","Anti-inflammatory"],de:["Quercetin-Antioxidans","Darmgesundheit (Pektin)","Entzündungshemmend"]}},
  {en:"Lemon",de:"Zitrone",cat:"Fruit",v:{C:3,B6:1},m:{Potassium:1},b:{en:["Enhances iron absorption","Liver detox","Antioxidant-rich"],de:["Verbessert Eisenaufnahme","Leberentgiftung","Antioxidantienreich"]}},
  {en:"Lime",de:"Limette",cat:"Fruit",v:{C:3,B6:1,B9:1},m:{Potassium:1,Calcium:1},b:{en:["Vitamin C powerhouse","Enhances iron absorption","Liver detox","Antioxidant-rich"],de:["Vitamin-C-Kraftpaket","Verbessert Eisenaufnahme","Leberentgiftung","Antioxidantienreich"]}},
  {en:"Mandarin",de:"Mandarine",cat:"Fruit",v:{C:3,A:2,B1:1,B9:1},m:{Potassium:1,Calcium:1},b:{en:["Immune powerhouse","Beta-carotene","Skin health","Antioxidant-rich"],de:["Immunbooster","Beta-Carotin","Hautgesundheit","Antioxidantienreich"]}},
  {en:"Grapes",de:"Weintrauben",cat:"Fruit",v:{C:1,K:2,B6:1,B1:1},m:{Potassium:2,Manganese:1,Copper:1},b:{en:["Resveratrol (heart health)","Quercetin antioxidant","Gut health","Anti-inflammatory"],de:["Resveratrol (Herzgesundheit)","Quercetin-Antioxidans","Darmgesundheit","Entzündungshemmend"]}},
  {en:"Watermelon",de:"Wassermelone",cat:"Fruit",v:{C:2,A:2,B6:1,B5:1},m:{Potassium:2},b:{en:["Lycopene (heart health)","Hydration","Citrulline (muscle recovery)","Antioxidant-rich"],de:["Lycopin (Herzgesundheit)","Hydration","Citrullin (Muskelregeneration)","Antioxidantienreich"]}},
  {en:"Grapefruit",de:"Grapefruit",cat:"Fruit",v:{C:3,A:2,B9:1,B5:1},m:{Potassium:2},b:{en:["Immune powerhouse","Naringenin (fat metabolism)","Heart health","Liver detox"],de:["Immunbooster","Naringenin (Fettstoffwechsel)","Herzgesundheit","Leberentgiftung"]}},
  {en:"Plum",de:"Pflaume",cat:"Fruit",v:{C:1,K:2,A:1,B6:1},m:{Potassium:2,Manganese:1},b:{en:["Gut health (sorbitol)","Antioxidant-rich","Bone health","Blood sugar regulation"],de:["Darmgesundheit (Sorbitol)","Antioxidantienreich","Knochengesundheit","Blutzuckerregulation"]}},
  {en:"Peach",de:"Pfirsich",cat:"Fruit",v:{C:2,A:2,E:1,B3:1},m:{Potassium:2},b:{en:["Beta-carotene","Skin health","Gut health","Antioxidant-rich"],de:["Beta-Carotin","Hautgesundheit","Darmgesundheit","Antioxidantienreich"]}},
  {en:"Nectarine",de:"Nektarine",cat:"Fruit",v:{C:2,A:2,E:1,B3:1},m:{Potassium:2},b:{en:["Beta-carotene","Skin health","Immune support","Antioxidant-rich"],de:["Beta-Carotin","Hautgesundheit","Immununterstützung","Antioxidantienreich"]}},
  {en:"Raspberries",de:"Himbeeren",cat:"Fruit",v:{C:3,K:2,E:1,B9:1},m:{Manganese:2,Potassium:1},b:{en:["Highest fibre of all berries","Ellagic acid (anti-cancer)","Anti-inflammatory","Blood sugar regulation"],de:["Meiste Ballaststoffe aller Beeren","Ellagsäure","Entzündungshemmend","Blutzuckerregulation"]}},
  {en:"Blackberries",de:"Brombeeren",cat:"Fruit",v:{C:3,K:3,E:1,B9:1},m:{Manganese:2,Potassium:1,Copper:1},b:{en:["Anthocyanins (brain health)","Vitamin K powerhouse","Gut health","Anti-inflammatory"],de:["Anthocyane (Gehirngesundheit)","Vitamin-K-Kraftpaket","Darmgesundheit","Entzündungshemmend"]}},
  {en:"Fig",de:"Feige",cat:"Fruit",v:{B6:2,K:2,B1:1},m:{Potassium:2,Calcium:2,Magnesium:1,Manganese:1},b:{en:["Calcium-rich fruit","Prebiotic fibre","Gut health","Bone health"],de:["Kalziumreiches Obst","Präbiotische Ballaststoffe","Darmgesundheit","Knochengesundheit"]}},
  {en:"Pomegranate",de:"Granatapfel",cat:"Fruit",v:{C:2,K:2,B9:1,E:1},m:{Potassium:2,Manganese:1},b:{en:["Punicalagins (strongest antioxidant)","Heart health","Anti-inflammatory","Prostate health"],de:["Punicalagin (stärkstes Antioxidans)","Herzgesundheit","Entzündungshemmend","Prostatagesundheit"]}},
  {en:"Pineapple",de:"Ananas",cat:"Fruit",v:{C:3,B1:1,B6:1},m:{Manganese:3},b:{en:["Bromelain digestive enzyme","Anti-inflammatory","Immune support"],de:["Bromelain-Enzym","Entzündungshemmend","Immununterstützung"]}},
  {en:"Cherries",de:"Kirschen",cat:"Fruit",v:{C:1,A:1},m:{Potassium:1},b:{en:["Melatonin (sleep quality)","Reduces muscle soreness","Anti-inflammatory"],de:["Melatonin","Reduziert Muskelkater","Entzündungshemmend"]}},
  {en:"Brown Rice",de:"Vollkornreis",cat:"Grain",v:{B1:2,B3:2,B6:1},m:{Magnesium:2,Phosphorus:2,Manganese:3},b:{en:["Sustained energy","Gut health","Blood sugar regulation"],de:["Anhaltende Energie","Darmgesundheit","Blutzuckerregulation"]}},
  {en:"Oats",de:"Haferflocken",cat:"Grain",aliases:["Haferl","Porridge"],v:{B1:3,B5:1},m:{Manganese:3,Magnesium:2,Iron:2,Zinc:1},b:{en:["Beta-glucan (cholesterol)","Gut health","Sustained energy"],de:["Beta-Glucan","Darmgesundheit","Anhaltende Energie"]}},
  {en:"Quinoa",de:"Quinoa",cat:"Grain",v:{B1:2,B2:2,B9:2,E:1},m:{Magnesium:3,Phosphorus:2,Iron:2,Zinc:2,Manganese:3},b:{en:["Complete protein (9 amino acids)","Gluten-free","Blood sugar regulation"],de:["Vollständiges Protein","Glutenfrei","Blutzuckerregulation"]}},
  {en:"Millet",de:"Hirse",cat:"Grain",v:{B1:2,B3:2,B6:1,B9:1},m:{Magnesium:2,Phosphorus:2,Iron:2,Manganese:2,Zinc:1},b:{en:["Gluten-free grain","Blood sugar regulation","Sustained energy","Alkaline-forming"],de:["Glutenfreies Getreide","Blutzuckerregulation","Anhaltende Energie","Basisch wirkend"]}},
  {en:"Amaranth",de:"Amaranth",cat:"Grain",v:{B1:2,B2:1,B9:2,E:1},m:{Magnesium:3,Iron:3,Calcium:2,Phosphorus:2,Zinc:2,Manganese:2},b:{en:["Complete protein (rare for grain)","Highest iron of all grains","Gluten-free","Bone health"],de:["Vollständiges Protein (selten für Getreide)","Meistes Eisen aller Getreide","Glutenfrei","Knochengesundheit"]}},
  {en:"Wholegrain Roll",de:"Vollkornbrötchen",cat:"Grain",v:{B1:2,B3:2,B9:1,E:1},m:{Magnesium:2,Iron:2,Zinc:1,Manganese:2,Phosphorus:2},b:{en:["High fibre","Sustained energy","Gut health","B-vitamins"],de:["Ballaststoffreich","Anhaltende Energie","Darmgesundheit","B-Vitamine"]}},
  {en:"Spelt Bread",de:"Dinkelbrot",cat:"Grain",v:{B1:2,B3:2,B9:1,E:2},m:{Magnesium:2,Iron:2,Zinc:2,Phosphorus:2,Manganese:2},b:{en:["Ancient grain with high mineral content","Better digestibility than wheat","Sustained energy","Rich in fibre"],de:["Urkorn mit hohem Mineralgehalt","Besser verträglich als Weizen","Anhaltende Energie","Ballaststoffreich"]}},
  {en:"Spelt Roll",de:"Dinkelbrötchen",cat:"Grain",v:{B1:2,B3:2,E:1},m:{Magnesium:2,Iron:1,Zinc:1,Phosphorus:2},b:{en:["Ancient grain","Better digestibility than wheat","Sustained energy"],de:["Urkorn","Besser verträglich als Weizen","Anhaltende Energie"]}},
  {en:"Wheat Roll",de:"Weizenbrötchen",cat:"Grain",aliases:["Semmel","Weckerl","Weggli"],v:{B1:2,B3:1,B9:1},m:{Iron:1,Phosphorus:1},b:{en:["Quick energy","Enriched B-vitamins","Classic breakfast staple"],de:["Schnelle Energie","Angereicherte B-Vitamine","Klassisches Frühstück"]}},
  {en:"Wheat Pasta",de:"Weizennudeln",cat:"Grain",v:{B1:2,B3:2,B9:1},m:{Phosphorus:2,Manganese:1,Selenium:1},b:{en:["Sustained energy","B-vitamins","Serotonin-boosting comfort 🍝"],de:["Anhaltende Energie","B-Vitamine","Serotonin-Booster 🍝"]}},
  {en:"Spelt Pasta",de:"Dinkelnudeln",cat:"Grain",v:{B1:2,B3:2,B9:1,E:1},m:{Magnesium:2,Phosphorus:2,Iron:1,Zinc:1,Manganese:1},b:{en:["Ancient grain","Better digestibility than wheat","Sustained energy","Higher mineral content than wheat pasta"],de:["Urkorn","Besser verträglich als Weizen","Anhaltende Energie","Mehr Mineralstoffe als Weizennudeln"]}},
  {en:"Wholegrain Pasta",de:"Vollkornnudeln",cat:"Grain",v:{B1:3,B3:2,B9:2,E:1},m:{Magnesium:3,Iron:2,Zinc:2,Phosphorus:2,Manganese:3},b:{en:["High fibre","Sustained energy","Gut health","Blood sugar regulation","Rich in B-vitamins"],de:["Ballaststoffreich","Anhaltende Energie","Darmgesundheit","Blutzuckerregulation","Reich an B-Vitaminen"]}},
  {en:"Red Lentil Pasta",de:"Rote Linsen Nudeln",cat:"Legume",v:{B1:2,B9:3,B6:1},m:{Iron:3,Potassium:2,Phosphorus:2,Zinc:2,Magnesium:2,Manganese:2},b:{en:["High plant-based protein","Highest iron of all pasta","Gluten-free","Blood sugar regulation","Gut health"],de:["Viel pflanzliches Protein","Meistes Eisen aller Nudeln","Glutenfrei","Blutzuckerregulation","Darmgesundheit"]}},
  {en:"Peanuts",de:"Erdnüsse",cat:"Nut/Seed",v:{B3:3,B1:2,B6:1,E:2,B9:2},m:{Magnesium:2,Phosphorus:3,Zinc:1,Manganese:2},b:{en:["High protein nut","Niacin (B3) powerhouse","Resveratrol antioxidant","Heart health"],de:["Proteinreiche Nuss","Niacin (B3) Kraftpaket","Resveratrol-Antioxidans","Herzgesundheit"]}},
  {en:"Peanut Butter",de:"Erdnussbutter",cat:"Nut/Seed",v:{B3:3,B1:2,E:2,B6:1,B9:1},m:{Magnesium:2,Phosphorus:3,Zinc:1,Manganese:2},b:{en:["Protein & healthy fats","Niacin (B3) source","Sustained energy","Magnesium source"],de:["Protein & gesunde Fette","Niacin (B3) Quelle","Anhaltende Energie","Magnesiumquelle"]}},
  {en:"Cashews",de:"Cashews",cat:"Nut/Seed",v:{B1:1,B6:1,E:1,K:1},m:{Magnesium:3,Zinc:2,Iron:2,Phosphorus:2,Copper:2,Manganese:1},b:{en:["Copper & zinc rich","Magnesium source","Heart health","Plant-based iron"],de:["Kupfer & Zinkreich","Magnesiumquelle","Herzgesundheit","Pflanzliches Eisen"]}},
  {en:"Hazelnuts",de:"Haselnüsse",cat:"Nut/Seed",v:{E:3,B1:1,B6:1,B9:2},m:{Magnesium:2,Manganese:3,Copper:2,Phosphorus:1},b:{en:["Vitamin E powerhouse","Manganese rich","Heart health","Antioxidant-rich"],de:["Vitamin-E-Kraftpaket","Manganreich","Herzgesundheit","Antioxidantienreich"]}},
  {en:"Macadamia Nuts",de:"Macadamia-Nüsse",cat:"Nut/Seed",v:{B1:2,B6:1,E:1},m:{Magnesium:2,Manganese:3,Phosphorus:1},b:{en:["Highest monounsaturated fat nut","Palmitoleic acid (metabolism)","Heart health","Manganese rich"],de:["Meiste einfach ungesättigte Fette","Palmitoleinsäure (Stoffwechsel)","Herzgesundheit","Manganreich"]}},
  {en:"Brazil Nuts",de:"Paranüsse",cat:"Nut/Seed",v:{E:2,B1:2},m:{Selenium:3,Magnesium:2,Phosphorus:2,Zinc:1,Copper:1},b:{en:["Richest selenium food (1–2 nuts = daily need)","Thyroid support","Antioxidant defense","Magnesium source"],de:["Selenreichstes Lebensmittel (1–2 Nüsse = Tagesbedarf)","Schilddrüsenunterstützung","Antioxidativer Schutz","Magnesiumquelle"]}},
  {en:"Pine Nuts",de:"Pinienkerne",cat:"Nut/Seed",v:{E:2,K:1,B1:1},m:{Magnesium:2,Zinc:2,Iron:1,Phosphorus:2,Manganese:3},b:{en:["Pinolenic acid (appetite control)","Zinc & manganese rich","Vitamin E source","Heart health"],de:["Pinolensäure (Appetitregulation)","Zink & Manganreich","Vitamin-E-Quelle","Herzgesundheit"]}},
  {en:"Pecans",de:"Pekannüsse",cat:"Nut/Seed",v:{E:1,B1:1},m:{Manganese:3,Zinc:1,Magnesium:1,Copper:1},b:{en:["Highest antioxidant nut","Manganese rich","Heart health","Brain health"],de:["Antioxidantienreichste Nuss","Manganreich","Herzgesundheit","Gehirngesundheit"]}},
  {en:"Black Beans",de:"Schwarze Bohnen",cat:"Legume",v:{B9:3,B1:2,B6:1},m:{Iron:2,Magnesium:2,Phosphorus:2,Potassium:2,Zinc:1,Manganese:2},b:{en:["Plant-based iron","Anthocyanins (antioxidants)","Gut health (prebiotic)","Heart health"],de:["Pflanzliches Eisen","Anthocyane (Antioxidantien)","Darmgesundheit","Herzgesundheit"]}},
  {en:"Kidney Beans",de:"Kidneybohnen",cat:"Legume",v:{B9:3,B1:2,B6:1},m:{Iron:3,Phosphorus:2,Potassium:2,Zinc:1,Manganese:2},b:{en:["High plant-based iron","Protein & fibre","Gut health","Blood sugar regulation"],de:["Viel pflanzliches Eisen","Protein & Ballaststoffe","Darmgesundheit","Blutzuckerregulation"]}},
  {en:"Edamame",de:"Edamame",cat:"Legume",v:{B9:3,K:2,C:1,B1:1},m:{Iron:2,Phosphorus:2,Magnesium:1,Manganese:1,Zinc:1},b:{en:["Complete plant protein","Isoflavones (hormonal balance)","Folate-rich","Heart health"],de:["Vollständiges Pflanzenprotein","Isoflavone (Hormonbalance)","Folatreich","Herzgesundheit"]}},
  {en:"Green Peas",de:"Erbsen",cat:"Legume",v:{B9:2,C:2,B1:2,K:1,A:1},m:{Iron:1,Phosphorus:1,Manganese:1,Zinc:1},b:{en:["Plant-based protein","Vitamin C & folate","Gut health (fibre)","Anti-inflammatory"],de:["Pflanzliches Protein","Vitamin C & Folat","Darmgesundheit (Ballaststoffe)","Entzündungshemmend"]}},
  {en:"Green Beans",de:"Grüne Bohnen",cat:"Legume",v:{C:2,K:3,B9:2,A:1,B6:1},m:{Manganese:1,Potassium:1,Iron:1},b:{en:["Vitamin K powerhouse","Gut health (fibre)","Anti-inflammatory","Low calorie"],de:["Vitamin-K-Kraftpaket","Darmgesundheit","Entzündungshemmend","Kalorienarm"]}},
  {en:"Soybeans",de:"Sojabohnen",cat:"Legume",v:{B9:2,B1:2,K:2,C:1},m:{Iron:3,Phosphorus:3,Magnesium:2,Zinc:2,Manganese:2,Calcium:1},b:{en:["Complete plant protein","Highest plant iron","Isoflavones","Bone health"],de:["Vollständiges Pflanzenprotein","Höchstes pflanzliches Eisen","Isoflavone","Knochengesundheit"]}},
  {en:"Tofu",de:"Tofu",cat:"Protein",v:{B1:1,B2:1,E:1},m:{Calcium:3,Iron:2,Magnesium:2,Phosphorus:2,Zinc:1,Manganese:1},b:{en:["Complete plant protein","Highest calcium of all plant foods","Iron & Zinc boost","Isoflavones (hormonal balance)"],de:["Vollständiges Pflanzenprotein","Meistes Kalzium aller Pflanzenlebensmittel","Eisen & Zink","Isoflavone (Hormonbalance)"]}},
  {en:"Tempeh",de:"Tempeh",cat:"Protein",v:{B2:2,B3:2,B6:1,B12:1},m:{Calcium:2,Iron:2,Magnesium:2,Phosphorus:3,Zinc:2,Manganese:2},b:{en:["Fermented complete protein","Most bioavailable plant protein","Probiotics (fermented)","Gut health"],de:["Fermentiertes Vollprotein","Bioverfügbarstes Pflanzenprotein","Probiotika (fermentiert)","Darmgesundheit"]}},
  {en:"Lentils",de:"Linsen",cat:"Legume",v:{B9:3,B1:2,B6:1},m:{Iron:3,Phosphorus:2,Potassium:2,Zinc:1,Manganese:2},b:{en:["Plant-based iron","Gut health","Heart health"],de:["Pflanzliches Eisen","Darmgesundheit","Herzgesundheit"]}},
  {en:"Chickpeas",de:"Kichererbsen",cat:"Legume",v:{B9:3,B6:2,B1:1},m:{Iron:2,Phosphorus:2,Manganese:2,Zinc:1},b:{en:["Plant-based protein","Gut health (prebiotic)","Heart health"],de:["Pflanzliches Protein","Darmgesundheit","Herzgesundheit"]}},
  {en:"Almonds",de:"Mandeln",cat:"Nut/Seed",v:{E:3,B2:2,B3:1},m:{Magnesium:3,Calcium:2,Phosphorus:2,Zinc:1},b:{en:["Vitamin E powerhouse","Bone health","Heart health"],de:["Vitamin-E-Kraftpaket","Knochengesundheit","Herzgesundheit"]}},
  {en:"Walnuts",de:"Walnüsse",cat:"Nut/Seed",v:{B6:1,E:1},m:{Magnesium:2,Phosphorus:2,Manganese:2},b:{en:["ALA omega-3","Brain health","Anti-inflammatory"],de:["ALA Omega-3","Gehirngesundheit","Entzündungshemmend"]}},
  {en:"Chia Seeds",de:"Chiasamen",cat:"Nut/Seed",v:{B1:1},m:{Calcium:3,Magnesium:3,Phosphorus:2,Iron:2},b:{en:["ALA omega-3","Bone health","Gut health (gel fiber)"],de:["ALA Omega-3","Knochengesundheit","Darmgesundheit"]}},
  {en:"Sesame Seeds",de:"Sesam",cat:"Nut/Seed",v:{B1:2,B6:1,E:1},m:{Calcium:3,Iron:3,Magnesium:2,Phosphorus:2,Zinc:2,Manganese:3,Copper:2},b:{en:["Highest calcium of all seeds","Sesamin (anti-inflammatory)","Iron powerhouse","Bone health"],de:["Meistes Kalzium aller Samen","Sesamin (entzündungshemmend)","Eisen-Kraftpaket","Knochengesundheit"]}},
  {en:"Tahini",de:"Tahini",cat:"Nut/Seed",v:{B1:2,B6:1,E:2},m:{Calcium:3,Iron:2,Magnesium:2,Phosphorus:2,Zinc:1,Copper:2,Manganese:2},b:{en:["Calcium-rich plant spread","Complete amino acid profile","Heart health","Bone health"],de:["Kalziumreicher Pflanzenaufstrich","Vollständiges Aminosäureprofil","Herzgesundheit","Knochengesundheit"]}},
  {en:"Flaxseeds",de:"Leinsamen",cat:"Nut/Seed",v:{B1:2,B6:1,E:1},m:{Magnesium:2,Phosphorus:2,Iron:1,Manganese:3},b:{en:["Richest ALA omega-3 plant source","Lignans (hormonal balance)","Gut health (mucilage fibre)","Anti-inflammatory"],de:["Reichste ALA Omega-3 Pflanzenquelle","Lignane (Hormonbalance)","Darmgesundheit (Schleimballaststoffe)","Entzündungshemmend"]}},
  {en:"Sunflower Seeds",de:"Sonnenblumenkerne",cat:"Nut/Seed",v:{E:3,B1:2,B6:1,B9:1},m:{Selenium:3,Magnesium:2,Phosphorus:2,Zinc:1},b:{en:["Vitamin E and selenium","Anti-inflammatory","Immune support"],de:["Vitamin E und Selen","Entzündungshemmend","Immununterstützung"]}},
  {en:"Pumpkin Seeds",de:"Kürbiskerne",cat:"Nut/Seed",v:{K:1,E:1},m:{Zinc:3,Magnesium:3,Iron:2,Phosphorus:2},b:{en:["Highest zinc source","Prostate health","Sleep (tryptophan)"],de:["Reichste Zinkquelle","Prostatagesundheit","Schlaf (Tryptophan)"]}},
  {en:"Olive Oil",de:"Olivenöl",cat:"Fat/Oil",v:{E:3,K:2},m:{},b:{en:["Oleocanthal (anti-inflammatory)","Heart health","Fat-soluble vitamin absorption"],de:["Oleocanthal","Herzgesundheit","Fettlösliche Vitaminaufnahme"]}},
  {en:"Coconut Oil",de:"Kokosöl",cat:"Fat/Oil",v:{E:1,K:1},m:{Iron:1},b:{en:["MCT fatty acids","Lauric acid (antimicrobial)","Brain energy (ketones)"],de:["MCT-Fettsäuren","Laurinsäure (antimikrobiell)","Gehirnenergie (Ketone)"]}},
  {en:"Turmeric",de:"Kurkuma",cat:"Spice",v:{B6:1,C:1},m:{Iron:1,Manganese:2},b:{en:["Curcumin (anti-inflammatory)","Joint health","Enhanced by black pepper"],de:["Curcumin","Gelenkgesundheit","Durch schwarzen Pfeffer verstärkt"]}},
  {en:"Black Pepper",de:"Schwarzer Pfeffer",cat:"Spice",v:{K:1,C:1},m:{Manganese:1,Iron:1},b:{en:["Piperine enhances absorption","Boosts curcumin by 2000%","Digestive support"],de:["Piperin steigert Aufnahme","Steigert Curcumin um 2000%","Verdauungsunterstützung"]}},
  {en:"Ginger",de:"Ingwer",cat:"Spice",v:{B6:1,C:1},m:{Magnesium:1,Potassium:1},b:{en:["Gingerols (anti-nausea)","Anti-inflammatory","Reduces muscle soreness"],de:["Gingerole","Entzündungshemmend","Reduziert Muskelkater"]}},
  {en:"Cinnamon",de:"Zimt",cat:"Spice",v:{K:1},m:{Manganese:3,Calcium:1,Iron:1},b:{en:["Blood sugar regulation","Anti-inflammatory","Antioxidant-rich"],de:["Blutzuckerregulation","Entzündungshemmend","Antioxidantienreich"]}},
  {en:"Cayenne Pepper",de:"Cayennepfeffer",cat:"Spice",v:{A:2,C:2,E:1},m:{Potassium:1},b:{en:["Capsaicin (metabolism boost)","Pain relief","Enhances absorption"],de:["Capsaicin","Schmerzlinderung","Verbessert Aufnahme"]}},
  {en:"Oregano",de:"Oregano",cat:"Spice",v:{K:3,E:1},m:{Iron:2,Calcium:2,Manganese:2},b:{en:["Carvacrol (antimicrobial)","Powerful antioxidant","Immune support"],de:["Carvacrol","Starkes Antioxidans","Immununterstützung"]}},
  {en:"Paprika",de:"Paprikapulver",cat:"Spice",v:{A:3,C:2,E:2,B6:1},m:{Iron:1,Potassium:1},b:{en:["Capsanthin antioxidant","Eye health","Immune support"],de:["Capsanthin-Antioxidans","Augengesundheit","Immununterstützung"]}},
  {en:"Cocoa (Raw)",de:"Rohkakao",cat:"Special",v:{B2:1,E:1},m:{Magnesium:3,Iron:3,Zinc:2,Copper:3,Manganese:3},b:{en:["Flavanols (heart health)","Theobromine (mood)","Highest magnesium food"],de:["Flavanole","Theobromin","Magnesiumreichstes Lebensmittel"]}},
  {en:"Dark Chocolate (85%+)",de:"Dunkle Schokolade (85%+)",cat:"Special",v:{B2:1,E:1,K:1},m:{Magnesium:3,Iron:2,Zinc:2,Copper:2,Manganese:2},b:{en:["Flavanols (heart health)","Brain health","Mood enhancement"],de:["Flavanole","Gehirngesundheit","Stimmungsverbesserung"]}},
  {en:"Green Tea",de:"Grüner Tee",cat:"Special",v:{C:1,K:1},m:{Manganese:1},b:{en:["EGCG (powerful antioxidant)","L-theanine (calm focus)","Brain health"],de:["EGCG","L-Theanin","Gehirngesundheit"]}},
  {en:"Nutritional Yeast",de:"Nährhefe",cat:"Special",v:{B12:3,B1:3,B2:3,B3:3,B6:3,B9:2},m:{Zinc:2,Selenium:2,Iron:1,Phosphorus:2},b:{en:["Most complete B-vitamin source","Only vegan B12 food (fortified)","Complete protein","Immune support"],de:["Vollständigste B-Vitamin-Quelle","Einzige vegane B12-Quelle (angereichert)","Vollständiges Protein","Immununterstützung"]}},
  {en:"Honey (Raw)",de:"Roher Honig",cat:"Special",v:{B2:1,B3:1,B6:1,C:1},m:{Potassium:1,Calcium:1},b:{en:["Antimicrobial","Prebiotic","Antioxidant-rich"],de:["Antimikrobiell","Präbiotikum","Antioxidantienreich"]}},
  {en:"Bone Broth",de:"Knochenbrühe",cat:"Special",v:{A:1,K:1},m:{Calcium:2,Magnesium:1,Phosphorus:2},b:{en:["Collagen precursors","Gut lining repair","Electrolyte replenishment"],de:["Kollagenvorstufen","Darmschleimsanierung","Elektrolytauffüllung"]}},
  {en:"Coconut",de:"Kokos",cat:"Special",v:{B1:1,B5:1,C:1},m:{Magnesium:2,Potassium:2,Manganese:3,Iron:1},b:{en:["MCT fatty acids (quick energy)","Gut health","Antifungal (lauric acid)"],de:["MCT-Fettsäuren (schnelle Energie)","Darmgesundheit","Antimykotisch (Laurinsäure)"]}},
  {en:"Coconut Milk",de:"Kokosmilch",cat:"Special",v:{B1:1,B5:1,C:1},m:{Magnesium:2,Potassium:2,Iron:2,Manganese:2},b:{en:["MCT fatty acids","Dairy-free fat source","Anti-inflammatory"],de:["MCT-Fettsäuren","Milchfreie Fettquelle","Entzündungshemmend"]}},
  {en:"Mozzarella",de:"Mozzarella",cat:"Dairy",v:{B12:2,B2:2,A:1,D:1},m:{Calcium:3,Phosphorus:3,Selenium:1,Zinc:2},b:{en:["High calcium","Complete protein","Bone health"],de:["Viel Kalzium","Vollständiges Protein","Knochengesundheit"]}},
  {en:"Gouda",de:"Gouda",cat:"Dairy",v:{B12:3,A:2,B2:2,K:2,D:1},m:{Calcium:3,Phosphorus:3,Zinc:2,Selenium:1},b:{en:["Vitamin K2 (bone health)","High calcium","Probiotic cultures"],de:["Vitamin K2 (Knochen)","Viel Kalzium","Probiotische Kulturen"]}},
  {en:"Camembert",de:"Camembert",cat:"Dairy",v:{B12:2,A:2,B2:2,D:1,K:2},m:{Calcium:2,Phosphorus:2,Zinc:1,Selenium:1},b:{en:["Probiotic mold cultures","Bone health","Brain health (choline)"],de:["Probiotische Schimmelkulturen","Knochengesundheit","Gehirngesundheit (Cholin)"]}},
  {en:"Parmesan",de:"Parmesan",cat:"Dairy",v:{B12:3,A:2,B2:2,K:2},m:{Calcium:3,Phosphorus:3,Zinc:2,Selenium:2},b:{en:["Highest calcium of all cheeses","Umami (glutamates)","Complete protein"],de:["Meistes Kalzium aller Käsesorten","Umami (Glutamate)","Vollständiges Protein"]}},
  {en:"Cottage Cheese",de:"Hüttenkäse",cat:"Dairy",v:{B12:2,B2:2,B5:1},m:{Calcium:2,Phosphorus:2,Selenium:2,Zinc:1},b:{en:["Very high protein, low fat","Casein (slow-release protein)","Gut health"],de:["Sehr viel Protein, wenig Fett","Kasein (langsames Protein)","Darmgesundheit"]}},
  {en:"Cheddar",de:"Cheddar",cat:"Dairy",v:{B12:3,A:2,B2:2,K:2,D:1},m:{Calcium:3,Phosphorus:3,Zinc:2,Selenium:1},b:{en:["Dense calcium source","Vitamin K2 (bone health)","High bioavailable protein"],de:["Kalziumreich","Vitamin K2 (Knochengesundheit)","Bioverfügbares Protein"]}},
  {en:"Feta",de:"Feta",cat:"Dairy",v:{B12:2,B2:2,A:1},m:{Calcium:2,Phosphorus:2,Zinc:1,Selenium:1},b:{en:["Lower calories than hard cheeses","CLA fatty acids","Gut-friendly (sheep/goat milk)"],de:["Weniger Kalorien als Hartkäse","CLA-Fettsäuren","Darmfreundlich (Schaf/Ziegenmilch)"]}},
  {en:"Brie",de:"Brie",cat:"Dairy",v:{B12:2,A:2,B2:1,K:2,D:1},m:{Calcium:2,Phosphorus:2,Zinc:1},b:{en:["Probiotic mold rind","Vitamin K2 (bone health)","Good fat profile"],de:["Probiotische Schimmelrinde","Vitamin K2 (Knochengesundheit)","Gutes Fettprofil"]}},
  {en:"Emmental",de:"Emmentaler",cat:"Dairy",v:{B12:3,A:2,B2:2,K:2,D:1},m:{Calcium:3,Phosphorus:3,Zinc:2,Selenium:1},b:{en:["Very high calcium","Vitamin K2 (bone health)","Probiotic cultures"],de:["Sehr viel Kalzium","Vitamin K2 (Knochengesundheit)","Probiotische Kulturen"]}},
  {en:"Burger",de:"Burger",cat:"SoulFood",v:{B12:2,B3:2,B6:1,B2:1},m:{Zinc:2,Iron:2,Phosphorus:2,Selenium:1},b:{en:["Protein hit","Iron & Zinc boost","B12 from beef","Joy and satisfaction 🍔"],de:["Protein-Schub","Eisen & Zink","B12 aus Rindfleisch","Freude und Genuss 🍔"]}},
  {en:"Fries",de:"Pommes",cat:"SoulFood",v:{B6:2,C:1,B3:1},m:{Potassium:2,Magnesium:1},b:{en:["Potassium source","Comfort energy","Happiness guaranteed 🍟"],de:["Kaliumquelle","Comfort-Energie","Glück garantiert 🍟"]}},
  {en:"Pizza",de:"Pizza",cat:"SoulFood",v:{B12:1,B2:1,A:1},m:{Calcium:2,Phosphorus:1,Selenium:1},b:{en:["Calcium from cheese","Protein from toppings","The ultimate comfort food 🍕"],de:["Kalzium aus Käse","Protein aus Belag","Das ultimative Soulfood 🍕"]}},
  {en:"Hotdog",de:"Hotdog",cat:"SoulFood",v:{B12:2,B3:1,B6:1},m:{Phosphorus:1,Zinc:1,Selenium:1},b:{en:["Quick protein","B12 from meat","Classic comfort 🌭"],de:["Schnelles Protein","B12 aus Fleisch","Klassischer Genuss 🌭"]}},
  {en:"Doner Kebab",de:"Döner",cat:"SoulFood",v:{B12:2,B3:2,B6:2,A:1},m:{Iron:2,Zinc:2,Phosphorus:2,Selenium:1},b:{en:["High protein","Iron & Zinc","B-vitamins from meat","Veggies & herbs bonus 🥙"],de:["Viel Protein","Eisen & Zink","B-Vitamine aus Fleisch","Gemüse & Kräuter Bonus 🥙"]}},
  {en:"Pasta",de:"Pasta",cat:"SoulFood",v:{B1:2,B3:1,B9:1},m:{Phosphorus:1,Manganese:1},b:{en:["Sustained energy","B-vitamins","Serotonin-boosting comfort 🍝"],de:["Anhaltende Energie","B-Vitamine","Serotonin-Booster 🍝"]}},
  {en:"White Bread",de:"Weißbrot",cat:"SoulFood",v:{B1:2,B3:1,B9:1,B2:1},m:{Phosphorus:1,Calcium:1},b:{en:["Quick energy","Enriched B-vitamins","Simple pleasure 🍞"],de:["Schnelle Energie","Angereicherte B-Vitamine","Einfacher Genuss 🍞"]}},
  {en:"Pancakes",de:"Pfannkuchen",cat:"SoulFood",v:{B2:2,B12:1,D:1,A:1},m:{Calcium:2,Phosphorus:1,Selenium:1},b:{en:["Calcium from milk & eggs","B2 from dairy","Weekend morning vibes 🥞"],de:["Kalzium aus Milch & Eiern","B2 aus Milchprodukten","Wochenendmorgen-Feeling 🥞"]}},
  {en:"Mac and Cheese",de:"Mac and Cheese",cat:"SoulFood",v:{B12:2,B2:2,A:1},m:{Calcium:2,Phosphorus:2,Selenium:1},b:{en:["Calcium & protein from cheese","B12 boost","Ultimate comfort bowl 🧀"],de:["Kalzium & Protein aus Käse","B12-Schub","Ultimative Wohltat 🧀"]}},
  {en:"Ice Cream",de:"Eis",cat:"SoulFood",v:{B12:2,B2:2,A:1,D:1},m:{Calcium:2,Phosphorus:1},b:{en:["Calcium & B12 from dairy","Quick mood boost","Life is sweet 🍦"],de:["Kalzium & B12 aus Milch","Schnelle Stimmungsaufhellung","Das Leben ist süß 🍦"]}},
  {en:"Milk Chocolate",de:"Vollmilchschokolade",cat:"SoulFood",v:{B2:1,B12:1,A:1},m:{Calcium:1,Magnesium:1,Phosphorus:1},b:{en:["Calcium from milk","Magnesium trace","Mood-lifting endorphins 🍫"],de:["Kalzium aus Milch","Magnesium-Spur","Stimmungsbooster 🍫"]}},
  {en:"Potato Chips",de:"Chips",cat:"SoulFood",v:{B6:1,C:1},m:{Potassium:1},b:{en:["Potassium trace","Crunch therapy 🥔","No judgment zone"],de:["Kalium-Spur","Knusper-Therapie 🥔","Urteilsfreie Zone"]}},
  {en:"Cookies",de:"Kekse",cat:"SoulFood",v:{B1:1,B2:1},m:{Calcium:1},b:{en:["Small calcium hit","Pure joy 🍪"],de:["Etwas Kalzium","Purer Genuss 🍪"]}},
  {en:"Sushi",de:"Sushi",cat:"SoulFood",v:{B12:3,D:2,B3:2,B6:1,E:1},m:{Selenium:3,Phosphorus:2,Potassium:1},b:{en:["Omega-3 from fish","High B12","One of the healthiest Soul Foods 🍣"],de:["Omega-3 aus Fisch","Viel B12","Eines der gesündesten Soulfoods 🍣"]}},
  {en:"Ramen",de:"Ramen",cat:"SoulFood",v:{B1:1,B3:1,B12:1},m:{Phosphorus:1,Potassium:1},b:{en:["Warming comfort","Protein from egg & meat topping","Broth electrolytes 🍜"],de:["Wohltuende Wärme","Protein aus Ei & Fleisch","Elektrolyte aus Brühe 🍜"]}},
  {en:"Tacos",de:"Tacos",cat:"SoulFood",v:{B12:2,B3:2,B6:1,A:1,C:1},m:{Calcium:1,Iron:1,Zinc:1,Phosphorus:1},b:{en:["Protein from meat","Calcium from cheese","Fiesta for your body 🌮"],de:["Protein aus Fleisch","Kalzium aus Käse","Fiesta für deinen Körper 🌮"]}},
  {en:"Fried Rice",de:"Gebratener Reis",cat:"SoulFood",v:{B1:2,B3:1,B6:1,B12:1},m:{Phosphorus:1,Manganese:2,Iron:1},b:{en:["B-vitamins from egg & veg","Satisfying comfort meal 🍚"],de:["B-Vitamine aus Ei & Gemüse","Sättigendes Soulfood 🍚"]}},
  {en:"Jam",de:"Marmelade",cat:"SoulFood",v:{C:1},m:{Potassium:1},b:{en:["Trace vitamin C (from fruit)","Fruit polyphenols (small amounts)","Pure joy on toast 🍓"],de:["Etwas Vitamin C (aus Früchten)","Frucht-Polyphenole (kleine Mengen)","Purer Genuss auf Toast 🍓"]}},
  {en:"Nutella",de:"Nutella",cat:"SoulFood",v:{E:1,B2:1},m:{Calcium:1,Magnesium:1,Iron:1},b:{en:["Trace calcium & iron from hazelnuts","Hazelnut antioxidants (small amounts)","Mood booster 🍫","Childhood in a jar"],de:["Etwas Kalzium & Eisen aus Haselnüssen","Haselnuss-Antioxidantien (kleine Mengen)","Stimmungsbooster 🍫","Kindheit im Glas"]}},
  {en:"Peanut Butter (Spread)",de:"Erdnussbutter (Aufstrich)",cat:"SoulFood",v:{B3:2,E:1,B1:1},m:{Magnesium:1,Phosphorus:1,Zinc:1},b:{en:["Protein hit","Niacin source","Healthy fats","Classic comfort spread 🥜"],de:["Protein-Schub","Niacin-Quelle","Gesunde Fette","Klassischer Aufstrich 🥜"]}},
  {en:"Butter",de:"Butter",cat:"SoulFood",aliases:["Schmalz"],v:{A:2,D:1,E:1,K:2},m:{Calcium:1},b:{en:["Vitamin A & K2","Fat-soluble vitamin carrier","Butyric acid (gut health)","Comfort classic 🧈"],de:["Vitamin A & K2","Fettlöslicher Vitaminträger","Buttersäure (Darmgesundheit)","Comfort-Klassiker 🧈"]}},
  {en:"Cream Cheese",de:"Frischkäse",cat:"SoulFood",aliases:["Topfen","Quark"],v:{A:2,B12:1,B2:1},m:{Calcium:2,Phosphorus:1},b:{en:["Calcium from dairy","Vitamin A source","Spreadable protein","Bagel's best friend 🥯"],de:["Kalzium aus Milch","Vitamin-A-Quelle","Streichbares Protein","Bagel's bester Freund 🥯"]}},
  {en:"Hummus",de:"Hummus",cat:"SoulFood",v:{B9:2,B6:1,B1:1,E:1},m:{Iron:1,Phosphorus:1,Manganese:1,Magnesium:1},b:{en:["Plant-based protein (chickpeas + tahini)","Folate-rich","Prebiotic fibre","Healthy snack upgrade 🫘"],de:["Pflanzliches Protein (Kichererbsen + Tahini)","Folatreich","Präbiotische Ballaststoffe","Gesundes Snack-Upgrade 🫘"]}},
  {en:"Beef Steak",de:"Rumpsteak",cat:"Protein",aliases:["Entrecôte","Filetsteak","Steak","Rindersteak"],v:{B12:3,B3:3,B6:2,B2:1},m:{Zinc:3,Iron:3,Selenium:2,Phosphorus:3},b:{en:["Most complete amino acid profile","Highly bioavailable haem iron","Zinc powerhouse","CLA fatty acids"],de:["Vollständigstes Aminosäureprofil","Hochbioverfügbares Häm-Eisen","Zink-Kraftpaket","CLA-Fettsäuren"]}},
  {en:"Pork Neck Steak",de:"Nackensteak",cat:"Protein",aliases:["Schweinekamm","Nackenkoteletts"],v:{B1:3,B3:2,B12:2,B6:2},m:{Zinc:2,Phosphorus:2,Selenium:2,Iron:1},b:{en:["Richest meat source of vitamin B1","Complete protein","Zinc & selenium","Well-marbled for juiciness"],de:["Fleischreichste B1-Quelle","Vollständiges Protein","Zink & Selen","Gut marmoriert & saftig"]}},
  {en:"Pork Ribs",de:"Spareribs",cat:"SoulFood",v:{B1:2,B3:2,B12:2,B6:1},m:{Zinc:2,Phosphorus:2,Selenium:1,Iron:1},b:{en:["Complete protein","Vitamin B1 & B12","Zinc source","BBQ classic 🍖"],de:["Vollständiges Protein","Vitamin B1 & B12","Zinkquelle","BBQ-Klassiker 🍖"]}},
  {en:"Bratwurst",de:"Bratwurst",cat:"SoulFood",v:{B12:2,B1:2,B3:2,B6:1},m:{Zinc:2,Selenium:1,Phosphorus:2,Iron:1},b:{en:["Protein & B12 from pork","Zinc & selenium boost","German BBQ staple","Joy on a stick 🌭"],de:["Protein & B12 aus Schweinefleisch","Zink & Selen-Schub","Deutsches Grillklassiker","Freude am Stiel 🌭"]}},
  {en:"Lamb Chops",de:"Lammkotelett",cat:"Protein",v:{B12:3,B3:2,B6:2,B2:1},m:{Zinc:3,Iron:2,Selenium:2,Phosphorus:2},b:{en:["Highest zinc of grass-fed red meats","CLA fatty acids (anti-inflammatory)","Complete protein","Haem iron"],de:["Höchster Zinkgehalt von Weidefleisch","CLA-Fettsäuren (entzündungshemmend)","Vollständiges Protein","Häm-Eisen"]}},
  {en:"Chicken Thighs",de:"Hähnchenschenkel",cat:"Protein",v:{B3:3,B6:2,B12:2,B2:1},m:{Selenium:3,Phosphorus:2,Zinc:2,Iron:1},b:{en:["More zinc & iron than chicken breast","Collagen from skin","Immune function","Juicy fat profile"],de:["Mehr Zink & Eisen als Hähnchenbrust","Kollagen aus der Haut","Immunfunktion","Saftiges Fettprofil"]}},
  {en:"Bacon",de:"Speck",cat:"SoulFood",v:{B1:2,B12:2,B3:2,B6:1},m:{Selenium:2,Phosphorus:2,Zinc:1,Iron:1},b:{en:["B1 & B12 from pork","Selenium source","BBQ essential","Life-affirming sizzle 🥓"],de:["B1 & B12 aus Schweinefleisch","Selenquelle","BBQ-Grundnahrungsmittel","Lebensbejahendes Brutzeln 🥓"]}},
  {en:"Halloumi",de:"Halloumi",cat:"Dairy",v:{B12:2,B2:2,A:1,K:1},m:{Calcium:3,Phosphorus:3,Zinc:2,Selenium:1},b:{en:["High-heat grillable cheese","Very high calcium","Complete protein","Mediterranean vegetarian staple"],de:["Grillkäse bei hoher Hitze","Sehr viel Kalzium","Vollständiges Protein","Mediterraner Vegetarier-Klassiker"]}},
  {en:"Veggie Burger Patty",de:"Veggie-Patty",cat:"SoulFood",v:{B12:1,B9:2,B1:1,E:1},m:{Iron:2,Zinc:1,Magnesium:1,Phosphorus:1},b:{en:["Plant-based complete protein","Fortified iron & B12","Suitable for all diets","Grill-ready 🌿"],de:["Pflanzliches Vollprotein","Angereichertes Eisen & B12","Für alle Ernährungsweisen","Grillfertig 🌿"]}},
  {en:"Portobello Mushroom",de:"Portobello",cat:"Vegetable",v:{D:3,B2:3,B3:3,B5:2,B9:1},m:{Selenium:2,Copper:2,Phosphorus:2,Potassium:2},b:{en:["Highest vitamin D of all mushrooms (UV)","Meaty BBQ substitute","Beta-glucan (immune)","Umami richness"],de:["Vitamin-D-reichster Pilz (UV)","Fleischige Grill-Alternative","Beta-Glucan (Immun)","Umami-Reichtum"]}},
  {en:"Prawns",de:"Garnelen",cat:"Protein",v:{B12:3,B3:2,D:1,E:1},m:{Selenium:3,Phosphorus:3,Zinc:2,Iron:1},b:{en:["Selenium powerhouse","Very lean high-quality protein","Anti-inflammatory","Zinc for immune function"],de:["Selen-Kraftpaket","Sehr mageres Qualitätsprotein","Entzündungshemmend","Zink für Immunfunktion"]}},
  {en:"Sea Bass",de:"Dorade",cat:"Protein",v:{B12:2,D:2,B3:2,B6:1},m:{Selenium:2,Phosphorus:2,Potassium:2},b:{en:["Omega-3 fatty acids","Lean protein","Heart health","Mediterranean grill classic"],de:["Omega-3-Fettsäuren","Mageres Protein","Herzgesundheit","Mediterraner Grill-Klassiker"]}},
  {en:"Trout",de:"Forelle",cat:"Protein",v:{B12:3,D:2,B3:2,B6:2,E:1},m:{Selenium:3,Phosphorus:2,Potassium:2},b:{en:["Salmon-level omega-3 & B12","Anti-inflammatory","Brain and heart health","Freshwater alternative to salmon"],de:["Lachs-Level Omega-3 & B12","Entzündungshemmend","Gehirn- und Herzgesundheit","Süßwasser-Alternative zu Lachs"]}},
  {en:"Swordfish Steak",de:"Schwertfischsteak",cat:"Protein",v:{B12:2,D:2,B3:3,B6:1},m:{Selenium:3,Phosphorus:2},b:{en:["Highest niacin (B3) of all fish","Selenium powerhouse","Omega-3 fatty acids","Meaty grillable texture"],de:["Meistes Niacin (B3) aller Fische","Selen-Kraftpaket","Omega-3-Fettsäuren","Fleischige Grill-Textur"]}},
  {en:"Coleslaw",de:"Krautsalat",cat:"Vegetable",v:{C:2,K:2,B6:1,B9:1},m:{Potassium:1,Calcium:1,Manganese:1},b:{en:["Vitamin C from cabbage","Gut health (prebiotic fibre)","Low calorie","Classic BBQ companion"],de:["Vitamin C aus Kohl","Darmgesundheit (Präbiotika)","Kalorienarm","Klassischer BBQ-Begleiter"]}},
  {en:"Tzatziki",de:"Tzatziki",cat:"Special",v:{B12:1,B2:1,C:1,B6:1},m:{Calcium:2,Phosphorus:1,Potassium:1},b:{en:["Probiotics from yogurt","Allicin from garlic","Hydration from cucumber","Gut health"],de:["Probiotika aus Joghurt","Allicin aus Knoblauch","Hydration aus Gurke","Darmgesundheit"]}},
  {en:"BBQ Sauce",de:"BBQ-Sauce",cat:"Special",v:{A:1,C:1},m:{Potassium:1,Iron:1},b:{en:["Lycopene from tomatoes","Antioxidant-rich","Capsaicin in spicy variants","The BBQ finisher 🍯"],de:["Lycopin aus Tomaten","Antioxidantienreich","Capsaicin in würzigen Varianten","Der BBQ-Finisher 🍯"]}},
  {en:"Chimichurri",de:"Chimichurri",cat:"Special",v:{C:2,K:3,A:2,E:1},m:{Iron:1,Potassium:1},b:{en:["Vitamin C from parsley enhances iron absorption","Powerful herb antioxidants","Anti-inflammatory","Pairs with any grilled protein"],de:["Vitamin C aus Petersilie verbessert Eisenaufnahme","Starke Kräuter-Antioxidantien","Entzündungshemmend","Passt zu jedem Grillprotein"]}},
  {en:"Corn on the Cob",de:"Maiskolben",cat:"Vegetable",v:{B1:2,B3:2,C:2,B9:2},m:{Phosphorus:2,Magnesium:1,Manganese:1,Potassium:1},b:{en:["Lutein & zeaxanthin (eye health)","Sustained energy","Gut health (fibre)","BBQ icon 🌽"],de:["Lutein & Zeaxanthin (Augengesundheit)","Anhaltende Energie","Darmgesundheit (Ballaststoffe)","BBQ-Ikone 🌽"]}},
];

const seenSet = new Set();
const FOODS = FOODS_RAW.filter(f=>{ if(seenSet.has(f.en))return false; seenSet.add(f.en); return true; });
const FOOD_BY_EN = {};
FOODS.forEach(f=>{ FOOD_BY_EN[f.en]=f; });
const VEGETARIAN_HIDE=new Set(["Chicken Breast","Salmon","Beef","Sardines","Tuna","Turkey","Liver (Beef)","Mackerel","Oysters","Beef Steak","Pork Neck Steak","Pork Ribs","Bratwurst","Lamb Chops","Chicken Thighs","Bacon","Prawns","Sea Bass","Trout","Swordfish Steak"]);
const PESCATARIAN_HIDE=new Set(["Chicken Breast","Beef","Turkey","Liver (Beef)","Beef Steak","Pork Neck Steak","Pork Ribs","Bratwurst","Lamb Chops","Chicken Thighs","Bacon"]);
const VEGAN_EXTRA_HIDE=new Set(["Eggs","Bone Broth","Whey Protein","Tzatziki","Coleslaw"]);

const ALL_VIT = ["A","B1","B2","B3","B5","B6","B9","B12","C","D","E","K"];
const ALL_MIN = ["Calcium","Copper","Iron","Magnesium","Manganese","Phosphorus","Potassium","Selenium","Zinc"];

const CAT_STYLE = {
  Protein:{bg:"#fee2e2",color:"#b91c1c"},Vegetable:{bg:"#dcfce7",color:"#15803d"},
  Fruit:{bg:"#ffedd5",color:"#c2410c"},Grain:{bg:"#fef9c3",color:"#a16207"},
  Legume:{bg:"#ecfccb",color:"#4d7c0f"},"Nut/Seed":{bg:"#fef3c7",color:"#b45309"},
  Spice:{bg:"#ede9fe",color:"#6d28d9"},Special:{bg:"#fce7f3",color:"#9d174d"},
  "Fat/Oil":{bg:"#fef9c3",color:"#92400e"},Dairy:{bg:"#dbeafe",color:"#1d4ed8"},
  SoulFood:{bg:"#fff0e0",color:"#c2410c"},
};

const BENEFIT_STYLES = [
  {bg:"#f0fdfa",color:"#0f766e",border:"1px solid #99f6e4"},
  {bg:"#f0f9ff",color:"#0369a1",border:"1px solid #bae6fd"},
  {bg:"#f5f3ff",color:"#6d28d9",border:"1px solid #ddd6fe"},
  {bg:"#fff1f2",color:"#be123c",border:"1px solid #fecdd3"},
  {bg:"#fffbeb",color:"#b45309",border:"1px solid #fde68a"},
  {bg:"#f0fdf4",color:"#166534",border:"1px solid #bbf7d0"},
];

function todayKey(){ return new Date().toISOString().split("T")[0]; }
function aggregateN(keys){
  const n={v:{},m:{}};
  keys.map(k=>FOOD_BY_EN[k]).filter(Boolean).forEach(f=>{
    Object.entries(f.v||{}).forEach(([k,v])=>{n.v[k]=Math.min(3,(n.v[k]||0)+v);});
    Object.entries(f.m||{}).forEach(([k,v])=>{n.m[k]=Math.min(3,(n.m[k]||0)+v);});
  });
  return n;
}
function getPowerScore(keys){
  if(!keys.length)return 0;
  const n=aggregateN(keys);
  const vC=ALL_VIT.filter(v=>n.v[v]>=2).length;
  const mC=ALL_MIN.filter(m=>n.m[m]>=2).length;
  return Math.round(Math.min((vC/ALL_VIT.length)*45+(mC/ALL_MIN.length)*35+(Math.min(keys.length,8)/8)*20,100));
}
function getPowerIdx(s){ return s===0?0:s<20?1:s<40?2:s<55?3:s<70?4:s<85?5:6; }
function getPowerColor(s){
  if(s<20)return{fill:"#9ca3af",text:"#9ca3af",grad:"linear-gradient(to right,#6b7280,#4b5563)"};
  if(s<40)return{fill:"#22c55e",text:"#22c55e",grad:"linear-gradient(to right,#22c55e,#10b981)"};
  if(s<55)return{fill:"#10b981",text:"#10b981",grad:"linear-gradient(to right,#10b981,#0d9488)"};
  if(s<70)return{fill:"#3b82f6",text:"#3b82f6",grad:"linear-gradient(to right,#3b82f6,#2563eb)"};
  if(s<85)return{fill:"#8b5cf6",text:"#8b5cf6",grad:"linear-gradient(to right,#8b5cf6,#7c3aed)"};
  return{fill:"#f59e0b",text:"#f59e0b",grad:"linear-gradient(to right,#f59e0b,#f97316)"};
}
function getStreak(hist){
  let s=0;
  for(let i=0;i<30;i++){
    const d=new Date();d.setDate(d.getDate()-i);
    const k=d.toISOString().split("T")[0];
    if((hist[k]||[]).length>0&&getPowerScore(hist[k])>=20)s++;else break;
  }
  return s;
}
function getHeatBg(s){
  if(!s||s<5)return"#1f2937";if(s<25)return"#14532d";
  if(s<50)return"#16a34a";if(s<75)return"#10b981";return"#f59e0b";
}

function useOffline(){
  const [offline,setOffline]=useState(!navigator.onLine);
  const [visible,setVisible]=useState(!navigator.onLine);
  useEffect(()=>{
    let t;
    const on=()=>{setOffline(false);t=setTimeout(()=>setVisible(false),2000);};
    const off=()=>{setOffline(true);setVisible(true);clearTimeout(t);};
    window.addEventListener("online",on);window.addEventListener("offline",off);
    return()=>{window.removeEventListener("online",on);window.removeEventListener("offline",off);clearTimeout(t);};
  },[]);
  return{offline,visible};
}
function useInstallPrompt(){
  const [show,setShow]=useState(false);
  const [evt,setEvt]=useState(null);
  const dismissed=useRef(false);
  useEffect(()=>{
    const standalone=window.matchMedia("(display-mode: standalone)").matches||window.navigator.standalone===true;
    const isMobile=/iphone|ipad|ipod|android/i.test(navigator.userAgent);
    if(!isMobile)return;
    if(standalone)return;
    try{if(sessionStorage.getItem("wft-install-dismissed"))return;}catch{}
    const h=e=>{e.preventDefault();setEvt(e);};
    window.addEventListener("beforeinstallprompt",h);
    const t=setTimeout(()=>{if(!dismissed.current)setShow(true);},5000);
    return()=>{window.removeEventListener("beforeinstallprompt",h);clearTimeout(t);};
  },[]);
  const install=async()=>{ if(evt){evt.prompt();await evt.userChoice;} dismiss(); };
  const dismiss=()=>{dismissed.current=true;setShow(false);try{sessionStorage.setItem("wft-install-dismissed","1");}catch{}};
  return{show,install,dismiss,isNative:!!evt};
}

function OfflineBanner({offline,visible}){
  return(
    <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:100,pointerEvents:"none",transition:"opacity 0.4s ease,transform 0.4s ease",opacity:visible?1:0,transform:visible?"translateY(0)":"translateY(100%)"}}>
      <div style={{background:offline?"#1f2937":"#14532d",borderTop:offline?"1px solid #374151":"1px solid #166534",color:offline?"#fde68a":"#86efac",fontSize:12,fontWeight:600,padding:"10px 20px",textAlign:"center",paddingBottom:"calc(10px + env(safe-area-inset-bottom))"}}>
        {offline?<><WifiOff size={13} style={{verticalAlign:"middle",marginRight:5}}/>Offline — your data is still saved</>:"✓ Back online"}
      </div>
      
    </div>
  );
}
function InstallPrompt({show,onInstall,onDismiss,isNative,lang}){
  const isIOS=/iphone|ipad|ipod/i.test(navigator.userAgent);
  const de=lang==="de";
  if(!show)return null;
  return(
    <div style={{position:"fixed",bottom:"calc(80px + env(safe-area-inset-bottom))",left:0,right:0,zIndex:99,display:"flex",justifyContent:"center",padding:"0 16px"}}>
      <div style={{background:"#111827",border:"1px solid #374151",borderRadius:20,padding:"16px 20px",maxWidth:440,width:"100%",boxShadow:"0 -4px 40px rgba(0,0,0,0.6)",display:"flex",alignItems:"center",gap:14,animation:"slideUp 0.35s cubic-bezier(0.34,1.56,0.64,1)"}}>
        <div style={{flexShrink:0,color:"#22c55e"}}><Leaf size={32}/></div>
        <div style={{flex:1}}>
          <p style={{margin:0,fontSize:14,fontWeight:800,color:"#f9fafb"}}>{de?"Zum Startbildschirm":"Add to Home Screen"}</p>
          <p style={{margin:"3px 0 0",fontSize:11,color:"#6b7280",lineHeight:1.4}}>{isIOS?(de?'Tippe auf "Teilen" dann "Zum Home-Bildschirm"':'Tap Share → "Add to Home Screen"'):isNative?(de?"Installiere für schnellen Zugriff.":"Install for quick access."):(de?"Füge die App hinzu.":"Add this app to your home screen.")}</p>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:6,flexShrink:0}}>
          {!isIOS&&<button onClick={onInstall} style={{minWidth:44,minHeight:44,background:"#22c55e",color:"#fff",border:"none",borderRadius:10,padding:"7px 14px",fontSize:12,fontWeight:700,cursor:"pointer"}}>{de?"Install.":"Install"}</button>}
          <button onClick={onDismiss} style={{minWidth:44,minHeight:44,background:"transparent",color:"#6b7280",border:"1px solid #374151",borderRadius:10,padding:"7px 14px",fontSize:12,fontWeight:600,cursor:"pointer"}}>{de?"Später":"Later"}</button>
        </div>
      </div>
    </div>
  );
}
function Confetti({active}){
  const cvs=useRef(null),anim=useRef(null);
  useEffect(()=>{
    if(!active)return;
    const c=cvs.current;if(!c)return;
    const ctx=c.getContext("2d");c.width=c.offsetWidth;c.height=c.offsetHeight;
    const ps=Array.from({length:80},()=>({x:Math.random()*c.width,y:Math.random()*-c.height*0.5,r:Math.random()*6+3,d:Math.random()*80+20,col:["#f59e0b","#22c55e","#3b82f6","#8b5cf6","#ec4899","#10b981","#f97316"][Math.floor(Math.random()*7)],tilt:Math.random()*10-5,spd:Math.random()*3+2}));
    let fr=0;
    const draw=()=>{
      ctx.clearRect(0,0,c.width,c.height);
      ps.forEach(p=>{ctx.beginPath();ctx.lineWidth=p.r;ctx.strokeStyle=p.col;ctx.moveTo(p.x+p.tilt+p.r/3,p.y);ctx.lineTo(p.x+p.tilt,p.y+p.tilt+p.r);ctx.stroke();p.y+=p.spd;p.tilt=Math.sin(fr*0.05+p.d)*12;if(p.y>c.height){p.y=-20;p.x=Math.random()*c.width;}});
      fr++;if(fr<120)anim.current=requestAnimationFrame(draw);else ctx.clearRect(0,0,c.width,c.height);
    };
    anim.current=requestAnimationFrame(draw);
    return()=>{if(anim.current)cancelAnimationFrame(anim.current);};
  },[active]);
  return <canvas ref={cvs} style={{position:"fixed",top:0,bottom:0,left:"50%",transform:"translateX(-50%)",width:"min(100vw,1100px)",height:"100%",pointerEvents:"none",zIndex:200,opacity:active?1:0,transition:"opacity 0.5s ease"}}/>;
}
function CoverageBar({level}){
  const w=level===0?"0%":level===1?"33%":level===2?"66%":"100%";
  const bg=level===0?"transparent":level===1?"#facc15":level===2?"#60a5fa":"#4ade80";
  return <div style={{width:"100%",height:6,borderRadius:3,background:"#374151"}}><div style={{height:6,borderRadius:3,background:bg,width:w,transition:"width 0.7s ease"}}/></div>;
}
function Toast({msg,onDone}){
  useEffect(()=>{const t=setTimeout(onDone,2600);return()=>clearTimeout(t);},[]);
  return(
    <div style={{position:"fixed",top:20,left:"50%",transform:"translateX(-50%)",zIndex:300,animation:"toastIn 0.35s cubic-bezier(0.34,1.56,0.64,1)"}}>
      <div style={{background:"#fff",color:"#111",fontSize:13,fontWeight:700,padding:"10px 20px",borderRadius:16,boxShadow:"0 4px 32px rgba(0,0,0,0.5)",border:"1px solid #f3f4f6",whiteSpace:"nowrap"}}>{msg}</div>
    </div>
  );
}
const POWER_ICONS=[Moon,Sprout,Droplets,Leaf,Dumbbell,Zap,Trophy];
function PowerRing({score,label,pidx,col}){
  const r=52,circ=2*Math.PI*r,dash=(score/100)*circ;
  const [c1,c2]=score<=30?["#6b7280","#9ca3af"]:score<=60?["#3b82f6","#60a5fa"]:score<=85?["#22c55e","#4ade80"]:["#8b5cf6","#a78bfa"];
  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
      <div style={{position:"relative",width:144,height:144}}>
        <svg style={{width:"100%",height:"100%",transform:"rotate(-90deg)"}} viewBox="0 0 120 120">
          <defs>
            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={c1}/>
              <stop offset="100%" stopColor={c2}/>
            </linearGradient>
          </defs>
          <circle cx="60" cy="60" r={r} fill="none" stroke="#1f2937" strokeWidth="10"/>
          <circle cx="60" cy="60" r={r} fill="none" stroke="url(#ringGrad)" strokeWidth="10" strokeDasharray={`${dash} ${circ-dash}`} strokeLinecap="round" style={{transition:"stroke-dasharray 0.8s cubic-bezier(0.34,1.56,0.64,1)",filter:`drop-shadow(0 0 6px ${c1})`}}/>
        </svg>
        <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
          <span key={score} style={{fontSize:56,fontWeight:700,color:col.fill,lineHeight:1,letterSpacing:"-2px",animation:"scoreCount 0.3s ease both"}}>{score}</span>
          <span style={{fontSize:13,color:"#f9fafb",opacity:0.4}}>/ 100</span>
        </div>
      </div>
      <div style={{marginTop:8,fontSize:13,fontWeight:600,color:col.fill,opacity:0.85,display:"flex",alignItems:"center",gap:6}}>
        {(()=>{const I=POWER_ICONS[pidx];return I?<I size={14} style={{flexShrink:0}}/>:null;})()}
        {label}
      </div>
    </div>
  );
}

function BenefitModal({benefit,lang,onClose}){
  const info=BENEFIT_INFO[lang]?.[benefit]||(lang==="de"?BENEFIT_INFO.en[benefit]:null);
  const sheetRef=useRef(null);
  const startY=useRef(null),curY=useRef(0);
  const [closing,setClosing]=useState(false);
  const onTS=e=>{startY.current=e.touches[0].clientY;};
  const onTM=e=>{const dy=e.touches[0].clientY-startY.current;if(dy<0)return;curY.current=dy;if(sheetRef.current)sheetRef.current.style.transform=`translateY(${dy}px)`;};
  const onTE=()=>{if(curY.current>80){setClosing(true);setTimeout(onClose,200);}else if(sheetRef.current)sheetRef.current.style.transform="translateY(0)";curY.current=0;};
  const t=T[lang];
  return(
    <div style={{position:"fixed",inset:0,zIndex:155,display:"flex",alignItems:"flex-end"}} onClick={onClose}>
      <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.7)",backdropFilter:"blur(16px)"}}/>
      <div ref={sheetRef} onClick={e=>e.stopPropagation()} onTouchStart={onTS} onTouchMove={onTM} onTouchEnd={onTE}
        style={{position:"relative",background:"#111827",border:"1px solid #374151",borderRadius:"24px 24px 0 0",width:"100%",maxWidth:520,margin:"0 auto",paddingBottom:"calc(28px + env(safe-area-inset-bottom))",boxShadow:"0 -8px 48px rgba(0,0,0,0.7)",transition:closing?"transform 0.2s ease":"none"}}>
        <div style={{display:"flex",justifyContent:"center",padding:"12px 0 4px"}}><div style={{width:36,height:4,borderRadius:2,background:"#374151"}}/></div>
        <div style={{padding:"8px 20px 0"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
            <h3 style={{margin:0,fontSize:15,fontWeight:900,color:"#f9fafb"}}>{benefit}</h3>
            <button onClick={onClose} style={{minWidth:44,minHeight:44,background:"transparent",border:"none",color:"#6b7280",fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
          </div>
          {info?<p style={{fontSize:13,color:"#d1d5db",lineHeight:1.7,margin:0}}>{info}</p>:<p style={{fontSize:13,color:"#6b7280",lineHeight:1.6,margin:0}}>{lang==="de"?"Keine weiteren Informationen verfügbar.":"No further information available."}</p>}
          <p style={{fontSize:11,color:"#4b5563",marginTop:16,lineHeight:1.5,display:"flex",alignItems:"flex-start",gap:5}}><Info size={12} style={{flexShrink:0,marginTop:1}}/>{t.benefitDisclaimer}</p>
        </div>
      </div>
    </div>
  );
}

function SynergyModal({lang,foodObjs,addFood,onClose,isPremium,onUpgrade}){
  const details=SYNERGY_DETAILS[lang];
  const sheetRef=useRef(null);
  const startY=useRef(null),curY=useRef(0);
  const [closing,setClosing]=useState(false);
  const onTS=e=>{startY.current=e.touches[0].clientY;};
  const onTM=e=>{const dy=e.touches[0].clientY-startY.current;if(dy<0)return;curY.current=dy;if(sheetRef.current)sheetRef.current.style.transform=`translateY(${dy}px)`;};
  const onTE=()=>{if(curY.current>80){setClosing(true);setTimeout(onClose,200);}else if(sheetRef.current)sheetRef.current.style.transform="translateY(0)";curY.current=0;};
  const t=T[lang];
  const foodNames=foodObjs.map(f=>f[lang]);
  const foodEnNames=foodObjs.map(f=>f.en);
  const hasIngredient=n=>foodNames.includes(n)||foodEnNames.includes(n);

  const unlocked=details.filter(syn=>syn.needs.every(n=>hasIngredient(n)));
  const partial=details.filter(syn=>{
    if(syn.needs.every(n=>hasIngredient(n)))return false;
    return syn.needs.some(n=>hasIngredient(n));
  });
  const LockedSynergyCard=({syn})=>(
    <div style={{position:"relative",borderRadius:16,marginBottom:12,overflow:"hidden"}}>
      <div style={{filter:"blur(3px)",pointerEvents:"none",background:"rgba(34,197,94,0.08)",border:"1px solid rgba(34,197,94,0.3)",borderRadius:16,padding:16}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
          <span style={{fontSize:20}}>{syn.emoji}</span>
          <div>
            <p style={{margin:0,fontSize:13,fontWeight:800,color:"#4ade80"}}>{syn.title}</p>
            <p style={{margin:"2px 0 0",fontSize:11,color:"#86efac"}}>{syn.short}</p>
          </div>
        </div>
        <p style={{fontSize:12,color:"#9ca3af",lineHeight:1.6,margin:0}}>{"█".repeat(120)}</p>
      </div>
      <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"rgba(3,7,18,0.7)",borderRadius:16}}>
        <Lock size={24} style={{marginBottom:8,color:"#6b7280"}}/>
        <button onClick={onUpgrade}
          style={{background:"linear-gradient(135deg,#f59e0b,#f97316)",border:"none",borderRadius:10,padding:"8px 18px",fontSize:12,fontWeight:800,color:"#fff",cursor:"pointer"}}>
          {lang==="de"?"Mit Nube Pro freischalten →":"Unlock with Nube Pro →"}
        </button>
      </div>
    </div>
  );
  const SynergyCard=({syn,isUnlocked})=>{
    const missing=syn.needs.filter(n=>!hasIngredient(n));
    const present=syn.needs.filter(n=>hasIngredient(n));
    return(
      <div style={{background:isUnlocked?"rgba(34,197,94,0.08)":"rgba(245,158,11,0.06)",border:isUnlocked?"1px solid rgba(34,197,94,0.3)":"1px solid rgba(245,158,11,0.25)",borderRadius:16,padding:16,marginBottom:12}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
          <span style={{fontSize:20}}>{syn.emoji}</span>
          <div style={{flex:1}}>
            <p style={{margin:0,fontSize:13,fontWeight:800,color:isUnlocked?"#4ade80":"#f9fafb"}}>{syn.title}</p>
            <p style={{margin:"2px 0 0",fontSize:11,color:isUnlocked?"#86efac":"#fbbf24"}}>{syn.short}</p>
          </div>
          <span style={{fontSize:11,fontWeight:700,color:isUnlocked?"#4ade80":"#f59e0b",background:isUnlocked?"rgba(34,197,94,0.12)":"rgba(245,158,11,0.12)",padding:"3px 10px",borderRadius:99}}>
            {isUnlocked?(lang==="de"?"✓ Aktiv":"✓ Active"):(lang==="de"?"Fast da!":"Almost!")}
          </span>
        </div>
        <p style={{fontSize:12,color:"#9ca3af",lineHeight:1.6,margin:"0 0 10px"}}>{syn.explanation}</p>
        {!isUnlocked&&present.length>0&&(
          <div style={{marginBottom:8}}>
            <p style={{fontSize:11,color:"#4ade80",fontWeight:600,marginBottom:5,textTransform:"uppercase",letterSpacing:"0.05em"}}>✓ {lang==="de"?"Bereits dabei:":"Already in today:"}</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
              {present.map(n=>{const f=FOODS.find(x=>x[lang]===n||x.en===n);const cs=f?CAT_STYLE[f.cat]:{bg:"#374151",color:"#d1d5db"};return <span key={n} style={{fontSize:11,padding:"3px 10px",borderRadius:99,background:cs.bg,color:cs.color,fontWeight:600}}>{n}</span>;})}
            </div>
          </div>
        )}
        {!isUnlocked&&missing.length>0&&(
          <div>
            <p style={{fontSize:11,color:"#f59e0b",fontWeight:600,marginBottom:5,textTransform:"uppercase",letterSpacing:"0.05em"}}>+ {lang==="de"?"Noch hinzufügen:":"Add to unlock:"}</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {missing.slice(0,3).map(n=>{const f=FOODS.find(x=>x[lang]===n||x.en===n);if(!f)return null;return(<button key={n} onClick={()=>{addFood(f.en);onClose();}} style={{fontSize:11,padding:"4px 12px",borderRadius:99,background:"#1f2937",border:"1px dashed #f59e0b",color:"#fbbf24",fontWeight:600,cursor:"pointer"}}>+ {f[lang]}</button>);})}
            </div>
          </div>
        )}
      </div>
    );
  };

  return(
    <div style={{position:"fixed",inset:0,zIndex:155,display:"flex",alignItems:"flex-end"}} onClick={onClose}>
      <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.7)",backdropFilter:"blur(16px)"}}/>
      <div ref={sheetRef} onClick={e=>e.stopPropagation()} onTouchStart={onTS} onTouchMove={onTM} onTouchEnd={onTE}
        style={{position:"relative",background:"#111827",border:"1px solid #374151",borderRadius:"24px 24px 0 0",width:"100%",maxWidth:520,margin:"0 auto",paddingBottom:"calc(28px + env(safe-area-inset-bottom))",boxShadow:"0 -8px 48px rgba(0,0,0,0.7)",transition:closing?"transform 0.2s ease":"none",maxHeight:"85vh",overflowY:"auto"}}>
        <div style={{display:"flex",justifyContent:"center",padding:"12px 0 4px"}}><div style={{width:36,height:4,borderRadius:2,background:"#374151"}}/></div>
        <div style={{padding:"8px 20px 16px"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
            <h3 style={{margin:0,fontSize:15,fontWeight:900,color:"#f9fafb",display:"flex",alignItems:"center",gap:6}}><Zap size={16} style={{flexShrink:0}}/>{t.synergyModalTitle}</h3>
            <button onClick={onClose} style={{minWidth:44,minHeight:44,background:"transparent",border:"none",color:"#6b7280",fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
          </div>
          {isPremium?(
            <>
              {unlocked.length>0&&(
                <>
                  <p style={{fontSize:11,fontWeight:700,color:"#4ade80",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10,display:"flex",alignItems:"center",gap:5}}><Unlock size={13} style={{flexShrink:0}}/>{lang==="de"?"Freigeschaltete Synergien":"Unlocked synergies"} ({unlocked.length})</p>
                  {unlocked.map(syn=><SynergyCard key={syn.id} syn={syn} isUnlocked={true}/>)}
                </>
              )}
              {partial.length>0&&(
                <>
                  <p style={{fontSize:11,fontWeight:700,color:"#f59e0b",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10,marginTop:unlocked.length>0?16:0,display:"flex",alignItems:"center",gap:5}}><Lightbulb size={13} style={{flexShrink:0}}/>{t.potentialSynergies} — {lang==="de"?"du hast bereits eine Zutat:":"you already have one ingredient:"}</p>
                  {partial.map(syn=><SynergyCard key={syn.id} syn={syn} isUnlocked={false}/>)}
                </>
              )}
              {unlocked.length===0&&partial.length===0&&(
                <p style={{fontSize:13,color:"#4b5563",textAlign:"center",padding:"24px 0"}}>{lang==="de"?"Füge mehr Lebensmittel hinzu um Synergien freizuschalten.":"Add more foods to unlock synergies."}</p>
              )}
            </>
          ):(
            <>
              {unlocked.filter(s=>s.id==="turmeric_pepper").map(syn=><SynergyCard key={syn.id} syn={syn} isUnlocked={true}/>)}
              {[...unlocked.filter(s=>s.id!=="turmeric_pepper"),...partial].map(syn=><LockedSynergyCard key={syn.id} syn={syn}/>)}
              {unlocked.length===0&&partial.length===0&&(
                <p style={{fontSize:13,color:"#4b5563",textAlign:"center",padding:"24px 0"}}>{lang==="de"?"Füge mehr Lebensmittel hinzu um Synergien freizuschalten.":"Add more foods to unlock synergies."}</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function NutrientModal({nutrient,type,lang,onClose,added,filteredFoodKeys}){
  const info=NUTRIENT_INFO[type]?.[nutrient];
  const sheetRef=useRef(null);const startY=useRef(null),curY=useRef(0);const [closing,setClosing]=useState(false);
  const onTS=e=>{startY.current=e.touches[0].clientY;};
  const onTM=e=>{const dy=e.touches[0].clientY-startY.current;if(dy<0)return;curY.current=dy;if(sheetRef.current)sheetRef.current.style.transform=`translateY(${dy}px)`;};
  const onTE=()=>{if(curY.current>80){setClosing(true);setTimeout(onClose,200);}else if(sheetRef.current)sheetRef.current.style.transform="translateY(0)";curY.current=0;};
  if(!info)return null;
  const t=T[lang],loc=info[lang]||info.en;
  const name=type==="vitamins"?t.vitNames[nutrient]:nutrient;
  const eaten=[],notYet=[];
  loc.tops.forEach(n=>{const f=FOODS.find(x=>x[lang]===n||x.en===n);if(f&&added.includes(f.en))eaten.push(n);else if(!f||!filteredFoodKeys||filteredFoodKeys.has(f.en))notYet.push(n);});
  return(
    <div style={{position:"fixed",inset:0,zIndex:150,display:"flex",alignItems:"flex-end"}} onClick={onClose}>
      <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.7)",backdropFilter:"blur(16px)"}}/>
      <div ref={sheetRef} onClick={e=>e.stopPropagation()} onTouchStart={onTS} onTouchMove={onTM} onTouchEnd={onTE}
        style={{position:"relative",background:"#111827",border:"1px solid #374151",borderRadius:"24px 24px 0 0",width:"100%",maxWidth:520,margin:"0 auto",paddingBottom:"calc(24px + env(safe-area-inset-bottom))",boxShadow:"0 -8px 48px rgba(0,0,0,0.7)",transition:closing?"transform 0.2s ease":"none"}}>
        <div style={{display:"flex",justifyContent:"center",padding:"12px 0 4px"}}><div style={{width:36,height:4,borderRadius:2,background:"#374151"}}/></div>
        <div style={{padding:"8px 20px 0"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
            <h3 style={{margin:0,fontSize:16,fontWeight:900,color:"#f9fafb"}}>{name}</h3>
            <button onClick={onClose} style={{minWidth:44,minHeight:44,background:"transparent",border:"none",color:"#6b7280",fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
          </div>
          <p style={{fontSize:13,color:"#9ca3af",lineHeight:1.5,marginBottom:16}}>{loc.role}</p>
          {eaten.length>0&&<div style={{marginBottom:12}}><p style={{fontSize:11,fontWeight:700,color:"#4ade80",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:8}}>✓ {t.alreadyEaten}</p><div style={{display:"flex",flexWrap:"wrap",gap:6}}>{eaten.map(n=><span key={n} style={{fontSize:12,background:"rgba(34,197,94,0.15)",border:"1px solid rgba(34,197,94,0.3)",color:"#86efac",padding:"5px 12px",borderRadius:20,fontWeight:600}}>{n}</span>)}</div></div>}
          {notYet.length>0&&<div><p style={{fontSize:11,fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:8}}>💡 {t.topSources}</p><div style={{display:"flex",flexWrap:"wrap",gap:6}}>{notYet.map(n=><span key={n} style={{fontSize:12,background:"#1f2937",border:"1px solid #374151",color:"#d1d5db",padding:"5px 12px",borderRadius:20,fontWeight:600}}>{n}</span>)}</div></div>}
        </div>
      </div>
    </div>
  );
}
function TabPane({active,children}){
  const [render,setRender]=useState(active);const [anim,setAnim]=useState(active?"in":"out");
  useEffect(()=>{if(active){setRender(true);setTimeout(()=>setAnim("in"),10);}else{setAnim("out");const t=setTimeout(()=>setRender(false),220);return()=>clearTimeout(t);}},[active]);
  if(!render)return null;
  return <div style={{animation:anim==="in"?"slideUp 0.25s ease both":"none",opacity:anim==="in"?1:0,transform:anim==="in"?"translateY(0)":"translateY(10px)",transition:anim==="out"?"opacity 0.22s ease,transform 0.22s ease":"none"}}>{children}</div>;
}
function FoodTag({food,lang,onRemove,onRequestRemove,isNew}){
  const [removing,setRemoving]=useState(false);
  const cs=CAT_STYLE[food.cat]||{bg:"#374151",color:"#d1d5db"};
  return(
    <div style={{display:"flex",alignItems:"center",gap:6,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:20,padding:"8px 12px",boxShadow:"0 2px 8px rgba(0,0,0,0.25)",transition:"opacity 0.2s ease,transform 0.2s ease,box-shadow 0.2s ease",opacity:removing?0:1,transform:removing?"scale(0.7)":"scale(1)",animation:isNew&&!removing?"foodTagPop 0.4s cubic-bezier(0.34,1.56,0.64,1) both":"none"}}
      onMouseEnter={e=>{if(!removing){e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 4px 12px rgba(0,0,0,0.3)";}}}
      onMouseLeave={e=>{if(!removing){e.currentTarget.style.transform="scale(1)";e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,0.25)";}}}>

      <span style={{fontSize:11,padding:"2px 6px",borderRadius:8,background:cs.bg,color:cs.color,fontWeight:600}}>{(T[lang].catNames[food.cat]||food.cat)[0]}</span>
      <span style={{fontSize:12,fontWeight:600,color:"#e5e7eb"}}>{food[lang]}</span>
      <button onClick={()=>onRequestRemove(food.en)} style={{minWidth:24,minHeight:24,background:"transparent",border:"none",color:"#4b5563",cursor:"pointer",padding:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>✕</button>
    </div>
  );
}
function getRotatedSuggestions(goal,lang,added,dateKey,filteredFoods=FOODS){
  const allMatching=filteredFoods.filter(f=>
    (f.b[lang]||[]).some(b=>goal.keywords.some(kw=>b.toLowerCase().includes(kw.toLowerCase())))
  );
  const seed=dateKey.replace(/-/g,"");
  const offset=parseInt(seed.slice(-3))%allMatching.length;
  const rotated=[...allMatching.slice(offset),...allMatching.slice(0,offset)];
  return rotated.slice(0,4);
}
function getRecentFoods(history,todayKey,added){
  const counts={};
  for(let i=1;i<=7;i++){
    const d=new Date();d.setDate(d.getDate()-i);
    const k=d.toISOString().split("T")[0];
    (history[k]||[]).forEach(f=>{counts[f]=(counts[f]||0)+1;});
  }
  return Object.entries(counts)
    .sort((a,b)=>b[1]-a[1])
    .map(([k])=>k)
    .filter(k=>!added.includes(k)&&FOOD_BY_EN[k])
    .slice(0,5);
}
function EditDayModal({dayKey,lang,history,setHistory,todayAdded,setAdded,onClose}){
  const isToday=dayKey===todayKey();
  const foods=(history[dayKey]||[]);
  const [localFoods,setLocalFoods]=useState([...foods]);
  const [closing,setClosing]=useState(false);
  const sheetRef=useRef(null);
  const startY=useRef(null),curY=useRef(0);
  const t=T[lang];
  const onTS=e=>{startY.current=e.touches[0].clientY;};
  const onTM=e=>{const dy=e.touches[0].clientY-startY.current;if(dy<0)return;curY.current=dy;if(sheetRef.current)sheetRef.current.style.transform=`translateY(${dy}px)`;};
  const onTE=()=>{if(curY.current>80){setClosing(true);setTimeout(onClose,200);}else if(sheetRef.current)sheetRef.current.style.transform="translateY(0)";curY.current=0;};

  const removeLocal=key=>setLocalFoods(p=>p.filter(k=>k!==key));

  const saveDay=()=>{
    const nh={...history,[dayKey]:localFoods};
    setHistory(nh);
    try{localStorage.setItem("wft-hist4",JSON.stringify(nh));}catch{}
    if(isToday)setAdded(localFoods);
    onClose();
  };

  const copyToToday=()=>{
    const merged=[...new Set([...todayAdded,...localFoods])];
    setAdded(merged);
    const nh={...history,[todayKey()]:merged};
    setHistory(nh);
    try{localStorage.setItem("wft-hist4",JSON.stringify(nh));}catch{}
    try{localStorage.setItem("wft-today4",JSON.stringify({date:todayKey(),foods:merged}));}catch{}
    onClose();
  };

  const d=new Date(dayKey);
  const dateLabel=t.dayLabel(d);

  return(
    <div style={{position:"fixed",inset:0,zIndex:155,display:"flex",alignItems:"flex-end"}} onClick={onClose}>
      <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.7)",backdropFilter:"blur(16px)"}}/>
      <div ref={sheetRef} onClick={e=>e.stopPropagation()} onTouchStart={onTS} onTouchMove={onTM} onTouchEnd={onTE}
        style={{position:"relative",background:"#111827",border:"1px solid #374151",borderRadius:"24px 24px 0 0",width:"100%",maxWidth:520,margin:"0 auto",paddingBottom:"calc(28px + env(safe-area-inset-bottom))",boxShadow:"0 -8px 48px rgba(0,0,0,0.7)",transition:closing?"transform 0.2s ease":"none",maxHeight:"85vh",overflowY:"auto"}}>
        <div style={{display:"flex",justifyContent:"center",padding:"12px 0 4px"}}><div style={{width:36,height:4,borderRadius:2,background:"#374151"}}/></div>
        <div style={{padding:"8px 20px 16px"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
            <h3 style={{margin:0,fontSize:15,fontWeight:900,color:"#f9fafb"}}>✏️ {dateLabel}</h3>
            <button onClick={onClose} style={{minWidth:44,minHeight:44,background:"transparent",border:"none",color:"#6b7280",fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
          </div>

          {!isToday&&(
            <button onClick={copyToToday}
              style={{width:"100%",background:"rgba(34,197,94,0.1)",border:"1px solid rgba(34,197,94,0.3)",borderRadius:14,padding:"12px 16px",marginBottom:16,cursor:"pointer",display:"flex",alignItems:"center",gap:10,transition:"background 0.2s"}}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(34,197,94,0.2)"}
              onMouseLeave={e=>e.currentTarget.style.background="rgba(34,197,94,0.1)"}>
              <span style={{fontSize:18}}>📋</span>
              <div style={{textAlign:"left"}}>
                <p style={{margin:0,fontSize:13,fontWeight:700,color:"#4ade80"}}>{lang==="de"?"Auf heute übertragen":"Copy to Today"}</p>
                <p style={{margin:"2px 0 0",fontSize:11,color:"#6b7280"}}>{lang==="de"?"Alle Foods dieses Tages zu heute hinzufügen":"Add all foods from this day to today"}</p>
              </div>
            </button>
          )}

          <p style={{fontSize:11,fontWeight:600,color:"#f9fafb",opacity:0.5,textTransform:"uppercase",letterSpacing:"2px",marginBottom:10}}>
            {lang==="de"?"Lebensmittel dieses Tages":"Foods this day"} ({localFoods.length})
          </p>

          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:20}}>
            {localFoods.map(k=>{
              const f=FOOD_BY_EN[k];if(!f)return null;
              const cs=CAT_STYLE[f.cat]||{bg:"#374151",color:"#d1d5db"};
              return(
                <div key={k} style={{display:"flex",alignItems:"center",gap:6,background:"#1f2937",border:"1px solid #374151",borderRadius:99,padding:"8px 12px"}}>
                  <span style={{fontSize:11,padding:"2px 6px",borderRadius:99,background:cs.bg,color:cs.color,fontWeight:600}}>{(t.catNames[f.cat]||f.cat)[0]}</span>
                  <span style={{fontSize:12,fontWeight:600,color:"#e5e7eb"}}>{f[lang]}</span>
                  <button onClick={()=>removeLocal(k)} style={{minWidth:24,minHeight:24,background:"transparent",border:"none",color:"#4b5563",cursor:"pointer",padding:0,fontSize:13}}>✕</button>
                </div>
              );
            })}
            {localFoods.length===0&&(
              <p style={{fontSize:12,color:"#4b5563"}}>{lang==="de"?"Keine Lebensmittel an diesem Tag":"No foods logged this day"}</p>
            )}
          </div>

          <button onClick={saveDay}
            style={{width:"100%",minHeight:44,background:"#22c55e",border:"none",borderRadius:14,fontSize:14,fontWeight:700,color:"#fff",cursor:"pointer",transition:"background 0.2s"}}
            onMouseEnter={e=>e.currentTarget.style.background="#16a34a"}
            onMouseLeave={e=>e.currentTarget.style.background="#22c55e"}>
            {lang==="de"?"Speichern":"Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
function AuthScreen({lang,setLang,onAuth,onGuest}){
  const [mode,setMode]=useState("login");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const [showPassword,setShowPassword]=useState(false);
  const [confirmPassword,setConfirmPassword]=useState("");
  const [showConfirmPassword,setShowConfirmPassword]=useState(false);
  const [registered,setRegistered]=useState(false);
  const [registeredEmail,setRegisteredEmail]=useState("");
  const isDE=lang==="de";
  const pwRules=[
  {key:"len",en:"At least 8 characters",de:"Mindestens 8 Zeichen",test:p=>p.length>=8},
  {key:"upper",en:"One uppercase letter",de:"Ein Großbuchstabe",test:p=>/[A-Z]/.test(p)},
  {key:"lower",en:"One lowercase letter",de:"Ein Kleinbuchstabe",test:p=>/[a-z]/.test(p)},
  {key:"num",en:"One number",de:"Eine Zahl",test:p=>/[0-9]/.test(p)},
];
const pwScore=mode==="register"?pwRules.filter(r=>r.test(password)).length:4;
const pwStrong=pwScore===4;
const pwBarColor=pwScore<=1?"#ef4444":pwScore===2?"#f97316":pwScore===3?"#facc15":"#22c55e";
const pwBarLabel=isDE
  ?["","Schwach","Ausreichend","Gut","Stark"][pwScore]
  :["","Weak","Fair","Good","Strong"][pwScore];

  const handleSubmit=async()=>{
  if(!email||!password){setError(isDE?"Bitte alle Felder ausfüllen":"Please fill in all fields");return;}
  if(mode==="register"&&!pwStrong){setError(isDE?"Bitte alle Passwort-Anforderungen erfüllen":"Please meet all password requirements");return;} 
  if(mode==="register"&&password!==confirmPassword){setError(isDE?"Passwörter stimmen nicht überein":"Passwords do not match");return;}
  setLoading(true);setError("");
    try{
      let result;
      if(mode==="login"){
        result=await supabase.auth.signInWithPassword({email,password});
      }else{
        result=await supabase.auth.signUp({email,password});
      }
    if(result.error)throw result.error;
      if(mode==="register"){
      setRegisteredEmail(email);
      setRegistered(true);
      return;
    }
    onAuth(result.data.user||result.data.session?.user);
    }catch(e){
      const msg=e.message||"";
      let friendly="";
      if(mode==="login"){
        if(msg.includes("Invalid login credentials")||msg.includes("invalid_credentials"))
          friendly=isDE?"E-Mail oder Passwort falsch. Bitte erneut versuchen.":"Email or password incorrect. Please try again.";
        else if(msg.includes("Email not confirmed"))
          friendly=isDE?"Bitte bestätige zuerst deine E-Mail-Adresse.":"Please confirm your email address first.";
        else if(msg.includes("NetworkError")||msg.includes("fetch")||msg.includes("Failed to fetch")||msg.includes("network"))
          friendly=isDE?"Verbindungsfehler. Bitte Internet prüfen.":"Connection error. Please check your internet.";        else if(msg.includes("Too many requests"))
          friendly=isDE?"Zu viele Versuche. Bitte kurz warten.":"Too many attempts. Please wait a moment.";
        else
          friendly=isDE?"Etwas ist schiefgelaufen. Bitte erneut versuchen.":"Something went wrong. Please try again.";
      }else{
        if(msg.includes("User already registered"))
          friendly=isDE?"Diese E-Mail ist bereits registriert. Versuche dich anzumelden.":"This email is already registered. Try logging in.";
        else if(msg.includes("Password should be at least"))
          friendly=isDE?"Passwort muss mindestens 8 Zeichen haben.":"Password must be at least 8 characters.";
        else if(msg.includes("NetworkError")||msg.includes("fetch")||msg.includes("Failed to fetch")||msg.includes("network"))
          friendly=isDE?"Verbindungsfehler. Bitte Internet prüfen.":"Connection error. Please check your internet.";        else if(msg.includes("Too many requests"))
          friendly=isDE?"Zu viele Versuche. Bitte kurz warten.":"Too many attempts. Please wait a moment.";
        else
          friendly=isDE?"Etwas ist schiefgelaufen. Bitte erneut versuchen.":"Something went wrong. Please try again.";
      }
      console.log("Error message:", msg);setError(friendly);
    }    setLoading(false);
  };
  const isDesktop=window.innerWidth>=900;
  if(isDesktop)return(
    <div style={{minHeight:"100vh",background:"#030712",color:"#fff",fontFamily:"system-ui,-apple-system,sans-serif",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{width:"100%",maxWidth:1200,display:"flex",alignItems:"center",gap:32,padding:"0 40px"}}>

        {/* LEFT — App Demo */}
        <div style={{flex:"0 0 280px",display:"flex",flexDirection:"column",alignItems:"center"}}>
          <p style={{fontSize:11,fontWeight:600,color:"#f9fafb",opacity:0.5,textTransform:"uppercase",letterSpacing:"2px",marginBottom:12,textAlign:"center"}}>
            {isDE?"Sieh es in Aktion":"See it in action"}
          </p>
          <AppDemo lang={lang}/>
        </div>

        {/* MIDDLE — Login Form */}
        <div style={{flex:"1",maxWidth:400,margin:"0 auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:32}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <img src="/logopng.png" alt="Nube" height={48} style={{height:48,borderRadius:10}}/>
              <div>
                <h1 style={{margin:0,fontSize:20,fontWeight:900,color:"#fff"}}>Nube</h1>
                <p style={{margin:0,fontSize:11,color:"#4b5563"}}>What food can do.</p>
              </div>
            </div>
            <button onClick={()=>setLang(l=>l==="en"?"de":"en")}
              style={{minWidth:44,minHeight:44,background:"#111827",border:"1px solid #374151",borderRadius:99,padding:"6px 14px",fontSize:13,fontWeight:600,color:"#d1d5db",cursor:"pointer"}}>
              <Globe size={15} style={{verticalAlign:"middle",marginRight:4}}/>{lang==="en"?"EN":"DE"}
            </button>
          </div>
          <h2 style={{margin:"0 0 8px",fontSize:24,fontWeight:900,color:"#fff"}}>
            {isDE?"Willkommen bei Nube":"Welcome to Nube"}
          </h2>
          <p style={{margin:"0 0 32px",fontSize:14,color:"#6b7280"}}>
            {isDE?"Tracke deine Ernährung und entdecke Synergien":"Track your nutrition and discover synergies"}
          </p>
          <div style={{display:"flex",gap:4,background:"#111827",borderRadius:12,padding:4,marginBottom:24}}>
            {["login","register"].map(m=>(
              <button key={m} onClick={()=>{setMode(m);setError("");setConfirmPassword("");}}
                style={{flex:1,minHeight:40,background:mode===m?"#1f2937":"transparent",border:"none",borderRadius:10,fontSize:13,fontWeight:700,color:mode===m?"#fff":"#6b7280",cursor:"pointer",transition:"all 0.2s"}}>
                {m==="login"?(isDE?"Anmelden":"Login"):(isDE?"Konto erstellen":"Create account")}
              </button>
            ))}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:16}}>
            <div>
              <label style={{fontSize:12,fontWeight:600,color:"#9ca3af",display:"block",marginBottom:6}}>{isDE?"E-Mail":"Email"}</label>
              <input value={email} onChange={e=>setEmail(e.target.value)} type="email" autoComplete="email"
                placeholder={isDE?"deine@email.com":"your@email.com"}
                style={{width:"100%",padding:"12px 16px",borderRadius:12,border:"1px solid #1f2937",background:"#0f172a",fontSize:14,color:"#fff",outline:"none",boxSizing:"border-box"}}
                onFocus={e=>e.target.style.borderColor="#22c55e"} onBlur={e=>e.target.style.borderColor="#1f2937"}
                onKeyDown={e=>e.key==="Enter"&&handleSubmit()}/>
            </div>
            <div>
              <label style={{fontSize:12,fontWeight:600,color:"#9ca3af",display:"block",marginBottom:6}}>{isDE?"Passwort":"Password"}</label>
              <div style={{position:"relative"}}>
                <input value={password} onChange={e=>setPassword(e.target.value)}
                  type={showPassword?"text":"password"} autoComplete={mode==="login"?"current-password":"new-password"}
                  placeholder={isDE?"Mindestens 8 Zeichen":"At least 8 characters"}
                  style={{width:"100%",padding:"12px 48px 12px 16px",borderRadius:12,border:"1px solid #1f2937",background:"#0f172a",fontSize:14,color:"#fff",outline:"none",boxSizing:"border-box"}}
                  onFocus={e=>e.target.style.borderColor="#22c55e"} onBlur={e=>e.target.style.borderColor="#1f2937"}
                  onKeyDown={e=>e.key==="Enter"&&handleSubmit()}/>
                <button onClick={()=>setShowPassword(p=>!p)}
                  style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"transparent",border:"none",color:"#6b7280",cursor:"pointer",fontSize:16,padding:0}}>
                  {showPassword?"🙈":"👁️"}
                </button>
              </div>
            </div>
            {mode==="register"&&(
              <div>
                <label style={{fontSize:12,fontWeight:600,color:"#9ca3af",display:"block",marginBottom:6}}>{isDE?"Passwort bestätigen":"Confirm Password"}</label>
                <div style={{position:"relative"}}>
                  <input value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)}
                    type={showConfirmPassword?"text":"password"} autoComplete="new-password"
                    placeholder={isDE?"Passwort wiederholen":"Repeat password"}
                    style={{width:"100%",padding:"12px 48px 12px 16px",borderRadius:12,border:"1px solid "+(confirmPassword&&confirmPassword!==password?"rgba(239,68,68,0.5)":confirmPassword&&confirmPassword===password?"rgba(34,197,94,0.5)":"#1f2937"),background:"#0f172a",fontSize:14,color:"#fff",outline:"none",boxSizing:"border-box"}}
                    onFocus={e=>e.target.style.borderColor="#22c55e"} onBlur={e=>e.target.style.borderColor="#1f2937"}
                    onKeyDown={e=>e.key==="Enter"&&handleSubmit()}/>
                  <button onClick={()=>setShowConfirmPassword(p=>!p)}
                    style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"transparent",border:"none",color:"#6b7280",cursor:"pointer",fontSize:16,padding:0}}>
                    {showConfirmPassword?"🙈":"👁️"}
                  </button>
                </div>
                {confirmPassword&&confirmPassword!==password&&<p style={{margin:"4px 0 0",fontSize:11,color:"#f87171"}}>{isDE?"Passwörter stimmen nicht überein":"Passwords do not match"}</p>}
                {confirmPassword&&confirmPassword===password&&<p style={{margin:"4px 0 0",fontSize:11,color:"#4ade80"}}>{isDE?"Passwörter stimmen überein ✓":"Passwords match ✓"}</p>}
              </div>
            )}
            {mode==="register"&&password.length>0&&(
              <div style={{marginTop:4}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
                  <div style={{flex:1,height:4,borderRadius:2,background:"#1f2937"}}>
                    <div style={{height:4,borderRadius:2,background:pwBarColor,width:`${pwScore*25}%`,transition:"width 0.3s ease,background 0.3s ease"}}/>
                  </div>
                  <span style={{fontSize:11,color:pwBarColor,marginLeft:8,fontWeight:600,minWidth:50}}>{pwBarLabel}</span>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:3,marginTop:6}}>
                  {pwRules.map(r=><span key={r.key} style={{fontSize:11,color:r.test(password)?"#4ade80":"#6b7280"}}>{r.test(password)?"✓":"✗"} {isDE?r.de:r.en}</span>)}
                </div>
              </div>
            )}
          </div>
          {error&&(
            <div style={{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.3)",borderRadius:12,padding:"12px 16px",marginBottom:16}}>
              <p style={{margin:0,fontSize:13,color:"#fca5a5"}}>{error}</p>
            </div>
          )}
          <button onClick={handleSubmit} disabled={loading}
            style={{width:"100%",height:52,background:loading?"#166834":(mode==="register"&&!pwStrong)?"#1f2937":"#22c55e",border:(mode==="register"&&!pwStrong)?"1px solid #374151":"none",borderRadius:14,fontSize:15,fontWeight:800,color:(mode==="register"&&!pwStrong)?"#4b5563":"#fff",cursor:(loading||(mode==="register"&&!pwStrong))?"not-allowed":"pointer",transition:"background 0.2s",marginBottom:16}}>
            {loading?(isDE?"Laden...":"Loading..."):(mode==="login"?(isDE?"Anmelden":"Login"):(isDE?"Konto erstellen":"Create account"))}
          </button>
          <button onClick={onGuest}
            style={{width:"100%",background:"transparent",border:"none",color:"#4b5563",fontSize:13,cursor:"pointer",padding:"8px 0"}}>
            {isDE?"Ohne Konto fortfahren →":"Continue without account →"}
          </button>
          {mode==="register"&&(
            <p style={{fontSize:11,color:"#4b5563",textAlign:"center",marginTop:16,lineHeight:1.5}}>
              {isDE?"Mit der Registrierung stimmst du unserer Datenschutzerklärung zu.":"By registering you agree to our Privacy Policy."}
            </p>
          )}
        </div>

        {/* RIGHT — Synergy Cards */}
        <div style={{flex:"0 0 280px",display:"flex",flexDirection:"column",gap:12}}>
          <p style={{fontSize:11,fontWeight:600,color:"#f9fafb",opacity:0.5,textTransform:"uppercase",letterSpacing:"2px",marginBottom:4}}>
            {isDE?"Wissenschaftlich belegt":"Science-backed synergies"}
          </p>
          {[
            {emoji:"🌶️+🌿",title:isDE?"Schwarzer Pfeffer + Kurkuma":"Black Pepper + Turmeric",desc:isDE?"Curcumin-Aufnahme x20":"Curcumin absorption x20",color:"#f59e0b",bg:"rgba(120,53,15,0.3)",border:"rgba(180,83,9,0.4)"},
            {emoji:"🍊+🥩",title:isDE?"Vitamin C + Eisen":"Vitamin C + Iron",desc:isDE?"Eisenaufnahme x4":"Iron absorption x4",color:"#f97316",bg:"rgba(124,45,18,0.3)",border:"rgba(194,65,12,0.4)"},
            {emoji:"🥑+🥗",title:isDE?"Avocado + Vitamine":"Avocado + Vitamins",desc:isDE?"A/E/K Aufnahme x5":"A/E/K absorption x5",color:"#22c55e",bg:"rgba(20,83,45,0.3)",border:"rgba(22,163,74,0.4)"},
            {emoji:"🍵+🍋",title:isDE?"Grüner Tee + Zitrone":"Green Tea + Lemon",desc:isDE?"EGCG-Aufnahme x13":"EGCG absorption x13",color:"#60a5fa",bg:"rgba(30,58,138,0.3)",border:"rgba(37,99,235,0.4)"},
          ].map((s,i)=>(
            <div key={i} style={{background:s.bg,border:`1px solid ${s.border}`,borderRadius:16,padding:"14px 16px"}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:20}}>{s.emoji}</span>
                <div>
                  <p style={{margin:0,fontSize:12,fontWeight:700,color:s.color}}>{s.title}</p>
                  <p style={{margin:"2px 0 0",fontSize:11,color:"#9ca3af"}}>{s.desc}</p>
                </div>
              </div>
            </div>
          ))}
          <div style={{background:"#0f172a",border:"1px solid #1f2937",borderRadius:16,padding:"14px 16px",marginTop:4}}>
            <p style={{margin:"0 0 4px",fontSize:12,fontWeight:700,color:"#4b5563"}}>
              {isDE?"10 Synergien insgesamt":"10 synergies total"}
            </p>
            <p style={{margin:0,fontSize:11,color:"#374151"}}>
              {isDE?"Entdecke alle mit Nube Pro":"Discover all with Nube Pro"}<Zap size={12} style={{verticalAlign:"middle",marginLeft:4,color:"#f59e0b"}}/>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
  if(registered)return(
  <div style={{minHeight:"100vh",background:"#030712",color:"#fff",fontFamily:"system-ui,-apple-system,sans-serif",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"0 24px"}}>
    <div style={{width:"100%",maxWidth:400,textAlign:"center"}}>
      <div style={{fontSize:64,marginBottom:24}}>📬</div>
      <h2 style={{margin:"0 0 12px",fontSize:24,fontWeight:900,color:"#fff"}}>
        {isDE?"Fast geschafft!":"Almost there!"}
      </h2>
      <p style={{margin:"0 0 8px",fontSize:15,color:"#9ca3af",lineHeight:1.6}}>
        {isDE?"Wir haben eine Bestätigungsmail gesendet an:":"We sent a confirmation email to:"}
      </p>
      <p style={{margin:"0 0 24px",fontSize:15,fontWeight:700,color:"#22c55e"}}>{registeredEmail}</p>
      <p style={{margin:"0 0 32px",fontSize:13,color:"#6b7280",lineHeight:1.6}}>
        {isDE?"Bitte bestätige deine E-Mail-Adresse um fortzufahren. Schau auch im Spam-Ordner nach.":"Please confirm your email address to continue. Also check your spam folder."}
      </p>
      <button onClick={()=>{setRegistered(false);setMode("login");}}
        style={{width:"100%",height:52,background:"#22c55e",border:"none",borderRadius:14,fontSize:15,fontWeight:800,color:"#fff",cursor:"pointer"}}>
        {isDE?"Zum Login":"Go to Login"}
      </button>
    </div>
  </div>
);
  return(
    <div style={{minHeight:"100vh",background:"#030712",color:"#fff",fontFamily:"system-ui,-apple-system,sans-serif",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"0 24px"}}>
      <div style={{width:"100%",maxWidth:400}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:40}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <img src="/logopng.png" alt="Nube" height={48} style={{height:48,borderRadius:10}}/>
            <div>
              <h1 style={{margin:0,fontSize:20,fontWeight:900,color:"#fff"}}>Nube</h1>
              <p style={{margin:0,fontSize:11,color:"#4b5563"}}>What food can do.</p>
            </div>
          </div>
          <button onClick={()=>setLang(l=>l==="en"?"de":"en")}
            style={{minWidth:44,minHeight:44,background:"#111827",border:"1px solid #374151",borderRadius:99,padding:"6px 14px",fontSize:13,fontWeight:600,color:"#d1d5db",cursor:"pointer"}}>
            <Globe size={15} style={{verticalAlign:"middle",marginRight:4}}/>{lang==="en"?"EN":"DE"}
          </button>
        </div>

        <h2 style={{margin:"0 0 8px",fontSize:24,fontWeight:900,color:"#fff"}}>
          {isDE?"Willkommen bei Nube":"Welcome to Nube"}
        </h2>
        <p style={{margin:"0 0 32px",fontSize:14,color:"#6b7280"}}>
          {isDE?"Tracke deine Ernährung und entdecke Synergien":"Track your nutrition and discover synergies"}
        </p>

        <div style={{display:"flex",gap:4,background:"#111827",borderRadius:12,padding:4,marginBottom:24}}>
          {["login","register"].map(m=>(
          <button key={m} onClick={()=>{setMode(m);setError("");setConfirmPassword("");}}
              style={{flex:1,minHeight:40,background:mode===m?"#1f2937":"transparent",border:"none",borderRadius:10,fontSize:13,fontWeight:700,color:mode===m?"#fff":"#6b7280",cursor:"pointer",transition:"all 0.2s"}}>
              {m==="login"?(isDE?"Anmelden":"Login"):(isDE?"Konto erstellen":"Create account")}
            </button>
          ))}
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:16}}>
          <div>
            <label style={{fontSize:12,fontWeight:600,color:"#9ca3af",display:"block",marginBottom:6}}>
              {isDE?"E-Mail":"Email"}
            </label>
            <input value={email} onChange={e=>setEmail(e.target.value)}
              type="email" autoComplete="email"
              placeholder={isDE?"deine@email.com":"your@email.com"}
              style={{width:"100%",padding:"12px 16px",borderRadius:12,border:"1px solid #1f2937",background:"#0f172a",fontSize:14,color:"#fff",outline:"none",boxSizing:"border-box"}}
              onFocus={e=>e.target.style.borderColor="#22c55e"}
              onBlur={e=>e.target.style.borderColor="#1f2937"}
              onKeyDown={e=>e.key==="Enter"&&handleSubmit()}/>
          </div>
          <div>
            <label style={{fontSize:12,fontWeight:600,color:"#9ca3af",display:"block",marginBottom:6}}>
              {isDE?"Passwort":"Password"}
            </label>
                  <div style={{position:"relative"}}>
                <input value={password} onChange={e=>setPassword(e.target.value)}
                  type={showPassword?"text":"password"} autoComplete={mode==="login"?"current-password":"new-password"}
                  placeholder={isDE?"Mindestens 8 Zeichen":"At least 8 characters"}
                  style={{width:"100%",padding:"12px 48px 12px 16px",borderRadius:12,border:"1px solid #1f2937",background:"#0f172a",fontSize:14,color:"#fff",outline:"none",boxSizing:"border-box"}}
                  onFocus={e=>e.target.style.borderColor="#22c55e"}
                  onBlur={e=>e.target.style.borderColor="#1f2937"}
                  onKeyDown={e=>e.key==="Enter"&&handleSubmit()}/>
                <button onClick={()=>setShowPassword(p=>!p)}
                  style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"transparent",border:"none",color:"#6b7280",cursor:"pointer",fontSize:16,padding:0,display:"flex",alignItems:"center"}}>
                  {showPassword?"🙈":"👁️"}
                </button>
              </div>
                </div>
                {mode==="register"&&(
        <div>
          <label style={{fontSize:12,fontWeight:600,color:"#9ca3af",display:"block",marginBottom:6}}>
            {isDE?"Passwort bestätigen":"Confirm Password"}
          </label>
          <div style={{position:"relative"}}>
            <input value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)}
              type={showConfirmPassword?"text":"password"}
              autoComplete="new-password"
              placeholder={isDE?"Passwort wiederholen":"Repeat password"}
              style={{width:"100%",padding:"12px 48px 12px 16px",borderRadius:12,border:"1px solid "+(confirmPassword&&confirmPassword!==password?"rgba(239,68,68,0.5)":confirmPassword&&confirmPassword===password?"rgba(34,197,94,0.5)":"#1f2937"),background:"#0f172a",fontSize:14,color:"#fff",outline:"none",boxSizing:"border-box"}}
              onFocus={e=>e.target.style.borderColor="#22c55e"}
              onBlur={e=>e.target.style.borderColor=confirmPassword&&confirmPassword!==password?"rgba(239,68,68,0.5)":confirmPassword&&confirmPassword===password?"rgba(34,197,94,0.5)":"#1f2937"}
              onKeyDown={e=>e.key==="Enter"&&handleSubmit()}/>
            <button onClick={()=>setShowConfirmPassword(p=>!p)}
              style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"transparent",border:"none",color:"#6b7280",cursor:"pointer",fontSize:16,padding:0,display:"flex",alignItems:"center"}}>
              {showConfirmPassword?"🙈":"👁️"}
            </button>
          </div>
          {confirmPassword&&confirmPassword!==password&&(
            <p style={{margin:"4px 0 0",fontSize:11,color:"#f87171"}}>
              {isDE?"Passwörter stimmen nicht überein":"Passwords do not match"}
            </p>
          )}
          {confirmPassword&&confirmPassword===password&&(
            <p style={{margin:"4px 0 0",fontSize:11,color:"#4ade80"}}>
              {isDE?"Passwörter stimmen überein ✓":"Passwords match ✓"}
            </p>
          )}
        </div>
      )}
          {mode==="register"&&password.length>0&&(
            <div style={{marginTop:8}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
                <div style={{flex:1,height:4,borderRadius:2,background:"#1f2937"}}>
                  <div style={{height:4,borderRadius:2,background:pwBarColor,width:`${pwScore*25}%`,transition:"width 0.3s ease,background 0.3s ease"}}/>
                </div>
                <span style={{fontSize:11,color:pwBarColor,marginLeft:8,fontWeight:600,minWidth:50}}>{pwBarLabel}</span>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:3,marginTop:6}}>
                {pwRules.map(r=>{
                  const met=r.test(password);
                  return(
                    <span key={r.key} style={{fontSize:11,color:met?"#4ade80":"#6b7280"}}>
                      {met?"✓":"✗"} {isDE?r.de:r.en}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {error&&(
          <div style={{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.3)",borderRadius:12,padding:"12px 16px",marginBottom:16}}>
            <p style={{margin:0,fontSize:13,color:"#fca5a5"}}>{error}</p>
          </div>
        )}
        <button onClick={handleSubmit} disabled={loading}
          style={{width:"100%",height:52,background:loading?"#166834":(mode==="register"&&!pwStrong)?"#1f2937":"#22c55e",border:(mode==="register"&&!pwStrong)?"1px solid #374151":"none",borderRadius:14,fontSize:15,fontWeight:800,color:(mode==="register"&&!pwStrong)?"#4b5563":"#fff",cursor:(loading||(mode==="register"&&!pwStrong))?"not-allowed":"pointer",transition:"background 0.2s",marginBottom:16}}>
          {loading?(isDE?"Laden...":"Loading..."):(mode==="login"?(isDE?"Anmelden":"Login"):(isDE?"Konto erstellen":"Create account"))}
        </button>

        <button onClick={onGuest}
          style={{width:"100%",background:"transparent",border:"none",color:"#4b5563",fontSize:13,cursor:"pointer",padding:"8px 0"}}>
          {isDE?"Ohne Konto fortfahren →":"Continue without account →"}
        </button>

        {mode==="register"&&(
          <p style={{fontSize:11,color:"#4b5563",textAlign:"center",marginTop:16,lineHeight:1.5}}>
            {isDE?"Mit der Registrierung stimmst du unserer Datenschutzerklärung zu.":"By registering you agree to our Privacy Policy."}
          </p>
        )}
      </div>
    </div>
  );
}
function AppDemo({lang}){
  const isDE=lang==="de";
  const [step,setStep]=useState(0);
  const [typed,setTyped]=useState("");
  const [tags,setTags]=useState([]);
  const [score,setScore]=useState(0);
  const [synergies,setSynergies]=useState([]);
  const [fadeOut,setFadeOut]=useState(false);

  const powerLabels=isDE
    ?["Ruhetag","Anfang gemacht","Aufbauend","Gute Basis","Starker Tag","Kraftpaket","Elite Fuel"]
    :["Rest Day","Getting Started","Building Up","Solid Foundation","Strong Day","Powerhouse","Elite Fuel"];

  const getPowerIdx=s=>s===0?0:s<20?1:s<40?2:s<55?3:s<70?4:s<85?5:6;
  const getRingColor=s=>{
    if(s<20)return"#9ca3af";
    if(s<40)return"#22c55e";
    if(s<70)return"#3b82f6";
    return"#8b5cf6";
  };

  const typeWord=useCallback((word,onDone)=>{
    let i=0;
    setTyped("");
    const iv=setInterval(()=>{
      i++;
      setTyped(word.slice(0,i));
      if(i>=word.length){clearInterval(iv);setTimeout(onDone,400);}
    },80);
    return()=>clearInterval(iv);
  },[]);

  useEffect(()=>{
    let cancelled=false;
    const run=async()=>{
      setStep(0);setTyped("");setTags([]);setScore(0);setSynergies([]);setFadeOut(false);
      await new Promise(r=>setTimeout(r,1000));
      if(cancelled)return;

      // Step 2 — type Spinach
      await new Promise(r=>typeWord(isDE?"Spinat":"Spinach",r));
      if(cancelled)return;

      // Step 3 — add Spinach
      setTyped("");
      setTags([{emoji:"🥬",label:isDE?"Spinat":"Spinach",bg:"#dcfce7",color:"#15803d"}]);
      setScore(28);
      await new Promise(r=>setTimeout(r,1000));
      if(cancelled)return;

      // Step 4 — type Lemon
      await new Promise(r=>typeWord(isDE?"Zitrone":"Lemon",r));
      if(cancelled)return;

      // Step 5 — add Lemon + synergy
      setTyped("");
      setTags(p=>[...p,{emoji:"🍋",label:isDE?"Zitrone":"Lemon",bg:"#ffedd5",color:"#c2410c"}]);
      setScore(52);
      setSynergies([{
        title:isDE?"⚡ Synergie! Eisenaufnahme x4":"⚡ Synergy unlocked! Iron absorption x4",
        desc:isDE?"Vitamin C aus der Zitrone maximiert die Eisenaufnahme":"Vitamin C from lemon supercharges iron absorption"
      }]);
      await new Promise(r=>setTimeout(r,1500));
      if(cancelled)return;

      // Step 6 — type Turmeric
      await new Promise(r=>typeWord(isDE?"Kurkuma":"Turmeric",r));
      if(cancelled)return;

      // Step 7 — add Turmeric
      setTyped("");
      setTags(p=>[...p,{emoji:"🌿",label:isDE?"Kurkuma":"Turmeric",bg:"#ede9fe",color:"#6d28d9"}]);
      setScore(71);
      await new Promise(r=>setTimeout(r,1000));
      if(cancelled)return;

      // Step 8 — type Black Pepper
      await new Promise(r=>typeWord(isDE?"Schwarzer Pfeffer":"Black Pepper",r));
      if(cancelled)return;

      // Step 9 — add Black Pepper + synergy
      setTyped("");
      setTags(p=>[...p,{emoji:"🌶️",label:isDE?"Schwarzer Pfeffer":"Black Pepper",bg:"#ede9fe",color:"#6d28d9"}]);
      setScore(82);
      setSynergies(p=>[...p,{
        title:isDE?"⚡ Synergie! Curcumin x20":"⚡ Synergy unlocked! Curcumin x20",
        desc:isDE?"Schwarzer Pfeffer steigert Curcumin-Aufnahme um 2000%":"Black pepper increases curcumin absorption by 2000%"
      }]);
      await new Promise(r=>setTimeout(r,3000));
      if(cancelled)return;

      // Step 11 — fade out and reset
      setFadeOut(true);
      await new Promise(r=>setTimeout(r,800));
      if(cancelled)return;
    };
    const loop=async()=>{if(!cancelled){await run();if(!cancelled)loop();}};
    loop();
    return()=>{cancelled=true;};
  },[lang]);

  const ringColor=getRingColor(score);
  const r=34,circ=2*Math.PI*r,dash=(score/100)*circ;

  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",marginBottom:24}}>
      <div style={{opacity:fadeOut?0:1,transition:"opacity 0.8s ease",width:"100%",maxWidth:280,minHeight:280,background:"#0f172a",border:"1px solid #1f2937",borderRadius:28,padding:16,boxShadow:"0 0 40px rgba(34,197,94,0.1)"}}>

        {/* Mini score ring */}
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
          <div style={{position:"relative",width:80,height:80,flexShrink:0}}>
            <svg style={{width:"100%",height:"100%",transform:"rotate(-90deg)"}} viewBox="0 0 80 80">
              <circle cx="40" cy="40" r={r} fill="none" stroke="#1f2937" strokeWidth="7"/>
              <circle cx="40" cy="40" r={r} fill="none" stroke={ringColor} strokeWidth="7"
                strokeDasharray={`${dash} ${circ-dash}`} strokeLinecap="round"
                style={{transition:"stroke-dasharray 0.8s ease,stroke 0.5s ease"}}/>
            </svg>
            <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
              <span style={{fontSize:16,fontWeight:900,color:ringColor,lineHeight:1}}>{score}</span>
              <span style={{fontSize:8,color:"#6b7280"}}>/ 100</span>
            </div>
          </div>
          <div style={{flex:1}}>
            <p style={{margin:0,fontSize:11,fontWeight:700,color:ringColor}}>{powerLabels[getPowerIdx(score)]}</p>
            <p style={{margin:"4px 0 0",fontSize:10,color:"#4b5563"}}>{isDE?"Heutiger Score":"Today's score"}</p>
          </div>
        </div>

        {/* Search bar */}
        <div style={{background:"#111827",border:"1px solid #374151",borderRadius:10,padding:"8px 12px",marginBottom:10,fontSize:12,color:typed?"#fff":"#4b5563",minHeight:34,display:"flex",alignItems:"center"}}>
          {typed||<span style={{color:"#374151"}}>{isDE?"Lebensmittel hinzufügen...":"Add a food..."}</span>}
          {typed&&<span style={{opacity:1,animation:"blink 1s infinite",marginLeft:1}}>|</span>}
        </div>

        {/* Food tags */}
        {tags.length>0&&(
          <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:10}}>
            {tags.map((tag,i)=>(
              <span key={i} style={{fontSize:10,padding:"3px 8px",borderRadius:99,background:tag.bg,color:tag.color,fontWeight:700,animation:"fadeSlideIn 0.3s ease both"}}>
                {tag.emoji} {tag.label}
              </span>
            ))}
          </div>
        )}

        {/* Synergy badges */}
        {synergies.map((syn,i)=>(
          <div key={i} style={{background:"rgba(120,53,15,0.4)",border:"1px solid rgba(180,83,9,0.4)",borderRadius:10,padding:"8px 10px",marginBottom:6,animation:"fadeSlideIn 0.4s ease both"}}>
            <p style={{margin:"0 0 3px",fontSize:10,fontWeight:700,color:"#fbbf24"}}>{syn.title}</p>
            <p style={{margin:0,fontSize:9,color:"#6b7280",lineHeight:1.4}}>{syn.desc}</p>
          </div>
        ))}
      </div>
      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
    </div>
  );
}
function LandingPage({lang,setLang,onEnter,setShowImpressum,setShowPrivacy,setShowContact,setShowAbout}){
  const isDE=lang==="de";
  const isDesktop=window.innerWidth>=900;
  return(
    <div style={{minHeight:"100vh",background:"#030712",color:"#fff",fontFamily:"system-ui,-apple-system,sans-serif",paddingBottom:40}}>
      <style>{`
        @keyframes fadeSlideIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .land-section{animation:fadeSlideIn 0.5s ease both}
        .land-btn:hover{transform:scale(1.02);filter:brightness(1.08)}
        .land-btn{transition:transform 0.2s ease,filter 0.2s ease}
      `}</style>

      {isDesktop?(
        // DESKTOP LAYOUT
        <div style={{maxWidth:1200,margin:"0 auto",padding:"0 40px"}}>
          {/* HEADER */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingTop:24,paddingBottom:32}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <img src="/logopng.png" alt="Nube" height={48} style={{height:48,borderRadius:10}}/>
              <div>
                <h1 style={{margin:0,fontSize:20,fontWeight:900,color:"#fff"}}>Nube</h1>
                <p style={{margin:0,fontSize:11,color:"#4b5563"}}>Nutrition Benefits</p>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <button onClick={()=>setLang(l=>l==="en"?"de":"en")}
                style={{minWidth:44,minHeight:44,background:"#111827",border:"1px solid #374151",borderRadius:99,padding:"6px 14px",fontSize:13,fontWeight:600,color:"#d1d5db",cursor:"pointer"}}>
                <Globe size={15} style={{verticalAlign:"middle",marginRight:4}}/>{lang==="en"?"EN":"DE"}
              </button>
              <button onClick={onEnter} className="land-btn"
                style={{height:44,background:"#22c55e",border:"none",borderRadius:12,padding:"0 24px",fontSize:13,fontWeight:800,color:"#fff",cursor:"pointer"}}>
                {isDE?"App öffnen →":"Open app →"}
              </button>
            </div>
          </div>

          {/* MAIN SPLIT */}
          <div style={{display:"flex",gap:48,alignItems:"flex-start",marginBottom:48}}>

            {/* LEFT */}
            <div style={{flex:"1"}}>
              <div className="land-section" style={{animationDelay:"0.1s"}}>
                <h2 style={{margin:"0 0 16px",fontSize:52,fontWeight:900,color:"#fff",lineHeight:1.1}}>
                  {isDE?"Was Essen\nkann.":"What food\ncan do."}
                </h2>
                <p style={{margin:"0 0 32px",fontSize:16,color:"#9ca3af",lineHeight:1.7,maxWidth:480}}>
                  {isDE?"Die meisten zählen Kalorien. Nube trackt was wirklich zählt — Vitamine, Mineralstoffe und die wissenschaftlich belegten Synergien zwischen Lebensmitteln.":"Most people count calories. Nube tracks what actually matters — vitamins, minerals and the science-backed synergies between foods that multiply their benefits."}
                </p>
                <button className="land-btn" onClick={onEnter}
                  style={{height:56,background:"#22c55e",border:"none",borderRadius:16,padding:"0 40px",fontSize:16,fontWeight:800,color:"#fff",cursor:"pointer",marginBottom:48}}>
                  {isDE?"Ernährung entdecken →":"Discover your nutrition →"}
                </button>
              </div>

              {/* FEATURE CARDS */}
              <div className="land-section" style={{animationDelay:"0.2s",display:"flex",flexDirection:"column",gap:12}}>
                {[
                  {icon:Microscope,en:{t:"Science-backed",d:"Every benefit, every synergy is rooted in nutritional science. Not trends."},de:{t:"Wissenschaftlich belegt",d:"Jeder Benefit, jede Synergie basiert auf Ernährungswissenschaft."}},
                  {icon:Utensils,en:{t:"Whole foods only",d:"No supplements, no processed food scores. Real food, real benefits."},de:{t:"Nur Vollwertkost",d:"Keine Supplements. Echte Lebensmittel, echte Benefits."}},
                  {icon:Zap,en:{t:"Synergy detection",d:"Discover which foods multiply each other's benefits when eaten together."},de:{t:"Synergie-Erkennung",d:"Entdecke welche Lebensmittel sich gegenseitig verstärken."}},
                ].map((f,i)=>(
                  <div key={i} style={{background:"#0f172a",borderRadius:16,padding:"16px 18px",display:"flex",alignItems:"flex-start",gap:14}}>
                    <span style={{flexShrink:0,color:"#9ca3af"}}>{(()=>{const I=f.icon;return <I size={24}/>;})()}</span>
                    <div>
                      <p style={{margin:"0 0 4px",fontSize:13,fontWeight:800,color:"#f9fafb"}}>{isDE?f.de.t:f.en.t}</p>
                      <p style={{margin:0,fontSize:12,color:"#6b7280",lineHeight:1.6}}>{isDE?f.de.d:f.en.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT */}
            <div style={{flex:"0 0 480px",display:"flex",flexDirection:"column",gap:16}}>
              {/* APP DEMO */}
              <div className="land-section" style={{animationDelay:"0.15s"}}>
                <p style={{fontSize:11,fontWeight:600,color:"#f9fafb",opacity:0.5,textTransform:"uppercase",letterSpacing:"2px",marginBottom:12}}>
                  {isDE?"Sieh es in Aktion":"See it in action"}
                </p>
                <AppDemo lang={lang}/>
              </div>

              {/* SYNERGY CARDS */}
              <div className="land-section" style={{animationDelay:"0.25s",display:"flex",flexDirection:"column",gap:8}}>
                <p style={{fontSize:11,fontWeight:600,color:"#f9fafb",opacity:0.5,textTransform:"uppercase",letterSpacing:"2px",marginBottom:4}}>
                  {isDE?"Wissenschaftlich belegte Synergien":"Science-backed synergies"}
                </p>
                {[
                  {emoji:"🌶️+🌿",title:isDE?"Schwarzer Pfeffer + Kurkuma":"Black Pepper + Turmeric",desc:isDE?"Curcumin-Aufnahme x20":"Curcumin absorption x20",color:"#f59e0b",bg:"rgba(120,53,15,0.3)",border:"rgba(180,83,9,0.4)"},
                  {emoji:"🍊+🥩",title:isDE?"Vitamin C + Eisen":"Vitamin C + Iron",desc:isDE?"Eisenaufnahme x4":"Iron absorption x4",color:"#f97316",bg:"rgba(124,45,18,0.3)",border:"rgba(194,65,12,0.4)"},
                  {emoji:"🥑+🥗",title:isDE?"Avocado + Vitamine":"Avocado + Vitamins",desc:isDE?"A/E/K Aufnahme x5":"A/E/K absorption x5",color:"#22c55e",bg:"rgba(20,83,45,0.3)",border:"rgba(22,163,74,0.4)"},
                ].map((s,i)=>(
                  <div key={i} style={{background:s.bg,border:`1px solid ${s.border}`,borderRadius:14,padding:"12px 16px",display:"flex",alignItems:"center",gap:12}}>
                    <span style={{fontSize:18}}>{s.emoji}</span>
                    <div>
                      <p style={{margin:0,fontSize:12,fontWeight:700,color:s.color}}>{s.title}</p>
                      <p style={{margin:"2px 0 0",fontSize:11,color:"#9ca3af"}}>{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* HEALTH GOALS */}
          <div className="land-section" style={{animationDelay:"0.3s",marginBottom:32}}>
            <p style={{fontSize:11,fontWeight:600,color:"#f9fafb",opacity:0.5,textTransform:"uppercase",letterSpacing:"2px",marginBottom:12}}>
              {isDE?"Tracke was dein Körper braucht":"Track what your body needs"}
            </p>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {[
                {icon:Activity,en:"Gut Health",de:"Darmgesundheit"},
                {icon:Zap,en:"Energy & Focus",de:"Energie & Fokus"},
                {icon:Shield,en:"Immune System",de:"Immunsystem"},
                {icon:Dumbbell,en:"Muscle & Strength",de:"Muskel & Kraft"},
                {icon:Heart,en:"Heart Health",de:"Herzgesundheit"},
                {icon:Bone,en:"Bone Health",de:"Knochengesundheit"},
                {icon:Sparkles,en:"Skin & Glow",de:"Haut & Glow"},
                {icon:Moon,en:"Sleep & Recovery",de:"Schlaf & Erholung"},
              ].map(g=>(
                <div key={g.en} style={{display:"flex",alignItems:"center",gap:6,background:"#0f172a",border:"1px solid #1f2937",borderRadius:99,padding:"8px 14px"}}>
                  {(()=>{const I=g.icon;return <I size={14} style={{color:"#9ca3af"}}/>;})()}
                  <span style={{fontSize:12,fontWeight:600,color:"#d1d5db"}}>{isDE?g.de:g.en}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA + FOOTER */}
          <div className="land-section" style={{animationDelay:"0.4s",textAlign:"center",borderTop:"1px solid #111827",paddingTop:32,marginBottom:24}}>
            <p style={{fontSize:18,fontWeight:800,color:"#f9fafb",marginBottom:16}}>
              {isDE?"Bereit zu entdecken was Essen kann?":"Ready to discover what food can do?"}
            </p>
            <button className="land-btn" onClick={onEnter}
              style={{height:52,background:"#22c55e",border:"none",borderRadius:16,padding:"0 40px",fontSize:15,fontWeight:800,color:"#fff",cursor:"pointer",marginBottom:32}}>
              {isDE?"Jetzt tracken — kostenlos →":"Start tracking — it's free →"}
            </button>
            <div style={{display:"flex",justifyContent:"center",flexWrap:"wrap",gap:20}}>
              {[
                {label:"Impressum",onClick:()=>setShowImpressum(true)},
                {label:isDE?"Datenschutz":"Privacy Policy",onClick:()=>setShowPrivacy(true)},
                {label:isDE?"Kontakt":"Contact",onClick:()=>setShowContact(true)},
                {label:isDE?"Über uns":"About",onClick:()=>setShowAbout(true)},
              ].map(b=>(
                <button key={b.label} onClick={b.onClick}
                  style={{background:"transparent",border:"none",color:"#4b5563",fontSize:11,cursor:"pointer",padding:0}}>
                  {b.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ):(
      // MOBILE LAYOUT — unchanged
      <div style={{maxWidth:520,margin:"0 auto",padding:"0 16px"}}>

        {/* HEADER */}
        <div className="land-section" style={{animationDelay:"0s",display:"flex",alignItems:"center",justifyContent:"space-between",paddingTop:"calc(20px + env(safe-area-inset-top))",paddingBottom:24}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <img src="/logopng.png" alt="Nube" height={48} style={{height:48,borderRadius:10}}/>
            <div>
              <h1 style={{margin:0,fontSize:20,fontWeight:900,color:"#fff"}}>Nube</h1>
              <p style={{margin:0,fontSize:11,color:"#4b5563"}}>Nutrition Benefits</p>
            </div>
          </div>
          <button onClick={()=>setLang(l=>l==="en"?"de":"en")}
            style={{minWidth:44,minHeight:44,background:"#111827",border:"1px solid #374151",borderRadius:99,padding:"6px 14px",fontSize:13,fontWeight:600,color:"#d1d5db",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Globe size={15} style={{verticalAlign:"middle",marginRight:4}}/>{lang==="en"?"EN":"DE"}
          </button>
        </div>

        {/* HERO */}
        <div className="land-section" style={{animationDelay:"0.1s",marginBottom:32}}>
          <h2 style={{margin:"0 0 16px",fontSize:36,fontWeight:900,color:"#fff",lineHeight:1.15}}>
            {isDE?"Was Essen kann.":"What food can do."}
          </h2>
          <p style={{margin:"0 0 28px",fontSize:15,color:"#9ca3af",lineHeight:1.7}}>
            {isDE
              ?"Die meisten zählen Kalorien. Nube trackt was wirklich zählt — Vitamine, Mineralstoffe und die wissenschaftlich belegten Synergien zwischen Lebensmitteln."
              :"Most people count calories. Nube tracks what actually matters — vitamins, minerals and the science-backed synergies between foods that multiply their benefits."}
          </p>
          <button className="land-btn" onClick={onEnter}
            style={{width:"100%",height:52,background:"#22c55e",border:"none",borderRadius:16,fontSize:15,fontWeight:800,color:"#fff",cursor:"pointer"}}>
            {isDE?"Ernährung entdecken →":"Discover your nutrition →"}
          </button>
        </div>

        {/* SYNERGY HIGHLIGHT */}
        <div className="land-section" style={{animationDelay:"0.2s",background:"#0f172a",border:"1px solid rgba(245,158,11,0.4)",borderRadius:20,padding:20,marginBottom:24}}>
          <p style={{margin:"0 0 8px",fontSize:13,fontWeight:800,color:"#fbbf24"}}>
            <Zap size={14} style={{verticalAlign:"middle",marginRight:4}}/>{isDE?"Schwarzer Pfeffer + Kurkuma = Curcumin-Aufnahme x20":"Black Pepper + Turmeric = Curcumin absorption x20"}
          </p>
          <p style={{margin:"0 0 12px",fontSize:12,color:"#9ca3af",lineHeight:1.6}}>
            {isDE
              ?"Eine Prise schwarzer Pfeffer steigert die Curcumin-Bioverfügbarkeit um 2000%. Nube zeigt dir diese versteckten Verbindungen."
              :"A pinch of black pepper increases curcumin bioavailability by 2000%. Nube shows you these hidden connections."}
          </p>
          <div style={{display:"flex",gap:8}}>
            {["🌶️ Black Pepper","🌿 Turmeric"].map(f=>(
              <span key={f} style={{fontSize:11,padding:"4px 12px",borderRadius:99,background:"rgba(245,158,11,0.12)",border:"1px solid rgba(245,158,11,0.3)",color:"#fbbf24",fontWeight:600}}>{f}</span>
            ))}
          </div>
        </div>
        {/* APP DEMO */}
        <div className="land-section" style={{animationDelay:"0.25s",marginBottom:24}}>
          <p style={{fontSize:11,fontWeight:600,color:"#f9fafb",opacity:0.5,textTransform:"uppercase",letterSpacing:"2px",marginBottom:12}}>
            {isDE?"Sieh es in Aktion":"See it in action"}
          </p>
          <AppDemo lang={lang}/>
        </div>
        {/* FEATURE CARDS */}
        <div className="land-section" style={{animationDelay:"0.3s",marginBottom:24}}>
          {[
            {icon:Microscope,en:{t:"Science-backed",d:"Every benefit, every synergy is rooted in nutritional science. Not trends."},de:{t:"Wissenschaftlich belegt",d:"Jeder Benefit, jede Synergie basiert auf Ernährungswissenschaft. Keine Trends."}},
            {icon:Utensils,en:{t:"Whole foods only",d:"No supplements, no processed food scores. Real food, real benefits."},de:{t:"Nur Vollwertkost",d:"Keine Supplements, keine Fertigkost-Scores. Echte Lebensmittel, echte Benefits."}},
            {icon:Zap,en:{t:"Synergy detection",d:"Discover which foods multiply each other's benefits when eaten together."},de:{t:"Synergie-Erkennung",d:"Entdecke welche Lebensmittel sich gegenseitig verstärken wenn du sie zusammen isst."}},
          ].map((f,i)=>(
            <div key={i} style={{background:"#0f172a",borderRadius:16,padding:"16px 18px",marginBottom:10,display:"flex",alignItems:"flex-start",gap:14}}>
              <span style={{flexShrink:0,color:"#9ca3af"}}>{(()=>{const I=f.icon;return <I size={24}/>;})()}</span>
              <div>
                <p style={{margin:"0 0 4px",fontSize:13,fontWeight:800,color:"#f9fafb"}}>{isDE?f.de.t:f.en.t}</p>
                <p style={{margin:0,fontSize:12,color:"#6b7280",lineHeight:1.6}}>{isDE?f.de.d:f.en.d}</p>
              </div>
            </div>
          ))}
        </div>

        {/* HEALTH GOALS PREVIEW */}
        <div className="land-section" style={{animationDelay:"0.4s",marginBottom:32}}>
          <p style={{fontSize:11,fontWeight:600,color:"#f9fafb",opacity:0.5,textTransform:"uppercase",letterSpacing:"2px",marginBottom:12}}>
            {isDE?"Tracke was dein Körper braucht":"Track what your body needs"}
          </p>
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {[
              {icon:Activity,en:"Gut Health",de:"Darmgesundheit"},
              {icon:Zap,en:"Energy & Focus",de:"Energie & Fokus"},
              {icon:Shield,en:"Immune System",de:"Immunsystem"},
              {icon:Dumbbell,en:"Muscle & Strength",de:"Muskel & Kraft"},
            ].map(g=>(
              <div key={g.en} style={{display:"flex",alignItems:"center",gap:6,background:"#0f172a",border:"1px solid #1f2937",borderRadius:99,padding:"8px 14px"}}>
                {(()=>{const I=g.icon;return <I size={14} style={{color:"#9ca3af"}}/>;})()}
                <span style={{fontSize:12,fontWeight:600,color:"#d1d5db"}}>{isDE?g.de:g.en}</span>
              </div>
            ))}
          </div>
        </div>

        {/* FINAL CTA */}
        <div className="land-section" style={{animationDelay:"0.5s",marginBottom:40,textAlign:"center"}}>
          <p style={{fontSize:16,fontWeight:800,color:"#f9fafb",marginBottom:16}}>
            {isDE?"Bereit zu entdecken was Essen kann?":"Ready to discover what food can do?"}
          </p>
          <button className="land-btn" onClick={onEnter}
            style={{width:"100%",height:52,background:"#22c55e",border:"none",borderRadius:16,fontSize:15,fontWeight:800,color:"#fff",cursor:"pointer"}}>
            {isDE?"Jetzt tracken — kostenlos →":"Start tracking — it's free →"}
          </button>
        </div>
        {/* BUY ME A COFFEE */}
        <div style={{borderTop:"1px solid #111827",padding:"32px 16px",textAlign:"center"}}>
          <div style={{maxWidth:360,margin:"0 auto"}}>
            <p style={{margin:"0 0 8px",fontSize:16,fontWeight:800,color:"#f9fafb"}}>
              {isDE?"Nube ist kostenlos — und bleibt es auch.":"Nube is free — and always will be."}
            </p>
            <p style={{margin:"0 0 20px",fontSize:13,color:"#6b7280",lineHeight:1.6}}>
              {isDE?"Wenn es dir hilft besser zu essen, kannst du uns einen Kaffee ausgeben. Kein Druck, nur Liebe. ☕":"If it helps you eat better, you can buy us a coffee. No pressure, just love. ☕"}
            </p>
            <button
              onClick={()=>window.open("https://buymeacoffee.com/DEIN_LINK","_blank")}
              style={{background:"#1f2937",border:"1px solid #374151",borderRadius:99,padding:"12px 24px",fontSize:14,fontWeight:700,color:"#d1d5db",cursor:"pointer",transition:"background 0.2s"}}
              onMouseEnter={e=>e.currentTarget.style.background="#374151"}
              onMouseLeave={e=>e.currentTarget.style.background="#1f2937"}>
              {isDE?"☕ Einen Kaffee ausgeben":"☕ Buy us a coffee"}
            </button>
          </div>
        </div>
        {/* FOOTER */}
        <div style={{display:"flex",justifyContent:"center",flexWrap:"wrap",gap:16,paddingBottom:"calc(16px + env(safe-area-inset-bottom))"}}>
          {[
            {label:"Impressum",onClick:()=>setShowImpressum(true)},
            {label:isDE?"Datenschutz":"Privacy Policy",onClick:()=>setShowPrivacy(true)},
            {label:isDE?"Kontakt":"Contact",onClick:()=>setShowContact(true)},
            {label:isDE?"Über uns":"About",onClick:()=>setShowAbout(true)},
          ].map(b=>(
            <button key={b.label} onClick={b.onClick}
              style={{background:"transparent",border:"none",color:"#4b5563",fontSize:11,cursor:"pointer",padding:0}}>
              {b.label}
            </button>
          ))}
        </div>

     </div>
      )}
    </div>
  );
}
function usePullToRefresh(onRefresh){
  const startY=useRef(null);const [pulling,setPulling]=useState(0);const [refreshing,setRefreshing]=useState(false);
  const onTouchStart=e=>{if(window.scrollY===0)startY.current=e.touches[0].clientY;};
  const onTouchMove=e=>{if(startY.current===null)return;setPulling(Math.min(Math.max(0,e.touches[0].clientY-startY.current),72));};
  const onTouchEnd=()=>{if(pulling>56){setRefreshing(true);setTimeout(()=>{onRefresh();setRefreshing(false);setPulling(0);startY.current=null;},600);}else{setPulling(0);startY.current=null;}};
  return{pulling,refreshing,handlers:{onTouchStart,onTouchMove,onTouchEnd}};
}

function PreferencesModal({lang,preferences,setPreferences,onClose}){
  const t=T[lang];
  const [draft,setDraft]=useState({...preferences,excludedFoods:[...preferences.excludedFoods]});
  const sheetRef=useRef(null);
  const startY=useRef(null),curY=useRef(0);
  const [closing,setClosing]=useState(false);
  const onTS=e=>{startY.current=e.touches[0].clientY;};
  const onTM=e=>{const dy=e.touches[0].clientY-startY.current;if(dy<0)return;curY.current=dy;if(sheetRef.current)sheetRef.current.style.transform=`translateY(${dy}px)`;};
  const onTE=()=>{if(curY.current>80){setClosing(true);setTimeout(onClose,200);}else if(sheetRef.current)sheetRef.current.style.transform="translateY(0)";curY.current=0;};
  const dietIcons={all:UtensilsCrossed,vegetarian:Leaf,vegan:Sprout,pescatarian:Fish};
  const diets=[
    {key:"all",label:t.dietAll},{key:"vegetarian",label:t.dietVegetarian},
    {key:"vegan",label:t.dietVegan},{key:"pescatarian",label:t.dietPescatarian},
  ];
  return(
    <div style={{position:"fixed",inset:0,zIndex:155,display:"flex",alignItems:"flex-end"}} onClick={()=>{setClosing(true);setTimeout(onClose,200);}}>
      <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.7)",backdropFilter:"blur(16px)"}}/>
      <div ref={sheetRef} onClick={e=>e.stopPropagation()} onTouchStart={onTS} onTouchMove={onTM} onTouchEnd={onTE}
        style={{position:"relative",background:"#111827",border:"1px solid #374151",borderRadius:"24px 24px 0 0",width:"100%",maxWidth:520,margin:"0 auto",paddingBottom:"calc(28px + env(safe-area-inset-bottom))",boxShadow:"0 -8px 48px rgba(0,0,0,0.7)",maxHeight:"85vh",overflowY:"auto",transition:closing?"transform 0.2s ease":"none"}}>
        <div style={{display:"flex",justifyContent:"center",padding:"12px 0 4px"}}><div style={{width:36,height:4,borderRadius:2,background:"#374151"}}/></div>
        <div style={{padding:"8px 20px 20px"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
            <h3 style={{margin:0,fontSize:16,fontWeight:900,color:"#f9fafb"}}>{t.preferencesTitle}</h3>
            <button onClick={()=>{setClosing(true);setTimeout(onClose,200);}} style={{minWidth:44,minHeight:44,background:"transparent",border:"none",color:"#6b7280",fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
          </div>
          <p style={{margin:"0 0 10px",fontSize:11,fontWeight:600,color:"#f9fafb",opacity:0.5,textTransform:"uppercase",letterSpacing:"2px"}}>{t.dietLabel}</p>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:24}}>
            {diets.map(d=>(
              <button key={d.key} onClick={()=>setDraft(p=>({...p,diet:d.key}))}
                style={{padding:"8px 16px",borderRadius:99,border:"none",background:draft.diet===d.key?"#22c55e":"#1f2937",color:draft.diet===d.key?"#fff":"#9ca3af",fontWeight:700,fontSize:13,cursor:"pointer",transition:"all 0.15s",display:"flex",alignItems:"center",gap:6}}>
                {(()=>{const I=dietIcons[d.key];return I?<I size={14} style={{flexShrink:0}}/>:null;})()}
                {d.label}
              </button>
            ))}
          </div>
          {draft.excludedFoods.length>0&&(
            <>
              <p style={{margin:"0 0 10px",fontSize:11,fontWeight:600,color:"#f9fafb",opacity:0.5,textTransform:"uppercase",letterSpacing:"2px"}}>{t.hiddenFoods}</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:12}}>
                {draft.excludedFoods.map(key=>{
                  const f=FOOD_BY_EN[key];
                  return(
                    <div key={key} style={{display:"flex",alignItems:"center",gap:6,background:"#1f2937",border:"1px solid #374151",borderRadius:99,padding:"6px 12px"}}>
                      <span style={{fontSize:12,fontWeight:600,color:"#e5e7eb"}}>{f?f[lang]:key}</span>
                      <button onClick={()=>setDraft(p=>({...p,excludedFoods:p.excludedFoods.filter(k=>k!==key)}))}
                        style={{background:"transparent",border:"none",color:"#6b7280",cursor:"pointer",padding:0,fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",minWidth:20,minHeight:20}}>✕</button>
                    </div>
                  );
                })}
              </div>
              <button onClick={()=>setDraft(p=>({...p,excludedFoods:[]}))}
                style={{width:"100%",background:"transparent",border:"1px solid #374151",borderRadius:10,padding:"8px 16px",fontSize:12,fontWeight:600,color:"#9ca3af",cursor:"pointer",marginBottom:20}}>
                {t.clearExcluded}
              </button>
            </>
          )}
          <button onClick={()=>{setPreferences(draft);setClosing(true);setTimeout(onClose,200);}}
            style={{width:"100%",minHeight:48,background:"#22c55e",border:"none",borderRadius:14,fontSize:14,fontWeight:800,color:"#fff",cursor:"pointer"}}>
            {t.savePreferences}
          </button>
        </div>
      </div>
    </div>
  );
}
export default function App(){
  const [lang,setLang]=useState("en");
  const t=T[lang];
  const [query,setQuery]=useState("");
  const [suggestions,setSuggestions]=useState([]);
  const [added,setAdded]=useState([]);
  const [newKey,setNewKey]=useState(null);
  const [activeTab,setActiveTab]=useState("today");
  const [selNutrient,setSelNutrient]=useState(null);
  const [selBenefit,setSelBenefit]=useState(null);
  const [showSynergyModal,setShowSynergyModal]=useState(false);
  const [history,setHistory]=useState({});
  const [histLoaded,setHistLoaded]=useState(false);
  const [toast,setToast]=useState(null);
  const [shownMS,setShownMS]=useState(new Set());
  const [confetti,setConfetti]=useState(false);
  const [confirmRemove,setConfirmRemove]=useState(null);
  const [editDay,setEditDay]=useState(null);
  const [browseQuery,setBrowseQuery]=useState("");
  const [openCats,setOpenCats]=useState({Protein:true});
  const [showAccountMenu,setShowAccountMenu]=useState(false);
  const [adminMode,setAdminMode]=useState(false);
  const [adminInput,setAdminInput]=useState("");
  const [missingFoods,setMissingFoods]=useState({});
  const [showImpressum,setShowImpressum]=useState(false);
  const [showPrivacy,setShowPrivacy]=useState(false);
  const [showContact,setShowContact]=useState(false);
  const [user,setUser]=useState(null);
  const [authChecked,setAuthChecked]=useState(false);
  const [isGuest,setIsGuest]=useState(false);
  const [authLoading,setAuthLoading]=useState(true);
  const [showLanding,setShowLanding]=useState(()=>{
  try{return localStorage.getItem("wft-visited")!=="1";}catch{return true;}
  });
  const [showAbout,setShowAbout]=useState(false);
  const [isPremium,setIsPremium]=useState(false);
  const [showUpgradeModal,setShowUpgradeModal]=useState(false);
  const [billingYearly,setBillingYearly]=useState(true);
  const [preferences,setPreferences]=useState({diet:"all",excludedFoods:[]});
  const [showPreferences,setShowPreferences]=useState(false);
  const prevScore=useRef(0);
  const {offline,visible:offlineVisible}=useOffline();
  const {show:showInstall,install,dismiss:dismissInstall,isNative}=useInstallPrompt();
  const filteredFoods=FOODS.filter(f=>{
    if(preferences.excludedFoods.includes(f.en))return false;
    if(preferences.diet==="vegetarian"&&VEGETARIAN_HIDE.has(f.en))return false;
    if(preferences.diet==="vegan"&&(VEGETARIAN_HIDE.has(f.en)||f.cat==="Dairy"||VEGAN_EXTRA_HIDE.has(f.en)))return false;
    if(preferences.diet==="pescatarian"&&PESCATARIAN_HIDE.has(f.en))return false;
    return true;
  });
  const filteredFoodKeys=new Set(filteredFoods.map(f=>f.en));

  useEffect(()=>{
  supabase.auth.getSession().then(({data:{session}})=>{
    setUser(session?.user||null);
    setIsPremium(session?.user?.user_metadata?.isPremium===true);
    setAuthChecked(true);
    setAuthLoading(false);
  });
  const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,session)=>{
    setUser(session?.user||null);
    setIsPremium(session?.user?.user_metadata?.isPremium===true);
    setAuthChecked(true);
    setAuthLoading(false);
  });
  return()=>subscription.unsubscribe();
},[]);
useEffect(()=>{
  const loadData=async()=>{
    if(user&&!isGuest){
      try{
        const{data,error}=await supabase.from("user_data").select("*").eq("user_id",user.id).single();
        if(data&&!error){
          if(data.history)setHistory(data.history);
          if(data.foods_today&&data.date===todayKey())setAdded(data.foods_today);
          if(data.milestones)setShownMS(new Set(data.milestones));
          if(data.preferences)setPreferences(data.preferences);
          setHistLoaded(true);return;
        }
      }catch(e){console.error("Load error:",e);}
    }
    try{const r=localStorage.getItem("wft-hist4");if(r)setHistory(JSON.parse(r));}catch{}
    try{const r=localStorage.getItem("wft-today4");if(r){const d=JSON.parse(r);if(d.date===todayKey())setAdded(d.foods||[]);}}catch{}
    try{const r=localStorage.getItem("wft-ms2");if(r)setShownMS(new Set(JSON.parse(r)));}catch{}
    try{const r=localStorage.getItem("nube-preferences");if(r)setPreferences(JSON.parse(r));}catch{}
    setHistLoaded(true);
  };
  if(authChecked)loadData();
},[authChecked,user,isGuest]);  useEffect(()=>{
  if(!histLoaded)return;
  if(added.length===0&&Object.keys(history).length===0)return;
  try{localStorage.setItem("wft-today4",JSON.stringify({date:todayKey(),foods:added}));}catch{}
  const nh={...history,[todayKey()]:added};setHistory(nh);
  try{localStorage.setItem("wft-hist4",JSON.stringify(nh));}catch{}
  },[added,histLoaded]);
  useEffect(()=>{
  if(!user||isGuest||!histLoaded)return;
  const sync=async()=>{
    try{
      await supabase.from("user_data").upsert({
        user_id:user.id,
        foods_today:added,
        history:history,
        milestones:[...shownMS],
        preferences:preferences,
        date:todayKey()
      },{onConflict:"user_id"});
    }catch(e){console.error("Sync error:",e);}
  };
  sync();
},[added,history,preferences,user,isGuest,histLoaded]);
  useEffect(()=>{
    if(!histLoaded)return;
    try{localStorage.setItem("nube-preferences",JSON.stringify(preferences));}catch{}
  },[preferences,histLoaded]);
  const fireMS=useCallback((key,msg)=>{
    if(shownMS.has(key))return;
    const u=new Set([...shownMS,key]);setShownMS(u);
    try{localStorage.setItem("wft-ms2",JSON.stringify([...u]));}catch{}
    setToast(msg);
  },[shownMS]);

  const checkMS=useCallback((next,prev)=>{
    const food=FOOD_BY_EN[next[next.length-1]];if(!food)return;
    if(next.length===1){fireMS("firstFood",t.milestones.firstFood);return;}
    if(food.cat==="Vegetable"&&!prev.some(k=>FOOD_BY_EN[k]?.cat==="Vegetable")){fireMS("firstGreens",t.milestones.firstGreens);return;}
    if(food.cat==="Protein"&&!prev.some(k=>FOOD_BY_EN[k]?.cat==="Protein")){fireMS("firstProtein",t.milestones.firstProtein);return;}
    if(food.cat==="Spice"&&!prev.some(k=>FOOD_BY_EN[k]?.cat==="Spice")){fireMS("firstSpice",t.milestones.firstSpice);return;}
    const sc=getPowerScore(next),psc=getPowerScore(prev);
    if(sc>=50&&psc<50){fireMS("halfPower",t.milestones.halfPower);return;}
    if(sc>=90&&psc<90){fireMS("elite",t.milestones.elite);return;}
    const nN=aggregateN(next),pN=aggregateN(prev);
    if(ALL_VIT.filter(v=>nN.v[v]>=2).length>=8&&ALL_VIT.filter(v=>pN.v[v]>=2).length<8){fireMS("vitCovered",t.milestones.vitCovered);return;}
    if(ALL_MIN.filter(m=>nN.m[m]>=2).length>=6&&ALL_MIN.filter(m=>pN.m[m]>=2).length<6)fireMS("minCovered",t.milestones.minCovered);
  },[fireMS,t]);

  useEffect(()=>{
    const sc=getPowerScore(added);
    if((sc>=50&&prevScore.current<50)||(sc>=90&&prevScore.current<90)){setConfetti(false);setTimeout(()=>setConfetti(true),50);setTimeout(()=>setConfetti(false),2500);}
    prevScore.current=sc;
  },[added]);
  useEffect(()=>{
    if(!histLoaded)return;
    const s=getStreak({...history,[todayKey()]:added});
    if(s===3)fireMS("streak3",t.milestones.streak3);
    if(s===7)fireMS("streak7",t.milestones.streak7);
  },[added,histLoaded]);
  useEffect(()=>{
    if(!query.trim()){setSuggestions([]);return;}
    const q=query.toLowerCase();
    const results=filteredFoods.filter(f=>f[lang].toLowerCase().includes(q)||f.en.toLowerCase().includes(q)||(f.aliases||[]).some(a=>a.toLowerCase().includes(q))).slice(0,7);
    setSuggestions(results);
    if(results.length===0&&q.trim().length>=3){
    try{
    const stored=JSON.parse(localStorage.getItem("wft-missing")||"{}");
    stored[q.trim()]=(stored[q.trim()]||0)+1;
    localStorage.setItem("wft-missing",JSON.stringify(stored));
    }catch{}
    }
    if(results.length===0&&query.trim().length>=3){
    try{window.va&&window.va("event",{name:"missing_food",data:{query:query.trim().toLowerCase()}});}catch{}
    }
  },[query,lang,preferences]);

  const addFood=useCallback(key=>{
    if(added.includes(key)){setQuery("");setSuggestions([]);return;}
    const prev=[...added],next=[...added,key];
    setAdded(next);setNewKey(key);setQuery("");setSuggestions([]);
    setTimeout(()=>setNewKey(null),400);setTimeout(()=>checkMS(next,prev),80);
  },[added,checkMS]);

  const removeFood=key=>setAdded(p=>p.filter(k=>k!==key));
  const clearAll=()=>setAdded([]);
  const excludeFood=useCallback(key=>{setPreferences(p=>({...p,excludedFoods:[...p.excludedFoods,key]}));setToast(t.excludeToast);},[t]);
  const {pulling,refreshing,handlers:pullHandlers}=usePullToRefresh(()=>{setQuery("");setSuggestions([]);});

  const foodObjs=added.map(k=>FOOD_BY_EN[k]).filter(Boolean);
  const score=getPowerScore(added);
  const col=getPowerColor(score);
  const pidx=getPowerIdx(score);
  const streak=getStreak({...history,[todayKey()]:added});
  const totalN=aggregateN(added);

  const en=n=>foodObjs.some(f=>f.en===n);
  const hasVitDFood=foodObjs.some(f=>["Salmon","Sardines","Mackerel","Eggs","Mushrooms","Kefir"].includes(f.en));
  const hasVitCFood=foodObjs.some(f=>(f.v?.C||0)>=2);
  const hasIronFood=foodObjs.some(f=>(f.m?.Iron||0)>=2);
  const hasVitKFood=foodObjs.some(f=>["Kale","Spinach","Broccoli","Green Asparagus","Avocado"].includes(f.en));
  const hasCalciumFood=foodObjs.some(f=>["Skyr","Greek Yogurt","Sardines","Kefir","Kale","Chia Seeds","Almonds"].includes(f.en));
  const hasMagFood=foodObjs.some(f=>["Cocoa (Raw)","Pumpkin Seeds","Chia Seeds","Almonds","Quinoa","Spinach","Dark Chocolate (85%+)"].includes(f.en));
  const hasOmega3Food=foodObjs.some(f=>["Salmon","Mackerel","Sardines","Walnuts","Chia Seeds"].includes(f.en));
  const hasVitEFood=foodObjs.some(f=>["Sunflower Seeds","Almonds","Avocado","Olive Oil","Spinach"].includes(f.en));
  const hasGarlic=foodObjs.some(f=>["Garlic","Garlic Powder"].includes(f.en));
  const hasVitCVeg=foodObjs.some(f=>["Bell Pepper","Kiwi","Orange","Strawberries","Broccoli","Kale"].includes(f.en));

  const SYNERGY_CHECKS = [
    {key:"syn1",active:en("Turmeric")&&(en("Black Pepper")||en("Cayenne Pepper")),sideA:en("Turmeric"),sideB:en("Black Pepper")||en("Cayenne Pepper"),missingA:"Turmeric",missingB:"Black Pepper"},
    {key:"syn2",active:hasIronFood&&hasVitCFood,sideA:hasIronFood,sideB:hasVitCFood,missingA:lang==="de"?"Eisenreiches Lebensmittel":"Iron-rich food",missingB:lang==="de"?"Vitamin-C-reiches Lebensmittel":"Vitamin C food"},
    {key:"syn3",active:en("Avocado")&&foodObjs.some(f=>(f.v?.A||0)>=1||(f.v?.K||0)>=1||(f.v?.E||0)>=1),sideA:en("Avocado"),sideB:foodObjs.some(f=>(f.v?.A||0)>=1||(f.v?.K||0)>=1||(f.v?.E||0)>=1),missingA:"Avocado",missingB:lang==="de"?"Fettlösliches Vitamin (A/E/K)":"Fat-soluble vitamin (A/E/K)"},
    {key:"syn4",active:hasVitDFood&&hasCalciumFood,sideA:hasVitDFood,sideB:hasCalciumFood,missingA:lang==="de"?"Vitamin-D-Quelle (Lachs, Eier...)":"Vitamin D food (Salmon, Eggs...)",missingB:lang==="de"?"Calciumquelle (Skyr, Mandeln...)":"Calcium food (Skyr, Almonds...)"},
    {key:"syn5",active:hasVitDFood&&hasMagFood,sideA:hasVitDFood,sideB:hasMagFood,missingA:lang==="de"?"Vitamin-D-Quelle":"Vitamin D food",missingB:lang==="de"?"Magnesiumquelle (Kürbiskerne, Spinat...)":"Magnesium food (Pumpkin Seeds, Spinach...)"},
    {key:"syn6",active:hasVitKFood&&hasVitDFood,sideA:hasVitKFood,sideB:hasVitDFood,missingA:lang==="de"?"Vitamin-K-Quelle (Grünkohl, Spinat...)":"Vitamin K food (Kale, Spinach...)",missingB:lang==="de"?"Vitamin-D-Quelle":"Vitamin D food"},
    {key:"syn7",active:en("Ginger")&&en("Turmeric"),sideA:en("Ginger"),sideB:en("Turmeric"),missingA:lang==="de"?"Ingwer":"Ginger",missingB:lang==="de"?"Kurkuma":"Turmeric"},
    {key:"syn8",active:en("Green Tea")&&en("Lemon"),sideA:en("Green Tea"),sideB:en("Lemon"),missingA:lang==="de"?"Grüner Tee":"Green Tea",missingB:lang==="de"?"Zitrone":"Lemon"},
    {key:"syn9",active:hasGarlic&&hasVitCVeg,sideA:hasGarlic,sideB:hasVitCVeg,missingA:lang==="de"?"Knoblauch":"Garlic",missingB:lang==="de"?"Vitamin-C-Gemüse (Paprika, Kiwi...)":"Vitamin C veg (Bell Pepper, Kiwi...)"},
    {key:"syn10",active:hasOmega3Food&&hasVitEFood,sideA:hasOmega3Food,sideB:hasVitEFood,missingA:lang==="de"?"Omega-3-Quelle (Lachs, Walnüsse...)":"Omega-3 food (Salmon, Walnuts...)",missingB:lang==="de"?"Vitamin-E-Quelle (Mandeln, Avocado...)":"Vitamin E food (Almonds, Avocado...)"},
  ];
  const synergiesAll=SYNERGY_CHECKS.filter(s=>s.active).map(s=>t[s.key]);
  const synergies=isPremium?synergiesAll:synergiesAll.slice(0,1);
  const synergiesLocked=isPremium?0:Math.max(0,synergiesAll.length-(synergies.length));
  const potentialSynergies=SYNERGY_CHECKS.filter(s=>!s.active&&(s.sideA||s.sideB)).slice(0,3);

  const getVerdict=s=>{
    if(s>=88)return t.verdictLabels.elite;if(s>=70)return t.verdictLabels.great;
    if(s>=50)return t.verdictLabels.solid;if(s>=25)return t.verdictLabels.ok;
    return t.verdictLabels.low;
  };
  const missingVit=ALL_VIT.find(v=>!totalN.v[v]&&t.missingTips[v]);

  const heatDays=[];
  for(let i=29;i>=0;i--){
    const d=new Date();d.setDate(d.getDate()-i);
    const k=d.toISOString().split("T")[0];
    heatDays.push({key:k,score:getPowerScore(history[k]||[]),isToday:k===todayKey(),d});
  }

  const NutrientRow=({nk,type})=>{
    const level=(type==="vitamins"?totalN.v:totalN.m)[nk]||0;
    const label=type==="vitamins"?t.vitNames[nk]:nk;
    return(
      <button onClick={()=>setSelNutrient({key:nk,type})}
        style={{display:"flex",alignItems:"center",gap:12,background:"transparent",border:"none",borderRadius:12,padding:"10px 8px",width:"100%",textAlign:"left",cursor:"pointer",minHeight:44,transition:"background 0.15s"}}
        onMouseEnter={e=>e.currentTarget.style.background="#1f2937"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
        <div style={{width:120,fontSize:12,color:"#9ca3af",flexShrink:0}}>{label}</div>
        <div style={{flex:1}}><CoverageBar level={level}/></div>
        <div style={{width:28,textAlign:"right",fontSize:12}}>
          {level===0?<span style={{color:"#374151"}}>-</span>:level===1?<span style={{color:"#facc15"}}>~</span>:level===2?<span style={{color:"#60a5fa"}}>✓</span>:<span style={{color:"#4ade80",fontWeight:700}}>✓✓</span>}
        </div>
        <span style={{color:"#374151",fontSize:12}}>›</span>
      </button>
    );
  };
  if(authLoading)return(
    <div style={{minHeight:"100vh",background:"#030712",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16}}>
      <img src="/logopng.png" alt="Nube" height={48} style={{height:48,borderRadius:10,opacity:0.8}}/>
      <div style={{width:24,height:24,border:"2px solid #374151",borderTop:"2px solid #22c55e",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
  if(!authChecked)return <div style={{minHeight:"100vh",background:"#030712"}}/>;
  if(!user&&!isGuest&&!showLanding)return <AuthScreen lang={lang} setLang={setLang} onAuth={u=>{setUser(u);}} onGuest={()=>setIsGuest(true)}/>;  if(showLanding)return(
  <>
    <LandingPage lang={lang} setLang={setLang} onEnter={()=>{setShowLanding(false);try{localStorage.setItem("wft-visited","1");}catch{}}} setShowImpressum={setShowImpressum} setShowPrivacy={setShowPrivacy} setShowContact={setShowContact} setShowAbout={setShowAbout}/>
    {showImpressum&&(
      <div style={{position:"fixed",inset:0,zIndex:155,display:"flex",alignItems:"flex-end"}} onClick={()=>setShowImpressum(false)}>
        <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.7)",backdropFilter:"blur(16px)"}}/>
        <div onClick={e=>e.stopPropagation()} style={{position:"relative",background:"#111827",border:"1px solid #374151",borderRadius:"24px 24px 0 0",width:"100%",maxWidth:520,margin:"0 auto",paddingBottom:"calc(28px + env(safe-area-inset-bottom))",boxShadow:"0 -8px 48px rgba(0,0,0,0.7)",maxHeight:"85vh",overflowY:"auto"}}>
          <div style={{display:"flex",justifyContent:"center",padding:"12px 0 4px"}}><div style={{width:36,height:4,borderRadius:2,background:"#374151"}}/></div>
          <div style={{padding:"8px 20px 16px"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
              <h3 style={{margin:0,fontSize:15,fontWeight:900,color:"#f9fafb"}}>Impressum</h3>
              <button onClick={()=>setShowImpressum(false)} style={{minWidth:44,minHeight:44,background:"transparent",border:"none",color:"#6b7280",fontSize:20,cursor:"pointer"}}>✕</button>
            </div>
            <p style={{fontSize:12,color:"#9ca3af",lineHeight:1.8,margin:0,whiteSpace:"pre-line"}}>{`Angaben gemäß § 5 TMG\n\nLars Frädrich\nVeit-Stoß-Straße 64\n80687 München\n\nKontakt\nE-Mail: hello@nubetracker.com\n\nSteuernummer\n147/116/50491\n\nVerantwortlich für den Inhalt nach § 55 Abs. 2 RStV\nLars Frädrich\nVeit-Stoß-Straße 64\n80687 München`}</p>
          </div>
        </div>
      </div>
    )}
    {showPrivacy&&(
      <div style={{position:"fixed",inset:0,zIndex:155,display:"flex",alignItems:"flex-end"}} onClick={()=>setShowPrivacy(false)}>
        <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.7)",backdropFilter:"blur(16px)"}}/>
        <div onClick={e=>e.stopPropagation()} style={{position:"relative",background:"#111827",border:"1px solid #374151",borderRadius:"24px 24px 0 0",width:"100%",maxWidth:520,margin:"0 auto",paddingBottom:"calc(28px + env(safe-area-inset-bottom))",boxShadow:"0 -8px 48px rgba(0,0,0,0.7)",maxHeight:"85vh",overflowY:"auto"}}>
          <div style={{display:"flex",justifyContent:"center",padding:"12px 0 4px"}}><div style={{width:36,height:4,borderRadius:2,background:"#374151"}}/></div>
          <div style={{padding:"8px 20px 16px"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
              <h3 style={{margin:0,fontSize:15,fontWeight:900,color:"#f9fafb"}}>{lang==="de"?"Datenschutzerklärung":"Privacy Policy"}</h3>
              <button onClick={()=>setShowPrivacy(false)} style={{minWidth:44,minHeight:44,background:"transparent",border:"none",color:"#6b7280",fontSize:20,cursor:"pointer"}}>✕</button>
            </div>
              {lang==="de"?(
                <p style={{fontSize:12,color:"#9ca3af",lineHeight:1.8,margin:0,whiteSpace:"pre-line"}}>{`1. Verantwortlicher\nLars Frädrich, Veit-Stoß-Straße 64, 80687 München\nE-Mail: hello@nubetracker.com\nFuer Datenschutzanfragen wenden Sie sich bitte direkt an die oben genannte E-Mail-Adresse.\n\n2. Geltungsbereich\nDiese Datenschutzerklaerung gilt fuer alle Nutzer von nubetracker.com unabhaengig vom Standort. Sie erfuellt die Anforderungen der DSGVO sowie des BDSG.\n\n3. Erhobene Daten\nWir erheben, speichern oder verarbeiten keine personenbezogenen Daten ueber diese Anwendung. Alle vom Nutzer eingegebenen Daten werden ausschliesslich lokal auf dem Geraet des Nutzers gespeichert und werden niemals an uns uebermittelt.\nRechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO\n\n4. Hosting\nDiese Website wird gehostet von Vercel Inc., 340 Pine Street, Suite 701, San Francisco, CA 94104, USA. Vercel verarbeitet anonymisierte Server-Logs (IP-Adresse anonymisiert, Browsertyp, Betriebssystem, Zeitstempel, URL) fuer bis zu 30 Tage zum Zweck des technischen Betriebs. Vercel Inc. ist zertifiziert unter dem EU-US Data Privacy Framework (Beschluss der EU-Kommission vom 10. Juli 2023). Zusaetzlich bestehen EU-Standardvertragsklauseln gemaess Art. 46 Abs. 2 lit. c DSGVO. Ein Auftragsverarbeitungsvertrag gemaess Art. 28 DSGVO ist abgeschlossen. Weitere Informationen: https://vercel.com/legal/privacy-policy\nRechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse am technischen Betrieb des Dienstes)\n\n5. Analyse (Vercel Analytics)\nWir nutzen Vercel Analytics, ein cookiefreies Analysetool, das keine personenbezogenen Daten erfasst und keine IP-Adressen speichert.\nRechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Verbesserung des Dienstangebots).\nWiderspruchsrecht: Du kannst der Verarbeitung jederzeit durch Browsereinstellungen oder einen Adblocker widersprechen.\n\n6. Cookies\nDiese Website verwendet keine Cookies.\n\n7. Betroffenenrechte\nJe nach Aufenthaltsort stehen dir Rechte bezueglich deiner personenbezogenen Daten zu. Da wir keine personenbezogenen Daten speichern, sind die meisten Rechte in der Praxis nicht anwendbar. Fuer alle Anfragen: hello@nubetracker.com\n\n8. Beschwerderecht\nBayerisches Landesamt fuer Datenschutzaufsicht (BayLDA), Promenade 18, 91522 Ansbach, www.lda.bayern.de\n\n9. Hinweis fuer Nutzer ausserhalb der EU\nFuer Nutzer ausserhalb der EU gelten die jeweiligen nationalen Datenschutzgesetze. Da wir keine personenbezogenen Daten speichern, sind saemtliche gaengigen Datenschutzanforderungen erfuellt.\n\n10. Stand: April 2026`}</p>
              ):(
                <p style={{fontSize:12,color:"#9ca3af",lineHeight:1.8,margin:0,whiteSpace:"pre-line"}}>{`1. Controller\nLars Frädrich, Veit-Stoß-Straße 64, 80687 München, Germany\nEmail: hello@nubetracker.com\n\n2. Scope\nThis privacy policy applies to all users of nubetracker.com regardless of location. EU users: This policy fulfils the requirements of the GDPR. US users: This policy fulfils the requirements of applicable US state privacy laws including CCPA.\n\n3. Data We Collect\nWe do not collect, store or process any personal data through this application. All data entered by users is stored exclusively on the user's own device and is never transmitted to us.\n\n4. Hosting\nHosted by Vercel Inc., 340 Pine Street Suite 701, San Francisco, CA 94104, USA. Vercel processes anonymized server logs (IP address anonymized, browser type, OS, timestamp, URL) for up to 30 days for technical operation purposes. Vercel is certified under the EU-US Data Privacy Framework (Commission Decision of 10 July 2023) and EU Standard Contractual Clauses are in place pursuant to Art. 46 (2) lit. c GDPR. A data processing agreement pursuant to Art. 28 GDPR is in place. For details: https://vercel.com/legal/privacy-policy\n\n5. Analytics\nWe use Vercel Analytics, a cookie-free analytics tool that does not collect personal data and does not store IP addresses. Legal basis: Art. 6 (1) lit. f GDPR (legitimate interest in service improvement). You may opt out at any time using browser privacy settings or an ad blocker.\n\n6. Cookies\nThis website does not use cookies.\n\n7. Your Rights\nDepending on your jurisdiction you may have rights regarding your personal data. As we do not store personal data, most rights are not applicable in practice. For any enquiries contact: hello@nubetracker.com\n\n8. Supervisory Authority (EU users)\nBayerisches Landesamt fuer Datenschutzaufsicht (BayLDA), Promenade 18, 91522 Ansbach, Germany. www.lda.bayern.de\n\n9. Last updated: April 2026`}</p>
              )}
          </div>
        </div>
      </div>
    )}
    {showContact&&(
      <div style={{position:"fixed",inset:0,zIndex:155,display:"flex",alignItems:"flex-end"}} onClick={()=>setShowContact(false)}>
        <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.7)",backdropFilter:"blur(16px)"}}/>
        <div onClick={e=>e.stopPropagation()} style={{position:"relative",background:"#111827",border:"1px solid #374151",borderRadius:"24px 24px 0 0",width:"100%",maxWidth:520,margin:"0 auto",paddingBottom:"calc(28px + env(safe-area-inset-bottom))",boxShadow:"0 -8px 48px rgba(0,0,0,0.7)",maxHeight:"85vh",overflowY:"auto"}}>
          <div style={{display:"flex",justifyContent:"center",padding:"12px 0 4px"}}><div style={{width:36,height:4,borderRadius:2,background:"#374151"}}/></div>
          <div style={{padding:"8px 20px 16px"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
              <h3 style={{margin:0,fontSize:15,fontWeight:900,color:"#f9fafb"}}>{lang==="de"?"Kontakt":"Contact"}</h3>
              <button onClick={()=>setShowContact(false)} style={{minWidth:44,minHeight:44,background:"transparent",border:"none",color:"#6b7280",fontSize:20,cursor:"pointer"}}>✕</button>
            </div>
            <p style={{fontSize:12,color:"#9ca3af",lineHeight:1.8,margin:0,whiteSpace:"pre-line"}}>{lang==="de"?`Schreib uns\n\nWir freuen uns ueber dein Feedback.\n\nE-Mail: hello@nubetracker.com\n\nAntwortzeit: Wir antworten in der Regel innerhalb von 48 Stunden.`:`Get in touch\n\nWe would love to hear from you.\n\nEmail: hello@nubetracker.com\n\nResponse time: We aim to reply within 48 hours.`}</p>
          </div>
        </div>
      </div>
    )}
    {showAbout&&(
      <div style={{position:"fixed",inset:0,zIndex:155,display:"flex",alignItems:"flex-end"}} onClick={()=>setShowAbout(false)}>
        <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.7)",backdropFilter:"blur(16px)"}}/>
        <div onClick={e=>e.stopPropagation()} style={{position:"relative",background:"#111827",border:"1px solid #374151",borderRadius:"24px 24px 0 0",width:"100%",maxWidth:520,margin:"0 auto",paddingBottom:"calc(28px + env(safe-area-inset-bottom))",boxShadow:"0 -8px 48px rgba(0,0,0,0.7)",maxHeight:"85vh",overflowY:"auto"}}>
          <div style={{display:"flex",justifyContent:"center",padding:"12px 0 4px"}}><div style={{width:36,height:4,borderRadius:2,background:"#374151"}}/></div>
          <div style={{padding:"8px 20px 16px"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
              <h3 style={{margin:0,fontSize:15,fontWeight:900,color:"#f9fafb"}}>{lang==="de"?"Über Nube":"About Nube"}</h3>
              <button onClick={()=>setShowAbout(false)} style={{minWidth:44,minHeight:44,background:"transparent",border:"none",color:"#6b7280",fontSize:20,cursor:"pointer"}}>✕</button>
            </div>
            <p style={{fontSize:12,color:"#9ca3af",lineHeight:1.8,margin:0,whiteSpace:"pre-line"}}>{lang==="de"?`Nube - Nutrition Benefits\n\nNube hilft dir dabei, deine Vollwerternaehrung zu tracken und Naehrstoffsynergien zu entdecken.\n\nGebaut mit ❤️ in München.\n\nVersion 1.0\nhello@nubetracker.com\nnubetracker.com`:`Nube - Nutrition Benefits\n\nNube helps you track your whole food intake and discover nutritional synergies between foods.\n\nBuilt with ❤️ in Munich.\n\nVersion 1.0\nhello@nubetracker.com\nnubetracker.com`}</p>
          </div>
        </div>
      </div>
    )}
  </>
);
  return(
        <div style={{minHeight:"100vh",background:"#030712",color:"#fff",fontFamily:"system-ui,-apple-system,sans-serif"}}>
      <style>{`*{-webkit-tap-highlight-color:transparent;box-sizing:border-box;}input::placeholder{color:#4b5563;}@keyframes fadeSlideIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}@keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(-16px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}@keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}@keyframes foodTagPop{0%{transform:scale(0) rotate(-10deg);opacity:0}60%{transform:scale(1.15) rotate(2deg)}100%{transform:scale(1) rotate(0deg);opacity:1}}@keyframes scoreCount{from{transform:scale(0.8);opacity:0}to{transform:scale(1);opacity:1}}@keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}@keyframes pulseGlow{0%,100%{box-shadow:0 0 0 0 rgba(34,197,94,0.3)}50%{box-shadow:0 0 0 8px rgba(34,197,94,0)}}@keyframes synergyGlow{0%,100%{box-shadow:0 0 0 0 rgba(251,191,36,0.3)}50%{box-shadow:0 0 0 8px rgba(251,191,36,0)}}::-webkit-scrollbar{display:none;}*{scrollbar-width:none;-ms-overflow-style:none;}button{transition:all 0.2s ease;}.nube-footer-btn:hover{color:#f9fafb!important}@media(prefers-reduced-motion:reduce){*{animation:none!important;transition-duration:0.01ms!important}}`}</style>
      <Confetti active={confetti}/>
      {toast&&<Toast msg={toast} onDone={()=>setToast(null)}/>}
      {selNutrient&&<NutrientModal nutrient={selNutrient.key} type={selNutrient.type} lang={lang} onClose={()=>setSelNutrient(null)} added={added} filteredFoodKeys={filteredFoodKeys}/>}
      {selBenefit&&<BenefitModal benefit={selBenefit} lang={lang} onClose={()=>setSelBenefit(null)}/>}
      {editDay&&<EditDayModal dayKey={editDay} lang={lang} history={history} setHistory={setHistory} todayAdded={added} setAdded={setAdded} onClose={()=>setEditDay(null)}/>}
      {confirmRemove&&(
  <div style={{position:"fixed",inset:0,zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 24px"}} onClick={()=>setConfirmRemove(null)}>
    <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.7)",backdropFilter:"blur(16px)"}}/>
    <div onClick={e=>e.stopPropagation()} style={{position:"relative",background:"#111827",border:"1px solid #374151",borderRadius:20,padding:"24px 20px",width:"100%",maxWidth:360,boxShadow:"0 8px 48px rgba(0,0,0,0.7)"}}>
      <p style={{margin:"0 0 6px",fontSize:15,fontWeight:900,color:"#f9fafb"}}>
        {lang==="de"?"Lebensmittel entfernen?":"Remove food?"}
      </p>
      <p style={{margin:"0 0 20px",fontSize:13,color:"#6b7280"}}>
        {lang==="de"
          ?`"${FOOD_BY_EN[confirmRemove]?.[lang]||confirmRemove}" aus dem heutigen Tag entfernen?`
          :`Remove "${FOOD_BY_EN[confirmRemove]?.[lang]||confirmRemove}" from today?`}
      </p>
      <div style={{display:"flex",gap:10}}>
        <button onClick={()=>setConfirmRemove(null)}
          style={{flex:1,minHeight:44,background:"transparent",border:"1px solid #374151",borderRadius:12,fontSize:13,fontWeight:600,color:"#9ca3af",cursor:"pointer"}}>
          {lang==="de"?"Abbrechen":"Cancel"}
        </button>
        <button onClick={()=>{removeFood(confirmRemove);setConfirmRemove(null);}}
          style={{flex:1,minHeight:44,background:"#ef4444",border:"none",borderRadius:12,fontSize:13,fontWeight:700,color:"#fff",cursor:"pointer"}}>
          {lang==="de"?"Entfernen":"Remove"}
        </button>
      </div>
    </div>
  </div>
)}
      {showSynergyModal&&<SynergyModal lang={lang} foodObjs={foodObjs} addFood={addFood} onClose={()=>setShowSynergyModal(false)} isPremium={isPremium} onUpgrade={()=>{setShowSynergyModal(false);setShowUpgradeModal(true);}}/>}
      {showPreferences&&<PreferencesModal lang={lang} preferences={preferences} setPreferences={setPreferences} onClose={()=>setShowPreferences(false)}/>}
        {showUpgradeModal&&(
        <div style={{position:"fixed",inset:0,zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 24px"}} onClick={()=>setShowUpgradeModal(false)}>
          <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.8)",backdropFilter:"blur(16px)"}}/>
          <div onClick={e=>e.stopPropagation()} style={{position:"relative",background:"#111827",border:"1px solid #374151",borderRadius:24,padding:"28px 24px",width:"100%",maxWidth:360,boxShadow:"0 8px 48px rgba(0,0,0,0.7)"}}>
            <div style={{textAlign:"center",marginBottom:20}}>
              <div style={{marginBottom:8,color:"#f59e0b"}}><Zap size={40}/></div>
              <h2 style={{margin:"0 0 16px",fontSize:22,fontWeight:900,color:"#fff"}}>Nube Pro</h2>
              <div style={{display:"flex",gap:4,background:"#0f172a",borderRadius:12,padding:4,marginBottom:16}}>
                <button onClick={()=>setBillingYearly(false)}
                  style={{flex:1,minHeight:36,background:!billingYearly?"#1f2937":"transparent",border:"none",borderRadius:10,fontSize:12,fontWeight:700,color:!billingYearly?"#fff":"#6b7280",cursor:"pointer",transition:"all 0.2s"}}>
                  {lang==="de"?"Monatlich":"Monthly"}
                </button>
                <button onClick={()=>setBillingYearly(true)}
                  style={{flex:1,minHeight:36,background:billingYearly?"#1f2937":"transparent",border:"none",borderRadius:10,fontSize:12,fontWeight:700,color:billingYearly?"#fff":"#6b7280",cursor:"pointer",transition:"all 0.2s",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
                  {lang==="de"?"Jährlich":"Yearly"} 🏆
                </button>
              </div>
              {billingYearly?(
                <div>
                  <p style={{margin:"0 0 4px",fontSize:28,fontWeight:900,background:"linear-gradient(135deg,#f59e0b,#f97316)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>29,99€ / {lang==="de"?"Jahr":"year"}</p>
                  <p style={{margin:0,fontSize:13,color:"#4ade80",fontWeight:600}}>2,49€ / {lang==="de"?"Mo — 37% sparen":"mo — save 37%"}</p>
                  <span style={{display:"inline-block",marginTop:6,fontSize:11,fontWeight:700,color:"#f59e0b",background:"rgba(245,158,11,0.12)",padding:"3px 10px",borderRadius:99}}>{lang==="de"?"Bestes Angebot 🏆":"Best Value 🏆"}</span>
                </div>
              ):(
                <p style={{margin:0,fontSize:28,fontWeight:900,background:"linear-gradient(135deg,#f59e0b,#f97316)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>3,99€ / {lang==="de"?"Monat":"month"}</p>
              )}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:24}}>
              {(lang==="de"?["✓ Alle Nährstoffsynergien","✓ Health Goals Tracking","✓ Vollständiges Lebensmittel-Lexikon","✓ Unbegrenzte Historie","✓ Geräte-Sync"]:["✓ All nutritional synergies","✓ Health Goals tracking","✓ Full food lexicon","✓ Unlimited history","✓ Sync across devices"]).map(f=>(
                <div key={f} style={{display:"flex",alignItems:"center",gap:10,background:"#0f172a",borderRadius:10,padding:"10px 14px"}}>
                  <span style={{fontSize:13,fontWeight:600,color:"#d1d5db"}}>{f}</span>
                </div>
              ))}
            </div>
            <button onClick={()=>window.location.href="mailto:hello@nubetracker.com?subject=Nube Pro Waitlist"}
              style={{width:"100%",height:52,background:"linear-gradient(135deg,#f59e0b,#f97316)",border:"none",borderRadius:14,fontSize:15,fontWeight:800,color:"#fff",cursor:"pointer",marginBottom:12}}>
              {lang==="de"?"Coming Soon — Warteliste beitreten":"Coming Soon — Join Waitlist"}
            </button>
            <button onClick={()=>setShowUpgradeModal(false)}
              style={{width:"100%",background:"transparent",border:"none",color:"#4b5563",fontSize:13,cursor:"pointer",padding:"8px 0"}}>
              {lang==="de"?"Vielleicht später":"Maybe later"}
            </button>
          </div>
        </div>
        )}
      {showImpressum&&(
        <div style={{position:"fixed",inset:0,zIndex:155,display:"flex",alignItems:"flex-end"}} onClick={()=>setShowImpressum(false)}>
          <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.7)",backdropFilter:"blur(16px)"}}/>
          <div onClick={e=>e.stopPropagation()} style={{position:"relative",background:"#111827",border:"1px solid #374151",borderRadius:"24px 24px 0 0",width:"100%",maxWidth:520,margin:"0 auto",paddingBottom:"calc(28px + env(safe-area-inset-bottom))",boxShadow:"0 -8px 48px rgba(0,0,0,0.7)",maxHeight:"85vh",overflowY:"auto"}}>
            <div style={{display:"flex",justifyContent:"center",padding:"12px 0 4px"}}><div style={{width:36,height:4,borderRadius:2,background:"#374151"}}/></div>
            <div style={{padding:"8px 20px 16px"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
                <h3 style={{margin:0,fontSize:15,fontWeight:900,color:"#f9fafb"}}>Impressum</h3>
                <button onClick={()=>setShowImpressum(false)} style={{minWidth:44,minHeight:44,background:"transparent",border:"none",color:"#6b7280",fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
              </div>
              <p style={{fontSize:12,color:"#9ca3af",lineHeight:1.8,margin:0,whiteSpace:"pre-line"}}>{`Angaben gemäß § 5 TMG\n\nLars Frädrich\nVeit-Stoß-Straße 64\n80687 München\n\nKontakt\nE-Mail: hello@nubetracker.com\n\nSteuernummer\n147/116/50491\n\nVerantwortlich für den Inhalt nach § 55 Abs. 2 RStV\nLars Frädrich\nVeit-Stoß-Straße 64\n80687 München`}</p>
            </div>
          </div>
        </div>
      )}
      {showContact&&(
  <div style={{position:"fixed",inset:0,zIndex:155,display:"flex",alignItems:"flex-end"}} onClick={()=>setShowContact(false)}>
    <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.7)",backdropFilter:"blur(16px)"}}/>
    <div onClick={e=>e.stopPropagation()} style={{position:"relative",background:"#111827",border:"1px solid #374151",borderRadius:"24px 24px 0 0",width:"100%",maxWidth:520,margin:"0 auto",paddingBottom:"calc(28px + env(safe-area-inset-bottom))",boxShadow:"0 -8px 48px rgba(0,0,0,0.7)",maxHeight:"85vh",overflowY:"auto"}}>
      <div style={{display:"flex",justifyContent:"center",padding:"12px 0 4px"}}><div style={{width:36,height:4,borderRadius:2,background:"#374151"}}/></div>
      <div style={{padding:"8px 20px 16px"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
          <h3 style={{margin:0,fontSize:15,fontWeight:900,color:"#f9fafb"}}>{lang==="de"?"Kontakt":"Contact"}</h3>
          <button onClick={()=>setShowContact(false)} style={{minWidth:44,minHeight:44,background:"transparent",border:"none",color:"#6b7280",fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>
        <p style={{fontSize:12,color:"#9ca3af",lineHeight:1.8,margin:0,whiteSpace:"pre-line"}}>{lang==="de"?`Schreib uns\n\nWir freuen uns ueber dein Feedback, Fehlermeldungen oder einfach eine Nachricht.\n\nE-Mail: hello@nubetracker.com\n\nAntwortzeit: Wir antworten in der Regel innerhalb von 48 Stunden.`:`Get in touch\n\nWe would love to hear from you - whether it is feedback, a bug report, or just to say hello.\n\nEmail: hello@nubetracker.com\n\nResponse time: We aim to reply within 48 hours.`}</p>
      </div>
    </div>
  </div>
)}
      {showAbout&&(
        <div style={{position:"fixed",inset:0,zIndex:155,display:"flex",alignItems:"flex-end"}} onClick={()=>setShowAbout(false)}>
          <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.7)",backdropFilter:"blur(16px)"}}/>
          <div onClick={e=>e.stopPropagation()} style={{position:"relative",background:"#111827",border:"1px solid #374151",borderRadius:"24px 24px 0 0",width:"100%",maxWidth:520,margin:"0 auto",paddingBottom:"calc(28px + env(safe-area-inset-bottom))",boxShadow:"0 -8px 48px rgba(0,0,0,0.7)",maxHeight:"85vh",overflowY:"auto"}}>
            <div style={{display:"flex",justifyContent:"center",padding:"12px 0 4px"}}><div style={{width:36,height:4,borderRadius:2,background:"#374151"}}/></div>
            <div style={{padding:"8px 20px 16px"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
                <h3 style={{margin:0,fontSize:15,fontWeight:900,color:"#f9fafb"}}>{lang==="de"?"Ueber Nube":"About Nube"}</h3>
                <button onClick={()=>setShowAbout(false)} style={{minWidth:44,minHeight:44,background:"transparent",border:"none",color:"#6b7280",fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
              </div>
              <p style={{fontSize:12,color:"#9ca3af",lineHeight:1.8,margin:0,whiteSpace:"pre-line"}}>{lang==="de"?`Nube - Nutrition Benefits\n\nNube hilft dir dabei, deine Vollwerternaehrung zu tracken und Naehrstoffsynergien zwischen Lebensmitteln zu entdecken.\n\nIm Gegensatz zu Kalorientrackern konzentriert sich Nube auf das was wirklich zaehlt - Vitamine, Mineralstoffe und die wissenschaftlich belegten Wechselwirkungen zwischen Lebensmitteln.\n\nGebaut mit ❤️ in Muenchen.\n\nVersion 1.0\nhello@nubetracker.com\nnubetracker.com`:`Nube - Nutrition Benefits\n\nNube helps you track your whole food intake and discover nutritional synergies between foods.\n\nUnlike calorie counters, Nube focuses on what really matters - vitamins, minerals and the science-backed interactions between foods that maximise their benefits.\n\nBuilt with ❤️ in Munich.\n\nVersion 1.0\nhello@nubetracker.com\nnubetracker.com`}</p>
            </div>
          </div>
        </div>
      )}
      {showPrivacy&&(
        <div style={{position:"fixed",inset:0,zIndex:155,display:"flex",alignItems:"flex-end"}} onClick={()=>setShowPrivacy(false)}>
          <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.7)",backdropFilter:"blur(16px)"}}/>
          <div onClick={e=>e.stopPropagation()} style={{position:"relative",background:"#111827",border:"1px solid #374151",borderRadius:"24px 24px 0 0",width:"100%",maxWidth:520,margin:"0 auto",paddingBottom:"calc(28px + env(safe-area-inset-bottom))",boxShadow:"0 -8px 48px rgba(0,0,0,0.7)",maxHeight:"85vh",overflowY:"auto"}}>
            <div style={{display:"flex",justifyContent:"center",padding:"12px 0 4px"}}><div style={{width:36,height:4,borderRadius:2,background:"#374151"}}/></div>
            <div style={{padding:"8px 20px 16px"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
                <h3 style={{margin:0,fontSize:15,fontWeight:900,color:"#f9fafb"}}>{lang==="de"?"Datenschutzerklärung":"Privacy Policy"}</h3>
                <button onClick={()=>setShowPrivacy(false)} style={{minWidth:44,minHeight:44,background:"transparent",border:"none",color:"#6b7280",fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
              </div>
              {lang==="de"?(
                <p style={{fontSize:12,color:"#9ca3af",lineHeight:1.8,margin:0,whiteSpace:"pre-line"}}>{`1. Verantwortlicher\nLars Frädrich, Veit-Stoß-Straße 64, 80687 München\nE-Mail: hello@nubetracker.com\nFuer Datenschutzanfragen wenden Sie sich bitte direkt an die oben genannte E-Mail-Adresse.\n\n2. Geltungsbereich\nDiese Datenschutzerklaerung gilt fuer alle Nutzer von nubetracker.com unabhaengig vom Standort. Sie erfuellt die Anforderungen der DSGVO sowie des BDSG.\n\n3. Erhobene Daten\nWir erheben, speichern oder verarbeiten keine personenbezogenen Daten ueber diese Anwendung. Alle vom Nutzer eingegebenen Daten werden ausschliesslich lokal auf dem Geraet des Nutzers gespeichert und werden niemals an uns uebermittelt.\nRechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO\n\n4. Hosting\nDiese Website wird gehostet von Vercel Inc., 340 Pine Street, Suite 701, San Francisco, CA 94104, USA. Vercel verarbeitet anonymisierte Server-Logs (IP-Adresse anonymisiert, Browsertyp, Betriebssystem, Zeitstempel, URL) fuer bis zu 30 Tage zum Zweck des technischen Betriebs. Vercel Inc. ist zertifiziert unter dem EU-US Data Privacy Framework (Beschluss der EU-Kommission vom 10. Juli 2023). Zusaetzlich bestehen EU-Standardvertragsklauseln gemaess Art. 46 Abs. 2 lit. c DSGVO. Ein Auftragsverarbeitungsvertrag gemaess Art. 28 DSGVO ist abgeschlossen. Weitere Informationen: https://vercel.com/legal/privacy-policy\nRechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse am technischen Betrieb des Dienstes)\n\n5. Analyse (Vercel Analytics)\nWir nutzen Vercel Analytics, ein cookiefreies Analysetool, das keine personenbezogenen Daten erfasst und keine IP-Adressen speichert.\nRechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Verbesserung des Dienstangebots).\nWiderspruchsrecht: Du kannst der Verarbeitung jederzeit durch Browsereinstellungen oder einen Adblocker widersprechen.\n\n6. Cookies\nDiese Website verwendet keine Cookies.\n\n7. Betroffenenrechte\nJe nach Aufenthaltsort stehen dir Rechte bezueglich deiner personenbezogenen Daten zu. Da wir keine personenbezogenen Daten speichern, sind die meisten Rechte in der Praxis nicht anwendbar. Fuer alle Anfragen: hello@nubetracker.com\n\n8. Beschwerderecht\nBayerisches Landesamt fuer Datenschutzaufsicht (BayLDA), Promenade 18, 91522 Ansbach, www.lda.bayern.de\n\n9. Hinweis fuer Nutzer ausserhalb der EU\nFuer Nutzer ausserhalb der EU gelten die jeweiligen nationalen Datenschutzgesetze. Da wir keine personenbezogenen Daten speichern, sind saemtliche gaengigen Datenschutzanforderungen erfuellt.\n\n10. Stand: April 2026`}</p>
              ):(
                <p style={{fontSize:12,color:"#9ca3af",lineHeight:1.8,margin:0,whiteSpace:"pre-line"}}>{`1. Controller\nLars Frädrich, Veit-Stoß-Straße 64, 80687 München, Germany\nEmail: hello@nubetracker.com\n\n2. Scope\nThis privacy policy applies to all users of nubetracker.com regardless of location. EU users: This policy fulfils the requirements of the GDPR. US users: This policy fulfils the requirements of applicable US state privacy laws including CCPA.\n\n3. Data We Collect\nWe do not collect, store or process any personal data through this application. All data entered by users is stored exclusively on the user's own device and is never transmitted to us.\n\n4. Hosting\nHosted by Vercel Inc., 340 Pine Street Suite 701, San Francisco, CA 94104, USA. Vercel processes anonymized server logs (IP address anonymized, browser type, OS, timestamp, URL) for up to 30 days for technical operation purposes. Vercel is certified under the EU-US Data Privacy Framework (Commission Decision of 10 July 2023) and EU Standard Contractual Clauses are in place pursuant to Art. 46 (2) lit. c GDPR. A data processing agreement pursuant to Art. 28 GDPR is in place. For details: https://vercel.com/legal/privacy-policy\n\n5. Analytics\nWe use Vercel Analytics, a cookie-free analytics tool that does not collect personal data and does not store IP addresses. Legal basis: Art. 6 (1) lit. f GDPR (legitimate interest in service improvement). You may opt out at any time using browser privacy settings or an ad blocker.\n\n6. Cookies\nThis website does not use cookies.\n\n7. Your Rights\nDepending on your jurisdiction you may have rights regarding your personal data. As we do not store personal data, most rights are not applicable in practice. For any enquiries contact: hello@nubetracker.com\n\n8. Supervisory Authority (EU users)\nBayerisches Landesamt fuer Datenschutzaufsicht (BayLDA), Promenade 18, 91522 Ansbach, Germany. www.lda.bayern.de\n\n9. Last updated: April 2026`}</p>
              )}
            </div>
          </div>
        </div>
      )}
      <InstallPrompt show={showInstall} onInstall={install} onDismiss={dismissInstall} isNative={isNative} lang={lang}/>

      <div className="desktop-container" style={{margin:"0 auto",padding:"0 16px"}}>
        <style>{`
  .desktop-container{max-width:520px;margin:0 auto}
  .desktop-left{width:100%}
  .desktop-right{display:none}
  .hide-on-desktop{display:block}
  .hide-on-mobile{display:none}
  .tab-bar-wrapper{padding:0}
  @media(min-width:768px){
    .desktop-container{max-width:1100px;display:flex;flex-direction:column}
    .desktop-columns{display:flex;gap:24px;align-items:flex-start;padding:0 24px}
    .desktop-left{width:440px;flex-shrink:0;position:sticky;top:80px}
    .desktop-right{display:block;flex:1}
    .hide-on-desktop{display:none}
    .hide-on-mobile{display:block}
    .tab-bar-wrapper{padding:0 24px}
    .desktop-columns.single-col{display:block;width:100%;padding:0 24px}
    .desktop-columns.single-col .desktop-left{width:100%;position:static}
    .desktop-columns.single-col .desktop-right{display:none!important}
  }
  @media(prefers-reduced-motion:reduce){*{animation:none!important}}
`}</style>
        <div style={{position:"sticky",top:0,zIndex:50,background:"linear-gradient(180deg,rgba(3,7,18,1) 0%,rgba(3,7,18,0.97) 100%)",backdropFilter:"blur(8px)",WebkitBackdropFilter:"blur(8px)",borderBottom:"1px solid rgba(255,255,255,0.06)",margin:"0 -16px",padding:"0 16px"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingTop:"calc(12px + env(safe-area-inset-top))",paddingBottom:12}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <img
                src="/logopng.png"
                alt="Nube"
                height={32}
                style={{height:32,borderRadius:8,display:"block"}}
                onError={e=>{
                  e.target.style.display="none";
                  e.target.nextSibling.style.display="flex";
                }}
              />
              <div style={{display:"none",width:32,height:32,borderRadius:8,background:"linear-gradient(135deg,#22c55e,#10b981)",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 3C7 3 3 7 3 12s4 9 9 9 9-4 9-9-4-9-9-9z" fill="rgba(255,255,255,0.25)"/>
                  <path d="M8 12c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4z" fill="white"/>
                  <path d="M12 7v2M12 15v2M7 12h2M15 12h2" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <h1 style={{margin:0,fontSize:18,fontWeight:700,letterSpacing:"-0.5px",color:"#fff"}}>{t.appTitle}</h1>
            </div>
            <p style={{margin:0,fontSize:12,color:"#f9fafb",opacity:0.4}}>{t.appSubtitle}</p>
          </div>
          {user&&!isGuest&&(
            <div style={{position:"relative"}}>
              <button onClick={()=>setShowAccountMenu(p=>!p)}
                style={{minWidth:44,minHeight:44,background:"#111827",border:"1px solid rgba(255,255,255,0.1)",borderRadius:12,padding:"10px 14px",fontSize:12,fontWeight:600,color:"#22c55e",cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
                <User size={18}/>
              </button>
              {showAccountMenu&&(
                <div style={{position:"absolute",right:0,top:52,background:"#111827",border:"1px solid #374151",borderRadius:16,padding:12,minWidth:220,zIndex:100,boxShadow:"0 8px 32px rgba(0,0,0,0.6)"}}>
                  <p style={{margin:"0 0 12px",fontSize:12,color:"#6b7280",wordBreak:"break-all"}}>{user.email}</p>
                  <button onClick={async()=>{await supabase.auth.signOut();setUser(null);setShowAccountMenu(false);}}
                    style={{width:"100%",minHeight:44,background:"transparent",border:"1px solid #374151",borderRadius:10,fontSize:13,fontWeight:600,color:"#d1d5db",cursor:"pointer",marginBottom:8}}>
                    {lang==="de"?"Abmelden":"Sign out"}
                  </button>
                  <button onClick={async()=>{
                    if(window.confirm(lang==="de"?"Account wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.":"Really delete account? This cannot be undone.")){
                      await supabase.from("user_data").delete().eq("user_id",user.id);
                      await supabase.auth.signOut();
                      setUser(null);setShowAccountMenu(false);
                    }
                  }} style={{width:"100%",minHeight:44,background:"transparent",border:"1px solid rgba(239,68,68,0.3)",borderRadius:10,fontSize:13,fontWeight:600,color:"#f87171",cursor:"pointer"}}>
                    {lang==="de"?"Account löschen":"Delete account"}
                  </button>
                </div>
              )}
            </div>
          )}
          <button onClick={()=>setShowPreferences(true)}
            style={{minWidth:44,minHeight:44,background:"#111827",border:"1px solid rgba(255,255,255,0.1)",borderRadius:12,padding:"10px 14px",fontSize:12,color:"#d1d5db",cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>
            <Sliders size={16} style={{verticalAlign:"middle",marginRight:4}}/>{lang==="de"?"Ernährung":"Diet"}
          </button>
          {isPremium?(
            <div style={{minWidth:44,minHeight:44,background:"linear-gradient(135deg,#f97316,#ea580c)",borderRadius:12,padding:"10px 14px",fontSize:12,fontWeight:700,color:"#ffffff",display:"flex",alignItems:"center",gap:4,border:"1px solid rgba(255,255,255,0.2)"}}>
              <Zap size={14} fill="currentColor"/>Pro
            </div>
          ):(
            <button onClick={()=>setShowUpgradeModal(true)}
              style={{minWidth:44,minHeight:44,background:"linear-gradient(135deg,#f97316,#ea580c)",border:"1px solid rgba(255,255,255,0.2)",borderRadius:12,padding:"10px 14px",fontSize:12,fontWeight:700,color:"#ffffff",cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>
              <Zap size={14} fill="currentColor"/>Pro
            </button>
          )}
          <button
            onClick={()=>setLang(l=>l==="en"?"de":"en")}
            title={lang==="en"?"Switch to German":"Zu Englisch wechseln"}
            style={{minWidth:44,minHeight:44,background:"#111827",border:"1px solid rgba(255,255,255,0.1)",borderRadius:12,padding:"10px 14px",fontSize:13,fontWeight:600,color:"#d1d5db",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Globe size={15} style={{verticalAlign:"middle",marginRight:4}}/>{lang==="en"?"EN":"DE"}
          </button>
        </div>
        </div>
        <div className="tab-bar-wrapper">
        <div style={{display:"flex",gap:8,marginBottom:20}}>
          {["today","history","insights","browse"].map(tab=>(
            <button key={tab} onClick={()=>setActiveTab(tab)}
              style={{flex:1,minHeight:44,background:activeTab===tab?"rgba(255,255,255,0.1)":"transparent",color:activeTab===tab?"#f9fafb":"rgba(255,255,255,0.4)",border:activeTab===tab?"1px solid rgba(255,255,255,0.15)":"1px solid rgba(255,255,255,0.06)",borderRadius:12,fontSize:12,fontWeight:600,cursor:"pointer",transition:"all 0.2s ease"}}>
              {tab==="today"?<><Utensils size={14} style={{verticalAlign:"middle",marginRight:4}}/>{t.tabToday}</>:tab==="history"?<><Flame size={14} style={{verticalAlign:"middle",marginRight:4}}/>{t.tabHistory}</>:tab==="insights"?<><Activity size={14} style={{verticalAlign:"middle",marginRight:4}}/>{t.tabInsights}</>:<><BookOpen size={14} style={{verticalAlign:"middle",marginRight:4}}/>{lang==="de"?"Lexikon":"Browse"}</>}
            </button>
          ))}
        </div>
        </div>
        <div className={`desktop-columns${activeTab!=="today"?" single-col":""}`}><div className="desktop-left">

        <TabPane active={activeTab==="today"}>
          <div style={{height:pulling>0?pulling:0,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",transition:pulling===0?"height 0.3s ease":"none",color:"#4b5563",fontSize:12,fontWeight:600}}>
            {refreshing?"✓ Refreshed":pulling>50?"Release ↑":pulling>10?"Pull ↓":""}
          </div>
          <div {...pullHandlers}>
            <div style={{background:"rgba(255,255,255,0.03)",backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",border:"1px solid rgba(255,255,255,0.06)",boxShadow:"0 4px 24px rgba(0,0,0,0.3)",borderRadius:16,padding:24,marginBottom:16,display:"flex",alignItems:"center",gap:20}}>
              <PowerRing score={score} label={t.powerLabels[pidx]} pidx={pidx} col={col}/>
              <div style={{flex:1}}>
                {streak>0?(
                  <div style={{marginBottom:12}}>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <span style={{fontSize:32,fontWeight:700,color:col.fill}}>{streak}</span>
                      <span style={{fontSize:13,color:"#6b7280",display:"flex",alignItems:"center",gap:4}}>{t.streakDays}<Flame size={14} style={{color:"#f59e0b"}}/></span>
                    </div>
                    <p style={{fontSize:11,color:"#4b5563",margin:"2px 0 0"}}>{t.streakTitle}</p>
                  </div>
                ):<p style={{fontSize:12,color:"#4b5563",marginBottom:12}}>{t.streakNone}</p>}
                {added.length>0&&(
                  <div style={{fontSize:12,color:"#f9fafb",display:"flex",flexDirection:"column",gap:5}}>
                    <div style={{display:"flex",justifyContent:"space-between"}}><span style={{opacity:0.5}}>{t.vitamins}</span><span style={{color:"#4ade80",fontWeight:600}}>{ALL_VIT.filter(v=>totalN.v[v]>=2).length}/{ALL_VIT.length}</span></div>
                    <div style={{display:"flex",justifyContent:"space-between"}}><span style={{opacity:0.5}}>{t.minerals}</span><span style={{color:"#60a5fa",fontWeight:600}}>{ALL_MIN.filter(m=>totalN.m[m]>=2).length}/{ALL_MIN.length}</span></div>
                    <button onClick={()=>setActiveTab("insights")} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:"transparent",border:"none",padding:0,cursor:"pointer",width:"100%",borderRadius:6,transition:"background 0.15s"}}
                      onMouseEnter={e=>e.currentTarget.style.background="rgba(192,132,252,0.08)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <span style={{opacity:0.5,fontSize:12}}>{t.activeBenefits} ›</span>
                      <span style={{color:"#c084fc",fontWeight:600}}>{[...new Set(foodObjs.flatMap(f=>f.b[lang]||[]))].length}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div style={{position:"relative",marginBottom:12}}>
              <input value={query} onChange={e=>setQuery(e.target.value)} placeholder={t.searchPlaceholder} autoComplete="off" autoCorrect="off"
                style={{width:"100%",padding:"14px 16px",borderRadius:14,border:"1px solid rgba(255,255,255,0.08)",background:"#0f172a",fontSize:14,color:"#fff",outline:"none",transition:"all 0.2s ease"}}
                onFocus={e=>{e.target.style.borderColor="#22c55e";e.target.style.boxShadow="0 0 0 3px rgba(34,197,94,0.15)";}}
                onBlur={e=>{e.target.style.borderColor="#1f2937";e.target.style.boxShadow="none";}}/>
              {suggestions.length>0&&(
                <div style={{position:"absolute",zIndex:10,width:"100%",background:"#0f172a",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,marginTop:4,overflow:"hidden",boxShadow:"0 8px 32px rgba(0,0,0,0.6)"}}>
                  {suggestions.map(f=>{const cs=CAT_STYLE[f.cat]||{bg:"#374151",color:"#d1d5db"};return(
                    <button key={f.en} onClick={()=>addFood(f.en)}
                      style={{width:"100%",padding:"12px 16px",textAlign:"left",fontSize:13,background:"transparent",border:"none",borderBottom:"1px solid rgba(255,255,255,0.04)",color:"#e5e7eb",cursor:"pointer",display:"flex",alignItems:"center",gap:10,minHeight:44}}
                      onMouseEnter={e=>e.currentTarget.style.background="#111827"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <span style={{fontSize:11,padding:"2px 8px",borderRadius:8,background:cs.bg,color:cs.color,fontWeight:600,flexShrink:0}}>{t.catNames[f.cat]||f.cat}</span>
                      {f[lang]}
                    </button>
                  );})}
                </div>
              )}
            </div>
            {(()=>{
              const recentFoods=getRecentFoods(history,todayKey(),added).filter(k=>filteredFoodKeys.has(k));
              if(!recentFoods.length)return null;
              return(
                <div style={{marginBottom:12}}>
                  <p style={{fontSize:11,fontWeight:600,color:"#f9fafb",opacity:0.5,textTransform:"uppercase",letterSpacing:"2px",marginBottom:8}}>
                    {lang==="de"?"🕐 Zuletzt gegessen":"🕐 Recently eaten"}
                  </p>
                  <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                    {recentFoods.map(k=>{
                      const f=FOOD_BY_EN[k];
                      const cs=CAT_STYLE[f.cat]||{bg:"#374151",color:"#d1d5db"};
                      return(
                        <button key={k} onClick={()=>addFood(k)}
                          style={{fontSize:12,padding:"6px 12px",borderRadius:99,background:"#0f172a",border:"1px solid #1f2937",color:"#d1d5db",cursor:"pointer",display:"flex",alignItems:"center",gap:6,transition:"border-color 0.15s"}}
                          onMouseEnter={e=>e.currentTarget.style.borderColor="#22c55e"}
                          onMouseLeave={e=>e.currentTarget.style.borderColor="#1f2937"}>
                          <span style={{fontSize:10,padding:"1px 5px",borderRadius:99,background:cs.bg,color:cs.color,fontWeight:600}}>{(T[lang].catNames[f.cat]||f.cat)[0]}</span>
                          {f[lang]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
            {added.length>0?(
              <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:16}}>
                {foodObjs.map((f,i)=>(
                  <div key={f.en} style={{animation:`fadeSlideIn 0.3s ease ${i*0.03}s both`}}>
                    <FoodTag food={f} lang={lang} onRemove={removeFood} onRequestRemove={(key)=>setConfirmRemove(key)} isNew={f.en===newKey}/>
                  </div>
                ))}
              </div>
            ):(
              <div style={{textAlign:"center",padding:"40px 0",color:"#4b5563"}}>
                <div style={{marginBottom:8,color:"#374151"}}><Utensils size={40}/></div>
                <p style={{margin:0,fontSize:14}}>{t.noFoodsYet}</p>
                <p style={{margin:"4px 0 0",fontSize:12,color:"#374151"}}>{t.noFoodsTip}</p>
              {!isPremium&&foodObjs.length>3&&(
                  <button onClick={()=>setShowUpgradeModal(true)}
                    style={{width:"100%",background:"#0f172a",border:"1px dashed #374151",borderRadius:14,padding:"12px 16px",marginTop:8,cursor:"pointer",display:"flex",alignItems:"center",gap:10,transition:"background 0.2s"}}
                    onMouseEnter={e=>e.currentTarget.style.background="#111827"}
                    onMouseLeave={e=>e.currentTarget.style.background="#0f172a"}>
                    <Lock size={16} style={{color:"#6b7280",flexShrink:0}}/>
                    <span style={{fontSize:12,fontWeight:600,color:"#6b7280"}}>
                      {lang==="de"?`${foodObjs.length-3} weitere Lebensmittel mit Nube Pro sehen`:`See ${foodObjs.length-3} more foods with Nube Pro`}
                    </span>
                  </button>
                )}
              </div>
            )}

            {added.length>0&&(
              <div style={{borderRadius:16,padding:"16px 20px",marginBottom:16,background:col.grad}}>
                <p style={{margin:0,fontSize:15,fontWeight:600,color:"#fff"}}>{t.todaySummary}</p>
                <p style={{margin:"4px 0 0",fontSize:14,color:"rgba(255,255,255,0.7)",lineHeight:1.6}}>{getVerdict(score)}</p>
                {missingVit&&<p style={{margin:"6px 0 0",fontSize:12,color:"rgba(255,255,255,0.55)",display:"flex",alignItems:"flex-start",gap:4}}><Lightbulb size={12} style={{flexShrink:0,marginTop:2}}/>{t.missingTip}: {t.vitNames[missingVit]} — {t.missingTips[missingVit]}</p>}
              </div>
            )}

            {(synergies.length>0||synergiesLocked>0)&&(
              <div style={{marginBottom:8}}>
                {synergies.length>0&&(
                  <button onClick={()=>setShowSynergyModal(true)} style={{width:"100%",background:"rgba(120,53,15,0.3)",border:"1px solid rgba(180,83,9,0.4)",borderRadius:synergiesLocked>0?"16px 16px 0 0":"16px",padding:"12px 16px",textAlign:"left",cursor:"pointer",transition:"background 0.2s",animation:"synergyGlow 2s infinite"}}
                    onMouseEnter={e=>e.currentTarget.style.background="rgba(120,53,15,0.45)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(120,53,15,0.3)"}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
                      <p style={{margin:0,fontSize:12,fontWeight:700,color:"#fbbf24",display:"flex",alignItems:"center",gap:5}}><Zap size={13} style={{flexShrink:0}}/>{t.synergiesDetected} ({synergies.length})</p>
                      <span style={{fontSize:11,color:"#f59e0b"}}>Details ›</span>
                    </div>
                    {synergies.map((s,i)=><p key={i} style={{margin:0,fontSize:11,color:"rgba(251,191,36,0.8)",display:"flex",alignItems:"flex-start",gap:4}}><Zap size={11} style={{flexShrink:0,marginTop:1}}/>{s}</p>)}
                  </button>
                )}
                {synergiesLocked>0&&(
                  <button onClick={()=>setShowUpgradeModal(true)}
                    style={{width:"100%",background:"#0f172a",border:"1px solid #374151",borderRadius:synergies.length>0?"0 0 16px 16px":"16px",padding:"12px 16px",textAlign:"left",cursor:"pointer",display:"flex",alignItems:"center",gap:10,transition:"background 0.2s"}}
                    onMouseEnter={e=>e.currentTarget.style.background="#111827"} onMouseLeave={e=>e.currentTarget.style.background="#0f172a"}>
                    <Lock size={16} style={{color:"#6b7280",flexShrink:0}}/>
                    <span style={{fontSize:12,fontWeight:600,color:"#6b7280"}}>
                      {lang==="de"?`${synergiesLocked} weitere Synergien erkannt — Mit Nube Pro freischalten`:`${synergiesLocked} more synergies detected — Unlock with Nube Pro`}
                    </span>
                  </button>
                )}
              </div>
            )}
            {potentialSynergies.length>0&&added.length>0&&(
              <button onClick={()=>setShowSynergyModal(true)} style={{width:"100%",background:"#0f172a",border:"1px dashed #374151",borderRadius:16,padding:"12px 16px",marginBottom:16,textAlign:"left",cursor:"pointer",transition:"background 0.2s"}}
                onMouseEnter={e=>e.currentTarget.style.background="#111827"} onMouseLeave={e=>e.currentTarget.style.background="#0f172a"}>
                <p style={{margin:"0 0 6px",fontSize:12,fontWeight:700,color:"#6b7280",display:"flex",alignItems:"center",gap:5}}><Lightbulb size={13} style={{flexShrink:0}}/>{t.potentialSynergies}</p>
                {potentialSynergies.map(s=>{
                  const missing=!s.sideA?s.missingA:s.missingB;
                  const benefit=t[s.key].split("→")[1]?.trim()||t[s.key];
                  return <p key={s.key} style={{margin:0,fontSize:11,color:"#4b5563",lineHeight:1.6,display:"flex",alignItems:"flex-start",gap:4}}><Lightbulb size={11} style={{flexShrink:0,marginTop:2}}/>{t.addToUnlock(missing,benefit)}</p>;
                })}
              </button>
            )}
            {synergies.length===0&&potentialSynergies.length===0&&added.length>0&&(
              <button onClick={()=>setShowSynergyModal(true)} style={{width:"100%",background:"#0f172a",border:"1px dashed #374151",borderRadius:16,padding:"12px 16px",marginBottom:16,textAlign:"left",cursor:"pointer",transition:"background 0.2s"}}
                onMouseEnter={e=>e.currentTarget.style.background="#1f2937"} onMouseLeave={e=>e.currentTarget.style.background="#0f172a"}>
                <p style={{margin:0,fontSize:12,fontWeight:700,color:"#4b5563",display:"flex",alignItems:"center",gap:5}}><Zap size={13} style={{flexShrink:0}}/>{t.synergyPossible} ›</p>
              </button>
            )}

            {added.length>0&&(
              <div style={{marginBottom:16}}>
                <p style={{fontSize:11,fontWeight:600,color:"#f9fafb",opacity:0.5,textTransform:"uppercase",letterSpacing:"2px",marginBottom:10,display:"flex",alignItems:"center",gap:5}}><Sparkles size={13}/>{lang==="de"?"Deine heutigen Lebensmittel":"Today's Foods"}</p>
                {(isPremium?foodObjs:foodObjs.slice(0,3)).map((food,i)=>{
                  const cs=CAT_STYLE[food.cat]||{bg:"#374151",color:"#d1d5db"};
                  return(
                    <div key={food.en} style={{background:"#0f172a",borderRadius:16,padding:"14px 16px",marginBottom:8,animation:`fadeSlideIn 0.3s ease ${i*0.04}s both`}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                        <span style={{fontSize:11,padding:"2px 8px",borderRadius:8,background:cs.bg,color:cs.color,fontWeight:700,flexShrink:0}}>{t.catNames[food.cat]||food.cat}</span>
                        <span style={{fontSize:13,fontWeight:700,color:"#f9fafb"}}>{food[lang]}</span>
                      </div>
                      <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                        {(food.b[lang]||[]).map((b,j)=>{
                          const bs=BENEFIT_STYLES[j%BENEFIT_STYLES.length];
                          const hasInfo=!!(BENEFIT_INFO[lang]?.[b]||BENEFIT_INFO.en?.[b]);
                          return(
                            <button key={b} onClick={()=>{
                                if(!isPremium){setShowUpgradeModal(true);return;}
                                hasInfo&&setSelBenefit(b);
                              }}
                              style={{fontSize:11,padding:"3px 10px",borderRadius:99,background:bs.bg,color:bs.color,border:bs.border,fontWeight:500,cursor:hasInfo||!isPremium?"pointer":"default",transition:"opacity 0.15s",opacity:hasInfo?1:0.75}}>
                              {b}{hasInfo&&!isPremium?<Lock size={10} style={{verticalAlign:"middle",marginLeft:3}}/>:hasInfo?" ›":""}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="hide-on-desktop">
            {added.length>0&&(
              <div style={{background:"rgba(255,255,255,0.03)",backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",border:"1px solid rgba(255,255,255,0.06)",boxShadow:"0 4px 24px rgba(0,0,0,0.3)",borderRadius:16,padding:20,marginBottom:16}}>
                <p style={{fontSize:11,fontWeight:600,color:"#f9fafb",opacity:0.5,textTransform:"uppercase",letterSpacing:"2px",marginBottom:8,marginTop:0}}>{t.vitamins}</p>
                <div style={{display:"flex",gap:16,marginBottom:10,flexWrap:"wrap"}}>
                  {[["—","#374151",lang==="de"?"Nicht abgedeckt":"Not covered"],
                    ["~","#facc15",lang==="de"?"Spur vorhanden":"Trace amount"],
                    ["✓","#60a5fa",lang==="de"?"Gut abgedeckt":"Good coverage"],
                    ["✓✓","#4ade80",lang==="de"?"Sehr gut":"Excellent"]
                  ].map(([sym,col,label])=>(
                    <div key={sym} style={{display:"flex",alignItems:"center",gap:5}}>
                      <span style={{fontSize:12,fontWeight:700,color:col,minWidth:16}}>{sym}</span>
                      <span style={{fontSize:11,color:"#4b5563"}}>{label}</span>
                    </div>
                  ))}
                </div>
                {ALL_VIT.map(v=><NutrientRow key={v} nk={v} type="vitamins"/>)}
                <p style={{fontSize:11,fontWeight:600,color:"#f9fafb",opacity:0.5,textTransform:"uppercase",letterSpacing:"2px",margin:"12px 0 8px"}}>{t.minerals}</p>
                {ALL_MIN.map(m=><NutrientRow key={m} nk={m} type="minerals"/>)}
              </div>
            )}
            </div>
          </div>
        </TabPane>

        <TabPane active={activeTab==="history"}>
          <div style={{background:"rgba(255,255,255,0.03)",backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",border:"1px solid rgba(255,255,255,0.06)",boxShadow:"0 4px 24px rgba(0,0,0,0.3)",borderRadius:16,padding:20,marginBottom:16}}>
            <p style={{fontSize:11,fontWeight:600,color:"#f9fafb",opacity:0.5,textTransform:"uppercase",letterSpacing:"2px",marginBottom:16,marginTop:0}}>{t.heatmapTitle}</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(10,1fr)",gap:6}}>
              {heatDays.map(({key,score:s,isToday})=>(
                <div key={key} style={{width:"100%",aspectRatio:"1",borderRadius:6,background:getHeatBg(s),outline:isToday?"2px solid white":""}}/>
              ))}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginTop:12,fontSize:11,color:"#4b5563",flexWrap:"wrap"}}>
              {[["#1f2937","0"],["#14532d","<25"],["#16a34a","<50"],["#10b981","<75"],["#f59e0b","Elite"]].map(([bg,lbl])=>(
                <div key={lbl} style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:12,height:12,borderRadius:3,background:bg}}/><span>{lbl}</span></div>
              ))}
            </div>
          </div>
          <div style={{background:"rgba(255,255,255,0.03)",backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",border:"1px solid rgba(255,255,255,0.06)",boxShadow:"0 4px 24px rgba(0,0,0,0.3)",borderRadius:16,padding:20,marginBottom:16,display:"flex",alignItems:"center",gap:12}}>
            <Flame size={36} style={{color:"#f59e0b",flexShrink:0}}/>
            <div>
              <p style={{margin:0,fontSize:24,fontWeight:900,color:col.fill}}>{streak} {t.streakDays}</p>
              <p style={{margin:"2px 0 0",fontSize:12,color:"#4b5563"}}>{streak>0?t.streakTitle:t.streakNone}</p>
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {!isPremium&&heatDays.slice(0,22).some(({key})=>(history[key]||[]).length>0)&&(
              <button onClick={()=>setShowUpgradeModal(true)}
                style={{width:"100%",background:"#0f172a",border:"1px dashed #374151",borderRadius:14,padding:"12px 16px",marginBottom:4,cursor:"pointer",display:"flex",alignItems:"center",gap:10,transition:"background 0.2s"}}
                onMouseEnter={e=>e.currentTarget.style.background="#111827"} onMouseLeave={e=>e.currentTarget.style.background="#0f172a"}>
                <span style={{fontSize:16}}>🔒</span>
                <span style={{fontSize:12,fontWeight:600,color:"#6b7280"}}>
                  {lang==="de"?"Ältere Historie mit Nube Pro verfügbar":"Older history available with Nube Pro"}
                </span>
              </button>
            )}
            {heatDays.slice().reverse().map(({key,score:s,isToday,d},idx)=>{
              const foods=history[key]||[];if(!foods.length)return null;
              if(!isPremium&&idx>6)return null;
              const c=getPowerColor(s);
              return(
                <div key={key} onClick={()=>setEditDay(key)} style={{background:"rgba(255,255,255,0.03)",backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",borderRadius:16,padding:"12px 16px",border:isToday?"1px solid rgba(34,197,94,0.3)":"1px solid rgba(255,255,255,0.06)",boxShadow:"0 4px 24px rgba(0,0,0,0.3)",cursor:"pointer",transition:"border-color 0.2s,box-shadow 0.2s,transform 0.2s"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.15)";e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.boxShadow="0 8px 32px rgba(0,0,0,0.4)";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=isToday?"rgba(34,197,94,0.3)":"rgba(255,255,255,0.06)";e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 4px 24px rgba(0,0,0,0.3)";}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                    <span style={{fontSize:13,fontWeight:600,color:"#d1d5db"}}>{t.dayLabel(d)}{isToday?" — "+t.todayMark:""}</span>
                    <span style={{fontSize:13,fontWeight:900,color:c.fill}}>{s}pts</span>
                  </div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                    {foods.map(k=>FOOD_BY_EN[k]).filter(Boolean).map(f=>{
                      const cs=CAT_STYLE[f.cat]||{bg:"#374151",color:"#d1d5db"};
                      return <span key={f.en} style={{fontSize:11,padding:"2px 8px",borderRadius:8,background:cs.bg,color:cs.color,fontWeight:600}}>{f[lang]}</span>;
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </TabPane>
        <TabPane active={activeTab==="browse"}>
        {!isPremium?(
          <div style={{position:"relative",minHeight:300}}>
            <div style={{filter:"blur(5px)",pointerEvents:"none",opacity:0.4}}>
              <div style={{background:"#0f172a",borderRadius:14,padding:"10px 14px",marginBottom:6,display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:10,padding:"2px 7px",borderRadius:99,background:"#fee2e2",color:"#b91c1c",fontWeight:700}}>Protein</span>
                <span style={{fontSize:13,fontWeight:600,color:"#d1d5db",flex:1}}>Chicken Breast</span>
              </div>
              <div style={{background:"#0f172a",borderRadius:14,padding:"10px 14px",marginBottom:6,display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:10,padding:"2px 7px",borderRadius:99,background:"#dcfce7",color:"#15803d",fontWeight:700}}>Vegetable</span>
                <span style={{fontSize:13,fontWeight:600,color:"#d1d5db",flex:1}}>Spinach</span>
              </div>
              <div style={{background:"#0f172a",borderRadius:14,padding:"10px 14px",marginBottom:6,display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:10,padding:"2px 7px",borderRadius:99,background:"#ffedd5",color:"#c2410c",fontWeight:700}}>Fruit</span>
                <span style={{fontSize:13,fontWeight:600,color:"#d1d5db",flex:1}}>Blueberries</span>
              </div>
            </div>
            <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12,textAlign:"center",padding:"0 24px"}}>
              <Lock size={32} style={{color:"#6b7280"}}/>
              <p style={{margin:0,fontSize:15,fontWeight:900,color:"#f9fafb"}}>
                {lang==="de"?"Das Lebensmittel-Lexikon ist ein Nube Pro Feature":"The Food Lexicon is a Nube Pro feature"}
              </p>
              <p style={{margin:0,fontSize:13,color:"#6b7280",lineHeight:1.5}}>
                {lang==="de"?"Durchstöbere alle Lebensmittel nach Kategorie.":"Browse all foods by category and add them directly."}
              </p>
              <button onClick={()=>setShowUpgradeModal(true)}
                style={{background:"linear-gradient(135deg,#f59e0b,#f97316)",border:"none",borderRadius:14,padding:"12px 24px",fontSize:14,fontWeight:800,color:"#fff",cursor:"pointer"}}>
                {lang==="de"?"Nube Pro freischalten →":"Unlock Nube Pro →"}
              </button>
            </div>
          </div>
        ):(
        <div>
          {/* ADMIN SECTION */}
        <div style={{marginBottom:16}}>
          {!adminMode?(
            <button onClick={()=>{
              const pw=prompt("Admin Password:");
              if(pw==="nube2026admin"){
                setAdminMode(true);
                try{setMissingFoods(JSON.parse(localStorage.getItem("wft-missing")||"{}"))}catch{}
              }
            }} style={{background:"transparent",border:"none",color:"#030712",fontSize:10,cursor:"pointer",padding:0,userSelect:"none"}}>·</button>
          ):(
            <div style={{background:"#0f172a",border:"1px solid #ef4444",borderRadius:16,padding:16,marginBottom:16}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
                <p style={{margin:0,fontSize:12,fontWeight:700,color:"#ef4444"}}>🔐 Admin — Missing Foods</p>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>{
                    if(window.confirm("Alle fehlgeschlagenen Suchen löschen?")){
                      localStorage.removeItem("wft-missing");
                      setMissingFoods({});
                    }
                  }} style={{background:"transparent",border:"1px solid #374151",borderRadius:8,padding:"4px 10px",fontSize:11,color:"#6b7280",cursor:"pointer"}}>Clear</button>
                  <button onClick={()=>setAdminMode(false)} style={{background:"transparent",border:"none",color:"#6b7280",fontSize:16,cursor:"pointer"}}>✕</button>
                </div>
              </div>
              {Object.keys(missingFoods).length===0?(
                <p style={{fontSize:12,color:"#4b5563",margin:0}}>Keine fehlgeschlagenen Suchen gespeichert.</p>
              ):(
                <div>
                  <p style={{fontSize:11,color:"#4b5563",marginBottom:8,marginTop:0}}>Sortiert nach Häufigkeit — {Object.keys(missingFoods).length} einzigartige Begriffe</p>
                  {Object.entries(missingFoods)
                    .sort((a,b)=>b[1]-a[1])
                    .map(([term,count])=>(
                      <div key={term} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid #1f2937"}}>
                        <span style={{fontSize:12,color:"#d1d5db"}}>{term}</span>
                        <span style={{fontSize:11,fontWeight:700,color:"#ef4444",background:"rgba(239,68,68,0.1)",padding:"2px 8px",borderRadius:8}}>{count}×</span>
                      </div>
                    ))
                  }
                </div>
              )}
            </div>
          )}
        </div>
          <p style={{fontSize:11,fontWeight:600,color:"#f9fafb",opacity:0.5,textTransform:"uppercase",letterSpacing:"2px",marginBottom:4,marginTop:0}}>
            {lang==="de"?"Alle Lebensmittel":"All Foods"}
          </p>
          <p style={{fontSize:12,color:"#4b5563",marginBottom:12,marginTop:0}}>
            {lang==="de"?"Tippe ein Lebensmittel um es heute hinzuzufügen":"Tap any food to add it to today"}
          </p>
          <div style={{position:"relative",marginBottom:16}}>
            <input value={browseQuery} onChange={e=>setBrowseQuery(e.target.value)}
              placeholder={lang==="de"?"Lebensmittel suchen...":"Search foods..."}
              autoComplete="off" autoCorrect="off"
              style={{width:"100%",padding:"12px 16px",borderRadius:14,border:"1px solid #1f2937",background:"#0f172a",fontSize:14,color:"#fff",outline:"none"}}
              onFocus={e=>e.target.style.borderColor="#22c55e"}
              onBlur={e=>e.target.style.borderColor="#1f2937"}/>
            {browseQuery&&(
              <button onClick={()=>setBrowseQuery("")}
                style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"transparent",border:"none",color:"#6b7280",cursor:"pointer",fontSize:16,padding:0}}>✕</button>
            )}
          </div>
          {browseQuery.trim()?(
            <div>
              {filteredFoods.filter(f=>
                f[lang].toLowerCase().includes(browseQuery.toLowerCase())||
                f.en.toLowerCase().includes(browseQuery.toLowerCase())||
                (f.aliases||[]).some(a=>a.toLowerCase().includes(browseQuery.toLowerCase()))
              ).length===0?(
                <p style={{fontSize:13,color:"#4b5563",textAlign:"center",padding:"24px 0"}}>
                  {lang==="de"?"Keine Lebensmittel gefunden":"No foods found"}
                </p>
              ):(
                filteredFoods.filter(f=>
                  f[lang].toLowerCase().includes(browseQuery.toLowerCase())||
                  f.en.toLowerCase().includes(browseQuery.toLowerCase())||
                  (f.aliases||[]).some(a=>a.toLowerCase().includes(browseQuery.toLowerCase()))
                ).map(f=>{
                  const cs=CAT_STYLE[f.cat]||{bg:"#374151",color:"#d1d5db"};
                  const isAdded=added.includes(f.en);
                  return(
                    <div key={f.en} onClick={()=>addFood(f.en)}
                      style={{width:"100%",minHeight:44,background:"#0f172a",border:"1px solid "+(isAdded?"rgba(34,197,94,0.3)":"#1f2937"),borderRadius:12,padding:"10px 14px",marginBottom:6,display:"flex",alignItems:"center",gap:10,cursor:"pointer",textAlign:"left"}}
                      onMouseEnter={e=>e.currentTarget.style.background="#111827"}
                      onMouseLeave={e=>e.currentTarget.style.background="#0f172a"}>
                      <span style={{fontSize:10,padding:"2px 7px",borderRadius:99,background:cs.bg,color:cs.color,fontWeight:700,flexShrink:0}}>{(T[lang].catNames[f.cat])||f.cat}</span>
                      <span style={{fontSize:13,fontWeight:600,color:isAdded?"#4ade80":"#e5e7eb",flex:1}}>{f[lang]}</span>
                      {isAdded&&<span style={{fontSize:14,color:"#4ade80",flexShrink:0}}>✓</span>}
                      <button onClick={e=>{e.stopPropagation();excludeFood(f.en);}} style={{background:"transparent",border:"none",padding:"4px 2px",cursor:"pointer",fontSize:13,flexShrink:0,color:"#374151",lineHeight:1}} title={lang==="de"?"Ausblenden":"Hide"}>🚫</button>
                    </div>
                  );
                })
              )}
            </div>
          ):(
            ["Protein","Dairy","Vegetable","Fruit","Grain","Legume","Nut/Seed","Fat/Oil","Spice","Special","SoulFood"].map(cat=>{
              const catFoods=filteredFoods.filter(f=>f.cat===cat);
              if(!catFoods.length)return null;
              const cs=CAT_STYLE[cat]||{bg:"#374151",color:"#d1d5db"};
              const isOpen=!!openCats[cat];
              const catLabel=T[lang].catNames[cat]||cat;
              return(
                <div key={cat} style={{marginBottom:8}}>
                  <button onClick={()=>setOpenCats(p=>({...p,[cat]:!p[cat]}))}
                    style={{width:"100%",minHeight:44,background:"#0f172a",border:"1px solid #1f2937",borderRadius:isOpen?"14px 14px 0 0":"14px",padding:"10px 14px",display:"flex",alignItems:"center",gap:10,cursor:"pointer",textAlign:"left"}}
                    onMouseEnter={e=>e.currentTarget.style.background="#111827"}
                    onMouseLeave={e=>e.currentTarget.style.background="#0f172a"}>
                    <span style={{fontSize:11,padding:"2px 8px",borderRadius:8,background:cs.bg,color:cs.color,fontWeight:700,flexShrink:0}}>{catLabel}</span>
                    <span style={{fontSize:13,fontWeight:700,color:"#d1d5db",flex:1}}>{catLabel} <span style={{color:"#4b5563",fontWeight:400}}>({catFoods.length})</span></span>
                    <span style={{color:"#4b5563",fontSize:12,display:"inline-block",transform:isOpen?"rotate(180deg)":"rotate(0deg)",transition:"transform 0.2s"}}>▼</span>
                  </button>
                  {isOpen&&(
                    <div style={{border:"1px solid #1f2937",borderTop:"none",borderRadius:"0 0 14px 14px",overflow:"hidden"}}>
                      {catFoods.map((f,i)=>{
                        const isAdded=added.includes(f.en);
                        return(
                          <div key={f.en} onClick={()=>addFood(f.en)}
                            style={{width:"100%",minHeight:44,background:isAdded?"rgba(34,197,94,0.05)":"#0f172a",borderBottom:i<catFoods.length-1?"1px solid #111827":"none",padding:"10px 14px",display:"flex",alignItems:"center",gap:10,cursor:"pointer",textAlign:"left"}}
                            onMouseEnter={e=>e.currentTarget.style.background=isAdded?"rgba(34,197,94,0.1)":"#111827"}
                            onMouseLeave={e=>e.currentTarget.style.background=isAdded?"rgba(34,197,94,0.05)":"#0f172a"}>
                            <span style={{fontSize:13,fontWeight:600,color:isAdded?"#4ade80":"#d1d5db",flex:1}}>{f[lang]}</span>
                            {isAdded?<span style={{fontSize:13,color:"#4ade80",flexShrink:0}}>✓</span>:<span style={{fontSize:11,color:"#374151",flexShrink:0}}>+</span>}
                            <button onClick={e=>{e.stopPropagation();excludeFood(f.en);}} style={{background:"transparent",border:"none",padding:"4px 2px",cursor:"pointer",fontSize:13,flexShrink:0,color:"#374151",lineHeight:1}} title={lang==="de"?"Ausblenden":"Hide"}>🚫</button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>)}
      </TabPane>
        <TabPane active={activeTab==="insights"}>
          {!isPremium?(
            <div style={{position:"relative",minHeight:300}}>
              <div style={{filter:"blur(5px)",pointerEvents:"none",opacity:0.4}}>
                {HEALTH_GOALS[lang].slice(0,2).map(goal=>(
                  <div key={goal.id} style={{background:"#0f172a",borderRadius:16,padding:16,marginBottom:12,border:"1px solid #1f2937"}}>
                    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                      {(()=>{const I=goal.icon;return <I size={22} style={{color:"#9ca3af",flexShrink:0}}/>;})()}
                      <span style={{fontSize:14,fontWeight:800,color:"#f9fafb"}}>{goal.label}</span>
                    </div>
                    <p style={{fontSize:12,color:"#6b7280",lineHeight:1.5,margin:0}}>{goal.desc}</p>
                  </div>
                ))}
              </div>
              <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12,textAlign:"center",padding:"0 24px"}}>
                <Lock size={32} style={{color:"#6b7280"}}/>
                <p style={{margin:0,fontSize:15,fontWeight:900,color:"#f9fafb"}}>
                  {lang==="de"?"Health Goals sind ein Nube Pro Feature":"Health Goals are a Nube Pro feature"}
                </p>
                <p style={{margin:0,fontSize:13,color:"#6b7280",lineHeight:1.5}}>
                  {lang==="de"?"Sieh genau welche Gesundheitsziele dein Essen heute abdeckt.":"See exactly which health goals your food covers today."}
                </p>
                <button onClick={()=>setShowUpgradeModal(true)}
                  style={{background:"linear-gradient(135deg,#f59e0b,#f97316)",border:"none",borderRadius:14,padding:"12px 24px",fontSize:14,fontWeight:800,color:"#fff",cursor:"pointer"}}>
                  {lang==="de"?"Nube Pro freischalten →":"Unlock Nube Pro →"}
                </button>
              </div>
            </div>
          ):(
          <>
          <p style={{fontSize:11,fontWeight:600,color:"#f9fafb",opacity:0.5,textTransform:"uppercase",letterSpacing:"2px",marginBottom:16,marginTop:0}}>
            {lang==="de"?"Was deckst du heute ab?":"What are you covering today?"}
          </p>
          {HEALTH_GOALS[lang].map((goal,i)=>{
            const matchedFoods=foodObjs.filter(f=>(f.b[lang]||[]).some(b=>goal.keywords.some(kw=>b.toLowerCase().includes(kw.toLowerCase()))));
            const covered=matchedFoods.length>0;
            return(
              <div key={goal.id} style={{background:"#0f172a",borderRadius:16,padding:16,marginBottom:12,border:covered?"1px solid rgba(34,197,94,0.3)":"1px solid #1f2937",animation:`fadeSlideIn 0.3s ease ${i*0.05}s both`}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                  {(()=>{const I=goal.icon;return <I size={22} style={{color:"#9ca3af",flexShrink:0}}/>;})()}
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                      <span style={{fontSize:14,fontWeight:800,color:covered?"#4ade80":"#f9fafb"}}>{goal.label}</span>
                      <span style={{fontSize:11,fontWeight:700,color:covered?"#4ade80":"#374151",background:covered?"rgba(34,197,94,0.12)":"#111827",padding:"3px 10px",borderRadius:99}}>
                        {covered?(lang==="de"?"✓ Abgedeckt":"✓ Covered"):(lang==="de"?"Noch offen":"Not yet")}
                      </span>
                    </div>
                  </div>
                </div>
                <p style={{fontSize:12,color:"#6b7280",lineHeight:1.5,margin:"0 0 10px"}}>{goal.desc}</p>
                {covered&&(
                  <div>
                    <p style={{fontSize:11,color:"#4b5563",fontWeight:600,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.05em"}}>{lang==="de"?"Beitragende Lebensmittel:":"Contributing foods:"}</p>
                    <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                      {matchedFoods.map(f=>{const cs=CAT_STYLE[f.cat]||{bg:"#374151",color:"#d1d5db"};return <span key={f.en} style={{fontSize:11,padding:"3px 10px",borderRadius:99,background:cs.bg,color:cs.color,fontWeight:600}}>{f[lang]}</span>;})}
                    </div>
                  </div>
                )}
                {!covered&&(
                  <div>
                    <p style={{fontSize:11,color:"#4b5563",fontWeight:600,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.05em"}}>{lang==="de"?"Tipp — Noch heute hinzufügen:":"Tip — Add today:"}</p>
                    <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                      {getRotatedSuggestions(goal,lang,added,todayKey(),filteredFoods).map(f=>{
                        const cs=CAT_STYLE[f.cat]||{bg:"#374151",color:"#d1d5db"};
                        return <button key={f.en} onClick={()=>addFood(f.en)} style={{fontSize:11,padding:"3px 10px",borderRadius:99,background:"#1f2937",border:"1px dashed #374151",color:"#9ca3af",fontWeight:600,cursor:"pointer"}}>+ {f[lang]}</button>;
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </>)}
        </TabPane>
        </div>
        {activeTab==="today"&&(
          <div className="desktop-right">
            <div className="hide-on-mobile">
              {activeTab==="today"&&added.length>0&&(
                <div style={{background:"rgba(255,255,255,0.03)",backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",border:"1px solid rgba(255,255,255,0.06)",boxShadow:"0 4px 24px rgba(0,0,0,0.3)",borderRadius:16,padding:20,marginBottom:16}}>
                  <p style={{fontSize:11,fontWeight:600,color:"#f9fafb",opacity:0.5,textTransform:"uppercase",letterSpacing:"2px",marginBottom:8,marginTop:0}}>{t.vitamins}</p>
                  <div style={{display:"flex",gap:16,marginBottom:10,flexWrap:"wrap"}}>
                    {[["—","#374151",lang==="de"?"Nicht abgedeckt":"Not covered"],
                      ["~","#facc15",lang==="de"?"Spur vorhanden":"Trace amount"],
                      ["✓","#60a5fa",lang==="de"?"Gut abgedeckt":"Good coverage"],
                      ["✓✓","#4ade80",lang==="de"?"Sehr gut":"Excellent"]
                    ].map(([sym,col,label])=>(
                      <div key={sym} style={{display:"flex",alignItems:"center",gap:5}}>
                        <span style={{fontSize:12,fontWeight:700,color:col,minWidth:16}}>{sym}</span>
                        <span style={{fontSize:11,color:"#4b5563"}}>{label}</span>
                      </div>
                    ))}
                  </div>
                  {ALL_VIT.map(v=><NutrientRow key={v} nk={v} type="vitamins"/>)}
                  <p style={{fontSize:11,fontWeight:600,color:"#f9fafb",opacity:0.5,textTransform:"uppercase",letterSpacing:"2px",margin:"12px 0 8px"}}>{t.minerals}</p>
                  {ALL_MIN.map(m=><NutrientRow key={m} nk={m} type="minerals"/>)}
                </div>
              )}
            </div>
          </div>
        )}
        </div>
      </div>

     <div style={{textAlign:"center",padding:"24px 0 calc(24px + env(safe-area-inset-bottom))",display:"flex",justifyContent:"center",gap:20}}>
        <button onClick={()=>setShowImpressum(true)} style={{background:"transparent",border:"none",color:"#4b5563",fontSize:11,cursor:"pointer",padding:0}}>Impressum</button>
        <button onClick={()=>setShowPrivacy(true)} style={{background:"transparent",border:"none",color:"#4b5563",fontSize:11,cursor:"pointer",padding:0}}>{lang==="de"?"Datenschutz":"Privacy Policy"}</button>
        <button onClick={()=>setShowContact(true)} style={{background:"transparent",border:"none",color:"#4b5563",fontSize:11,cursor:"pointer",padding:0}}>{lang==="de"?"Kontakt":"Contact"}</button>
        <button onClick={()=>setShowAbout(true)} style={{background:"transparent",border:"none",color:"#4b5563",fontSize:11,cursor:"pointer",padding:0}}>{lang==="de"?"Ueber uns":"About"}</button>
        <button onClick={()=>window.open("https://buymeacoffee.com/DEIN_LINK","_blank")} style={{background:"transparent",border:"none",color:"#4b5563",fontSize:11,cursor:"pointer",padding:0}}>{lang==="de"?"☕ Unterstützen":"☕ Support"}</button>
        {isGuest&&<button onClick={()=>setIsGuest(false)} style={{background:"transparent",border:"none",color:"#4b5563",fontSize:11,cursor:"pointer",padding:0,display:"inline-flex",alignItems:"center",gap:4}}><User size={12}/>{lang==="de"?"Anmelden / Konto erstellen":"Sign in / Create account"}</button>}
      </div> 
    </div>
  );
}
