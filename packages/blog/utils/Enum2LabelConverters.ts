export function testConfigLabels(enumValue:string):string {
    switch(enumValue) {
        case "NO_TIME_LIMIT": return "Aucune limite de temps";
        case "SOFT_TIME_LIMIT": return "Indicateur de temps";
        case "HARD_TIME_LIMIT": return "Limite de temps";
        case "MULTIPLE_CHOICES": return "Questions à choix multiples";
        case "DIRECT_INPUT": return "Questions à saisie du résultat";
        default:
            // return unconverted value if not known
            return enumValue;
    }
} 