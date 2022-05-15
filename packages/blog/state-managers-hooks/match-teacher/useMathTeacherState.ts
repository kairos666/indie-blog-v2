import create from 'zustand';

export interface MathTeacherState {
    activityState: "LEARN"|"TEST"
    selectedTables: number[]
    availableTables:number[]
    changeGlobalState: (newActivityState:"LEARN"|"TEST") => void
    toggleSelectedTable: (toggleMainParam: number) => void
} 

export const useMathTeacherState = create<MathTeacherState>((set, get) => ({
    activityState: "LEARN",
    selectedTables: [1],
    availableTables: new Array(10).fill(null).map((_, index) => index + 1),
    changeGlobalState: (newActivityState:"LEARN"|"TEST") => set({ activityState: newActivityState }),
    toggleSelectedTable: (toggleMainParam) => {
        const currentSelectedTables = get().selectedTables;
        const isAlreadySelected = currentSelectedTables.includes(toggleMainParam);

        if(isAlreadySelected) {
            // already exists --> remove
            set({ selectedTables: currentSelectedTables.filter(selectedItem => selectedItem !== toggleMainParam).sort((a, b) => (a < b) ? -1 : (a > b) ? 1 : 0) });
        } else {
            // not yet selected --> add
            set({ selectedTables: [...currentSelectedTables, toggleMainParam].sort((a, b) => (a < b) ? -1 : (a > b) ? 1 : 0) });
        }        
    }
}))