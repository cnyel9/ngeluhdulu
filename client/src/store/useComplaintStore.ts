import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Complaint, Feeling } from '@/types';

interface ComplaintState {
  complaints: Complaint[];
  addComplaint: (text: string, feeling: Feeling) => void;
  deleteComplaint: (id: string) => void;
  deleteAllComplaints: () => void;
  getComplaintsByDate: (startDate: Date, endDate: Date) => Complaint[];
}

export const useComplaintStore = create<ComplaintState>()(
  persist(
    (set, get) => ({
      complaints: [],
      
      addComplaint: (text, feeling) => {
        const newComplaint: Complaint = {
          id: Date.now().toString(),
          text,
          feeling,
          createdAt: new Date().toISOString(),
        };
        
        set((state) => ({
          complaints: [newComplaint, ...state.complaints],
        }));
      },
      
      deleteComplaint: (id) => {
        set((state) => ({
          complaints: state.complaints.filter((complaint) => complaint.id !== id),
        }));
      },
      
      deleteAllComplaints: () => {
        set({ complaints: [] });
      },
      
      getComplaintsByDate: (startDate, endDate) => {
        return get().complaints.filter((complaint) => {
          const complaintDate = new Date(complaint.createdAt);
          return complaintDate >= startDate && complaintDate <= endDate;
        });
      },
    }),
    {
      name: 'complaints-storage',
    }
  )
);