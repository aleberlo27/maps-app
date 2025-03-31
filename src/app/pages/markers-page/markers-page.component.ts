import { AfterViewInit, Component, ElementRef, signal, viewChild } from '@angular/core';
//importamos mapbox
import mapboxgl, { LngLatLike, MapMouseEvent } from 'mapbox-gl';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs';
import {v4 as UUIDv4} from 'uuid';
import { JsonPipe } from '@angular/common';

//Cogemos el token de nuestro archivo enviroments
mapboxgl.accessToken = environment.mapboxKey

interface Marker{
  id: string,
  mapboxMarker: mapboxgl.Marker
}


@Component({
  selector: 'app-markers-page',
  imports: [JsonPipe],
  templateUrl: './markers-page.component.html',
})
export class MarkersPageComponent implements AfterViewInit{

  divElement = viewChild<ElementRef>('map');
  map = signal<mapboxgl.Map|null>(null);
  markers = signal<Marker[]>([]);

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
    /*
    const marker = new mapboxgl.Marker({
      draggable: false, //Propiedad para que se pueda mover el marcador
      color: '#000'
    })
    .setLngLat([-2.141854, 40.065359])
    .addTo(map);

    marker.on('dragend', (event) => {
      console.log(event);
    });
    */

    this.mapListeners(map);
  }

  mapListeners(map: mapboxgl.Map){
    map.on('click', (event) => this.mapClick(event));
    this.map.set(map);
  }

  mapClick(event: mapboxgl.MapMouseEvent){
    //controlamos que el mapa se haya creado
    if(!this.map()) return;

    //Guardamos el mapa en una constante
    const map = this.map()!;

    //Crear un color de forma random
    const color = '#xxxxxx'.replace(/x/g, (y) =>
      ((Math.random() * 16) | 0).toString(16)
    );
    //Guardamos las coordenadas en una constante
    const coords = event.lngLat;

    //Creamos el marcador
    const marker = new mapboxgl.Marker({
      draggable: false, //Propiedad para que se pueda mover el marcador
      color: color,
    })
    .setLngLat(coords)
    .addTo(map);

    const newMarker : Marker = {
      id: UUIDv4(),
      mapboxMarker: marker
    }


    this.markers.update(markers => [newMarker, ...markers]);
    console.log(this.markers());
  }


  //Creamos este método para poder volver al marcador que hay en el <div> de Marcadores
  flyToMarker(lngLat: LngLatLike){
    if(!this.map()) return;

    this.map()?.flyTo({
      center: lngLat,
    });
  }

  //Para eliminar marcadores
  deleteMarker(marker: Marker){
    if(!this.map()) return;
    const map = this.map()!;
    //Eliminamos el marker del mapa pero no de la lista
    marker.mapboxMarker.remove();
    //Eliminamos el marker de la lista como objeto
    this.markers.set(this.markers().filter((m) => m.id != marker.id));
  }
}
