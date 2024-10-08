import { Component } from '@angular/core';
import { TodolistComponent } from "../todolist/todolist.component";
import { listInformation } from '../Models/taskmodel';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inputcomponent',
  standalone: true,
  imports: [TodolistComponent,FormsModule],
  templateUrl: './inputcomponent.component.html',
  styleUrls: ['./inputcomponent.component.css']
})
export class InputcomponentComponent {

  listdata:listInformation[]=[];
  namegiven:string='';
  taskgiven:string='';
  quans:number=0;
  editingItemId: number | null = null;
  addInfoUpdate(){
    if (this.editingItemId !== null) {
      const itemIndex = this.listdata.findIndex(item => item.id === this.editingItemId);
      if (itemIndex !== -1) {
        this.listdata[itemIndex] = {
          id: this.editingItemId,
          name: this.namegiven.trim(),
          task: this.taskgiven,
          quantity: this.quans
        };
        this.editingItemId = null;
      }
    } else {
      const singleResponse: listInformation = {
        id: Date.now(),
        name: this.namegiven.trim(),
        task: this.taskgiven,
        quantity: this.quans
      };
      this.listdata.push(singleResponse);
    }
    this.clearForm();
    console.log(this.listdata);
  }
  getdata(){
    return this.listdata;
  }
  handleEdit(id: number) 
  {
    const item = this.listdata.find(item => item.id === id);
    if (item) {
      this.namegiven = item.name;
      this.taskgiven = item.task;
      this.quans = item.quantity;
      this.editingItemId = id;
    }
  }
  handleDelete(id: number)
  {
    this.listdata=this.listdata.filter((item)=>(item.id!==id));
  }
  clearForm() {
    this.namegiven = '';
    this.taskgiven = '';
    this.quans = 0;
    this.editingItemId = null;
  }
}
