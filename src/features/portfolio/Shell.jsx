import React, { useState, useEffect, useRef } from 'react';
import { Terminal, X, Minus, Square, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Shell = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState([
    { type: 'system', content: 'WiandtOS [Version 1.0.2]' },
    { type: 'system', content: '(c) 2026 Guillermo Wiandt. All rights reserved.' },
    { type: 'info', content: 'Type "help" for a list of commands.' },
    { type: 'br' }
  ]);
  const [currentPath, setCurrentPath] = useState('~');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  const inputRef = useRef(null);
  const bottomRef = useRef(null);
  const navigate = useNavigate();

  // File System
  const fileSystem = {
    '~': {
      type: 'dir',
      contents: {
        'projects': 'dir',
        'about.txt': 'file',
        'contact.md': 'file',
        'resume.pdf': 'file',
        'secret.bin': 'file'
      }
    },
    '~/projects': {
      type: 'dir',
      contents: {
        'evolution_ai.exe': 'exec',
        'pathfinder.exe': 'exec',
        'sorter.exe': 'exec',
        'neural_net.exe': 'exec',
        'shell_source.c': 'file'
      }
    }
  };

  const fileContents = {
    'about.txt': "I am a CS student at WPI (2026) passionate about Systems Programming, AI, and Full-Stack Web Development.",
    'contact.md': "Email: gwiandt@wpi.edu\nLinkedIn: linkedin.com/in/guillermo-wiandt",
    'shell_source.c': "#include <stdio.h>\nint main() { printf(\"Hello World\"); return 0; }",
    'secret.bin': "01001000 01101001 00100001 00100000 01011001 01101111 01110101 00100000 01100110 01101111 01110101 01101110 01100100 00100000 01101101 01100101"
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [output]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            setInput(commandHistory[commandHistory.length - 1 - newIndex]);
        }
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            setInput(commandHistory[commandHistory.length - 1 - newIndex]);
        } else {
            setHistoryIndex(-1);
            setInput('');
        }
    } else if (e.key === 'Tab') {
        e.preventDefault();
        handleTabCompletion();
    } else if (e.key === 'Enter') {
        executeCommand();
    }
  };

  const handleTabCompletion = () => {
      const parts = input.trim().split(' ');
      const currentInput = parts[parts.length - 1];
      const currentDirObj = fileSystem[currentPath];
      if (!currentDirObj) return;
      const matches = Object.keys(currentDirObj.contents).filter(file => file.startsWith(currentInput));
      if (matches.length === 1) {
          parts[parts.length - 1] = matches[0];
          setInput(parts.join(' '));
      }
  };

  const executeCommand = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setCommandHistory(prev => [...prev, trimmed]);
    setHistoryIndex(-1);
    const newOutput = [...output, { type: 'command', path: currentPath, content: trimmed }];
    const parts = trimmed.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch(cmd) {
        case 'help':
            newOutput.push({ type: 'success', content: 'Available commands: ls, cd, cat, clear, ./[exec], open, sudo, whoami' });
            break;
        case 'clear':
            setOutput([]);
            setInput('');
            return;
        case 'whoami':
             newOutput.push({ type: 'info', content: 'visitor@wpi-portfolio' });
             break;
        case 'sudo':
             newOutput.push({ type: 'error', content: 'Permission denied: You are not Guillermo.' });
             break;
        case 'ls':
            const dir = fileSystem[currentPath];
            const files = Object.keys(dir.contents).map(name => {
                const type = dir.contents[name];
                return { name, type };
            });
            newOutput.push({ type: 'ls', content: files });
            break;
        case 'cd':
            if (!args[0] || args[0] === '~') {
                setCurrentPath('~');
            } else if (args[0] === '..') {
                if (currentPath !== '~') setCurrentPath('~');
            } else if (args[0] === 'projects' && currentPath === '~') {
                setCurrentPath('~/projects');
            } else {
                newOutput.push({ type: 'error', content: `cd: no such directory: ${args[0]}` });
            }
            break;
        case 'cat':
            if (!args[0]) {
                newOutput.push({ type: 'error', content: 'Usage: cat [filename]' });
            } else if (fileContents[args[0]]) {
                newOutput.push({ type: 'info', content: fileContents[args[0]] });
            } else {
                newOutput.push({ type: 'error', content: `cat: ${args[0]}: No such file` });
            }
            break;
        case 'open':
        case './evolution_ai.exe':
        case './pathfinder.exe':
        case './sorter.exe':
        case './neural_net.exe':
            let target = args[0] || cmd; 
            if (target.includes('evolution')) {
                newOutput.push({ type: 'success', content: 'Launching Evolutionary AI...' });
                setTimeout(() => navigate('/genetic'), 800);
            } else if (target.includes('pathfinder')) {
                newOutput.push({ type: 'success', content: 'Launching Pathfinding Visualizer...' });
                setTimeout(() => navigate('/algorithms'), 800);
            } else if (target.includes('sorter')) {
                newOutput.push({ type: 'success', content: 'Launching Sorting Visualizer...' });
                setTimeout(() => navigate('/sorting'), 800);
            } else if (target.includes('neural')) {
                newOutput.push({ type: 'success', content: 'Launching Neural Network...' });
                setTimeout(() => navigate('/ml'), 800);
            } else if (target === 'resume.pdf') {
                 newOutput.push({ type: 'info', content: 'Opening PDF...' });
                 window.open('/resume.pdf', '_blank');
            } else {
                newOutput.push({ type: 'error', content: `Cannot open ${target}` });
            }
            break;
        default:
            newOutput.push({ type: 'error', content: `zsh: command not found: ${cmd}` });
    }
    setOutput(newOutput);
    setInput('');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4 pt-20" onClick={() => inputRef.current?.focus()}>
      
      {/* Window Header */}
      <div className="w-full max-w-4xl bg-[#1e1e1e] rounded-t-xl border border-zinc-800 flex items-center justify-between px-4 py-2">
         <div className="flex gap-2">
            <div onClick={() => navigate('/')} className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 cursor-pointer flex items-center justify-center group">
                <X size={8} className="text-black opacity-0 group-hover:opacity-100"/>
            </div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
         </div>
         <div className="text-xs text-zinc-400 font-mono flex items-center gap-2">
            <Terminal size={12} /> gwiandt@wpi — zsh
         </div>
         <div className="w-10"></div>
      </div>

      {/* Terminal Body */}
      <div className="w-full max-w-4xl h-[70vh] bg-[#0c0c0c]/95 backdrop-blur-md border-x border-b border-zinc-800 rounded-b-xl p-4 overflow-y-auto font-mono text-xs sm:text-sm shadow-2xl custom-scrollbar">
         
         {output.map((line, i) => (
             <div key={i} className="mb-1">
                 {line.type === 'command' && (
                     <div className="text-zinc-100 font-bold mt-4">
                         <span className="text-green-500">➜</span> <span className="text-blue-400">{line.path}</span> {line.content}
                     </div>
                 )}
                 {line.type === 'system' && <div className="text-zinc-500">{line.content}</div>}
                 {line.type === 'info' && <div className="text-zinc-300 whitespace-pre-wrap">{line.content}</div>}
                 {line.type === 'success' && <div className="text-green-400">{line.content}</div>}
                 {line.type === 'error' && <div className="text-red-400">{line.content}</div>}
                 {line.type === 'br' && <br/>}
                 
                 {line.type === 'ls' && (
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-1">
                         {line.content.map((f, idx) => (
                             <span key={idx} className={`${f.type === 'dir' ? 'text-blue-500 font-bold' : f.type === 'exec' ? 'text-green-500 font-bold' : 'text-zinc-300'}`}>
                                 {f.name}{f.type === 'dir' ? '/' : f.type === 'exec' ? '*' : ''}
                             </span>
                         ))}
                     </div>
                 )}
             </div>
         ))}

         {/* Input Line */}
         <div className="flex items-center text-zinc-100 mt-2">
             <span className="text-green-500 mr-2">➜</span>
             <span className="text-blue-400 mr-2">{currentPath}</span>
             <input 
                 ref={inputRef}
                 type="text" 
                 value={input}
                 onChange={(e) => setInput(e.target.value)}
                 onKeyDown={handleKeyDown}
                 className="flex-1 bg-transparent outline-none border-none text-zinc-100 font-mono placeholder-zinc-700"
                 autoFocus
                 spellCheck="false"
                 autoComplete="off"
             />
         </div>
         <div ref={bottomRef} />
      </div>

      <div className="mt-6 text-zinc-500 text-xs font-mono text-center">
         Try: <span className="text-zinc-300 bg-zinc-800 px-1 rounded">ls</span> to view files, <span className="text-zinc-300 bg-zinc-800 px-1 rounded">cd projects</span> to navigate, or <span className="text-zinc-300 bg-zinc-800 px-1 rounded">./evolution_ai.exe</span> to launch projects.
      </div>

    </div>
  );
};

export default Shell;