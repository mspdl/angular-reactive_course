import { Component } from "@angular/core";
import { LoadingService } from "./loading.service";

@Component({
  selector: "loading",
  templateUrl: "./loading.component.html",
  styleUrls: ["./loading.component.css"],
})
export class LoadingComponent {

  constructor(protected loadingService: LoadingService){}
}
