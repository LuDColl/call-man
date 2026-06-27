import { HttpHeaders } from '@angular/common/http';

export interface CallRequest<Req> {
  id: string;
  url: string;
  method: string;
  body: Req | null;
  headers?: HttpHeaders;
}
