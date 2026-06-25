import { JsonPipe } from '@angular/common';
import { Highlight } from 'ngx-highlightjs';
import { CallService } from './call.service';
import { CallRequest } from './call.interface';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Component, computed, inject, signal } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { form, FormField, FormRoot, required } from '@angular/forms/signals';

@Component({
  templateUrl: 'call.html',
  styleUrl: 'call.scss',
  imports: [
    FormRoot,
    JsonPipe,
    FormField,
    Highlight,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
  ],
})
export class CallComponent<Req, Res> {
  private readonly service = inject(CallService<Req, Res>);

  private readonly model = signal<CallRequest<Req>>({
    url: this.service.url(),
    body: this.service.body(),
    method: this.service.method(),
    headers: this.service.headers(),
  });

  readonly methods = this.service.methods;
  readonly body = computed(() => this.service.response()?.body);

  readonly form = form(
    this.model,
    (schemaPath) => {
      required(schemaPath.url);
      required(schemaPath.method);
    },
    {
      submission: {
        action: async () => {
          const model = this.model();
          this.service.update(model);
          this.service.call().subscribe();
        },
      },
    },
  );
}
