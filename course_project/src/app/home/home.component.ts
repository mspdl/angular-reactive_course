import { Component, OnInit } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { LoadingService } from "../loading/loading.service";
import { MessagesService } from "../messages/messages.service";
import { Course, sortCoursesBySeqNo } from "../model/course";
import { CoursesService } from "../services/courses.service";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  beginnerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;

  constructor(
    private coursesService: CoursesService,
    private loadingService: LoadingService,
    private messagesService: MessagesService
  ) {}

  ngOnInit() {
    this.reloadCourses();
  }

  reloadCourses() {
    const courses$ = this.coursesService.loadAllCourses()
      .pipe(
        map((courses) => courses.sort(sortCoursesBySeqNo)),
        catchError((error) => {
          const message = "Could not load courses";
          this.messagesService.showErrors(message);
          console.log("message:", message, "\nerror: ", error);
          return throwError(error);
        })
    );

    const loadCourses$ = this.loadingService.isLoading(courses$);

    this.beginnerCourses$ = loadCourses$.pipe(
      map((courses: Course[]) =>
        courses.filter((course: Course) => course.category === "BEGINNER")
      )
    );

    this.advancedCourses$ = loadCourses$.pipe(
      map((courses: Course[]) =>
        courses.filter((course: Course) => course.category === "ADVANCED")
      )
    );
  }
}
