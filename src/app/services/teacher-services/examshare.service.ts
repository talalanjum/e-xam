import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExamshareService {
  constructor() { }

  private dataSource = new BehaviorSubject<any>("default");
  currentData = this.dataSource.asObservable();


  changeData(data: any) {
    this.dataSource.next(data)
  }
}
