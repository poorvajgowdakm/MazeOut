import { create } from 'zustand';

const useStore = create((set, get) => ({
  user: null, // Logged in user
  token: null,
  role: 'USER', // 'USER' or 'OWNER'
  
  // Data caches
  rooms: [],
  meetings: [],
  equipment: [],
  
  // Actions
  login: (userData, token) => set({ user: userData, role: userData.role, token }),
  logout: () => set({ user: null, role: 'USER', token: null }),
  
  setRooms: (rooms) => set({ rooms }),
  setMeetings: (meetings) => set({ meetings }),
  setEquipment: (equipment) => set({ equipment }),

  // Optimistic updates for snappy UI
  addMeeting: (meeting) => set((state) => ({ meetings: [...state.meetings, meeting] })),
  updateMeetingStatus: (id, status) => set((state) => ({
    meetings: state.meetings.map(m => m.id === id ? { ...m, status } : m)
  }))
}));

export default useStore;
