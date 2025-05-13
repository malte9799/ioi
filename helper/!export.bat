@echo off
node !files.js
cd ..
IF EXIST "ioi.zip" (
  del "ioi.zip"
)
"C:\Program Files\7-Zip\7z.exe" a -tzip ioi.zip @helper/!files.txt