// ---- year ----
document.getElementById('year').textContent = new Date().getFullYear();

// ---- mobile nav toggle ----
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
navToggle.addEventListener('click', () => navbar.classList.toggle('open'));
document.querySelectorAll('.nav-links a').forEach((a) => {
  a.addEventListener('click', () => navbar.classList.remove('open'));
});

// ---- scroll reveal (fade-up / reveal / clouds) ----
const revealTargets = document.querySelectorAll('.fade-up, .reveal, .cloud');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
revealTargets.forEach((el) => observer.observe(el));

// ---- cloud parallax on scroll ----
const clouds = Array.from(document.querySelectorAll('.cloud'));
let ticking = false;
function updateParallax() {
  const y = window.scrollY;
  clouds.forEach((el) => {
    const speed = parseFloat(el.dataset.speed) || 0.1;
    el.style.transform = `translateY(${y * speed}px)`;
  });
  ticking = false;
}
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(updateParallax);
    ticking = true;
  }
});

// ---- terminal ----
const output = document.getElementById('terminal-output');
const input = document.getElementById('terminal-input');
const history = [];
let historyIndex = -1;

const commands = ['help', 'about', 'skills', 'experience', 'projects', 'contact', 'whoami', 'clear', 'sudo'];

const responses = {
  help: `Available commands:
  <span class="accent">about</span>        — who I am
  <span class="accent">skills</span>       — tech stack
  <span class="accent">experience</span>   — work history
  <span class="accent">projects</span>     — selected work
  <span class="accent">contact</span>      — get in touch
  <span class="accent">whoami</span>       — quick identity check
  <span class="accent">clear</span>        — clear the terminal`,

  about: `Mina Şenel — Computer Engineering student and software/AI developer.
Focused on RAG systems and local LLM architectures, with a solid
foundation in C++, Python, and backend engineering.`,

  skills: `C++          ████████████████░░░░
Python       ██████████████████░░
JavaScript   ███████████████░░░░░
HTML/CSS     ████████████████░░░░
Git          █████████████████░░░
RAG Systems  ███████████████░░░░░
Local LLMs   ██████████████░░░░░░`,

  experience: `[Aug 2026–Present]  BI & Data Intern @ Martı İleri Teknoloji
               → ML model training, production-ready solutions, team collaboration
[Summer 2026]  AI Summer Innovators Program @ Microsoft
               → ML fundamentals, mentorship, stock price prediction project
[Spring 2026]  AI Product Development Intern @ Y İnovasyon
               → RAG systems, local LLM architectures
[Summer 2025]  Software Development Intern @ BİM Bilişim Teknolojileri Ofisi
               → Backend systems, Git workflows`,

  projects: `1. Stock Price Prediction    — ML model, built @ Microsoft AI Summer Innovators
2. Local RAG Assistant       — local LLM + custom retriever
3. Engineering Coursework Tools — C++/Python utilities

Browse them all → github.com/minasenel`,

  contact: `Email:  minasenel34@gmail.com
GitHub: github.com/minasenel

Feel free to reach out — always happy to talk software or AI.`,

  whoami: `mina-senel :: computer-engineering-student :: software-ai-developer`,

  sudo: `Nice try. Permission denied — this terminal runs on good faith only.`,
};

function appendLine(html, opts = {}) {
  const line = document.createElement('div');
  line.className = opts.className || 'term-line';
  line.innerHTML = html;
  output.appendChild(line);
  output.scrollTop = output.scrollHeight;
}

function printWelcome() {
  appendLine(`Welcome to Mina's portfolio terminal. Type <span class="accent">help</span> to get started.`, {
    className: 'term-line term-muted',
  });
}

function runCommand(raw) {
  const cmd = raw.trim().toLowerCase();
  appendLine(`<span class="accent">➜</span> <span class="tilde">~</span> <span class="accent">$</span> ${escapeHtml(raw)}`, {
    className: 'term-line term-echo',
  });

  if (!cmd) return;

  history.push(raw);
  historyIndex = history.length;

  if (cmd === 'clear') {
    output.innerHTML = '';
    return;
  }

  if (responses[cmd]) {
    appendLine(responses[cmd], { className: 'term-line' });
  } else {
    appendLine(`command not found: <span class="accent">${escapeHtml(cmd)}</span> — type <span class="accent">help</span> for a list of commands.`, { className: 'term-line' });
  }
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    runCommand(input.value);
    input.value = '';
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (historyIndex > 0) {
      historyIndex -= 1;
      input.value = history[historyIndex] || '';
    }
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (historyIndex < history.length - 1) {
      historyIndex += 1;
      input.value = history[historyIndex] || '';
    } else {
      historyIndex = history.length;
      input.value = '';
    }
  } else if (e.key === 'Tab') {
    e.preventDefault();
    const partial = input.value.trim().toLowerCase();
    if (!partial) return;
    const match = commands.find((c) => c.startsWith(partial));
    if (match) input.value = match;
  }
});

document.querySelectorAll('.cmd-chip').forEach((btn) => {
  btn.addEventListener('click', () => {
    const cmd = btn.getAttribute('data-cmd');
    input.value = cmd;
    runCommand(cmd);
    input.value = '';
    input.focus();
  });
});

document.getElementById('terminal').addEventListener('click', () => input.focus());

printWelcome();
