// --- GENERACIÓN DINÁMICA DE NIVELES ---

let LEVEL_DATA = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [] };

function generateAllLevels() {
    const vowels = ["A", "E", "I", "O", "U"];
    const consonants = Object.keys(PHONETIC_ALPHABET);

    // 1. NIVEL 1: Conozcamos las Vocales (Se gestiona directo por interfaz)
    LEVEL_DATA[1] = vowels;

    // 2. NIVEL 2: Conozcamos las Consonantes (Se gestiona directo por interfaz)
    LEVEL_DATA[2] = consonants;

    // 3. NIVEL 3: Juego de Vocales (¿Con qué vocal empieza...?)
    const vowelWords = MASTER_WORDS.filter(w => vowels.includes(w.word[0]));
    const shuffledVowels = [...vowelWords].sort(() => Math.random() - 0.5).slice(0, 6);
    LEVEL_DATA[3] = shuffledVowels.map(w => {
        const targetVowel = w.word[0];
        const otherVowels = vowels.filter(v => v !== targetVowel).sort(() => Math.random() - 0.5).slice(0, 3);
        const options = [targetVowel, ...otherVowels].sort(() => Math.random() - 0.5);
        return {
            emoji: w.emoji,
            word: w.word,
            prompt: `¿Con qué vocal empieza ${w.word.toLowerCase()}?`,
            target: targetVowel,
            options: options
        };
    });

    // 4. NIVEL 4: Juego de Consonantes (¿Con qué letra inicia...?)
    const consonantWords = MASTER_WORDS.filter(w => !vowels.includes(w.word[0]));
    const shuffledConsonantWords = [...consonantWords].sort(() => Math.random() - 0.5).slice(0, 6);
    LEVEL_DATA[4] = shuffledConsonantWords.map(w => {
        const targetConsonant = w.word[0];
        const otherConsonants = consonants.filter(c => c !== targetConsonant).sort(() => Math.random() - 0.5).slice(0, 3);
        const options = [targetConsonant, ...otherConsonants].sort(() => Math.random() - 0.5);
        return {
            emoji: w.emoji,
            word: w.word,
            prompt: `¿Con qué letra inicia <strong class="highlight-word">${w.word}</strong>?`,
            target: targetConsonant,
            options: options
        };
    });

    // 5. NIVEL 5: Juego de Sílabas (¿Con qué sílaba empieza...?)
    const syllableCandidates = MASTER_WORDS.filter(w => !vowels.includes(w.word[0]) && w.word.length >= 3);
    const shuffledSyllables = [...syllableCandidates].sort(() => Math.random() - 0.5).slice(0, 6);
    LEVEL_DATA[5] = shuffledSyllables.map(w => {
        const firstTwo = w.word.substring(0, 2);
        const c = w.word[0];
        const localSyllables = [c + "A", c + "E", c + "I", c + "O", c + "U"].filter(s => s !== firstTwo);
        const otherOptions = localSyllables.sort(() => Math.random() - 0.5).slice(0, 3);
        const options = [firstTwo, ...otherOptions].sort(() => Math.random() - 0.5);

        return {
            emoji: w.emoji,
            word: w.word,
            prompt: `¿Con qué sílaba empieza <strong class="highlight-word">${w.word}</strong>?`,
            target: firstTwo,
            options: options
        };
    });

    // 6. NIVEL 6: Palabras Cortas (Deletreo 3-4 letras)
    const shortWords = MASTER_WORDS.filter(w => w.word.length <= 4);
    LEVEL_DATA[6] = [...shortWords].sort(() => Math.random() - 0.5).slice(0, 8);

    // 7. NIVEL 7: Palabras Grandes (Deletreo 5+ letras)
    const longWords = MASTER_WORDS.filter(w => w.word.length >= 5);
    LEVEL_DATA[7] = [...longWords].sort(() => Math.random() - 0.5).slice(0, 8);

    // 8. NIVEL 8: Silabario Mágico
    const level8Data = [];
    consonants.forEach(c => {
        const item = PHONETIC_ALPHABET[c];
        const wordsForConsonant = MASTER_WORDS.filter(w => w.word[0] === c);
        if (wordsForConsonant.length === 0) return;

        const questions = [];
        wordsForConsonant.forEach(w => {
            const firstTwo = w.word.substring(0, 2);
            const distractors = MASTER_WORDS.filter(dw => dw.word[0] !== c).sort(() => Math.random() - 0.5).slice(0, 2);
            const options = [
                { word: w.word, emoji: w.emoji },
                ...distractors.map(dw => ({ word: dw.word, emoji: dw.emoji }))
            ].sort(() => Math.random() - 0.5);

            questions.push({
                prompt: `Muéstrame una palabra que inicie con ${firstTwo}`,
                target: w.word,
                emoji: w.emoji,
                options: options
            });
        });

        if (questions.length > 0) {
            level8Data.push({
                letter: c,
                phoneticName: item.phoneticName,
                syllables: item.syllables,
                questions: questions.slice(0, 2)
            });
        }
    });

    LEVEL_DATA[8] = level8Data.sort(() => Math.random() - 0.5);

    // 9. NIVEL 9: Sopa de Letras
    const sopaWords = MASTER_WORDS.filter(w => w.word.length >= 3 && w.word.length <= 5)
        .sort(() => Math.random() - 0.5)
        .slice(0, 6);
    LEVEL_DATA[9] = sopaWords.map(w => ({
        word: w.word,
        emoji: w.emoji,
        prompt: `Busca las letras en orden para formar la palabra <strong class="highlight-word">${w.word}</strong>`
    }));

    // 10. NIVEL 10: Constructor de Sílabas
    const constructorWords = MASTER_WORDS.filter(w => getSyllables(w.word).length >= 2)
        .sort(() => Math.random() - 0.5)
        .slice(0, 6);
    LEVEL_DATA[10] = constructorWords.map(w => {
        const syllables = getSyllables(w.word);
        return {
            word: w.word,
            emoji: w.emoji,
            syllables: syllables,
            prompt: `Une las sílabas para encontrar la siguiente palabra`
        };
    });

    // 11. NIVEL 11: Sílabas Inversas
    const inverseList = ["AL", "EL", "IL", "OL", "UL", "AM", "EM", "IM", "OM", "UM", "AS", "ES", "IS", "OS", "US", "AN", "EN", "IN", "ON", "UN", "AR", "ER", "IR", "OR", "UR"];
    const matchedInverseWords = MASTER_WORDS.filter(w => {
        const syls = getSyllables(w.word);
        if (syls.length === 0) return false;
        const firstSyl = syls[0].toUpperCase()
            .replace(/Á/g, "A")
            .replace(/É/g, "E")
            .replace(/Í/g, "I")
            .replace(/Ó/g, "O")
            .replace(/Ú/g, "U");
        return inverseList.includes(firstSyl);
    });
    LEVEL_DATA[11] = matchedInverseWords.sort(() => Math.random() - 0.5).slice(0, 6).map(w => {
        const firstSyls = getSyllables(w.word);
        let targetSyl = firstSyls[0].toUpperCase()
            .replace(/Á/g, "A")
            .replace(/É/g, "E")
            .replace(/Í/g, "I")
            .replace(/Ó/g, "O")
            .replace(/Ú/g, "U");
            
        // Salvaguarda manual estricta para garantizar EM y EN correctos
        if (w.word === "EMPANADA" || w.word === "EMBUDO") {
            targetSyl = "EM";
        } else if (w.word === "ENCHUFE") {
            targetSyl = "EN";
        }
        const vowel = targetSyl[0];
        const dists = inverseList.filter(s => s !== targetSyl && s[0] === vowel).sort(() => Math.random() - 0.5).slice(0, 3);
        while (dists.length < 3) {
            const randomSylVal = inverseList[Math.floor(Math.random() * inverseList.length)];
            if (randomSylVal !== targetSyl && !dists.includes(randomSylVal)) {
                dists.push(randomSylVal);
            }
        }
        const options = [targetSyl, ...dists].sort(() => Math.random() - 0.5);
        return {
            emoji: w.emoji,
            word: w.word,
            prompt: `¿Con qué sílaba empieza <strong class="highlight-word">${w.word}</strong>?`,
            target: targetSyl,
            options: options
        };
    });

    // 12. NIVEL 12: Primeras Lecturas (Constructor de Enunciados)
    const shortSentences = [
        { word: "MI MAMÁ ME AMA", sentence: "MI MAMÁ ME AMA", emoji: "👩‍👦", words: ["MI", "MAMÁ", "ME", "AMA"] },
        { word: "LA GATA TOMA LECHE", sentence: "LA GATA TOMA LECHE", emoji: "🐱🥛", words: ["LA", "GATA", "TOMA", "LECHE"] },
        { word: "EL OSO COME MIEL", sentence: "EL OSO COME MIEL", emoji: "🐻🍯", words: ["EL", "OSO", "COME", "MIEL"] },
        { word: "MI PAPÁ ME MIMA", sentence: "MI PAPÁ ME MIMA", emoji: "👨‍👦", words: ["MI", "PAPÁ", "ME", "MIMA"] },
        { word: "EL PERRO JUEGA", sentence: "EL PERRO JUEGA", emoji: "🐶⚽", words: ["EL", "PERRO", "JUEGA"] },
        { word: "LA NUBE ES BLANCA", sentence: "LA NUBE ES BLANCA", emoji: "☁️", words: ["LA", "NUBE", "ES", "BLANCA"] }
    ];
    LEVEL_DATA[12] = shortSentences.sort(() => Math.random() - 0.5);
}

// Segmentador silábico básico en español para palabras infantiles
const WORD_SYLLABLES_MAP = {
    "ABEJA": [
        "A",
        "BE",
        "JA"
    ],
    "AGUA": [
        "A",
        "GUA"
    ],
    "ALCE": [
        "AL",
        "CE"
    ],
    "ALTO": [
        "AL",
        "TO"
    ],
    "ANCLA": [
        "AN",
        "CLA"
    ],
    "ANILLO": [
        "A",
        "NI",
        "LLO"
    ],
    "ANTENA": [
        "AN",
        "TE",
        "NA"
    ],
    "ARAÑA": [
        "A",
        "RA",
        "ÑA"
    ],
    "ARCOIRIS": [
        "AR",
        "CO",
        "I",
        "RIS"
    ],
    "AVENA": [
        "A",
        "VE",
        "NA"
    ],
    "AVIÓN": [
        "A",
        "VIÓN"
    ],
    "BALLENA": [
        "BA",
        "LLE",
        "NA"
    ],
    "BANANA": [
        "BA",
        "NA",
        "NA"
    ],
    "BARCO": [
        "BAR",
        "CO"
    ],
    "BEBÉ": [
        "BE",
        "BÉ"
    ],
    "BOCA": [
        "BO",
        "CA"
    ],
    "BODA": [
        "BO",
        "DA"
    ],
    "BOLA": [
        "BO",
        "LA"
    ],
    "BOSQUE": [
        "BOS",
        "QUE"
    ],
    "BOTA": [
        "BO",
        "TA"
    ],
    "BOTE": [
        "BO",
        "TE"
    ],
    "BOTÓN": [
        "BO",
        "TÓN"
    ],
    "BUHO": [
        "BU",
        "HO"
    ],
    "CABALLO": [
        "CA",
        "BA",
        "LLO"
    ],
    "CAMA": [
        "CA",
        "MA"
    ],
    "CAMINO": [
        "CA",
        "MI",
        "NO"
    ],
    "CARRO": [
        "CA",
        "RRO"
    ],
    "CASA": [
        "CA",
        "SA"
    ],
    "CEBOLLA": [
        "CE",
        "BO",
        "LLA"
    ],
    "CEREZA": [
        "CE",
        "RE",
        "ZA"
    ],
    "CINE": [
        "CI",
        "NE"
    ],
    "COCO": [
        "CO",
        "CO"
    ],
    "COLA": [
        "CO",
        "LA"
    ],
    "CONEJO": [
        "CO",
        "NE",
        "JO"
    ],
    "COPA": [
        "CO",
        "PA"
    ],
    "CUNA": [
        "CU",
        "NA"
    ],
    "DADO": [
        "DA",
        "DO"
    ],
    "DAMA": [
        "DA",
        "MA"
    ],
    "DEDO": [
        "DE",
        "DO"
    ],
    "DELFÍN": [
        "DEL",
        "FÍN"
    ],
    "DIADEMA": [
        "DIA",
        "DE",
        "MA"
    ],
    "DIENTE": [
        "DIEN",
        "TE"
    ],
    "DINOSAURIO": [
        "DI",
        "NO",
        "SAU",
        "RIO"
    ],
    "DOCTOR": [
        "DOC",
        "TOR"
    ],
    "DUENDE": [
        "DUEN",
        "DE"
    ],
    "DULCE": [
        "DUL",
        "CE"
    ],
    "DUNA": [
        "DU",
        "NA"
    ],
    "ELEFANTE": [
        "E",
        "LE",
        "FAN",
        "TE"
    ],
    "ELFO": [
        "EL",
        "FO"
    ],
    "EMBUDO": [
        "EM",
        "BU",
        "DO"
    ],
    "EMPANADA": [
        "EM",
        "PA",
        "NA",
        "DA"
    ],
    "ENCHUFE": [
        "EN",
        "CHU",
        "FE"
    ],
    "ERIZO": [
        "E",
        "RI",
        "ZO"
    ],
    "ESCOBA": [
        "ES",
        "CO",
        "BA"
    ],
    "ESCUELA": [
        "ES",
        "CUE",
        "LA"
    ],
    "ESPADA": [
        "ES",
        "PA",
        "DA"
    ],
    "ESPEJO": [
        "ES",
        "PE",
        "JO"
    ],
    "ESTRELLA": [
        "ES",
        "TRE",
        "LLA"
    ],
    "FANTASMA": [
        "FAN",
        "TAS",
        "MA"
    ],
    "FARO": [
        "FA",
        "RO"
    ],
    "FIDEOS": [
        "FI",
        "DE",
        "OS"
    ],
    "FIRMA": [
        "FIR",
        "MA"
    ],
    "FLAUTA": [
        "FLAU",
        "TA"
    ],
    "FLOR": [
        "FLOR"
    ],
    "FOCA": [
        "FO",
        "CA"
    ],
    "FOCO": [
        "FO",
        "CO"
    ],
    "FOTO": [
        "FO",
        "TO"
    ],
    "FRUTA": [
        "FRU",
        "TA"
    ],
    "FUEGO": [
        "FUE",
        "GO"
    ],
    "GAFAS": [
        "GA",
        "FAS"
    ],
    "GALLETA": [
        "GA",
        "LLE",
        "TA"
    ],
    "GALLINA": [
        "GA",
        "LLI",
        "NA"
    ],
    "GATO": [
        "GA",
        "TO"
    ],
    "GLOBO": [
        "GLO",
        "BO"
    ],
    "GOMA": [
        "GO",
        "MA"
    ],
    "GORILA": [
        "GO",
        "RI",
        "LA"
    ],
    "GORRA": [
        "GO",
        "RRA"
    ],
    "GOTA": [
        "GO",
        "TA"
    ],
    "GUITARRA": [
        "GUI",
        "TA",
        "RRA"
    ],
    "GUSANO": [
        "GU",
        "SA",
        "NO"
    ],
    "HADA": [
        "HA",
        "DA"
    ],
    "HELADO": [
        "HE",
        "LA",
        "DO"
    ],
    "HIELO": [
        "HIE",
        "LO"
    ],
    "HILO": [
        "HI",
        "LO"
    ],
    "HIPOPOTAMO": [
        "HI",
        "PO",
        "PÓ",
        "TA",
        "MO"
    ],
    "HOJA": [
        "HO",
        "JA"
    ],
    "HORMIGA": [
        "HOR",
        "MI",
        "GA"
    ],
    "HUESO": [
        "HUE",
        "SO"
    ],
    "HUEVO": [
        "HUE",
        "VO"
    ],
    "HUMO": [
        "HU",
        "MO"
    ],
    "IGLESIA": [
        "I",
        "GLE",
        "SIA"
    ],
    "IGLÚ": [
        "I",
        "GLÚ"
    ],
    "IGUANA": [
        "I",
        "GUA",
        "NA"
    ],
    "IMÁN": [
        "I",
        "MÁN"
    ],
    "INDIO": [
        "IN",
        "DIO"
    ],
    "INSECTO": [
        "IN",
        "SEC",
        "TO"
    ],
    "INVIERNO": [
        "IN",
        "VIER",
        "NO"
    ],
    "ISLA": [
        "IS",
        "LA"
    ],
    "JABÓN": [
        "JA",
        "BÓN"
    ],
    "JARRA": [
        "JA",
        "RRA"
    ],
    "JAULA": [
        "JAU",
        "LA"
    ],
    "JERINGA": [
        "JE",
        "RIN",
        "GA"
    ],
    "JIRAFA": [
        "JI",
        "RA",
        "FA"
    ],
    "JOYA": [
        "JO",
        "YA"
    ],
    "JUGO": [
        "JU",
        "GO"
    ],
    "JUGUETE": [
        "JU",
        "GUE",
        "TE"
    ],
    "KARAOKE": [
        "KA",
        "RA",
        "O",
        "KE"
    ],
    "KILO": [
        "KI",
        "LO"
    ],
    "KIWI": [
        "KI",
        "WI"
    ],
    "KOALA": [
        "KO",
        "A",
        "LA"
    ],
    "LAGO": [
        "LA",
        "GO"
    ],
    "LANA": [
        "LA",
        "NA"
    ],
    "LECHE": [
        "LE",
        "CHE"
    ],
    "LEON": [
        "LE",
        "ÓN"
    ],
    "LEÑA": [
        "LE",
        "ÑA"
    ],
    "LIMA": [
        "LI",
        "MA"
    ],
    "LIMON": [
        "LI",
        "MÓN"
    ],
    "LOMO": [
        "LO",
        "MO"
    ],
    "LORO": [
        "LO",
        "RO"
    ],
    "LUNA": [
        "LU",
        "NA"
    ],
    "LUPA": [
        "LU",
        "PA"
    ],
    "LÁPIZ": [
        "LÁ",
        "PIZ"
    ],
    "MAMÁ": [
        "MA",
        "MÁ"
    ],
    "MANGO": [
        "MAN",
        "GO"
    ],
    "MANO": [
        "MA",
        "NO"
    ],
    "MANZANA": [
        "MAN",
        "ZA",
        "NA"
    ],
    "MARIPOSA": [
        "MA",
        "RI",
        "PO",
        "SA"
    ],
    "MARTILLO": [
        "MAR",
        "TI",
        "LLO"
    ],
    "MESA": [
        "ME",
        "SA"
    ],
    "MIEL": [
        "MIEL"
    ],
    "MOCHILA": [
        "MO",
        "CHI",
        "LA"
    ],
    "MONO": [
        "MO",
        "NO"
    ],
    "MOTO": [
        "MO",
        "TO"
    ],
    "MULA": [
        "MU",
        "LA"
    ],
    "MUÑECA": [
        "MU",
        "ÑE",
        "CA"
    ],
    "NARANJA": [
        "NA",
        "RAN",
        "JA"
    ],
    "NATA": [
        "NA",
        "TA"
    ],
    "NAVIO": [
        "NA",
        "VÍ",
        "O"
    ],
    "NENE": [
        "NE",
        "NE"
    ],
    "NIDO": [
        "NI",
        "DO"
    ],
    "NIEVE": [
        "NIE",
        "VE"
    ],
    "NOTA": [
        "NO",
        "TA"
    ],
    "NUBE": [
        "NU",
        "BE"
    ],
    "NUEZ": [
        "NUEZ"
    ],
    "OJO": [
        "O",
        "JO"
    ],
    "OLA": [
        "O",
        "LA"
    ],
    "OLLA": [
        "O",
        "LLA"
    ],
    "OREJA": [
        "O",
        "RE",
        "JA"
    ],
    "ORO": [
        "O",
        "RO"
    ],
    "OSO": [
        "O",
        "SO"
    ],
    "OVEJA": [
        "O",
        "VE",
        "JA"
    ],
    "PALA": [
        "PA",
        "LA"
    ],
    "PAN": [
        "PAN"
    ],
    "PANDA": [
        "PAN",
        "DA"
    ],
    "PAPA": [
        "PA",
        "PA"
    ],
    "PATO": [
        "PA",
        "TO"
    ],
    "PAYASO": [
        "PA",
        "YA",
        "SO"
    ],
    "PECES": [
        "PE",
        "CES"
    ],
    "PELO": [
        "PE",
        "LO"
    ],
    "PELOTA": [
        "PE",
        "LO",
        "TA"
    ],
    "PERA": [
        "PE",
        "RA"
    ],
    "PERRO": [
        "PE",
        "RRO"
    ],
    "PINO": [
        "PI",
        "NO"
    ],
    "PIÑA": [
        "PI",
        "ÑA"
    ],
    "PUERTA": [
        "PUER",
        "TA"
    ],
    "QUENA": [
        "QUE",
        "NA"
    ],
    "QUESO": [
        "QUE",
        "SO"
    ],
    "QUIMICA": [
        "QUÍ",
        "MI",
        "CA"
    ],
    "RADIO": [
        "RA",
        "DIO"
    ],
    "RAMA": [
        "RA",
        "MA"
    ],
    "RANA": [
        "RA",
        "NA"
    ],
    "RATÓN": [
        "RA",
        "TÓN"
    ],
    "REGALO": [
        "RE",
        "GA",
        "LO"
    ],
    "RELOJ": [
        "RE",
        "LOJ"
    ],
    "ROPA": [
        "RO",
        "PA"
    ],
    "ROSA": [
        "RO",
        "SA"
    ],
    "RUIDO": [
        "RUI",
        "DO"
    ],
    "SAL": [
        "SAL"
    ],
    "SALA": [
        "SA",
        "LA"
    ],
    "SANDIA": [
        "SAN",
        "DÍ",
        "A"
    ],
    "SAPO": [
        "SA",
        "PO"
    ],
    "SERPIENTE": [
        "SER",
        "PIEN",
        "TE"
    ],
    "SILLA": [
        "SI",
        "LLA"
    ],
    "SIRENA": [
        "SI",
        "RE",
        "NA"
    ],
    "SOL": [
        "SOL"
    ],
    "SOPA": [
        "SO",
        "PA"
    ],
    "SUMA": [
        "SU",
        "MA"
    ],
    "TAPA": [
        "TA",
        "PA"
    ],
    "TAZA": [
        "TA",
        "ZA"
    ],
    "TELÉFONO": [
        "TE",
        "LÉ",
        "FO",
        "NO"
    ],
    "TIGRE": [
        "TI",
        "GRE"
    ],
    "TIJERA": [
        "TI",
        "JE",
        "RA"
    ],
    "TINA": [
        "TI",
        "NA"
    ],
    "TOMATE": [
        "TO",
        "MA",
        "TE"
    ],
    "TORO": [
        "TO",
        "RO"
    ],
    "TORTUGA": [
        "TOR",
        "TU",
        "GA"
    ],
    "TREN": [
        "TREN"
    ],
    "UNICORNIO": [
        "U",
        "NI",
        "COR",
        "NIO"
    ],
    "UNO": [
        "U",
        "NO"
    ],
    "URNA": [
        "UR",
        "NA"
    ],
    "UVA": [
        "U",
        "VA"
    ],
    "UÑA": [
        "U",
        "ÑA"
    ],
    "VACA": [
        "VA",
        "CA"
    ],
    "VASO": [
        "VA",
        "SO"
    ],
    "VELA": [
        "VE",
        "LA"
    ],
    "VENTANA": [
        "VEN",
        "TA",
        "NA"
    ],
    "VERDURA": [
        "VER",
        "DU",
        "RA"
    ],
    "VIENTO": [
        "VIEN",
        "TO"
    ],
    "VOLCÁN": [
        "VOL",
        "CÁN"
    ],
    "XILÓFONO": [
        "XI",
        "LÓ",
        "FO",
        "NO"
    ],
    "YATE": [
        "YA",
        "TE"
    ],
    "YEMA": [
        "YE",
        "MA"
    ],
    "YESO": [
        "YE",
        "SO"
    ],
    "YOGA": [
        "YO",
        "GA"
    ],
    "YOYO": [
        "YO",
        "YO"
    ],
    "ZANAHORIA": [
        "ZA",
        "NA",
        "HO",
        "RIA"
    ],
    "ZAPATO": [
        "ZA",
        "PA",
        "TO"
    ],
    "ZOO": [
        "ZOO"
    ],
    "ZORRO": [
        "ZO",
        "RRO"
    ],
    "ZUMO": [
        "ZU",
        "MO"
    ],
    "ÁRBOL": [
        "ÁR",
        "BOL"
    ],
    "ÑAME": [
        "ÑA",
        "ME"
    ],
    "ÑANDU": [
        "ÑAN",
        "DÚ"
    ],
    "ÓRGANO": [
        "ÓR",
        "GA",
        "NO"
    ]
};

