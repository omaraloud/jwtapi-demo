#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const logsDir = path.join(__dirname, 'logs');

// Available log files
const logFiles = {
  'combined': path.join(logsDir, 'combined.log'),
  'error': path.join(logsDir, 'error.log'),
  'debug': path.join(logsDir, 'debug.log')
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function colorize(level, message) {
  switch (level) {
    case 'error':
      return `${colors.red}${message}${colors.reset}`;
    case 'warn':
      return `${colors.yellow}${message}${colors.reset}`;
    case 'info':
      return `${colors.green}${message}${colors.reset}`;
    case 'debug':
      return `${colors.blue}${message}${colors.reset}`;
    default:
      return message;
  }
}

function formatLogEntry(entry) {
  try {
    const log = JSON.parse(entry);
    const timestamp = log.timestamp || 'Unknown';
    const level = log.level || 'info';
    const message = log.message || 'No message';
    
    let formatted = `${colors.cyan}${timestamp}${colors.reset} [${colorize(level, level.toUpperCase())}] ${message}`;
    
    // Add additional context if available
    if (log.username) formatted += ` ${colors.magenta}(User: ${log.username})${colors.reset}`;
    if (log.ip) formatted += ` ${colors.yellow}(IP: ${log.ip})${colors.reset}`;
    if (log.method && log.url) formatted += ` ${colors.blue}${log.method} ${log.url}${colors.reset}`;
    if (log.statusCode) formatted += ` ${colors.magenta}(${log.statusCode})${colors.reset}`;
    
    return formatted;
  } catch (error) {
    return entry; // Return raw entry if not JSON
  }
}

function showLogFile(filename, lines = 50, filter = null) {
  const filePath = logFiles[filename];
  
  if (!fs.existsSync(filePath)) {
    console.log(`${colors.red}Log file not found: ${filename}.log${colors.reset}`);
    return;
  }
  
  console.log(`${colors.bright}=== ${filename.toUpperCase()} LOGS ===${colors.reset}`);
  console.log(`File: ${filePath}\n`);
  
  const content = fs.readFileSync(filePath, 'utf8');
  let entries = content.trim().split('\n').filter(line => line.trim());
  
  // Apply filter if provided
  if (filter) {
    entries = entries.filter(entry => 
      entry.toLowerCase().includes(filter.toLowerCase())
    );
  }
  
  // Show last N lines
  const lastEntries = entries.slice(-lines);
  
  if (lastEntries.length === 0) {
    console.log(`${colors.yellow}No log entries found${colors.reset}`);
    return;
  }
  
  lastEntries.forEach(entry => {
    console.log(formatLogEntry(entry));
  });
  
  console.log(`\n${colors.cyan}Showing ${lastEntries.length} of ${entries.length} entries${colors.reset}`);
}

function showLogStats() {
  console.log(`${colors.bright}=== LOG STATISTICS ===${colors.reset}\n`);
  
  Object.keys(logFiles).forEach(filename => {
    const filePath = logFiles[filename];
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.trim().split('\n').filter(line => line.trim()).length;
      
      console.log(`${colors.cyan}${filename}.log:${colors.reset}`);
      console.log(`  Size: ${(stats.size / 1024).toFixed(2)} KB`);
      console.log(`  Entries: ${lines}`);
      console.log(`  Last modified: ${stats.mtime.toLocaleString()}\n`);
    } else {
      console.log(`${colors.red}${filename}.log: File not found${colors.reset}\n`);
    }
  });
}

function showHelp() {
  console.log(`${colors.bright}JWT Auth API - Log Viewer${colors.reset}\n`);
  console.log('Usage: node view-logs.js [command] [options]\n');
  console.log('Commands:');
  console.log('  combined [lines] [filter]  - Show combined logs (default: 50 lines)');
  console.log('  error [lines] [filter]     - Show error logs');
  console.log('  debug [lines] [filter]     - Show debug logs');
  console.log('  stats                      - Show log statistics');
  console.log('  help                       - Show this help message\n');
  console.log('Examples:');
  console.log('  node view-logs.js combined 20');
  console.log('  node view-logs.js error 10 "authentication"');
  console.log('  node view-logs.js debug 30 "admin"');
  console.log('  node view-logs.js stats\n');
  console.log('Filters:');
  console.log('  You can filter logs by any text (case-insensitive)');
  console.log('  Common filters: "login", "error", "admin", "192.168", "POST"');
}

function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'help';
  
  switch (command) {
    case 'combined':
    case 'error':
    case 'debug':
      const lines = parseInt(args[1]) || 50;
      const filter = args[2] || null;
      showLogFile(command, lines, filter);
      break;
      
    case 'stats':
      showLogStats();
      break;
      
    case 'help':
    default:
      showHelp();
      break;
  }
}

// Run the script
main(); 