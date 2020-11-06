nmap <leader>cu :call SendTerminalCommand(0, "npm run test\n")<CR>
nmap <leader>ce :call SendTerminalCommand(0, "npm run test" . expand("%") . "\n")<CR>

