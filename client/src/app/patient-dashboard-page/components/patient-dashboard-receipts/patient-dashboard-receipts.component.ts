import { Component } from '@angular/core';
import { Receipt } from 'src/app/shared/interfaces';
import { PatientService } from 'src/app/shared/services/patient.service';

interface ExtendedReceipt extends Receipt {
  medications: Array<{
    name: string;
    qr: string;
    quantity: number;
    dosage: string;
  }>;
}
@Component({
  selector: 'app-patient-dashboard-receipts',
  templateUrl: './patient-dashboard-receipts.component.html',
  styleUrls: ['./patient-dashboard-receipts.component.scss']
})
export class PatientDashboardReceiptsComponent {
  receipts: ExtendedReceipt[] = [];

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    console.log(this.receipts)
    this.loadReceipts();
  }

  loadReceipts(): void {
    this.patientService.getReceipts().subscribe(
      response => {
        this.receipts = response.receipts as ExtendedReceipt[];
        console.log(this.receipts);
      },
      error => {
        console.error('Error fetching receipts', error);
      }
    );
  }


}
