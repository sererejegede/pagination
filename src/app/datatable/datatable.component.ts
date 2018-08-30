import { Component, OnInit, Inject, forwardRef, ElementRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs/Subject";
import { DataTableService } from '../data-table.service';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.css']
})

export class DatatableComponent implements OnInit{

  title = 'Data Table';
  public load = false;
  public test = false;
  public records: any;
  private path = 'https://ws.educhoicetest.com.ng/api/v1/profile/country?origin=crysto-portal.educhoicetest.com.ng';
  public paginator = {
    per_page: 10,
    page_number: null,
    search: '',
    pages: [1, 2, 3, 4, 5]
  };
  model_search: Subject<string> = new Subject<string>();
  value: any;

  constructor(private http: HttpClient,
              private el: ElementRef,
              private dataTableService: DataTableService){
    this.model_search.debounceTime(500)
                     .distinctUntilChanged()
                     .subscribe(search => {
                        this.paginator.search = search;
                        this.initTable();
                        this.paginator.page_number = null;
                      }
);
  }

  ngOnInit(): void {
   this.initTable(); 
  }

  public navigate (page) {
    this.dataTableService.navigate(page);
    this.initTable();
  }

  public changePerPage (num) {
    this.dataTableService.changePerPage(num);
    this.initTable();
  }

  public initTable () {
    this.load = true;
    this.getBackend().subscribe(
      (backendResponse) => {
        this.load = false;
      this.records = backendResponse;
      this.setPagination();
      },(error) => {
        this.load = false;
        console.log(error);
      });
  }

  private setPagination () {
    this.dataTableService.laravelPaginationObject = this.records;
    this.dataTableService.setPagination();
    this.paginator = this.dataTableService.paginator;
  }

  goToPlace(){
    // window.location.href = '#place'
    // this.document.body.scroll()
    console.log(this.el.nativeElement.querySelector('#place'));
    this.el.nativeElement.querySelector('#place').scrollIntoView();
    // this.value.scrollIntoView();
  }

  public getBackend(sort = this.paginator.per_page) {
    const path = (this.paginator.page_number) ? `${this.path}&pages=${sort}&page=${this.paginator.page_number}` : `${this.path}&pages=${sort}`
    const search_path = (this.paginator.search) ? `${path}&search=${this.paginator.search}` : path;
    return this.http.get(search_path);
     // http://localhost/Codes/PHP/data.php/
  }
}
