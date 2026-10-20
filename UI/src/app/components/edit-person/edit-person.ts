
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonService } from '../../services/person';
import { Person } from '../../Models/Person';
import { NotificationService } from '../../services/notification';

@Component({
  selector: 'app-edit-person',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-person.html',
  styleUrl: './edit-person.css'
})
export class EditPerson implements OnInit {

  private personService = inject(PersonService);
  private notification = inject(NotificationService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  errorMessage = '';

  person: Person = {
    id: 0,
    name: '',
    dateOfBirth: '',
    gender: 'Male'
  };

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.personService.getById(id).subscribe({
      next: (data) => {
        this.person = {
          ...data,
          dateOfBirth: data.dateOfBirth.substring(0, 10)
        };
      },
      error: () => {
        this.errorMessage = 'Unable to load person!';
      }
    });
  }

  updatePerson(): void {
    if (
      !this.person.name.trim() ||
      !this.person.dateOfBirth ||
      !this.person.gender
    ) {
      this.errorMessage = 'Please fill all fields!';
      return;
    }

    this.errorMessage = '';

    this.personService.Update(this.person.id, this.person).subscribe({
      next: () => {
        this.notification.show('Person updated successfully!', 'success');
        this.router.navigate(['/people']);
      },
      error: () => {
        this.errorMessage = 'Unable to update person!';
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/people']);
  }
}
