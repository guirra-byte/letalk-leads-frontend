'use client';

import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Inbox, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LeadCard } from './lead-card';
import type { Lead, KanbanColumnConfig } from '@/lib/types';

interface KanbanColumnProps {
  column: KanbanColumnConfig;
  leads: Lead[];
  onViewLead: (lead: Lead) => void;
  onAddClick?: () => void;
}

export function KanbanColumn({
  column,
  leads,
  onViewLead,
  onAddClick,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <div
      className={`flex h-full min-h-0 flex-col overflow-hidden rounded-2xl bg-muted/40 ring-1 ring-border/50 transition-all duration-200 min-w-[400px] max-w-[400px] ${
        isOver ? 'bg-muted ring-2 ring-primary/40' : ''
      }`}
    >
      <div
        aria-hidden
        className="h-[3px] w-full rounded-t-2xl"
        style={{ backgroundColor: column.color }}
      />

      <div className="px-4 pt-3 pb-2 bg-card/40 backdrop-blur-sm border-b border-border/40">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="h-2 w-2 rounded-full shrink-0"
              style={{ backgroundColor: column.color }}
            />
            <h2 className="font-semibold text-sm tracking-tight truncate">
              {column.title}
            </h2>
            <span className="text-[11px] font-medium text-muted-foreground bg-background/80 border border-border/60 px-2 py-0.5 rounded-full shrink-0">
              {leads.length}
            </span>
          </div>
          {onAddClick && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-accent shrink-0"
              onClick={onAddClick}
              aria-label={`Adicionar lead em ${column.title}`}
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="h-0 min-h-0 flex-1 px-2">
        <div ref={setNodeRef} className="min-h-[200px] space-y-3 p-2 pb-4">
          <SortableContext
            items={leads.map((lead) => lead.id)}
            strategy={verticalListSortingStrategy}
          >
            {leads.map((lead) => (
              <LeadCard key={lead.id} lead={lead} onView={onViewLead} />
            ))}
          </SortableContext>

          {leads.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center border border-dashed border-border/60 rounded-xl bg-background/40">
              <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center mb-3">
                <Inbox className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground/80">
                Nenhum lead nesta etapa
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Arraste leads para cá ou pesquise um CNPJ
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
