import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuizshareService {
  
  constructor() { }

  private dataSource = new BehaviorSubject<any>("default");
  currentData = this.dataSource.asObservable();


  changeData(data: any) {
    this.dataSource.next(data)
  }
}
