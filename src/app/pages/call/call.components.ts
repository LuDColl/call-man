import { CallService } from './call.service';
import { MatInputModule } from '@angular/material/input';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { form, FormField, FormRoot, required } from '@angular/forms/signals';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';

@Component({
  templateUrl: 'call.html',
  styleUrl: 'call.scss',
  imports: [
    FormRoot,
    FormField,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
  ],
})
export class CallComponent {
  private readonly http = inject(HttpClient);
  private readonly service = inject(CallService);

  body = signal('');
  methods = signal(['GET', 'POST']);
  model = signal({ url: this.service.url, method: this.service.methods[0] });

  form = form(
    this.model,
    (schemaPath) => {
      required(schemaPath.url);
      required(schemaPath.method);
    },
    {
      submission: {
        action: async (tree) => {
          const state = tree();
          const { value: signal } = state;
          const value = signal();
          const request = new HttpRequest(value.method, value.url, null, {});
          this.http.request<any>(request).subscribe((event) => {
            if (!(event instanceof HttpResponse)) return;
            this.body.set(JSON.stringify(event.body, null, 2));
          });
        },
      },
    },
  );

  options: string[] = [];
}
