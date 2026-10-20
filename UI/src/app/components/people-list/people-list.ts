
import { Component, inject, OnInit, signal } from '@angular/core';
import { PersonService } from '../../services/person';
import { Person } from '../../Models/Person';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NotificationService } from '../../services/notification';

@Component({
  standalone: true,
  imports: [RouterLink, DatePipe],
  selector: 'app-people-list',
  styleUrl: './people-list.css',
  templateUrl: './people-list.html',
})
export class PeopleList implements OnInit {

  private personService = inject(PersonService);
  private notification = inject(NotificationService);

  people = signal<Person[]>([]);
  loading = signal(false);
  errorMessage = signal('');

  selectedIds = signal<number[]>([]);

  personPendingDelete = signal<Person | null>(null);
  showBulkDeleteModal = signal(false);

  deleting = signal(false);

  ngOnInit(): void {
    this.loadPeople();
  }

  loadPeople(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.personService.getAll().subscribe({
      next: (data) => {
        this.people.set(data);

        this.selectedIds.update(ids =>
          ids.filter(id => data.some(person => person.id === id))
        );

        this.loading.set(false);
      },
      error: (error) => {
        console.error(error);
        this.errorMessage.set('Unable to load people');
        this.loading.set(false);
      }
    });
  }

  // Select or deselect one person
  togglePerson(id: number, checked: boolean): void {
    if (checked) {
      this.selectedIds.update(ids =>
        ids.includes(id) ? ids : [...ids, id]
      );
    } else {
      this.selectedIds.update(ids =>
        ids.filter(selectedId => selectedId !== id)
      );
    }
  }

  // Select or deselect all people
  toggleAll(checked: boolean): void {
    this.selectedIds.set(
      checked ? this.people().map(person => person.id) : []
    );
  }

  // Check whether person is selected
  isSelected(id: number): boolean {
    return this.selectedIds().includes(id);
  }

  // Check whether all people are selected
  allSelected(): boolean {
    return this.people().length > 0 &&
      this.people().every(person =>
        this.selectedIds().includes(person.id)
      );
  }

  // Clear selection
  clearSelection(): void {
    this.selectedIds.set([]);
  }

  // Single delete confirmation
  confirmDelete(person: Person): void {
    this.personPendingDelete.set(person);
  }

  cancelDelete(): void {
    this.personPendingDelete.set(null);
  }

  // Delete single person
  deletePerson(): void {
    const person = this.personPendingDelete();

    if (!person || this.deleting()) {
      return;
    }

    this.deleting.set(true);

    this.personService.Delete(person.id).subscribe({
      next: () => {
        this.personPendingDelete.set(null);

        this.people.update(people =>
          people.filter(item => item.id !== person.id)
        );

        this.selectedIds.update(ids =>
          ids.filter(id => id !== person.id)
        );

        this.deleting.set(false);

        this.notification.show(
          'Person deleted successfully!',
          'success'
        );
      },
      error: (error) => {
        console.error(error);
        this.deleting.set(false);
        this.personPendingDelete.set(null);

        this.notification.show(
          'Unable to delete person.',
          'danger'
        );
      }
    });
  }

  // Bulk delete confirmation
  confirmBulkDelete(): void {
    if (this.selectedIds().length === 0) {
      return;
    }

    this.showBulkDeleteModal.set(true);
  }

  cancelBulkDelete(): void {
    this.showBulkDeleteModal.set(false);
  }

  // Delete multiple people
  deleteSelectedPeople(): void {
    const ids = [...this.selectedIds()];

    if (ids.length === 0 || this.deleting()) {
      return;
    }

    this.deleting.set(true);

    this.personService.DeleteMultiple(ids).subscribe({
      next: (response) => {
        this.showBulkDeleteModal.set(false);

        this.people.update(people =>
          people.filter(person => !ids.includes(person.id))
        );

        this.selectedIds.set([]);
        this.deleting.set(false);

        this.notification.show(
          `${response.deletedCount} person(s) deleted successfully!`,
          'success'
        );
      },
      error: (error) => {
        console.error(error);
        this.showBulkDeleteModal.set(false);
        this.deleting.set(false);

        this.notification.show(
          'Unable to delete selected people.',
          'danger'
        );
      }
    });
  }
}
