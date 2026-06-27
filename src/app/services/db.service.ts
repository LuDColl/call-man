import { v4 } from 'uuid';
import { Service, signal } from '@angular/core';
import { openDB, IDBPDatabase, StoreNames } from 'idb';
import { CallDb } from '../interfaces/call-db.interface';

@Service()
export class DbService {
  private readonly _db = signal<IDBPDatabase<CallDb> | null>(null);

  async add<StoreName extends StoreNames<CallDb>>(
    storeName: StoreName,
    entity: CallDb[StoreName]['value'],
  ) {
    const id = v4();
    const db = await this.getDb();
    await db.add(storeName, { ...entity, id });
    return id;
  }

  async update<StoreName extends StoreNames<CallDb>>(
    storeName: StoreName,
    entity: CallDb[StoreName]['value'],
  ) {
    const db = await this.getDb();
    await db.put(storeName, entity);
  }

  private async getDb() {
    if (this._db()) return this._db()!;

    const db = await openDB<CallDb>('call-db', 1, {
      upgrade(db) {
        db.createObjectStore('calls', { keyPath: 'id' });
      },
    });

    this._db.set(db);
    return db;
  }
}
