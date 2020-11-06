nmap <leader>cu :call SendTerminalCommand(0, "cd ~/personal/VimDeathmatch/server/server && npm run test\n")<CR>
nmap <leader>ce :call SendTerminalCommand(0, "cd ~/personal/VimDeathmatch/server/server && npm run test" . expand("%") . "\n")<CR>

