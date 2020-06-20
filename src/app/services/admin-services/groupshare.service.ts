import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupshareService {

  constructor() { }

  private nameSource = new BehaviorSubject('default message');
  currentName = this.nameSource.asObservable();


  changeName(name) {
    this.nameSource.next(name)
  }
}
