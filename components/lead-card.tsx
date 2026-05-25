'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Building2,
  MapPin,
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
import { DeleteLeadConfirmDialog } from '@/components/delete-lead-confirm-dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { formatCNPJ } from '@/lib/cnpj';
import { formatPhone } from '@/lib/phone';
import {
  getLeadDisplayCompany,
  getLeadDisplayTitle,
} from '@/lib/lead-display';
import { PRIORITY_LABELS, type Lead, type Priority } from '@/lib/types';

interface LeadCardProps {
  lead: Lead;
  onView: (lead: Lead) => void;
}

const priorityAccent: Record<Priority, { bar: string; dot: string; text: string }> = {
  LOW: {
    bar: 'bg-slate-400',
    dot: 'bg-slate-500',
    text: 'text-slate-700',
  },
  MEDIUM: {
    bar: 'bg-amber-500',
    dot: 'bg-amber-500',
    text: 'text-amber-700',
  },
  HIGH: {
    bar: 'bg-red-500',
    dot: 'bg-red-500',
    text: 'text-red-700',
  },
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    notation: 'compact',
    compactDisplay: 'short',
  }).format(value);
}

function getFoundedYear(dateString: string) {
  const date = new Date(dateString);
  return Number.isNaN(date.getTime()) ? '—' : date.getFullYear();
}

function getPrimaryCnaeCode(lead: Lead) {
  const primary = lead.cnaes.find((cnae) => cnae.type === 'PRIMARY');
  if (primary) return primary.code;
  const [code] = lead.primaryActivity?.split(' - ') ?? [];
  return code ?? '—';
}

export function LeadCard({ lead, onView }: LeadCardProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

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

  const accent = priorityAccent[lead.priority];
  const displayTitle = getLeadDisplayTitle(lead);
  const displayCompany = getLeadDisplayCompany(lead);
  const tooltipLines = [
    lead.leadEmail && `E-mail do lead: ${lead.leadEmail}`,
    lead.leadPhoneNumber &&
      `Telefone do lead: ${formatPhone(lead.leadPhoneNumber)}`,
    lead.email && `E-mail comercial (Receita): ${lead.email}`,
  ].filter(Boolean) as string[];

  const stopDnd = (e: React.PointerEvent | React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleCardActivate = () => onView(lead);

  const handleCardKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardActivate();
    }
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`group relative w-full max-w-[400px] bg-card border border-border/60 rounded-xl shadow-xs transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-border overflow-hidden ${
          isDragging ? 'opacity-60 shadow-lg rotate-2 ring-2 ring-primary/20' : ''
        }`}
      >
        <span
          aria-hidden
          className={`absolute inset-y-0 left-0 w-1 rounded-l-xl ${accent.bar}`}
        />

        <div
          role="button"
          tabIndex={0}
          onClick={handleCardActivate}
          onKeyDown={handleCardKeyDown}
          aria-label={`Ver detalhes de ${displayTitle}`}
          className="p-4 pl-5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-inset rounded-xl"
        >
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-start gap-2 flex-1 min-w-0">
              <button
                type="button"
                {...attributes}
                {...listeners}
                onClick={stopDnd}
                className="mt-0.5 -ml-1 p-1 rounded-md cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                aria-label="Arrastar lead"
              >
                <GripVertical className="h-4 w-4" />
              </button>
            <div className="min-w-0 flex-1">
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <h3 className="font-semibold text-sm leading-tight wrap-break-word cursor-default">
                      {displayTitle}
                    </h3>
                  </TooltipTrigger>
                  {tooltipLines.length > 0 && (
                    <TooltipContent side="top" className="max-w-xs">
                      <div className="space-y-1 text-xs">
                        {tooltipLines.map((line) => (
                          <p key={line}>{line}</p>
                        ))}
                      </div>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
              {displayCompany && (
                <p className="text-xs text-muted-foreground wrap-break-word mt-0.5">
                  {displayCompany}
                </p>
              )}
              <p className="text-[11px] font-mono text-muted-foreground/80 wrap-break-word mt-0.5">
                {formatCNPJ(lead.cnpj)}
              </p>
            </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onPointerDown={stopDnd}
                  onClick={stopDnd}
                  aria-label="Abrir menu de ações"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent shrink-0"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                onClick={stopDnd}
                onPointerDown={stopDnd}
              >
                <DropdownMenuItem onClick={() => onView(lead)}>
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Detalhes
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setConfirmOpen(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remover
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-1.5 text-xs text-foreground/75">
            <div className="flex items-start gap-2 min-w-0">
              <Building2 className="h-3.5 w-3.5 shrink-0 mt-0.5 text-muted-foreground/80" />
              <span className="min-w-0 wrap-break-word">
                {lead.primaryActivity || '—'}
              </span>
            </div>
            <div className="flex items-start gap-2 min-w-0">
              <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5 text-muted-foreground/80" />
              <span className="min-w-0 wrap-break-word">
                {lead.city} - {lead.state}
              </span>
            </div>
            <div className="flex items-start gap-2 min-w-0">
              <Banknote className="h-3.5 w-3.5 shrink-0 mt-0.5 text-muted-foreground/80" />
              <span className="min-w-0 wrap-break-word font-medium">
                {formatCurrency(lead.capitalSocial)}
              </span>
            </div>
            <div className="flex items-start gap-2 min-w-0">
              <Calendar className="h-3.5 w-3.5 shrink-0 mt-0.5 text-muted-foreground/80" />
              <span className="min-w-0 wrap-break-word">
                Desde {getFoundedYear(lead.foundedAt)}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 mt-3 min-w-0">
            <Badge
              variant="outline"
              className="text-[10px] font-mono px-1.5 py-0 h-5 border-border/70"
            >
              {getPrimaryCnaeCode(lead)}
            </Badge>
            <Badge
              variant="secondary"
              className={`text-[10px] h-5 px-2 gap-1.5 bg-background border border-border/70 ${accent.text}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${accent.dot}`} />
              {PRIORITY_LABELS[lead.priority]}
            </Badge>
          </div>
        </div>
      </div>

      <DeleteLeadConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        lead={lead}
      />
    </>
  );
}
