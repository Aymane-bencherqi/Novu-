import mongoose, { Schema } from 'mongoose';
import { schemaOptions } from '../schema-default.options';
import { TechnicalAlertDBModel } from './technical-alert.entity';

const technicalAlertSchema = new Schema<TechnicalAlertDBModel>(
  {
    organizationId: Schema.Types.String,
    environmentId: Schema.Types.String,
    channel: Schema.Types.String,
    providerId: Schema.Types.String,
    errorType: Schema.Types.String,
    errorMessage: Schema.Types.String,
    count: {
      type: Schema.Types.Number,
      default: 1,
    },
    firstOccurred: Schema.Types.Date,
    lastOccurred: Schema.Types.Date,
    status: {
      type: Schema.Types.String,
      enum: ['open', 'acknowledged', 'resolved'],
      default: 'open',
    },
  },
  schemaOptions
);

export const TechnicalAlert =
  (mongoose.models.TechnicalAlert as mongoose.Model<TechnicalAlertDBModel>) ||
  mongoose.model<TechnicalAlertDBModel>('TechnicalAlert', technicalAlertSchema); 
