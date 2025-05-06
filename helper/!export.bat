@echo off
node !files.js
IF EXIST "ioi.zip" (
  del "ioi.zip"
)
"C:\Program Files\7-Zip\7z.exe" a -tzip ioi.zip @!files.txt