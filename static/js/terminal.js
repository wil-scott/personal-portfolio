const outputDiv = document.getElementById('output');
const userInputSpan = document.getElementById('userInput');
const cursorSpan = document.getElementById('cursor');
const suggestionText = document.querySelector('.suggestion-text');
const prompt = document.querySelector('.prompt');

let currentPath = '~';
let commandHistory = [];
let historyIndex = -1;
let suggestions = [];
let suggestionIndex = -1;
let isExecuting = false;

const filesystem = {
    '~': {
        'aboutme.txt': `
┌─────────────────────────────────────────────────┐
│           Wilson Scott - Software Engineer      │
└─────────────────────────────────────────────────┘

I'm a software engineer specializing in C++, Python, and machine learning, with a keen interest in APIs and tailored data solutions.
My unique background in both technical and legal fields allows me to approach complex problems with a versatile perspective.

My experience includes developing automation features for 3D scanning
software, creating tools for embedded devices, and managing complex
projects with multiple stakeholders.

Technical Skills:
- C/C++ Development
- Python Programming
- Embedded Systems
- Linux Systems
- Machine Learning Libraries
- Version Control & CI/CD

Business Skills:
- Cross-functional Collaboration
- Stakeholder Management
- Technical Communication
- Project Planning
- Resource Management

I'm passionate about building robust software solutions that solve
real-world problems efficiently. My interdisciplinary background
allows me to bridge the gap between technical requirements and
business needs.

Type 'cat resume.txt' to see my full professional experience
or 'ls projects' to explore my technical projects.
`,
        'projects': {
            type: 'directory',
            contents: {
                'zero3-boot-wizard.txt': `
┌─────────────────────────────────────────────────┐
│     Orange Pi Zero3 Boot Wizard                 │
└─────────────────────────────────────────────────┘

A Python-based utility that automates the creation of bootable
images for the Orange Pi Zero3 single-board computer.

Key Features:
- Fully automated image creation process
- Formats microSD cards with the proper partitioning
- Clones necessary repositories
- Compiles all required binaries
- Bootstraps the root filesystem
- Object-oriented design for maintainability

This tool transforms a manual process that would take over an hour
into an automated solution that requires minimal user intervention.

Technologies: Python, Linux, Bash

GitHub: https://github.com/wil-scott/Zero3-Boot-Wizard
`,
                'tabletop-vehicle.txt': `
┌─────────────────────────────────────────────────┐
│     Tabletop Vehicle                            │
└─────────────────────────────────────────────────┘

An autonomous battery-powered vehicle capable of detecting
surface edges, reorienting itself, and continuing to drive
without falling off the edge.

Key Components:
- ATMEGA328p microcontroller
- HC-SR04 distance sensors
- L293D motor controllers
- OLED display
- Custom schematics and PCB design

Implementation Details:
- Custom C drivers for all sensors and components
- I2C driver built using ATMEGA328p's TWI module
- Edge detection and avoidance algorithms
- Power management for extended battery life

Technologies: C, Embedded Systems, Circuit Design

GitHub: https://github.com/wil-scott/tabletop-vehicle-project
`,
                'pointkit-automation.txt': `
┌─────────────────────────────────────────────────┐
│     PointKit:Scan Automation Feature            │
└─────────────────────────────────────────────────┘

Led the development of an automation feature for PointKit:Scan
that streamlined industrial quality assurance processes.

Implementation Challenges:
- Working with a large, undocumented C++ codebase
- Porting functionality from legacy C# to C++
- Navigating complex third-party APIs
- Building a custom C++ DLL for application integration

Results:
- Successfully deployed to production
- Significantly improved client's QA workflow
- Reduced manual intervention in scanning processes
- Enhanced software interoperability

Technologies: C++, C#, DLL Development, 3D Scanning
`
            }
        },
        'resume.txt': `
┌─────────────────────────────────────────────────┐
│               WILSON SCOTT                      │
│            SOFTWARE ENGINEER                    │
└─────────────────────────────────────────────────┘

Contact Information
------------------
Email: wilwscott@gmail.com
Website: www.wil-scott.com
GitHub: github.com/wil-scott
LinkedIn: linkedin.com/in/wil-scott

Technical Skills
---------------
Programming and Scripting:
  C++, Python, C, JavaScript, HTML, CSS, Bash, Batch, Inno Setup

Libraries and Frameworks:
  Numpy, Pandas, PyTorch, TensorFlow, Keras, SciKit-Learn, 
  Matplotlib, SQL

Systems and Tools:
  Linux, Vim, Git, Make, Jira, Jenkins, Visual Studio

Business Skills
--------------
Interpersonal:
  Cross-functional collaboration, stakeholder engagement, 
  and technical-client communication

Analytical:
  Research and analysis, risk management, writing and drafting

Management Skills:
  Time management, resource management, strategic planning

Experience
---------
Software Engineer (C/C++), Polyga Inc. – Vancouver, BC
July 2024 – February 2025
• Led development of an automation feature for PointKit:Scan that 
  streamlined a client's industrial quality assurance processes, 
  resulting in the successful deployment of the feature for general use
• Collaborated with a multidisciplinary team to integrate new features 
  and meet client project goals and requirements
• Adapted quickly to a large, undocumented C++ codebase, implementing 
  features and refactoring modules with minimal ramp-up time
• Ported key functionality from a legacy C# codebase to C++ while 
  navigating a complex third-party API
• Designed, built, and tested a custom C++ DLL to enable C-based 
  application integration with a proprietary SDK

Embedded Software Engineer Co-op, Sierra Wireless – Richmond, BC
May 2022 – December 2022
• Designed and implemented a Python tool to troubleshoot devices 
  that failed quality assurance testing on the factory line
• Developed a Python tool using Jira's REST API to improve the 
  team's workflow when managing new tickets
• Debugged a Yocto recipe that improved the recipe's compatibility 
  with new hardware
• Rewritten production-line debugging documentation, simplifying technical 
  content for factory workers with a plain-language approach

Director/Counsel, Murphy & Company LLP – Vancouver, BC
October 2017 – September 2021
• Led the successful acquisition of a mid-sized law firm in my role 
  as director of a boutique law firm
• Managed a law firm with 10-15 full-time staff, hundreds of clients, 
  and $750,000+ in yearly revenue while helping to nurture a 
  collaborative and supportive workplace
• Regularly distilled complex legal principles into clear, accessible 
  summaries for clients all while working within their budget

Projects
-------
Orange Pi Zero3 Boot Wizard
github.com/wil-scott/Zero3-Boot-Wizard
• Developed a Python tool that generates a bootable image for the 
  Orange Pi Zero3 and formats a microSD card with it
• Used OOP design principles to automate a previously manual, hour-long 
  process of cloning repositories, compiling binaries, bootstrapping the 
  root filesystem, and formatting the destination block device

Tabletop Vehicle
github.com/wil-scott/tabletop-vehicle-project
• Designed and built a battery-powered car that autonomously detects 
  surface edges, reorients itself, and continues driving.
• Designed a schematic to map out connections for each sensor and component 
• Wrote drivers in C for the HC-SR04 distance sensor, the OLED screen, 
  and the L293D motor module
• Wrote an I2C driver in C using the ATMEGA328p's two-wire serial 
  interface (TWI) module

Education
--------
British Columbia Institute of Technology
Computer Systems Technology Diploma, With Distinction (2023)

University of British Columbia
Juris Doctor (2016)

Trent University
Bachelor of Business Administration, Honours (2013)

Memberships
----------
Law Society of British Columbia (2017)
`,
        'contact.txt': `
┌─────────────────────────────────────────────────┐
│               CONTACT INFORMATION               │
└─────────────────────────────────────────────────┘

Email: wilwscott@gmail.com
Website: www.wil-scott.com
LinkedIn: linkedin.com/in/wil-scott
GitHub: github.com/wil-scott

Feel free to reach out if you have any questions or 
would like to discuss potential collaborations.

Use the 'email' command to open your email client.
`,
        'blog': {
            type: 'directory',
            contents: {
                'optimizing-ml-models.txt': `
┌─────────────────────────────────────────────────┐
│    Optimizing ML Models for Embedded Devices    │
└─────────────────────────────────────────────────┘

Date: 2023-05-15

Machine learning on microcontrollers presents unique challenges
due to limited memory and processing power. In this post, I'll
share techniques for optimizing neural networks for these
constrained environments.

1. Quantization
---------------
Converting 32-bit floating point weights to 8-bit integers
can reduce model size by 75% with minimal accuracy loss.

2. Pruning
----------
Removing unnecessary connections in neural networks can
significantly reduce model size without affecting performance.

3. Knowledge Distillation
-------------------------
Training a smaller network to mimic a larger one can create
efficient models that maintain good accuracy.

4. Layer Fusion
--------------
Combining operations to reduce memory transfers and
computational overhead.

These techniques have enabled me to run complex neural networks
on devices with as little as 256KB of RAM.
`,
                'sensor-fusion-techniques.txt': `
┌─────────────────────────────────────────────────┐
│    Sensor Fusion Techniques for Robotics        │
└─────────────────────────────────────────────────┘

Date: 2023-03-10

Reliable perception in robotics requires combining data from 
multiple sensors. Here's an overview of effective fusion methods:

1. Kalman Filtering
------------------
The workhorse of sensor fusion, particularly effective for
systems with Gaussian noise and linear dynamics.

2. Particle Filters
------------------
For non-linear systems with non-Gaussian noise, particle filters
provide robust state estimation.

3. Factor Graphs
---------------
A newer approach that can represent complex probabilistic
relationships between sensor measurements.

4. Deep Learning Approaches
--------------------------
Using neural networks to learn optimal fusion strategies from
data, particularly effective for camera-lidar fusion.

Each approach has its strengths, and the best choice depends
on your specific application constraints.
`
            }
        }
    }
};

