import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { map, shareReplay, tap } from "rxjs/operators";
import { User } from "../model/user";

const AUTH_DATA = "auth_data";

@Injectable({ providedIn: "root" })
export class AuthStore {
  private subjectUser = new BehaviorSubject<User>(null);

  user$: Observable<User> = this.subjectUser.asObservable();
  isLoggedIn$: Observable<boolean>;
  isLoggedOut$: Observable<boolean>;

  constructor(private http: HttpClient) {
    this.isLoggedIn$ = this.user$.pipe(map((user) => !!user));
    this.isLoggedOut$ = this.isLoggedIn$.pipe(map((loggedIn) => !loggedIn));

    const localUser = localStorage.getItem(AUTH_DATA);
    if (localUser) {
      this.subjectUser.next(JSON.parse(localUser));
    }
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<User>("/api/login", { email, password }).pipe(
      tap((user) => {
        this.subjectUser.next(user);
        localStorage.setItem(AUTH_DATA, JSON.stringify(user));
      }),
      shareReplay()
    );
  }

  logout() {
    this.subjectUser.next(null);
    localStorage.removeItem(AUTH_DATA);
  }
}
