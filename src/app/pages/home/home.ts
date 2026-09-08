import { Component } from '@angular/core';

import { Menu } from '../../componentes/menu/menu'; 

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Menu],// Apresentando o Menu para o Home
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}
