from typing import List


# In-memory student roster seeded to match frontend mock data
SEED_STUDENTS = [
    {
        "id": "1",
        "name": "Alexander Wright",
        "rollNumber": "CS2026-001",
        "uuid": "STU-A91F23",
        "status": "Evaluated",
        "course": "CS106B",
    },
    {
        "id": "2",
        "name": "Beatrice Vance",
        "rollNumber": "CS2026-002",
        "uuid": "STU-B88D41",
        "status": "Evaluated",
        "course": "CS106B",
    },
    {
        "id": "3",
        "name": "Carlos Mendez",
        "rollNumber": "CS2026-003",
        "uuid": "STU-C44E90",
        "status": "Requires Review",
        "course": "CS182",
    },
    {
        "id": "4",
        "name": "Diana Prince",
        "rollNumber": "CS2026-004",
        "uuid": "STU-D11F99",
        "status": "Evaluated",
        "course": "MATH51",
    },
    {
        "id": "5",
        "name": "Ethan Hunt",
        "rollNumber": "CS2026-005",
        "uuid": "STU-E77A12",
        "status": "Pending Verification",
        "course": "PHYS41",
    },
    {
        "id": "6",
        "name": "Fiona Gallagher",
        "rollNumber": "CS2026-006",
        "uuid": "STU-F33B88",
        "status": "Evaluated",
        "course": "CS106B",
    },
    {
        "id": "7",
        "name": "Gabriel Ross",
        "rollNumber": "CS2026-007",
        "uuid": "STU-G99C44",
        "status": "Evaluated",
        "course": "EE108",
    },
    {
        "id": "8",
        "name": "Hannah Abbott",
        "rollNumber": "CS2026-008",
        "uuid": "STU-H22D55",
        "status": "Requires Review",
        "course": "CS182",
    },
]


class StudentService:

    def get_students(self) -> List[dict]:
        """Return the full student roster."""
        return SEED_STUDENTS
