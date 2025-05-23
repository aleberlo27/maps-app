import { AfterViewInit, Component, effect, ElementRef, signal, viewChild } from '@angular/core';

//importamos mapbox
import mapboxgl from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"
import { environment } from '../../../environments/environment';
import { DecimalPipe, JsonPipe } from '@angular/common';

//Cogemos el token de nuestro archivo enviroments
mapboxgl.accessToken = environment.mapboxKey

@Component({
  selector: 'app-fullscreen-map-page',
  imports: [DecimalPipe, JsonPipe],
  templateUrl: './fullscreen-map-page.component.html',
  styles:`
    div {
      width: 100vw;
      height: calc( 100vh - 64px);
    }

    #controls {
      background-color: white;
      padding: 10px;
      border-radius: 5px;
      position: fixed;
      bottom: 25px;
      right: 20px;
      z-index: 9999;
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
      border: 1px solid #e2e8f0;
      width: 250px;
    }
  `,
})
export class FullscreenMapPageComponent implements AfterViewInit{

  // 'map' es la referencia al div del .html
  divElement = viewChild<ElementRef>('map');
  map = signal<mapboxgl.Map|null>(null);

  zoom = signal(2);
  coordinates = signal({
    lng: -3.7038,
    lat: 40.4168
  });

  zoomEffect = effect(() => {
    if(!this.map()) return;
    //this.map()!.zoomTo(this.zoom()); animación dinámica
    this.map()!.setZoom(this.zoom());
  });

  async ngAfterViewInit() {
    if(!this.divElement()?.nativeElement) return;

    //Esperamos a que se cargue un poco el mapa para nuestra app
    await new Promise((resolve) => setTimeout(resolve, 80));

    const element = this.divElement()!.nativeElement;
    const {lng, lat} = this.coordinates();

    const map = new mapboxgl.Map({
      container: element, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [lng, lat], // starting position [lng, lat]
      zoom: this.zoom(), // starting zoom
    });

    this.map.set(map);
    this.mapListeners(map);
  }

    //Crear el listener para que cada vez que el zoom cambie y no sea con la barra que hemos puesto
    // nos notifique y con esta notificación cambiamos la señal de de la barra
  mapListeners(map: mapboxgl.Map){
    //Cambia el número del zoom en el div cuando termina de hacer zoom
    map.on('zoomend', (event) => {
      const newZoom = event.target.getZoom();
      this.zoom.set(newZoom);
    });

    map.on('moveend', () =>{
      const center = map.getCenter();
      //console.log({center});
      this.coordinates.set(center);
    });

    //Con esto hacemos que cuando clique en el fullScreen (Se crea con este addControl) sea el foco completo
    map.addControl( new mapboxgl.FullscreenControl());
    //Un + y - (como la barra que hemos creado nosotros) para controlar el zoom
    map.addControl( new mapboxgl.NavigationControl());
    //Para ver la escala en metros
    map.addControl( new mapboxgl.ScaleControl());

    this.map.set(map);
  }
}
