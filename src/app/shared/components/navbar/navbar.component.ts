import { Component, inject, Type } from '@angular/core';
import { routes } from '../../../app.routes';
import { NavigationEnd, Resolve, ResolveFn, Router, RouterLink } from '@angular/router';
import { filter, map, Observable, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import {toSignal} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-navbar',
  imports: [ RouterLink],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  //Inyectamos el objeto Router para poder saber en qué ruta http estamos
  router = inject(Router);

  routes = routes.map( (route) => ({
    path: route.path,
    title: `${route.title ?? 'Maps en Angular'}`,
  })).filter( (route) => route.path != '**');

  // Le ponemos el símbolo de $ para saber que es un observable o toSignal para convertirlo
  //pageTitle$ = this.router.events.pipe(
  pageTitle = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      //tap permite disparar efectos secundarios
      //tap( (event) => console.log(event)),
      //un map para que solo muestre la url del evento
      map((event) => event.url),
      //mapeo de la url para mostrar el título de la ruta y no la url
      map((url) => routes.find((route) => `/${route.path}` == url)?.title ?? 'Mapas'),
  ));

}

