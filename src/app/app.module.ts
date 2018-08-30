import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { DatatableComponent } from './datatable/datatable.component';
import { DataTableService } from './data-table.service';


@NgModule({
  declarations: [
    AppComponent,
      DatatableComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
  ],
  providers: [DataTableService],
  bootstrap: [AppComponent]
})
export class AppModule { }
