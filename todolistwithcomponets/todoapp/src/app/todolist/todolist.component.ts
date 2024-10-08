import { CommonModule } from '@angular/common';
import { Component, Input,Output,EventEmitter } from '@angular/core';
import { listInformation } from '../Models/taskmodel';

@Component({
  selector: 'app-todolist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './todolist.component.html',
  styleUrl: './todolist.component.css'
})
export class TodolistComponent {
  @Input() listcomponentlist:listInformation[]=[];
  @Output() edit = new EventEmitter<number>(); 
  @Output() delete = new EventEmitter<number>(); 

  editItem(id: number) {
    this.edit.emit(id);
  }

  deleteItem(id: number) {
    this.delete.emit(id);
  }
  
}
