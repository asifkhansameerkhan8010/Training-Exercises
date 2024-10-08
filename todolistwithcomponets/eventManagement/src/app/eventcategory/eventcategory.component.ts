import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationbarComponent } from "../navigationbar/navigationbar.component";
import { BackupService } from '../backup.service';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-eventcategory',
  standalone: true,
  imports: [CommonModule, FormsModule, NavigationbarComponent,RouterLink,RouterLinkActive],
  templateUrl: './eventcategory.component.html',
  styleUrl: './eventcategory.component.css'
})
export class EventcategoryComponent implements OnInit {

  constructor(private backupService: BackupService) { }

  categories:string[]=[];
  categoryName:string='';
  errorMessage:string='';

  ngOnInit(): void {
    this.backupService.dataRestored.subscribe(() => {
      this.loadCategories();
    });
    const storedCategories = localStorage.getItem('categories');
    if (storedCategories) {
      this.categories = JSON.parse(storedCategories);
    }
    this.loadCategories();
  }
  loadCategories(): void {
    const storedCategories = localStorage.getItem('categories');
    if (storedCategories) {
      this.categories = JSON.parse(storedCategories);
    } else {
      this.categories = []; 
    }
  }

  addCategory():void{
    if(this.categoryName.trim()=='')
    {
      this.errorMessage="Category Cannot be Empty!"
      return;
    }
    this.categories.push(this.categoryName);
    this.savetoLocalstorage(this.categories)
    this.categoryName='';
    this.errorMessage='';

  }
  savetoLocalstorage(categories:string[])
  {
    localStorage.setItem('categories',JSON.stringify(categories));
  }
  deleteCategory(category:string):void
  {
    this.categories=this.categories.filter((cato=>cato!=category));
    this.savetoLocalstorage(this.categories);
  }
  editCategory(category:string)
  {
    this.categoryName=category;
    this.deleteCategory(category);
  }
}
