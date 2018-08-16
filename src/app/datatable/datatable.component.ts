import { Component, OnInit, Inject, forwardRef, ElementRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs/Subject";
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
  private paginator = {
    per_page: 10,
    page_number: null,
    search: '',
    pages: [1, 2, 3, 4, 5]
  };
  model_search: Subject<string> = new Subject<string>();
  value: any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  // dtElement: DataTableDirective = new DataTableDirective(this.el);

  constructor(private http: HttpClient,
              private el: ElementRef){
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
    this.paginator.page_number = parseInt(page, 10);
    switch (page) {
      case 'first':
        this.paginator.page_number = parseInt(this.records.first_page_url.split('page=')[1], 10);
        break;
      case 'last':
        this.paginator.page_number = this.records.last_page;
        break;
      case 'prev':
        this.paginator.page_number = parseInt(this.records.prev_page_url.split('page=')[1], 10);
        break;
      case 'next':
        this.paginator.page_number = parseInt(this.records.next_page_url.split('page=')[1], 10);
        break;
      default:
        // code...
        break;
    }
    this.initTable();
  }

  public changePerPage (num) {
    this.paginator.per_page = num;
    this.initTable();
  }

  public searchTable () {
    this.initTable();
    this.paginator.page_number = null;
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
    if (this.records.current_page > 3) {
      if ((this.records.last_page - this.records.current_page) <= 3) {
        this.paginator.pages = [];
        for (let i = 0; i < 5; i++) {
           this.paginator.pages[i] = this.records.last_page - i;
        }
        this.paginator.pages.reverse();
      } else {
        for (let i = 0; i < 5; i++) {
          this.paginator.pages[i] = this.records.current_page + i - 2;
        }
      }
    } else {
      this.paginator.pages = [1, 2, 3, 4, 5];
    }
    (this.records.next_page_url === null && this.records.prev_page_url === null) ? this.paginator.pages = [1] : '';
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
