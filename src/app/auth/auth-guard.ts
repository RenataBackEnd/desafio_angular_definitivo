import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // Verifica se o usuário está logado salvando o token no navegador
  const usuarioLogado = localStorage.getItem('usuarioLogado');

  if (usuarioLogado === 'true') {
    return true; // Deixa passar para o Dashboard
  } else {
    alert('Faça o login primeiro para acessar o painel!');
    router.navigate(['/login']); // Manda de volta pra tela de login
    return false; // Bloqueia a rota
  }
};
