'use client';

import { Building2, MapPin, Users, Banknote, Calendar, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Lead, Priority } from '@/lib/types';

interface LeadViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead | null;
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

export function LeadViewModal({ open, onOpenChange, lead }: LeadViewModalProps) {
  if (!lead) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="pr-6">
            {lead.data.company.tradeName || lead.data.company.legalName}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">
                {lead.data.company.legalName}
              </p>
              <p className="text-sm text-muted-foreground">CNPJ: {lead.cnpj}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {lead.data.segment && (
                <Badge variant="outline">{lead.data.segment}</Badge>
              )}
              <Badge variant="outline">
                {lead.data.company.primaryActivity.code}
              </Badge>
              <Badge
                className={`${priorityColors[lead.priority].bg} ${priorityColors[lead.priority].text} border-0`}
              >
                Prioridade: {priorityLabels[lead.priority]}
              </Badge>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Localização</p>
                  <p className="text-muted-foreground">
                    {lead.data.company.location.city} -{' '}
                    {lead.data.company.location.state}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Users className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Funcionários</p>
                  <p className="text-muted-foreground">
                    {lead.data.employeeRange || 'Não informado'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Banknote className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Capital Social</p>
                  <p className="text-muted-foreground">
                    {formatCurrency(lead.data.company.capitalSocial)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Fundação</p>
                  <p className="text-muted-foreground">
                    {formatDate(lead.data.company.foundedAt)}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm font-medium mb-2">Atividade Principal</p>
              <div className="p-3 bg-muted rounded-lg">
                <Badge className="mb-1">{lead.data.company.primaryActivity.code}</Badge>
                <p className="text-sm text-muted-foreground">
                  {lead.data.company.primaryActivity.description}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Endereço Completo</p>
              <div className="p-3 bg-muted rounded-lg text-sm text-muted-foreground">
                <p>
                  {lead.data.company.location.street}, {lead.data.company.location.number}
                  {lead.data.company.location.complement &&
                    ` - ${lead.data.company.location.complement}`}
                </p>
                <p>
                  {lead.data.company.location.neighborhood} -{' '}
                  {lead.data.company.location.city}/{lead.data.company.location.state}
                </p>
                <p>CEP: {lead.data.company.location.zipCode}</p>
              </div>
            </div>

            {lead.data.company.partners.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Sócios</p>
                <div className="space-y-2">
                  {lead.data.company.partners.map((partner, index) => (
                    <div key={index} className="p-3 bg-muted rounded-lg">
                      <p className="text-sm font-medium">{partner.name}</p>
                      <p className="text-xs text-muted-foreground">{partner.role}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              Adicionado em: {formatDate(lead.createdAt)}
            </p>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
