import { create } from "zustand";

type State = {
  editableTodoId: string | null;
};

type Actions = {
  setEditableTodoId: (id: string | null) => void;
  reset: () => void;
};

const initialState: State = {
  editableTodoId: null,
};

// create store
export const useGlobalStore = create<State & Actions>()((set) => ({
  ...initialState,
  setEditableTodoId: (id) => {
    set({ editableTodoId: id });
  },
  reset: () => {
    set(initialState);
  },
}));
