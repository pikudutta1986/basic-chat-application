import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// ROUTING MODULE
import { AppRoutingModule } from './app-routing.module';

// APP COMPONENT
import { AppComponent } from './app.component';

// USER COMPONENT
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';

// SERVICE


@NgModule({
  declarations: [
  AppComponent,   
  HeaderComponent,  
  HomeComponent, 
  ],
  imports: [
  BrowserModule,
  FormsModule,
  ReactiveFormsModule,
  HttpClientModule,
  AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
