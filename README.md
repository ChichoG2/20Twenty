# 20Twenty

20Twenty is a lightweight desktop app designed to help reduce eye strain by following the **20-20-20 rule**.

Every configured work interval, the app reminds you to look at something approximately **6 meters away** for a short visual break.

## Features

- Custom work and break durations
- Floating always-on-top timer widget
- Dedicated visual break window
- Persistent user settings
- Remembers the widget's last screen position
- Dark terminal-inspired interface
- Optional sound notifications
- Start automatically with Windows
- Lightweight desktop experience powered by Tauri

## Tech Stack

- **Tauri 2**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **Zustand**
- **pnpm**
- **Rust**

## Development

Clone the repository and install the dependencies:

```bash
git clone <repository-url>
cd 20Twenty
pnpm install
```

Run the application in development mode:

```bash
pnpm tauri dev
```

Create a production build:

```bash
pnpm tauri build
```

## 20-20-20 Rule

The 20-20-20 rule suggests that after approximately **20 minutes of screen use**, you should look at something about **20 feet / 6 meters away** for at least **20 seconds**.

20Twenty turns that habit into a simple desktop workflow.

## Project

This project was created as an open-source desktop application and portfolio project, with a focus on:

- Desktop development with Tauri
- Multi-window application architecture
- Persistent state and user preferences
- Native window behavior
- Clean and lightweight UI/UX

## License

This project is licensed under the **MIT License**.