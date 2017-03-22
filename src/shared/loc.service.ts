import { Injectable } from '@angular/core';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';

@Injectable() export class LocService {
    constructor() { }

    getCurrentPosition(): Observable<Position> {
        return new Observable((observer: Observer<Position>) => {
            navigator.geolocation.getCurrentPosition(
                // Success callback.
                (position: Position) => {
                    observer.next(position);
                    observer.complete();
                },
                // Error callback.
                (error: PositionError) => {
                    console.log('Geolocation service: ' + error.message);
                    observer.error(error);
                }

            );

        });

    }

}
