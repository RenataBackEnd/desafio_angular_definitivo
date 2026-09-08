import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; /* módulo de ferramentas */
import { Router } from '@angular/router'; /* serviço interno, não vai no imports:[] */

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  /* Vai guardar o que digitar */
  usuario = '';
  senha = '';

  constructor(private router: Router) {}

  /* Login */
  fazerLogin() {
    if (this.usuario === 'admin' && this.senha === '123456') {
      this.router.navigate(['/home']); /* Se acertar vai pra Home */
    } else {
      alert('Usuário ou senha inválidos. Tente novamente.'); /* Se errar, mostra o alerta*/
    }
  }
}
