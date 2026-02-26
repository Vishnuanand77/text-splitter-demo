export const SAMPLE_TEXTS = [
  {
    label: 'Wikipedia — Solar System',
    text: `The Solar System is the gravitationally bound system of the Sun and the objects that orbit it. Of the bodies that orbit the Sun directly, the largest are the four gas and ice giants and the four terrestrial planets, followed by an unknown number of dwarf planets and innumerable small Solar System bodies.

Of the bodies that orbit the Sun indirectly — the natural satellites — two are larger than Mercury, the smallest terrestrial planet, and one is nearly as large.

The Solar System formed 4.6 billion years ago from the gravitational collapse of a giant interstellar molecular cloud. The vast majority of the system's mass is in the Sun, with the majority of the remaining mass contained in the planet Jupiter.

The four inner system planets — Mercury, Venus, Earth and Mars — are terrestrial planets, being primarily composed of rock and metal. The four outer system planets are giant planets, being substantially more massive than the terrestrials.`,
  },
  {
    label: 'Code — Python classes',
    text: `import math
from dataclasses import dataclass

PI = 3.14159265

@dataclass
class Point:
    x: float
    y: float

    def distance_to(self, other: "Point") -> float:
        return math.sqrt((self.x - other.x) ** 2 + (self.y - other.y) ** 2)

    def __str__(self):
        return f"({self.x}, {self.y})"

class Circle:
    def __init__(self, center: Point, radius: float):
        self.center = center
        self.radius = radius

    def area(self) -> float:
        return PI * self.radius ** 2

    def circumference(self) -> float:
        return 2 * PI * self.radius

    def contains(self, point: Point) -> bool:
        return self.center.distance_to(point) <= self.radius

def main():
    origin = Point(0, 0)
    p = Point(3, 4)
    c = Circle(origin, 5.0)
    print(f"Distance: {origin.distance_to(p)}")
    print(f"Area: {c.area():.2f}")
    print(f"Contains {p}: {c.contains(p)}")

if __name__ == "__main__":
    main()`,
  },
  {
    label: 'Code — HTML page',
    text: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard</title>
    <style>
        body { font-family: system-ui, sans-serif; margin: 0; }
        .navbar { background: #1e293b; color: white; padding: 1rem 2rem; }
        .container { max-width: 960px; margin: 0 auto; padding: 2rem; }
        .card { border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem; }
        .card h3 { margin-top: 0; }
        .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
        .btn { background: #4f46e5; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; }
        .btn:hover { background: #4338ca; }
        footer { text-align: center; padding: 2rem; color: #64748b; }
    </style>
</head>
<body>
    <nav class="navbar">
        <h1>My Dashboard</h1>
    </nav>
    <div class="container">
        <h2>Welcome back, User</h2>
        <div class="grid">
            <div class="card">
                <h3>Statistics</h3>
                <p>Total users: <strong>1,234</strong></p>
                <p>Active today: <strong>89</strong></p>
                <button class="btn">View Details</button>
            </div>
            <div class="card">
                <h3>Revenue</h3>
                <p>This month: <strong>$12,345</strong></p>
                <p>Growth: <strong>+15%</strong></p>
                <button class="btn">View Report</button>
            </div>
            <div class="card">
                <h3>Recent Activity</h3>
                <ul>
                    <li>User signed up — 2 min ago</li>
                    <li>Order placed — 5 min ago</li>
                    <li>Payment received — 12 min ago</li>
                </ul>
            </div>
            <div class="card">
                <h3>Quick Actions</h3>
                <p>Manage your dashboard settings and preferences.</p>
                <button class="btn">Settings</button>
            </div>
        </div>
    </div>
    <footer>
        <p>&copy; 2026 My Dashboard. All rights reserved.</p>
    </footer>
</body>
</html>`,
  },
  {
    label: 'Poetry — The Road Not Taken',
    text: `Two roads diverged in a yellow wood,
And sorry I could not travel both
And be one traveler, long I stood
And looked down one as far as I could
To where it bent in the undergrowth;

Then took the other, as just as fair,
And having perhaps the better claim,
Because it was grassy and wanted wear;
Though as for that the passing there
Had worn them really about the same,

And both that morning equally lay
In leaves no step had trodden black.
Oh, I kept the first for another day!
Yet knowing how way leads on to way,
I doubted if I should ever come back.

I shall be telling this with a sigh
Somewhere ages and ages hence:
Two roads diverged in a wood, and I—
I took the one less traveled by,
And that has made all the difference.`,
  },
  {
    label: 'Technical — API documentation',
    text: `POST /api/users

Create a new user account. Requires authentication with an admin API key.

Request Headers:
- Authorization: Bearer <api_key>
- Content-Type: application/json

Request Body:
{
  "username": "string (required, 3-50 chars)",
  "email": "string (required, valid email)",
  "role": "string (optional, default: 'user')"
}

Response 201 Created:
{
  "id": "uuid",
  "username": "string",
  "email": "string",
  "role": "string",
  "created_at": "ISO 8601 timestamp"
}

Response 400 Bad Request:
{
  "error": "validation_error",
  "details": [{"field": "email", "message": "Invalid email format"}]
}

Response 409 Conflict:
{
  "error": "duplicate_user",
  "message": "A user with this email already exists"
}`,
  },
];
