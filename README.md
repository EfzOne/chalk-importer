# chalk-importer

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

This script will create three documents: `students`, `lessons` and `types`.

`students` includes information about each student.

`types` includes information about course selected by a student.

`lessons` includes information about which course(s) a student may attend.
