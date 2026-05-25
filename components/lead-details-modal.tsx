'use client';

import { useState } from 'react';
import {
  MapPin,
  Banknote,
  Calendar,
  Mail,
  FileText,
  User,
  Plus,
  Loader2,
  AlertCircle,
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
import { cleanCNPJ } from '@/lib/cnpj';
import { formatPhone } from '@/lib/phone';
import { getLeadDisplayTitle } from '@/lib/lead-display';
import { useCreateLead } from '@/hooks/use-create-lead';
import { useLeads } from '@/hooks/use-leads';
import {
  KANBAN_COLUMNS,
  PRIORITY_OPTIONS,
  type Lead,
  type LeadInputFields,
  type LeadPreview,
  type PipelineStatus,
  type Priority,
} from '@/lib/types';

interface LeadDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: LeadPreview | null;
  cnpj: string;
  inputFields?: LeadInputFields;
}

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

export function LeadDetailsModal({
  open,
  onOpenChange,
  data,
  cnpj,
  inputFields,
}: LeadDetailsModalProps) {
  const [selectedColumn, setSelectedColumn] = useState<PipelineStatus>('PENDING');
  const [selectedPriority, setSelectedPriority] = useState<Priority>('MEDIUM');

  const { data: leads = [] as Lead[] } = useLeads();
  const createLead = useCreateLead();

  if (!data) return null;

  const cleaned = cleanCNPJ(cnpj);
  const isAlreadyAdded = leads.some((lead: Lead) => cleanCNPJ(lead.cnpj) === cleaned);

  const handleAddToKanban = () => {
    createLead.mutate(
      {
        cnpj: cleaned,
        pipelineStatus: selectedColumn,
        priority: selectedPriority,
        leadName: data.leadName ?? inputFields?.leadName ?? undefined,
        leadEmail: data.leadEmail ?? inputFields?.leadEmail ?? undefined,
        leadPhoneNumber: data.leadPhoneNumber ?? inputFields?.leadPhoneNumber ?? undefined,
        companyName: data.companyName ?? inputFields?.companyName ?? undefined,
      },
      {
        onSuccess: () => onOpenChange(false),
      }
    );
  };

  const commercialFields = {
    leadName: data.leadName ?? inputFields?.leadName,
    leadEmail: data.leadEmail ?? inputFields?.leadEmail,
    leadPhoneNumber: data.leadPhoneNumber ?? inputFields?.leadPhoneNumber,
    companyName: data.companyName ?? inputFields?.companyName,
  };
  const hasCommercialData = Object.values(commercialFields).some(Boolean);

  const partners = data.partners ?? [];
  const secondary = data.secondaryActivities ?? [];
  const taxRegimes = data.taxRegimes ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl">
                {getLeadDisplayTitle(data)}
              </DialogTitle>
              <DialogDescription className="mt-1">
                {data.tradeName || data.legalName}
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
                {hasCommercialData && (
                  <>
                    <div>
                      <p className="text-sm font-medium mb-2">Dados do lead</p>
                      <div className="grid grid-cols-2 gap-4">
                        {commercialFields.leadName && (
                          <div className="flex items-start gap-3">
                            <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div>
                              <p className="text-sm font-medium">Nome do lead</p>
                              <p className="text-sm text-muted-foreground">
                                {commercialFields.leadName}
                              </p>
                            </div>
                          </div>
                        )}
                        {commercialFields.companyName && (
                          <div className="flex items-start gap-3">
                            <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div>
                              <p className="text-sm font-medium">Empresa informada</p>
                              <p className="text-sm text-muted-foreground">
                                {commercialFields.companyName}
                              </p>
                            </div>
                          </div>
                        )}
                        {commercialFields.leadEmail && (
                          <div className="flex items-start gap-3">
                            <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div>
                              <p className="text-sm font-medium">E-mail do lead</p>
                              <p className="text-sm text-muted-foreground">
                                {commercialFields.leadEmail}
                              </p>
                            </div>
                          </div>
                        )}
                        {commercialFields.leadPhoneNumber && (
                          <div className="flex items-start gap-3">
                            <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div>
                              <p className="text-sm font-medium">Telefone do lead</p>
                              <p className="text-sm text-muted-foreground">
                                {formatPhone(commercialFields.leadPhoneNumber)}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <Separator />
                  </>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Banknote className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Capital Social</p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(data.capitalSocial ?? 0)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Fundação</p>
                      <p className="text-sm text-muted-foreground">
                        {data.foundedAt ? formatDate(data.foundedAt) : 'Não informado'}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {data.location && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Endereço</p>
                      <p className="text-sm text-muted-foreground">
                        {data.location.street}, {data.location.number}
                        {data.location.complement && ` - ${data.location.complement}`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {data.location.neighborhood} - {data.location.city}/{data.location.state}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        CEP: {data.location.zipCode}
                      </p>
                    </div>
                  </div>
                )}

                {data.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">E-mail comercial (Receita)</p>
                      <p className="text-sm text-muted-foreground">{data.email}</p>
                    </div>
                  </div>
                )}

                {taxRegimes.length > 0 && (
                  <>
                    <Separator />
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Regime Tributário</p>
                        {taxRegimes.map((regime, index) => (
                          <p key={index} className="text-sm text-muted-foreground">
                            {regime.year}: {regime.taxationType}
                          </p>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent value="partners" className="p-6 pt-4 m-0">
              <div className="space-y-4">
                {partners.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Nenhum sócio informado.
                  </p>
                )}
                {partners.map((partner, index) => (
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
                            {partner.ageRange}
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
                {data.primaryActivity && (
                  <div>
                    <p className="text-sm font-medium mb-2">Atividade Principal</p>
                    <div className="p-3 bg-muted rounded-lg">
                      <Badge className="mb-1">{data.primaryActivity.code}</Badge>
                      <p className="text-sm text-muted-foreground">
                        {data.primaryActivity.description}
                      </p>
                    </div>
                  </div>
                )}

                {secondary.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Atividades Secundárias</p>
                    <div className="space-y-2">
                      {secondary.map((activity, index) => (
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

        <div className="p-6 pt-2 border-t">
          {isAlreadyAdded ? (
            <div className="bg-muted p-3 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">
                Este lead já foi adicionado ao pipeline.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {createLead.isError && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span>
                    {createLead.error?.message ??
                      'Erro ao adicionar lead. Tente novamente.'}
                  </span>
                </div>
              )}
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <label className="text-sm font-medium mb-1.5 block">Etapa</label>
                  <Select
                    value={selectedColumn}
                    onValueChange={(value) =>
                      setSelectedColumn(value as PipelineStatus)
                    }
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
                      {PRIORITY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleAddToKanban}
                  className="gap-2"
                  disabled={createLead.isPending}
                >
                  {createLead.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  Adicionar ao Pipeline
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
