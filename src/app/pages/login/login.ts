import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  usuario = '';
  senha = '';

  constructor(private router: Router) {}

  /* Login */
  fazerLogin() {
    if (this.usuario === 'admin' && this.senha === '123456') {
      // Salva a permissão para o AuthGuard liberar a entrada
      localStorage.setItem('usuarioLogado', 'true'); 
      this.router.navigate(['/home']); /* Se acertar vai pra Home */
    } else {
      alert('Usuário ou senha inválidos. Tente novamente.'); /* Se errar, mostra o alerta*/
    }
  }
}