'use client';

import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LeadCard } from './lead-card';
import type { Lead, KanbanColumn as KanbanColumnType } from '@/lib/types';

interface KanbanColumnProps {
  column: KanbanColumnType;
  leads: Lead[];
  onViewLead: (lead: Lead) => void;
  onDeleteLead: (leadId: string) => void;
  onAddClick?: () => void;
}

export function KanbanColumn({
  column,
  leads,
  onViewLead,
  onDeleteLead,
  onAddClick,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <div
      className={`flex flex-col bg-muted/50 rounded-xl min-w-[320px] max-w-[320px] h-full transition-colors ${
        isOver ? 'bg-muted' : ''
      }`}
    >
      <div className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: column.color }}
            />
            <h2 className="font-semibold text-sm">{column.title}</h2>
            <span className="text-xs text-muted-foreground bg-background px-2 py-0.5 rounded-full">
              {leads.length}
            </span>
          </div>
          {onAddClick && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={onAddClick}
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1 px-2">
        <div
          ref={setNodeRef}
          className="p-2 space-y-3 min-h-[200px]"
        >
          <SortableContext
            items={leads.map((lead) => lead.id)}
            strategy={verticalListSortingStrategy}
          >
            {leads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onView={onViewLead}
                onDelete={onDeleteLead}
              />
            ))}
          </SortableContext>

          {leads.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-sm text-muted-foreground">
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
