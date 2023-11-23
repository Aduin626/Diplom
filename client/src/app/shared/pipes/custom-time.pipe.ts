import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'customTime'})
export class CustomTimePipe implements PipeTransform {
  transform(value: string): string {
    return value ? value.substring(0, 5) : ''; 
  }
}