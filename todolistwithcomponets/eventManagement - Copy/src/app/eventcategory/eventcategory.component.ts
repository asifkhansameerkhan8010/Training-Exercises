import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationbarComponent } from "../navigationbar/navigationbar.component";
import { BackupService } from '../backup.service';

@Component({
  selector: 'app-eventcategory',
  standalone: true,
  imports: [CommonModule, FormsModule, NavigationbarComponent],
  templateUrl: './eventcategory.component.html',
  styleUrls: ['./eventcategory.component.css'] // Fix styleUrl to styleUrls
})
export class EventcategoryComponent implements OnInit {
  categories: string[] = [];
  categoryName: string = '';
  errorMessage: string = '';

  constructor(private backupService: BackupService) { }

  ngOnInit(): void {
    this.backupService.dataRestored.subscribe(() => {
      this.loadCategories();
    });
    this.loadCategories(); // Load categories on init
  }

  loadCategories(): void {
    const storedCategories = localStorage.getItem('categories');
    this.categories = storedCategories ? JSON.parse(storedCategories) : [];
  }

  addCategory(): void {
    if (this.categoryName.trim() === '') {
      this.errorMessage = "Category Cannot be Empty!";
      return;
    }
    this.categories.push(this.categoryName);
    this.saveToLocalStorage(this.categories);
    this.categoryName = '';
    this.errorMessage = '';
  }

  saveToLocalStorage(categories: string[]) {
    localStorage.setItem('categories', JSON.stringify(categories));
  }

  deleteCategory(category: string): void {
    this.categories = this.categories.filter(cato => cato !== category);
    this.saveToLocalStorage(this.categories);
  }

  editCategory(category: string) {
    this.categoryName = category;
    this.deleteCategory(category);
  }
}
