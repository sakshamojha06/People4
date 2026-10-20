import { Routes } from '@angular/router';
import { PeopleList } from './components/people-list/people-list';
import { AddPerson } from './components/add-person/add-person';
import { EditPerson } from './components/edit-person/edit-person';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'people',
        pathMatch: 'full'
    },
    {
        path: 'people',
        component: PeopleList
    },
    {
        path: 'add-person',
        component: AddPerson
    },
    {
        path: 'edit-person/:id',
        component: EditPerson
    }
];
