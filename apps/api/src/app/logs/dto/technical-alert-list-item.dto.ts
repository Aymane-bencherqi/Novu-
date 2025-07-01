export type TechnicalAlertListItemDto = {
  id: string;
  organizationId: string;
  environmentId: string;
  channel: string;
  providerId: string;
  errorType: string;
  errorMessage: string;
  count: number;
  firstOccurred: string | null;
  lastOccurred: string | null;
  status: 'open' | 'acknowledged' | 'resolved';
  createdAt: string | null;
  updatedAt: string | null;
}; 
