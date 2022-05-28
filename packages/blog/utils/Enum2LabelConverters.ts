export function testConfigLabels(enumValue:string):string {
    switch(enumValue) {
        case "NO_TIME_LIMIT": return "Aucune limite de temps";
        case "SOFT_TIME_LIMIT": return "Limite de temps";
        case "HARD_TIME_LIMIT": return "Limite de temps par questions";
        case "MULTIPLE_CHOICES": return "Questions à choix multiples";
        case "DIRECT_INPUT": return "Questions à saisie du résultat";
        default:
            // return unconverted value if not known
            return enumValue;
    }
}

export function testStateLabels(enumValue:string):string {
    switch(enumValue) {
        case "PRE_TEST": return "Test non démarré";
        case "RUN_TEST": return "Test en cours";
        case "TEST_RESULTS": return "Résultats du dernier test";
        
        default:
            // return unconverted value if not known
            return enumValue;
    }
} 