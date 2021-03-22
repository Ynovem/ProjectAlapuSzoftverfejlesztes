import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenStorageService } from '../_services/token-storage.service';

@Injectable()
export class UserGuard implements CanActivate {

	constructor(private tokenStorage: TokenStorageService, private router: Router) {}

	canActivate(): Observable<boolean> | Promise<boolean> | boolean {
		return this.tokenStorage.getUser().pipe(map(logged => {
				if(!logged) {
					this.router.navigate(['login']);
					return false;
				}
				return true;
			})
		)
	}
}