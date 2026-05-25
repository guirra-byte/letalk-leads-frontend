'use client';

import { useState, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Loader2 } from 'lucide-react';
import { KanbanColumn } from './kanban-column';
import { LeadCard } from './lead-card';
import { useLeads } from '@/hooks/use-leads';
import { useSwitchLeadPipelineStatus } from '@/hooks/use-switch-lead-pipeline-status';
import {
  KANBAN_COLUMNS,
  type Lead,
  type PipelineStatus,
} from '@/lib/types';

interface KanbanBoardProps {
  onViewLead: (lead: Lead) => void;
  onAddClick: () => void;
}

export function KanbanBoard({ onViewLead, onAddClick }: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const { data: leads = [], isLoading, isError, error, refetch } = useLeads();
  const switchStatus = useSwitchLeadPipelineStatus();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getLeadsByColumn = useCallback(
    (columnId: PipelineStatus) =>
      leads.filter((lead) => lead.pipelineStatus === columnId),
    [leads]
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeLeadId = active.id as string;
    const overId = over.id as string;

    const currentLead = leads.find((lead) => lead.id === activeLeadId);
    if (!currentLead) return;

    const targetColumn = KANBAN_COLUMNS.find((col) => col.id === overId);
    if (targetColumn) {
      if (targetColumn.id === currentLead.pipelineStatus) return;
      switchStatus.mutate({
        leadId: activeLeadId,
        pipelineStatus: targetColumn.id,
      });
      return;
    }

    const overLead = leads.find((lead) => lead.id === overId);
    if (overLead && overLead.pipelineStatus !== currentLead.pipelineStatus) {
      switchStatus.mutate({
        leadId: activeLeadId,
        pipelineStatus: overLead.pipelineStatus,
      });
    }
  };

  const activeLead = activeId
    ? leads.find((lead) => lead.id === activeId)
    : null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>Carregando leads...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3">
        <p className="text-sm text-destructive">
          {error?.message ?? 'Erro ao carregar leads.'}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="text-sm text-primary hover:underline"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-full min-h-0 items-stretch gap-4 overflow-x-auto pb-4">
        {KANBAN_COLUMNS.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            leads={getLeadsByColumn(column.id)}
            onViewLead={onViewLead}
            onAddClick={column.id === 'PENDING' ? onAddClick : undefined}
          />
        ))}
      </div>

      <DragOverlay>
        {activeLead ? (
          <div className="opacity-90">
            <LeadCard lead={activeLead} onView={() => {}} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
