'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Lead, KanbanColumnId, Priority } from '@/lib/types';

interface LeadsState {
  leads: Lead[];
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  addLead: (lead: Lead) => void;
  moveLead: (leadId: string, newColumnId: KanbanColumnId) => void;
  updateLeadPriority: (leadId: string, priority: Priority) => void;
  updateLeadNotes: (leadId: string, notes: string) => void;
  removeLead: (leadId: string) => void;
  getLeadsByColumn: (columnId: KanbanColumnId) => Lead[];
}

export const useLeadsStore = create<LeadsState>()(
  persist(
    (set, get) => ({
      leads: [],
      _hasHydrated: false,
      
      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
      },
      
      addLead: (lead) => {
        console.log('[v0] Adding lead:', lead);
        set((state) => ({
          leads: [...state.leads, lead],
        }));
      },
      
      moveLead: (leadId, newColumnId) => {
        set((state) => ({
          leads: state.leads.map((lead) =>
            lead.id === leadId ? { ...lead, columnId: newColumnId } : lead
          ),
        }));
      },
      
      updateLeadPriority: (leadId, priority) => {
        set((state) => ({
          leads: state.leads.map((lead) =>
            lead.id === leadId ? { ...lead, priority } : lead
          ),
        }));
      },
      
      updateLeadNotes: (leadId, notes) => {
        set((state) => ({
          leads: state.leads.map((lead) =>
            lead.id === leadId ? { ...lead, notes } : lead
          ),
        }));
      },
      
      removeLead: (leadId) => {
        set((state) => ({
          leads: state.leads.filter((lead) => lead.id !== leadId),
        }));
      },
      
      getLeadsByColumn: (columnId) => {
        return get().leads.filter((lead) => lead.columnId === columnId);
      },
    }),
    {
      name: 'leads-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
