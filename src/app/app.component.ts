import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from './product.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'product-management';

  productForm: FormGroup = new FormGroup({});
  productObj: Product = new Product();
  productList: Product[] = [];
  searchTerm: string = '';
  categoryFilter: string = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;

  constructor() {
    this.createForm();
    const oldData = localStorage.getItem('productData');
    if (oldData != null) {
      const parseData = JSON.parse(oldData);
      this.productList = parseData;
    }
  }

  createForm() {
    this.productForm = new FormGroup({
      id: new FormControl(this.productObj.id),
      name: new FormControl(this.productObj.name, [Validators.required]),
      category: new FormControl(this.productObj.category, [Validators.required]),
      price: new FormControl(this.productObj.price, [Validators.required]),
    });
  }

  onClick() {
    const oldData = localStorage.getItem('productData');
    if (oldData != null) {
      const parseData = JSON.parse(oldData);
      this.productForm.controls['id'].setValue(parseData.length + 1);
      this.productList.unshift(this.productForm.value);
    } else {
      this.productList.unshift(this.productForm.value);
    }
    localStorage.setItem('productData', JSON.stringify(this.productList));
    this.productObj = new Product();
    this.createForm();
  }

  onEdit(item: Product) {
    this.productObj = item;
    this.createForm();
  }

  onUpdate() {
    const record = this.productList.find((p) => p.id == this.productForm.controls['id'].value);
    if (record != undefined) {
      record.name = this.productForm.controls['name'].value;
      record.category = this.productForm.controls['category'].value;
      record.price = this.productForm.controls['price'].value;
    }
    localStorage.setItem('productData', JSON.stringify(this.productList));
    this.productObj = new Product();
    this.createForm();
  }

  onDelete(id: number) {
    const isDelete = confirm('Are you sure you want to delete?');
    if (isDelete) {
      const index = this.productList.findIndex((p) => p.id == id);
      this.productList.splice(index, 1);
      localStorage.setItem('productData', JSON.stringify(this.productList));
    }
  }

  filteredProducts() {
    return this.productList.filter((product) => {
      const matchesName = product.name
        .toLowerCase()
        .includes(this.searchTerm.trim().toLowerCase());
      const matchesCategory = this.categoryFilter
        ? product.category.toLowerCase().includes(this.categoryFilter.trim().toLowerCase())
        : true;
      const matchesPrice =
        (this.minPrice == null || product.price >= this.minPrice) &&
        (this.maxPrice == null || product.price <= this.maxPrice);

      return matchesName && matchesCategory && matchesPrice;
    });
  }
  getUniqueCategories(): string[] {
    const categories = this.productList.map((product) => product.category);
    return Array.from(new Set(categories));
  }
}
