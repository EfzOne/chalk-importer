# chalk-importer

[![Dependency Status](https://david-dm.org/EfzOne/chalk-importer.svg)](https://david-dm.org/EfzOne/chalk-importer)

Import Student Data to Database

## Data Example `data.csv`

```
| . | Physics    | . | . | . | Chemistry  | . | . | . | Geography  | . | . | . | Physiology | . | . | . | History    | . | . | . | Politics   | . | . |
| - | ---------- | - | - | - | ---------- | - | - | - | ---------- | - | - | - | ---------- | - | - | - | ---------- | - | - | - | ---------- | - | - |
| . | .......... | . | . | . | .......... | . | . | . | .......... | . | . | . | .......... | . | . | . | .......... | . | . | . | .......... | . | . |
| . | 20180101   | . | . | . | 20180101   | . | . | . | 20180101   | . | . | . | 20180102   | . | . | . | 20180102   | . | . | . | 20180104   | . | . |
| . | 20180101   | . | . | . | 20180101   | . | . | . | 20180101   | . | . | . | 20180102   | . | . | . | 20180102   | . | . | . | 20180104   | . | . |
```

The first two rows should not contain student data. From the third row, put students' id in specified columns if he or she select this course.

## Database

This script will create three documents: `students`, `courses`.

`students` includes information of each student. Also, this script will add courses one selects in it.

`courses` includes information of all courses.
