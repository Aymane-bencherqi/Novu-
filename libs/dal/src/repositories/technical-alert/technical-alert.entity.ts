export interface ITechnicalAlertEntity {
  _id: string;
  organizationId: string;
  environmentId: string;
  channel: string;
  providerId: string;
  errorType: string;
  errorMessage: string;
  count: number;
  firstOccurred: Date;
  lastOccurred: Date;
  status: 'open' | 'acknowledged' | 'resolved';
  createdAt: string;
  updatedAt: string;
}

export class TechnicalAlertEntity implements ITechnicalAlertEntity {
  _id: string;
  organizationId: string;
  environmentId: string;
  channel: string;
  providerId: string;
  errorType: string;
  errorMessage: string;
  count: number;
  firstOccurred: Date;
  lastOccurred: Date;
  status: 'open' | 'acknowledged' | 'resolved';
  createdAt: string;
  updatedAt: string;
}

export type TechnicalAlertDBModel = TechnicalAlertEntity; 
