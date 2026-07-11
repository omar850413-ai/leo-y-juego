// Base de datos de palabras estructurada para "Leo y Juego"

// Consonantes y su pronunciación fonética híbrida universal definitiva (garantiza el sonido correcto en voces tanto de inglés como de español)
const PHONETIC_ALPHABET = {
    "B": { phoneticName: "be", syllables: ["BA", "BE", "BI", "BO", "BU"] },
    "C": { phoneticName: "ce", syllables: ["CA", "CE", "CI", "CO", "CU"] },
    "D": { phoneticName: "de", syllables: ["DA", "DE", "DI", "DO", "DU"] },
    "F": { phoneticName: "efe", syllables: ["FA", "FE", "FI", "FO", "FU"] },
    "G": { phoneticName: "ge", syllables: ["GA", "GE", "GI", "GO", "GU"] },
    "J": { phoneticName: "jota", syllables: ["JA", "JE", "JI", "JO", "JU"] },
    "K": { phoneticName: "ka", syllables: ["KA", "KE", "KI", "KO", "KU"] },
    "L": { phoneticName: "ele", syllables: ["LA", "LE", "LI", "LO", "LU"] },
    "M": { phoneticName: "eme", syllables: ["MA", "ME", "MI", "MO", "MU"] },
    "N": { phoneticName: "ene", syllables: ["NA", "NE", "NI", "NO", "NU"] },
    "Ñ": { phoneticName: "eñe", syllables: ["ÑA", "ÑE", "ÑI", "ÑO", "ÑU"] },
    "P": { phoneticName: "pe", syllables: ["PA", "PE", "PI", "PO", "PU"] },
    "Q": { phoneticName: "cu", syllables: ["QUE", "QUI"] },
    "R": { phoneticName: "erre", syllables: ["RA", "RE", "RI", "RO", "RU"] },
    "S": { phoneticName: "ese", syllables: ["SA", "SE", "SI", "SO", "SU"] },
    "T": { phoneticName: "te", syllables: ["TA", "TE", "TI", "TO", "TU"] },
    "V": { phoneticName: "ve", syllables: ["VA", "VE", "VI", "VO", "VU"] },
    "X": { phoneticName: "equis", syllables: ["XA", "XE", "XI", "XO", "XU"] },
    "Y": { phoneticName: "ye", syllables: ["YA", "YE", "YI", "YO", "YU"] },
    "Z": { phoneticName: "zeta", syllables: ["ZA", "ZE", "ZI", "ZO", "ZU"] }
};