function getSyllables(word) {
    const cleanWord = word.toUpperCase().trim();
    if (WORD_SYLLABLES_MAP[cleanWord]) {
        return WORD_SYLLABLES_MAP[cleanWord];
    }
    
    // Fallback de silabación algorítmica por si se agregan nuevas palabras
    const syllables = [];
    let temp = "";
    const isVowel = c => ["A","E","I","O","U","Á","É","Í","Ó","Ú"].includes(c);
    
    let i = 0;
    while (i < word.length) {
        temp += word[i];
        
        if (isVowel(word[i])) {
            const next1 = word[i+1];
            const next2 = word[i+2];
            if (next1 && !isVowel(next1) && next2 && isVowel(next2)) {
                syllables.push(temp);
                temp = "";
            } else if (next1 && !isVowel(next1) && next2 && !isVowel(next2) && isVowel(word[i+3] || '')) {
                const group = next1 + next2;
                const licuantes = ["BL","CL","FL","GL","PL","BR","CR","DR","FR","GR","PR","TR","CH","LL","RR"];
                if (licuantes.includes(group)) {
                    syllables.push(temp);
                    temp = "";
                } else {
                    temp += next1;
                    syllables.push(temp);
                    temp = "";
                    i++;
                }
            }
        }
        i++;
    }
    if (temp) syllables.push(temp);
    return syllables;
}

// Estado global de la aplicación
let state = {
    stars: parseInt(localStorage.getItem('stars-reader')) || 0,
    coins: parseInt(localStorage.getItem('coins-reader')) || 0,
    currentLevel: 1,
    currentQuestionIndex: 0,
    currentWordObj: null,
    spelledWord: [],
    correctSpellingIndex: 0,
    silabarioSubIndex: 0,
    inReviewPhase: true
};

// --- GESTIÓN DE VOCES DE ACCESIBILIDAD ---
let voicesList = [];
let selectedVoiceName = localStorage.getItem('selected-voice-name') || '';

function populateVoiceList() {
    if (typeof speechSynthesis === 'undefined') return;

    const rawVoices = speechSynthesis.getVoices();
    // Filtro insensible a mayúsculas/minúsculas y soporte de guión/guión bajo para español (es)
    const esVoices = rawVoices.filter(v => {
        const lang = v.lang.toLowerCase();
        return lang.startsWith('es') || lang.includes('es-') || lang.includes('es_');
    });

    // Ordenar las voces en español para priorizar las de Google (ya que cargan y funcionan perfectamente en Chrome).
    // Las voces de Microsoft Desktop a menudo fallan en Chrome debido a restricciones del Sandbox de Windows,
    // provocando un fallback silencioso al inglés.
    esVoices.sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        const aIsGoogle = aName.includes('google');
        const bIsGoogle = bName.includes('google');
        
        if (aIsGoogle && !bIsGoogle) return -1;
        if (!aIsGoogle && bIsGoogle) return 1;
        
        // Si ninguna es Google, priorizar las locales sobre otras
        if (a.localService && !b.localService) return -1;
        if (!a.localService && b.localService) return 1;
        return 0;
    });

    voicesList = esVoices.length > 0 ? esVoices : rawVoices;

    // Si no hay una voz seleccionada previamente, tomar la primera voz en español (Google de preferencia)
    if (!selectedVoiceName && esVoices.length > 0) {
        selectedVoiceName = esVoices[0].name;
        localStorage.setItem('selected-voice-name', selectedVoiceName);
    }

    const select = document.getElementById('voice-select');
    if (!select) return;
    select.innerHTML = '';

    if (voicesList.length === 0) {
        const opt = document.createElement('option');
        opt.value = "";
        opt.textContent = "Sin voces";
        select.appendChild(opt);
        return;
    }

    voicesList.forEach(voice => {
        const opt = document.createElement('option');
        opt.value = voice.name;
        const cleanName = voice.name
            .replace("Microsoft", "")
            .replace("Google", "")
            .replace("Desktop", "")
            .replace("Natural", "")
            .trim();
        
        let typeSuffix = "Lector Nube";
        if (voice.name.toLowerCase().includes('google')) {
            typeSuffix = "Lector Chrome (Recomendado)";
        } else if (voice.localService) {
            typeSuffix = "Lector Local";
        }
        
        opt.textContent = `${cleanName} (${voice.lang}) - ${typeSuffix}`;
        if (voice.name === selectedVoiceName) {
            opt.selected = true;
        }
        select.appendChild(opt);
    });
}

// En Windows/Chrome las voces se cargan asíncronamente
if (typeof speechSynthesis !== 'undefined') {
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = populateVoiceList;
    }
    // Reintentar en móviles donde getVoices() puede tardar unos milisegundos en poblarse
    setTimeout(populateVoiceList, 100);
    setTimeout(populateVoiceList, 500);
    setTimeout(populateVoiceList, 1500);
}

// --- Sintetizador de Sonidos (Web Audio API) ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playTone(freq, type, duration) {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = type;
    osc.frequency.value = freq;
    
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

function playSuccessSound() {
    playTone(523.25, 'triangle', 0.15); // C5
    setTimeout(() => {
        playTone(659.25, 'triangle', 0.15); // E5
        setTimeout(() => {
            playTone(783.99, 'triangle', 0.3); // G5
        }, 120);
    }, 120);
}

function playFailSound() {
    playTone(220, 'sawtooth', 0.3); // A3
    setTimeout(() => {
        playTone(180, 'sawtooth', 0.3); // F3
    }, 150);
}

function playTapSound() {
    playTone(400, 'sine', 0.08);
}

// --- Mapeador Fonético Adaptativo para Voces en Inglés ---
function getEnglishPhoneticText(text) {
    if (!text) return "";
    
    // Diccionario de letras individuales en español mapeadas a la fonética inglesa
    const letterMap = {
        "A": "ah", "B": "bay", "C": "say", "D": "day", "E": "eh",
        "F": "eh-fay", "G": "hay", "H": "ah-chay", "I": "ee", "J": "ho-tah",
        "K": "kah", "L": "eh-lay", "M": "eh-may", "N": "eh-nay", "Ñ": "eh-nyeh",
        "O": "oh", "P": "pay", "Q": "coo", "R": "eh-rray", "S": "eh-say",
        "T": "tay", "U": "oo", "V": "bay", "W": "doble oo", "X": "eh-keys",
        "Y": "yay", "Z": "say-tah"
    };

    // Diccionario de palabras de instrucciones en español mapeadas a la fonética inglesa
    const wordMap = {
        "CON": "con",
        "SUENA": "swenay",
        "LA": "lah",
        "LAS": "lahs",
        "QUE": "kay",
        "QUI": "kee",
        "EL": "el",
        "INICIE": "ee-nee-see-ay",
        "EMPIEZA": "em-pyay-sah",
        "LETRA": "lay-trah",
        "LETRAS": "lay-trahs",
        "VOCAL": "boh-cahl",
        "VOCALES": "boh-cah-lays",
        "PALABRA": "pah-lah-brah",
        "MUESTRAME": "mwehs-trah-may",
        "CONOZCAMOS": "coh-nohs-cah-mohs",
        "CONSONANTES": "con-soh-nahn-tays",
        "NIVEL": "nee-bel",
        "JUEGO": "hway-goh",
        "TOCA": "toh-cah",
        "CADA": "cah-dah",
        "PARA": "pah-rah",
        "ESCUCHAR": "ehs-coo-chahr",
        "COMO": "coh-moh",
        "SUENA": "swenay",
        "ORDENA": "ohr-day-nah",
        "FORMAR": "fohr-mahr",
        // Nombres de letras en español a fonética en inglés
        "BE": "bay",
        "CE": "say",
        "DE": "day",
        "EFE": "eh-fay",
        "GE": "hay",
        "JOTA": "ho-tah",
        "KA": "kah",
        "ELE": "eh-lay",
        "EME": "eh-may",
        "ENE": "eh-nay",
        "EÑE": "eh-nyay",
        "PE": "pay",
        "CU": "coo",
        "ERRE": "eh-rray",
        "ESE": "eh-say",
        "TE": "tay",
        "VE": "bay",
        "EQUIS": "eh-keys",
        "YE": "yay",
        "ZETA": "say-tah"
    };

    const cleanText = text.toUpperCase().trim();

    if (letterMap[cleanText]) {
        return letterMap[cleanText];
    }

    if (wordMap[cleanText]) {
        return wordMap[cleanText];
    }

    // Traducir sílabas o palabras cortas directamente
    if (cleanText.length <= 4) {
        return translateSpanishToEnglishPhonetics(cleanText);
    }

    // Procesamiento palabra por palabra de frases cortas de repaso e instrucciones
    return text.split(" ").map(word => {
        const cleanWord = word.toUpperCase()
            .replace(/[^A-ZÑÁÉÍÓÚ]/g, "")
            .replace(/Á/g, "A")
            .replace(/É/g, "E")
            .replace(/Í/g, "I")
            .replace(/Ó/g, "O")
            .replace(/Ú/g, "U");
        if (letterMap[cleanWord]) {
            return letterMap[cleanWord];
        }
        if (wordMap[cleanWord]) {
            return wordMap[cleanWord];
        }
        return translateSpanishToEnglishPhonetics(cleanWord);
    }).join(" ");
}

// Transcriptor fonético general de español a inglés para voces de fallback
function translateSpanishToEnglishPhonetics(wordOrSyllable) {
    let s = wordOrSyllable.toUpperCase()
        .replace(/Á/g, "A")
        .replace(/É/g, "E")
        .replace(/Í/g, "I")
        .replace(/Ó/g, "O")
        .replace(/Ú/g, "U");
    
    // Reemplazos de consonantes españolas a fonética inglesa
    s = s.replace(/CH/g, "TEMP_CH");
    s = s.replace(/([^C]|^)H/g, "$1"); // H muda
    s = s.replace(/TEMP_CH/g, "CH");
    
    s = s.replace(/LL/g, "Y");
    s = s.replace(/RR/g, "R");
    s = s.replace(/ER/g, "ERR"); // Asegurar que ER se lea con doble R (ERR) para evitar diptongos
    s = s.replace(/QU/g, "K");
    s = s.replace(/C(?=[EI])/g, "S");
    s = s.replace(/C(?=[AOU])/g, "K");
    s = s.replace(/G(?=[EI])/g, "H");
    s = s.replace(/GU(?=[EI])/g, "G");
    s = s.replace(/J/g, "H");
    s = s.replace(/Ñ/g, "NY");
    s = s.replace(/Z/g, "S");
    
    // Mapeo de vocales a sonidos en inglés
    let result = "";
    let i = 0;
    while (i < s.length) {
        let char = s[i];
        if (char === 'A') result += 'ah';
        else if (char === 'E') result += 'eh'; // Sonido corto 'e' pura
        else if (char === 'I') result += 'ee';
        else if (char === 'O') result += 'oh';
        else if (char === 'U') result += 'oo';
        else result += char;
        i++;
    }
    return result.toLowerCase();
}

