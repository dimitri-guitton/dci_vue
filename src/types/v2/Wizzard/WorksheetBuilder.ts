export interface WorksheetBuilder {
    steps: WorksheetBuilderStep[];
}

interface WorksheetBuilderStep {
    items: WorksheetBuilderItem[];
}

interface WorksheetBuilderItem {
    type: string;               // Type de l'input (number, text, select, checkbox)
    name: string;               // Nom de l'input
    label: string;              // Label de l'input
    required?: boolean;         // Indique si le champ est obligatoire
    selectList?: string;        // Nom de liste pour les inputs de type "select"
}

export enum WorksheetBuilderItemType {
    Select   = 'select',
    Text     = 'text',
    Number   = 'number',
    Checkbox = 'checkbox',
}
