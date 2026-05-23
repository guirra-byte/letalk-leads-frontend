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
import { KanbanColumn } from './kanban-column';
import { LeadCard } from './lead-card';
import { useLeadsStore } from '@/lib/store';
import { KANBAN_COLUMNS, type Lead, type KanbanColumnId } from '@/lib/types';

interface KanbanBoardProps {
  onViewLead: (lead: Lead) => void;
  onAddClick: () => void;
}

export function KanbanBoard({ onViewLead, onAddClick }: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const leads = useLeadsStore((state) => state.leads);
  const moveLead = useLeadsStore((state) => state.moveLead);
  const removeLead = useLeadsStore((state) => state.removeLead);

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
    (columnId: KanbanColumnId) => {
      return leads.filter((lead) => lead.columnId === columnId);
    },
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

    // Check if we're dropping on a column
    const targetColumn = KANBAN_COLUMNS.find((col) => col.id === overId);
    if (targetColumn) {
      moveLead(activeLeadId, targetColumn.id);
      return;
    }

    // Check if we're dropping on another lead
    const overLead = leads.find((lead) => lead.id === overId);
    if (overLead) {
      moveLead(activeLeadId, overLead.columnId);
    }
  };

  const activeLead = activeId
    ? leads.find((lead) => lead.id === activeId)
    : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4 h-full">
        {KANBAN_COLUMNS.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            leads={getLeadsByColumn(column.id)}
            onViewLead={onViewLead}
            onDeleteLead={removeLead}
            onAddClick={column.id === 'PENDENTE' ? onAddClick : undefined}
          />
        ))}
      </div>

      <DragOverlay>
        {activeLead ? (
          <div className="opacity-90">
            <LeadCard
              lead={activeLead}
              onView={() => {}}
              onDelete={() => {}}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
