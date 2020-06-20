import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContentshareService {

  constructor() { }

  private idSource = new BehaviorSubject<any>("default");
  currentId = this.idSource.asObservable();


  changeId(id: any) {
    this.idSource.next(id)
  }
}
