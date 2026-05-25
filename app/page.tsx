'use client';

import { useState } from 'react';
import { Search, Users, LayoutDashboard, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { KanbanBoard } from '@/components/kanban-board';
import { SearchDialog } from '@/components/search-dialog';
import { BatchImportDialog } from '@/components/batch-import-dialog';
import { LeadViewModal } from '@/components/lead-view-modal';
import { useLeads } from '@/hooks/use-leads';
import type { Lead } from '@/lib/types';

export default function Home() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [batchImportOpen, setBatchImportOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const { data: leads = [] } = useLeads();

  const handleViewLead = (lead: Lead) => {
    setSelectedLead(lead);
    setViewModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-b from-background via-background to-muted/30">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-sm">
                <LayoutDashboard className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight leading-tight">
                  Lead Pipeline
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Gestão de leads com drag and drop
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground bg-muted/60 border border-border/60 rounded-full px-3 py-1.5">
                <Users className="h-3.5 w-3.5" />
                <span className="font-medium tabular-nums">
                  {leads.length}
                </span>
                <span>leads</span>
              </div>
              <Button
                variant="outline"
                onClick={() => setBatchImportOpen(true)}
                className="gap-2 shadow-sm"
              >
                <FileSpreadsheet className="h-4 w-4" />
                Consulta em massa via .csv
              </Button>
              <Button
                onClick={() => setSearchOpen(true)}
                className="gap-2 shadow-sm"
              >
                <Search className="h-4 w-4" />
                Consultar CNPJ
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto flex-1 overflow-hidden px-4 py-6 min-h-0">
        <div className="h-[calc(100vh-140px)] min-h-0">
          <KanbanBoard
            onViewLead={handleViewLead}
            onAddClick={() => setSearchOpen(true)}
          />
        </div>
      </main>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
      <BatchImportDialog
        open={batchImportOpen}
        onOpenChange={setBatchImportOpen}
      />
      <LeadViewModal
        open={viewModalOpen}
        onOpenChange={setViewModalOpen}
        lead={selectedLead}
      />
    </div>
  );
}
