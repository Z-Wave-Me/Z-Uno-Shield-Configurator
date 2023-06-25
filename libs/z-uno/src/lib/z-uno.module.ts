import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { zUnoRoutes } from './lib.routes';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(zUnoRoutes)],
})
export class ZUnoModule {}
