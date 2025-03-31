import { AfterViewInit, Component, ElementRef, signal, viewChild } from '@angular/core';
//importamos mapbox
import mapboxgl from 'mapbox-gl';
import { environment } from '../../../environments/environment';

//Cogemos el token de nuestro archivo enviroments
mapboxgl.accessToken = environment.mapboxKey

@Component({
  selector: 'app-markers-page',
  imports: [],
  templateUrl: './markers-page.component.html',
  styles:`
    div {
        width: 100vw;
        height: calc( 100vh - 64px);
    }
  `
})
export class MarkersPageComponent implements AfterViewInit{

  divElement = viewChild<ElementRef>('map');
  map = signal<mapboxgl.Map|null>(null);

  async ngAfterViewInit() {
    if(!this.divElement()?.nativeElement) return;

    //Esperamos a que se cargue un poco el mapa para nuestra app
    await new Promise((resolve) => setTimeout(resolve, 80));

    const element = this.divElement()!.nativeElement;

    const map = new mapboxgl.Map({
      container: element,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-2.141854, 40.065359],
      zoom: 16,
    });

    const marker = new mapboxgl.Marker({
      draggable: false, //Propiedad para que se pueda mover el marcador
      color: '#000'
    })
    .setLngLat([-2.141854, 40.065359])
    .addTo(map);

    marker.on('dragend', (event) => {
      console.log(event);
    });

    this.mapListeners(map);
  }

  mapListeners(map: mapboxgl.Map){
    console.log('object');
  }

}
