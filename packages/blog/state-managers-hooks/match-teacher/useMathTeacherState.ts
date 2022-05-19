import create from 'zustand';

export interface MathTeacherState {
    activityState: "LEARN"|"TEST"
    changeGlobalState: (newActivityState:"LEARN"|"TEST") => void
    learn: {
        selectedTables: number[]
        availableTables:number[]
        toggleSelectedTable: (toggleMainParam: number) => void
    }
} 

export const useMathTeacherState = create<MathTeacherState>((set, get) => ({
    activityState: "LEARN",
    changeGlobalState: (newActivityState:"LEARN"|"TEST") => set({ activityState: newActivityState }),
    learn: {
        selectedTables: [1],
        availableTables: new Array(10).fill(null).map((_, index) => index + 1),
        toggleSelectedTable: (toggleMainParam) => {
            const currentSelectedTables = get().learn.selectedTables;
            const isAlreadySelected = currentSelectedTables.includes(toggleMainParam);
    
            if(isAlreadySelected) {
                // already exists --> remove
                set(state => ({ learn: { ...state.learn, selectedTables: currentSelectedTables.filter(selectedItem => selectedItem !== toggleMainParam).sort((a, b) => (a < b) ? -1 : (a > b) ? 1 : 0) }}));
            } else {
                // not yet selected --> add
                set(state => ({ learn: { ...state.learn, selectedTables: [...currentSelectedTables, toggleMainParam].sort((a, b) => (a < b) ? -1 : (a > b) ? 1 : 0) }}));
            }        
        }
    }
}))