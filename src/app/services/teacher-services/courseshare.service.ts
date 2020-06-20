import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseshareService {

  constructor() { }

  private dataSource = new BehaviorSubject<any>("default");
  currentData = this.dataSource.asObservable();


  changeData(data: string) {
    this.dataSource.next(data)
  }
}
