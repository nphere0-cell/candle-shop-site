<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Best CSS Portfolio</title>
  <style>
    /* ================================
       Global Variables
    ================================= */
    :root {
      --bg-color: #ffffff;
      --text-color: #111111;
      --accent-color: #0077ff;
      --card-bg: #f9f9f9;
    }

    body.dark {
      --bg-color: #111111;
      --text-color: #f1f1f1;
      --accent-color: #00c3ff;
      --card-bg: #1e1e1e;
    }

    /* ================================
       Base Styles
    ================================= */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: 'Segoe UI', sans-serif;
      transition: all 0.3s ease-in-out;
    }

    body {
      background: var(--bg-color);
      color: var(--text-color);
      line-height: 1.6;
    }

    h1, h2, h3 {
      margin-bottom: 10px;
    }

    a {
      color: var(--accent-color);
      text-decoration: none;
      font-weight: 600;
    }
    a:hover {
      text-decoration: underline;
    }

    /* ================================
       Header
    ================================= */
    header {
      padding: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--card-bg);
      box-shadow: 0 4px 10px rgba(0,0,0,0.05);
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    header h1 {
      font-size: 24px;
    }

    /* ================================
       Theme Toggle Button
    ================================= */
    .theme-toggle {
      cursor: pointer;
      padding: 10px 15px;
      border-radius: 8px;
      border: none;
      background: var(--accent-color);
      color: white;
      font-weight: bold;
    }
    .theme-toggle:hover {
      opacity: 0.85;
    }

    /* ================================
       Hero Section
    ================================= */
    .hero {
      padding: 80px 20px;
      text-align: center;
    }
    .hero h2 {
      font-size: 40px;
      margin-bottom: 15px;
    }
    .hero p {
      font-size: 18px;
      color: var(--text-color);
      opacity: 0.8;
    }

    /* ================================
       Cards Section
    ================================= */
    .cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
      padding: 40px 20px;
    }

    .card {
      background: var(--card-bg);
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.05);
      transition: transform 0.3s ease;
    }
    .card:hover {
      transform: translateY(-10px);
    }

    /* ================================
       Footer
    ================================= */
    footer {
      text-align: center;
      padding: 20px;
      background: var(--card-bg);
      font-size: 14px;
      color: var(--text-color);
      opacity: 0.7;
    }
  </style>
</head>
<body>
  <header>
    <h1>My Portfolio</h1>
    <button class="theme-toggle" onclick="toggleTheme()">Switch Theme</button>
  </header>

  <section class="hero">
    <h2>Hello, I'm a Web Developer 🚀</h2>
    <p>I build modern, responsive, and user-friendly websites.</p>
  </section>

  <section class="cards">
    <div class="card">
      <h3>Project One</h3>
      <p>Amazing website with cool animations and responsive layout.</p>
    </div>
    <div class="card">
      <h3>Project Two</h3>
      <p>Dark & light theme support with smooth transitions.</p>
    </div>
    <div class="card">
      <h3>Project Three</h3>
      <p>Fully mobile-friendly design using CSS Grid and Flexbox.</p>
    </div>
  </section>

  <footer>
    © 2025 My Portfolio | All Rights Reserved
  </footer>

  <script>
    // ================================
    // Theme Toggle Function
    // ================================
    function toggleTheme() {
      document.body.classList.toggle('dark');
    }
  </script>
</body>
</html>
