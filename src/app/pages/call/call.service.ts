import { Service } from '@angular/core';

@Service()
export class CallService {
  url = '';
  methods: string[] = ['GET'];
}
