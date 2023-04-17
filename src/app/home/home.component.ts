import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { CourseDialogComponent } from "../course-dialog/course-dialog.component";
import { Course, sortCoursesBySeqNo } from "../model/course";
import { CoursesService } from "../services/courses.service";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  beginnerCourses: Course[];

  advancedCourses: Course[];

  constructor(private coursesService: CoursesService, private dialog: MatDialog) {}

  ngOnInit() {
    this.coursesService.getAllCourses().subscribe((res) => {
      const courses: Course[] = res.sort(sortCoursesBySeqNo);

      this.beginnerCourses = courses.filter(
        (course) => course.category == "BEGINNER"
      );

      this.advancedCourses = courses.filter(
        (course) => course.category == "ADVANCED"
      );
    });
  }

  editCourse(course: Course) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "400px";

    dialogConfig.data = course;

    const dialogRef = this.dialog.open(CourseDialogComponent, dialogConfig);
  }
}