// --- Text to Speech (Pronunciación Vocal) ---
function speakText(text, callback) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        
        // Asegurar que la lista de voces no esté vacía
        if (voicesList.length === 0) {
            populateVoiceList();
        }

        let isSpanish = false;
        let selectedVoice = voicesList.find(v => v.name === selectedVoiceName);

        // Fallback a cualquier voz en español si la seleccionada no es válida
        if (!selectedVoice) {
            selectedVoice = voicesList.find(v => {
                const lang = v.lang.toLowerCase();
                return lang.startsWith('es') || lang.includes('es-') || lang.includes('es_');
            });
        }

        if (selectedVoice) {
            const lang = selectedVoice.lang.toLowerCase();
            if (lang.startsWith('es') || lang.includes('es-') || lang.includes('es_')) {
                isSpanish = true;
            }
        }

        let plainText = text.replace(/<[^>]*>/g, "").toLowerCase();

        // Eliminar emojis y caracteres Unicode especiales para evitar que el TTS los lea (ej: "estrella", "niño", etc.)
        plainText = plainText.replace(/[\u{1F300}-\u{1F9FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');

        // Eliminar acentos solo de tokens/letras muy cortas (ej: "á", "ár") para evitar que el TTS diga "con acento/tilde"
        // pero mantenerlos en palabras largas como "sílaba" para asegurar la entonación correcta.
        if (plainText.length <= 3) {
            plainText = plainText
                .replace(/á/g, "a")
                .replace(/é/g, "e")
                .replace(/í/g, "i")
                .replace(/ó/g, "o")
                .replace(/ú/g, "u");
        }

        // Reemplazar consonante suelta por su nombre en español para evitar pronunciación inglesa (b -> bee/bi)
        const letterNamesSpanish = {
            "b": "be", "c": "ce", "d": "de", "f": "efe", "g": "ge",
            "h": "ache", "j": "jota", "k": "ka", "l": "ele", "m": "eme",
            "n": "ene", "ñ": "eñe", "p": "pe", "q": "cu", "r": "erre",
            "s": "ese", "t": "te", "v": "ve", "w": "doble ve", "x": "equis",
            "y": "ye", "z": "zeta"
        };
        if (plainText.length === 1 && letterNamesSpanish[plainText]) {
            plainText = letterNamesSpanish[plainText];
        }

        // Reemplazar la H muda al inicio de palabras/sílabas para que no suene como "jai" o "jay-lo" en inglés
        plainText = plainText.replace(/\bh([aeiou])/gi, "$1");

        // Evitar que el lector de voz interprete las sílabas "xi" y "vi" como números romanos (11 y 6) en ambos idiomas
        plainText = plainText.replace(/\bxi\b/gi, "si");
        plainText = plainText.replace(/\bvi\b/gi, "bi");

        // Reemplazos de pronunciación fonética de sílabas complejas para evitar deletreos (ele-ele-o, erre-erre-o) en tarjetas sueltas
        plainText = plainText.replace(/\brra\b/gi, "ra");
        plainText = plainText.replace(/\brre\b/gi, "re");
        plainText = plainText.replace(/\brri\b/gi, "ri");
        plainText = plainText.replace(/\brro\b/gi, "ro");
        plainText = plainText.replace(/\brru\b/gi, "ru");
        
        plainText = plainText.replace(/\blla\b/gi, "ya");
        plainText = plainText.replace(/\blle\b/gi, "ye");
        plainText = plainText.replace(/\blli\b/gi, "yi");
        plainText = plainText.replace(/\bllo\b/gi, "yo");
        plainText = plainText.replace(/\bllu\b/gi, "yu");

        let processedText = plainText;
        if (!isSpanish) {
            // Reemplazos de auxilio exclusivos para el motor de voz en inglés (para simular fonética española)
            let englishPrep = plainText;
            
            // Añadir una H muda al final de sílabas de 2 o 3 letras terminadas en E o É (ej. be/bé -> beh)
            englishPrep = englishPrep.replace(/\b([a-zñÁÉÍÓÚáéíóú]{1,2})[eé]\b/gi, "$1eh");

            // Evitar deletreos de "ca", "co", "cu" o pronunciaciones incorrectas
            englishPrep = englishPrep.replace(/\bca\b/gi, "ka");
            englishPrep = englishPrep.replace(/\bco\b/gi, "ko");
            englishPrep = englishPrep.replace(/\bcu\b/gi, "ku");

            // Evitar que "er" se lea como "iar" (oreja - ear)
            englishPrep = englishPrep.replace(/\ber\b/gi, "err");

            // Evitar que las sílabas terminadas en M se pronuncien como N
            englishPrep = englishPrep.replace(/\bam\b/gi, "ahm");
            englishPrep = englishPrep.replace(/\bem\b/gi, "ehm");
            englishPrep = englishPrep.replace(/\bim\b/gi, "ihm");
            englishPrep = englishPrep.replace(/\bom\b/gi, "ohm");
            englishPrep = englishPrep.replace(/\bum\b/gi, "uhm");

            processedText = getEnglishPhoneticText(englishPrep);
        } else {
            // Para voces nativas en español, evitamos dañar palabras válidas con 'eh' o 'ka'.
            // Sin embargo, prevenimos que "am" (sílaba) se deletree como la abreviatura horaria "A.M." (a eme).
            // En español, 'ahm' tiene H muda, por lo que suena exactamente a 'am' pero no se deletrea.
            processedText = plainText.replace(/\bam\b/gi, "ahm");
        }

        const utterance = new SpeechSynthesisUtterance(processedText);
        
        if (selectedVoice) {
            utterance.voice = selectedVoice;
            utterance.lang = selectedVoice.lang;
        } else {
            utterance.lang = 'es-MX'; // Fallback de idioma
        }
        
        utterance.rate = 0.82;
        utterance.pitch = 1.35;
        
        // Evitar recolección de basura del recolector de JS (Garbage Collection Bug en Web Speech API)
        window.activeUtterance = utterance;
        
        if (callback) {
            let callbackFired = false;
            const safeCallback = () => {
                if (!callbackFired) {
                    callbackFired = true;
                    callback();
                }
            };
            utterance.onend = safeCallback;
            utterance.onerror = safeCallback;
            
            // Timer de seguridad: si no se reporta el evento onend del motor de voz, avanza tras el tiempo estimado
            const estimatedMs = Math.max(1500, 3000 + (processedText.length * 85));
            setTimeout(safeCallback, estimatedMs);
        }
        window.speechSynthesis.speak(utterance);
    } else if (callback) {
        setTimeout(callback, 2000);
    }
}

// --- Actualización de Puntuación ---
function addStar() {
    state.stars += 1;
    localStorage.setItem('stars-reader', state.stars);
    document.getElementById('star-count').textContent = state.stars;
    
    const display = document.getElementById('stars-display');
    display.classList.add('pulse');
    setTimeout(() => display.classList.remove('pulse'), 1000);
    
    addCoins(10); // Cada acierto otorga 10 monedas
}

function addCoins(amount) {
    state.coins += amount;
    localStorage.setItem('coins-reader', state.coins);
    document.getElementById('coin-count').textContent = state.coins;
    
    const display = document.getElementById('coins-display');
    if (display) {
        display.classList.add('pulse-gold');
        setTimeout(() => display.classList.remove('pulse-gold'), 600);
    }
}

// --- Reacciones de la Mascota Virtual (Dino 🦕) ---
function triggerMascotReaction(type) {
    const avatar = document.getElementById('mascot-avatar');
    const bubble = document.getElementById('mascot-dialog-bubble');
    if (!avatar || !bubble) return;
    
    // Quitar clases previas para reiniciar animaciones
    avatar.className = 'mascot-avatar-emoji';
    void avatar.offsetWidth; // Truco CSS para forzar reflujo y reiniciar animación
    
    const kid = (state.currentUser && state.currentUser.kidName) ? state.currentUser.kidName : "amiguito";
    const mascot = state.activeMascot || "🐒";
    
    const successPhrases = [
        `¡Eres súper, ${kid}! 🌟`,
        `¡Fantástico, ${kid}! 🏆`,
        `¡Sí, lo lograste, ${kid}! 🎉`,
        `¡Genial, ${kid}! 👏`,
        `¡Perfecto, ${kid}! 💎`,
        `¡Increíble, ${kid}! 🚀`
    ];
    const failPhrases = [
        `¡Casi, ${kid}! Inténtalo de nuevo.`,
        `¡Tú puedes, ${kid}! Inténtalo otra vez.`,
        `¡Cerca! ¡Vamos, ${kid}!`,
        `¡Probemos de nuevo, ${kid}!`
    ];
    const idlePhrases = [
        `¡Hola, ${kid}! ¿Jugamos?`,
        `¡Me encanta aprender contigo, ${kid}!`,
        `¡Haces un gran trabajo, ${kid}!`,
        `¡Qué divertido es leer, ${kid}!`
    ];
    
    if (type === 'success') {
        avatar.textContent = mascot;
        avatar.classList.add('jump');
        bubble.textContent = successPhrases[Math.floor(Math.random() * successPhrases.length)];
        bubble.style.display = 'block';
    } else if (type === 'fail') {
        avatar.textContent = "🙉"; // Mono confundido
        avatar.classList.add('sad-shake');
        bubble.textContent = failPhrases[Math.floor(Math.random() * failPhrases.length)];
        bubble.style.display = 'block';
    } else {
        avatar.textContent = mascot;
        avatar.classList.add('float');
        bubble.textContent = idlePhrases[Math.floor(Math.random() * idlePhrases.length)];
        bubble.style.display = 'block';
    }
    
    // Volver a estado de espera normal tras 2.2 segundos
    clearTimeout(state.mascotTimeout);
    state.mascotTimeout = setTimeout(() => {
        avatar.className = 'mascot-avatar-emoji float';
        avatar.textContent = mascot;
        bubble.textContent = `¡Me encanta jugar contigo, ${kid}! 🌟`;
    }, 2500);
}

// --- Navegación ---
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(scr => {
        scr.classList.remove('active');
        scr.style.display = 'none'; // Forzar ocultación inline de todas las pantallas
    });
    
    const activeScr = document.getElementById(screenId);
    if (activeScr) {
        activeScr.classList.add('active');
        // Usar display flex en el login y block en las demás para evitar solapamientos
        if (screenId === 'screen-auth') {
            activeScr.style.display = 'flex';
        } else {
            activeScr.style.display = 'block';
        }
    }
    playTapSound();
}

// --- CONTROLADOR DE JUEGO ---

function startLevel(levelNum) {
    generateAllLevels();
    state.currentLevel = levelNum;
    state.currentQuestionIndex = 0;
    state.silabarioSubIndex = 0;
    state.inReviewPhase = (levelNum === 8);
    
    const levelNames = {
        1: "Conociendo las Vocales",
        2: "Conociendo las Consonantes",
        3: "Nivel 1: Juego Vocales",
        4: "Nivel 2: Juego Consonantes",
        5: "Nivel 3: Sílabas",
        6: "Nivel 4: Palabras Cortas",
        7: "Nivel 5: Palabras Grandes",
        8: "Nivel 6: Silabario Mágico",
        9: "Nivel 7: Sopa de Letras",
        10: "Nivel 8: Juntar Sílabas",
        11: "Nivel 9: Sílabas Inversas",
        12: "Nivel 10: Primeras Lecturas"
    };
    
    document.getElementById('game-title').textContent = levelNames[levelNum];
    showScreen('screen-game');
    loadRound();
    speakText(levelNames[levelNum]);
}

function loadRound() {
    const list = LEVEL_DATA[state.currentLevel];
    const data = list[state.currentQuestionIndex];
    state.currentWordObj = data;
    
    const reviewPanel = document.getElementById('silabario-review-panel');
    const explorationPanel = document.getElementById('exploration-panel');
    const playPanel = document.getElementById('game-play-panel');
    const sopaPanel = document.getElementById('sopa-letras-panel');
    const constructorPanel = document.getElementById('constructor-silabas-panel');
    const enunciadosPanel = document.getElementById('constructor-enunciados-panel');
    
    // Ocultar todos los paneles por defecto
    reviewPanel.style.display = 'none';
    explorationPanel.style.display = 'none';
    playPanel.style.display = 'none';
    sopaPanel.style.display = 'none';
    constructorPanel.style.display = 'none';
    enunciadosPanel.style.display = 'none';
    
    // Ocultar paneles especiales
    const globosPanel = document.getElementById('lluvia-globos-panel');
    if (globosPanel) globosPanel.style.display = 'none';
    const trucksPanel = document.getElementById('camiones-silabicos-panel');
    if (trucksPanel) trucksPanel.style.display = 'none';

    // Actualizar Puntos de Progreso
    const dotsContainer = document.getElementById('level-dots');
    dotsContainer.innerHTML = '';
    for (let i = 0; i < list.length; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot' + (i <= state.currentQuestionIndex ? ' active' : '');
        dotsContainer.appendChild(dot);
    }
    
    if (state.currentLevel === 1 || state.currentLevel === 2) {
        explorationPanel.style.display = 'block';
        loadExplorationRound();
        return;
    }

    if (state.currentLevel === 8 && state.inReviewPhase) {
        reviewPanel.style.display = 'block';
        runSilabarioReview(data);
        return;
    }

    if (state.currentLevel === 9) {
        sopaPanel.style.display = 'block';
        loadSopaRound(data);
        return;
    }

    if (state.currentLevel === 10) {
        constructorPanel.style.display = 'block';
        loadConstructorRound(data);
        return;
    }

    if (state.currentLevel === 12) {
        enunciadosPanel.style.display = 'block';
        loadEnunciadosRound(data);
        return;
    }

    playPanel.style.display = 'block';
    
    // Mostrar/ocultar botón de saltar palabra en panel estándar (Nivel 11)
    const btnSkipStandard = document.getElementById('btn-skip-standard');
    if (state.currentLevel === 11) {
        btnSkipStandard.style.display = 'inline-block';
    } else {
        btnSkipStandard.style.display = 'none';
    }

    // Configurar Emoji para paneles estándar
    document.getElementById('game-emoji').textContent = data.emoji || "✨";

    const wordSlots = document.getElementById('game-word-slots');
    const optionsContainer = document.getElementById('game-options-container');
    wordSlots.innerHTML = '';
    optionsContainer.innerHTML = '';

    if (state.currentLevel === 3 || state.currentLevel === 4 || state.currentLevel === 5 || state.currentLevel === 11) {
        // --- NIVELES 3, 4, 5 y 11: Selección Simple ---
        if (state.currentLevel === 11) {
            document.getElementById('game-prompt').innerHTML = "¿Con qué sílaba empieza?";
        } else if (state.currentLevel === 4) {
            document.getElementById('game-prompt').innerHTML = "¿Con qué letra inicia?";
        } else {
            document.getElementById('game-prompt').innerHTML = data.prompt;
        }
        
        data.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'btn-option';
            // Nivel 4 y 5 (Juego Consonantes y Sílabas) usan puras mayúsculas, los demás alternan
            const isUpperOnly = (state.currentLevel === 4 || state.currentLevel === 5);
            const displayChar = (isUpperOnly || Math.random() > 0.5) ? opt.toUpperCase() : opt.toLowerCase();
            btn.textContent = displayChar;
            btn.onclick = () => checkSelectionAnswer(opt, btn);
            optionsContainer.appendChild(btn);
        });

        if (state.currentLevel === 4) {
            setTimeout(() => speakText(`¿Con qué letra inicia: ${data.word.toLowerCase()}?`), 400);
        } else {
            setTimeout(() => speakText(data.prompt), 400);
        }

    } else if (state.currentLevel === 6 || state.currentLevel === 7) {
        // --- NIVELES 6 y 7: Deletreo ---
        document.getElementById('game-prompt').textContent = "¡Ordena las letras para formar la palabra!";
        
        state.spelledWord = Array(data.word.length).fill(null);
        state.correctSpellingIndex = 0;

        for (let i = 0; i < data.word.length; i++) {
            const slot = document.createElement('div');
            slot.className = 'letter-slot';
            slot.id = `slot-${i}`;
            slot.textContent = '?';
            wordSlots.appendChild(slot);
        }

        const letters = data.word.split('').map((char, index) => ({ char, index }));
        letters.sort(() => Math.random() - 0.5);

        letters.forEach((item) => {
            const btn = document.createElement('button');
            btn.className = 'btn-option';
            // Alternar de forma aleatoria entre mayúscula y minúscula
            const displayChar = Math.random() > 0.5 ? item.char.toUpperCase() : item.char.toLowerCase();
            btn.textContent = displayChar;
            btn.onclick = () => handleLetterSelection(item.char, btn);
            optionsContainer.appendChild(btn);
        });

        setTimeout(() => speakText(`Forma la palabra: ${data.word}`), 400);

    } else if (state.currentLevel === 8 && !state.inReviewPhase) {
        // --- NIVEL 8: Trivia de Asociación ---
        const activeQuestion = data.questions[state.silabarioSubIndex];
        document.getElementById('game-prompt').innerHTML = activeQuestion.prompt;
        document.getElementById('game-emoji').textContent = activeQuestion.emoji || "❓";

        const options = [...activeQuestion.options].sort(() => Math.random() - 0.5);

        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'btn-option word-card';
            btn.innerHTML = `<span class="word-emoji">${opt.emoji}</span><span>${opt.word}</span>`;
            btn.onclick = () => checkSilabarioAnswer(opt.word, btn);
            optionsContainer.appendChild(btn);
        });

        setTimeout(() => speakText(activeQuestion.prompt), 400);
    }
}

// --- FASE DE EXPLORACIÓN LIBRE (NIVEL 1 & 2) ---
function loadExplorationRound() {
    const grid = document.getElementById('exploration-letters-grid');
    grid.innerHTML = '';

    const list = LEVEL_DATA[state.currentLevel];

    list.forEach(letter => {
        const btn = document.createElement('button');
        btn.className = 'letter-card';
        // Mostrar mayúscula y minúscula juntas en las tarjetas de descubrimiento (ej: A a, B b)
        btn.innerHTML = `<div style="font-size: 2.2rem; font-weight: 800;">${letter}</div><div style="font-size: 1.4rem; color: #7F8C8D; margin-top: -4px;">${letter.toLowerCase()}</div>`;
        
        btn.onclick = () => {
            playTapSound();
            btn.style.transform = 'scale(1.2) rotate(5deg)';
            setTimeout(() => {
                btn.style.transform = '';
            }, 200);

            if (state.currentLevel === 1) {
                speakText(letter);
            } else {
                const phonetic = (PHONETIC_ALPHABET[letter] && PHONETIC_ALPHABET[letter].phoneticName) || letter;
                speakText(phonetic);
            }
        };
        grid.appendChild(btn);
    });

    const introText = state.currentLevel === 1 ? "Conozcamos las vocales. ¡Toca cada letra para escuchar cómo suena!" : "Conozcamos las consonantes. ¡Toca cada letra para escuchar cómo suena!";
    setTimeout(() => speakText(introText), 400);
}

// --- FASE DE SOPA DE LETRAS (NIVEL 9) ---
function loadSopaRound(data) {
    const emojiElem = document.getElementById('sopa-emoji');
    const promptElem = document.getElementById('sopa-prompt');
    const slotsContainer = document.getElementById('sopa-word-slots');
    const gridContainer = document.getElementById('sopa-letters-grid');
    
    emojiElem.textContent = data.emoji || "✨";
    promptElem.innerHTML = data.prompt;
    slotsContainer.innerHTML = '';
    gridContainer.innerHTML = '';
    
    // Configurar repetición de audio
    document.getElementById('btn-repeat-sound-sopa').onclick = () => speakText(data.prompt);
    
    const word = data.word;
    const len = word.length;
    
    // Casillas de la palabra vacías al inicio
    for (let i = 0; i < len; i++) {
        const slot = document.createElement('div');
        slot.className = 'letter-slot';
        slot.id = `sopa-slot-${i}`;
        slot.textContent = '?';
        slotsContainer.appendChild(slot);
    }
    
    // Tamaño de la cuadrícula
    const gridSize = len <= 4 ? 4 : 5;
    gridContainer.style.setProperty('--grid-cols', gridSize);
    
    // Crear matriz vacía
    const grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''));
    
    // Colocar la palabra objetivo horizontal o verticalmente al azar
    const isHorizontal = Math.random() > 0.5;
    let startRow, startCol;
    
    if (isHorizontal) {
        startRow = Math.floor(Math.random() * gridSize);
        startCol = Math.floor(Math.random() * (gridSize - len + 1));
        for (let i = 0; i < len; i++) {
            grid[startRow][startCol + i] = { char: word[i], index: i };
        }
    } else {
        startRow = Math.floor(Math.random() * (gridSize - len + 1));
        startCol = Math.floor(Math.random() * gridSize);
        for (let i = 0; i < len; i++) {
            grid[startRow + i][startCol] = { char: word[i], index: i };
        }
    }
    
    // Rellenar las casillas vacías con letras aleatorias
    const alphabet = "ABCDEFGHIJKLMNÑOPQRSTUVXYZ";
    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
            if (!grid[r][c]) {
                const randomChar = alphabet[Math.floor(Math.random() * alphabet.length)];
                grid[r][c] = { char: randomChar, index: -1 };
            }
        }
    }
    
    // Renderizar la cuadrícula de botones
    let currentWordIndex = 0;
    
    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
            const letterObj = grid[r][c];
            const btn = document.createElement('button');
            btn.className = 'sopa-letter';
            btn.textContent = letterObj.char;
            
            btn.onclick = () => {
                playTapSound();
                speakText(letterObj.char.toLowerCase());
                
                // Si es la letra esperada en orden
                if (letterObj.char === word[currentWordIndex] && letterObj.index === currentWordIndex) {
                    btn.classList.add('correct');
                    const slot = document.getElementById(`sopa-slot-${currentWordIndex}`);
                    slot.textContent = letterObj.char;
                    slot.classList.add('filled');
                    currentWordIndex++;
                    
                    if (currentWordIndex === len) {
                        for (let i = 0; i < len; i++) {
                            document.getElementById(`sopa-slot-${i}`).classList.add('success');
                        }
                        setTimeout(() => {
                            playSuccessSound();
                            addStar();
                            confetti({ particleCount: 90, spread: 60, origin: { y: 0.6 } });
                            speakText(`¡Excelente! ¡Encontraste ${word}!`);
                            nextRound();
                        }, 500);
                    }
                } else {
                    btn.classList.add('wrong');
                    setTimeout(() => btn.classList.remove('wrong'), 500);
                }
            };
            gridContainer.appendChild(btn);
        }
    }
    
    setTimeout(() => speakText(data.prompt), 500);
}

