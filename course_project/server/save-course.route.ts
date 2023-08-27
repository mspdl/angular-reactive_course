import { Request, Response } from "express";
import { setTimeout } from "timers";
import { COURSES } from "./db-data";

export function saveCourse(req: Request, res: Response) {
  const ERROR_MODE = false;

  if (ERROR_MODE) {
    console.log("ERROR saving course!");
    res.sendStatus(500);
    return;
  } else {
    const id = req.params["id"],
      changes = req.body;

    console.log("Saving course changes", id, JSON.stringify(changes));

    const newCourse = {
      ...COURSES[id],
      ...changes,
    };

    COURSES[id] = newCourse;

    console.log("new course version", newCourse);

    setTimeout(() => {
      res.status(200).json(COURSES[id]);
    }, 2000);
  }
}
