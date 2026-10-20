import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class Person {
    private http = inject(HttpClient);

    private apiUrl = 'http://localhost:5044/api/Person';

    getAll(): Observable<Person[]> {
        return this.http.get<Person[]>(this.apiUrl);
    }

    getById(id: number): Observable<Person> {
        return this.http.get<Person>(`${this.apiUrl}/${id}`);
    }

    Create(person: Person): Observable<string> {
        return this.http.post(this.apiUrl, person, { responseType: 'text' });
    }

    Update(id: number, person: Person): Observable<string> {
        return this.http.put(`${this.apiUrl}/${id}`, person, { responseType: 'text' });
    }

    Delete(id: number): Observable<string> {
        return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
    }

    DeleteMultiple(ids: number[]): Observable<{
        message: string;
        deletedCount: number;
    }> {
        return this.http.delete<{
            message: string;
            deletedCount: number;
        }>(`${this.apiUrl}/many`, { body: ids });
    }
}