// --- FASE DE CONSTRUCTOR DE SÍLABAS (NIVEL 10) ---
function loadConstructorRound(data) {
    const emojiElem = document.getElementById('constructor-emoji');
    const promptElem = document.getElementById('constructor-prompt');
    const slotsContainer = document.getElementById('constructor-word-slots');
    const bubblesContainer = document.getElementById('constructor-bubbles-container');
    
    emojiElem.textContent = data.emoji || "✨";
    promptElem.innerHTML = data.prompt;
    slotsContainer.innerHTML = '';
    bubblesContainer.innerHTML = '';
    
    // Configurar repetición de audio para pronunciar la palabra oculta
    document.getElementById('btn-repeat-sound-constructor').onclick = () => speakText(data.word.toLowerCase());
    
    const syllables = data.syllables;
    const len = syllables.length;
    
    // Crear casillas para las sílabas
    for (let i = 0; i < len; i++) {
        const slot = document.createElement('div');
        slot.className = 'letter-slot';
        slot.style.minWidth = '100px';
        slot.id = `constructor-slot-${i}`;
        slot.textContent = '?';
        
        // Configurar Drag & Drop para casillas
        slot.ondragover = (e) => {
            e.preventDefault();
            if (i === currentSyllableIndex) {
                slot.classList.add('drag-over');
            }
        };
        slot.ondragleave = () => {
            slot.classList.remove('drag-over');
        };
        slot.ondrop = (e) => {
            e.preventDefault();
            slot.classList.remove('drag-over');
            const droppedSyl = e.dataTransfer.getData("text/plain");
            if (i === currentSyllableIndex) {
                handleSyllablePlacement(droppedSyl, state.draggingBtn);
            }
        };
        
        slotsContainer.appendChild(slot);
    }
    
    // Generar opciones (sílabas del objetivo + distractores)
    const allConsonants = Object.keys(PHONETIC_ALPHABET);
    const distractors = [];
    while (distractors.length < 2) {
        const randomC = allConsonants[Math.floor(Math.random() * allConsonants.length)];
        const syllablesList = PHONETIC_ALPHABET[randomC].syllables;
        const randomSyl = syllablesList[Math.floor(Math.random() * syllablesList.length)];
        if (!syllables.includes(randomSyl) && !distractors.includes(randomSyl)) {
            distractors.push(randomSyl);
        }
    }
    
    const options = [...syllables, ...distractors].sort(() => Math.random() - 0.5);
    let currentSyllableIndex = 0;

    function handleSyllablePlacement(syl, btn) {
        playTapSound();
        speakText(syl.toLowerCase());
        
        if (syl === syllables[currentSyllableIndex]) {
            if (btn) btn.classList.add('used');
            const slot = document.getElementById(`constructor-slot-${currentSyllableIndex}`);
            slot.textContent = syl;
            slot.classList.add('filled');
            currentSyllableIndex++;
            
            if (currentSyllableIndex === len) {
                for (let i = 0; i < len; i++) {
                    document.getElementById(`constructor-slot-${i}`).classList.add('success');
                }
                setTimeout(() => {
                    playSuccessSound();
                    addStar();
                    triggerMascotReaction('success'); // La mascota celebra al completar la palabra
                    confetti({ particleCount: 90, spread: 60, origin: { y: 0.6 } });
                    speakText(`¡Genial! ¡Formaste ${data.word}!`);
                    nextRound();
                }, 500);
            }
        } else {
            triggerMascotReaction('fail'); // La mascota se entristece al errar
            if (btn) {
                btn.classList.add('wrong');
                setTimeout(() => btn.classList.remove('wrong'), 800);
            }
        }
    }
    
    options.forEach(syl => {
        const btn = document.createElement('button');
        btn.className = 'syllable-bubble';
        btn.textContent = syl;
        
        // Habilitar Arrastre
        btn.draggable = true;
        btn.ondragstart = (e) => {
            e.dataTransfer.setData("text/plain", syl);
            btn.classList.add('dragging');
            state.draggingBtn = btn;
        };
        btn.ondragend = () => {
            btn.classList.remove('dragging');
        };
        
        btn.onclick = () => {
            handleSyllablePlacement(syl, btn);
        };
        bubblesContainer.appendChild(btn);
    });
    
    setTimeout(() => {
        speakText("Une las sílabas para encontrar la siguiente palabra", () => {
            setTimeout(() => speakText(data.word.toLowerCase()), 500);
        });
    }, 500);
}

// --- FASE DE CONSTRUCTOR DE ENUNCIADOS (NIVEL 11) ---
function loadEnunciadosRound(data) {
    const emojiElem = document.getElementById('enunciados-emoji');
    const promptElem = document.getElementById('enunciados-prompt');
    const slotsContainer = document.getElementById('enunciados-word-slots');
    const bubblesContainer = document.getElementById('enunciados-bubbles-container');
    
    emojiElem.textContent = data.emoji || "✨";
    promptElem.innerHTML = "Une las palabras para formar el enunciado";
    slotsContainer.innerHTML = '';
    bubblesContainer.innerHTML = '';
    
    // Configurar repetición de audio para pronunciar el enunciado completo
    document.getElementById('btn-repeat-sound-enunciados').onclick = () => speakText(data.sentence.toLowerCase());
    
    const words = data.words;
    const len = words.length;
    
    // Crear casillas para las palabras
    for (let i = 0; i < len; i++) {
        const slot = document.createElement('div');
        slot.className = 'letter-slot';
        slot.style.minWidth = '80px';
        slot.style.padding = '5px 15px';
        slot.style.height = 'auto';
        slot.id = `enunciados-slot-${i}`;
        slot.textContent = '?';
        
        // Drag & Drop para casillas
        slot.ondragover = (e) => {
            e.preventDefault();
            if (i === currentWordIndex) {
                slot.classList.add('drag-over');
            }
        };
        slot.ondragleave = () => {
            slot.classList.remove('drag-over');
        };
        slot.ondrop = (e) => {
            e.preventDefault();
            slot.classList.remove('drag-over');
            const droppedWord = e.dataTransfer.getData("text/plain");
            if (i === currentWordIndex) {
                handleWordPlacement(droppedWord, state.draggingBtn);
            }
        };
        
        slotsContainer.appendChild(slot);
    }
    
    // Generar opciones (palabras del enunciado + distractores)
    const allDistractors = ["CASA", "SOL", "MESA", "CORRE", "GATO", "PERRO", "MÍA", "JUEGA"];
    const distractors = [];
    while (distractors.length < 2) {
        const randomDist = allDistractors[Math.floor(Math.random() * allDistractors.length)];
        if (!words.includes(randomDist) && !distractors.includes(randomDist)) {
            distractors.push(randomDist);
        }
    }
    
    const options = [...words, ...distractors].sort(() => Math.random() - 0.5);
    let currentWordIndex = 0;

    function handleWordPlacement(w, btn) {
        playTapSound();
        speakText(w.toLowerCase());
        
        if (w === words[currentWordIndex]) {
            if (btn) btn.classList.add('used');
            const slot = document.getElementById(`enunciados-slot-${currentWordIndex}`);
            slot.textContent = w;
            slot.classList.add('filled');
            currentWordIndex++;
            
            if (currentWordIndex === len) {
                for (let i = 0; i < len; i++) {
                    document.getElementById(`enunciados-slot-${i}`).classList.add('success');
                }
                setTimeout(() => {
                    playSuccessSound();
                    addStar();
                    triggerMascotReaction('success'); // La mascota celebra al completar la frase
                    confetti({ particleCount: 90, spread: 60, origin: { y: 0.6 } });
                    speakText(`¡Fantástico! Formaste: ${data.sentence}`);
                    nextRound();
                }, 500);
            }
        } else {
            triggerMascotReaction('fail'); // La mascota se entristece al fallar la palabra
            if (btn) {
                btn.classList.add('wrong');
                setTimeout(() => btn.classList.remove('wrong'), 800);
            }
        }
    }
    
    options.forEach(w => {
        const btn = document.createElement('button');
        btn.className = 'syllable-bubble';
        btn.style.borderRadius = '20px';
        btn.style.padding = '10px 25px';
        btn.style.height = 'auto';
        btn.textContent = w;
        
        // Habilitar Arrastre
        btn.draggable = true;
        btn.ondragstart = (e) => {
            e.dataTransfer.setData("text/plain", w);
            btn.classList.add('dragging');
            state.draggingBtn = btn;
        };
        btn.ondragend = () => {
            btn.classList.remove('dragging');
        };
        
        btn.onclick = () => {
            handleWordPlacement(w, btn);
        };
        bubblesContainer.appendChild(btn);
    });
    
    setTimeout(() => {
        speakText("Une las palabras para formar el enunciado", () => {
            setTimeout(() => speakText(data.sentence.toLowerCase()), 500);
        });
    }, 500);
}

// --- REPASO DE SÍLABAS (NIVEL 8) ---
function runSilabarioReview(consonantData) {
    const listContainer = document.getElementById('syllables-review-row');
    const startBtn = document.getElementById('btn-start-silabario-game');
    listContainer.innerHTML = '';
    startBtn.style.display = 'none';

    const cards = {};
    consonantData.syllables.forEach(syl => {
        const card = document.createElement('div');
        card.className = 'syllable-card';
        card.textContent = syl;
        // Se inician como tarjetas no clickables durante la intro de audio
        listContainer.appendChild(card);
        cards[syl] = card;
    });

    let currentSylIdx = 0;

    function playNextSyllableIntro() {
        if (currentSylIdx < consonantData.syllables.length) {
            const syl = consonantData.syllables[currentSylIdx];
            const vowel = syl.substring(syl.length - 1);
            
            Object.values(cards).forEach(c => c.classList.remove('highlighted'));
            cards[syl].classList.add('highlighted');

            const textToSpeak = `La ${consonantData.phoneticName}... con la ${vowel.toLowerCase()}... suena ${syl.toLowerCase()}`;
            
            speakText(textToSpeak, () => {
                currentSylIdx++;
                setTimeout(playNextSyllableIntro, 300);
            });
        } else {
            // Activar las tarjetas como botones de repetición al terminar el intro
            Object.values(cards).forEach(c => {
                c.classList.remove('highlighted');
                c.style.cursor = 'pointer';
            });
            consonantData.syllables.forEach(syl => {
                const card = cards[syl];
                card.onclick = () => {
                    playTapSound();
                    speakText(syl.toLowerCase());
                    card.classList.add('highlighted');
                    setTimeout(() => card.classList.remove('highlighted'), 500);
                };
            });
            
            speakText("¡Excelente! Ahora encontremos palabras.", () => {
                startBtn.style.display = 'block';
            });
        }
    }

    startBtn.onclick = () => {
        state.inReviewPhase = false;
        state.silabarioSubIndex = 0;
        loadRound();
    };

    setTimeout(playNextSyllableIntro, 600);
}

// --- LÓGICA DE RESPUESTAS ---

// Nivel 3, 4 & 5
function checkSelectionAnswer(selected, btn) {
    const data = state.currentWordObj;
    if (selected === data.target) {
        // Desactivar botones de inmediato para evitar clics múltiples
        document.querySelectorAll('#game-options-container .btn-option').forEach(b => b.disabled = true);
        
        // 1. Pronunciar primero la sílaba o letra correcta elegida (ej. "ar")
        speakText(selected.toLowerCase(), () => {
            // 2. Al terminar de decir la sílaba, sonar el éxito y celebrar
            playSuccessSound();
            addStar();
            triggerMascotReaction('success'); // La mascota festeja
            confetti({ particleCount: 70, spread: 50, origin: { y: 0.6 } });
            
            // 3. Pronunciar la frase final con la palabra completa
            setTimeout(() => {
                speakText(`¡Muy bien! ¡Es ${data.word}!`, () => {
                    setTimeout(nextRound, 600);
                });
            }, 300);
        });
    } else {
        playFailSound();
        btn.classList.add('wrong');
        triggerMascotReaction('fail'); // La mascota se entristece
        
        if (state.currentLevel === 3) {
            speakText(selected.toLowerCase()); // Pronunciar la vocal incorrecta seleccionada (ej. "e")
        } else if (state.currentLevel === 4) {
            const phonetic = (PHONETIC_ALPHABET[selected] && PHONETIC_ALPHABET[selected].phoneticName) || selected;
            speakText(phonetic); // Pronunciar la consonante incorrecta seleccionada (ej. "beh")
        } else if (state.currentLevel === 5 || state.currentLevel === 11) {
            speakText(selected.toLowerCase()); // Pronunciar la sílaba incorrecta seleccionada (ej. "ma")
        } else {
            speakText(selected.toLowerCase());
        }
        
        setTimeout(() => btn.classList.remove('wrong'), 800);
    }
}

// Nivel 6 & 7 (Deletreo)
function handleLetterSelection(letter, btn) {
    const word = state.currentWordObj.word;
    const targetLetter = word[state.correctSpellingIndex];

    if (letter === targetLetter) {
        playTone(350 + (state.correctSpellingIndex * 50), 'sine', 0.1);
        speakText(letter);

        const slot = document.getElementById(`slot-${state.correctSpellingIndex}`);
        slot.textContent = letter;
        slot.classList.add('filled');
        
        btn.classList.add('used');
        state.correctSpellingIndex++;

        if (state.correctSpellingIndex === word.length) {
            setTimeout(() => {
                playSuccessSound();
                addStar();
                triggerMascotReaction('success'); // La mascota festeja al completar la palabra
                confetti({ particleCount: 90, spread: 60, origin: { y: 0.6 } });
                
                for (let i = 0; i < word.length; i++) {
                    document.getElementById(`slot-${i}`).classList.add('success');
                }

                speakText(`¡Excelente! ¡Formaste la palabra ${word}!`);
                nextRound();
            }, 300);
        }
    } else {
        playFailSound();
        btn.classList.add('wrong');
        triggerMascotReaction('fail'); // La mascota se entristece al errar la letra
        const phonetic = (PHONETIC_ALPHABET[letter] && PHONETIC_ALPHABET[letter].phoneticName) || letter;
        speakText(phonetic); // Pronunciar la letra incorrecta (ej. "beh", "ceh")
        setTimeout(() => btn.classList.remove('wrong'), 600);
    }
}

// Nivel 8: Respuestas
function checkSilabarioAnswer(selectedWord, btn) {
    const data = state.currentWordObj;
    const activeQuestion = data.questions[state.silabarioSubIndex];

    if (selectedWord === activeQuestion.target) {
        playSuccessSound();
        addStar();
        triggerMascotReaction('success'); // La mascota festeja
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
        speakText(`¡Fantástico! ¡La palabra es ${selectedWord}!`);

        document.querySelectorAll('#game-options-container .btn-option').forEach(b => b.disabled = true);

        setTimeout(() => {
            if (state.silabarioSubIndex + 1 < data.questions.length) {
                state.silabarioSubIndex++;
                loadRound();
            } else {
                nextRound();
            }
        }, 2200);
    } else {
        playFailSound();
        btn.classList.add('wrong');
        triggerMascotReaction('fail'); // La mascota se entristece
        speakText("Busca otra");
        setTimeout(() => btn.classList.remove('wrong'), 800);
    }
}

// Siguiente pregunta o finalizar nivel
function nextRound() {
    const list = LEVEL_DATA[state.currentLevel];
    setTimeout(() => {
        if (state.currentQuestionIndex + 1 < list.length) {
            state.currentQuestionIndex++;
            state.silabarioSubIndex = 0;
            state.inReviewPhase = (state.currentLevel === 8);
            loadRound();
        } else {
            playSuccessSound();
            addCoins(20);
            triggerMascotReaction('success');

            const kidName = (state.currentUser && state.currentUser.kidName) ? state.currentUser.kidName : "";
            const msg = kidName ? `¡Felicitaciones ${kidName}! Completaste todo el nivel y ganaste veinte monedas.` : "¡Felicitaciones! Completaste todo el nivel y ganaste veinte monedas.";
            speakText(msg);

            confetti({ particleCount: 150, spread: 80, origin: { y: 0.5 } });
            
            setTimeout(() => {
                showScreen('screen-menu');
            }, 3200);
        }
    }, 2800);
}

// Repetir audio
function repeatPromptAudio() {
    const data = state.currentWordObj;
    if (!data) return;
    
    if (state.currentLevel === 3 || state.currentLevel === 4 || state.currentLevel === 5 || state.currentLevel === 9 || state.currentLevel === 10 || state.currentLevel === 11) {
        speakText(data.prompt);
    } else if (state.currentLevel === 8) {
        const activeQuestion = data.questions[state.silabarioSubIndex];
        speakText(activeQuestion.prompt);
    } else if (state.currentLevel === 1) {
        speakText("Conozcamos las vocales. ¡Toca cada letra para escuchar cómo suena!");
    } else if (state.currentLevel === 2) {
        speakText("Conozcamos las consonantes. ¡Toca cada letra para escuchar cómo suena!");
    } else {
        speakText(data.word);
    }
}

// --- ALTERNANCIA DE PESTAÑAS DEL MENÚ ---
function switchMenuTab(tabName) {
    playTapSound();
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => {
        c.classList.remove('active');
        c.style.display = 'none';
    });
    
    if (tabName === 'camino') {
        document.getElementById('tab-camino').classList.add('active');
        const content = document.getElementById('container-camino');
        content.classList.add('active');
        content.style.display = 'block';
    } else if (tabName === 'juegos') {
        document.getElementById('tab-juegos').classList.add('active');
        const content = document.getElementById('container-juegos');
        content.classList.add('active');
        content.style.display = 'block';
    } else if (tabName === 'coleccion') {
        document.getElementById('tab-coleccion').classList.add('active');
        const content = document.getElementById('container-coleccion');
        content.classList.add('active');
        content.style.display = 'block';
        renderFriendsShop();
    } else if (tabName === 'admin') {
        document.getElementById('tab-admin').classList.add('active');
        const content = document.getElementById('container-admin');
        content.classList.add('active');
        content.style.display = 'block';
        loadAdminPending();
    }
}

