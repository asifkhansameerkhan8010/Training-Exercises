import { Routes } from '@angular/router';
import { LoginformComponent } from './loginform/loginform.component';
import { SignupComponent } from './signup/signup.component';
import { UserdashboardComponent } from './userdashboard/userdashboard.component';
import { EventformComponent } from './eventform/eventform.component';
import { ManageguestComponent } from './manageguest/manageguest.component';
import { AdmindashboardComponent } from './admindashboard/admindashboard.component';
import { EventcategoryComponent } from './eventcategory/eventcategory.component';
import { BackuphistoryComponent } from './backuphistory/backuphistory.component';


export const routes: Routes = [
    {
        path:'',
        component:LoginformComponent
    },
    {
        path:'login',
        component:LoginformComponent
    },
    {
        path:'signup',
        component:SignupComponent
    },
    {
        path:'admindashboard',
        component:AdmindashboardComponent
    },
    {
        path:'userdashboard',
        component:UserdashboardComponent
    },
    {
        path:'eventform/:eventId',
        component:EventformComponent
    },
    {
        path:'eventform',
        component:EventformComponent
    },
    {
        path:'manageguest/:eventId',
        component: ManageguestComponent
    },
    {
        path: 'manageguest', 
        component: ManageguestComponent
    },
    {
        path:"category",
        component:EventcategoryComponent
    },
    {
        path:"backuphis",
        component:BackuphistoryComponent
    }
];
