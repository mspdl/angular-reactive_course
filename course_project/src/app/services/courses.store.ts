import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, map, shareReplay, tap } from "rxjs/operators";
import { LoadingService } from "../loading/loading.service";
import { MessagesService } from "../messages/messages.service";
import { Course, sortCoursesBySeqNo } from "../model/course";

@Injectable({ providedIn: "root" })
export class CoursesStore {
  private courseSubject = new BehaviorSubject<Course[]>([]);

  courses$: Observable<Course[]> = this.courseSubject.asObservable();

  constructor(
    private httpClient: HttpClient,
    private loadingService: LoadingService,
    private messagesService: MessagesService
  ) {
    this.loadAllCourses();
  }

  private loadAllCourses() {
    const loadCourses$ = this.httpClient.get<Course[]>("/api/courses").pipe(
      map((response) => response["payload"]),
      catchError((error) => {
        const message = "Could not load courses";
        this.messagesService.showErrors(message);
        console.log("message:", message, "\nerror: ", error);
        return throwError(error);
      }),
      tap((courses) => this.courseSubject.next(courses))
    );
    this.loadingService.isLoading(loadCourses$).subscribe();
  }

  saveCourse(
    courseId: string,
    changedCourse: Partial<Course>
  ): Observable<any> {
    const previousCourses = this.courseSubject.getValue();
    const foundCourseIndex = previousCourses.findIndex(
      (course) => course.id === courseId
    );
    let updatedCourse: Course = null;
    if (foundCourseIndex >= 0) {
      updatedCourse = {
        ...previousCourses[foundCourseIndex],
        ...changedCourse,
      };

      const updatedCourses: Course[] = previousCourses.slice(0);
      updatedCourses[foundCourseIndex] = updatedCourse;

      this.courseSubject.next(updatedCourses);

      return this.httpClient
        .put(`/api/courses/${courseId}`, changedCourse)
        .pipe(
          catchError((error) => {
            const message = "Could not save the course";
            this.messagesService.showErrors(message);
            console.log("message:", message, "\nerror: ", error);
            return throwError(error);
          }),
          shareReplay()
        );
    } else {
      return throwError(() => console.log("No course found"));
    }
  }

  filterByCategory(category: string): Observable<Course[]> {
    return this.courses$.pipe(
      map((courses) => {
        return courses
          .filter((course) => course.category === category)
          .sort(sortCoursesBySeqNo);
      })
    );
  }
}