// --- CONFIGURACIÓN DE LOS 10 NIVELES DE GLOBOS ---
const GLOBOS_LEVELS = {
    1: {
        title: "Nivel 1: Letra A 🎈",
        banner: "¡Explota solo la letra A!",
        instruction: "¡Nivel uno! Explota solo los globos que tengan la letra A.",
        isCorrect: (letter) => letter === "A",
        getRandomCorrect: () => "A",
        getRandomIncorrect: () => {
            const list = ["M", "P", "T", "L", "S", "B", "R", "D"];
            return list[Math.floor(Math.random() * list.length)];
        },
        speedMin: 1.0,
        speedMax: 1.5
    },
    2: {
        title: "Nivel 2: Letra E 🎈",
        banner: "¡Explota solo la letra E!",
        instruction: "¡Nivel dos! Explota solo los globos que tengan la letra E.",
        isCorrect: (letter) => letter === "E",
        getRandomCorrect: () => "E",
        getRandomIncorrect: () => {
            const list = ["M", "P", "T", "L", "S", "B", "R", "D"];
            return list[Math.floor(Math.random() * list.length)];
        },
        speedMin: 1.0,
        speedMax: 1.5
    },
    3: {
        title: "Nivel 3: Letra I 🎈",
        banner: "¡Explota solo la letra I!",
        instruction: "¡Nivel tres! Explota solo los globos que tengan la letra I.",
        isCorrect: (letter) => letter === "I",
        getRandomCorrect: () => "I",
        getRandomIncorrect: () => {
            const list = ["M", "P", "T", "L", "S", "B", "R", "D"];
            return list[Math.floor(Math.random() * list.length)];
        },
        speedMin: 1.0,
        speedMax: 1.5
    },
    4: {
        title: "Nivel 4: Letra O 🎈",
        banner: "¡Explota solo la letra O!",
        instruction: "¡Nivel cuatro! Explota solo los globos que tengan la letra O.",
        isCorrect: (letter) => letter === "O",
        getRandomCorrect: () => "O",
        getRandomIncorrect: () => {
            const list = ["M", "P", "T", "L", "S", "B", "R", "D"];
            return list[Math.floor(Math.random() * list.length)];
        },
        speedMin: 1.0,
        speedMax: 1.5
    },
    5: {
        title: "Nivel 5: Letra U 🎈",
        banner: "¡Explota solo la letra U!",
        instruction: "¡Nivel cinco! Explota solo los globos que tengan la letra U.",
        isCorrect: (letter) => letter === "U",
        getRandomCorrect: () => "U",
        getRandomIncorrect: () => {
            const list = ["M", "P", "T", "L", "S", "B", "R", "D"];
            return list[Math.floor(Math.random() * list.length)];
        },
        speedMin: 1.0,
        speedMax: 1.5
    },
    6: {
        title: "Nivel 6: Cualquier Vocal 🗣️",
        banner: "¡Explota solo las Vocales (A, E, I, O, U)!",
        instruction: "¡Nivel seis! Explota únicamente los globos que contengan una vocal.",
        isCorrect: (letter) => ["A", "E", "I", "O", "U"].includes(letter),
        getRandomCorrect: () => {
            const list = ["A", "E", "I", "O", "U"];
            return list[Math.floor(Math.random() * list.length)];
        },
        getRandomIncorrect: () => {
            const list = ["M", "P", "T", "L", "S", "B", "R", "D"];
            return list[Math.floor(Math.random() * list.length)];
        },
        speedMin: 1.2,
        speedMax: 1.8
    },
    7: {
        title: "Nivel 7: Consonantes 🎵",
        banner: "¡Explota solo las Consonantes!",
        instruction: "¡Nivel siete! Explota únicamente los globos con consonantes. ¡Evita las vocales!",
        isCorrect: (letter) => !["A", "E", "I", "O", "U"].includes(letter) && letter.length === 1,
        getRandomCorrect: () => {
            const list = ["B", "C", "D", "F", "G", "L", "M", "N", "P", "S", "T", "R"];
            return list[Math.floor(Math.random() * list.length)];
        },
        getRandomIncorrect: () => {
            const list = ["A", "E", "I", "O", "U"];
            return list[Math.floor(Math.random() * list.length)];
        },
        speedMin: 1.2,
        speedMax: 1.8
    },
    8: {
        title: "Nivel 8: Sílabas Simples 🧩",
        banner: "¡Explota solo las Sílabas (MA, PE, LI...)!",
        instruction: "¡Nivel ocho! Explota únicamente los globos que tengan una sílaba completa.",
        isCorrect: (letter) => letter.length === 2 && !["AL","ES","IN","OL","UN","AS","ER","IS","OP","US"].includes(letter),
        getRandomCorrect: () => {
            const list = ["MA", "ME", "MI", "MO", "MU", "PA", "PE", "PI", "PO", "PU", "LA", "LE", "LI", "LO", "LU", "SA", "SE", "SI", "SO", "SU"];
            return list[Math.floor(Math.random() * list.length)];
        },
        getRandomIncorrect: () => {
            const list = ["A", "E", "I", "O", "U", "M", "P", "S", "T", "L", "B"];
            return list[Math.floor(Math.random() * list.length)];
        },
        speedMin: 1.3,
        speedMax: 2.0
    },
    9: {
        title: "Nivel 9: Sílabas Inversas 🌀",
        banner: "¡Explota solo las Sílabas Inversas (AL, ES, IN...)!",
        instruction: "¡Nivel nueve! Explota únicamente los globos con sílabas inversas. Recuerda, la vocal va primero.",
        isCorrect: (letter) => ["AL","ES","IN","OL","UN","AS","ER","IS","OP","US"].includes(letter),
        getRandomCorrect: () => {
            const list = ["AL","ES","IN","OL","UN","AS","ER","IS","OP","US"];
            return list[Math.floor(Math.random() * list.length)];
        },
        getRandomIncorrect: () => {
            const list = ["MA", "PE", "LI", "TO", "SU", "A", "E", "I", "O", "U"];
            return list[Math.floor(Math.random() * list.length)];
        },
        speedMin: 1.4,
        speedMax: 2.1
    },
    10: {
        title: "Nivel 10: ¡Velocidad Extrema! ⚡",
        banner: "¡Rápido! Explota las Vocales",
        instruction: "¡Nivel diez! ¡Máxima velocidad! Explota las vocales antes de que caigan.",
        isCorrect: (letter) => ["A", "E", "I", "O", "U"].includes(letter),
        getRandomCorrect: () => {
            const list = ["A", "E", "I", "O", "U"];
            return list[Math.floor(Math.random() * list.length)];
        },
        getRandomIncorrect: () => {
            const list = ["M", "P", "T", "L", "S", "B", "R", "D"];
            return list[Math.floor(Math.random() * list.length)];
        },
        speedMin: 2.5,
        speedMax: 3.5
    }
};

let globosState = {
    currentLevelNum: 1,
    score: 0,
    spawnInterval: null,
    fallInterval: null,
    activeBalloons: [],
    gameRunning: false
};

function startLluviaGlobos() {
    state.currentLevel = "globos";
    showScreen('screen-game');
    
    // Ocultar todos los paneles estándar
    document.getElementById('silabario-review-panel').style.display = 'none';
    document.getElementById('exploration-panel').style.display = 'none';
    document.getElementById('game-play-panel').style.display = 'none';
    document.getElementById('sopa-letras-panel').style.display = 'none';
    document.getElementById('constructor-silabas-panel').style.display = 'none';
    document.getElementById('constructor-enunciados-panel').style.display = 'none';
    
    const trucksPanel = document.getElementById('camiones-silabicos-panel');
    if (trucksPanel) trucksPanel.style.display = 'none';
    
    // Mostrar panel de globos y ocultar area de juego real para mostrar el selector
    document.getElementById('lluvia-globos-panel').style.display = 'flex';
    document.getElementById('globos-level-selector').style.display = 'block';
    document.getElementById('globos-game-play').style.display = 'none';
    document.getElementById('game-title').textContent = "Lluvia de Globos";
    document.getElementById('level-dots').innerHTML = '';
    
    renderGlobosLevelSelector();
}

function renderGlobosLevelSelector() {
    const grid = document.getElementById('globos-level-grid');
    grid.innerHTML = '';
    
    // Leer nivel máximo desbloqueado (por defecto 1)
    const maxUnlocked = parseInt(localStorage.getItem('globos-max-level') || '1');
    
    for (let l = 1; l <= 10; l++) {
        const btn = document.createElement('button');
        const isLocked = l > maxUnlocked;
        
        btn.className = `level-btn ${isLocked ? 'locked' : 'unlocked'}`;
        btn.innerHTML = isLocked ? `${l}<br>🔒` : `${l}`;
        
        if (!isLocked) {
            btn.onclick = () => {
                playTapSound();
                playGlobosLevel(l);
            };
        } else {
            btn.onclick = () => {
                playFailSound();
                speakText("Nivel bloqueado. ¡Completa los niveles anteriores para desbloquearlo!");
            };
        }
        grid.appendChild(btn);
    }
}

function playGlobosLevel(levelNum) {
    globosState.currentLevelNum = levelNum;
    const config = GLOBOS_LEVELS[levelNum];
    
    // Mostrar pantalla de juego y ocultar selector
    document.getElementById('globos-level-selector').style.display = 'none';
    document.getElementById('globos-game-play').style.display = 'flex';
    
    document.getElementById('globos-target-banner').textContent = config.banner;
    document.getElementById('globos-score').textContent = "0";
    document.getElementById('globos-area').innerHTML = '';
    
    globosState.score = 0;
    globosState.activeBalloons = [];
    globosState.gameRunning = true;
    
    // Anuncio del nivel por Dino
    triggerMascotReaction('idle');
    speakText(config.instruction);
    
    // Configurar temporizadores de generación y movimiento
    clearInterval(globosState.spawnInterval);
    const spawnRate = levelNum === 10 ? 900 : 1600; // Más rápido en nivel 10
    globosState.spawnInterval = setInterval(spawnBalloon, spawnRate);
    
    clearInterval(globosState.fallInterval);
    globosState.fallInterval = setInterval(updateBalloonsMovement, 30);
}

function spawnBalloon() {
    if (!globosState.gameRunning) return;
    const config = GLOBOS_LEVELS[globosState.currentLevelNum];
    
    const isCorrect = Math.random() < 0.45; // 45% probabilidad de correcto
    const letter = isCorrect ? config.getRandomCorrect() : config.getRandomIncorrect();
        
    const area = document.getElementById('globos-area');
    const balloon = document.createElement('div');
    
    const colors = ["red", "blue", "green", "yellow", "pink", "purple", "orange"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    balloon.className = `balloon ${randomColor}`;
    balloon.style.borderColor = `inherit`;
    // Alternar de forma aleatoria entre mayúsculas y minúsculas para mayor reto
    const displayLetter = Math.random() > 0.5 ? letter.toUpperCase() : letter.toLowerCase();
    balloon.textContent = displayLetter;
    
    // Si la sílaba es larga, reducir ligeramente el tamaño de fuente para que quepa bien
    if (letter.length > 1) {
        balloon.style.fontSize = '1.4rem';
    }
    
    // Crear el hilo del globo
    const string = document.createElement('div');
    string.className = 'balloon-string';
    balloon.appendChild(string);
    
    // Posición horizontal aleatoria
    const areaWidth = area.clientWidth || 320;
    const leftPos = Math.random() * (areaWidth - 85) + 10;
    balloon.style.left = `${leftPos}px`;
    balloon.style.top = `-110px`;
    
    // Fórmulas de velocidad basada en el nivel
    const speed = Math.random() * (config.speedMax - config.speedMin) + config.speedMin;
    
    const balloonObj = {
        element: balloon,
        top: -110,
        left: leftPos,
        speed: speed,
        isCorrect: isCorrect,
        letter: letter
    };
    
    // Controlar click/tap físico
    const handler = (e) => {
        e.preventDefault();
        popBalloon(balloonObj);
    };
    balloon.addEventListener('mousedown', handler);
    balloon.addEventListener('touchstart', handler);
    
    area.appendChild(balloon);
    globosState.activeBalloons.push(balloonObj);
}

function updateBalloonsMovement() {
    if (!globosState.gameRunning) return;
    const area = document.getElementById('globos-area');
    const areaHeight = area.clientHeight || 480;
    
    for (let i = globosState.activeBalloons.length - 1; i >= 0; i--) {
        const b = globosState.activeBalloons[i];
        b.top += b.speed;
        b.element.style.top = `${b.top}px`;
        
        // Si llega al final de la pantalla sin explotar
        if (b.top > areaHeight + 25) {
            b.element.remove();
            globosState.activeBalloons.splice(i, 1);
        }
    }
}

function popBalloon(b) {
    if (!globosState.gameRunning) return;
    const config = GLOBOS_LEVELS[globosState.currentLevelNum];
    
    // Sonido pop físico
    playTone(600, 'sine', 0.05);
    setTimeout(() => playTone(1200, 'sine', 0.04), 30);
    
    // Efecto visual de explosión
    createPopParticles(b.element.offsetLeft + 32, b.element.offsetTop + 40, b.element.classList[1]);
    
    // Eliminar del DOM y del estado
    b.element.remove();
    const idx = globosState.activeBalloons.indexOf(b);
    if (idx > -1) globosState.activeBalloons.splice(idx, 1);
    
    // Validar acierto dinámicamente según la regla del nivel
    const correctPopped = config.isCorrect(b.letter);
    
    if (correctPopped) {
        globosState.score++;
        document.getElementById('globos-score').textContent = globosState.score;
        
        // Leer la letra/sílaba
        speakText(b.letter.toLowerCase());
        triggerMascotReaction('success');
        
        if (globosState.score >= 10) {
            endLluviaGlobos(true);
        }
    } else {
        globosState.score = Math.max(0, globosState.score - 1);
        document.getElementById('globos-score').textContent = globosState.score;
        triggerMascotReaction('fail');
        
        // Si es una sílaba, pronunciar tal cual. Si es una letra, obtener su nombre fonético
        let readableName = b.letter;
        if (b.letter.length === 1) {
            readableName = (PHONETIC_ALPHABET[b.letter] && PHONETIC_ALPHABET[b.letter].phoneticName) || b.letter;
        }
        speakText(`¡Oh no! ${readableName.toLowerCase()} no es la opción correcta.`);
    }
}

function createPopParticles(x, y, colorClass) {
    const area = document.getElementById('globos-area');
    const colorMap = {
        red: '#FF5252', blue: '#448AFF', green: '#69F0AE',
        yellow: '#FFD740', pink: '#FF4081', purple: '#E040FB', orange: '#FF9100'
    };
    const color = colorMap[colorClass] || '#FFF';
    
    for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        particle.className = 'pop-particle';
        particle.style.backgroundColor = color;
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * 80 + 30;
        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist;
        
        particle.style.setProperty('--dx', `${dx}px`);
        particle.style.setProperty('--dy', `${dy}px`);
        
        area.appendChild(particle);
        setTimeout(() => particle.remove(), 500);
    }
}

function endLluviaGlobos(won) {
    globosState.gameRunning = false;
    clearInterval(globosState.spawnInterval);
    clearInterval(globosState.fallInterval);
    
    // Limpiar globos residuales
    globosState.activeBalloons.forEach(b => b.element.remove());
    globosState.activeBalloons = [];
    
    if (won) {
        playSuccessSound();
        addStar(); // +1 estrella, +10 monedas
        addCoins(10); // +10 monedas adicionales (total +20 monedas!)
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
        
        const currentLvl = globosState.currentLevelNum;
        const nextLvl = currentLvl + 1;
        
        // Registrar nivel desbloqueado
        const maxUnlocked = parseInt(localStorage.getItem('globos-max-level') || '1');
        if (nextLvl > maxUnlocked && nextLvl <= 10) {
            localStorage.setItem('globos-max-level', nextLvl.toString());
        }
        
        let successMessage = `¡Excelente trabajo! Completaste el nivel ${currentLvl}. Ganaste una estrella y veinte monedas.`;
        if (nextLvl <= 10) {
            successMessage += ` ¡Desbloqueaste el nivel ${nextLvl}!`;
        } else {
            successMessage += " ¡Felicidades! Completaste todos los niveles de globos.";
        }
        
        speakText(successMessage, () => {
            setTimeout(() => {
                // Volver a la pantalla del selector de niveles de globos
                document.getElementById('globos-game-play').style.display = 'none';
                document.getElementById('globos-level-selector').style.display = 'block';
                renderGlobosLevelSelector();
            }, 1200);
        });
    } else {
        playTapSound();
        // Regresar a la sub-vista de selección de niveles de globos
        document.getElementById('globos-game-play').style.display = 'none';
        document.getElementById('globos-level-selector').style.display = 'block';
        renderGlobosLevelSelector();
    }
}

// --- JUEGO DE CAMIONES SILÁBICOS (MINI-JUEGO DE SÍLABAS DE REGALOS/CAMIONES) ---
const TRUCKS_LEVELS = {
    1: {
        title: "Nivel 1: Palabras de 2 Sílabas 🚚",
        instruction: "¡Elige el camión con la sílaba correcta en orden!",
        filter: (w) => {
            const syls = getSyllables(w.word);
            return syls.length === 2 && !w.word.includes('Á') && !w.word.includes('É') && !w.word.includes('Í') && !w.word.includes('Ó') && !w.word.includes('Ú');
        },
        distractorsCount: 1,
        shuffleOnCorrect: false
    },
    2: {
        title: "Nivel 2: Más Palabras de 2 Sílabas 🚚",
        instruction: "¡Nivel dos! Conduce los camiones en orden.",
        filter: (w) => getSyllables(w.word).length === 2,
        distractorsCount: 2,
        shuffleOnCorrect: false
    },
    3: {
        title: "Nivel 3: Palabras con Sílabas Complejas 🚚",
        instruction: "¡Nivel tres! Encuentra las sílabas correctas para formar la palabra.",
        filter: (w) => getSyllables(w.word).length === 2 && (w.word.includes('RR') || w.word.includes('CH') || w.word.includes('LL') || w.word.includes('QU')),
        distractorsCount: 2,
        shuffleOnCorrect: false
    },
    4: {
        title: "Nivel 4: Palabras de 3 Sílabas Simples 🚚",
        instruction: "¡Nivel cuatro! Elige los camiones en el orden correcto.",
        filter: (w) => getSyllables(w.word).length === 3 && !w.word.includes('Á') && !w.word.includes('É') && !w.word.includes('Í') && !w.word.includes('Ó') && !w.word.includes('Ú'),
        distractorsCount: 1,
        shuffleOnCorrect: false
    },
    5: {
        title: "Nivel 5: Palabras de 3 Sílabas Generales 🚚",
        instruction: "¡Nivel cinco! Conduce los camiones para armar la palabra.",
        filter: (w) => getSyllables(w.word).length === 3,
        distractorsCount: 2,
        shuffleOnCorrect: false
    },
    6: {
        title: "Nivel 6: Sílabas Especiales y Mixtas 🚚",
        instruction: "¡Nivel seis! Pon mucha atención a las sílabas del camión.",
        filter: (w) => {
            const syls = getSyllables(w.word);
            return syls.length === 3 && (w.word.includes('PL') || w.word.includes('TR') || w.word.includes('BR') || w.word.includes('ES') || w.word.includes('AL') || w.word.includes('EN') || w.word.includes('IN'));
        },
        distractorsCount: 2,
        shuffleOnCorrect: false
    },
    7: {
        title: "Nivel 7: Palabras de 4 Sílabas 🚚",
        instruction: "¡Nivel siete! Palabras más largas de cuatro sílabas.",
        filter: (w) => getSyllables(w.word).length === 4,
        distractorsCount: 1,
        shuffleOnCorrect: false
    },
    8: {
        title: "Nivel 8: Desafío de 4 Sílabas 🚚",
        instruction: "¡Nivel ocho! Conduce los cuatro camiones.",
        filter: (w) => getSyllables(w.word).length === 4,
        distractorsCount: 2,
        shuffleOnCorrect: false
    },
    9: {
        title: "Nivel 9: Super Reto de Camiones 🚚",
        instruction: "¡Nivel nueve! Conduce con mucho cuidado hacia la meta.",
        filter: (w) => getSyllables(w.word).length >= 4,
        distractorsCount: 3,
        shuffleOnCorrect: false
    },
    10: {
        title: "Nivel 10: ¡Camiones Locos! 🌀",
        instruction: "¡Nivel diez! Los camiones se barajan en el estacionamiento tras cada acierto.",
        filter: (w) => getSyllables(w.word).length >= 3,
        distractorsCount: 2,
        shuffleOnCorrect: true
    }
};

