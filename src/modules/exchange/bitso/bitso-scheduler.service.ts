import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';

@Injectable()
export class BitsoSchedulerService {
  @Interval(5000)
  handleInterval() {
    console.log('Called every 5 seconds');
  }
}
