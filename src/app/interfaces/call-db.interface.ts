import { DBSchema } from 'idb';
import { CallRequest } from '../pages/call/call.interface';

export interface CallDb extends DBSchema {
  calls: {
    key: number;
    value: CallRequest<any>;
  };
}
