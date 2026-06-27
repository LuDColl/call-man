import {
  HttpEvent,
  HttpClient,
  HttpHeaders,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
  HttpRequestOptions,
} from '@angular/common/http';
import { tap } from 'rxjs';
import { NGXLogger } from 'ngx-logger';
import { CallRequest } from './call.interface';
import { DbService } from '../../services/db.service';
import { computed, effect, inject, Service, signal, untracked } from '@angular/core';

@Service()
export class CallService<Req, Res> {
  private readonly _db = inject(DbService);
  private readonly _methods = signal(['GET']);
  private readonly _logger = inject(NGXLogger);
  private readonly _client = inject(HttpClient);
  private readonly _response = signal<HttpResponse<Res> | null>(null);

  constructor() {
    effect(async () => {
      const model = this.model();

      await untracked(async () => {
        if (model.id) return await this._db.update('calls', model);
        const id = await this._db.add('calls', model);
        this.model.update((current) => ({ ...current, id }));
      });
    });
  }

  readonly model = signal<CallRequest<Req>>({
    id: '',
    url: '',
    body: null,
    method: this._methods()[0],
    headers: new HttpHeaders(),
  });

  readonly methods = this._methods.asReadonly();
  readonly response = this._response.asReadonly();

  readonly url = computed(() => this.model().url);
  readonly body = computed(() => this.model().body);
  readonly method = computed(() => this.model().method);
  readonly headers = computed(() => this.model().headers);

  readonly options = computed<HttpRequestOptions>(() => ({
    headers: this.headers(),
  }));

  readonly request = computed<HttpRequest<Req>>(() => {
    const options = this.options();
    const { method, url, body } = this.model();
    return new HttpRequest<Req>(method, url, body, options);
  });

  call() {
    const request = this.request();

    const observable = this._client
      .request<Res>(request)
      .pipe(tap({ next: this.onEvent, error: this.onError }));

    return observable;
  }

  private readonly onEvent = (event: HttpEvent<Res>) => {
    if (!(event instanceof HttpResponse)) return;
    this._response.set(event);
  };

  private readonly onError = (error: HttpErrorResponse) => {
    this._logger.error(error);
  };
}
