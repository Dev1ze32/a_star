Campus Navigation Simulator

A React-based interactive map for navigating a campus layout. This project features a "Designer Mode" allowing developers to visualize coordinates and customize building layouts, rooms, and road networks dynamically.

🛠️ Tech Stack

Framework: React

Styling: Tailwind CSS

Icons: Lucide React

Language: JavaScript/JSX

🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

Prerequisites

Ensure you have Node.js installed (version 16 or higher is recommended).
You can check your version by running:

node -v


Installation

Clone the repository:

git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
cd your-repo-name


Install dependencies:

npm install
# or if using yarn
yarn install


Running the Application

To start the development server:

npm run dev
# or for Create React App
npm start


Open http://localhost:5173 (or http://localhost:3000) to view the simulator in your browser.

🗺️ How to Use Designer Mode

The application includes a built-in Designer Mode to help you customize the map without guessing pixel values.

Find Coordinates: Hover your mouse over any area of the map. Look at the Top Right corner of the screen to see the exact X and Y coordinates.

Edit the Map: Open campus_navigator_demo.jsx in your code editor.

Add Nodes: Locate the // AREA 1: YOUR CUSTOM ROADS & NODES section and use the helper functions:

// Syntax: addNode(id, label, x, y, floor, type, building)
addNode('gate_1', 'Main Gate', 270, 1000, 'Ground', 'entrance', 'Outside');


Connect Nodes: Create paths between them:

// Syntax: addEdge(fromId, toId, weight)
addEdge('gate_1', 'path_1', 100);


📂 Project Structure

src/campus_navigator_demo.jsx: The main component containing the map logic, rendering, and coordinate systems.

tailwind.config.js: Configuration for styling (ensure this is set up if moving files to a new project).

🤝 Contributing

Fork the repository

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request
