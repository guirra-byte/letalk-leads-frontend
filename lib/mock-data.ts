import type { LeadAnalysis } from './types';

// Mock data para simular a API de consulta de CNPJ
export const mockCNPJData: Record<string, LeadAnalysis> = {
  '11222333000181': {
    company: {
      legalName: 'TECH SOLUTIONS BRASIL LTDA',
      tradeName: 'TechBR',
      email: 'contato@techbr.com.br',
      foundedAt: '2018-03-15',
      capitalSocial: 500000,
      location: {
        zipCode: '01310-100',
        street: 'Avenida Paulista',
        number: '1000',
        complement: 'Sala 1501',
        neighborhood: 'Bela Vista',
        city: 'São Paulo',
        state: 'SP',
      },
      primaryActivity: {
        code: '62.01-5-01',
        description: 'Desenvolvimento de programas de computador sob encomenda',
      },
      secondaryActivities: [
        {
          code: '62.02-3-00',
          description: 'Desenvolvimento e licenciamento de programas de computador customizáveis',
        },
        {
          code: '62.04-0-00',
          description: 'Consultoria em tecnologia da informação',
        },
      ],
      taxRegimes: [
        { year: 2024, taxationType: 'Simples Nacional' },
        { year: 2023, taxationType: 'Simples Nacional' },
      ],
      partners: [
        {
          name: 'João Silva Santos',
          role: 'Sócio-Administrador',
          ageRange: '31-40',
          joinedAt: '2018-03-15',
        },
        {
          name: 'Maria Oliveira Costa',
          role: 'Sócia',
          ageRange: '31-40',
          joinedAt: '2018-03-15',
        },
      ],
    },
    segment: 'Tecnologia',
    employeeRange: '11-50',
    contactRole: 'CEO',
  },
  '22333444000192': {
    company: {
      legalName: 'OPEN KNOWLEDGE BRASIL',
      tradeName: 'OKBr',
      email: 'contato@ok.org.br',
      foundedAt: '2013-06-20',
      capitalSocial: 500000,
      location: {
        zipCode: '01310-000',
        street: 'Rua da Consolação',
        number: '2500',
        neighborhood: 'Consolação',
        city: 'São Paulo',
        state: 'SP',
      },
      primaryActivity: {
        code: '94.99-5-00',
        description: 'Atividades associativas não especificadas anteriormente',
      },
      secondaryActivities: [],
      taxRegimes: [
        { year: 2024, taxationType: 'Imune' },
      ],
      partners: [
        {
          name: 'Carlos Eduardo Pereira',
          role: 'Presidente',
          ageRange: '41-50',
          joinedAt: '2013-06-20',
        },
      ],
    },
    segment: 'Terceiro Setor',
    employeeRange: '11-50',
    contactRole: 'Diretor Executivo',
  },
  '33444555000103': {
    company: {
      legalName: 'CONSULTORIA FINANCEIRA PRIME LTDA',
      tradeName: 'Prime Finance',
      email: 'atendimento@primefinance.com.br',
      foundedAt: '2015-08-10',
      capitalSocial: 1500000,
      location: {
        zipCode: '22250-040',
        street: 'Praia de Botafogo',
        number: '300',
        complement: '12º andar',
        neighborhood: 'Botafogo',
        city: 'Rio de Janeiro',
        state: 'RJ',
      },
      primaryActivity: {
        code: '66.19-3-99',
        description: 'Outras atividades auxiliares dos serviços financeiros não especificadas anteriormente',
      },
      secondaryActivities: [
        {
          code: '70.20-4-00',
          description: 'Atividades de consultoria em gestão empresarial',
        },
      ],
      taxRegimes: [
        { year: 2024, taxationType: 'Lucro Presumido' },
        { year: 2023, taxationType: 'Lucro Presumido' },
      ],
      partners: [
        {
          name: 'Ana Paula Rodrigues',
          role: 'Sócia-Administradora',
          ageRange: '41-50',
          joinedAt: '2015-08-10',
        },
        {
          name: 'Roberto Almeida',
          role: 'Sócio',
          ageRange: '51-60',
          joinedAt: '2015-08-10',
        },
      ],
    },
    segment: 'Serviços Financeiros',
    employeeRange: '51-100',
    contactRole: 'CFO',
  },
  '44555666000114': {
    company: {
      legalName: 'INDÚSTRIA ALIMENTÍCIA SABOR DO CAMPO SA',
      tradeName: 'Sabor do Campo',
      email: 'vendas@sabordocampo.ind.br',
      foundedAt: '2005-02-28',
      capitalSocial: 8000000,
      location: {
        zipCode: '13400-000',
        street: 'Rodovia Piracicaba-Rio Claro',
        number: 'KM 45',
        neighborhood: 'Zona Rural',
        city: 'Piracicaba',
        state: 'SP',
      },
      primaryActivity: {
        code: '10.99-6-99',
        description: 'Fabricação de outros produtos alimentícios não especificados anteriormente',
      },
      secondaryActivities: [
        {
          code: '46.37-1-99',
          description: 'Comércio atacadista especializado em outros produtos alimentícios',
        },
      ],
      taxRegimes: [
        { year: 2024, taxationType: 'Lucro Real' },
        { year: 2023, taxationType: 'Lucro Real' },
      ],
      partners: [
        {
          name: 'Fernando Costa Lima',
          role: 'Diretor Presidente',
          ageRange: '51-60',
          joinedAt: '2005-02-28',
        },
        {
          name: 'Patricia Costa Lima',
          role: 'Diretora Financeira',
          ageRange: '41-50',
          joinedAt: '2010-01-15',
        },
      ],
    },
    segment: 'Indústria Alimentícia',
    employeeRange: '201-500',
    contactRole: 'Gerente Comercial',
  },
  '55666777000125': {
    company: {
      legalName: 'STARTUP INOVAÇÃO DIGITAL LTDA',
      tradeName: 'InovaDigital',
      email: 'hello@inovadigital.io',
      foundedAt: '2021-11-05',
      capitalSocial: 100000,
      location: {
        zipCode: '30130-000',
        street: 'Rua da Bahia',
        number: '1500',
        complement: 'Coworking Hub',
        neighborhood: 'Centro',
        city: 'Belo Horizonte',
        state: 'MG',
      },
      primaryActivity: {
        code: '62.01-5-01',
        description: 'Desenvolvimento de programas de computador sob encomenda',
      },
      secondaryActivities: [
        {
          code: '63.19-4-00',
          description: 'Portais, provedores de conteúdo e outros serviços de informação na internet',
        },
      ],
      taxRegimes: [
        { year: 2024, taxationType: 'Simples Nacional' },
      ],
      partners: [
        {
          name: 'Lucas Mendes',
          role: 'Sócio-Administrador',
          ageRange: '21-30',
          joinedAt: '2021-11-05',
        },
        {
          name: 'Juliana Ferreira',
          role: 'Sócia',
          ageRange: '21-30',
          joinedAt: '2021-11-05',
        },
      ],
    },
    segment: 'Tecnologia/Startup',
    employeeRange: '1-10',
    contactRole: 'Founder',
  },
};

export async function fetchCNPJData(cnpj: string): Promise<LeadAnalysis | null> {
  // Simula delay de API
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const cleanedCNPJ = cnpj.replace(/\D/g, '');
  return mockCNPJData[cleanedCNPJ] || null;
}