let trucksState = {
    score: 0,
    currentLevel: 1,
    currentQuestionIndex: 0,
    questions: [],
    currentWordSyllables: [],
    currentSyllableIndex: 0,
    gameRunning: false
};

function startCamionesSilabicos() {
    state.currentLevel = "trucks";
    showScreen('screen-game');
    
    // Ocultar todos los paneles estándar
    document.getElementById('silabario-review-panel').style.display = 'none';
    document.getElementById('exploration-panel').style.display = 'none';
    document.getElementById('game-play-panel').style.display = 'none';
    document.getElementById('sopa-letras-panel').style.display = 'none';
    document.getElementById('constructor-silabas-panel').style.display = 'none';
    document.getElementById('constructor-enunciados-panel').style.display = 'none';
    document.getElementById('lluvia-globos-panel').style.display = 'none';
    
    // Mostrar panel de Camiones Silábicos
    document.getElementById('camiones-silabicos-panel').style.display = 'flex';
    document.getElementById('game-title').textContent = "Camiones Silábicos 🚚";
    document.getElementById('level-dots').innerHTML = '';
    
    // Mostrar selector de subniveles
    document.getElementById('trucks-level-selector').style.display = 'block';
    document.getElementById('trucks-game-play').style.display = 'none';
    
    renderTrucksLevelSelector();
}

function renderTrucksLevelSelector() {
    const grid = document.getElementById('trucks-level-grid');
    grid.innerHTML = '';
    
    const maxLevel = parseInt(localStorage.getItem('trucks-max-level') || '1');
    
    for (let i = 1; i <= 10; i++) {
        const btn = document.createElement('button');
        btn.className = `level-btn ${i <= maxLevel ? 'unlocked' : 'locked'}`;
        
        if (i <= maxLevel) {
            btn.innerHTML = `${i}`;
            btn.onclick = () => {
                playTapSound();
                playTrucksLevel(i);
            };
        } else {
            btn.innerHTML = `🔒`;
            btn.onclick = () => {
                playFailSound();
                speakText("Nivel bloqueado. ¡Completa los niveles anteriores primero!");
            };
        }
        grid.appendChild(btn);
    }
}

function playTrucksLevel(levelNum) {
    trucksState.currentLevel = levelNum;
    trucksState.score = 0;
    trucksState.currentQuestionIndex = 0;
    trucksState.gameRunning = true;
    
    const cfg = TRUCKS_LEVELS[levelNum];
    let filtered = MASTER_WORDS.filter(w => {
        try {
            return cfg.filter(w);
        } catch(e) {
            return false;
        }
    });
    
    if (filtered.length < 5) {
        if (levelNum <= 3) {
            filtered = MASTER_WORDS.filter(w => getSyllables(w.word).length === 2);
        } else if (levelNum <= 6) {
            filtered = MASTER_WORDS.filter(w => getSyllables(w.word).length === 3);
        } else {
            filtered = MASTER_WORDS.filter(w => getSyllables(w.word).length >= 3);
        }
    }
    
    trucksState.questions = [...filtered].sort(() => Math.random() - 0.5).slice(0, 5);
    
    document.getElementById('trucks-level-selector').style.display = 'none';
    document.getElementById('trucks-game-play').style.display = 'flex';
    
    speakText(cfg.instruction);
    loadNextTruckWord();
}

function getTrucksDistractors(targetSyllables, count) {
    const allSyllables = [];
    MASTER_WORDS.forEach(w => {
        const syls = getSyllables(w.word);
        syls.forEach(s => {
            if (s && s.length > 0 && !allSyllables.includes(s.toUpperCase())) {
                allSyllables.push(s.toUpperCase());
            }
        });
    });
    const cleanTarget = targetSyllables.map(s => s.toUpperCase());
    const candidates = allSyllables.filter(s => !cleanTarget.includes(s));
    const shuffled = candidates.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

function loadNextTruckWord() {
    if (!trucksState.gameRunning) return;
    
    if (trucksState.currentQuestionIndex >= trucksState.questions.length) {
        endTrucksLevel(true);
        return;
    }
    
    const wordObj = trucksState.questions[trucksState.currentQuestionIndex];
    trucksState.currentWordSyllables = getSyllables(wordObj.word);
    trucksState.currentSyllableIndex = 0;
    
    document.getElementById('trucks-emoji').textContent = wordObj.emoji || "🚚";
    document.getElementById('trucks-score').textContent = trucksState.score;
    
    document.getElementById('btn-repeat-sound-trucks').onclick = () => speakText(wordObj.word.toLowerCase());
    
    const dotsContainer = document.getElementById('level-dots');
    dotsContainer.innerHTML = '';
    for (let i = 0; i < trucksState.questions.length; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot' + (i <= trucksState.currentQuestionIndex ? ' active' : '');
        dotsContainer.appendChild(dot);
    }
    
    const slotsContainer = document.getElementById('trucks-word-slots');
    slotsContainer.innerHTML = '';
    trucksState.currentWordSyllables.forEach((syl, i) => {
        const slot = document.createElement('div');
        slot.className = 'letter-slot';
        slot.style.minWidth = '100px';
        slot.id = `trucks-slot-${i}`;
        slot.textContent = '?';
        slotsContainer.appendChild(slot);
    });
    
    const parkingGrid = document.getElementById('trucks-parking-grid');
    parkingGrid.innerHTML = '';
    
    const correctSyllables = trucksState.currentWordSyllables.map(s => s.toUpperCase());
    const distractorsCount = TRUCKS_LEVELS[trucksState.currentLevel].distractorsCount;
    const distractors = getTrucksDistractors(correctSyllables, distractorsCount);
    
    const allGifts = [
        ...correctSyllables.map(s => ({ syllable: s, isCorrect: true })),
        ...distractors.map(s => ({ syllable: s, isCorrect: false }))
    ].sort(() => Math.random() - 0.5);
    
    allGifts.forEach((gift) => {
        const truckBtn = document.createElement('button');
        truckBtn.className = 'truck';
        truckBtn.innerHTML = `
            <div class="truck-cabin">
                <div class="truck-windshield"></div>
            </div>
            <div class="truck-bed">${gift.syllable}</div>
            <div class="truck-wheel wheel-fl"></div>
            <div class="truck-wheel wheel-fr"></div>
            <div class="truck-wheel wheel-rl"></div>
            <div class="truck-wheel wheel-rr"></div>
        `;
        truckBtn.onclick = () => handleTruckSelection(truckBtn, gift.syllable);
        parkingGrid.appendChild(truckBtn);
    });
    
    setTimeout(() => speakText("Completa la palabra: " + wordObj.word.toLowerCase()), 500);
}

function handleTruckSelection(truckBtn, syllable) {
    if (truckBtn.disabled || !trucksState.gameRunning) return;
    
    // Pronunciar la sílaba del camión presionado inmediatamente
    speakText(syllable.toLowerCase());
    
    const targetSyl = trucksState.currentWordSyllables[trucksState.currentSyllableIndex].toUpperCase();
    
    if (syllable.toUpperCase() === targetSyl) {
        // CORRECT: Enciende motor y conduce al slot
        truckBtn.disabled = true;
        truckBtn.classList.add('engine-start');
        playSuccessSound();
        triggerMascotReaction('celebrate');
        
        // Calcular distancias para la animación
        const truckRect = truckBtn.getBoundingClientRect();
        const slot = document.getElementById(`trucks-slot-${trucksState.currentSyllableIndex}`);
        const slotRect = slot.getBoundingClientRect();
        
        const diffX = slotRect.left - truckRect.left + (slotRect.width - truckRect.width) / 2;
        const diffY = slotRect.top - truckRect.top - 10;
        
        // Iniciar conducción
        setTimeout(() => {
            truckBtn.style.transition = 'transform 0.8s cubic-bezier(0.55, 0.085, 0.68, 0.53), opacity 0.8s';
            truckBtn.style.transform = `translate(${diffX}px, ${diffY}px) scale(0.65)`;
        }, 150);
        
        const currentSlotIndex = trucksState.currentSyllableIndex;
        trucksState.currentSyllableIndex++;
        trucksState.score += 2;
        document.getElementById('trucks-score').textContent = trucksState.score;
        
        setTimeout(() => {
            truckBtn.style.opacity = '0';
            slot.textContent = syllable;
            slot.classList.add('filled');
            
            // Eliminar camión del DOM después de desvanecerse
            setTimeout(() => truckBtn.remove(), 400);
            
            if (trucksState.currentSyllableIndex === trucksState.currentWordSyllables.length) {
                const completedWord = trucksState.questions[trucksState.currentQuestionIndex].word;
                playSuccessSound();
                triggerMascotReaction('happy');
                speakText("¡Muy bien! " + completedWord.toLowerCase());
                
                if (typeof confetti === 'function') {
                    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
                }
                
                setTimeout(() => {
                    trucksState.currentQuestionIndex++;
                    loadNextTruckWord();
                }, 1600);
            } else if (TRUCKS_LEVELS[trucksState.currentLevel].shuffleOnCorrect) {
                reshuffleTrucks();
            }
        }, 950);
        
    } else {
        // INCORRECT: Tiembla, pita y no avanza
        truckBtn.classList.add('wrong-truck');
        playFailSound();
        triggerMascotReaction('no');
        
        trucksState.score = Math.max(0, trucksState.score - 1);
        document.getElementById('trucks-score').textContent = trucksState.score;
        
        setTimeout(() => {
            truckBtn.classList.remove('wrong-truck');
        }, 600);
    }
}

function reshuffleTrucks() {
    const parkingGrid = document.getElementById('trucks-parking-grid');
    const children = Array.from(parkingGrid.children);
    children.forEach(child => {
        if (!child.disabled) {
            child.style.order = Math.floor(Math.random() * 10);
        }
    });
}

function endTrucksLevel(won) {
    trucksState.gameRunning = false;
    
    if (won) {
        const nextLevel = trucksState.currentLevel + 1;
        const savedMax = parseInt(localStorage.getItem('trucks-max-level') || '1');
        if (trucksState.currentLevel === savedMax && nextLevel <= 10) {
            localStorage.setItem('trucks-max-level', nextLevel.toString());
        }
        
        state.stars += 5;
        state.coins += 10;
        localStorage.setItem('stars-count', state.stars);
        localStorage.setItem('coins-count', state.coins);
        document.getElementById('star-count').textContent = state.stars;
        document.getElementById('coin-count').textContent = state.coins;
        
        playSuccessSound();
        triggerMascotReaction('celebrate');
        
        if (typeof confetti === 'function') {
            confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
        }
        
        speakText("¡Felicidades! Ganaste cinco estrellas y diez monedas.");
        
        setTimeout(() => {
            startCamionesSilabicos();
        }, 2000);
    } else {
        playTapSound();
        startCamionesSilabicos();
    }
}

// --- JUEGO DE MEMORAMA DE REGALOS (MINI-JUEGO 3) ---
const MEMO_LEVELS = {
    1: {
        title: "Nivel 1: Palabras de 2 Sílabas 🎁",
        instruction: "Voltea los regalos. ¡Une las sílabas correctas para formar las 3 palabras!",
        type: "words-2",
        distractorsCount: 4
    },
    2: {
        title: "Nivel 2: Palabras de 3 Sílabas 🎁",
        instruction: "Voltea los regalos. ¡Une las 3 sílabas en orden para formar las palabras!",
        type: "words-3",
        distractorsCount: 3
    },
    3: {
        title: "Nivel 3: Formar Enunciados 🎁",
        instruction: "Voltea los regalos en el orden correcto para formar el enunciado.",
        type: "sentences",
        distractorsCount: 4
    }
};

let memoState = {
    currentLevel: 1,
    score: 0,
    targets: [],      // [{ word: "CASA", emoji: "🏠", items: ["CA","SA"], completed: false }]
    shuffledItems: [], // [{ id: 0, text: "CA", targetIndex: 0, itemIndex: 0, matched: false, element: null }]
    turnedCards: [],   // list of currently turned items/cards in this match attempt
    lockBoard: false,
    gameRunning: false
};

function startMemoramaRegalos() {
    state.currentLevel = "memorama";
    showScreen('screen-game');
    
    // Ocultar todos los paneles estándar y especiales
    document.getElementById('silabario-review-panel').style.display = 'none';
    document.getElementById('exploration-panel').style.display = 'none';
    document.getElementById('game-play-panel').style.display = 'none';
    document.getElementById('sopa-letras-panel').style.display = 'none';
    document.getElementById('constructor-silabas-panel').style.display = 'none';
    document.getElementById('constructor-enunciados-panel').style.display = 'none';
    document.getElementById('lluvia-globos-panel').style.display = 'none';
    document.getElementById('camiones-silabicos-panel').style.display = 'none';
    
    // Mostrar panel de Memorama de Regalos
    document.getElementById('memorama-regalos-panel').style.display = 'flex';
    document.getElementById('game-title').textContent = "Memorama de Regalos 🎁";
    document.getElementById('level-dots').innerHTML = '';
    
    // Mostrar selector de niveles
    document.getElementById('memo-level-selector').style.display = 'block';
    document.getElementById('memo-game-play').style.display = 'none';
    
    renderMemoLevelSelector();
}

function renderMemoLevelSelector() {
    const grid = document.getElementById('memo-level-grid');
    grid.innerHTML = '';
    
    const maxLevel = parseInt(localStorage.getItem('memo-max-level') || '1');
    
    for (let i = 1; i <= 3; i++) {
        const btn = document.createElement('button');
        btn.className = `level-btn ${i <= maxLevel ? 'unlocked' : 'locked'}`;
        
        if (i <= maxLevel) {
            btn.innerHTML = `${i}`;
            btn.onclick = () => {
                playTapSound();
                playMemoLevel(i);
            };
        } else {
            btn.innerHTML = `🔒`;
            btn.onclick = () => {
                playFailSound();
                speakText("Nivel bloqueado. ¡Completa los niveles anteriores primero!");
            };
        }
        grid.appendChild(btn);
    }
}

function playMemoLevel(levelNum) {
    memoState.currentLevel = levelNum;
    memoState.score = 0;
    memoState.gameRunning = true;
    memoState.turnedCards = [];
    memoState.lockBoard = false;
    
    document.getElementById('memo-level-selector').style.display = 'none';
    document.getElementById('memo-game-play').style.display = 'flex';
    
    const cfg = MEMO_LEVELS[levelNum];
    speakText(cfg.instruction);
    
    loadMemoRound();
}

function getMemoDistractors(targetItems, count) {
    const allSyllables = [];
    MASTER_WORDS.forEach(w => {
        const syls = getSyllables(w.word);
        syls.forEach(s => {
            if (s && s.length > 0 && !allSyllables.includes(s.toUpperCase())) {
                allSyllables.push(s.toUpperCase());
            }
        });
    });
    const candidates = allSyllables.filter(s => !targetItems.includes(s));
    return candidates.sort(() => Math.random() - 0.5).slice(0, count);
}

function loadMemoRound() {
    if (!memoState.gameRunning) return;
    
    const cfg = MEMO_LEVELS[memoState.currentLevel];
    memoState.targets = [];
    memoState.shuffledItems = [];
    memoState.turnedCards = [];
    memoState.lockBoard = false;
    
    document.getElementById('memo-score').textContent = memoState.score;
    
    const correctItems = [];
    
    if (cfg.type === "words-2" || cfg.type === "words-3") {
        const neededSyllablesCount = cfg.type === "words-2" ? 2 : 3;
        let pool = MASTER_WORDS.filter(w => getSyllables(w.word).length === neededSyllablesCount);
        if (pool.length < 3) pool = MASTER_WORDS;
        
        const selectedWords = [...pool].sort(() => Math.random() - 0.5).slice(0, 3);
        
        selectedWords.forEach((wordObj, targetIdx) => {
            const syls = getSyllables(wordObj.word);
            memoState.targets.push({
                word: wordObj.word,
                emoji: wordObj.emoji,
                items: syls.map(s => s.toUpperCase()),
                completed: false
            });
            
            syls.forEach((syl, itemIdx) => {
                const upperSyl = syl.toUpperCase();
                correctItems.push(upperSyl);
                memoState.shuffledItems.push({
                    text: upperSyl,
                    targetIndex: targetIdx,
                    itemIndex: itemIdx,
                    matched: false
                });
            });
        });
    } else {
        // Enunciados
        const sentences = [
            { sentence: "EL PERRO JUEGA", emoji: "🐶" },
            { sentence: "LA GATA DUERME", emoji: "🐱" },
            { sentence: "EL SOL BRILLA", emoji: "☀️" },
            { sentence: "MI PAPÁ ME AMA", emoji: "👨" },
            { sentence: "LA VACA DA LECHE", emoji: "🐮" }
        ];
        const selected = sentences[Math.floor(Math.random() * sentences.length)];
        const words = selected.sentence.split(" ");
        
        memoState.targets.push({
            word: selected.sentence,
            emoji: selected.emoji,
            items: words.map(w => w.toUpperCase()),
            completed: false
        });
        
        words.forEach((word, itemIdx) => {
            const upperWord = word.toUpperCase();
            correctItems.push(upperWord);
            memoState.shuffledItems.push({
                text: upperWord,
                targetIndex: 0,
                itemIndex: itemIdx,
                matched: false
            });
        });
    }
    
    // Agregar distractores
    const distractors = getMemoDistractors(correctItems, cfg.distractorsCount);
    distractors.forEach(dist => {
        memoState.shuffledItems.push({
            text: dist,
            targetIndex: -1, // No pertenece a ningún target
            itemIndex: -1,
            matched: false
        });
    });
    
    // Barajar
    memoState.shuffledItems.sort(() => Math.random() - 0.5);
    
    // Asignar IDs
    memoState.shuffledItems.forEach((item, index) => {
        item.id = index;
    });
    
    renderMemoTargets();
    renderMemoGifts();
}

function renderMemoTargets() {
    const container = document.getElementById('memo-targets-container');
    container.innerHTML = '';
    
    memoState.targets.forEach((target, targetIdx) => {
        const row = document.createElement('div');
        row.className = 'memo-target-row';
        if (target.completed) row.classList.add('completed');
        
        const info = document.createElement('div');
        info.style.display = 'flex';
        info.style.alignItems = 'center';
        info.style.gap = '10px';
        info.style.cursor = 'pointer';
        info.title = "Toca para escuchar";
        info.innerHTML = `
            <span style="font-size: 2rem;">${target.emoji}</span>
            <span style="font-weight: 700; font-size: 1.1rem; color: #37474F;">${target.word}</span>
        `;
        info.onclick = () => {
            playTapSound();
            speakText(target.word.toLowerCase());
        };
        
        const slots = document.createElement('div');
        slots.className = 'memo-target-slots';
        
        target.items.forEach((itemText, itemIdx) => {
            const slot = document.createElement('div');
            slot.className = 'memo-target-slot';
            slot.id = `memo-slot-${targetIdx}-${itemIdx}`;
            
            if (target.completed) {
                slot.textContent = itemText;
                slot.classList.add('filled');
            } else {
                slot.textContent = '?';
            }
            slots.appendChild(slot);
        });
        
        row.appendChild(info);
        row.appendChild(slots);
        container.appendChild(row);
    });
}

function renderMemoGifts() {
    const grid = document.getElementById('memo-gifts-grid');
    grid.innerHTML = '';
    
    memoState.shuffledItems.forEach((item) => {
        const card = document.createElement('button');
        card.className = 'memo-gift-card';
        card.id = `memo-card-${item.id}`;
        card.innerHTML = `
            <span class="memo-emoji">🎁</span>
            <span class="memo-text">${item.text}</span>
        `;
        
        item.element = card;
        
        if (item.matched) {
            card.style.opacity = '0';
            card.style.pointerEvents = 'none';
        } else {
            card.onclick = () => {
                handleMemoSelection(item);
            };
        }
        
        grid.appendChild(card);
    });
}

function handleMemoSelection(item) {
    if (!memoState.gameRunning || memoState.lockBoard || item.matched || memoState.turnedCards.includes(item)) return;
    
    // Voltear carta
    const card = item.element;
    card.classList.add('opened');
    playTapSound();
    speakText(item.text.toLowerCase());
    
    memoState.turnedCards.push(item);
    
    // Evaluar la secuencia volteada
    const len = memoState.turnedCards.length;
    
    // Debe coincidir con el inicio de ALGUNA de las palabras/frases objetivo incompletas
    let matchesAnyStart = false;
    let matchedTarget = null;
    
    for (let targetIdx = 0; targetIdx < memoState.targets.length; targetIdx++) {
        const target = memoState.targets[targetIdx];
        if (target.completed) continue;
        
        // Verificar si la secuencia en turnedCards coincide con las primeras 'len' sílabas de esta palabra
        let sequenceMatches = true;
        for (let i = 0; i < len; i++) {
            const turnedItem = memoState.turnedCards[i];
            if (turnedItem.targetIndex !== targetIdx || turnedItem.itemIndex !== i) {
                sequenceMatches = false;
                break;
            }
        }
        
        if (sequenceMatches) {
            matchesAnyStart = true;
            matchedTarget = target;
            break;
        }
    }
    
    if (matchesAnyStart) {
        // La secuencia es válida hasta ahora.
        // ¿Completó la palabra?
        if (len === matchedTarget.items.length) {
            // ¡COMPLETADO!
            memoState.lockBoard = true;
            playSuccessSound();
            triggerMascotReaction('success');
            
            // Lanzamiento de Confeti individual
            if (typeof confetti === 'function') {
                confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
            }
            
            // Efecto visual: llenar slots arriba
            matchedTarget.items.forEach((itemText, itemIdx) => {
                const slot = document.getElementById(`memo-slot-${memoState.turnedCards[0].targetIndex}-${itemIdx}`);
                if (slot) {
                    slot.textContent = itemText;
                    slot.classList.add('filled');
                }
            });
            
            matchedTarget.completed = true;
            memoState.score += 5;
            document.getElementById('memo-score').textContent = memoState.score;
            
            // Animar desaparición de cartas emparejadas
            const activeAttempt = [...memoState.turnedCards];
            memoState.turnedCards = [];
            
            setTimeout(() => {
                activeAttempt.forEach(si => {
                    si.matched = true;
                    si.element.classList.add('matched-fade');
                });
                
                speakText("¡Formaste " + matchedTarget.word.toLowerCase() + "!");
                renderMemoTargets();
                
                // Verificar si ganó todo el nivel
                const allCompleted = memoState.targets.every(t => t.completed);
                if (allCompleted) {
                    setTimeout(() => {
                        endMemoLevel(true);
                    }, 1000);
                } else {
                    memoState.lockBoard = false;
                }
            }, 1000);
        }
    } else {
        // ERROR: La secuencia no forma ninguna palabra activa. Voltear de vuelta tras delay
        memoState.lockBoard = true;
        playFailSound();
        triggerMascotReaction('fail');
        
        memoState.score = Math.max(0, memoState.score - 1);
        document.getElementById('memo-score').textContent = memoState.score;
        
        const activeAttempt = [...memoState.turnedCards];
        memoState.turnedCards = [];
        
        setTimeout(() => {
            activeAttempt.forEach(si => {
                si.element.classList.remove('opened');
            });
            memoState.lockBoard = false;
        }, 1200);
    }
}

function endMemoLevel(won) {
    memoState.gameRunning = false;
    
    if (won) {
        const nextLevel = memoState.currentLevel + 1;
        const savedMax = parseInt(localStorage.getItem('memo-max-level') || '1');
        if (memoState.currentLevel === savedMax && nextLevel <= 3) {
            localStorage.setItem('memo-max-level', nextLevel.toString());
        }
        
        state.stars += 10;
        state.coins += 20;
        localStorage.setItem('stars-count', state.stars);
        localStorage.setItem('coins-count', state.coins);
        document.getElementById('star-count').textContent = state.stars;
        document.getElementById('coin-count').textContent = state.coins;
        
        playSuccessSound();
        triggerMascotReaction('celebrate');
        
        if (typeof confetti === 'function') {
            confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        }
        
        speakText("¡Excelente! Completaste el memorama y ganaste estrellas y monedas.");
        
        setTimeout(() => {
            startMemoramaRegalos();
        }, 2200);
    } else {
        playTapSound();
        startMemoramaRegalos();
    }
}

// --- SISTEMA DE AUTENTICACIÓN Y BASE DE DATOS (FIREBASE INTEGRACIÓN) ---
const firebaseConfig = {
  apiKey: "AIzaSyCzeLaQf1X3HaDXrRTztOpC69f7t4OsQVs",
  authDomain: "soyasesorfmf-16309.firebaseapp.com",
  databaseURL: "https://soyasesorfmf-16309-default-rtdb.firebaseio.com",
  projectId: "soyasesorfmf-16309",
  storageBucket: "soyasesorfmf-16309.firebasestorage.app",
  messagingSenderId: "548858719945",
  appId: "1:548858719945:web:9028d4d71f6f3782ed2718",
  measurementId: "G-TETV8RSN34"
};

// Inicializar Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();
const auth = firebase.auth();

let authMode = "login"; // "login" o "register"

function switchAuthTab(mode) {
    playTapSound();
    authMode = mode;
    
    // UI tabs
    document.getElementById('auth-tab-login').classList.toggle('active', mode === 'login');
    document.getElementById('auth-tab-register').classList.toggle('active', mode === 'register');
    
    // Botón submit
    document.getElementById('btn-auth-submit').textContent = mode === 'register' ? '¡Registrarse y Jugar! 📝' : '¡Entrar a Jugar! 🚀';
    
    // Inputs
    const fieldKidName = document.getElementById('field-kid-name');
    if (fieldKidName) fieldKidName.style.display = mode === 'register' ? 'flex' : 'none';
    
    // Clear messages
    document.getElementById('auth-error-msg').style.display = 'none';
    document.getElementById('auth-success-msg').style.display = 'none';
}

function handleAuthSubmit(e) {
    e.preventDefault();
    
    const email = document.getElementById('auth-email').value.trim();
    const password = document.getElementById('auth-password').value;
    const kidNameInput = document.getElementById('auth-kid-name');
    const kidName = kidNameInput ? kidNameInput.value.trim() : "";
    
    const errorBox = document.getElementById('auth-error-msg');
    const successBox = document.getElementById('auth-success-msg');
    errorBox.style.display = 'none';
    successBox.style.display = 'none';

    if (authMode === 'register') {
        const isAdmin = email.toLowerCase() === 'omar850413@gmail.com' || email.toLowerCase() === 'omar850413gmail.com' || email.toLowerCase() === 'admin@leoyjuego.com';
        if (!kidName && !isAdmin) {
            errorBox.textContent = "Por favor ingresa el nombre del niño o niña.";
            errorBox.style.display = 'block';
            return;
        }
        
        auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            const isAdmin = email.toLowerCase() === 'omar850413@gmail.com' || email.toLowerCase() === 'omar850413gmail.com' || email.toLowerCase() === 'admin@leoyjuego.com';
            // Registrar usuario en Firestore con estado pendiente de aprobación
            return db.collection('users').doc(user.uid).set({
                uid: user.uid,
                email: email.toLowerCase(),
                kidName: kidName,
                role: isAdmin ? 'admin' : 'user',
                approved: isAdmin, // El admin se auto-aprueba
                stars: 0,
                coins: 0,
                unlockedFriends: [],
                activeMascot: "🦁"
            });
        })
        .then(() => {
            // Enviar correo de notificación al administrador usando Formspree
            fetch('https://formspree.io/f/xnqevedo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email,
                    kidName: kidName,
                    message: `¡Hola! Un nuevo niño se ha registrado en Leo Aventuras.\nNombre del Niño: ${kidName}\nCorreo: ${email}\nEstado: PENDIENTE DE APROBACIÓN.`
                })
            }).catch(err => console.warn("Error al enviar notificación de correo:", err));

            successBox.textContent = "Registro exitoso. Tu cuenta está pendiente de aprobación por el administrador.";
            successBox.style.display = 'block';
            playSuccessSound();
            auth.signOut(); // Desloguear hasta aprobación
            
            // Limpiar campos
            document.getElementById('auth-email').value = '';
            document.getElementById('auth-password').value = '';
            document.getElementById('auth-kid-name').value = '';
        })
        .catch((error) => {
            console.error(error);
            errorBox.textContent = error.message || "Error al registrar usuario.";
            errorBox.style.display = 'block';
            playFailSound();
        });
    } else {
        // LOGIN
        auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            // Obtener datos del perfil del usuario en Firestore
            return db.collection('users').doc(user.uid).get();
        })
        .then((doc) => {
            if (!doc.exists) {
                // Si es la cuenta admin y no existe registro en firestore, crearla en caliente
                const user = auth.currentUser;
                const isAdmin = user.email.toLowerCase() === 'omar850413@gmail.com' || user.email.toLowerCase() === 'omar850413gmail.com' || user.email.toLowerCase() === 'admin@leoyjuego.com';
                if (isAdmin) {
                    const adminData = {
                        uid: user.uid,
                        email: user.email,
                        kidName: "Administrador",
                        role: "admin",
                        approved: true,
                        stars: 0,
                        coins: 0,
                        unlockedFriends: [],
                        activeMascot: "🦁"
                    };
                    return db.collection('users').doc(user.uid).set(adminData).then(() => adminData);
                }
                throw new Error("El perfil del usuario no fue encontrado.");
            }
            return doc.data();
        })
        .then((data) => {
            if (!data.approved) {
                auth.signOut();
                throw new Error("Tu cuenta aún no ha sido aprobada por el administrador.");
            }
            
            playSuccessSound();
            
            // Set state
            state.currentUser = {
                uid: data.uid,
                email: data.email,
                kidName: data.kidName,
                role: data.role
            };
            state.stars = data.stars || 0;
            state.coins = data.coins || 0;
            state.unlockedFriends = data.unlockedFriends || [];
            state.activeMascot = data.activeMascot || "🦁";
            
            // Update UI counters
            document.getElementById('star-count').textContent = state.stars;
            document.getElementById('coin-count').textContent = state.coins;
            
            // Update User Greeting
            document.getElementById('kid-greeting-name').textContent = data.kidName || "pequeño lector";
            document.getElementById('user-display-name').textContent = data.role === 'admin' ? 'Admin' : (data.kidName || 'Aventurero');
            document.getElementById('user-status-display').style.display = 'flex';
            
            // Show Admin Tab if applicable
            document.getElementById('tab-admin').style.display = data.role === 'admin' ? 'inline-block' : 'none';
            
            // Hide Auth screen, show Menu screen
            showScreen('screen-menu');
            
            // Mostrar encabezado al loguearse correctamente
            const appHeader = document.querySelector('.app-header');
            if (appHeader) appHeader.style.display = 'flex';
            
            // Si el niño no tiene nombre guardado y no es el administrador, pedirle el nombre
            if ((!data.kidName || data.kidName === "") && data.role !== 'admin') {
                document.getElementById('modal-kid-name').style.display = 'flex';
            }
            
            // Initial mascot setup
            const avatar = document.getElementById('mascot-avatar');
            if (avatar) avatar.textContent = state.activeMascot;
            const menuMascot = document.getElementById('menu-mascot');
            if (menuMascot) menuMascot.textContent = state.activeMascot;
            
            speakText("¡Hola, " + data.kidName + "! Qué bueno verte listo para jugar.");
            triggerMascotReaction('idle');
        })
        .catch((error) => {
            console.error(error);
            errorBox.textContent = error.message || "Usuario o contraseña incorrectos.";
            errorBox.style.display = 'block';
            playFailSound();
        });
    }
}

