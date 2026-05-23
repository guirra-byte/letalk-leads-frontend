'use client';

import { useState } from 'react';
import { Search, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { KanbanBoard } from '@/components/kanban-board';
import { SearchDialog } from '@/components/search-dialog';
import { LeadViewModal } from '@/components/lead-view-modal';
import { useLeadsStore } from '@/lib/store';
import type { Lead } from '@/lib/types';

export default function Home() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const leads = useLeadsStore((state) => state.leads);

  const handleViewLead = (lead: Lead) => {
    setSelectedLead(lead);
    setViewModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Lead Pipeline</h1>
              <p className="text-sm text-muted-foreground">
                Gestão de leads com drag and drop
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{leads.length} leads</span>
              </div>
              <Button onClick={() => setSearchOpen(true)} className="gap-2">
                <Search className="h-4 w-4" />
                Consultar CNPJ
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 overflow-hidden">
        <div className="h-[calc(100vh-140px)]">
          <KanbanBoard
            onViewLead={handleViewLead}
            onAddClick={() => setSearchOpen(true)}
          />
        </div>
      </main>

      {/* Dialogs */}
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
      <LeadViewModal
        open={viewModalOpen}
        onOpenChange={setViewModalOpen}
        lead={selectedLead}
      />
    </div>
  );
}
