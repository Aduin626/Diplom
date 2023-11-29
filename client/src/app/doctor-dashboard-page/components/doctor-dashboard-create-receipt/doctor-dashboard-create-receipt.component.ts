import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Receipt, ReceiptDoctor } from 'src/app/shared/interfaces';
import { DoctorService } from 'src/app/shared/services/doctor.service';

@Component({
  selector: 'app-doctor-dashboard-create-receipt',
  templateUrl: './doctor-dashboard-create-receipt.component.html',
  styleUrls: ['./doctor-dashboard-create-receipt.component.scss']
})
export class DoctorDashboardCreateReceiptComponent {
  patientId: number | undefined; // Здесь сохраняем ID выбранного пациента
  selectedMedication: string = '';
  receipt: ReceiptDoctor = {
    patient_id: 0,
    issue_date: '',
    expiry_date: '',
    description: '',
    items: [],
 
  };
  availableMedications: any[] = [];

  constructor(private doctorService: DoctorService,  private route: ActivatedRoute) {}

  ngOnInit() {
    this.patientId = Number(this.route.snapshot.paramMap.get('id'));
    this.receipt.patient_id=this.patientId

    this.doctorService.getAvailableMedications().subscribe({
      next: data => this.availableMedications = data,
      error: error => console.error('Ошибка при загрузке медикаментов', error)
    });
  }
  

  
  addItem(): void {
    const selectedMedication = this.availableMedications.find(medication => medication.item_id === Number(this.selectedMedication));

    if (selectedMedication) {
      this.receipt.items.push({
        item_id: 0,
        name: selectedMedication.name,
        quantity: 0,
        dosage: ''
      });
    }
  }

  removeItem(index: number): void {
    this.receipt.items.splice(index, 1);
  }


  submitReceipt(): void {
    this.doctorService.createReceipt(this.receipt).subscribe({
      
      next: response => console.log('Рецепт успешно создан', response),
      error: error => console.error('Ошибка при создании рецепта', error)
    });
    console.log(this.receipt)
  }
}