function logout() {
    playTapSound();
    auth.signOut();
    state.currentUser = null;
    document.getElementById('user-status-display').style.display = 'none';
    document.getElementById('tab-admin').style.display = 'none';
    
    // Reset counters visually
    document.getElementById('star-count').textContent = '0';
    document.getElementById('coin-count').textContent = '0';
    
    // Switch back to login
    showScreen('screen-auth');
    
    // Ocultar encabezado en login
    const appHeader = document.querySelector('.app-header');
    if (appHeader) appHeader.style.display = 'none';
}

function saveUserProgress() {
    if (!state.currentUser || !state.currentUser.uid) return;
    
    db.collection('users').doc(state.currentUser.uid).update({
        stars: state.stars,
        coins: state.coins,
        unlockedFriends: state.unlockedFriends,
        activeMascot: state.activeMascot
    })
    .then(() => console.log("Progreso guardado en Firebase Cloud"))
    .catch(err => console.error("Error al guardar progreso en Firebase:", err));
}

// Sobrescribir addStar y addCoin para guardar progreso en el servidor
window.addStar = function() {
    state.stars++;
    document.getElementById('star-count').textContent = state.stars;
    saveUserProgress();
};

window.addCoin = function(amount = 1) {
    state.coins += amount;
    document.getElementById('coin-count').textContent = state.coins;
    saveUserProgress();
};

// --- TIENDA DE AMIGOS DE LEO ---
const LEO_FRIENDS = [
    { key: "🦁", name: "Leo el León", cost: 0 },
    { key: "🐼", name: "Copito", cost: 100 },
    { key: "🐒", name: "Coco", cost: 200 },
    { key: "🐱", name: "Bigotes", cost: 300 },
    { key: "🐶", name: "Toby", cost: 400 },
    { key: "🦊", name: "Risitos", cost: 500 }
];

function renderFriendsShop() {
    const grid = document.getElementById('friends-shop-grid');
    if (!grid) return;
    grid.innerHTML = '';
    
    LEO_FRIENDS.forEach(f => {
        const isUnlocked = f.cost === 0 || state.unlockedFriends.includes(f.key);
        const isActive = state.activeMascot === f.key;
        
        const card = document.createElement('div');
        card.className = `friend-card ${isActive ? 'selected-active' : ''}`;
        
        let buttonHtml = '';
        if (isActive) {
            buttonHtml = `<button class="btn-option" disabled style="background-color: var(--color-green); color: white;">Seleccionado ✅</button>`;
        } else if (isUnlocked) {
            buttonHtml = `<button class="btn-option unlocked" onclick="selectMascot('${f.key}')">Seleccionar</button>`;
        } else {
            buttonHtml = `<button class="btn-option buy" onclick="unlockFriend('${f.key}', ${f.cost})">Desbloquear 🪙 ${f.cost}</button>`;
        }
        
        card.innerHTML = `
            ${isActive ? '<span class="friend-badge">Activo</span>' : ''}
            <div class="friend-avatar">${f.key}</div>
            <h4 class="friend-name">${f.name}</h4>
            <div style="width: 100%; display: flex; justify-content: center;">
                ${buttonHtml}
            </div>
        `;
        
        grid.appendChild(card);
    });
}

function selectMascot(friendKey) {
    playTapSound();
    state.activeMascot = friendKey;
    
    // Actualizar avatares visuales
    const avatar = document.getElementById('mascot-avatar');
    if (avatar) avatar.textContent = friendKey;
    const menuMascot = document.getElementById('menu-mascot');
    if (menuMascot) menuMascot.textContent = friendKey;
    
    speakText("¡Hola! Ahora tu compañero es el " + LEO_FRIENDS.find(f => f.key === friendKey).name);
    
    saveUserProgress();
    renderFriendsShop();
}

function unlockFriend(friendKey, cost) {
    if (state.coins < cost) {
        playFailSound();
        speakText("No tienes suficientes monedas. ¡Sigue jugando para conseguir más!");
        return;
    }
    
    playSuccessSound();
    state.coins -= cost;
    document.getElementById('coin-count').textContent = state.coins;
    
    state.unlockedFriends.push(friendKey);
    state.activeMascot = friendKey;
    
    // Actualizar avatares visuales
    const avatar = document.getElementById('mascot-avatar');
    if (avatar) avatar.textContent = friendKey;
    const menuMascot = document.getElementById('menu-mascot');
    if (menuMascot) menuMascot.textContent = friendKey;
    
    const friendName = LEO_FRIENDS.find(f => f.key === friendKey).name;
    
    if (typeof confetti === 'function') {
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    }
    
    speakText("¡Muy bien! Desbloqueamos al " + friendName + ".");
    
    saveUserProgress();
    renderFriendsShop();
}

// --- PANEL DE ADMINISTRADOR ---
function loadAdminPending() {
    const list = document.getElementById('admin-pending-list');
    if (!list) return;
    
    db.collection('users').where('approved', '==', false).get()
    .then((querySnapshot) => {
        list.innerHTML = '';
        if (querySnapshot.empty) {
            list.innerHTML = `<p style="text-align: center; color: #7F8C8D; font-weight: bold; margin: 20px 0;">🎉 No hay registros pendientes de aprobación.</p>`;
            return;
        }
        
        querySnapshot.forEach((doc) => {
            const u = doc.data();
            const row = document.createElement('div');
            row.style.display = 'flex';
            row.style.justifyContent = 'space-between';
            row.style.alignItems = 'center';
            row.style.borderBottom = '1px solid #ECEFF1';
            row.style.padding = '10px 0';
            
            row.innerHTML = `
                <div>
                    <strong style="color: #2C3E50;">👦 ${u.kidName}</strong>
                    <div style="font-size: 0.85rem; color: #7F8C8D;">✉️ ${u.email}</div>
                </div>
                <button class="btn-option" style="background-color: var(--color-green); color: white;" onclick="approveUser('${u.uid}')">Aprobar ✅</button>
            `;
            list.appendChild(row);
        });
    })
    .catch(err => {
        console.error(err);
        list.innerHTML = `<p style="text-align: center; color: #C62828; font-weight: bold;">Error al conectar con Firestore.</p>`;
    });
}