// Base de datos de palabras con Emojis
const MASTER_WORDS = [
    // A
    { word: "ÁRBOL", emoji: "🌳", level: 3, letter: "A" },
    { word: "AVIÓN", emoji: "✈️", level: 4, letter: "A" },
    { word: "ABEJA", emoji: "🐝", level: 4, letter: "A" },
    { word: "ARAÑA", emoji: "🕷️", level: 4, letter: "A" },
    { word: "ANILLO", emoji: "💍", level: 4, letter: "A" },
    { word: "ARCOIRIS", emoji: "🌈", level: 4, letter: "A" },
    { word: "AGUA", emoji: "💧", level: 3, letter: "A" },

    // B
    { word: "BOTA", emoji: "🥾", level: 3, letter: "B" },
    { word: "BOLA", emoji: "⚽", level: 3, letter: "B" },
    { word: "BOSQUE", emoji: "🌲", level: 4, letter: "B" },
    { word: "BARCO", emoji: "⛵", level: 4, letter: "B" },
    { word: "BALLENA", emoji: "🐋", level: 4, letter: "B" },
    { word: "BUHO", emoji: "🦉", level: 3, letter: "B" },
    { word: "BANANA", emoji: "🍌", level: 4, letter: "B" },
    { word: "BEBÉ", emoji: "👶", level: 3, letter: "B" },
    { word: "BOTE", emoji: "🛶", level: 3, letter: "B" },
    { word: "BOTÓN", emoji: "🔘", level: 4, letter: "B" },

    // C
    { word: "CASA", emoji: "🏠", level: 3, letter: "C" },
    { word: "CAMA", emoji: "🛏️", level: 3, letter: "C" },
    { word: "COLA", emoji: "🐕", level: 3, letter: "C" },
    { word: "COCO", emoji: "🥥", level: 3, letter: "C" },
    { word: "CARRO", emoji: "🚗", level: 4, letter: "C" },
    { word: "CONEJO", emoji: "🐇", level: 4, letter: "C" },
    { word: "CABALLO", emoji: "🐎", level: 4, letter: "C" },
    { word: "CEBOLLA", emoji: "🧅", level: 4, letter: "C" },
    { word: "CEREZA", emoji: "🍒", level: 4, letter: "C" },
    { word: "CUNA", emoji: "🚼", level: 3, letter: "C" },
    { word: "CAMINO", emoji: "🛣️", level: 3, letter: "C" },

    // D
    { word: "DADO", emoji: "🎲", level: 3, letter: "D" },
    { word: "DEDO", emoji: "👉", level: 3, letter: "D" },
    { word: "DIENTE", emoji: "🦷", level: 4, letter: "D" },
    { word: "DELFÍN", emoji: "🐬", level: 4, letter: "D" },
    { word: "DINOSAURIO", emoji: "🦕", level: 4, letter: "D" },
    { word: "DULCE", emoji: "🍬", level: 4, letter: "D" },
    { word: "DOCTOR", emoji: "👨‍⚕️", level: 4, letter: "D" },
    { word: "DUENDE", emoji: "🧝", level: 4, letter: "D" },
    { word: "DIADEMA", emoji: "👑", level: 4, letter: "D" },

    // E
    { word: "ELEFANTE", emoji: "🐘", level: 4, letter: "E" },
    { word: "ESTRELLA", emoji: "⭐", level: 4, letter: "E" },
    { word: "ESPEJO", emoji: "🪞", level: 4, letter: "E" },
    { word: "ESCOBA", emoji: "🧹", level: 4, letter: "E" },
    { word: "ESCUELA", emoji: "🏫", level: 4, letter: "E" },
    { word: "ERIZO", emoji: "🦔", level: 4, letter: "E" },
    { word: "ENCHUFE", emoji: "🔌", level: 4, letter: "E" },

    // F
    { word: "FOCA", emoji: "🦭", level: 3, letter: "F" },
    { word: "FUEGO", emoji: "🔥", level: 4, letter: "F" },
    { word: "FLOR", emoji: "🌸", level: 3, letter: "F" },
    { word: "FOTO", emoji: "📷", level: 3, letter: "F" },
    { word: "FRUTA", emoji: "🍎", level: 4, letter: "F" },
    { word: "FLAUTA", emoji: "🪈", level: 4, letter: "F" },
    { word: "FANTASMA", emoji: "👻", level: 4, letter: "F" },
    { word: "FIDEOS", emoji: "🍜", level: 4, letter: "F" },
    { word: "FARO", emoji: "🚨", level: 3, letter: "F" },

    // G
    { word: "GATO", emoji: "🐱", level: 3, letter: "G" },
    { word: "GOMA", emoji: "🧼", level: 3, letter: "G" },
    { word: "GALLINA", emoji: "🐔", level: 4, letter: "G" },
    { word: "GORILA", emoji: "🦍", level: 4, letter: "G" },
    { word: "GUITARRA", emoji: "🎸", level: 4, letter: "G" },
    { word: "GLOBO", emoji: "🎈", level: 4, letter: "G" },
    { word: "GUSANO", emoji: "🐛", level: 4, letter: "G" },
    { word: "GORRA", emoji: "🧢", level: 4, letter: "G" },
    { word: "GALLETA", emoji: "🍪", level: 4, letter: "G" },

    // H
    { word: "HIELO", emoji: "🧊", level: 4, letter: "H" },
    { word: "HUEVO", emoji: "🥚", level: 4, letter: "H" },
    { word: "HOJA", emoji: "🍃", level: 3, letter: "H" },
    { word: "HORMIGA", emoji: "🐜", level: 4, letter: "H" },
    { word: "HELADO", emoji: "🍦", level: 4, letter: "H" },
    { word: "HUESO", emoji: "🦴", level: 4, letter: "H" },
    { word: "HIPOPOTAMO", emoji: "🦛", level: 4, letter: "H" },
    { word: "HUMO", emoji: "💨", level: 3, letter: "H" },

    // I
    { word: "IMÁN", emoji: "⚓", level: 3, letter: "I" },
    { word: "IGLÚ", emoji: "❄️", level: 3, letter: "I" },
    { word: "IGLESIA", emoji: "⛪", level: 4, letter: "I" },
    { word: "IGUANA", emoji: "🦎", level: 4, letter: "I" },
    { word: "ISLA", emoji: "🏝️", level: 3, letter: "I" },

    // J
    { word: "JIRAFA", emoji: "🦒", level: 4, letter: "J" },
    { word: "JAULA", emoji: "🕸️", level: 4, letter: "J" },
    { word: "JUGUETE", emoji: "🧸", level: 4, letter: "J" },
    { word: "JABÓN", emoji: "🧼", level: 4, letter: "J" },
    { word: "JARRA", emoji: "🫖", level: 4, letter: "J" },
    { word: "JUGO", emoji: "🧃", level: 3, letter: "J" },
    { word: "JERINGA", emoji: "💉", level: 4, letter: "J" },

    // K
    { word: "KOALA", emoji: "🐨", level: 4, letter: "K" },
    { word: "KIWI", emoji: "🥝", level: 3, letter: "K" },
    { word: "KILO", emoji: "⚖️", level: 3, letter: "K" },
    { word: "KARAOKE", emoji: "🎤", level: 4, letter: "K" },

    // L
    { word: "LUNA", emoji: "🌙", level: 3, letter: "L" },
    { word: "LÁPIZ", emoji: "✏️", level: 4, letter: "L" },
    { word: "LIMA", emoji: "🍋", level: 3, letter: "L" },
    { word: "LOMO", emoji: "🥩", level: 3, letter: "L" },
    { word: "LEON", emoji: "🦁", level: 3, letter: "L" },
    { word: "LAGO", emoji: "🏞️", level: 3, letter: "L" },
    { word: "LECHE", emoji: "🥛", level: 4, letter: "L" },
    { word: "LIMON", emoji: "🍋", level: 4, letter: "L" },
    { word: "LANA", emoji: "🧶", level: 3, letter: "L" },
    { word: "LUPA", emoji: "🔍", level: 3, letter: "L" },
    { word: "LORO", emoji: "🦜", level: 3, letter: "L" },

    // M
    { word: "MANO", emoji: "✋", level: 3, letter: "M" },
    { word: "MESA", emoji: "🪑", level: 3, letter: "M" },
    { word: "MAMÁ", emoji: "👩", level: 3, letter: "M" },
    { word: "MONO", emoji: "🐒", level: 3, letter: "M" },
    { word: "MOTO", emoji: "🏍️", level: 3, letter: "M" },
    { word: "MANZANA", emoji: "🍎", level: 4, letter: "M" },
    { word: "MARIPOSA", emoji: "🦋", level: 4, letter: "M" },
    { word: "MOCHILA", emoji: "🎒", level: 4, letter: "M" },
    { word: "MARTILLO", emoji: "🔨", level: 4, letter: "M" },
    { word: "MUÑECA", emoji: "🪆", level: 4, letter: "M" },
    { word: "MIEL", emoji: "🍯", level: 3, letter: "M" },

    // N
    { word: "NIDO", emoji: "🪹", level: 3, letter: "N" },
    { word: "NUBE", emoji: "☁️", level: 3, letter: "N" },
    { word: "NARANJA", emoji: "🍊", level: 4, letter: "N" },
    { word: "NENE", emoji: "👶", level: 3, letter: "N" },
    { word: "NAVIO", emoji: "🚢", level: 4, letter: "N" },
    { word: "NIEVE", emoji: "❄️", level: 4, letter: "N" },
    { word: "NOTA", emoji: "🎵", level: 3, letter: "N" },
    { word: "NUEZ", emoji: "🥜", level: 3, letter: "N" },

    // Ñ
    { word: "ÑANDU", emoji: "🐦", level: 4, letter: "Ñ" },
    { word: "ÑAME", emoji: "🥔", level: 3, letter: "Ñ" },
    { word: "PIÑA", emoji: "🍍", level: 3, letter: "Ñ" },

    // O
    { word: "OSO", emoji: "🐻", level: 3, letter: "O" },
    { word: "OJO", emoji: "👁️", level: 3, letter: "O" },
    { word: "OLA", emoji: "🌊", level: 3, letter: "O" },
    { word: "OREJA", emoji: "👂", level: 4, letter: "O" },
    { word: "OVEJA", emoji: "🐑", level: 4, letter: "O" },
    { word: "OLLA", emoji: "🍲", level: 3, letter: "O" },

    // P
    { word: "PATO", emoji: "🦆", level: 3, letter: "P" },
    { word: "PAN", emoji: "🍞", level: 3, letter: "P" },
    { word: "PALA", emoji: "🧹", level: 3, letter: "P" },
    { word: "PELO", emoji: "💇", level: 3, letter: "P" },
    { word: "PAPA", emoji: "🥔", level: 3, letter: "P" },
    { word: "PERRO", emoji: "🐶", level: 4, letter: "P" },
    { word: "PELOTA", emoji: "⚽", level: 4, letter: "P" },
    { word: "PAYASO", emoji: "🤡", level: 4, letter: "P" },
    { word: "PUERTA", emoji: "🚪", level: 4, letter: "P" },
    { word: "PECES", emoji: "🐟", level: 4, letter: "P" },
    { word: "PANDA", emoji: "🐼", level: 4, letter: "P" },

    // Q
    { word: "QUESO", emoji: "🧀", level: 4, letter: "Q" },
    { word: "QUENA", emoji: "🪈", level: 4, letter: "Q" },
    { word: "QUIMICA", emoji: "🧪", level: 4, letter: "Q" },

    // R
    { word: "RANA", emoji: "🐸", level: 3, letter: "R" },
    { word: "RAMA", emoji: "🌿", level: 3, letter: "R" },
    { word: "RATÓN", emoji: "🐭", level: 4, letter: "R" },
    { word: "REGALO", emoji: "🎁", level: 4, letter: "R" },
    { word: "RELOJ", emoji: "⌚", level: 4, letter: "R" },
    { word: "ROSA", emoji: "🌹", level: 3, letter: "R" },
    { word: "ROPA", emoji: "👕", level: 3, letter: "R" },
    { word: "RADIO", emoji: "📻", level: 4, letter: "R" },

    // S
    { word: "SOL", emoji: "☀️", level: 3, letter: "S" },
    { word: "SOPA", emoji: "🥣", level: 3, letter: "S" },
    { word: "SAPO", emoji: "🐸", level: 3, letter: "S" },
    { word: "SILLA", emoji: "🪑", level: 4, letter: "S" },
    { word: "SIRENA", emoji: "🧜‍♀️", level: 4, letter: "S" },
    { word: "SANDIA", emoji: "🍉", level: 4, letter: "S" },
    { word: "SERPIENTE", emoji: "🐍", level: 4, letter: "S" },
    { word: "SAL", emoji: "🧂", level: 3, letter: "S" },

    // T
    { word: "TAZA", emoji: "☕", level: 3, letter: "T" },
    { word: "TINA", emoji: "🛁", level: 3, letter: "T" },
    { word: "TORO", emoji: "🐂", level: 3, letter: "T" },
    { word: "TREN", emoji: "🚂", level: 3, letter: "T" },
    { word: "TIGRE", emoji: "🐯", level: 4, letter: "T" },
    { word: "TORTUGA", emoji: "🐢", level: 4, letter: "T" },
    { word: "TELÉFONO", emoji: "📞", level: 4, letter: "T" },
    { word: "TOMATE", emoji: "🍅", level: 4, letter: "T" },
    { word: "TIJERA", emoji: "✂️", level: 4, letter: "T" },

    // U
    { word: "UVA", emoji: "🍇", level: 3, letter: "U" },
    { word: "UNO", emoji: "1️⃣", level: 3, letter: "U" },
    { word: "UNICORNIO", emoji: "🦄", level: 4, letter: "U" },

    // V
    { word: "VACA", emoji: "🐄", level: 3, letter: "V" },
    { word: "VASO", emoji: "🥛", level: 3, letter: "V" },
    { word: "VELA", emoji: "🕯️", level: 3, letter: "V" },
    { word: "VIENTO", emoji: "💨", level: 4, letter: "V" },
    { word: "VENTANA", emoji: "🪟", level: 4, letter: "V" },
    { word: "VOLCÁN", emoji: "🌋", level: 4, letter: "V" },
    { word: "VERDURA", emoji: "🥦", level: 4, letter: "V" },

    // X
    { word: "XILÓFONO", emoji: "🎹", level: 4, letter: "X" },

    // Y
    { word: "YATE", emoji: "🛥️", level: 3, letter: "Y" },
    { word: "YEMA", emoji: "🍳", level: 3, letter: "Y" },
    { word: "YOYO", emoji: "🪀", level: 3, letter: "Y" },
    { word: "YESO", emoji: "🩹", level: 3, letter: "Y" },
    { word: "YOGA", emoji: "🧘", level: 3, letter: "Y" },

    // Z
    { word: "ZAPATO", emoji: "👞", level: 4, letter: "Z" },
    { word: "ZANAHORIA", emoji: "🥕", level: 4, letter: "Z" },
    { word: "ZORRO", emoji: "🦊", level: 4, letter: "Z" },
    { word: "ZOO", emoji: "🦁", level: 3, letter: "Z" },

    // Palabras adicionales para ampliar el vocabulario
    { word: "AVENA", emoji: "🥣", level: 3, letter: "A" },
    { word: "ANCLA", emoji: "⚓", level: 3, letter: "A" },
    { word: "BOCA", emoji: "👄", level: 3, letter: "B" },
    { word: "BODA", emoji: "💒", level: 4, letter: "B" },
    { word: "COPA", emoji: "🏆", level: 3, letter: "C" },
    { word: "CINE", emoji: "🎬", level: 3, letter: "C" },
    { word: "DUNA", emoji: "🏜️", level: 3, letter: "D" },
    { word: "DAMA", emoji: "👩", level: 3, letter: "D" },
    { word: "ELFO", emoji: "🧝", level: 3, letter: "E" },
    { word: "FOCO", emoji: "💡", level: 3, letter: "F" },
    { word: "FIRMA", emoji: "✍️", level: 4, letter: "F" },
    { word: "GOTA", emoji: "💧", level: 3, letter: "G" },
    { word: "GAFAS", emoji: "👓", level: 4, letter: "G" },
    { word: "HADA", emoji: "🧚", level: 3, letter: "H" },
    { word: "HILO", emoji: "🧵", level: 3, letter: "H" },
    { word: "INVIERNO", emoji: "❄️", level: 4, letter: "I" },
    { word: "JOYA", emoji: "💎", level: 4, letter: "J" },
    { word: "LEÑA", emoji: "🪵", level: 3, letter: "L" },
    { word: "MANGO", emoji: "🥭", level: 3, letter: "M" },
    { word: "MULA", emoji: "🐴", level: 3, letter: "M" },
    { word: "NATA", emoji: "🧁", level: 3, letter: "N" },
    { word: "ORO", emoji: "🪙", level: 3, letter: "O" },
    { word: "PINO", emoji: "🌲", level: 3, letter: "P" },
    { word: "PERA", emoji: "🍐", level: 3, letter: "P" },
    { word: "RUIDO", emoji: "🔊", level: 3, letter: "R" },
    { word: "SALA", emoji: "🛋️", level: 3, letter: "S" },
    { word: "SUMA", emoji: "➕", level: 3, letter: "S" },
    { word: "TAPA", emoji: "🧢", level: 3, letter: "T" },
    { word: "UÑA", emoji: "💅", level: 3, letter: "U" },
    { word: "ZUMO", emoji: "🥤", level: 3, letter: "Z" },

    // Nuevas palabras para enriquecer las Sílabas Inversas
    { word: "ALTO", emoji: "🏃‍♂️", level: 3, letter: "A" },
    { word: "ALCE", emoji: "🦌", level: 3, letter: "A" },
    { word: "ANTENA", emoji: "📡", level: 3, letter: "A" },
    { word: "EMPANADA", emoji: "🥟", level: 4, letter: "E" },
    { word: "EMBUDO", emoji: "🏺", level: 3, letter: "E" },
    { word: "ESPADA", emoji: "🗡️", level: 4, letter: "E" },
    { word: "INDIO", emoji: "🪶", level: 3, letter: "I" },
    { word: "INSECTO", emoji: "🪲", level: 4, letter: "I" },
    { word: "ÓRGANO", emoji: "🎹", level: 4, letter: "O" },
    { word: "URNA", emoji: "🗳️", level: 3, letter: "U" }
];
