# CodeAble

# Accessible Code Editor for Visually Impaired Users

# Overview 

The **Accessible Code Editor** is a browser-based coding environment designed to empower visually impaired (VI) users to write, run, and test JavaScript code using keyboard navigation and audio feedback. Built with accessibility-first principles, the platform ensures that users can interact seamlessly with the interface through screen readers, voice prompts, and simple controls.

---

##  Features

* ✅ **Accessible UI** — High-contrast design, large fonts, and keyboard-first navigation
* 🗣️ **Text-to-Speech (TTS)** — Audio feedback for syntax errors and program output
* 💬 **ARIA & Live Regions** — Fully screen reader compatible (JAWS, NVDA)
* 🧠 **JavaScript Execution** — Evaluate code securely in-browser using `eval()`
* 🎛️ **Audio Toggle** — Turn spoken feedback on or off as needed
* 🧪 **Future-Ready** — Supports future integration of Python, AI code assistant, and Braille output

---

## ️ Tech Stack

| Component             | Technology                 |
| --------------------- | -------------------------- |
| UI & Layout           | HTML, CSS                  |
| Logic & Execution     | JavaScript (`eval`)        |
| Voice Output          | Web Speech API (TTS)       |
| Accessibility         | ARIA, semantic HTML        |
| Optional Backend      | Node.js, Firebase (future) |
| AI Assistant (future) | OpenAI API (GPT/Codex)     |
| Braille Integration   | BRLTTY, Liblouis           |

---

##  User Flow Summary

```
User → Welcome Page → Select Language → Code Editor
  └─→ Write Code
      ├─→ Run Code → Output Displayed + Spoken
      ├─→ Speak Button → Reads code aloud
      ├─→ Analyze Button → Future AI Feedback
      └─→ Clear Button → Resets the editor
```

---

##  File Structure

```
accessible-editor/
│
├── index.html        # Main HTML file
├── styles.css        # Styling for accessibility
├── script.js         # JavaScript logic and TTSx
└── README.md         # Project documentation
```

---

##  Accessibility Principles

* Fully navigable via `Tab`, `Enter`, and arrow keys
* Descriptive `aria-labels` and roles for all elements
* Color schemes optimized for low-vision contrast standards
* `aria-live="polite"` regions to dynamically read output/errors

---

##  Future Enhancements

*  Voice-to-code using Web Speech API / Whisper
*  AI-based code suggestions using OpenAI Codex
*  Braille display output using Liblouis
*  Save and share code snippets with authentication
*  Multilingual TTS and command input support

---

##  Getting Started

1. Clone the repository
2. Open `index.html` in any modern browser (Chrome recommended)
3. Type JavaScript in the code editor
4. Click "Run Code" or use the keyboard to hear spoken output

---

##  Contributors

*  Project Lead: Kavya Shree
*  Concept: Inclusive design for visually impaired coders
* �️ Tech & Dev: HTML, JavaScript, Web Speech API

---

##  License

This project is licensed under the MIT License.

---

##  Acknowledgments

Special thanks to accessibility advocates and educators working to make coding more inclusive for all learners.