function approveUser(uid) {
    playTapSound();
    db.collection('users').doc(uid).update({ approved: true })
    .then(() => {
        playSuccessSound();
        loadAdminPending();
    })
    .catch(err => {
        console.error(err);
        playFailSound();
    });
}

window.confirmResetGameProgress = function() {
    playTapSound();
    const confirmReset = confirm("¿Estás seguro de que quieres reiniciar completamente el juego? Se borrará todo tu progreso (estrellas, monedas y compañeros rescatados).");
    if (confirmReset) {
        state.stars = 0;
        state.coins = 0;
        state.unlockedFriends = [];
        state.activeMascot = "🦁";
        
        document.getElementById('star-count').textContent = 0;
        document.getElementById('coin-count').textContent = 0;
        const avatar = document.getElementById('mascot-avatar');
        if (avatar) avatar.textContent = "🦁";
        const menuMascot = document.getElementById('menu-mascot');
        if (menuMascot) menuMascot.textContent = "🦁";

        localStorage.setItem('stars-reader', 0);
        localStorage.setItem('coins-reader', 0);
        
        if (auth.currentUser) {
            db.collection('users').doc(auth.currentUser.uid).update({
                stars: 0,
                coins: 0,
                unlockedFriends: [],
                activeMascot: "🦁"
            })
            .then(() => {
                playSuccessSound();
                alert("¡Progreso reiniciado con éxito!");
                location.reload();
            })
            .catch(err => {
                console.error("Error al actualizar Firebase:", err);
                alert("Progreso reiniciado.");
                location.reload();
            });
        } else {
            playSuccessSound();
            alert("¡Progreso reiniciado con éxito!");
            location.reload();
        }
    }
};

window.showWelcomeSplash = function() {
    playTapSound();
    
    // Evitar duplicados del modal
    const oldModal = document.getElementById('intro-player-modal');
    if (oldModal) oldModal.remove();

    const welcomeMessage = "¡Hola! Bienvenido a Leo Aventuras. Espero que aprendas y refuerces tu lectura con estos divertidos juegos y pruebas que pasarás. ¡Junta muchas monedas para rescatar a los compañeros de Leo el león y juntar a la pandilla completa!";

    const modal = document.createElement('div');
    modal.id = 'intro-player-modal';
    modal.className = 'player-modal-overlay';
    modal.innerHTML = `
        <div class="player-container">
            <div class="player-header">
                <span class="player-title">🎬 Leo Aventuras - Introducción</span>
                <button class="player-close-btn" onclick="closeIntroPlayer()">×</button>
            </div>
            <div class="player-screen-area">
                <img src="welcome.png" id="player-img" alt="Intro Animada" class="player-screen-img" style="transition: transform 11.5s linear;">
                <div class="player-screen-overlay-play" id="player-center-play-btn">
                    <span class="center-play-icon">▶</span>
                </div>
            </div>
            <div class="player-controls">
                <div class="player-progress-container" id="player-progress-bar">
                    <div class="player-progress-fill" id="player-progress-fill"></div>
                </div>
                <div class="player-buttons-row">
                    <div class="player-left-controls">
                        <button class="player-ctrl-btn" id="player-play-btn">▶</button>
                        <span class="player-time" id="player-time-display">0:00 / 0:11</span>
                    </div>
                    <div class="player-right-controls">
                        <button class="player-ctrl-btn" id="player-audio-btn">🔊</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    setTimeout(() => {
        modal.classList.add('active');
    }, 50);

    const playBtn = document.getElementById('player-play-btn');
    const centerPlayBtn = document.getElementById('player-center-play-btn');
    const progressFill = document.getElementById('player-progress-fill');
    const img = document.getElementById('player-img');
    const timeDisplay = document.getElementById('player-time-display');
    const audioBtn = document.getElementById('player-audio-btn');

    let isPlaying = false;
    const duration = 11.5; // Segundos de duración del audio de bienvenida completo

    const startPlayback = () => {
        if (isPlaying) return;
        isPlaying = true;
        centerPlayBtn.style.opacity = '0';
        setTimeout(() => { centerPlayBtn.style.display = 'none'; }, 300);
        playBtn.textContent = '⏸';
        img.classList.add('zooming');
        
        playIntroSound();
        // Reproducir el mensaje hablado de bienvenida después del tono arpeggio
        setTimeout(() => {
            if (isPlaying) speakText(welcomeMessage);
        }, 800);

        const start = Date.now();
        window.playerProgressInterval = setInterval(() => {
            const elapsed = (Date.now() - start) / 1000;
            const pct = Math.min(100, (elapsed / duration) * 100);
            progressFill.style.width = `${pct}%`;
            
            const floorSec = Math.floor(elapsed);
            const paddedSec = floorSec < 10 ? `0${floorSec}` : floorSec;
            timeDisplay.textContent = `0:${Math.min(11, paddedSec)} / 0:11`;

            if (elapsed >= duration) {
                stopPlayback();
            }
        }, 100);
    };

    const stopPlayback = () => {
        clearInterval(window.playerProgressInterval);
        window.speechSynthesis.cancel(); // Detener el audio de inmediato al pausar
        isPlaying = false;
        playBtn.textContent = '▶';
        centerPlayBtn.style.display = 'flex';
        setTimeout(() => { centerPlayBtn.style.opacity = '1'; }, 50);
        img.classList.remove('zooming');
        progressFill.style.width = '0%';
        timeDisplay.textContent = '0:00 / 0:11';
    };

    playBtn.onclick = () => {
        playTapSound();
        if (isPlaying) {
            stopPlayback();
        } else {
            startPlayback();
        }
    };

    centerPlayBtn.onclick = () => {
        playTapSound();
        startPlayback();
    };

    audioBtn.onclick = () => {
        playTapSound();
        window.speechSynthesis.cancel();
        speakText(welcomeMessage);
    };

    // Auto-reproducción al abrir
    setTimeout(startPlayback, 400);
};

window.closeIntroPlayer = function() {
    playTapSound();
    const modal = document.getElementById('intro-player-modal');
    if (modal) {
        clearInterval(window.playerProgressInterval);
        window.speechSynthesis.cancel(); // Detener cualquier reproducción en curso
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
};

// Abrir modal de cambiar nombre del niño
window.openChangeNameModal = function() {
    playTapSound();
    const input = document.getElementById('input-kid-name');
    if (input) {
        input.value = (state.currentUser && state.currentUser.kidName) ? state.currentUser.kidName : "";
    }
    const modal = document.getElementById('modal-kid-name');
    if (modal) {
        modal.style.display = 'flex';
    }
};

// Guardar nombre del niño
window.saveKidName = function() {
    const input = document.getElementById('input-kid-name');
    const name = input.value.trim();
    if (!name) {
        speakText("Por favor, escribe tu nombre para empezar.");
        return;
    }
    
    playTapSound();
    
    const user = auth.currentUser;
    if (user) {
        db.collection('users').doc(user.uid).update({ kidName: name })
        .then(() => {
            state.currentUser.kidName = name;
            document.getElementById('kid-greeting-name').textContent = name;
            document.getElementById('user-display-name').textContent = name;
            document.getElementById('modal-kid-name').style.display = 'none';
            playSuccessSound();
            speakText("¡Muy bien, " + name + "! Vamos a divertirnos con Leo el León.");
        })
        .catch(err => {
            console.error("Error al guardar nombre:", err);
            // Fallback local por seguridad
            state.currentUser.kidName = name;
            document.getElementById('kid-greeting-name').textContent = name;
            document.getElementById('modal-kid-name').style.display = 'none';
        });
    } else {
        document.getElementById('modal-kid-name').style.display = 'none';
    }
};

// --- FUNCIÓN DE SONIDO DE INTRO (ARPEGIO CORTO ALEGRE) ---
function playIntroSound() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        if (ctx.state === 'suspended') {
            ctx.resume();
        }
        const playTone = (freq, type, duration, startTime) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, startTime);
            gain.gain.setValueAtTime(0.1, startTime);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(startTime);
            osc.stop(startTime + duration);
        };
        const now = ctx.currentTime;
        playTone(261.63, 'triangle', 0.15, now); // C4
        playTone(329.63, 'triangle', 0.15, now + 0.08); // E4
        playTone(392.00, 'triangle', 0.15, now + 0.16); // G4
        playTone(523.25, 'sine', 0.35, now + 0.24); // C5
    } catch (e) {
        console.warn("AudioContext blocked or not supported:", e);
    }
}

// --- Inicializar Eventos y Lector de Pantalla Interactivo ---
document.addEventListener('DOMContentLoaded', () => {
    // Lógica para ocultar el Splash Screen con transición
    const splash = document.getElementById('app-splash-screen');
    if (splash) {
        const handleFirstInteraction = () => {
            playIntroSound();
            document.removeEventListener('click', handleFirstInteraction);
            document.removeEventListener('touchstart', handleFirstInteraction);
        };
        document.addEventListener('click', handleFirstInteraction);
        document.addEventListener('touchstart', handleFirstInteraction);

        setTimeout(() => {
            splash.classList.add('fade-out');
            playIntroSound(); // Intentar reproducir automáticamente
            setTimeout(() => {
                splash.remove();
            }, 800);
        }, 3000);
    }

    generateAllLevels();
    populateVoiceList();
    document.getElementById('star-count').textContent = state.stars;
    document.getElementById('coin-count').textContent = state.coins;

    // --- Persistencia de Sesión de Firebase ---
    auth.onAuthStateChanged((user) => {
        if (user) {
            // Usuario ya tiene sesión iniciada, restaurar perfil
            db.collection('users').doc(user.uid).get()
            .then((doc) => {
                if (doc.exists) {
                    const data = doc.data();
                    if (data.approved) {
                        state.currentUser = {
                            uid: data.uid,
                            email: data.email,
                            kidName: data.kidName,
                            role: data.role
                        };
                        state.stars = data.stars || 0;
                        state.coins = data.coins || 0;
                        state.unlockedFriends = data.unlockedFriends || [];
                        state.activeMascot = data.activeMascot || "🦁";
                        
                        document.getElementById('star-count').textContent = state.stars;
                        document.getElementById('coin-count').textContent = state.coins;
                        document.getElementById('kid-greeting-name').textContent = data.kidName || "pequeño lector";
                        document.getElementById('user-display-name').textContent = data.role === 'admin' ? 'Admin' : (data.kidName || 'Aventurero');
                        document.getElementById('user-status-display').style.display = 'flex';
                        document.getElementById('tab-admin').style.display = data.role === 'admin' ? 'inline-block' : 'none';
                        
                        showScreen('screen-menu');
                        
                        const appHeader = document.querySelector('.app-header');
                        if (appHeader) appHeader.style.display = 'flex';
                        
                        const avatar = document.getElementById('mascot-avatar');
                        if (avatar) avatar.textContent = state.activeMascot;
                        const menuMascot = document.getElementById('menu-mascot');
                        if (menuMascot) menuMascot.textContent = state.activeMascot;
                        
                        if ((!data.kidName || data.kidName === "") && data.role !== 'admin') {
                            document.getElementById('modal-kid-name').style.display = 'flex';
                        }
                        
                        renderFriendsShop();
                        history.pushState({page: 'menu'}, '');
                    } else {
                        auth.signOut();
                    }
                }
            })
            .catch(err => console.error("Error al restaurar sesión:", err));
        } else {
            history.pushState({page: 'login'}, '');
        }
    });

    // --- Prevenir salida con botón atrás físico o de gestos en móviles ---
    window.addEventListener('popstate', (e) => {
        if (state.currentUser) {
            const activeScreen = document.querySelector('.screen.active');
            if (activeScreen && activeScreen.id !== 'screen-menu') {
                playTapSound();
                // Si está en un juego, regresar al menú principal en vez de salir de la web
                showScreen('screen-menu');
                history.pushState({page: 'menu'}, '');
            } else {
                history.pushState({page: 'menu'}, '');
            }
        } else {
            history.pushState({page: 'login'}, '');
        }
    });

    // Ocultar encabezado en el inicio (pantalla de login activa)
    const appHeader = document.querySelector('.app-header');
    if (appHeader) appHeader.style.display = 'none';

    // Configurar audio de bienvenida para la pantalla de inicio
    const btnWelcomeAudio = document.getElementById('btn-welcome-audio');
    if (btnWelcomeAudio) {
        const welcomeMessage = "¡Hola! Bienvenido a Leo Aventuras. Espero que aprendas y refuerces tu lectura con estos divertidos juegos y pruebas que pasarás. ¡Junta muchas monedas para rescatar a los compañeros de Leo el león y juntar a la pandilla completa!";
        btnWelcomeAudio.onclick = (e) => {
            e.stopPropagation();
            playTapSound();
            speakText(welcomeMessage);
        };
        // Auto-reproducir en el primer clic/toque en la pantalla de autenticación para burlar bloqueos de auto-play del navegador
        let playedWelcome = false;
        const screenAuth = document.getElementById('screen-auth');
        if (screenAuth) {
            screenAuth.addEventListener('click', () => {
                if (!playedWelcome && (!auth.currentUser)) {
                    playedWelcome = true;
                    // Pequeño retardo para no pisar el sonido de tap del clic
                    setTimeout(() => speakText(welcomeMessage), 300);
                }
            });
        }
    }

    // Configurar botones de Saltar Palabra
    const skipAction = () => {
        playTapSound();
        nextRound();
    };
    document.getElementById('btn-skip-sopa').onclick = skipAction;
    document.getElementById('btn-skip-constructor').onclick = skipAction;
    document.getElementById('btn-skip-enunciados').onclick = skipAction;
    document.getElementById('btn-skip-standard').onclick = skipAction;

    // Configurar interacciones con la mascota virtual (León Leo)
    const mascotBox = document.querySelector('.mascot-character-box');
    if (mascotBox) {
        mascotBox.onclick = () => {
            playTapSound();
            triggerMascotReaction('celebrate');
            
            const kidName = (state.currentUser && state.currentUser.kidName) ? state.currentUser.kidName : "pequeño lector";
            const phrases = [
                `¡Hola, ${kidName}! ¿Qué nivel vamos a jugar hoy?`,
                `¡Eres un campeón, ${kidName}! Me encanta aprender a leer contigo.`,
                `¡Leo Aventuras es muy divertido contigo, ${kidName}! ¡Sigue así!`,
                `¡Me alegra mucho verte jugar hoy, ${kidName}! ¡Vamos a ganar muchas monedas!`,
                `¡Qué inteligente eres, ${kidName}! Haces un excelente trabajo.`,
                `¡Grrr! ¡Hola, ${kidName}! ¡Soy Leo el León y soy tu amigo!`
            ];
            
            const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
            const bubble = document.getElementById('mascot-dialog-bubble');
            if (bubble) {
                bubble.textContent = randomPhrase;
            }
            speakText(randomPhrase);
        };
    }

    // Configurar banners de instrucciones e indicaciones interactivos
    setTimeout(() => {
        document.querySelectorAll('.globos-target-banner, #mascot-dialog-bubble, .review-title, #game-title, .exploration-info-box p').forEach(el => {
            el.style.cursor = 'pointer';
            el.title = "Toca para escuchar";
            el.onclick = () => {
                playTapSound();
                speakText(el.textContent);
            };
        });
    }, 1000);

    document.getElementById('btn-exit-globos').onclick = () => {
        endLluviaGlobos(false);
    };

    document.getElementById('btn-exit-globos-selector').onclick = () => {
        playTapSound();
        showScreen('screen-menu');
        switchMenuTab('juegos');
    };

    document.getElementById('btn-exit-trucks').onclick = () => {
        endTrucksLevel(false);
    };

    document.getElementById('btn-exit-trucks-selector').onclick = () => {
        playTapSound();
        showScreen('screen-menu');
        switchMenuTab('juegos');
    };

    document.getElementById('btn-exit-memo').onclick = () => {
        endMemoLevel(false);
    };

    document.getElementById('btn-exit-memo-selector').onclick = () => {
        playTapSound();
        showScreen('screen-menu');
        switchMenuTab('juegos');
    };

    document.getElementById('btn-home-logo').onclick = () => {
        if (state.currentLevel === "globos") {
            globosState.gameRunning = false;
            clearInterval(globosState.spawnInterval);
            clearInterval(globosState.fallInterval);
        }
        if (state.currentLevel === "trucks") {
            trucksState.gameRunning = false;
        }
        if (state.currentLevel === "memorama") {
            memoState.gameRunning = false;
        }
        showScreen('screen-menu');
    };
    document.getElementById('btn-back-menu').onclick = () => {
        if (state.currentLevel === "globos") {
            globosState.gameRunning = false;
            clearInterval(globosState.spawnInterval);
            clearInterval(globosState.fallInterval);
        }
        if (state.currentLevel === "trucks") {
            trucksState.gameRunning = false;
        }
        if (state.currentLevel === "memorama") {
            memoState.gameRunning = false;
        }
        showScreen('screen-menu');
    };
    document.getElementById('btn-repeat-sound').onclick = repeatPromptAudio;

    // Configurar Cambio del Selector de Voces
    const voiceSelect = document.getElementById('voice-select');
    voiceSelect.onchange = (e) => {
        selectedVoiceName = e.target.value;
        localStorage.setItem('selected-voice-name', selectedVoiceName);
        playTapSound();
        speakText("¡Hola! Me gusta esta voz.");
    };

    // --- ACCESIBILIDAD POR VOZ EN TIEMPO REAL ---
    const speakableSelectors = [
        '.welcome-box h1',
        '.welcome-box p',
        '.game-instructions',
        '.review-title',
        '#game-title',
        '.exploration-info-box p'
    ];

    document.body.addEventListener('click', (e) => {
        speakableSelectors.forEach(selector => {
            if (e.target.matches(selector) || e.target.closest(selector)) {
                const targetText = e.target.textContent || e.target.closest(selector).textContent;
                playTapSound();
                speakText(targetText);
            }
        });
    });
});

// --- REGISTRO DE SERVICE WORKER PARA PWA ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
        .then(reg => console.log('Service Worker registrado con éxito:', reg.scope))
        .catch(err => console.warn('Fallo al registrar Service Worker:', err));
    });
}

// --- CONTROL DE INSTALACIÓN PWA ---
let deferredPrompt;
const btnInstallPwa = document.getElementById('btn-install-pwa');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (btnInstallPwa) {
        btnInstallPwa.style.display = 'block';
    }
});

if (btnInstallPwa) {
    btnInstallPwa.addEventListener('click', () => {
        if (!deferredPrompt) return;
        playTapSound();
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('El usuario aceptó instalar la app.');
            }
            btnInstallPwa.style.display = 'none';
            deferredPrompt = null;
        });
    });
}

window.addEventListener('appinstalled', () => {
    console.log('Leo Aventuras ha sido instalada correctamente.');
    if (btnInstallPwa) {
        btnInstallPwa.style.display = 'none';
    }
});

