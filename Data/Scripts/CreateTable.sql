create table if not exists People
(
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT NOT NULL,
    DateOfBirth TEXT NOT NULL,
    Gender TEXT NOT NULL
);