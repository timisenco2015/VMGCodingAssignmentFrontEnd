import { Injectable } from '@angular/core';
import { ID } from '@datorama/akita';
import { HttpClient } from '@angular/common/http';
import { ContactsStore } from './contacts.store';
import { Contact } from './contact.model';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ContactsService {

  constructor(private contactsStore: ContactsStore,
              private http: HttpClient) {
  }

  get() {
    return this.http.get<Contact[]>('https://api.com').pipe(tap(entities => {
      this.contactsStore.set(entities);
    }));
  }

  add(contact: Contact) {
    this.contactsStore.add(contact);
  }

  update(id, contact: Partial<Contact>) {
    this.contactsStore.update(id, contact);
  }

  remove(id: ID) {
    this.contactsStore.remove(id);
  }
}
