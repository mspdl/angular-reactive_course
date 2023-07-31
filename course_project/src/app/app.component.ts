import { Component } from "@angular/core";
import { LoadingService } from "./loading/loading.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  providers: [LoadingService],
})
export class AppComponent {
  constructor(private loadingService: LoadingService) {}

  logout() {}
}
