import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { HttpClient } from "@angular/common/http";

@Injectable()
export class DataTableService {

	public search_model: Subject<string> = new Subject<string>();
  public paginator = {
    per_page: 10,
    page_number: null,
    search: '',
    pages: [1, 2, 3, 4, 5]
  };

  public laravelPaginationObject: any;

  constructor() {
    this.search_model.debounceTime(500)
      .distinctUntilChanged()
      .subscribe(search => {
        this.paginator.search = search;
        this.paginator.page_number = 1;
      });
  }

  public changePerPage (num) {
    this.paginator.per_page = num;
    this.paginator.page_number = 1;
    // this.getReportByMode();
  }

  public navigate (page) {
    this.paginator.page_number = parseInt(page, 10);
    switch (page) {
      case 'first':
        this.paginator.page_number = parseInt(this.laravelPaginationObject.first_page_url.split('page=')[1], 10);
        break;
      case 'last':
        this.paginator.page_number = this.laravelPaginationObject.last_page;
        break;
      case 'prev':
        this.paginator.page_number = parseInt(this.laravelPaginationObject.prev_page_url.split('page=')[1], 10);
        break;
      case 'next':
        this.paginator.page_number = parseInt(this.laravelPaginationObject.next_page_url.split('page=')[1], 10);
        break;
      default:
        // code...
        break;
    }
    // this.getReportByMode();
  }

  public setPagination () {
    if (this.laravelPaginationObject.current_page > 3) {
      if ((this.laravelPaginationObject.last_page - this.laravelPaginationObject.current_page) <= 3) {
        this.paginator.pages = [];
        for (let i = 0; i < 5; i++) {
          this.paginator.pages[i] = this.laravelPaginationObject.last_page - i;
        }
        this.paginator.pages.reverse();
      } else {
        for (let i = 0; i < 5; i++) {
          this.paginator.pages[i] = this.laravelPaginationObject.current_page + i - 2;
        }
      }
    } else if (this.laravelPaginationObject.last_page < 5) {
      this.paginator.pages = Array.from(Array(this.laravelPaginationObject.last_page), (v, i) => i + 1);
    } else {
      this.paginator.pages = [1, 2, 3, 4, 5];
    }
    (this.laravelPaginationObject.next_page_url === null && this.laravelPaginationObject.prev_page_url === null) ? this.paginator.pages = [1] : '';
  }

}
