nmap <leader>cu :call SendTerminalCommand(0, "npm run test\n")<CR>
nmap <leader>ce :call SendTerminalCommand(0, "npm run test " . expand("%") . "\n")<CR>
nmap <leader>co :call SendTerminalCommand(0, "rm -rf /tmp/manual-tests && npm run manual-tests\n")<CR>

