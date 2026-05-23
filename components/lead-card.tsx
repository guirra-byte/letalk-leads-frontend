'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Building2,
  MapPin,
  Users,
  Banknote,
  Calendar,
  GripVertical,
  MoreVertical,
  Trash2,
  Eye,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Lead, Priority } from '@/lib/types';

interface LeadCardProps {
  lead: Lead;
  onView: (lead: Lead) => void;
  onDelete: (leadId: string) => void;
}

const priorityColors: Record<Priority, { bg: string; text: string }> = {
  baixa: { bg: 'bg-slate-100', text: 'text-slate-700' },
  media: { bg: 'bg-amber-100', text: 'text-amber-700' },
  alta: { bg: 'bg-red-100', text: 'text-red-700' },
};

const priorityLabels: Record<Priority, string> = {
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta',
};

export function LeadCard({ lead, onView, onDelete }: LeadCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lead.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      notation: 'compact',
      compactDisplay: 'short',
    }).format(value);
  };

  const getFoundedYear = (dateString: string) => {
    return new Date(dateString).getFullYear();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-card border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow ${
        isDragging ? 'opacity-50 shadow-lg' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <button
            {...attributes}
            {...listeners}
            className="mt-0.5 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
          >
            <GripVertical className="h-4 w-4" />
          </button>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-sm truncate">
              {lead.data.company.tradeName || lead.data.company.legalName}
            </h3>
            <p className="text-xs text-muted-foreground truncate">
              {lead.data.company.legalName}
            </p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(lead)}>
              <Eye className="h-4 w-4 mr-2" />
              Ver Detalhes
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(lead.id)}
              className="text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Remover
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-2 text-xs text-muted-foreground">
        {lead.data.segment && (
          <div className="flex items-center gap-2">
            <Building2 className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="truncate">{lead.data.segment}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
          <span>
            {lead.data.company.location.city} - {lead.data.company.location.state}
          </span>
        </div>
        {lead.data.employeeRange && (
          <div className="flex items-center gap-2">
            <Users className="h-3.5 w-3.5 flex-shrink-0" />
            <span>{lead.data.employeeRange} funcionários</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Banknote className="h-3.5 w-3.5 flex-shrink-0" />
          <span>{formatCurrency(lead.data.company.capitalSocial)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
          <span>Desde {getFoundedYear(lead.data.company.foundedAt)}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mt-3">
        <Badge variant="outline" className="text-xs">
          {lead.data.company.primaryActivity.code}
        </Badge>
        <Badge
          className={`text-xs ${priorityColors[lead.priority].bg} ${priorityColors[lead.priority].text} border-0`}
        >
          {priorityLabels[lead.priority]}
        </Badge>
      </div>
    </div>
  );
}
