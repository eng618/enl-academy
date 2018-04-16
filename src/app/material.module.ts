import { NgModule } from '@angular/core';

import {
  MatExpansionModule,
  MatIconModule,
  MatMenuModule,
  MatToolbarModule
} from '@angular/material';

@NgModule({
  imports: [
    MatExpansionModule,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule
  ],
  exports: [
    MatExpansionModule,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule
  ]
})
export class MaterialModule { }
