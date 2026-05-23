'use client';

import { useState } from 'react';
import {
  Building2,
  MapPin,
  Users,
  Banknote,
  Calendar,
  Mail,
  Briefcase,
  FileText,
  User,
  X,
  Plus,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { LeadAnalysis, KanbanColumnId, Priority } from '@/lib/types';
import { KANBAN_COLUMNS } from '@/lib/types';
import { useLeadsStore } from '@/lib/store';

interface LeadDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: LeadAnalysis | null;
  cnpj: string;
}

export function LeadDetailsModal({
  open,
  onOpenChange,
  data,
  cnpj,
}: LeadDetailsModalProps) {
  const [selectedColumn, setSelectedColumn] = useState<KanbanColumnId>('PENDENTE');
  const [selectedPriority, setSelectedPriority] = useState<Priority>('media');
  const addLead = useLeadsStore((state) => state.addLead);
  const leads = useLeadsStore((state) => state.leads);

  if (!data) return null;

  const isAlreadyAdded = leads.some((lead) => lead.cnpj === cnpj);

  const handleAddToKanban = () => {
    console.log('[v0] handleAddToKanban called');
    const newLead = {
      id: crypto.randomUUID(),
      cnpj,
      data,
      columnId: selectedColumn,
      priority: selectedPriority,
      createdAt: new Date().toISOString(),
    };
    console.log('[v0] Adding new lead:', newLead);
    addLead(newLead);
    onOpenChange(false);
  };

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
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl">
                {data.company.tradeName || data.company.legalName}
              </DialogTitle>
              <DialogDescription className="mt-1">
                {data.company.legalName}
              </DialogDescription>
              <p className="text-sm text-muted-foreground mt-1">CNPJ: {cnpj}</p>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 px-6">
            <TabsTrigger
              value="info"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Informações
            </TabsTrigger>
            <TabsTrigger
              value="partners"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Sócios
            </TabsTrigger>
            <TabsTrigger
              value="activities"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Atividades
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[400px]">
            <TabsContent value="info" className="p-6 pt-4 m-0">
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Segmento</p>
                      <p className="text-sm text-muted-foreground">
                        {data.segment || 'Não informado'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Funcionários</p>
                      <p className="text-sm text-muted-foreground">
                        {data.employeeRange || 'Não informado'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Banknote className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Capital Social</p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(data.company.capitalSocial)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Fundação</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(data.company.foundedAt)}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Endereço</p>
                    <p className="text-sm text-muted-foreground">
                      {data.company.location.street}, {data.company.location.number}
                      {data.company.location.complement &&
                        ` - ${data.company.location.complement}`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {data.company.location.neighborhood} - {data.company.location.city}/
                      {data.company.location.state}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      CEP: {data.company.location.zipCode}
                    </p>
                  </div>
                </div>

                {data.company.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">E-mail</p>
                      <p className="text-sm text-muted-foreground">{data.company.email}</p>
                    </div>
                  </div>
                )}

                <Separator />

                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Regime Tributário</p>
                    {data.company.taxRegimes.map((regime, index) => (
                      <p key={index} className="text-sm text-muted-foreground">
                        {regime.year}: {regime.taxationType}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="partners" className="p-6 pt-4 m-0">
              <div className="space-y-4">
                {data.company.partners.map((partner, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-muted rounded-lg"
                  >
                    <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">{partner.name}</p>
                      <p className="text-sm text-muted-foreground">{partner.role}</p>
                      <div className="flex gap-2 mt-1">
                        {partner.ageRange && (
                          <Badge variant="secondary" className="text-xs">
                            {partner.ageRange} anos
                          </Badge>
                        )}
                        <Badge variant="secondary" className="text-xs">
                          Desde {formatDate(partner.joinedAt)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="activities" className="p-6 pt-4 m-0">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Atividade Principal</p>
                  <div className="p-3 bg-muted rounded-lg">
                    <Badge className="mb-1">{data.company.primaryActivity.code}</Badge>
                    <p className="text-sm text-muted-foreground">
                      {data.company.primaryActivity.description}
                    </p>
                  </div>
                </div>

                {data.company.secondaryActivities.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Atividades Secundárias</p>
                    <div className="space-y-2">
                      {data.company.secondaryActivities.map((activity, index) => (
                        <div key={index} className="p-3 bg-muted rounded-lg">
                          <Badge variant="secondary" className="mb-1">
                            {activity.code}
                          </Badge>
                          <p className="text-sm text-muted-foreground">
                            {activity.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <div className="p-6 pt-0 border-t">
          {isAlreadyAdded ? (
            <div className="bg-muted p-3 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">
                Este lead já foi adicionado ao pipeline.
              </p>
            </div>
          ) : (
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <label className="text-sm font-medium mb-1.5 block">Etapa</label>
                <Select
                  value={selectedColumn}
                  onValueChange={(value) => setSelectedColumn(value as KanbanColumnId)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {KANBAN_COLUMNS.map((column) => (
                      <SelectItem key={column.id} value={column.id}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: column.color }}
                          />
                          {column.title}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium mb-1.5 block">Prioridade</label>
                <Select
                  value={selectedPriority}
                  onValueChange={(value) => setSelectedPriority(value as Priority)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baixa">Baixa</SelectItem>
                    <SelectItem value="media">Média</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddToKanban} className="gap-2">
                <Plus className="h-4 w-4" />
                Adicionar ao Pipeline
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