const commands = {
    help: {
        description: "Display help information",
        usage: "help [command]",
        execute: (args) => {
            if (args.length > 0) {
                const command = args[0];
                if (commands[command]) {
                    return [
                        `Command: ${command}`,
                        `Description: ${commands[command].description}`,
                        `Usage: ${commands[command].usage}`
                    ];
                } else {
                    return [`Command not found: ${command}`];
                }
            }
            
            const result = ["Available commands:"];
            Object.keys(commands).sort().forEach(cmd => {
                result.push(`  ${cmd.padEnd(12)} - ${commands[cmd].description}`);
            });
            return result;
        }
    },
    ls: {
        description: "List directory contents",
        usage: "ls [directory]",
        execute: (args) => {
            const path = args.length > 0 ? args[0] : currentPath;
            const dir = getDirectory(path);
            
            if (!dir) {
                return [`ls: cannot access '${path}': No such file or directory`];
            }
            
            const content = Object.keys(dir).sort();
            const result = [];
            
            for (const item of content) {
                if (typeof dir[item] === 'object' && dir[item].type === 'directory') {
                    result.push(`<span class="directory">${item}/</span>`);
                } else if (item.endsWith('.txt')) {
                    result.push(`<span class="file">${item}</span>`);
                } else {
                    result.push(`<span class="executable">${item}</span>`);
                }
            }
            
            return result;
        }
    },
    cd: {
        description: "Change directory",
        usage: "cd [directory]",
        execute: (args) => {
            if (args.length === 0 || args[0] === '~') {
                currentPath = '~';
                updatePrompt();
                return [];
            }
            
            let path = args[0];
            if (path === '..') {
                if (currentPath === '~') {
                    return [];
                }
                const parts = currentPath.split('/');
                parts.pop();
                currentPath = parts.join('/') || '~';
                updatePrompt();
                return [];
            }
            
            const targetPath = path.startsWith('~') ? path : `${currentPath}/${path}`.replace(/\/\//g, '/');
            const dir = getDirectory(targetPath);
            
            if (!dir) {
                return [`cd: ${path}: No such file or directory`];
            }
            
            currentPath = targetPath;
            updatePrompt();
            return [];
        }
    },
    cat: {
        description: "Display file contents",
        usage: "cat <file>",
        execute: (args) => {
            if (args.length === 0) {
                return ["Usage: cat <file>"];
            }
            
            const filename = args[0];
            const file = getFile(filename);
            
            if (!file) {
                return [`cat: ${filename}: No such file or directory`];
            }
            
            return [file];
        }
    },
    clear: {
        description: "Clear the terminal screen",
        usage: "clear",
        execute: () => {
            outputDiv.innerHTML = '';
            return [];
        }
    },
    pwd: {
        description: "Print working directory",
        usage: "pwd",
        execute: () => {
            return [currentPath];
        }
    },
    echo: {
        description: "Display a line of text",
        usage: "echo [text]",
        execute: (args) => {
            return [args.join(' ')];
        }
    },
    whoami: {
        description: "Display current user",
        usage: "whoami",
        execute: () => {
            return ["visitor"];
        }
    },
    date: {
        description: "Display current date and time",
        usage: "date",
        execute: () => {
            return [new Date().toString()];
        }
    },
    open: {
        description: "Open a link",
        usage: "open <URL>",
        execute: (args) => {
            if (args.length === 0) {
                return ["Usage: open <URL>"];
            }
            
            const url = args[0];
            if (url.startsWith('http')) {
                window.open(url, '_blank');
                return [`Opening ${url} in a new tab...`];
            } else {
                return [`open: ${url}: No such file or URL`];
            }
        }
    },
    email: {
        description: "Send an email",
        usage: "email",
        execute: () => {
            window.location.href = "mailto:wilwscott@gmail.com";
            return ["Opening email client..."];
        }
    },
    welcome: {
        description: "Display welcome message",
        usage: "welcome",
        execute: () => {
            return showWelcome();
        }
    }
};

function getDirectory(path) {
    if (path === '~') return filesystem['~'];
    
    const parts = path.replace(/^~\//, '').split('/').filter(Boolean);
    let current = filesystem['~'];
    
    for (const part of parts) {
        if (!current[part] || current[part].type !== 'directory') {
            return null;
        }
        current = current[part].contents;
    }
    
    return current;
}

function getFile(path) {
    const isAbsolutePath = path.includes('/');
    
    if (isAbsolutePath) {
        const parts = path.replace(/^~\//, '').split('/');
        const filename = parts.pop();
        const dirPath = parts.length > 0 ? '~/' + parts.join('/') : '~';
        const dir = getDirectory(dirPath);
        
        if (!dir) return null;
        return dir[filename];
    } else {
        const dir = getDirectory(currentPath);
        if (!dir) return null;
        return dir[path];
    }
}

function updatePrompt() {
    prompt.textContent = `visitor@wilson:${currentPath}$`;
}

function showWelcome() {
    return [
        "<span class='ascii-art'>",
        "  __      __ _  _                 _____            _   _   ",
        "  \\ \\    / /(_)| |               / ____|          | | | |  ",
        "   \\ \\  / /  _ | | ___   ___  _ | (___    ___  ___| |_| |_ ",
        "    \\ \\/ /  | || |/ __| / _ \\| | \\___ \\  / __|/ _ \\ __| __|",
        "     \\  /   | || |\\__ \\|  __/| | ____) || (__| (_) | |_| |_",
        "      \\/    |_||_||___/ \\___||_||_____/  \\___|\\___/ \\__|\\__|",
        "</span>",
        "",
        "<span class='info'>Welcome to my interactive terminal portfolio!</span>",
        "",
        "I'm a software engineer specializing in C++, Python, and embedded systems.",
        "This terminal allows you to explore my background and projects.",
        "Type <span class='highlight'>help</span> to see available commands.",
        "",
        "Quick navigation:",
        "- <span class='highlight'>cat aboutme.txt</span> - Learn about me",
        "- <span class='highlight'>ls projects</span> - See my projects",
        "- <span class='highlight'>cat resume.txt</span> - View my resume",
        "- <span class='highlight'>cat contact.txt</span> - Get contact info",
        ""
    ];
}

function getTabCompletions(input) {
    const tokens = input.trim().split(' ');
    const lastToken = tokens[tokens.length - 1];
    
    // Command completion
    if (tokens.length === 1) {
        return Object.keys(commands).filter(cmd => cmd.startsWith(lastToken));
    }
    
    // File/directory completion for commands that expect them
    const command = tokens[0];
    if (['cat', 'cd', 'ls'].includes(command)) {
        const dir = getDirectory(currentPath);
        if (!dir) return [];
        
        return Object.keys(dir).filter(item => {
            return item.startsWith(lastToken);
        });
    }
    
    return [];
}

function handleTab(e) {
    e.preventDefault();
    
    const input = userInputSpan.textContent;
    if (!input) return;
    
    if (suggestionIndex === -1) {
        suggestions = getTabCompletions(input);
        if (suggestions.length === 0) return;
    }
    
    suggestionIndex = (suggestionIndex + 1) % suggestions.length;
    
    const tokens = input.split(' ');
    tokens[tokens.length - 1] = suggestions[suggestionIndex];
    userInputSpan.textContent = tokens.join(' ');
}

function navigateHistory(direction) {
    if (commandHistory.length === 0) return;
    
    historyIndex = Math.min(
        Math.max(0, historyIndex + direction),
        commandHistory.length - 1
    );
    
    userInputSpan.textContent = commandHistory[historyIndex];
    moveCursorToEnd();
}

async function executeCommand(commandLine) {
    const tokens = commandLine.trim().split(' ');
    const cmd = tokens[0].toLowerCase();
    const args = tokens.slice(1);
    
    if (cmd === '') return;
    
    if (commands[cmd]) {
        isExecuting = true;
        let result;
        
        try {
            result = commands[cmd].execute(args);
            if (result instanceof Promise) {
                // Show loading indicator
                const loadingDiv = document.createElement('div');
                loadingDiv.innerHTML = "<span class='loading'></span> Executing...";
                outputDiv.appendChild(loadingDiv);
                
                result = await result;
                outputDiv.removeChild(loadingDiv);
            }
        } catch (error) {
            result = [`<span class='error'>Error executing ${cmd}: ${error.message}</span>`];
        }
        
        for (const line of result) {
            const outputLine = document.createElement('div');
            outputLine.innerHTML = line;
            outputDiv.appendChild(outputLine);
        }
        
        isExecuting = false;
    } else {
        const errorLine = document.createElement('div');
        errorLine.className = 'error';
        errorLine.textContent = `Command not found: ${cmd}`;
        outputDiv.appendChild(errorLine);
    }
    
    // Scroll to bottom
    outputDiv.scrollTop = outputDiv.scrollHeight;
}

function handleCommand(command) {
    // Echo the command
    const commandEcho = document.createElement('div');
    commandEcho.innerHTML = `<span class="prompt">visitor@wilson:${currentPath}$</span> ${command}`;
    outputDiv.appendChild(commandEcho);
    
    // Store in history
    if (command.trim()) {
        commandHistory.unshift(command);
        if (commandHistory.length > 50) commandHistory.pop();
    }
    
    historyIndex = -1;
    
    // Execute the command
    executeCommand(command);
}

function handleKeyDown(e) {
    if (isExecuting) {
        e.preventDefault();
        return;
    }
    
    // Tab completion
    if (e.key === 'Tab') {
        handleTab(e);
        return;
    }
    
    // Reset tab completion
    suggestionIndex = -1;
    
    // Handle special keys
    switch (e.key) {
        case 'Enter':
            e.preventDefault();
            const command = userInputSpan.textContent;
            userInputSpan.textContent = '';
            handleCommand(command);
            break;
        case 'ArrowUp':
            e.preventDefault();
            navigateHistory(1);
            break;
        case 'ArrowDown':
            e.preventDefault();
            if (historyIndex <= 0) {
                historyIndex = -1;
                userInputSpan.textContent = '';
            } else {
                navigateHistory(-1);
            }
            break;
        case 'l':
            if (e.ctrlKey) {
                e.preventDefault();
                commands.clear.execute();
            }
            break;
    }
}

function moveCursorToEnd() {
    const range = document.createRange();
    const sel = window.getSelection();
    
    range.selectNodeContents(userInputSpan);
    range.collapse(false);
    
    sel.removeAllRanges();
    sel.addRange(range);
}

userInputSpan.addEventListener('keydown', handleKeyDown);
userInputSpan.addEventListener('input', moveCursorToEnd);

document.addEventListener('click', () => {
    if (!window.getSelection().toString()) {
        userInputSpan.focus();
        moveCursorToEnd();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Set focus to input
    userInputSpan.focus();
    
    // Show welcome message
    const welcomeLines = showWelcome();
    for (const line of welcomeLines) {
        const outputLine = document.createElement('div');
        outputLine.innerHTML = line;
        outputDiv.appendChild(outputLine);
    }
    
    // Update prompt
    updatePrompt();
}); 