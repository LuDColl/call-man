import { HttpRequestOptions } from '@angular/common/http';

export interface CallRequest<Req> {
  url: string;
  method: string;
  body?: Req | null;
  options?: HttpRequestOptions;
}
