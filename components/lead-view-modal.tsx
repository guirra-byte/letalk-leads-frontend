'use client';

import { useState } from 'react';
import { MapPin, Banknote, Calendar, Trash2, Mail, Phone, User } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DeleteLeadConfirmDialog } from '@/components/delete-lead-confirm-dialog';
import { formatCNPJ } from '@/lib/cnpj';
import { formatPhone } from '@/lib/phone';
import { getLeadDisplayCompany, getLeadDisplayTitle } from '@/lib/lead-display';
import { PRIORITY_LABELS, type CnaeDTO, type Lead, type Priority } from '@/lib/types';

interface LeadViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead | null;
}

const priorityColors: Record<Priority, { bg: string; text: string }> = {
  LOW: { bg: 'bg-slate-100', text: 'text-slate-700' },
  MEDIUM: { bg: 'bg-amber-100', text: 'text-amber-700' },
  HIGH: { bg: 'bg-red-100', text: 'text-red-700' },
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function buildCnaeList(lead: Lead): Array<{ code: string; description: string; type: CnaeDTO['type'] }> {
  const fromRelation = [...lead.cnaes].sort((a, b) => {
    if (a.type === b.type) return a.code.localeCompare(b.code);
    return a.type === 'PRIMARY' ? -1 : 1;
  });

  if (fromRelation.length > 0) {
    return fromRelation.map((cnae) => ({
      code: cnae.code,
      description: cnae.description,
      type: cnae.type,
    }));
  }

  const fallback: Array<{ code: string; description: string; type: CnaeDTO['type'] }> = [];

  if (lead.primaryActivity) {
    const [code, ...rest] = lead.primaryActivity.split(' - ');
    fallback.push({
      code: code ?? lead.primaryActivity,
      description: rest.join(' - ') || lead.primaryActivity,
      type: 'PRIMARY',
    });
  }

  return fallback;
}

export function LeadViewModal({ open, onOpenChange, lead }: LeadViewModalProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (!lead) return null;

  const cnaes = buildCnaeList(lead);
  const displayCompany = getLeadDisplayCompany(lead);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 gap-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="pr-6">{getLeadDisplayTitle(lead)}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] px-6">
          <div className="space-y-4">
            <div>
              {displayCompany && (
                <p className="text-sm text-muted-foreground">{displayCompany}</p>
              )}
              <p className="text-sm text-muted-foreground">
                CNPJ: {formatCNPJ(lead.cnpj)}
              </p>
            </div>

            {(lead.leadName ||
              lead.leadEmail ||
              lead.leadPhoneNumber ||
              lead.companyName) && (
              <>
                <div>
                  <p className="text-sm font-medium mb-2">Lead</p>
                  <div className="grid grid-cols-1 gap-3 text-sm">
                    {lead.leadName && (
                      <div className="flex items-start gap-2">
                        <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium">Nome do lead</p>
                          <p className="text-muted-foreground">{lead.leadName}</p>
                        </div>
                      </div>
                    )}
                    {lead.companyName && (
                      <div className="flex items-start gap-2">
                        <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium">Empresa informada</p>
                          <p className="text-muted-foreground">{lead.companyName}</p>
                        </div>
                      </div>
                    )}
                    {lead.leadEmail && (
                      <div className="flex items-start gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium">E-mail do lead</p>
                          <p className="text-muted-foreground">{lead.leadEmail}</p>
                        </div>
                      </div>
                    )}
                    {lead.leadPhoneNumber && (
                      <div className="flex items-start gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium">Telefone do lead</p>
                          <p className="text-muted-foreground">
                            {formatPhone(lead.leadPhoneNumber)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <Separator />
              </>
            )}

            <div>
              <p className="text-sm font-medium mb-2">Empresa (Receita)</p>
              <p className="text-sm text-muted-foreground">{lead.legalName}</p>
              {lead.tradeName && (
                <p className="text-sm text-muted-foreground">{lead.tradeName}</p>
              )}
              {lead.email && (
                <p className="text-sm text-muted-foreground mt-1">
                  E-mail comercial: {lead.email}
                </p>
              )}
            </div>

            <Separator />

            <div className="flex flex-wrap gap-2">
              {cnaes[0] && (
                <Badge variant="outline">{cnaes[0].code}</Badge>
              )}
              <Badge
                className={`${priorityColors[lead.priority].bg} ${priorityColors[lead.priority].text} border-0`}
              >
                Prioridade: {PRIORITY_LABELS[lead.priority]}
              </Badge>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Localização</p>
                  <p className="text-muted-foreground">
                    {lead.city} - {lead.state}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Banknote className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Capital Social</p>
                  <p className="text-muted-foreground">
                    {formatCurrency(lead.capitalSocial)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Fundação</p>
                  <p className="text-muted-foreground">
                    {formatDate(lead.foundedAt)}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {cnaes.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Atividades CNAE</p>
                <div className="space-y-2">
                  {cnaes.map((cnae) => (
                    <div key={`${cnae.type}-${cnae.code}`} className="p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={cnae.type === 'PRIMARY' ? 'default' : 'secondary'}>
                          {cnae.code}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {cnae.type === 'PRIMARY' ? 'Principal' : 'Secundária'}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{cnae.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="text-sm font-medium mb-2">Endereço Completo</p>
              <div className="p-3 bg-muted rounded-lg text-sm text-muted-foreground">
                <p>
                  {lead.street}, {lead.number}
                  {lead.complement && ` - ${lead.complement}`}
                </p>
                <p>
                  {lead.neighborhood} - {lead.city}/{lead.state}
                </p>
                <p>CEP: {lead.zipCode}</p>
              </div>
            </div>

            {lead.partners.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Sócios</p>
                <div className="space-y-2">
                  {lead.partners.map((partner) => (
                    <div key={partner.id} className="p-3 bg-muted rounded-lg">
                      <p className="text-sm font-medium">{partner.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {partner.role}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="text-xs text-muted-foreground pb-6">
              Adicionado em: {formatDate(lead.createdAt)}
            </p>
          </div>
        </ScrollArea>

        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-border/60 bg-muted/30">
          <Button
            variant="destructive"
            onClick={() => setConfirmOpen(true)}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Remover lead
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </div>
      </DialogContent>

      <DeleteLeadConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        lead={lead}
        onDeleted={() => onOpenChange(false)}
      />
    </Dialog>
  );
}
