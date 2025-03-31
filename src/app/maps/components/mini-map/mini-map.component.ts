import { AfterViewInit, Component, ElementRef, input, viewChild } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { environment } from '../../../../environments/environment';

//Cogemos el token de nuestro archivo enviroments
mapboxgl.accessToken = environment.mapboxKey

@Component({
  selector: 'app-mini-map',
  imports: [],
  templateUrl: './mini-map.component.html',
  styles: `
    div {
      width: 100%;
      height: 260px;
    }

  `,
})
export class MiniMapComponent implements AfterViewInit {
  divElement = viewChild<ElementRef>('map');
  lngLat = input.required<{ lng: number; lat: number }>();
  zoom = input<number>(14); //Por defecto el zoom será de 14 pero lo meteremos desde el html

  async ngAfterViewInit(){
    if(!this.divElement()?.nativeElement) return;

    //Esperamos a que se cargue un poco el mapa para nuestra app
    await new Promise((resolve) => setTimeout(resolve, 80));

    const element = this.divElement()!.nativeElement;

    const map = new mapboxgl.Map({
      container: element, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.lngLat(),
      zoom: this.zoom(),
      interactive: false, //Evita que se mueva el mapa, que no sea interactivo
      pitch: 15, //
    });

    new mapboxgl.Marker().setLngLat(this.lngLat()).addTo(map);
  }


}
