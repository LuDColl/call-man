import { tap } from 'rxjs';
import { CallRequest } from './call.interface';
import { computed, inject, Service, signal } from '@angular/core';
import {
  HttpClient,
  HttpEvent,
  HttpRequest,
  HttpRequestOptions,
  HttpResponse,
} from '@angular/common/http';

@Service()
export class CallService<Req, Res> {
  private readonly _url = signal('');
  private readonly _methods = signal(['GET']);
  private readonly _client = inject(HttpClient);
  private readonly _body = signal<Req | null>(null);
  private readonly _method = signal(this._methods()[0]);
  private readonly _options = signal<HttpRequestOptions>({});
  private readonly _response = signal<HttpResponse<Res> | null>(null);

  readonly url = this._url.asReadonly();
  readonly body = this._body.asReadonly();
  readonly method = this._method.asReadonly();
  readonly methods = this._methods.asReadonly();
  readonly options = this._options.asReadonly();
  readonly response = this._response.asReadonly();

  readonly request = computed<HttpRequest<Req>>(
    () => new HttpRequest<Req>(this.method(), this.url(), this.body(), this.options()),
  );

  update(request: Partial<CallRequest<Req>>) {
    if (!!request.url) this._url.set(request.url);
    if (!!request.method) this._method.set(request.method);
    if (!!request.body) this._body.set(request.body as Req);
    if (!!request.options) this._options.set(request.options);
  }

  call() {
    const request = this.request();
    const observable = this._client.request<Res>(request).pipe(tap(this.onEvent));
    return observable;
  }

  private readonly onEvent = (event: HttpEvent<Res>) => {
    if (!(event instanceof HttpResponse)) return;
    this._response.set(event);
  };
}
